import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, TrendingDown, DollarSign, Target, Users, Brain, Zap, Shield,
  AlertTriangle, CheckCircle, Clock, Flame, Trophy, Lightbulb, MessageCircle,
  Bot, Activity, BarChart3, PieChart, Eye, EyeOff, Settings, Plus, ArrowRight,
  Sparkles, Crown, Gem, Coins, Calendar, FileText, Link, ExternalLink, Upload,
  Download, Play, Pause, X, Send, Wallet, AlertCircle, CheckSquare, Square,
  Camera, Mic, Video, FileImage, Percent, Calculator, Network, Share2, Bell,
  Bookmark, Heart, Filter, Search, MoreHorizontal, ChevronRight, ChevronDown,
  ChevronUp, Info, HelpCircle, Lock, Unlock, Globe, MapPin, Building, Mail,
  Phone, CreditCard, Package, Upgrade, Volume2, MicOff, Users2, BarChart4,
  ArrowUpRight, ArrowDownLeft, Timer, ZapOff, HeartHandshake, GitBranch, Cpu,
  Database, Cloud, Server, Code, Cog, WalletCards, Landmark, Building2, Briefcase,
  PhoneCall, MessageSquare, ThumbsUp, ThumbsDown, Vote, UsersRound, UserCheck,
  UserX, UserPlus, UserMinus, RefreshCw, Layers, Radar, Gauge, Pulse, Waves,
  Satellite, Crosshair, Fingerprint, ShieldCheck, KeyRound, Scan, MonitorSpeaker,
  Headphones, ScanLine, LineChart, AreaChart, Scatter, BarChart2, PieChart as PieChartIcon,
  TrendingUpIcon, TrendingDownIcon, DollarSignIcon, TargetIcon, UsersIcon, Ghost,
  Zap as ZapIcon, Star, Award, Briefcase as BriefcaseIcon, Globe as GlobeIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'
import { 
  LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart as RechartsAreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, 
  Radar, BarChart, Bar, PieChart as RechartsPieChart, Cell, ScatterChart, Scatter as RechartsScatter,
  ComposedChart, ReferenceLine, Treemap
} from 'recharts'

// ============================================================================
// ANGEL INVESTOR PROFILE & PORTFOLIO DATA
// ============================================================================

const angelProfile = {
  id: 'angel_investor_789',
  name: 'Michael Chen',
  title: 'Angel Investor & Former VP Engineering',
  email: 'michael.chen@angelinvestor.com',
  tier: 'free', // free, standard, premium
  location: 'San Francisco, CA',
  
  // Investment Profile
  investmentProfile: {
    totalInvested: 240000,
    portfolioValue: 1800000,
    activeInvestments: 8,
    exits: 2,
    avgCheckSize: 30000,
    preferredStages: ['Pre-seed', 'Seed'],
    sectors: ['SaaS', 'Fintech', 'AI/ML', 'Developer Tools'],
    geographies: ['US', 'Canada'],
    profileCompletion: 35
  },
  
  // Performance Metrics
  metrics: {
    totalROI: 7.5,
    alphaScore: 72,
    nudgeScore: 70, // Signal quality
    avgIRR: 45.2,
    successRate: 75, // % of investments that are performing well
    networkScore: 156, // Network connections
    dealflowScore: 89 // Quality of deal matches
  },
  
  // Subscription & Billing
  billing: {
    plan: 'free',
    monthlyPrice: 0,
    premiumPrice: 39,
    status: 'active',
    nextBilling: null,
    paymentMethod: null,
    trialEndsAt: null
  }
}

