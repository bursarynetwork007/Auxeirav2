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
  Timer
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

// Enhanced Founder Profile with Subscription Data
const founderProfile = {
  // Basic Info
  name: 'Sarah Chen',
  email: 'sarah@quantumai.com',
  company: 'QuantumAI',
  website: 'https://quantumai.com',
  founded: '2023-03-15',
  
  // Financial Metrics
  totalRaised: 2500000, // $2.5M
  monthlyRecurringRevenue: 45000, // $45K MRR
  teamSize: 28,
  stage: 'Series A',
  
  // Valuation Data
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
  
  // Subscription Status (managed by SubscriptionProvider)
  subscriptionTier: 'startup',
  subscriptionStatus: 'trial' // Will be managed by context
}

// Sample dashboard data with sensitive information
const dashboardData = {
  // Revenue metrics (sensitive)
  revenueMetrics: {
    mrr: 45000,
    arr: 540000,
    growth: 23.5,
    churn: 4.2,
    ltv: 12500,
    cac: 850
  },
  
  // Customer data (sensitive)
  customerData: {
    totalCustomers: 127,
    activeUsers: 98,
    newSignups: 23,
    conversionRate: 18.2
  },
  
  // Financial projections (premium)
  financialProjections: [
    { month: 'Jan', revenue: 42000, projection: 45000 },
    { month: 'Feb', revenue: 45000, projection: 48000 },
    { month: 'Mar', revenue: 48000, projection: 52000 },
    { month: 'Apr', revenue: 52000, projection: 56000 },
    { month: 'May', revenue: 56000, projection: 61000 },
    { month: 'Jun', revenue: 61000, projection: 66000 }
  ],
  
  // Partner opportunities (premium)
  partnerOpportunities: [
    {
      id: 1,
      name: 'TechCorp Ventures',
      type: 'Strategic Partnership',
      value: 250000,
      probability: 85,
      stage: 'Due Diligence'
    },
    {
      id: 2,
      name: 'Global Solutions Inc',
      type: 'Channel Partnership',
      value: 150000,
      probability: 60,
      stage: 'Negotiation'
    }
  ],
  
  // Crypto vesting schedule (premium)
  cryptoVesting: {
    totalTokens: 1000000,
    vestedTokens: 250000,
    nextVesting: '2024-12-01',
    monthlyVesting: 41667,
    currentValue: 125000
  }
}

// Valuation Widget with Sensitive Data Masking
const ValuationWidget = () => {
  const { hasFeatureAccess } = useSubscription()
  
  const valuationTrend = ((founderProfile.currentValuation - founderProfile.previousValuation) / founderProfile.previousValuation) * 100

  return (
    <Card className="bg-gradient-to-r from-green-900/50 to-emerald-900/50 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <TrendingUp className="w-6 h-6" />
          Company Valuation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <SensitiveDataMask feature="premiumAnalytics" maskLevel="partial">
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-400 mb-2">
              ${(founderProfile.currentValuation / 1000000).toFixed(1)}M
            </div>
            <div className="flex items-center justify-center gap-2 text-green-400">
              <TrendingUp className="w-4 h-4" />
              <span>+{valuationTrend.toFixed(1)}% from last month</span>
            </div>
          </div>
        </SensitiveDataMask>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">ARR Multiple:</span>
            <SensitiveDataMask feature="premiumAnalytics">
              <div className="font-semibold text-green-400">17.1x</div>
            </SensitiveDataMask>
          </div>
          <div>
            <span className="text-gray-400">SSE Impact:</span>
            <SensitiveDataMask feature="premiumAnalytics">
              <div className="font-semibold text-green-400">+12%</div>
            </SensitiveDataMask>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Revenue Metrics with Export Gating
const RevenueMetricsCard = () => {
  const { hasFeatureAccess } = useSubscription()
  const [showExportModal, setShowExportModal] = useState(false)

  const handleExport = () => {
    if (hasFeatureAccess('exports')) {
      // Perform actual export
      console.log('Exporting revenue data...')
    } else {
      setShowExportModal(true)
    }
  }

  return (
    <FeatureLockOverlay 
      feature="premiumAnalytics"
      title="Premium Analytics"
      description="Upgrade to view detailed revenue metrics and trends"
    >
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-400 flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Revenue Metrics
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-green-900/20 rounded-lg">
              <div className="text-2xl font-bold text-green-400">
                ${(dashboardData.revenueMetrics.mrr / 1000).toFixed(0)}K
              </div>
              <div className="text-sm text-gray-400">MRR</div>
            </div>
            <div className="text-center p-3 bg-blue-900/20 rounded-lg">
              <div className="text-2xl font-bold text-blue-400">
                {dashboardData.revenueMetrics.growth}%
              </div>
              <div className="text-sm text-gray-400">Growth</div>
            </div>
            <div className="text-center p-3 bg-purple-900/20 rounded-lg">
              <div className="text-2xl font-bold text-purple-400">
                {dashboardData.revenueMetrics.churn}%
              </div>
              <div className="text-sm text-gray-400">Churn</div>
            </div>
          </div>
          
          <div className="mt-6">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={dashboardData.financialProjections}>
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
                <Line type="monotone" dataKey="revenue" stroke="#10B981" strokeWidth={2} />
                <Line type="monotone" dataKey="projection" stroke="#3B82F6" strokeWidth={2} strokeDasharray="5 5" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </FeatureLockOverlay>
  )
}

// Partner Introductions with Gating
const PartnerIntroductionsCard = () => {
  return (
    <FeatureLockOverlay 
      feature="partnerIntros"
      title="Partner Introductions"
      description="Connect with strategic partners and unlock new opportunities"
    >
      <Card className="bg-gray-900/50 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Partner Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData.partnerOpportunities.map((partner) => (
              <div key={partner.id} className="border border-gray-600 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-semibold text-white">{partner.name}</h4>
                  <Badge className="bg-purple-500 text-white">{partner.stage}</Badge>
                </div>
                <div className="text-sm text-gray-400 mb-2">{partner.type}</div>
                <div className="flex items-center justify-between">
                  <span className="text-green-400 font-bold">
                    ${(partner.value / 1000).toFixed(0)}K value
                  </span>
                  <span className="text-blue-400">{partner.probability}% probability</span>
                </div>
              </div>
            ))}
          </div>
          
          <Button className="w-full mt-4 bg-purple-600 hover:bg-purple-700">
            <ExternalLink className="w-4 h-4 mr-2" />
            Request Introduction
          </Button>
        </CardContent>
      </Card>
    </FeatureLockOverlay>
  )
}

