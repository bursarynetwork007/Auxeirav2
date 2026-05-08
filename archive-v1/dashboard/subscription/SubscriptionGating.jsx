import { useState, useEffect, createContext, useContext } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Lock, 
  Unlock, 
  CreditCard, 
  AlertTriangle, 
  Clock, 
  Zap,
  Crown,
  Shield,
  Eye,
  EyeOff,
  Play,
  Pause,
  RefreshCw,
  CheckCircle,
  XCircle,
  Timer,
  Sparkles,
  Gem,
  Star,
  Wallet,
  Download,
  ExternalLink,
  BarChart3,
  TrendingUp,
  Users,
  DollarSign,
  Package,
  X
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'

// Subscription Status Types
const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial', 
  GRACE: 'grace',
  FROZEN: 'frozen'
}

// Feature Access Levels
const FEATURE_ACCESS = {
  FREE: 'free',
  PREMIUM: 'premium',
  LOCKED: 'locked'
}

// Subscription Context
const SubscriptionContext = createContext()

export const useSubscription = () => {
  const context = useContext(SubscriptionContext)
  if (!context) {
    throw new Error('useSubscription must be used within SubscriptionProvider')
  }
  return context
}

// Subscription Provider Component
export const SubscriptionProvider = ({ children }) => {
  const [subscriptionState, setSubscriptionState] = useState({
    status: SUBSCRIPTION_STATUS.TRIAL, // active, trial, grace, frozen
    tier: 'startup', // founder, startup, growth, scale
    trialEndsAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    billingCycle: 'monthly',
    nextBillingDate: null,
    paymentFailed: false,
    gracePeriodEndsAt: null,
    isProcessingPayment: false,
    features: {
      exports: FEATURE_ACCESS.LOCKED,
      cryptoVesting: FEATURE_ACCESS.LOCKED,
      partnerIntros: FEATURE_ACCESS.LOCKED,
      premiumAnalytics: FEATURE_ACCESS.LOCKED,
      aiMentor: FEATURE_ACCESS.FREE,
      basicDashboard: FEATURE_ACCESS.FREE
    }
  })

  // Calculate trial days remaining
  const getTrialDaysRemaining = () => {
    if (subscriptionState.status !== SUBSCRIPTION_STATUS.TRIAL) return 0
    const now = new Date()
    const trialEnd = new Date(subscriptionState.trialEndsAt)
    const diffTime = trialEnd - now
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return Math.max(0, diffDays)
  }

  // Check if feature is accessible
  const hasFeatureAccess = (feature) => {
    if (subscriptionState.status === SUBSCRIPTION_STATUS.FROZEN) {
      return subscriptionState.features[feature] === FEATURE_ACCESS.FREE
    }
    
    if (subscriptionState.status === SUBSCRIPTION_STATUS.ACTIVE) {
      return true // All features unlocked for active subscribers
    }

    return subscriptionState.features[feature] === FEATURE_ACCESS.FREE
  }

  // Update subscription status
  const updateSubscriptionStatus = (newStatus, additionalData = {}) => {
    setSubscriptionState(prev => ({
      ...prev,
      status: newStatus,
      ...additionalData
    }))
  }

  // Activate subscription (successful payment)
  const activateSubscription = () => {
    const nextBilling = new Date()
    nextBilling.setMonth(nextBilling.getMonth() + (subscriptionState.billingCycle === 'annual' ? 12 : 1))
    
    updateSubscriptionStatus(SUBSCRIPTION_STATUS.ACTIVE, {
      nextBillingDate: nextBilling,
      paymentFailed: false,
      gracePeriodEndsAt: null,
      features: {
        exports: FEATURE_ACCESS.FREE,
        cryptoVesting: FEATURE_ACCESS.FREE,
        partnerIntros: FEATURE_ACCESS.FREE,
        premiumAnalytics: FEATURE_ACCESS.FREE,
        aiMentor: FEATURE_ACCESS.FREE,
        basicDashboard: FEATURE_ACCESS.FREE
      }
    })
  }

  // Freeze subscription (payment failed)
  const freezeSubscription = () => {
    updateSubscriptionStatus(SUBSCRIPTION_STATUS.FROZEN, {
      paymentFailed: true,
      features: {
        exports: FEATURE_ACCESS.LOCKED,
        cryptoVesting: FEATURE_ACCESS.LOCKED,
        partnerIntros: FEATURE_ACCESS.LOCKED,
        premiumAnalytics: FEATURE_ACCESS.LOCKED,
        aiMentor: FEATURE_ACCESS.FREE,
        basicDashboard: FEATURE_ACCESS.FREE
      }
    })
  }

  // Start grace period
  const startGracePeriod = () => {
    const graceEnd = new Date()
    graceEnd.setDate(graceEnd.getDate() + 7) // 7-day grace period
    
    updateSubscriptionStatus(SUBSCRIPTION_STATUS.GRACE, {
      gracePeriodEndsAt: graceEnd
    })
  }

  const value = {
    subscriptionState,
    hasFeatureAccess,
    getTrialDaysRemaining,
    updateSubscriptionStatus,
    activateSubscription,
    freezeSubscription,
    startGracePeriod
  }

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  )
}