// Portfolio Companies Data
const portfolioCompanies = [
  {
    id: 'company_1',
    name: 'SaaSco',
    sector: 'Enterprise SaaS',
    stage: 'Series A',
    investment: 25000,
    currentValue: 180000,
    roi: 7.2,
    sseScore: 89,
    status: 'Strong Performer',
    lastUpdate: '2024-03-15',
    nextMilestone: 'Series B',
    riskLevel: 'low',
    founderSentiment: 92,
    marketTrend: 'up',
    quarterlyGrowth: 28.5,
    burnRate: 85000,
    runway: 22,
    employees: 45,
    mrr: 280000
  },
  {
    id: 'company_2',
    name: 'TechCo',
    sector: 'Developer Tools',
    stage: 'Seed',
    investment: 30000,
    currentValue: 210000,
    roi: 7.0,
    sseScore: 78,
    status: 'Healthy',
    lastUpdate: '2024-03-10',
    nextMilestone: 'Product Launch',
    riskLevel: 'low',
    founderSentiment: 85,
    marketTrend: 'up',
    quarterlyGrowth: 22.1,
    burnRate: 65000,
    runway: 18,
    employees: 28,
    mrr: 150000
  },
  {
    id: 'company_3',
    name: 'DataFlow',
    sector: 'AI/ML',
    stage: 'Pre-seed',
    investment: 20000,
    currentValue: 95000,
    roi: 4.75,
    sseScore: 65,
    status: 'Monitor',
    lastUpdate: '2024-03-08',
    nextMilestone: 'Seed Round',
    riskLevel: 'medium',
    founderSentiment: 72,
    marketTrend: 'stable',
    quarterlyGrowth: 15.8,
    burnRate: 35000,
    runway: 14,
    employees: 12,
    mrr: 45000
  },
  {
    id: 'company_4',
    name: 'HealthTech',
    sector: 'Healthcare',
    stage: 'Seed',
    investment: 35000,
    currentValue: 85000,
    roi: 2.43,
    sseScore: 42,
    status: 'At Risk',
    lastUpdate: '2024-03-05',
    nextMilestone: 'FDA Approval',
    riskLevel: 'high',
    founderSentiment: 58,
    marketTrend: 'down',
    quarterlyGrowth: -5.2,
    burnRate: 75000,
    runway: 8,
    employees: 22,
    mrr: 25000
  },
  {
    id: 'company_5',
    name: 'FinanceApp',
    sector: 'Fintech',
    stage: 'Seed',
    investment: 40000,
    currentValue: 220000,
    roi: 5.5,
    sseScore: 58,
    status: 'Monitor',
    lastUpdate: '2024-03-12',
    nextMilestone: 'Banking Partnership',
    riskLevel: 'medium',
    founderSentiment: 68,
    marketTrend: 'stable',
    quarterlyGrowth: 18.3,
    burnRate: 55000,
    runway: 16,
    employees: 18,
    mrr: 85000
  }
]

// Deal Flow Data
const dealFlowData = [
  {
    id: 'deal_1',
    companyName: 'CloudSecure',
    sector: 'Cybersecurity',
    stage: 'Seed',
    askAmount: 2000000,
    checkSize: 25000,
    matchScore: 94,
    sseScore: 87,
    location: 'San Francisco, CA',
    description: 'AI-powered cloud security platform for enterprise',
    founders: ['Sarah Kim (Ex-Google)', 'David Chen (Ex-AWS)'],
    traction: '$150K ARR, 25 enterprise customers',
    riskFactors: ['Competitive market', 'High burn rate'],
    opportunities: ['Large TAM', 'Strong team', 'Early traction'],
    timeline: '2 weeks left',
    leadInvestor: 'Andreessen Horowitz',
    warmIntro: true
  },
  {
    id: 'deal_2',
    companyName: 'DevTools Pro',
    sector: 'Developer Tools',
    stage: 'Pre-seed',
    askAmount: 1500000,
    checkSize: 20000,
    matchScore: 89,
    sseScore: 82,
    location: 'Austin, TX',
    description: 'No-code API testing and monitoring platform',
    founders: ['Alex Rodriguez (Ex-Stripe)', 'Maria Santos (Ex-Twilio)'],
    traction: '$50K ARR, 500+ developers using platform',
    riskFactors: ['Early stage', 'Market education needed'],
    opportunities: ['Growing developer tools market', 'Strong product-market fit'],
    timeline: '1 week left',
    leadInvestor: 'First Round Capital',
    warmIntro: false
  },
  {
    id: 'deal_3',
    companyName: 'FinTech Innovate',
    sector: 'Fintech',
    stage: 'Seed',
    askAmount: 3000000,
    checkSize: 35000,
    matchScore: 76,
    sseScore: 74,
    location: 'New York, NY',
    description: 'Digital banking platform for small businesses',
    founders: ['Jennifer Wu (Ex-Goldman Sachs)', 'Robert Kim (Ex-Square)'],
    traction: '$300K ARR, 1,200 business customers',
    riskFactors: ['Regulatory challenges', 'High customer acquisition cost'],
    opportunities: ['Underserved market', 'Strong financial metrics'],
    timeline: '3 weeks left',
    leadInvestor: 'Bessemer Venture Partners',
    warmIntro: true
  }
]

