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
  Upgrade,
  Timer,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar, PieChart as RechartsPieChart, Cell } from 'recharts'

// Import subscription gating components
import {
  SubscriptionProvider,
  useSubscription,
  SubscriptionStatusBanner,
  FeatureLockOverlay,
  InlinePaymentRetry,
  SensitiveDataMask,
  TrialProgress,
  SUBSCRIPTION_STATUS,
  FEATURE_ACCESS
} from '../subscription/SubscriptionGating.jsx'

// Enhanced Founder Profile with Complete Data
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
  
  // Current valuation
  currentValuation: 92500000, // $92.5M
  previousValuation: 82000000, // $82M
  
  // SSE & Performance
  currentSSE: 78,
  previousSSE: 72,
  profileCompletion: 85,
  investorVisibility: true,
  streak: 15,
  tokens: 2450,
  level: 'Growth Stage',
  weekNumber: 3,
  consistencyMultiplier: 1.0,
  regionMultiplier: 1.7,
  stageMultiplier: 1.0,
  qualityMultiplier: 1.2,
  
  // Subscription & Billing
  subscriptionTier: 'startup',
  subscriptionStatus: 'trial', // Managed by SubscriptionProvider
  billingCycle: 'monthly',
  walletConnected: false,
  walletAddress: null
}

// Complete Domain Configuration with Behavioral Economics
const domains = {
  market_access: {
    title: 'Market Access',
    icon: Target,
    color: 'blue',
    priority: true,
    currentScore: 18,
    maxScore: 20,
    percentile: 85,
    behaviors: [
      {
        id: 'customer_interviews',
        title: 'Weekly Customer Interviews',
        description: 'Systematic validation through customer engagement',
        target: 5,
        current: 2,
        timeLeft: '3 days',
        baseTokens: 50,
        actualTokens: 85,
        multipliers: {
          region: 1.7,
          stage: 1.0,
          consistency: 1.0,
          quality: 1.2
        },
        status: 'partial',
        evidence: [],
        qualityGates: [
          { name: 'Duration ≥30min', met: true, required: true },
          { name: 'Pain points identified', met: true, required: true },
          { name: 'Follow-up scheduled', met: false, required: false },
          { name: 'Recording uploaded', met: false, required: false }
        ],
        peerComparison: {
          average: 3.2,
          top10: 6.8,
          yourRank: 67
        },
        lossAversion: {
          potentialLoss: 255,
          missedOpportunity: 'Top 10% status'
        }
      }
    ]
  },
  management: {
    title: 'Management Excellence',
    icon: Users,
    color: 'green',
    priority: false,
    currentScore: 15,
    maxScore: 20,
    percentile: 72,
    behaviors: [
      {
        id: 'team_reviews',
        title: 'Quarterly Team Performance Reviews',
        description: 'Structured feedback and development planning',
        target: 4,
        current: 3,
        timeLeft: '2 weeks',
        baseTokens: 100,
        actualTokens: 170,
        multipliers: {
          region: 1.7,
          stage: 1.0,
          consistency: 1.0,
          quality: 1.0
        },
        status: 'partial',
        evidence: [],
        qualityGates: [
          { name: '360-degree feedback', met: true, required: true },
          { name: 'Development plan created', met: true, required: true },
          { name: 'Goals documented', met: false, required: true },
          { name: 'Follow-up scheduled', met: false, required: false }
        ],
        peerComparison: {
          average: 2.8,
          top10: 4.0,
          yourRank: 45
        },
        lossAversion: {
          potentialLoss: 170,
          missedOpportunity: 'Team retention bonus'
        }
      }
    ]
  },
  funding: {
    title: 'Funding & Finance',
    icon: DollarSign,
    color: 'purple',
    priority: false,
    currentScore: 12,
    maxScore: 20,
    percentile: 58,
    behaviors: [
      {
        id: 'financial_modeling',
        title: 'Monthly Financial Model Updates',
        description: 'Maintain accurate financial projections and metrics',
        target: 1,
        current: 1,
        timeLeft: 'Complete',
        baseTokens: 75,
        actualTokens: 128,
        multipliers: {
          region: 1.7,
          stage: 1.0,
          consistency: 1.0,
          quality: 1.0
        },
        status: 'complete',
        evidence: ['financial_model_q3.xlsx'],
        qualityGates: [
          { name: 'P&L updated', met: true, required: true },
          { name: 'Cash flow projected', met: true, required: true },
          { name: 'Metrics dashboard', met: true, required: false },
          { name: 'Board deck ready', met: true, required: false }
        ],
        peerComparison: {
          average: 0.8,
          top10: 1.0,
          yourRank: 15
        },
        lossAversion: {
          potentialLoss: 0,
          missedOpportunity: null
        }
      }
    ]
  },
  operations: {
    title: 'Operations & Product',
    icon: Settings,
    color: 'orange',
    priority: false,
    currentScore: 14,
    maxScore: 20,
    percentile: 68,
    behaviors: [
      {
        id: 'product_roadmap',
        title: 'Product Roadmap Planning',
        description: 'Strategic product development and feature prioritization',
        target: 1,
        current: 0,
        timeLeft: '1 week',
        baseTokens: 60,
        actualTokens: 102,
        multipliers: {
          region: 1.7,
          stage: 1.0,
          consistency: 1.0,
          quality: 1.0
        },
        status: 'incomplete',
        evidence: [],
        qualityGates: [
          { name: 'User stories defined', met: false, required: true },
          { name: 'Technical specs', met: false, required: true },
          { name: 'Timeline estimated', met: false, required: false },
          { name: 'Resource allocation', met: false, required: false }
        ],
        peerComparison: {
          average: 0.9,
          top10: 1.0,
          yourRank: 89
        },
        lossAversion: {
          potentialLoss: 102,
          missedOpportunity: 'Product velocity bonus'
        }
      }
    ]
  }
}