// Crypto Vesting with Gating
const CryptoVestingCard = () => {
  const vestingProgress = (dashboardData.cryptoVesting.vestedTokens / dashboardData.cryptoVesting.totalTokens) * 100

  return (
    <FeatureLockOverlay 
      feature="cryptoVesting"
      title="Crypto Vesting Schedule"
      description="Track your token vesting and manage crypto assets"
    >
      <Card className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 border-yellow-400/30">
        <CardHeader>
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <Coins className="w-6 h-6" />
            Token Vesting
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Vesting Progress</span>
              <span className="text-white font-semibold">
                {(dashboardData.cryptoVesting.vestedTokens / 1000).toFixed(0)}K / {(dashboardData.cryptoVesting.totalTokens / 1000).toFixed(0)}K tokens
              </span>
            </div>
            
            <Progress value={vestingProgress} className="h-3" />
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-yellow-900/20 rounded-lg">
                <div className="text-xl font-bold text-yellow-400">
                  ${(dashboardData.cryptoVesting.currentValue / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-400">Current Value</div>
              </div>
              <div className="text-center p-3 bg-orange-900/20 rounded-lg">
                <div className="text-xl font-bold text-orange-400">
                  {(dashboardData.cryptoVesting.monthlyVesting / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-400">Monthly Vesting</div>
              </div>
            </div>
            
            <div className="text-center">
              <div className="text-sm text-gray-400 mb-2">Next Vesting Date</div>
              <div className="font-semibold text-white">
                {new Date(dashboardData.cryptoVesting.nextVesting).toLocaleDateString()}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </FeatureLockOverlay>
  )
}

// AI Mentor Chat (Always Available)
const AIMentorChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      content: 'Hello! I\'m your AI Mentor. I can help with basic questions during your trial.',
      timestamp: new Date()
    }
  ])
  const [newMessage, setNewMessage] = useState('')

  const sendMessage = () => {
    if (!newMessage.trim()) return

    const userMessage = {
      id: messages.length + 1,
      type: 'user',
      content: newMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setNewMessage('')

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        type: 'ai',
        content: 'I can provide basic guidance during your trial. Upgrade for advanced AI insights and personalized recommendations!',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, aiResponse])
    }, 1000)
  }

  return (
    <Card className="bg-gray-900/50 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-green-400 flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Mentor (Basic)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64 overflow-y-auto space-y-3 mb-4">
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
            </div>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Ask a basic question..."
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            className="flex-1 bg-gray-800 border-gray-600"
          />
          <Button onClick={sendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
const GatedDashboardContent = () => {
  const { subscriptionState } = useSubscription()
  
  return (
    <div className="space-y-6">
      {/* Trial Progress (only show during trial) */}
      {subscriptionState.status === SUBSCRIPTION_STATUS.TRIAL && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TrialProgress />
          </div>
          <div>
            <InlinePaymentRetry />
          </div>
        </div>
      )}
      
      {/* Payment Retry (only show when frozen/grace) */}
      {(subscriptionState.status === SUBSCRIPTION_STATUS.FROZEN || 
        subscriptionState.status === SUBSCRIPTION_STATUS.GRACE) && (
        <InlinePaymentRetry />
      )}

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {/* Always visible - Company valuation */}
        <ValuationWidget />
        
        {/* Always visible - AI Mentor (basic) */}
        <AIMentorChat />
        
        {/* Gated - Revenue metrics */}
        <RevenueMetricsCard />
        
        {/* Gated - Partner introductions */}
        <PartnerIntroductionsCard />
        
        {/* Gated - Crypto vesting */}
        <CryptoVestingCard />
        
        {/* Basic SSE Score (always visible) */}
        <Card className="bg-gray-900/50 border-gray-600/30">
          <CardHeader>
            <CardTitle className="text-gray-400 flex items-center gap-2">
              <Target className="w-6 h-6" />
              SSE Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">
                {founderProfile.currentSSE}
              </div>
              <div className="text-sm text-gray-400 mb-4">
                +{founderProfile.currentSSE - founderProfile.previousSSE} from last month
              </div>
              <Progress value={founderProfile.currentSSE} className="h-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// Main Component with Subscription Provider
export default function GatedStartupDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard')
  
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: Rocket },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'partners', label: 'Partners', icon: Users },
    { id: 'crypto', label: 'Crypto', icon: Coins },
    { id: 'settings', label: 'Settings', icon: Settings }
  ]

  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-gray-950 text-white">
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

              {/* User Info */}
              <div className="flex items-center gap-3">
                <Badge className="bg-blue-500 text-white">
                  {founderProfile.subscriptionTier.toUpperCase()}
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
              {founderProfile.company} • {founderProfile.stage} • {founderProfile.teamSize} employees
            </p>
          </motion.div>

          {/* Dashboard Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <GatedDashboardContent />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </SubscriptionProvider>
  )
}