// Angel Radar Data (Premium Feature)
const angelRadarData = {
  cashSignals: {
    score: 78,
    trend: 'up',
    factors: [
      'Startup burn rates decreasing 15% across portfolio',
      'Average runway extended to 18 months',
      '3 companies showing positive cash flow'
    ]
  },
  sentimentSignals: {
    score: 65,
    trend: 'stable',
    factors: [
      'Founder confidence at 72% (industry avg: 68%)',
      'Team satisfaction scores improving',
      'Customer NPS averaging 45+'
    ]
  },
  exitSignals: {
    score: 82,
    trend: 'up',
    factors: [
      'M&A activity up 25% in target sectors',
      'IPO window showing signs of opening',
      '2 portfolio companies in acquisition talks'
    ]
  }
}

// Ghost Network Data (Premium Feature)
const ghostNetworkData = {
  networkSize: 156,
  activeConnections: 89,
  dealflowQuality: 94,
  introductionsMade: 23,
  connectionsThisMonth: 12,
  topConnectors: [
    { name: 'Sarah Johnson', title: 'Partner at Sequoia', connections: 45, deals: 8 },
    { name: 'David Kim', title: 'Angel Investor', connections: 38, deals: 12 },
    { name: 'Maria Rodriguez', title: 'VP at Stripe', connections: 32, deals: 5 }
  ],
  networkInsights: [
    'Your network strength in AI/ML sector: Top 15%',
    'Recommended connection: Lisa Chen (Fintech expert)',
    'Network gap identified: Healthcare sector connections'
  ]
}

// ============================================================================
// MAIN DASHBOARD COMPONENTS
// ============================================================================

// Critical Action Banner
const CriticalActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 'alert_1',
      type: 'urgent',
      company: 'HealthTech',
      message: 'SSE Score dropped to 42 - runway critical at 8 months',
      action: 'Consider bridge funding or exit strategy',
      impact: 'High'
    },
    {
      id: 'alert_2',
      type: 'opportunity',
      company: 'CloudSecure',
      message: 'New deal match: 94% compatibility with your thesis',
      action: 'Review investment opportunity',
      impact: 'Medium'
    }
  ])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-purple-500 to-blue-500 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Zap className="w-5 h-5 animate-pulse" />
            <div>
              <strong>ANGEL INTELLIGENCE:</strong>
              <span className="ml-2">
                Alpha Score: {angelProfile.metrics.alphaScore} • 
                {criticalAlerts.length} portfolio alerts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              Live AI Analysis
            </Badge>
            <Button 
              size="sm" 
              className="bg-white text-purple-600 hover:bg-gray-100"
              onClick={() => {/* Open alerts modal */}}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Insights
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
    </motion.div>
  )
}

