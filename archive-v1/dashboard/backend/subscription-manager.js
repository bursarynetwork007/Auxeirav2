const express = require('express');
const crypto = require('crypto');
const { Pool } = require('pg');
const router = express.Router();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// Subscription Status Constants
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  GRACE: 'grace',
  FROZEN: 'frozen'
};

// Subscription Tiers
const SUBSCRIPTION_TIERS = {
  founder: { price: { monthly: 0, annual: 0 }, trialDays: 0 },
  startup: { price: { monthly: 149, annual: 119 }, trialDays: 30 },
  growth: { price: { monthly: 499, annual: 399 }, trialDays: 30 },
  scale: { price: { monthly: 999, annual: 799 }, trialDays: 30 }
};

// Subscription Management Class
class SubscriptionManager {
  
  // Initialize user subscription on signup
  static async initializeSubscription(userId, tier = 'startup') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Set trial period for non-founder tiers
      const trialDays = SUBSCRIPTION_TIERS[tier].trialDays;
      const trialEndsAt = trialDays > 0 ? new Date(Date.now() + trialDays * 24 * 60 * 60 * 1000) : null;
      const status = tier === 'founder' ? SUBSCRIPTION_STATUS.ACTIVE : SUBSCRIPTION_STATUS.TRIAL;
      
      // Update user subscription
      await client.query(`
        UPDATE users 
        SET subscription_tier = $1,
            subscription_status = $2,
            trial_ends_at = $3,
            updated_at = NOW()
        WHERE user_id = $4
      `, [tier, status, trialEndsAt, userId]);
      