// Subscription Status Banner Component
export const SubscriptionStatusBanner = () => {
  const { subscriptionState, getTrialDaysRemaining } = useSubscription()
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  const renderBannerContent = () => {
    switch (subscriptionState.status) {
      case SUBSCRIPTION_STATUS.TRIAL:
        const daysLeft = getTrialDaysRemaining()
        return (
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Timer className="w-5 h-5 animate-pulse" />
                <div>
                  <strong>Free Trial Active</strong>
                  <span className="ml-2">{daysLeft} days remaining • Upgrade to unlock all features</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-white text-blue-600 hover:bg-gray-100">
                  <Crown className="w-4 h-4 mr-1" />
                  Upgrade Now
                </Button>
                <Button 
                  size="sm" 
                  variant="ghost"
                  onClick={() => setIsVisible(false)}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        )

      case SUBSCRIPTION_STATUS.GRACE:
        return (
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 animate-pulse" />
                <div>
                  <strong>Payment Issue</strong>
                  <span className="ml-2">Grace period active • Update payment method to continue</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                  <CreditCard className="w-4 h-4 mr-1" />
                  Update Payment
                </Button>
              </div>
            </div>
          </div>
        )

      case SUBSCRIPTION_STATUS.FROZEN:
        return (
          <div className="bg-gradient-to-r from-red-600 to-pink-600 text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Pause className="w-5 h-5" />
                <div>
                  <strong>Account Paused</strong>
                  <span className="ml-2">Pay to resume • All premium features locked</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" className="bg-white text-red-600 hover:bg-gray-100">
                  <Play className="w-4 h-4 mr-1" />
                  Pay to Resume
                </Button>
              </div>
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-50 shadow-lg"
    >
      {renderBannerContent()}
    </motion.div>
  )
}

// Feature Lock Overlay Component
export const FeatureLockOverlay = ({ 
  feature, 
  title = "Premium Feature", 
  description = "Upgrade to unlock this feature",
  children 
}) => {
  const { hasFeatureAccess, subscriptionState } = useSubscription()
  const [showUpgrade, setShowUpgrade] = useState(false)
  
  const isLocked = !hasFeatureAccess(feature)

  if (!isLocked) {
    return children
  }

  const getOverlayContent = () => {
    if (subscriptionState.status === SUBSCRIPTION_STATUS.FROZEN) {
      return {
        icon: <Pause className="w-8 h-8 text-red-400" />,
        title: "Account Paused",
        description: "Reactivate your subscription to access this feature",
        buttonText: "Pay to Resume",
        buttonColor: "bg-red-600 hover:bg-red-700"
      }
    }

    return {
      icon: <Lock className="w-8 h-8 text-yellow-400" />,
      title: title,
      description: description,
      buttonText: "Upgrade to Unlock",
      buttonColor: "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
    }
  }

  const overlayContent = getOverlayContent()

  return (
    <div className="relative">
      {/* Blurred/Grayed Content */}
      <div className={`${isLocked ? 'filter blur-sm grayscale opacity-50 pointer-events-none' : ''}`}>
        {children}
      </div>

      {/* Lock Overlay */}
      {isLocked && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg"
        >
          <Card className="bg-gray-900/95 border-gray-600 max-w-md mx-4">
            <CardContent className="p-6 text-center">
              <div className="mb-4">
                {overlayContent.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                {overlayContent.title}
              </h3>
              <p className="text-gray-400 mb-6">
                {overlayContent.description}
              </p>
              <Button 
                onClick={() => setShowUpgrade(true)}
                className={`w-full ${overlayContent.buttonColor}`}
              >
                <Crown className="w-4 h-4 mr-2" />
                {overlayContent.buttonText}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Upgrade Modal */}
      <AnimatePresence>
        {showUpgrade && (
          <UpgradeModal onClose={() => setShowUpgrade(false)} />
        )}
      </AnimatePresence>
    </div>
  )
}

// Inline Payment Retry Component
export const InlinePaymentRetry = () => {
  const { subscriptionState, activateSubscription } = useSubscription()
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('card')

  if (subscriptionState.status !== SUBSCRIPTION_STATUS.FROZEN && 
      subscriptionState.status !== SUBSCRIPTION_STATUS.GRACE) {
    return null
  }

  const handleRetryPayment = async () => {
    setIsProcessing(true)
    
    try {
      // Initialize Paystack payment
      const PaystackPop = await initializePaystack()
      
      const handler = PaystackPop.setup({
        key: 'pk_test_your_paystack_key',
        email: 'user@example.com',
        amount: 14900, // $149 in kobo
        currency: 'USD',
        ref: `retry_${Date.now()}`,
        
        callback: function(response) {
          // Payment successful
          activateSubscription()
          setIsProcessing(false)
        },
        
        onClose: function() {
          setIsProcessing(false)
        }
      })

      handler.openIframe()
      
    } catch (error) {
      console.error('Payment retry failed:', error)
      setIsProcessing(false)
    }
  }

  const initializePaystack = () => {
    return new Promise((resolve, reject) => {
      if (window.PaystackPop) {
        resolve(window.PaystackPop)
      } else {
        const script = document.createElement('script')
        script.src = 'https://js.paystack.co/v1/inline.js'
        script.onload = () => resolve(window.PaystackPop)
        script.onerror = reject
        document.head.appendChild(script)
      }
    })
  }

  return (
    <Card className="bg-gradient-to-r from-red-900/50 to-pink-900/50 border-red-400/50">
      <CardHeader>
        <CardTitle className="text-red-400 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Payment Required
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-red-300">
            Your subscription payment failed. Retry payment to restore full access.
          </p>
          
          <div className="flex items-center gap-4">
            <Button
              onClick={handleRetryPayment}
              disabled={isProcessing}
              className="bg-red-600 hover:bg-red-700 flex-1"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Retry Payment ($149)
                </>
              )}
            </Button>
            
            <Button variant="outline" className="border-red-400 text-red-400">
              Update Card
            </Button>
          </div>
          
          <div className="text-xs text-gray-400">
            No refunds mid-month • Secure payment via Paystack
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Upgrade Modal Component
const UpgradeModal = ({ onClose }) => {
  const { subscriptionState, activateSubscription } = useSubscription()
  const [selectedTier, setSelectedTier] = useState('startup')
  const [billingCycle, setBillingCycle] = useState('monthly')
  const [isProcessing, setIsProcessing] = useState(false)

  const tiers = {
    startup: {
      name: 'Startup',
      price: { monthly: 149, annual: 119 },
      features: ['All dashboard features', 'Export capabilities', 'Partner introductions', 'Premium analytics']
    },
    growth: {
      name: 'Growth', 
      price: { monthly: 499, annual: 399 },
      features: ['Everything in Startup', 'Crypto vesting', 'Advanced integrations', 'Priority support']
    },
    scale: {
      name: 'Scale',
      price: { monthly: 999, annual: 799 },
      features: ['Everything in Growth', 'White-label options', 'Custom features', 'Dedicated success manager']
    }
  }

  const handleUpgrade = async () => {
    setIsProcessing(true)
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Activate subscription
      activateSubscription()
      onClose()
      
    } catch (error) {
      console.error('Upgrade failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-gray-900 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Upgrade Your Plan</h2>
            <Button variant="ghost" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Billing Cycle Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-800 p-1 rounded-lg flex">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded ${billingCycle === 'monthly' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-4 py-2 rounded ${billingCycle === 'annual' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}
              >
                Annual (20% OFF)
              </button>
            </div>
          </div>

          {/* Tier Selection */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {Object.entries(tiers).map(([tierKey, tier]) => (
              <motion.div
                key={tierKey}
                whileHover={{ scale: 1.02 }}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedTier === tierKey 
                    ? 'border-blue-400 bg-blue-900/20' 
                    : 'border-gray-600 hover:border-gray-500'
                }`}
                onClick={() => setSelectedTier(tierKey)}
              >
                <div className="text-center mb-4">
                  <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                  <div className="text-3xl font-bold text-blue-400 mb-1">
                    ${tier.price[billingCycle]}
                    <span className="text-sm text-gray-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
                  </div>
                  {billingCycle === 'annual' && (
                    <Badge className="bg-green-500 text-white">
                      Save ${(tier.price.monthly * 12 - tier.price.annual).toFixed(0)}/year
                    </Badge>
                  )}
                </div>
                
                <div className="space-y-2">
                  {tier.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Upgrade Button */}
          <div className="text-center">
            <Button
              onClick={handleUpgrade}
              disabled={isProcessing}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8 py-3 text-lg"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Crown className="w-5 h-5 mr-2" />
                  Upgrade to {tiers[selectedTier].name} - ${tiers[selectedTier].price[billingCycle]}/{billingCycle === 'annual' ? 'year' : 'month'}
                </>
              )}
            </Button>
            
            <p className="text-xs text-gray-400 mt-3">
              No refunds mid-month • Secure payment via Paystack • Cancel anytime
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

// Sensitive Data Masker Component
export const SensitiveDataMask = ({ children, feature, maskLevel = 'partial' }) => {
  const { hasFeatureAccess, subscriptionState } = useSubscription()
  
  const shouldMask = !hasFeatureAccess(feature) || subscriptionState.status === SUBSCRIPTION_STATUS.FROZEN

  if (!shouldMask) {
    return children
  }

  const getMaskedContent = () => {
    if (maskLevel === 'full') {
      return <div className="bg-gray-600 h-6 rounded animate-pulse" />
    }
    
    // Partial masking - show structure but hide values
    return (
      <div className="relative">
        <div className="filter blur-sm opacity-30">
          {children}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <Badge className="bg-red-500 text-white">
            <Lock className="w-3 h-3 mr-1" />
            Hidden
          </Badge>
        </div>
      </div>
    )
  }

  return getMaskedContent()
}

// Trial Progress Component
export const TrialProgress = () => {
  const { subscriptionState, getTrialDaysRemaining } = useSubscription()
  
  if (subscriptionState.status !== SUBSCRIPTION_STATUS.TRIAL) {
    return null
  }

  const daysLeft = getTrialDaysRemaining()
  const totalTrialDays = 30
  const progress = ((totalTrialDays - daysLeft) / totalTrialDays) * 100

  return (
    <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-400/30">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Timer className="w-5 h-5" />
          Free Trial Progress
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Days Used</span>
            <span className="text-white font-semibold">{totalTrialDays - daysLeft} / {totalTrialDays}</span>
          </div>
          
          <Progress value={progress} className="h-3" />
          
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-400 mb-1">
              {daysLeft} Days Left
            </div>
            <p className="text-gray-400 text-sm">
              Upgrade now to unlock all premium features
            </p>
          </div>
          
          <Button className="w-full bg-blue-600 hover:bg-blue-700">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Before Trial Ends
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Export the main components
export {
  SUBSCRIPTION_STATUS,
  FEATURE_ACCESS
}