// Profile Completion Widget
const ProfileCompletionWidget = () => {
  const [completionPercentage, setCompletionPercentage] = useState(angelProfile.investmentProfile.profileCompletion)
  
  const profileTasks = [
    { id: 1, task: 'Basic Info', completed: true },
    { id: 2, task: 'Investment Thesis', completed: false },
    { id: 3, task: 'Check Size & Preferences', completed: false },
    { id: 4, task: 'Industry Expertise', completed: false },
    { id: 5, task: 'Value-Add Services', completed: false }
  ]

  const completedTasks = profileTasks.filter(task => task.completed).length
  const totalTasks = profileTasks.length

  return (
    <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Complete Your Profile for Better Deals</h3>
          <Badge variant="outline" className="text-white border-white">
            {completionPercentage}%
          </Badge>
        </div>
        
        <div className="w-full bg-white/20 rounded-full h-3 mb-4">
          <div 
            className="bg-white h-3 rounded-full transition-all duration-500"
            style={{ width: `${completionPercentage}%` }}
          />
        </div>

        <p className="text-sm mb-4 opacity-90">
          Unlock personalized dealflow by completing your profile. We use this data to find your "line of best fit" investments.
        </p>

        <div className="space-y-2 mb-4">
          {profileTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                task.completed ? 'bg-white text-purple-500' : ''
              }`}>
                {task.completed && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${task.completed ? 'opacity-70 line-through' : ''}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-white text-purple-600 hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-2" />
          Complete Profile Now
        </Button>
      </CardContent>
    </Card>
  )
}

// Alpha Score Display
const AlphaScoreDisplay = () => {
  const [alphaScore, setAlphaScore] = useState(angelProfile.metrics.alphaScore)
  const [nudgeScore, setNudgeScore] = useState(angelProfile.metrics.nudgeScore)

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981'
    if (score >= 60) return '#3B82F6'
    if (score >= 40) return '#F59E0B'
    return '#EF4444'
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Exceptional'
    if (score >= 60) return 'Strong'
    if (score >= 40) return 'Moderate'
    return 'Needs Improvement'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Alpha Score */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Brain className="w-6 h-6" />
            Alpha Score
            <Badge variant="premium" className="ml-2">
              AI-Powered
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="relative w-32 h-32 mx-auto mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke="#374151"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  stroke={getScoreColor(alphaScore)}
                  strokeWidth="8"
                  fill="none"
                  strokeLinecap="round"
                  strokeDasharray={`${alphaScore * 2.51} 251`}
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-3xl font-bold" style={{ color: getScoreColor(alphaScore) }}>
                  {alphaScore}
                </div>
                <div className="text-xs text-gray-400">out of 100</div>
              </div>
            </div>
            <div className="text-sm text-gray-400 mb-2">{getScoreLabel(alphaScore)}</div>
            <div className="text-xs text-green-400">+8 vs last month</div>
          </div>
        </CardContent>
      </Card>

      {/* Nudge Score */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Radar className="w-6 h-6" />
            Nudge Score
            <Badge variant="outline" className="ml-2">
              Signal Quality
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">{nudgeScore}%</div>
            <div className="text-sm text-gray-400 mb-4">sticky, {100 - nudgeScore}% fluff</div>
            
            <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
              <div 
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                style={{ width: `${nudgeScore}%` }}
              />
            </div>
            
            <p className="text-xs text-gray-400">
              Angels ditch the noise with our proprietary signal filtering
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Portfolio Performance Metrics
const PortfolioMetrics = () => {
  const metrics = angelProfile.metrics
  const profile = angelProfile.investmentProfile

  const metricsData = [
    {
      label: 'Portfolio Value',
      value: `$${(profile.portfolioValue / 1000).toFixed(1)}K`,
      change: '+$180K',
      trend: 'up',
      color: 'green',
      icon: DollarSign
    },
    {
      label: 'Total ROI',
      value: `${metrics.totalROI}x`,
      change: '+0.8x',
      trend: 'up',
      color: 'blue',
      icon: TrendingUp
    },
    {
      label: 'Active Companies',
      value: profile.activeInvestments.toString(),
      change: '5 Healthy, 2 Monitor, 1 At Risk',
      trend: 'stable',
      color: 'purple',
      icon: Building2
    },
    {
      label: 'Success Rate',
      value: `${metrics.successRate}%`,
      change: '+5% vs peers',
      trend: 'up',
      color: 'yellow',
      icon: Target
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metricsData.map((metric, index) => {
        const Icon = metric.icon
        return (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-colors">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 text-${metric.color}-400`} />
                  <Badge variant={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'destructive' : 'secondary'}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// Portfolio Companies Grid
const PortfolioCompaniesGrid = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [sortBy, setSortBy] = useState('sseScore')

  const sortedCompanies = [...portfolioCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'sseScore': return b.sseScore - a.sseScore
      case 'roi': return b.roi - a.roi
      case 'value': return b.currentValue - a.currentValue
      default: return 0
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Strong Performer': return 'text-green-400 bg-green-900/20 border-green-400/30'
      case 'Healthy': return 'text-blue-400 bg-blue-900/20 border-blue-400/30'
      case 'Monitor': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      case 'At Risk': return 'text-red-400 bg-red-900/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Portfolio Companies
            <Badge variant="outline" className="ml-2">
              {sortedCompanies.length} companies
            </Badge>
          </CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="sseScore">Sort by SSE Score</option>
            <option value="roi">Sort by ROI</option>
            <option value="value">Sort by Value</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedCompanies.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-4 cursor-pointer hover:border-gray-500 transition-all"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-white">{company.name}</h4>
                  <p className="text-sm text-gray-400">{company.sector} • {company.stage}</p>
                </div>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {company.roi.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-400">ROI</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {company.sseScore}
                  </div>
                  <div className="text-xs text-gray-400">SSE</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    ${(company.currentValue / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">Value</div>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>Invested: ${(company.investment / 1000).toFixed(0)}K</span>
                <span>Runway: {company.runway}mo</span>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Deal Flow Component
const DealFlowGrid = () => {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filterBy, setFilterBy] = useState('all')

  const filteredDeals = dealFlowData.filter(deal => {
    if (filterBy === 'all') return true
    if (filterBy === 'high_match') return deal.matchScore >= 90
    if (filterBy === 'warm_intro') return deal.warmIntro
    return true
  })

  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 bg-green-900/20'
    if (score >= 75) return 'text-blue-400 bg-blue-900/20'
    if (score >= 60) return 'text-yellow-400 bg-yellow-900/20'
    return 'text-red-400 bg-red-900/20'
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Search className="w-6 h-6" />
            Personalized Deal Flow
            <Badge variant="premium" className="ml-2">
              AI-Matched
            </Badge>
          </CardTitle>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Deals</option>
            <option value="high_match">High Match (90%+)</option>
            <option value="warm_intro">Warm Introductions</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDeals.map((deal) => (
            <motion.div
              key={deal.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 hover:border-gray-500 transition-all"
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">{deal.companyName}</h4>
                  <p className="text-gray-400">{deal.sector} • {deal.stage}</p>
                  <p className="text-sm text-gray-300 mt-1">{deal.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getMatchScoreColor(deal.matchScore)} font-bold text-lg px-3 py-1`}>
                    {deal.matchScore}% Match
                  </Badge>
                  {deal.warmIntro && (
                    <Badge variant="success" className="ml-2">
                      Warm Intro
                    </Badge>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Ask Amount</div>
                  <div className="font-semibold text-white">${(deal.askAmount / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Your Check Size</div>
                  <div className="font-semibold text-green-400">${(deal.checkSize / 1000).toFixed(0)}K</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">SSE Score</div>
                  <div className="font-semibold text-purple-400">{deal.sseScore}</div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Founders</div>
                <div className="flex flex-wrap gap-2">
                  {deal.founders.map((founder, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {founder}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Opportunities</div>
                  <ul className="text-xs text-green-400 space-y-1">
                    {deal.opportunities.map((opp, index) => (
                      <li key={index}>• {opp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">Risk Factors</div>
                  <ul className="text-xs text-red-400 space-y-1">
                    {deal.riskFactors.map((risk, index) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <span className="mr-4">📍 {deal.location}</span>
                  <span className="mr-4">⏰ {deal.timeline}</span>
                  <span>🏢 Lead: {deal.leadInvestor}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    View Details
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Heart className="w-4 h-4 mr-1" />
                    Express Interest
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Angel Radar Component (Premium Feature)
const AngelRadar = ({ isPremium }) => {
  if (!isPremium) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 relative">
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Angel Radar - Premium Feature</h3>
            <p className="text-gray-400 text-sm mb-4">
              Get real-time signals on cash flow, sentiment, and exit opportunities
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
        <div className="blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Angel Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400">78</div>
                <div className="text-sm text-gray-400">Cash Signals</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">65</div>
                <div className="text-sm text-gray-400">Sentiment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-400">82</div>
                <div className="text-sm text-gray-400">Exit Signals</div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Radar className="w-6 h-6" />
          Angel Radar
          <Badge variant="premium" className="ml-2">
            Live Signals
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cash Signals */}
          <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-400/30">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {angelRadarData.cashSignals.score}
            </div>
            <div className="text-sm text-gray-400 mb-3">Cash Signals</div>
            <div className="space-y-1">
              {angelRadarData.cashSignals.factors.map((factor, index) => (
                <div key={index} className="text-xs text-gray-300">• {factor}</div>
              ))}
            </div>
          </div>

          {/* Sentiment Signals */}
          <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-400/30">
            <div className="text-3xl font-bold text-yellow-400 mb-2">
              {angelRadarData.sentimentSignals.score}
            </div>
            <div className="text-sm text-gray-400 mb-3">Sentiment</div>
            <div className="space-y-1">
              {angelRadarData.sentimentSignals.factors.map((factor, index) => (
                <div key={index} className="text-xs text-gray-300">• {factor}</div>
              ))}
            </div>
          </div>

          {/* Exit Signals */}
          <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-400/30">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {angelRadarData.exitSignals.score}
            </div>
            <div className="text-sm text-gray-400 mb-3">Exit Signals</div>
            <div className="space-y-1">
              {angelRadarData.exitSignals.factors.map((factor, index) => (
                <div key={index} className="text-xs text-gray-300">• {factor}</div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Ghost Network Component (Premium Feature)
const GhostNetwork = ({ isPremium }) => {
  if (!isPremium) {
    return (
      <Card className="bg-gray-900/50 border-gray-700 relative">
        <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
          <div className="text-center p-6">
            <Ghost className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="font-semibold text-white mb-2">Ghost Network - Premium Feature</h3>
            <p className="text-gray-400 text-sm mb-4">
              Access your invisible network and get warm introductions to deals
            </p>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </div>
        <div className="blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Ghost Network</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-white">156</div>
                <div className="text-sm text-gray-400">Network Size</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-400">94</div>
                <div className="text-sm text-gray-400">Deal Quality</div>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Ghost className="w-6 h-6" />
          Ghost Network
          <Badge variant="premium" className="ml-2">
            Invisible Connections
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-white">{ghostNetworkData.networkSize}</div>
            <div className="text-sm text-gray-400">Network Size</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-green-400">{ghostNetworkData.activeConnections}</div>
            <div className="text-sm text-gray-400">Active</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-blue-400">{ghostNetworkData.dealflowQuality}</div>
            <div className="text-sm text-gray-400">Deal Quality</div>
          </div>
          <div className="text-center p-3 bg-gray-800/50 rounded-lg">
            <div className="text-2xl font-bold text-purple-400">{ghostNetworkData.introductionsMade}</div>
            <div className="text-sm text-gray-400">Intros Made</div>
          </div>
        </div>

        <div className="mb-6">
          <h4 className="font-semibold text-white mb-3">Top Connectors</h4>
          <div className="space-y-3">
            {ghostNetworkData.topConnectors.map((connector, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                <div>
                  <div className="font-semibold text-white">{connector.name}</div>
                  <div className="text-sm text-gray-400">{connector.title}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-400">{connector.connections} connections</div>
                  <div className="text-xs text-gray-400">{connector.deals} deals</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-white mb-3">Network Insights</h4>
          <div className="space-y-2">
            {ghostNetworkData.networkInsights.map((insight, index) => (
              <div key={index} className="text-sm text-gray-300 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                {insight}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Flip Simulator Component
const FlipSimulator = () => {
  const [holdTime, setHoldTime] = useState(24)
  const [projectedReturn, setProjectedReturn] = useState(60000)

  useEffect(() => {
    // Simple calculation based on hold time
    const baseReturn = 45000
    const timeMultiplier = Math.pow(1.05, holdTime / 6) // 5% growth every 6 months
    setProjectedReturn(Math.round(baseReturn * timeMultiplier))
  }, [holdTime])

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          Flip Simulator
          <Badge variant="outline" className="ml-2">
            Exit Modeling
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-gray-400 text-sm mb-4">
          Drag hold time to see projected returns based on crawler comps
        </p>
        
        <div className="text-center mb-4">
          <div className="text-3xl font-bold text-blue-400 mb-2">
            {holdTime} months
          </div>
          <div className="text-sm text-gray-400">Hold Time</div>
        </div>

        <div className="mb-6">
          <input
            type="range"
            min="6"
            max="60"
            value={holdTime}
            onChange={(e) => setHoldTime(parseInt(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>6mo</span>
            <span>60mo</span>
          </div>
        </div>

        <div className="text-center p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
          <div className="text-3xl font-bold text-green-400 mb-2">
            ${(projectedReturn / 1000).toFixed(0)}K
          </div>
          <div className="text-sm text-gray-400">Sell now? = mock wire amount</div>
        </div>
      </CardContent>
    </Card>
  )
}

// Premium Paywall Teaser
const PremiumPaywallTeaser = () => {
  return (
    <Card className="bg-gradient-to-br from-purple-500 to-blue-500 text-white border-none">
      <CardContent className="p-8 text-center">
        <Crown className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">
          Your 2022 pick beats medians 33%… but fintech's slipping
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Unlock Premium features for $39/month to see detailed risk analysis and exit predictions
        </p>
        <Button className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-3">
          <CreditCard className="w-5 h-5 mr-2" />
          Unlock Premium for $39/month
        </Button>
        <p className="text-sm mt-3 opacity-75">
          Paystack pops - no login required
        </p>
      </CardContent>
    </Card>
  )
}

// LP Report Teaser Component
const LPReportTeaser = () => {
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Angel Investor Reports
          <Badge variant="outline" className="ml-2">
            Professional Reports
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <FileText className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">Generate Professional Reports</h3>
          <p className="text-gray-400">
            Create comprehensive portfolio reports for tax purposes, LP updates, or personal tracking
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-600">
            <h4 className="font-semibold text-white mb-2">Portfolio Summary</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Investment performance overview</li>
              <li>• ROI and IRR calculations</li>
              <li>• Risk assessment by company</li>
            </ul>
          </div>
          <div className="p-4 bg-gray-800/30 rounded-lg border border-gray-600">
            <h4 className="font-semibold text-white mb-2">Tax Documentation</h4>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Capital gains/losses summary</li>
              <li>• Investment timeline tracking</li>
              <li>• Professional formatting</li>
            </ul>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-white">Premium Report</h4>
              <p className="text-sm text-gray-400">Complete portfolio analysis with AI insights</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">$29</div>
              <div className="text-xs text-gray-400">One-time</div>
            </div>
          </div>
        </div>

        <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
          <Download className="w-4 h-4 mr-2" />
          Generate Report - $29
        </Button>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
export default function FerrariAngelInvestorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPremium, setIsPremium] = useState(false)
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'dealflow', label: 'Deal Flow', icon: Search },
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'angelradar', label: 'Angel Radar', icon: Radar, premium: true },
    { id: 'ghostnetwork', label: 'Ghost Network', icon: Ghost, premium: true },
    { id: 'reports', label: 'Reports', icon: FileText }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ProfileCompletionWidget />
            <PremiumPaywallTeaser />
            <AlphaScoreDisplay />
            <PortfolioMetrics />
            <FlipSimulator />
          </div>
        )
      case 'dealflow':
        return <DealFlowGrid />
      case 'portfolio':
        return <PortfolioCompaniesGrid />
      case 'angelradar':
        return <AngelRadar isPremium={isPremium} />
      case 'ghostnetwork':
        return <GhostNetwork isPremium={isPremium} />
      case 'reports':
        return <LPReportTeaser />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Critical Action Banner */}
      <CriticalActionBanner />

      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              AUXEIRA ANGEL
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
                        ? 'bg-purple-600 text-white'
                        : 'text-gray-400 hover:text-white hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                    {tab.premium && !isPremium && <Lock className="w-3 h-3 text-yellow-400" />}
                  </button>
                )
              })}
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <Badge className="bg-purple-500 text-white">
                Alpha: {angelProfile.metrics.alphaScore}
              </Badge>
              <Badge className="bg-blue-500 text-white">
                ROI: {angelProfile.metrics.totalROI}x
              </Badge>
              <Badge className="bg-green-500 text-white">
                Portfolio: ${(angelProfile.investmentProfile.portfolioValue / 1000).toFixed(0)}K
              </Badge>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                LIVE AI
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
            Welcome back, {angelProfile.name}
          </h1>
          <p className="text-gray-400">
            {angelProfile.title} • 
            ${(angelProfile.investmentProfile.totalInvested / 1000).toFixed(0)}K Invested • 
            {angelProfile.investmentProfile.activeInvestments} Active Companies • 
            Alpha Score: {angelProfile.metrics.alphaScore}
          </p>
        </motion.div>

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
  )
}