      // Log subscription initialization
      await client.query(`
        INSERT INTO subscription_changes (user_id, to_tier, reason, automatic)
        VALUES ($1, $2, 'Account created', TRUE)
      `, [userId, tier]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        status,
        tier,
        trialEndsAt
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Check and update trial status
  static async checkTrialStatus(userId) {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        SELECT subscription_status, subscription_tier, trial_ends_at, next_billing_date
        FROM users 
        WHERE user_id = $1
      `, [userId]);
      
      if (result.rows.length === 0) {
        throw new Error('User not found');
      }
      
      const user = result.rows[0];
      const now = new Date();
      
      // Check if trial has expired
      if (user.subscription_status === SUBSCRIPTION_STATUS.TRIAL && 
          user.trial_ends_at && 
          now > new Date(user.trial_ends_at)) {
        
        // Trial expired - trigger first payment
        await this.triggerFirstPayment(userId, user.subscription_tier);
        
        return {
          status: 'trial_expired',
          action: 'payment_triggered'
        };
      }
      
      return {
        status: user.subscription_status,
        tier: user.subscription_tier,
        trialEndsAt: user.trial_ends_at,
        nextBillingDate: user.next_billing_date
      };
      
    } finally {
      client.release();
    }
  }
  
  // Trigger first payment at end of trial
  static async triggerFirstPayment(userId, tier) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Get user details
      const userResult = await client.query(`
        SELECT email, billing_cycle FROM users WHERE user_id = $1
      `, [userId]);
      
      const user = userResult.rows[0];
      const billingCycle = user.billing_cycle || 'monthly';
      const amount = SUBSCRIPTION_TIERS[tier].price[billingCycle];
      
      if (amount === 0) {
        // Free tier - activate immediately
        await this.activateSubscription(userId, tier, billingCycle);
        await client.query('COMMIT');
        return { success: true, message: 'Free tier activated' };
      }
      
      // Create Paystack subscription
      const subscriptionData = await this.createPaystackSubscription(
        user.email, 
        tier, 
        billingCycle, 
        amount
      );
      
      // Update user with subscription details
      await client.query(`
        UPDATE users 
        SET paystack_subscription_code = $1,
            subscription_status = $2,
            updated_at = NOW()
        WHERE user_id = $3
      `, [subscriptionData.subscription_code, SUBSCRIPTION_STATUS.GRACE, userId]);
      
      // Log payment trigger
      await client.query(`
        INSERT INTO subscription_changes (user_id, from_tier, to_tier, reason, automatic)
        VALUES ($1, $2, $3, 'Trial ended - first payment triggered', TRUE)
      `, [userId, tier, tier]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        subscriptionCode: subscriptionData.subscription_code,
        message: 'First payment triggered'
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Create Paystack subscription
  static async createPaystackSubscription(email, tier, billingCycle, amount) {
    // First create a plan
    const planResponse = await fetch('https://api.paystack.co/plan', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: `Auxeira ${tier} ${billingCycle}`,
        amount: amount * 100, // Convert to kobo
        interval: billingCycle === 'annual' ? 'annually' : 'monthly',
        currency: 'USD'
      })
    });
    
    const planData = await planResponse.json();
    
    if (!planData.status) {
      throw new Error(`Plan creation failed: ${planData.message}`);
    }
    
    // Create subscription
    const subscriptionResponse = await fetch('https://api.paystack.co/subscription', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        customer: email,
        plan: planData.data.plan_code,
        start_date: new Date().toISOString()
      })
    });
    
    const subscriptionData = await subscriptionResponse.json();
    
    if (!subscriptionData.status) {
      throw new Error(`Subscription creation failed: ${subscriptionData.message}`);
    }
    
    return subscriptionData.data;
  }
  
  // Activate subscription (successful payment)
  static async activateSubscription(userId, tier, billingCycle, paystackData = null) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Calculate next billing date
      const nextBillingDate = new Date();
      if (billingCycle === 'annual') {
        nextBillingDate.setFullYear(nextBillingDate.getFullYear() + 1);
      } else {
        nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);
      }
      
      // Update user subscription
      const updateQuery = `
        UPDATE users 
        SET subscription_status = $1,
            subscription_tier = $2,
            billing_cycle = $3,
            next_billing_date = $4,
            trial_ends_at = NULL,
            grace_period_ends_at = NULL,
            payment_failed = FALSE,
            updated_at = NOW()
        WHERE user_id = $5
      `;
      
      await client.query(updateQuery, [
        SUBSCRIPTION_STATUS.ACTIVE,
        tier,
        billingCycle,
        nextBillingDate,
        userId
      ]);
      
      // Update Paystack details if provided
      if (paystackData) {
        await client.query(`
          UPDATE users 
          SET paystack_customer_id = $1,
              paystack_subscription_code = $2
          WHERE user_id = $3
        `, [paystackData.customer.id, paystackData.subscription_code, userId]);
      }
      
      // Log successful activation
      await client.query(`
        INSERT INTO subscription_changes (user_id, to_tier, reason)
        VALUES ($1, $2, 'Payment successful - subscription activated')
      `, [userId, tier]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        status: SUBSCRIPTION_STATUS.ACTIVE,
        nextBillingDate
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Freeze subscription (payment failed)
  static async freezeSubscription(userId, reason = 'Payment failed') {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      // Update user status
      await client.query(`
        UPDATE users 
        SET subscription_status = $1,
            payment_failed = TRUE,
            updated_at = NOW()
        WHERE user_id = $2
      `, [SUBSCRIPTION_STATUS.FROZEN, userId]);
      
      // Log freeze
      await client.query(`
        INSERT INTO subscription_changes (user_id, to_tier, reason, automatic)
        VALUES ($1, (SELECT subscription_tier FROM users WHERE user_id = $1), $2, TRUE)
      `, [userId, reason]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        status: SUBSCRIPTION_STATUS.FROZEN
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Start grace period
  static async startGracePeriod(userId, days = 7) {
    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const gracePeriodEndsAt = new Date();
      gracePeriodEndsAt.setDate(gracePeriodEndsAt.getDate() + days);
      
      await client.query(`
        UPDATE users 
        SET subscription_status = $1,
            grace_period_ends_at = $2,
            updated_at = NOW()
        WHERE user_id = $3
      `, [SUBSCRIPTION_STATUS.GRACE, gracePeriodEndsAt, userId]);
      
      // Log grace period start
      await client.query(`
        INSERT INTO subscription_changes (user_id, to_tier, reason, automatic)
        VALUES ($1, (SELECT subscription_tier FROM users WHERE user_id = $1), 'Grace period started', TRUE)
      `, [userId]);
      
      await client.query('COMMIT');
      
      return {
        success: true,
        status: SUBSCRIPTION_STATUS.GRACE,
        gracePeriodEndsAt
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }
  
  // Get user subscription details
  static async getSubscriptionDetails(userId) {
    const result = await pool.query(`
      SELECT 
        subscription_status,
        subscription_tier,
        billing_cycle,
        trial_ends_at,
        next_billing_date,
        grace_period_ends_at,
        payment_failed,
        paystack_customer_id,
        paystack_subscription_code
      FROM users 
      WHERE user_id = $1
    `, [userId]);
    
    if (result.rows.length === 0) {
      throw new Error('User not found');
    }
    
    const user = result.rows[0];
    const now = new Date();
    
    // Calculate trial days remaining
    let trialDaysRemaining = 0;
    if (user.subscription_status === SUBSCRIPTION_STATUS.TRIAL && user.trial_ends_at) {
      const diffTime = new Date(user.trial_ends_at) - now;
      trialDaysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
    }
    
    return {
      ...user,
      trialDaysRemaining
    };
  }
}

// API Routes

// Get subscription status
router.get('/status', async (req, res) => {
  try {
    const userId = req.user.id; // From JWT middleware
    const details = await SubscriptionManager.getSubscriptionDetails(userId);
    
    res.json({
      success: true,
      subscription: details
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Initialize subscription (called on signup)
router.post('/initialize', async (req, res) => {
  try {
    const userId = req.user.id;
    const { tier = 'startup' } = req.body;
    
    const result = await SubscriptionManager.initializeSubscription(userId, tier);
    
    res.json({
      success: true,
      subscription: result
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Manual payment retry
router.post('/retry-payment', async (req, res) => {
  try {
    const userId = req.user.id;
    const { paymentReference } = req.body;
    
    // Verify payment with Paystack
    const verifyResponse = await fetch(`https://api.paystack.co/transaction/verify/${paymentReference}`, {
      headers: {
        'Authorization': `Bearer ${process.env.PAYSTACK_SECRET_KEY}`
      }
    });
    
