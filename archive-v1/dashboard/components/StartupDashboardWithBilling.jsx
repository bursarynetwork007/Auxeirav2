import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, 
  Target, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Brain,
  Award,
  Star,
  CheckCircle,
  AlertTriangle,
  Clock,
  Flame,
  Trophy,
  Lightbulb,
  MessageCircle,
  Bot,
  Shield,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  EyeOff,
  Settings,
  Plus,
  ArrowRight,
  Sparkles,
  Crown,
  Gem,
  Coins,
  Calendar,
  FileText,
  Link,
  ExternalLink,
  Upload,
  Download,
  Play,
  Pause,
  X,
  Send,
  Wallet,
  TrendingDown,
  AlertCircle,
  CheckSquare,
  Square,
  Camera,
  Mic,
  Video,
  FileImage,
  Percent,
  Calculator,
  Network,
  Share2,
  Bell,
  Bookmark,
  Heart,
  Filter,
  Search,
  MoreHorizontal,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  HelpCircle,
  Lock,
  Unlock,
  Globe,
  MapPin,
  Building,
  Mail,
  Phone,
  CreditCard,
  Package,
  Upgrade
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts'

// Enhanced Founder Profile with Billing Information
const founderProfile = {
  // Basic Info
  name: 'Sarah Chen',
  email: 'sarah@quantumai.com',
  company: 'QuantumAI',
  website: 'https://quantumai.com',
  founded: '2023-03-15',
  
  // Financial Metrics for Valuation & Billing
  totalRaised: 2500000, // $2.5M
  monthlyRecurringRevenue: 45000, // $45K MRR
  teamSize: 28,
  stage: 'Series A',
  
  // Valuation Inputs
  industry: 'AI/ML',
  region: 'San Francisco',
  businessModel: 'SaaS',
  customerCount: 127,
  avgRevenuePerCustomer: 354,
  churnRate: 4.2,
  grossMargin: 85,
  burnRate: 125000, // Monthly burn
  runway: 18, // Months
  
  // SSE & Performance
  currentSSE: 78,
  previousSSE: 72,
  profileCompletion: 85,
  investorVisibility: true,
  streak: 15,
  tokens: 2450,
  level: 'Growth Stage',
  
  // Billing Information
  currentTier: 'growth', // founder, startup, growth, scale
  billingCycle: 'monthly', // monthly, annual
  paymentMethod: null,
  subscriptionStatus: 'active', // active, past_due, canceled, trial
  trialEndsAt: null,
  nextBillingDate: '2024-11-15',
  
  // Paystack Integration
  paystackCustomerId: null,
  paystackSubscriptionCode: null
}

// Subscription Tiers Configuration
const subscriptionTiers = {
  founder: {
    name: 'Founder',
    price: {
      monthly: 0,
      annual: 0
    },
    description: 'Always FREE',
    subtitle: 'Bootstrap/Pre-revenue',
    features: [
      'Basic SSE scoring',
      'Weekly action tracking',
      'Community access',
      'Basic analytics'
    ],
    limits: {
      maxTeamSize: 5,
      maxMRR: 5000,
      maxRaised: 10000
    },
    criteria: {
      raised: { max: 10000 },
      mrr: { max: 5000 },
      employees: { max: 5 }
    },
    color: 'gray',
    popular: false
  },
  startup: {
    name: 'Startup',
    price: {
      monthly: 149,
      annual: 119
    },
    description: '$149/mo',
    subtitle: 'Pre-Seed to Seed',
    features: [
      'Advanced SSE analytics',
      'AI mentor access',
      'Investor visibility',
      'Partner marketplace',
      'Priority support'
    ],
    limits: {
      maxTeamSize: 15,
      maxMRR: 25000,
      maxRaised: 500000
    },
    criteria: {
      raised: { min: 10000, max: 500000 },
      mrr: { min: 0, max: 25000 },
      employees: { min: 5, max: 15 }
    },
    color: 'blue',
    popular: true
  },
  growth: {
    name: 'Growth',
    price: {
      monthly: 499,
      annual: 399
    },
    description: '$499/mo',
    subtitle: 'Series A',
    features: [
      'Full platform access',
      'Advanced integrations',
      'Custom reporting',
      'Dedicated success manager',
      'API access'
    ],
    limits: {
      maxTeamSize: 50,
      maxMRR: 100000,
      maxRaised: 5000000
    },
    criteria: {
      raised: { min: 500000, max: 5000000 },
      mrr: { min: 25000, max: 100000 },
      employees: { min: 15, max: 50 }
    },
    color: 'purple',
    popular: false
  },
  scale: {
    name: 'Scale',
    price: {
      monthly: 999,
      annual: 799
    },
    description: '$999/mo',
    subtitle: 'Series B+',
    features: [
      'Enterprise features',
      'White-label options',
      'Custom integrations',
      'Priority support',
      'Advanced security'
    ],
    limits: {
      maxTeamSize: 999,
      maxMRR: 999999999,
      maxRaised: 999999999
    },
    criteria: {
      raised: { min: 5000000 },
      mrr: { min: 100000 },
      employees: { min: 50 }
    },
    color: 'gold',
    popular: false
  }
}