// Partner Marketplace Data with Gating
const partnerMarketplace = [
  {
    id: 1,
    name: 'AWS',
    logo: '☁️',
    category: 'Cloud Infrastructure',
    description: 'Cloud computing and infrastructure services',
    baseDiscount: 15,
    sseBonus: 10,
    totalDiscount: 25,
    estimatedSavings: 2400,
    requirements: {
      minSSE: 70,
      behaviors: ['customer_interviews', 'financial_modeling']
    },
    tier: 'premium',
    verified: true
  },
  {
    id: 2,
    name: 'Stripe',
    logo: '💳',
    category: 'Payments',
    description: 'Payment processing and financial infrastructure',
    baseDiscount: 20,
    sseBonus: 15,
    totalDiscount: 35,
    estimatedSavings: 1800,
    requirements: {
      minSSE: 75,
      behaviors: ['customer_interviews', 'team_reviews']
    },
    tier: 'premium',
    verified: true
  },
  {
    id: 3,
    name: 'Notion',
    logo: '📝',
    category: 'Productivity',
    description: 'All-in-one workspace for notes, docs, and collaboration',
    baseDiscount: 30,
    sseBonus: 5,
    totalDiscount: 35,
    estimatedSavings: 600,
    requirements: {
      minSSE: 60,
      behaviors: ['product_roadmap']
    },
    tier: 'standard',
    verified: true
  }
]

// Financial projections data
const financialProjections = [
  { month: 'Jan', revenue: 42000, projection: 45000, valuation: 85000000 },
  { month: 'Feb', revenue: 45000, projection: 48000, valuation: 87500000 },
  { month: 'Mar', revenue: 48000, projection: 52000, valuation: 90000000 },
  { month: 'Apr', revenue: 52000, projection: 56000, valuation: 92500000 },
  { month: 'May', revenue: 56000, projection: 61000, valuation: 95000000 },
  { month: 'Jun', revenue: 61000, projection: 66000, valuation: 97500000 }
]

// Crypto vesting data
const cryptoVesting = {
  totalTokens: 1000000,
  vestedTokens: 250000,
  nextVesting: '2024-12-01',
  monthlyVesting: 41667,
  currentValue: 125000,
  vestingSchedule: [
    { date: '2024-01', tokens: 41667, value: 20833 },
    { date: '2024-02', tokens: 41667, value: 22500 },
    { date: '2024-03', tokens: 41667, value: 25000 },
    { date: '2024-04', tokens: 41667, value: 27500 },
    { date: '2024-05', tokens: 41667, value: 29167 },
    { date: '2024-06', tokens: 41667, value: 31250 }
  ]
}