    const verifyData = await verifyResponse.json();
    
    if (verifyData.status && verifyData.data.status === 'success') {
      // Get user details
      const userResult = await pool.query(`
        SELECT subscription_tier, billing_cycle FROM users WHERE user_id = $1
      `, [userId]);
      
      const user = userResult.rows[0];
      
      // Activate subscription
      await SubscriptionManager.activateSubscription(
        userId, 
        user.subscription_tier, 
        user.billing_cycle,
        verifyData.data
      );
      
      res.json({
        success: true,
        message: 'Payment successful - subscription reactivated'
      });
      
    } else {
      res.status(400).json({
        success: false,
        error: 'Payment verification failed'
      });
    }
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Paystack Webhooks
router.post('/webhooks/paystack', (req, res) => {
  // Verify webhook signature
  const hash = crypto.createHmac('sha512', process.env.PAYSTACK_WEBHOOK_SECRET)
                   .update(JSON.stringify(req.body))
                   .digest('hex');

  if (hash !== req.headers['x-paystack-signature']) {
    return res.status(400).send('Invalid signature');
  }

  const event = req.body;
  
  // Handle different webhook events
  handleWebhookEvent(event)
    .then(() => res.status(200).send('OK'))
    .catch(error => {
      console.error('Webhook handling failed:', error);
      res.status(500).send('Webhook handling failed');
    });
});

// Webhook event handler
async function handleWebhookEvent(event) {
  const client = await pool.connect();
  
  try {
    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data, client);
        break;
        
      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data, client);
        break;
        