// Valuation Engine
class ValuationEngine {
  static calculateValuation(profile) {
    const {
      monthlyRecurringRevenue,
      industry,
      stage,
      teamSize,
      currentSSE,
      grossMargin,
      churnRate,
      customerCount,
      totalRaised
    } = profile

    // Base revenue multiple by industry and stage
    const industryMultiples = {
      'AI/ML': { seed: 15, seriesA: 12, seriesB: 10, growth: 8 },
      'SaaS': { seed: 12, seriesA: 10, seriesB: 8, growth: 6 },
      'Fintech': { seed: 10, seriesA: 8, seriesB: 6, growth: 5 },
      'Healthcare': { seed: 8, seriesA: 6, seriesB: 5, growth: 4 },
      'E-commerce': { seed: 6, seriesA: 4, seriesB: 3, growth: 2 }
    }

    const stageMapping = {
      'Pre-Seed': 'seed',
      'Seed': 'seed',
      'Series A': 'seriesA',
      'Series B': 'seriesB',
      'Growth': 'growth'
    }

    const baseMultiple = industryMultiples[industry]?.[stageMapping[stage]] || 8
    const annualRevenue = monthlyRecurringRevenue * 12

    // SSE Score Adjustment (±30% based on SSE)
    const sseAdjustment = 0.7 + (currentSSE / 100) * 0.6 // 0.7 to 1.3 multiplier

    // Team Quality Adjustment
    const teamAdjustment = Math.min(1.2, 0.8 + (teamSize / 100))

    // Gross Margin Adjustment
    const marginAdjustment = 0.8 + (grossMargin / 100) * 0.4

    // Churn Rate Adjustment (lower churn = higher valuation)
    const churnAdjustment = Math.max(0.6, 1.2 - (churnRate / 10))

    // Calculate base valuation
    let valuation = annualRevenue * baseMultiple * sseAdjustment * teamAdjustment * marginAdjustment * churnAdjustment

    // Minimum valuation based on total raised
    const minValuation = totalRaised * 1.5
    valuation = Math.max(valuation, minValuation)

    return {
      valuation: Math.round(valuation),
      breakdown: {
        annualRevenue,
        baseMultiple,
        sseAdjustment,
        teamAdjustment,
        marginAdjustment,
        churnAdjustment,
        minValuation
      }
    }
  }

  static getValuationTrend(currentValuation, previousValuation) {
    const change = ((currentValuation - previousValuation) / previousValuation) * 100
    return {
      change: Math.round(change * 100) / 100,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      color: change > 0 ? 'green' : change < 0 ? 'red' : 'gray'
    }
  }
}