// AI Mentor Messages with Subscription Awareness
const aiMentorMessages = [
  {
    id: 1,
    type: 'ai',
    content: 'Hello! I\'m your AI Mentor. During your trial, I can provide basic guidance. Upgrade for advanced insights and personalized recommendations!',
    timestamp: new Date(Date.now() - 3600000)
  },
  {
    id: 2,
    type: 'user',
    content: 'How can I improve my customer interview completion rate?',
    timestamp: new Date(Date.now() - 3000000)
  },
  {
    id: 3,
    type: 'ai',
    content: 'Great question! Based on your current 40% completion rate, I recommend: 1) Block specific time slots for interviews, 2) Use your network for warm introductions. Upgrade to unlock advanced interview strategies and automated scheduling!',
    timestamp: new Date(Date.now() - 2400000)
  }
]

// Valuation Engine Integration
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

// Critical Action Banner Component
const CriticalActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [bannerText, setBannerText] = useState('Customer interviews behind schedule (2/5). Complete 3 more by Friday.')

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <div>
            <strong>PRIORITY ACTION:</strong>
            <span className="ml-2">{bannerText}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="secondary"
            onClick={() => {/* Handle action */}}
            className="bg-white text-orange-600 hover:bg-gray-100"
          >
            <Play className="w-4 h-4 mr-1" />
            Take Action
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
    </motion.div>
  )
}