      case 'subscription.create':
        await handleSubscriptionCreate(event.data, client);
        break;
        
      case 'subscription.disable':
        await handleSubscriptionDisable(event.data, client);
        break;
        
      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }
    
  } finally {
    client.release();
  }
}

// Handle successful charge
async function handleChargeSuccess(data, client) {
  await client.query('BEGIN');
  
  try {
    // Find user by customer ID or email
    const userResult = await client.query(`
      SELECT user_id, subscription_tier, billing_cycle 
      FROM users 
      WHERE paystack_customer_id = $1 OR email = $2
    `, [data.customer.id, data.customer.email]);
    
    if (userResult.rows.length > 0) {
      const user = userResult.rows[0];
      
      // Activate subscription
      await SubscriptionManager.activateSubscription(
        user.user_id,
        user.subscription_tier,
        user.billing_cycle,
        data
      );
      
      // Log payment
      await client.query(`
        INSERT INTO payment_history (user_id, paystack_reference, amount, status, tier, billing_cycle, payment_date)
        VALUES ($1, $2, $3, 'success', $4, $5, NOW())
      `, [user.user_id, data.reference, data.amount, user.subscription_tier, user.billing_cycle]);
    }
    
    await client.query('COMMIT');
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

// Handle payment failure
async function handlePaymentFailed(data, client) {
  await client.query('BEGIN');
  
  try {
    // Find user by customer ID
    const userResult = await client.query(`
      SELECT user_id FROM users WHERE paystack_customer_id = $1
    `, [data.customer.id]);
    
    if (userResult.rows.length > 0) {
      const userId = userResult.rows[0].user_id;
      
      // Start grace period first
      await SubscriptionManager.startGracePeriod(userId, 7);
      
      // Log failed payment
      await client.query(`
        INSERT INTO payment_history (user_id, paystack_reference, amount, status, payment_date)
        VALUES ($1, $2, $3, 'failed', NOW())
      `, [userId, data.reference, data.amount]);
    }
    
    await client.query('COMMIT');
    
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  }
}

// Handle subscription creation
async function handleSubscriptionCreate(data, client) {
  await client.query(`
    UPDATE users 
    SET paystack_subscription_code = $1,
        paystack_customer_id = $2
    WHERE email = $3
  `, [data.subscription_code, data.customer.id, data.customer.email]);
}

// Handle subscription disable
async function handleSubscriptionDisable(data, client) {
  const userResult = await client.query(`
    SELECT user_id FROM users WHERE paystack_subscription_code = $1
  `, [data.subscription_code]);
  
  if (userResult.rows.length > 0) {
    const userId = userResult.rows[0].user_id;
    await SubscriptionManager.freezeSubscription(userId, 'Subscription disabled');
  }
}

// Cron job to check expired trials and grace periods
router.post('/cron/check-expirations', async (req, res) => {
  try {
    const now = new Date();
    
    // Check expired trials
    const expiredTrials = await pool.query(`
      SELECT user_id, subscription_tier 
      FROM users 
      WHERE subscription_status = $1 
      AND trial_ends_at < $2
    `, [SUBSCRIPTION_STATUS.TRIAL, now]);
    
    for (const user of expiredTrials.rows) {
      await SubscriptionManager.triggerFirstPayment(user.user_id, user.subscription_tier);
    }
    
    // Check expired grace periods
    const expiredGrace = await pool.query(`
      SELECT user_id 
      FROM users 
      WHERE subscription_status = $1 
      AND grace_period_ends_at < $2
    `, [SUBSCRIPTION_STATUS.GRACE, now]);
    
    for (const user of expiredGrace.rows) {
      await SubscriptionManager.freezeSubscription(user.user_id, 'Grace period expired');
    }
    
    res.json({
      success: true,
      expiredTrials: expiredTrials.rows.length,
      expiredGrace: expiredGrace.rows.length
    });
    
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