// Billing Engine
class BillingEngine {
  static determineRequiredTier(profile) {
    const { totalRaised, monthlyRecurringRevenue, teamSize } = profile

    // Check each tier from highest to lowest
    const tiers = ['scale', 'growth', 'startup', 'founder']
    
    for (const tierKey of tiers) {
      const tier = subscriptionTiers[tierKey]
      const criteria = tier.criteria

      const meetsRaised = !criteria.raised.min || totalRaised >= criteria.raised.min
      const meetsMRR = !criteria.mrr.min || monthlyRecurringRevenue >= criteria.mrr.min
      const meetsEmployees = !criteria.employees.min || teamSize >= criteria.employees.min

      const withinRaisedMax = !criteria.raised.max || totalRaised <= criteria.raised.max
      const withinMRRMax = !criteria.mrr.max || monthlyRecurringRevenue <= criteria.mrr.max
      const withinEmployeesMax = !criteria.employees.max || teamSize <= criteria.employees.max

      if (meetsRaised && meetsMRR && meetsEmployees && withinRaisedMax && withinMRRMax && withinEmployeesMax) {
        return tierKey
      }
    }

    return 'founder' // Default fallback
  }

  static calculatePrice(tier, billingCycle) {
    const tierConfig = subscriptionTiers[tier]
    return tierConfig.price[billingCycle]
  }

  static getUpgradeRecommendation(profile) {
    const currentTier = profile.currentTier
    const requiredTier = this.determineRequiredTier(profile)
    
    if (currentTier !== requiredTier) {
      return {
        shouldUpgrade: true,
        recommendedTier: requiredTier,
        reason: this.getUpgradeReason(profile, requiredTier)
      }
    }

    return { shouldUpgrade: false }
  }

  static getUpgradeReason(profile, recommendedTier) {
    const { totalRaised, monthlyRecurringRevenue, teamSize } = profile
    const reasons = []

    if (totalRaised > subscriptionTiers[profile.currentTier].limits.maxRaised) {
      reasons.push(`Funding raised ($${(totalRaised / 1000000).toFixed(1)}M) exceeds current tier limit`)
    }
    if (monthlyRecurringRevenue > subscriptionTiers[profile.currentTier].limits.maxMRR) {
      reasons.push(`MRR ($${(monthlyRecurringRevenue / 1000).toFixed(0)}K) exceeds current tier limit`)
    }
    if (teamSize > subscriptionTiers[profile.currentTier].limits.maxTeamSize) {
      reasons.push(`Team size (${teamSize}) exceeds current tier limit`)
    }

    return reasons.join(', ')
  }
}

// Paystack Integration Configuration
const paystackConfig = {
  publicKey: 'pk_test_your_paystack_public_key', // Replace with actual key
  secretKey: 'sk_test_your_paystack_secret_key', // Replace with actual key (backend only)
  baseUrl: 'https://api.paystack.co',
  
  // Webhook endpoints for your backend
  webhooks: {
    subscriptionCreate: '/api/webhooks/paystack/subscription-create',
    subscriptionUpdate: '/api/webhooks/paystack/subscription-update',
    subscriptionCancel: '/api/webhooks/paystack/subscription-cancel',
    invoiceCreate: '/api/webhooks/paystack/invoice-create',
    invoicePayment: '/api/webhooks/paystack/invoice-payment'
  }
}

