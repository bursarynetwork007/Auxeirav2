-- Subscription Gating Database Schema
-- Clean, sharp subscription management with zero tolerance for non-payment

-- Drop existing tables if they exist (for clean setup)
DROP TABLE IF EXISTS subscription_changes CASCADE;
DROP TABLE IF EXISTS payment_history CASCADE;
DROP TABLE IF EXISTS feature_usage_logs CASCADE;
DROP TABLE IF EXISTS trial_extensions CASCADE;

-- Update users table with subscription fields
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS subscription_tier VARCHAR(20) DEFAULT 'startup',
ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(20) DEFAULT 'trial',
ADD COLUMN IF NOT EXISTS billing_cycle VARCHAR(10) DEFAULT 'monthly',
ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP,
ADD COLUMN IF NOT EXISTS grace_period_ends_at TIMESTAMP,
ADD COLUMN IF NOT EXISTS payment_failed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS paystack_customer_id VARCHAR(100),
ADD COLUMN IF NOT EXISTS paystack_subscription_code VARCHAR(100),
ADD COLUMN IF NOT EXISTS subscription_created_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS last_payment_attempt TIMESTAMP,
ADD COLUMN IF NOT EXISTS failed_payment_count INTEGER DEFAULT 0;

-- Create index for subscription queries
CREATE INDEX IF NOT EXISTS idx_users_subscription_status ON users(subscription_status);
CREATE INDEX IF NOT EXISTS idx_users_trial_ends_at ON users(trial_ends_at);
CREATE INDEX IF NOT EXISTS idx_users_grace_period_ends_at ON users(grace_period_ends_at);
CREATE INDEX IF NOT EXISTS idx_users_paystack_customer_id ON users(paystack_customer_id);