// Enhanced Valuation Widget with Gating
const ValuationWidget = () => {
  const { hasFeatureAccess } = useSubscription()
  const [valuationData, setValuationData] = useState(null)
  const [showBreakdown, setShowBreakdown] = useState(false)

  useEffect(() => {
    const data = ValuationEngine.calculateValuation(founderProfile)
    setValuationData(data)
  }, [])

  if (!valuationData) return null

  const trend = ValuationEngine.getValuationTrend(valuationData.valuation, founderProfile.previousValuation)

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
          <SensitiveDataMask feature="premiumAnalytics" maskLevel="partial">
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${(valuationData.valuation / 1000000).toFixed(1)}M
            </div>
            <div className={`flex items-center justify-center gap-2 text-${trend.color}-400`}>
              {trend.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : 
               trend.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : 
               <Activity className="w-4 h-4" />}
              <span>{trend.change > 0 ? '+' : ''}{trend.change}% from last month</span>
            </div>
          </SensitiveDataMask>
        </div>

        <AnimatePresence>
          {showBreakdown && (
            <FeatureLockOverlay 
              feature="premiumAnalytics"
              title="Valuation Breakdown"
              description="Upgrade to see detailed valuation methodology and factors"
            >
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
            </FeatureLockOverlay>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Token Rewards System Component with Gating
const TokenRewardsSystem = () => {
  const { hasFeatureAccess } = useSubscription()
  
  const calculateTotalTokens = () => {
    return Object.values(domains).reduce((total, domain) => {
      return total + domain.behaviors.reduce((domainTotal, behavior) => {
        return domainTotal + (behavior.status === 'complete' ? behavior.actualTokens : 0)
      }, 0)
    }, 0)
  }

  const calculatePotentialLoss = () => {
    return Object.values(domains).reduce((total, domain) => {
      return total + domain.behaviors.reduce((domainTotal, behavior) => {
        return domainTotal + (behavior.status !== 'complete' ? behavior.lossAversion.potentialLoss : 0)
      }, 0)
    }, 0)
  }

  return (
    <div className="space-y-6">
      {/* Token Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gradient-to-r from-green-500 to-emerald-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Earned This Week</p>
                <p className="text-2xl font-bold">{calculateTotalTokens()} AUX</p>
              </div>
              <Coins className="w-8 h-8 text-green-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Potential Loss</p>
                <p className="text-2xl font-bold">{calculatePotentialLoss()} AUX</p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-200" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-orange-500 to-amber-500 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm">Consistency Multiplier</p>
                <p className="text-2xl font-bold">{founderProfile.consistencyMultiplier}×</p>
                <p className="text-orange-100 text-xs">Week {founderProfile.weekNumber}</p>
              </div>
              <Flame className="w-8 h-8 text-orange-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Crypto Vesting with Gating */}
      <FeatureLockOverlay 
        feature="cryptoVesting"
        title="Crypto Vesting Schedule"
        description="Track your token vesting and manage crypto assets"
      >
        <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-400/30">
          <CardHeader>
            <CardTitle className="text-yellow-400 flex items-center gap-2">
              <Coins className="w-6 h-6" />
              Token Vesting Schedule
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Vesting Progress</span>
                <span className="text-white font-semibold">
                  {(cryptoVesting.vestedTokens / 1000).toFixed(0)}K / {(cryptoVesting.totalTokens / 1000).toFixed(0)}K tokens
                </span>
              </div>
              
              <Progress value={(cryptoVesting.vestedTokens / cryptoVesting.totalTokens) * 100} className="h-3" />
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-yellow-900/20 rounded-lg">
                  <div className="text-xl font-bold text-yellow-400">
                    ${(cryptoVesting.currentValue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-400">Current Value</div>
                </div>
                <div className="text-center p-3 bg-orange-900/20 rounded-lg">
                  <div className="text-xl font-bold text-orange-400">
                    {(cryptoVesting.monthlyVesting / 1000).toFixed(0)}K
                  </div>
                  <div className="text-sm text-gray-400">Monthly Vesting</div>
                </div>
              </div>
              
              <div className="mt-6">
                <ResponsiveContainer width="100%" height={200}>
                  <AreaChart data={cryptoVesting.vestingSchedule}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="date" stroke="#9CA3AF" />
                    <YAxis stroke="#9CA3AF" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1F2937', 
                        border: '1px solid #374151',
                        borderRadius: '8px'
                      }} 
                    />
                    <Area type="monotone" dataKey="value" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.3} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </CardContent>
        </Card>
      </FeatureLockOverlay>
    </div>
  )
}

// Partner Marketplace with Gating
const PartnerMarketplace = () => {
  const { hasFeatureAccess } = useSubscription()
  
  const calculateSavings = (partner) => {
    const qualifiesForSSE = founderProfile.currentSSE >= partner.requirements.minSSE
    const qualifiesForBehaviors = partner.requirements.behaviors.every(behaviorId => {
      return Object.values(domains).some(domain => 
        domain.behaviors.some(behavior => 
          behavior.id === behaviorId && behavior.status === 'complete'
        )
      )
    })
    
    if (qualifiesForSSE && qualifiesForBehaviors) {
      return partner.estimatedSavings * (partner.totalDiscount / 100)
    }
    return partner.estimatedSavings * (partner.baseDiscount / 100)
  }

  return (
    <FeatureLockOverlay 
      feature="partnerIntros"
      title="Partner Marketplace"
      description="Connect with strategic partners and unlock exclusive discounts"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Partner Marketplace</h2>
          <Badge className="bg-gold-500 text-black">
            Total Savings: ${partnerMarketplace.reduce((total, partner) => total + calculateSavings(partner), 0).toLocaleString()}
          </Badge>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partnerMarketplace.map((partner) => {
            const savings = calculateSavings(partner)
            const qualifiesForBonus = founderProfile.currentSSE >= partner.requirements.minSSE
            
            return (
              <motion.div
                key={partner.id}
                whileHover={{ scale: 1.02, y: -4 }}
                className="bg-white border border-gray-200 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl">
                    {partner.logo}
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{partner.name}</h3>
                    <p className="text-gray-600 text-sm">{partner.category}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 text-sm mb-4">{partner.description}</p>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Base Discount:</span>
                    <Badge variant="outline">{partner.baseDiscount}%</Badge>
                  </div>
                  
                  {qualifiesForBonus && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">SSE Bonus:</span>
                      <Badge className="bg-green-500 text-white">+{partner.sseBonus}%</Badge>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center font-bold">
                    <span>Total Discount:</span>
                    <Badge className="bg-blue-500 text-white text-lg">
                      {qualifiesForBonus ? partner.totalDiscount : partner.baseDiscount}%
                    </Badge>
                  </div>
                  
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <div className="text-green-700 font-bold text-xl">
                      ${savings.toLocaleString()}
                    </div>
                    <div className="text-green-600 text-sm">Estimated Annual Savings</div>
                  </div>
                </div>
                
                <Button className="w-full mt-4 bg-blue-600 hover:bg-blue-700">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Request Introduction
                </Button>
              </motion.div>
            )
          })}
        </div>
      </div>
    </FeatureLockOverlay>
  )
}

// Premium Analytics with Gating
const PremiumAnalytics = () => {
  const { hasFeatureAccess } = useSubscription()

  const handleExport = () => {
    if (hasFeatureAccess('exports')) {
      // Perform actual export
      console.log('Exporting analytics data...')
    }
  }

  return (
    <FeatureLockOverlay 
      feature="premiumAnalytics"
      title="Premium Analytics"
      description="Advanced insights, projections, and detailed performance metrics"
    >
      <div className="space-y-6">
        {/* Revenue Projections */}
        <Card className="bg-gray-900/50 border-blue-400/30">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-blue-400 flex items-center gap-2">
                <BarChart3 className="w-6 h-6" />
                Revenue Projections
              </CardTitle>
              <Button 
                size="sm" 
                variant="outline"
                onClick={handleExport}
                className="border-blue-400/30 text-blue-400"
              >
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialProjections}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="month" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937', 
                      border: '1px solid #374151',
                      borderRadius: '8px'
                    }} 
                  />
                  <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={3} name="Actual Revenue" />
                  <Line type="monotone" dataKey="projection" stroke="#3B82F6" strokeWidth={3} strokeDasharray="5 5" name="Projected Revenue" />
                  <Line type="monotone" dataKey="valuation" stroke="#F59E0B" strokeWidth={2} name="Valuation" />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-400">
                  ${(founderProfile.monthlyRecurringRevenue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-400">Current MRR</div>
              </div>
              <div className="text-center p-3 bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-400">23.5%</div>
                <div className="text-sm text-gray-400">Growth Rate</div>
              </div>
              <div className="text-center p-3 bg-purple-900/20 rounded-lg">
                <div className="text-2xl font-bold text-purple-400">4.2%</div>
                <div className="text-sm text-gray-400">Churn Rate</div>
              </div>
              <div className="text-center p-3 bg-orange-900/20 rounded-lg">
                <div className="text-2xl font-bold text-orange-400">18</div>
                <div className="text-sm text-gray-400">Runway (months)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </FeatureLockOverlay>
  )
}

// AI Mentor Chat Component with Subscription Awareness
const AIMentorChat = () => {
  const { hasFeatureAccess, subscriptionState } = useSubscription()
  const [messages, setMessages] = useState(aiMentorMessages)
  const [newMessage, setNewMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const sendMessage = async () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')
    setIsTyping(true)

    // Simulate AI response with subscription awareness
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: generateAIResponse(newMessage, subscriptionState.status),
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const generateAIResponse = (userMessage, subscriptionStatus) => {
    const basicResponses = [
      "I can provide basic guidance during your trial. For advanced insights and personalized recommendations, consider upgrading!",
      "That's a great question! I have limited capabilities in trial mode. Upgrade to unlock my full potential with detailed analysis.",
      "I'd love to help more, but my advanced features are locked during trial. Upgrade for comprehensive startup guidance!"
    ]

    const premiumResponses = [
      "Based on your current SSE score of 78, I recommend focusing on customer interviews to reach the top 10% threshold.",
      "Your consistency streak of 15 weeks is excellent! This puts you in the 95th percentile for founder discipline.",
      "I notice you're behind on customer interviews. Let me create a structured interview plan with warm introduction strategies.",
      "Your region multiplier of 1.7x is working in your favor. Each completed behavior is worth significantly more tokens.",
      "Consider leveraging your network for warm introductions to potential interview candidates. I can help draft outreach templates."
    ]

    if (subscriptionStatus === 'active') {
      return premiumResponses[Math.floor(Math.random() * premiumResponses.length)]
    } else {
      return basicResponses[Math.floor(Math.random() * basicResponses.length)]
    }
  }

  const quickActions = [
    { label: 'Improve SSE', action: () => setNewMessage('How can I improve my SSE score?') },
    { label: 'Plan Week', action: () => setNewMessage('Help me plan this week\'s priorities') },
    { label: 'Interview Tips', action: () => setNewMessage('Give me customer interview tips') }
  ]

  return (
    <Card className="bg-gray-900/50 border-purple-400/30 h-96">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          <Bot className="w-5 h-5" />
          AI Mentor {subscriptionState.status === 'active' ? '(Advanced)' : '(Basic)'}
          {subscriptionState.status !== 'active' && (
            <Badge className="bg-orange-500 text-white ml-2">Trial</Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col h-full">
        <div className="flex-1 overflow-y-auto space-y-3 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg ${
                message.type === 'user'
                  ? 'bg-blue-600 text-white ml-8'
                  : 'bg-gray-700 text-gray-100 mr-8'
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </p>
            </div>
          ))}
          {isTyping && (
            <div className="bg-gray-700 text-gray-100 mr-8 p-3 rounded-lg">
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
              </div>
            </div>
          )}
        </div>
        
        <div className="space-y-2">
          <div className="flex gap-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder={subscriptionState.status === 'active' ? "Ask your AI mentor anything..." : "Ask a basic question..."}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1"
            />
            <Button onClick={sendMessage} size="sm">
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          <div className="flex gap-2">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={action.action}
                className="text-xs"
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Behavior Card Component with Enhanced Features
const BehaviorCard = ({ domain, behavior }) => {
  const { hasFeatureAccess } = useSubscription()
  const [showEvidence, setShowEvidence] = useState(false)
  const [showComparison, setShowComparison] = useState(false)
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete': return 'border-green-400 bg-green-900/20'
      case 'partial': return 'border-yellow-400 bg-yellow-900/20'
      case 'incomplete': return 'border-red-400 bg-red-900/20'
      default: return 'border-gray-400 bg-gray-900/20'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete': return <CheckCircle className="w-5 h-5 text-green-400" />
      case 'partial': return <Clock className="w-5 h-5 text-yellow-400" />
      case 'incomplete': return <AlertTriangle className="w-5 h-5 text-red-400" />
      default: return <Square className="w-5 h-5 text-gray-400" />
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 rounded-lg p-6 ${getStatusColor(behavior.status)} ${
        domain.priority ? 'ring-2 ring-blue-400/50' : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {getStatusIcon(behavior.status)}
          <div>
            <h3 className="font-bold text-lg text-white">{behavior.title}</h3>
            <p className="text-gray-400 text-sm">{behavior.description}</p>
          </div>
        </div>
        {domain.priority && (
          <Badge className="bg-blue-500 text-white">PRIORITY</Badge>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-400">Progress</span>
          <span className="text-white font-semibold">
            {behavior.current}/{behavior.target} ({Math.round((behavior.current / behavior.target) * 100)}%)
          </span>
        </div>
        <Progress value={(behavior.current / behavior.target) * 100} className="h-3" />
      </div>

      {/* Token Reward Breakdown */}
      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-400/30 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-yellow-400">Token Reward:</span>
          <span className="text-2xl font-bold text-yellow-400">{behavior.actualTokens} AUX</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <div className="text-center p-2 bg-green-500/20 rounded border border-green-400/30">
            <div className="text-xs text-gray-400">Region</div>
            <div className="font-bold text-green-400">×{behavior.multipliers.region}</div>
          </div>
          <div className="text-center p-2 bg-purple-500/20 rounded border border-purple-400/30">
            <div className="text-xs text-gray-400">Stage</div>
            <div className="font-bold text-purple-400">×{behavior.multipliers.stage}</div>
          </div>
          <div className="text-center p-2 bg-orange-500/20 rounded border border-orange-400/30">
            <div className="text-xs text-gray-400">Consistency</div>
            <div className="font-bold text-orange-400">×{behavior.multipliers.consistency}</div>
          </div>
          <div className="text-center p-2 bg-blue-500/20 rounded border border-blue-400/30">
            <div className="text-xs text-gray-400">Quality</div>
            <div className="font-bold text-blue-400">×{behavior.multipliers.quality}</div>
          </div>
        </div>
      </div>

      {/* Loss Aversion Panel */}
      {behavior.status !== 'complete' && behavior.lossAversion.potentialLoss > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-gradient-to-r from-red-50 to-pink-50 border-l-4 border-red-500 p-4 rounded-lg mt-4"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 mt-1" />
            <div>
              <h4 className="font-bold text-red-700">You're Missing Out!</h4>
              <div className="text-red-600 text-2xl font-bold my-2">
                -{behavior.lossAversion.potentialLoss} AUX
              </div>
              <p className="text-red-600 text-sm">
                Complete this behavior to avoid losing {behavior.lossAversion.missedOpportunity}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 mt-4">
        <Button 
          className="flex-1 bg-blue-600 hover:bg-blue-700"
          disabled={behavior.status === 'complete'}
        >
          <Play className="w-4 h-4 mr-2" />
          {behavior.status === 'complete' ? 'Completed' : 'Take Action'}
        </Button>
        
        <FeatureLockOverlay 
          feature="exports"
          title="Evidence Upload"
          description="Upload evidence and track quality gates"
        >
          <Button 
            variant="outline" 
            onClick={() => setShowEvidence(!showEvidence)}
            className="border-gray-600 text-gray-300"
          >
            <Upload className="w-4 h-4 mr-2" />
            Evidence
          </Button>
        </FeatureLockOverlay>
        
        <FeatureLockOverlay 
          feature="premiumAnalytics"
          title="Peer Comparison"
          description="See how you compare to other founders"
        >
          <Button 
            variant="outline" 
            onClick={() => setShowComparison(!showComparison)}
            className="border-gray-600 text-gray-300"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            Compare
          </Button>
        </FeatureLockOverlay>
      </div>
    </motion.div>
  )
}

// Main Dashboard Component
const DashboardOverview = () => {
  return (
    <div className="space-y-6">
      {/* Domain Cards */}
      {Object.entries(domains).map(([key, domain]) => (
        <Card key={key} className={`bg-gray-900/50 ${domain.priority ? 'border-blue-400/50 ring-2 ring-blue-400/30' : 'border-gray-600/30'}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <domain.icon className={`w-6 h-6 text-${domain.color}-400`} />
                <div>
                  <CardTitle className={`text-${domain.color}-400 flex items-center gap-2`}>
                    {domain.title}
                    {domain.priority && <Badge className="bg-blue-500 text-white">PRIORITY</Badge>}
                  </CardTitle>
                  <p className="text-gray-400 text-sm">Systematic validation through customer engagement</p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-3xl font-bold text-${domain.color}-400`}>
                  {domain.currentScore}<span className="text-gray-400 text-xl">/{domain.maxScore}</span>
                </div>
                <div className="text-sm text-green-400">
                  <TrendingUp className="w-3 h-3 inline mr-1" />
                  Top {100 - domain.percentile}%
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {domain.behaviors.map((behavior) => (
                <BehaviorCard key={behavior.id} domain={domain} behavior={behavior} />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

// Main Component with Subscription Provider
export default function CompleteStartupFounderDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Rocket },
    { id: 'rewards', label: 'Rewards', icon: Coins },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'profile', label: 'Profile', icon: Settings }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ValuationWidget />
              <AIMentorChat />
            </div>
            <DashboardOverview />
          </div>
        )
      case 'rewards':
        return <TokenRewardsSystem />
      case 'analytics':
        return <PremiumAnalytics />
      case 'partners':
        return <PartnerMarketplace />
      case 'profile':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ValuationWidget />
            <Card className="bg-gray-900/50 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-blue-400">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Company:</span>
                    <span className="font-bold text-white">{founderProfile.company}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Stage:</span>
                    <span className="font-bold text-blue-400">{founderProfile.stage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Team Size:</span>
                    <span className="font-bold text-purple-400">{founderProfile.teamSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">MRR:</span>
                    <span className="font-bold text-green-400">${(founderProfile.monthlyRecurringRevenue / 1000).toFixed(0)}K</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Critical Action Banner */}
        <CriticalActionBanner />

        {/* Subscription Status Banner */}
        <SubscriptionStatusBanner />

        {/* Top Navigation */}
        <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
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

              {/* Status Badges */}
              <div className="flex items-center gap-3">
                <Badge className="bg-yellow-500 text-black">
                  Week {founderProfile.weekNumber} • {founderProfile.consistencyMultiplier}×
                </Badge>
                <Badge className="bg-green-500 text-white">
                  {founderProfile.tokens} AUX
                </Badge>
                <div className="flex items-center gap-1 text-green-400 text-sm">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  LIVE
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto p-6">
          {/* Welcome Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {founderProfile.name}
            </h1>
            <p className="text-gray-400">
              {founderProfile.company} • {founderProfile.stage} • Founded {new Date(founderProfile.founded).getFullYear()}
            </p>
          </motion.div>

          {/* Trial Progress (only show during trial) */}
          <TrialProgress />

          {/* Payment Retry (only show when needed) */}
          <InlinePaymentRetry />

          {/* Tab Content */}
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
    </SubscriptionProvider>
  )
}