// Valuation Display Component
const ValuationWidget = () => {
  const [valuationData, setValuationData] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  useEffect(() => {
    const data = ValuationEngine.calculateValuation(founderProfile)
    setValuationData(data)
  }, [])

  if (!valuationData) return null

  const trend = ValuationEngine.getValuationTrend(valuationData.valuation, 85000000) // Previous valuation

  return (
    <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Company Valuation
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="ml-auto text-green-400 hover:text-green-300"
          >
            <Info className="w-4 h-4" />
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <div className="text-4xl font-bold text-green-400 mb-2">
            ${(valuationData.valuation / 1000000).toFixed(1)}M
          </div>
          <div className={`flex items-center justify-center gap-2 text-${trend.color}-400`}>
            {trend.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
             trend.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
             <Activity className="w-4 h-4" />}
            <span>{trend.change > 0 ? '+' : ''}{trend.change}% from last month</span>
          </div>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="space-y-3 pt-4 border-t border-green-400/30"
            >
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Annual Revenue:</span>
                  <div className="font-semibold text-green-400">
                    ${(valuationData.breakdown.annualRevenue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Revenue Multiple:</span>
                  <div className="font-semibold text-green-400">
                    {valuationData.breakdown.baseMultiple}x
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">SSE Adjustment:</span>
                  <div className="font-semibold text-green-400">
                    {(valuationData.breakdown.sseAdjustment * 100).toFixed(0)}%
                  </div>
                </div>
                <div>
                  <span className="text-gray-400">Team Quality:</span>
                  <div className="font-semibold text-green-400">
                    {(valuationData.breakdown.teamAdjustment * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
              
              <div className="text-xs text-gray-400 mt-3">
                Valuation calculated using industry multiples, SSE score, team metrics, and financial performance.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Billing Information Collection Component
const BillingInfoCollector = () => {
  const [billingData, setBillingData] = useState({
    // Company Information
    legalCompanyName: founderProfile.company,
    taxId: '',
    incorporationCountry: 'United States',
    
    // Financial Metrics
    totalRaised: founderProfile.totalRaised,
    monthlyRecurringRevenue: founderProfile.monthlyRecurringRevenue,
    teamSize: founderProfile.teamSize,
    
    // Billing Address
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    },
    
    // Contact Information
    billingEmail: founderProfile.email,
    billingPhone: '',
    
    // Additional Metrics
    customerCount: founderProfile.customerCount,
    avgRevenuePerCustomer: founderProfile.avgRevenuePerCustomer,
    churnRate: founderProfile.churnRate,
    grossMargin: founderProfile.grossMargin,
    burnRate: founderProfile.burnRate
  })

  const [isEditing, setIsEditing] = useState(false)

  const handleSave = async () => {
    try {
      // Save billing information to backend
      const response = await fetch('/api/billing/update-info', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify(billingData)
      })

      if (response.ok) {
        setIsEditing(false)
        // Update local profile
        Object.assign(founderProfile, billingData)
      }
    } catch (error) {
      console.error('Failed to save billing information:', error)
    }
  }

  return (
    <Card className="bg-gray-900/50 border-blue-400/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Building className="w-6 h-6" />
            Billing Information
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="border-blue-400/30 text-blue-400"
          >
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Company Information */}
          <div>
            <h4 className="font-semibold text-white mb-3">Company Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Legal Company Name</label>
                <Input
                  value={billingData.legalCompanyName}
                  onChange={(e) => setBillingData(prev => ({ ...prev, legalCompanyName: e.target.value }))}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Tax ID / EIN</label>
                <Input
                  value={billingData.taxId}
                  onChange={(e) => setBillingData(prev => ({ ...prev, taxId: e.target.value }))}
                  disabled={!isEditing}
                  placeholder="XX-XXXXXXX"
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Financial Metrics */}
          <div>
            <h4 className="font-semibold text-white mb-3">Financial Metrics</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Total Raised ($)</label>
                <Input
                  type="number"
                  value={billingData.totalRaised}
                  onChange={(e) => setBillingData(prev => ({ ...prev, totalRaised: parseInt(e.target.value) }))}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Monthly Recurring Revenue ($)</label>
                <Input
                  type="number"
                  value={billingData.monthlyRecurringRevenue}
                  onChange={(e) => setBillingData(prev => ({ ...prev, monthlyRecurringRevenue: parseInt(e.target.value) }))}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-1 block">Team Size</label>
                <Input
                  type="number"
                  value={billingData.teamSize}
                  onChange={(e) => setBillingData(prev => ({ ...prev, teamSize: parseInt(e.target.value) }))}
                  disabled={!isEditing}
                  className="bg-gray-800 border-gray-600"
                />
              </div>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h4 className="font-semibold text-white mb-3">Billing Address</h4>
            <div className="space-y-3">
              <Input
                value={billingData.billingAddress.street}
                onChange={(e) => setBillingData(prev => ({ 
                  ...prev, 
                  billingAddress: { ...prev.billingAddress, street: e.target.value }
                }))}
                disabled={!isEditing}
                placeholder="Street Address"
                className="bg-gray-800 border-gray-600"
              />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Input
                  value={billingData.billingAddress.city}
                  onChange={(e) => setBillingData(prev => ({ 
                    ...prev, 
                    billingAddress: { ...prev.billingAddress, city: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="City"
                  className="bg-gray-800 border-gray-600"
                />
                <Input
                  value={billingData.billingAddress.state}
                  onChange={(e) => setBillingData(prev => ({ 
                    ...prev, 
                    billingAddress: { ...prev.billingAddress, state: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="State"
                  className="bg-gray-800 border-gray-600"
                />
                <Input
                  value={billingData.billingAddress.zipCode}
                  onChange={(e) => setBillingData(prev => ({ 
                    ...prev, 
                    billingAddress: { ...prev.billingAddress, zipCode: e.target.value }
                  }))}
                  disabled={!isEditing}
                  placeholder="ZIP Code"
                  className="bg-gray-800 border-gray-600"
                />
                <select
                  value={billingData.billingAddress.country}
                  onChange={(e) => setBillingData(prev => ({ 
                    ...prev, 
                    billingAddress: { ...prev.billingAddress, country: e.target.value }
                  }))}
                  disabled={!isEditing}
                  className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                >
                  <option value="United States">United States</option>
                  <option value="Canada">Canada</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="Germany">Germany</option>
                  <option value="France">France</option>
                </select>
              </div>
            </div>
          </div>

          {isEditing && (
            <div className="flex gap-3">
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <CheckCircle className="w-4 h-4 mr-2" />
                Save Information
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// Subscription Management Component
const SubscriptionManager = () => {
  const [currentTier, setCurrentTier] = useState(founderProfile.currentTier)
  const [billingCycle, setBillingCycle] = useState(founderProfile.billingCycle)
  const [isProcessing, setIsProcessing] = useState(false)
  
  const requiredTier = BillingEngine.determineRequiredTier(founderProfile)
  const upgradeRecommendation = BillingEngine.getUpgradeRecommendation(founderProfile)

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

  const handleSubscription = async (tierKey) => {
    if (tierKey === 'founder') return // Free tier

    setIsProcessing(true)
    
    try {
      const PaystackPop = await initializePaystack()
      const price = BillingEngine.calculatePrice(tierKey, billingCycle)
      
      // Create subscription plan on backend first
      const planResponse = await fetch('/api/billing/create-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          tier: tierKey,
          billingCycle,
          amount: price * 100, // Paystack uses kobo (cents)
          interval: billingCycle === 'annual' ? 'annually' : 'monthly'
        })
      })

      const { planCode } = await planResponse.json()

      // Initialize Paystack payment
      const handler = PaystackPop.setup({
        key: paystackConfig.publicKey,
        email: founderProfile.email,
        amount: price * 100, // Amount in kobo
        plan: planCode,
        currency: 'USD',
        ref: `auxeira_${Date.now()}`,
        
        callback: function(response) {
          // Payment successful
          handlePaymentSuccess(response, tierKey)
        },
        
        onClose: function() {
          setIsProcessing(false)
        }
      })

      handler.openIframe()
      
    } catch (error) {
      console.error('Payment initialization failed:', error)
      setIsProcessing(false)
    }
  }

  const handlePaymentSuccess = async (response, tierKey) => {
    try {
      // Verify payment on backend
      const verifyResponse = await fetch('/api/billing/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: JSON.stringify({
          reference: response.reference,
          tier: tierKey,
          billingCycle
        })
      })

      if (verifyResponse.ok) {
        // Update local state
        setCurrentTier(tierKey)
        founderProfile.currentTier = tierKey
        founderProfile.subscriptionStatus = 'active'
        
        // Show success message
        alert('Subscription activated successfully!')
      }
    } catch (error) {
      console.error('Payment verification failed:', error)
    } finally {
      setIsProcessing(false)
    }
  }

  const getTierColor = (tier) => {
    const colors = {
      founder: 'gray',
      startup: 'blue',
      growth: 'purple',
      scale: 'gold'
    }
    return colors[tier] || 'gray'
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription Status */}
      <Card className="bg-gray-900/50 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-green-400 flex items-center gap-2">
            <Package className="w-6 h-6" />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-2xl font-bold text-white">
                {subscriptionTiers[currentTier].name}
              </div>
              <div className="text-gray-400">
                {subscriptionTiers[currentTier].subtitle}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-400">
                ${subscriptionTiers[currentTier].price[billingCycle]}
                <span className="text-sm text-gray-400">/{billingCycle === 'annual' ? 'year' : 'month'}</span>
              </div>
              {billingCycle === 'annual' && subscriptionTiers[currentTier].price.annual < subscriptionTiers[currentTier].price.monthly && (
                <Badge className="bg-green-500 text-white">20% OFF</Badge>
              )}
            </div>
          </div>
          
          {founderProfile.subscriptionStatus === 'active' && (
            <div className="text-sm text-gray-400">
              Next billing date: {founderProfile.nextBillingDate}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upgrade Recommendation */}
      {upgradeRecommendation.shouldUpgrade && (
        <Card className="bg-gradient-to-r from-orange-900/50 to-red-900/50 border-orange-400/50">
          <CardHeader>
            <CardTitle className="text-orange-400 flex items-center gap-2">
              <Upgrade className="w-6 h-6" />
              Upgrade Recommended
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-orange-300 mb-2">
                Based on your company metrics, you should upgrade to the{' '}
                <strong>{subscriptionTiers[upgradeRecommendation.recommendedTier].name}</strong> tier.
              </p>
              <p className="text-sm text-gray-400">
                Reason: {upgradeRecommendation.reason}
              </p>
            </div>
            <Button
              onClick={() => handleSubscription(upgradeRecommendation.recommendedTier)}
              disabled={isProcessing}
              className="bg-orange-600 hover:bg-orange-700"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Upgrade className="w-4 h-4 mr-2" />
                  Upgrade Now
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Billing Cycle Toggle */}
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-blue-400">Billing Cycle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Button
              variant={billingCycle === 'monthly' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('monthly')}
              className={billingCycle === 'monthly' ? 'bg-blue-600' : 'border-gray-600'}
            >
              Monthly
            </Button>
            <Button
              variant={billingCycle === 'annual' ? 'default' : 'outline'}
              onClick={() => setBillingCycle('annual')}
              className={billingCycle === 'annual' ? 'bg-blue-600' : 'border-gray-600'}
            >
              Annual (20% OFF)
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* All Subscription Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(subscriptionTiers).map(([tierKey, tier]) => {
          const isCurrentTier = tierKey === currentTier
          const price = tier.price[billingCycle]
          
          return (
            <motion.div
              key={tierKey}
              whileHover={{ scale: 1.02, y: -4 }}
              className={`relative bg-gray-900/50 border-2 rounded-lg p-6 ${
                isCurrentTier 
                  ? `border-${getTierColor(tierKey)}-400 ring-2 ring-${getTierColor(tierKey)}-400/30` 
                  : 'border-gray-600 hover:border-gray-500'
              } ${tier.popular ? 'ring-2 ring-blue-400/50' : ''}`}
            >
              {tier.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-blue-500 text-white">POPULAR</Badge>
                </div>
              )}
              
              {isCurrentTier && (
                <div className="absolute -top-3 right-4">
                  <Badge className="bg-green-500 text-white">CURRENT</Badge>
                </div>
              )}

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">{tier.name}</h3>
                <p className="text-gray-400 text-sm mb-4">{tier.subtitle}</p>
                <div className="text-3xl font-bold text-white mb-1">
                  ${price}
                  <span className="text-sm text-gray-400">
                    /{billingCycle === 'annual' ? 'year' : 'month'}
                  </span>
                </div>
                {billingCycle === 'annual' && price < tier.price.monthly && (
                  <Badge className="bg-green-500 text-white text-xs">
                    Save ${(tier.price.monthly * 12 - price).toFixed(0)}/year
                  </Badge>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    <span className="text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>

              <Button
                onClick={() => handleSubscription(tierKey)}
                disabled={isCurrentTier || isProcessing || tierKey === 'founder'}
                className={`w-full ${
                  isCurrentTier 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : tierKey === 'founder'
                    ? 'bg-gray-600 cursor-not-allowed'
                    : `bg-${getTierColor(tierKey)}-600 hover:bg-${getTierColor(tierKey)}-700`
                }`}
              >
                {isCurrentTier ? 'Current Plan' : 
                 tierKey === 'founder' ? 'Free Forever' :
                 isProcessing ? 'Processing...' : 'Subscribe'}
              </Button>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

// Paystack Integration Guide Component
const PaystackIntegrationGuide = () => {
  return (
    <Card className="bg-gray-900/50 border-purple-400/30">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          <CreditCard className="w-6 h-6" />
          Paystack Integration Guide
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* API Keys Setup */}
          <div>
            <h4 className="font-semibold text-white mb-3">1. API Keys Configuration</h4>
            <div className="bg-gray-800 p-4 rounded-lg">
              <pre className="text-sm text-gray-300 overflow-x-auto">
{`// Environment Variables (.env)
PAYSTACK_PUBLIC_KEY=pk_test_your_public_key
PAYSTACK_SECRET_KEY=sk_test_your_secret_key
PAYSTACK_WEBHOOK_SECRET=your_webhook_secret

// For production
PAYSTACK_PUBLIC_KEY=pk_live_your_live_public_key
PAYSTACK_SECRET_KEY=sk_live_your_live_secret_key`}
              </pre>
            </div>
          </div>

          {/* Backend API Endpoints */}
          <div>
            <h4 className="font-semibold text-white mb-3">2. Required Backend Endpoints</h4>
            <div className="space-y-3">
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="font-mono text-sm text-blue-400">POST /api/billing/create-plan</div>
                <div className="text-xs text-gray-400 mt-1">Create subscription plan in Paystack</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="font-mono text-sm text-blue-400">POST /api/billing/verify-payment</div>
                <div className="text-xs text-gray-400 mt-1">Verify payment and activate subscription</div>
              </div>
              <div className="bg-gray-800 p-3 rounded-lg">
                <div className="font-mono text-sm text-blue-400">POST /api/billing/update-info</div>
                <div className="text-xs text-gray-400 mt-1">Update customer billing information</div>
              </div>
            </div>
          </div>

          {/* Webhook Configuration */}
          <div>
            <h4 className="font-semibold text-white mb-3">3. Webhook Endpoints</h4>
            <div className="bg-gray-800 p-4 rounded-lg">
              <div className="text-sm text-gray-300 space-y-2">
                <div>• <code className="text-blue-400">/api/webhooks/paystack/subscription-create</code></div>
                <div>• <code className="text-blue-400">/api/webhooks/paystack/subscription-update</code></div>
                <div>• <code className="text-blue-400">/api/webhooks/paystack/subscription-cancel</code></div>
                <div>• <code className="text-blue-400">/api/webhooks/paystack/invoice-create</code></div>
                <div>• <code className="text-blue-400">/api/webhooks/paystack/invoice-payment</code></div>
              </div>
            </div>
          </div>

          {/* Sample Backend Code */}
          <div>
            <h4 className="font-semibold text-white mb-3">4. Sample Backend Implementation</h4>
            <div className="bg-gray-800 p-4 rounded-lg">
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`// Create Subscription Plan
app.post('/api/billing/create-plan', async (req, res) => {
  const { tier, billingCycle, amount, interval } = req.body
  
  try {
    const response = await fetch('https://api.paystack.co/plan', {
      method: 'POST',
      headers: {
        'Authorization': \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: \`Auxeira \${tier} Plan\`,
        amount: amount,
        interval: interval,
        currency: 'USD'
      })
    })
    
    const data = await response.json()
    res.json({ planCode: data.data.plan_code })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Verify Payment
app.post('/api/billing/verify-payment', async (req, res) => {
  const { reference, tier, billingCycle } = req.body
  
  try {
    const response = await fetch(\`https://api.paystack.co/transaction/verify/\${reference}\`, {
      headers: {
        'Authorization': \`Bearer \${process.env.PAYSTACK_SECRET_KEY}\`
      }
    })
    
    const data = await response.json()
    
    if (data.data.status === 'success') {
      // Update user subscription in database
      await updateUserSubscription(req.user.id, {
        tier,
        billingCycle,
        status: 'active',
        paystackCustomerId: data.data.customer.id,
        paystackSubscriptionCode: data.data.plan
      })
      
      res.json({ success: true })
    } else {
      res.status(400).json({ error: 'Payment verification failed' })
    }
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})`}
              </pre>
            </div>
          </div>

          {/* Database Schema */}
          <div>
            <h4 className="font-semibold text-white mb-3">5. Database Schema Updates</h4>
            <div className="bg-gray-800 p-4 rounded-lg">
              <pre className="text-xs text-gray-300 overflow-x-auto">
{`-- Add billing columns to users table
ALTER TABLE users ADD COLUMN subscription_tier VARCHAR(20) DEFAULT 'founder';
ALTER TABLE users ADD COLUMN billing_cycle VARCHAR(10) DEFAULT 'monthly';
ALTER TABLE users ADD COLUMN subscription_status VARCHAR(20) DEFAULT 'active';
ALTER TABLE users ADD COLUMN paystack_customer_id VARCHAR(100);
ALTER TABLE users ADD COLUMN paystack_subscription_code VARCHAR(100);
ALTER TABLE users ADD COLUMN next_billing_date DATE;

-- Create billing_info table
CREATE TABLE billing_info (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES users(user_id),
  legal_company_name VARCHAR(255),
  tax_id VARCHAR(50),
  total_raised BIGINT,
  monthly_recurring_revenue INTEGER,
  team_size INTEGER,
  billing_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Enhanced Dashboard Component
export default function StartupDashboardWithBilling() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Rocket },
    { id: 'valuation', label: 'Valuation', icon: TrendingUp },
    { id: 'billing', label: 'Billing', icon: CreditCard },
    { id: 'subscription', label: 'Subscription', icon: Package },
    { id: 'integration', label: 'Integration Guide', icon: Settings }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'valuation':
        return (
          <div className="space-y-6">
            <ValuationWidget />
            <BillingInfoCollector />
          </div>
        )
      case 'billing':
        return <BillingInfoCollector />
      case 'subscription':
        return <SubscriptionManager />
      case 'integration':
        return <PaystackIntegrationGuide />
      default:
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ValuationWidget />
            <Card className="bg-gray-900/50 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-blue-400">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">SSE Score:</span>
                    <span className="font-bold text-blue-400">{founderProfile.currentSSE}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MRR:</span>
                    <span className="font-bold text-green-400">${(founderProfile.monthlyRecurringRevenue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team Size:</span>
                    <span className="font-bold text-purple-400">{founderProfile.teamSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Current Tier:</span>
                    <Badge className={`bg-${subscriptionTiers[founderProfile.currentTier].color}-500 text-white`}>
                      {subscriptionTiers[founderProfile.currentTier].name}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AUXEIRA
            </div>
            
            {/* Tab Navigation */}
            <div className="flex gap-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                )
              })}
            </div>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <Badge className={`bg-${subscriptionTiers[founderProfile.currentTier].color}-500 text-white`}>
                {subscriptionTiers[founderProfile.currentTier].name}
              </Badge>
              <div className="text-sm text-gray-400">
                {founderProfile.name}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">
            {founderProfile.company} Dashboard
          </h1>
          <p className="text-gray-400">
            {founderProfile.stage} • {founderProfile.teamSize} employees • ${(founderProfile.monthlyRecurringRevenue / 1000).toFixed(0)}K MRR
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