-- Payment history table - track every transaction
CREATE TABLE payment_history (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  paystack_reference VARCHAR(100) UNIQUE NOT NULL,
  paystack_transaction_id VARCHAR(100),
  amount INTEGER NOT NULL, -- Amount in cents/kobo
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(20) NOT NULL, -- success, failed, pending, canceled
  tier VARCHAR(20) NOT NULL,
  billing_cycle VARCHAR(10) NOT NULL,
  payment_method VARCHAR(50), -- card, bank_transfer, etc.
  gateway_response JSONB, -- Full Paystack response
  failure_reason TEXT,
  payment_date TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for payment history
CREATE INDEX idx_payment_history_user_id ON payment_history(user_id);
CREATE INDEX idx_payment_history_status ON payment_history(status);
CREATE INDEX idx_payment_history_reference ON payment_history(paystack_reference);
CREATE INDEX idx_payment_history_date ON payment_history(payment_date);

-- Subscription changes log - track all tier changes and reasons
CREATE TABLE subscription_changes (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  from_tier VARCHAR(20),
  to_tier VARCHAR(20),
  from_status VARCHAR(20),
  to_status VARCHAR(20),
  reason TEXT NOT NULL,
  automatic BOOLEAN DEFAULT FALSE, -- TRUE for system-triggered changes
  triggered_by UUID REFERENCES users(user_id), -- Admin who made manual change
  metadata JSONB, -- Additional context (payment_id, webhook_event, etc.)
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for subscription changes
CREATE INDEX idx_subscription_changes_user_id ON subscription_changes(user_id);
CREATE INDEX idx_subscription_changes_created_at ON subscription_changes(created_at);
CREATE INDEX idx_subscription_changes_automatic ON subscription_changes(automatic);

-- Feature usage logs - track premium feature access attempts
CREATE TABLE feature_usage_logs (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  feature_name VARCHAR(50) NOT NULL, -- exports, crypto_vesting, partner_intros, premium_analytics
  access_granted BOOLEAN NOT NULL,
  subscription_status VARCHAR(20) NOT NULL,
  subscription_tier VARCHAR(20) NOT NULL,
  ip_address INET,
  user_agent TEXT,
  metadata JSONB, -- Feature-specific data
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for feature usage
CREATE INDEX idx_feature_usage_user_id ON feature_usage_logs(user_id);
CREATE INDEX idx_feature_usage_feature_name ON feature_usage_logs(feature_name);
CREATE INDEX idx_feature_usage_access_granted ON feature_usage_logs(access_granted);
CREATE INDEX idx_feature_usage_created_at ON feature_usage_logs(created_at);

-- Trial extensions table - track any trial extensions (should be rare)
CREATE TABLE trial_extensions (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id) ON DELETE CASCADE,
  original_trial_end TIMESTAMP NOT NULL,
  new_trial_end TIMESTAMP NOT NULL,
  extension_days INTEGER NOT NULL,
  reason TEXT NOT NULL,
  approved_by UUID REFERENCES users(user_id), -- Admin who approved
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create index for trial extensions
CREATE INDEX idx_trial_extensions_user_id ON trial_extensions(user_id);

-- Subscription tier configuration table
CREATE TABLE subscription_tiers (
  tier_name VARCHAR(20) PRIMARY KEY,
  display_name VARCHAR(50) NOT NULL,
  monthly_price INTEGER NOT NULL, -- Price in cents
  annual_price INTEGER NOT NULL, -- Price in cents
  trial_days INTEGER DEFAULT 0,
  features JSONB NOT NULL, -- Feature flags and limits
  max_team_size INTEGER,
  max_mrr INTEGER,
  max_raised BIGINT,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Insert default subscription tiers
INSERT INTO subscription_tiers (tier_name, display_name, monthly_price, annual_price, trial_days, features, max_team_size, max_mrr, max_raised) VALUES
('founder', 'Founder', 0, 0, 0, '{"exports": false, "crypto_vesting": false, "partner_intros": false, "premium_analytics": false, "ai_mentor": "basic"}', 5, 5000, 10000),
('startup', 'Startup', 14900, 11900, 30, '{"exports": true, "crypto_vesting": false, "partner_intros": true, "premium_analytics": true, "ai_mentor": "advanced"}', 15, 25000, 500000),
('growth', 'Growth', 49900, 39900, 30, '{"exports": true, "crypto_vesting": true, "partner_intros": true, "premium_analytics": true, "ai_mentor": "advanced"}', 50, 100000, 5000000),
('scale', 'Scale', 99900, 79900, 30, '{"exports": true, "crypto_vesting": true, "partner_intros": true, "premium_analytics": true, "ai_mentor": "enterprise"}', 999, 999999999, 999999999);

-- Webhook events log - track all Paystack webhook events
CREATE TABLE webhook_events (
  id SERIAL PRIMARY KEY,
  event_type VARCHAR(50) NOT NULL,
  paystack_event_id VARCHAR(100) UNIQUE,
  payload JSONB NOT NULL,
  processed BOOLEAN DEFAULT FALSE,
  processing_error TEXT,
  user_id UUID REFERENCES users(user_id),
  created_at TIMESTAMP DEFAULT NOW(),
  processed_at TIMESTAMP
);

-- Create indexes for webhook events
CREATE INDEX idx_webhook_events_event_type ON webhook_events(event_type);
CREATE INDEX idx_webhook_events_processed ON webhook_events(processed);
CREATE INDEX idx_webhook_events_user_id ON webhook_events(user_id);
CREATE INDEX idx_webhook_events_created_at ON webhook_events(created_at);

-- Functions for subscription management

-- Function to check if user has feature access
CREATE OR REPLACE FUNCTION has_feature_access(
  p_user_id UUID,
  p_feature_name VARCHAR(50)
) RETURNS BOOLEAN AS $$
DECLARE
  user_record RECORD;
  tier_features JSONB;
BEGIN
  -- Get user subscription details
  SELECT subscription_status, subscription_tier 
  INTO user_record
  FROM users 
  WHERE user_id = p_user_id;
  
  -- If user not found, deny access
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- If account is frozen, only allow basic features
  IF user_record.subscription_status = 'frozen' THEN
    RETURN p_feature_name IN ('ai_mentor');
  END IF;
  
  -- If active subscription, check tier features
  IF user_record.subscription_status = 'active' THEN
    SELECT features INTO tier_features
    FROM subscription_tiers
    WHERE tier_name = user_record.subscription_tier;
    
    -- Return feature access based on tier
    RETURN COALESCE((tier_features->p_feature_name)::BOOLEAN, FALSE);
  END IF;
  
  -- For trial status, only basic features
  IF user_record.subscription_status = 'trial' THEN
    RETURN p_feature_name IN ('ai_mentor');
  END IF;
  
  -- Default deny
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Function to log feature usage
CREATE OR REPLACE FUNCTION log_feature_usage(
  p_user_id UUID,
  p_feature_name VARCHAR(50),
  p_ip_address INET DEFAULT NULL,
  p_user_agent TEXT DEFAULT NULL,
  p_metadata JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  access_granted BOOLEAN;
  user_record RECORD;
BEGIN
  -- Check if user has access
  SELECT has_feature_access(p_user_id, p_feature_name) INTO access_granted;
  
  -- Get user subscription details for logging
  SELECT subscription_status, subscription_tier 
  INTO user_record
  FROM users 
  WHERE user_id = p_user_id;
  
  -- Log the usage attempt
  INSERT INTO feature_usage_logs (
    user_id, 
    feature_name, 
    access_granted, 
    subscription_status, 
    subscription_tier,
    ip_address,
    user_agent,
    metadata
  ) VALUES (
    p_user_id, 
    p_feature_name, 
    access_granted, 
    user_record.subscription_status, 
    user_record.subscription_tier,
    p_ip_address,
    p_user_agent,
    p_metadata
  );
  
  RETURN access_granted;
END;
$$ LANGUAGE plpgsql;

-- Function to update subscription status
CREATE OR REPLACE FUNCTION update_subscription_status(
  p_user_id UUID,
  p_new_status VARCHAR(20),
  p_reason TEXT,
  p_automatic BOOLEAN DEFAULT TRUE,
  p_metadata JSONB DEFAULT NULL
) RETURNS BOOLEAN AS $$
DECLARE
  old_status VARCHAR(20);
  old_tier VARCHAR(20);
BEGIN
  -- Get current status
  SELECT subscription_status, subscription_tier 
  INTO old_status, old_tier
  FROM users 
  WHERE user_id = p_user_id;
  
  -- Update user status
  UPDATE users 
  SET subscription_status = p_new_status,
      updated_at = NOW()
  WHERE user_id = p_user_id;
  
  -- Log the change
  INSERT INTO subscription_changes (
    user_id, 
    from_status, 
    to_status, 
    from_tier, 
    to_tier, 
    reason, 
    automatic, 
    metadata
  ) VALUES (
    p_user_id, 
    old_status, 
    p_new_status, 
    old_tier, 
    old_tier, 
    p_reason, 
    p_automatic, 
    p_metadata
  );
  
  RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- Function to get users with expired trials (for cron job)
CREATE OR REPLACE FUNCTION get_expired_trials()
RETURNS TABLE(user_id UUID, email VARCHAR, subscription_tier VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT u.user_id, u.email, u.subscription_tier
  FROM users u
  WHERE u.subscription_status = 'trial'
    AND u.trial_ends_at < NOW()
    AND u.subscription_tier != 'founder'; -- Founder tier doesn't have trials
END;
$$ LANGUAGE plpgsql;

-- Function to get users with expired grace periods (for cron job)
CREATE OR REPLACE FUNCTION get_expired_grace_periods()
RETURNS TABLE(user_id UUID, email VARCHAR, subscription_tier VARCHAR) AS $$
BEGIN
  RETURN QUERY
  SELECT u.user_id, u.email, u.subscription_tier
  FROM users u
  WHERE u.subscription_status = 'grace'
    AND u.grace_period_ends_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to relevant tables
CREATE TRIGGER update_users_updated_at 
  BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payment_history_updated_at 
  BEFORE UPDATE ON payment_history 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscription_tiers_updated_at 
  BEFORE UPDATE ON subscription_tiers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Views for analytics and monitoring

-- Active subscriptions summary
CREATE OR REPLACE VIEW active_subscriptions_summary AS
SELECT 
  subscription_tier,
  subscription_status,
  billing_cycle,
  COUNT(*) as user_count,
  SUM(CASE 
    WHEN billing_cycle = 'monthly' THEN st.monthly_price 
    ELSE st.annual_price 
  END) as total_revenue_cents
FROM users u
JOIN subscription_tiers st ON u.subscription_tier = st.tier_name
WHERE u.subscription_status IN ('active', 'trial', 'grace')
GROUP BY subscription_tier, subscription_status, billing_cycle, st.monthly_price, st.annual_price;

-- Payment failure analysis
CREATE OR REPLACE VIEW payment_failure_analysis AS
SELECT 
  DATE_TRUNC('day', created_at) as failure_date,
  tier,
  COUNT(*) as failure_count,
  SUM(amount) as lost_revenue_cents,
  COUNT(DISTINCT user_id) as affected_users
FROM payment_history
WHERE status = 'failed'
  AND created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), tier
ORDER BY failure_date DESC;

-- Feature usage analytics
CREATE OR REPLACE VIEW feature_usage_analytics AS
SELECT 
  feature_name,
  subscription_tier,
  subscription_status,
  access_granted,
  COUNT(*) as usage_count,
  COUNT(DISTINCT user_id) as unique_users,
  DATE_TRUNC('day', created_at) as usage_date
FROM feature_usage_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
GROUP BY feature_name, subscription_tier, subscription_status, access_granted, DATE_TRUNC('day', created_at)
ORDER BY usage_date DESC, usage_count DESC;

-- Trial conversion tracking
CREATE OR REPLACE VIEW trial_conversion_tracking AS
SELECT 
  DATE_TRUNC('week', u.subscription_created_at) as cohort_week,
  COUNT(*) as trial_starts,
  COUNT(CASE WHEN u.subscription_status = 'active' THEN 1 END) as conversions,
  ROUND(
    COUNT(CASE WHEN u.subscription_status = 'active' THEN 1 END)::NUMERIC / 
    COUNT(*)::NUMERIC * 100, 2
  ) as conversion_rate_percent
FROM users u
WHERE u.subscription_created_at >= NOW() - INTERVAL '12 weeks'
  AND u.subscription_tier != 'founder'
GROUP BY DATE_TRUNC('week', u.subscription_created_at)
ORDER BY cohort_week DESC;

-- Comments for documentation
COMMENT ON TABLE payment_history IS 'Complete audit trail of all payment transactions with Paystack integration';
COMMENT ON TABLE subscription_changes IS 'Log of all subscription tier and status changes with reasons';
COMMENT ON TABLE feature_usage_logs IS 'Track premium feature access attempts for analytics and abuse prevention';
COMMENT ON TABLE trial_extensions IS 'Rare manual trial extensions - should be minimal for business integrity';
COMMENT ON TABLE webhook_events IS 'All Paystack webhook events for debugging and audit purposes';

COMMENT ON FUNCTION has_feature_access IS 'Core function to check if user can access premium features based on subscription status';
COMMENT ON FUNCTION log_feature_usage IS 'Log every premium feature access attempt for analytics and compliance';
COMMENT ON FUNCTION update_subscription_status IS 'Safely update subscription status with automatic change logging';

-- Grant permissions (adjust based on your user roles)
-- GRANT SELECT, INSERT, UPDATE ON ALL TABLES IN SCHEMA public TO app_user;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO app_user;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO app_user;
