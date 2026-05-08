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
  TrendingUpIcon, TrendingDownIcon, DollarSignIcon, TargetIcon, UsersIcon
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

// Import LP Report Generator
import LPReportGenerator from './LPReportGenerator.jsx'

// ============================================================================
// VC PROFILE & PORTFOLIO DATA
// ============================================================================

const vcProfile = {
  id: 'vc_fund_456',
  name: 'Sarah Chen',
  fund: 'Alpha Ventures',
  title: 'Managing Partner',
  email: 'sarah.chen@alphaventures.com',
  tier: 'premium', // free, premium, enterprise
  
  // Fund Information
  fundData: {
    fundSize: 250000000, // $250M fund
    deployedCapital: 180000000, // $180M deployed
    remainingCapital: 70000000, // $70M remaining
    vintage: 2022,
    fundNumber: 'Fund III',
    lpCount: 45,
    targetReturns: {
      irr: 25, // Target 25% IRR
      moic: 3.5, // Target 3.5x MOIC
      dpi: 1.2 // Target 1.2x DPI
    }
  },
  
  // Performance Metrics
  metrics: {
    currentIRR: 28.4, // Current IRR
    currentMOIC: 2.8, // Current MOIC
    currentDPI: 0.9, // Current DPI
    alphaScore: 76, // AI-calculated alpha score
    portfolioValue: 450000000, // $450M portfolio value
    unrealizedGains: 270000000, // $270M unrealized
    realizedGains: 45000000, // $45M realized
    totalInvestments: 32,
    activeInvestments: 28,
    exits: 4
  },
  
  // Subscription & Billing
  billing: {
    plan: 'premium',
    monthlyPrice: 2499,
    annualPrice: 24990, // 17% discount
    status: 'active',
    nextBilling: '2024-12-15',
    paymentMethod: 'paystack',
    trialEndsAt: null
  }
}

// Portfolio Companies Data
const portfolioCompanies = [
  {
    id: 'company_1',
    name: 'CloudSec',
    sector: 'Cybersecurity',
    stage: 'Series B',
    investment: 8000000,
    currentValue: 24000000,
    moic: 3.0,
    irr: 45.2,
    sseScore: 92,
    lastRound: '2024-03-15',
    nextMilestone: 'Series C',
    riskLevel: 'low',
    alphaSignal: 'strong_buy',
    founderSentiment: 85,
    marketTrend: 'up',
    quarterlyGrowth: 23.5,
    burnRate: 450000,
    runway: 18,
    employees: 85,
    mrr: 1200000,
    churnRate: 2.1
  },
  {
    id: 'company_2',
    name: 'HealthTech',
    sector: 'Healthcare',
    stage: 'Series A',
    investment: 5000000,
    currentValue: 12000000,
    moic: 2.4,
    irr: 32.1,
    sseScore: 78,
    lastRound: '2023-11-20',
    nextMilestone: 'FDA Approval',
    riskLevel: 'medium',
    alphaSignal: 'hold',
    founderSentiment: 72,
    marketTrend: 'stable',
    quarterlyGrowth: 15.2,
    burnRate: 380000,
    runway: 14,
    employees: 45,
    mrr: 850000,
    churnRate: 3.8
  },
  {
    id: 'company_3',
    name: 'FinanceApp',
    sector: 'Fintech',
    stage: 'Seed',
    investment: 2000000,
    currentValue: 8000000,
    moic: 4.0,
    irr: 78.5,
    sseScore: 88,
    lastRound: '2024-01-10',
    nextMilestone: 'Series A',
    riskLevel: 'high',
    alphaSignal: 'strong_buy',
    founderSentiment: 91,
    marketTrend: 'up',
    quarterlyGrowth: 45.8,
    burnRate: 180000,
    runway: 22,
    employees: 25,
    mrr: 320000,
    churnRate: 1.5
  },
  {
    id: 'company_4',
    name: 'TechCo',
    sector: 'Enterprise SaaS',
    stage: 'Series C',
    investment: 12000000,
    currentValue: 36000000,
    moic: 3.0,
    irr: 28.9,
    sseScore: 85,
    lastRound: '2023-08-30',
    nextMilestone: 'IPO Prep',
    riskLevel: 'low',
    alphaSignal: 'buy',
    founderSentiment: 88,
    marketTrend: 'up',
    quarterlyGrowth: 18.7,
    burnRate: 850000,
    runway: 24,
    employees: 150,
    mrr: 2800000,
    churnRate: 1.8
  },
  {
    id: 'company_5',
    name: 'SaaSco',
    sector: 'Marketing Tech',
    stage: 'Series B',
    investment: 6000000,
    currentValue: 15000000,
    moic: 2.5,
    irr: 35.6,
    sseScore: 81,
    lastRound: '2023-12-05',
    nextMilestone: 'International Expansion',
    riskLevel: 'medium',
    alphaSignal: 'buy',
    founderSentiment: 79,
    marketTrend: 'stable',
    quarterlyGrowth: 21.3,
    burnRate: 420000,
    runway: 20,
    employees: 65,
    mrr: 980000,
    churnRate: 2.5
  },
  {
    id: 'company_6',
    name: 'DataCorp',
    sector: 'AI/ML',
    stage: 'Series A',
    investment: 4000000,
    currentValue: 16000000,
    moic: 4.0,
    irr: 65.2,
    sseScore: 94,
    lastRound: '2024-02-28',
    nextMilestone: 'Product Launch',
    riskLevel: 'medium',
    alphaSignal: 'strong_buy',
    founderSentiment: 93,
    marketTrend: 'up',
    quarterlyGrowth: 38.9,
    burnRate: 320000,
    runway: 16,
    employees: 35,
    mrr: 650000,
    churnRate: 1.2
  }
]

// Market Intelligence Data
const marketIntelligence = {
  sectorTrends: [
    { sector: 'AI/ML', growth: 45.2, funding: 12500000000, dealCount: 1250, avgValuation: 85000000, momentum: 'accelerating' },
    { sector: 'Fintech', growth: 23.8, funding: 8900000000, dealCount: 890, avgValuation: 65000000, momentum: 'stable' },
    { sector: 'Healthcare', growth: 18.5, funding: 7200000000, dealCount: 720, avgValuation: 55000000, momentum: 'recovering' },
    { sector: 'Cybersecurity', growth: 32.1, funding: 5800000000, dealCount: 580, avgValuation: 75000000, momentum: 'accelerating' },
    { sector: 'Enterprise SaaS', growth: 15.7, funding: 9800000000, dealCount: 980, avgValuation: 45000000, momentum: 'maturing' }
  ],
  marketConditions: {
    overallSentiment: 'bullish',
    volatilityIndex: 23.5,
    liquidityScore: 78,
    competitionLevel: 'high',
    valuationTrend: 'stable',
    exitEnvironment: 'favorable'
  },
  predictiveInsights: {
    nextQuarterFunding: 15200000000,
    emergingSectors: ['Quantum Computing', 'Climate Tech', 'Web3 Infrastructure'],
    riskFactors: ['Interest Rate Changes', 'Regulatory Uncertainty', 'Market Saturation'],
    opportunities: ['AI Automation', 'Healthcare Innovation', 'Sustainable Tech'],
    exitOpportunities: ['IPO Window Opening', 'Strategic Acquisitions', 'Secondary Markets']
  }
}

// Alpha Score Calculation Engine
class AlphaScoreEngine {
  static calculatePortfolioAlpha(companies) {
    let totalWeightedScore = 0
    let totalInvestment = 0
    
    companies.forEach(company => {
      const weight = company.investment
      const performanceScore = this.calculatePerformanceScore(company)
      const sentimentScore = company.founderSentiment
      const marketScore = this.getMarketScore(company.sector)
      
      const companyAlpha = (performanceScore * 0.5) + (sentimentScore * 0.3) + (marketScore * 0.2)
      totalWeightedScore += companyAlpha * weight
      totalInvestment += weight
    })
    
    return Math.round(totalWeightedScore / totalInvestment)
  }
  
  static calculatePerformanceScore(company) {
    const irrScore = Math.min(100, (company.irr / 50) * 100) // Normalize to 50% IRR = 100 points
    const moicScore = Math.min(100, (company.moic / 5) * 100) // Normalize to 5x MOIC = 100 points
    const growthScore = Math.min(100, (company.quarterlyGrowth / 50) * 100) // Normalize to 50% growth = 100 points
    
    return (irrScore * 0.4) + (moicScore * 0.3) + (growthScore * 0.3)
  }
  
  static getMarketScore(sector) {
    const sectorData = marketIntelligence.sectorTrends.find(s => s.sector === sector)
    if (!sectorData) return 50
    
    return Math.min(100, (sectorData.growth / 50) * 100) // Normalize to 50% growth = 100 points
  }
  
  static getAlphaSignalColor(signal) {
    switch (signal) {
      case 'strong_buy': return '#10B981'
      case 'buy': return '#3B82F6'
      case 'hold': return '#F59E0B'
      case 'sell': return '#EF4444'
      case 'strong_sell': return '#DC2626'
      default: return '#6B7280'
    }
  }
  
  static getAlphaSignalText(signal) {
    switch (signal) {
      case 'strong_buy': return 'Strong Buy'
      case 'buy': return 'Buy'
      case 'hold': return 'Hold'
      case 'sell': return 'Sell'
      case 'strong_sell': return 'Strong Sell'
      default: return 'No Signal'
    }
  }
}

// IRR Calculation Engine
class IRRCalculationEngine {
  static calculateIRR(cashFlows) {
    // Newton-Raphson method for IRR calculation
    let irr = 0.1 // Initial guess
    const tolerance = 0.0001
    const maxIterations = 100
    
    for (let i = 0; i < maxIterations; i++) {
      const npv = this.calculateNPV(cashFlows, irr)
      const npvDerivative = this.calculateNPVDerivative(cashFlows, irr)
      
      if (Math.abs(npv) < tolerance) break
      
      irr = irr - (npv / npvDerivative)
    }
    
    return irr * 100 // Convert to percentage
  }
  
  static calculateNPV(cashFlows, rate) {
    return cashFlows.reduce((npv, cashFlow, index) => {
      return npv + (cashFlow / Math.pow(1 + rate, index))
    }, 0)
  }
  
  static calculateNPVDerivative(cashFlows, rate) {
    return cashFlows.reduce((derivative, cashFlow, index) => {
      if (index === 0) return derivative
      return derivative - (index * cashFlow / Math.pow(1 + rate, index + 1))
    }, 0)
  }
  
  static calculateMOIC(investment, currentValue) {
    return currentValue / investment
  }
  
  static calculateDPI(distributions, investment) {
    return distributions / investment
  }
  
  static projectFutureIRR(currentIRR, timeHorizon, growthRate) {
    // Simple compound growth projection
    return currentIRR * Math.pow(1 + growthRate, timeHorizon)
  }
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
      message: 'Burn rate increased 25% - runway down to 14 months',
      action: 'Review bridge funding options',
      impact: 'High'
    },
    {
      id: 'alert_2',
      type: 'opportunity',
      company: 'DataCorp',
      message: 'Strong Q3 performance - consider follow-on investment',
      action: 'Evaluate Series B participation',
      impact: 'Medium'
    }
  ])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 animate-pulse" />
            <div>
              <strong>ALPHA INTELLIGENCE:</strong>
              <span className="ml-2">
                Portfolio Alpha Score: {AlphaScoreEngine.calculatePortfolioAlpha(portfolioCompanies)} • 
                {criticalAlerts.length} critical alerts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              Live AI Analysis
            </Badge>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100"
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

// Alpha Score Display Component
const AlphaScoreDisplay = () => {
  const [alphaScore, setAlphaScore] = useState(76)
  const [trend, setTrend] = useState({ direction: 'up', change: 4.2 })
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time alpha score updates
  useEffect(() => {
    const interval = setInterval(() => {
      const change = (Math.random() - 0.5) * 2 // Random change between -1 and 1
      setAlphaScore(prev => Math.max(0, Math.min(100, prev + change)))
      setTrend({
        direction: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
        change: Math.abs(change)
      })
      setLastUpdate(new Date())
    }, 30000) // Update every 30 seconds

    return () => clearInterval(interval)
  }, [])

  const getScoreColor = (score) => {
    if (score >= 80) return '#10B981' // Green
    if (score >= 60) return '#3B82F6' // Blue
    if (score >= 40) return '#F59E0B' // Yellow
    return '#EF4444' // Red
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Exceptional Alpha'
    if (score >= 60) return 'Strong Alpha'
    if (score >= 40) return 'Moderate Alpha'
    return 'Weak Alpha'
  }

  return (
    <Card className="bg-gradient-to-br from-blue-900/20 to-purple-900/20 border-blue-400/30">
      <CardHeader>
        <CardTitle className="text-blue-400 flex items-center gap-2">
          <Brain className="w-6 h-6" />
          Portfolio Alpha Intelligence
          <Badge variant="premium" className="ml-2 animate-pulse">
            Live AI Analysis
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          {/* Alpha Score Gauge */}
          <div className="relative w-48 h-48 mx-auto mb-6">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r="40"
                stroke="#374151"
                strokeWidth="8"
                fill="none"
              />
              {/* Progress circle */}
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
              <div className="text-4xl font-bold" style={{ color: getScoreColor(alphaScore) }}>
                {Math.round(alphaScore)}
              </div>
              <div className="text-sm text-gray-400">{getScoreLabel(alphaScore)}</div>
            </div>
          </div>

          {/* Trend Indicator */}
          <div className={`flex items-center justify-center gap-2 text-lg font-semibold mb-4 ${
            trend.direction === 'up' ? 'text-green-400' : 
            trend.direction === 'down' ? 'text-red-400' : 'text-yellow-400'
          }`}>
            {trend.direction === 'up' && <TrendingUp className="w-5 h-5" />}
            {trend.direction === 'down' && <TrendingDown className="w-5 h-5" />}
            {trend.direction === 'stable' && <ArrowRight className="w-5 h-5" />}
            <span>{trend.direction === 'up' ? '+' : trend.direction === 'down' ? '-' : '±'}{trend.change.toFixed(1)} points</span>
          </div>

          {/* AI Insights */}
          <div className="bg-gray-800/50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-white mb-2">AI Alpha Insights</h4>
            <p className="text-gray-300 text-sm">
              Your portfolio is performing <strong>{alphaScore > 70 ? '9% above' : 'below'}</strong> market expectations.
              {alphaScore > 75 && (
                <span className="text-green-400 font-semibold">
                  {' '}DataCorp and FinanceApp are driving exceptional returns.
                </span>
              )}
              {alphaScore < 60 && (
                <span className="text-orange-400 font-semibold">
                  {' '}HealthTech requires immediate attention - consider bridge funding.
                </span>
              )}
            </p>
          </div>

          {/* Last Updated */}
          <div className="text-xs text-gray-400 flex items-center justify-center gap-1">
            <RefreshCw className="w-3 h-3" />
            Last updated: {lastUpdate.toLocaleTimeString()} • Next update: in 30s
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Portfolio Performance Metrics
const PortfolioMetrics = () => {
  const metrics = vcProfile.metrics

  const metricsData = [
    {
      label: 'Current IRR',
      value: `${metrics.currentIRR}%`,
      target: `${vcProfile.fundData.targetReturns.irr}%`,
      trend: 'up',
      change: '+2.1%',
      color: 'green',
      icon: TrendingUp,
      description: 'Internal Rate of Return'
    },
    {
      label: 'Current MOIC',
      value: `${metrics.currentMOIC}x`,
      target: `${vcProfile.fundData.targetReturns.moic}x`,
      trend: 'up',
      change: '+0.3x',
      color: 'blue',
      icon: Target,
      description: 'Multiple on Invested Capital'
    },
    {
      label: 'Current DPI',
      value: `${metrics.currentDPI}x`,
      target: `${vcProfile.fundData.targetReturns.dpi}x`,
      trend: 'stable',
      change: '+0.1x',
      color: 'yellow',
      icon: DollarSign,
      description: 'Distributions to Paid-in Capital'
    },
    {
      label: 'Portfolio Value',
      value: `$${(metrics.portfolioValue / 1000000).toFixed(0)}M`,
      target: `$${(vcProfile.fundData.fundSize * 2.5 / 1000000).toFixed(0)}M`,
      trend: 'up',
      change: '+$45M',
      color: 'purple',
      icon: Wallet,
      description: 'Total Portfolio Valuation'
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
            <Card className="bg-gray-900/50 border-gray-700 hover:border-gray-600 transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <Icon className={`w-8 h-8 text-${metric.color}-400 group-hover:scale-110 transition-transform`} />
                  <Badge variant={metric.trend === 'up' ? 'success' : metric.trend === 'down' ? 'destructive' : 'warning'}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className="text-xs text-gray-500">
                    Target: {metric.target}
                  </div>
                  <div className="text-xs text-gray-400 italic">
                    {metric.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// Portfolio Companies Grid with Enhanced Details
const PortfolioCompaniesGrid = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [sortBy, setSortBy] = useState('irr')
  const [filterBy, setFilterBy] = useState('all')

  const sortedCompanies = [...portfolioCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'irr': return b.irr - a.irr
      case 'moic': return b.moic - a.moic
      case 'value': return b.currentValue - a.currentValue
      case 'risk': 
        const riskOrder = { low: 1, medium: 2, high: 3 }
        return riskOrder[a.riskLevel] - riskOrder[b.riskLevel]
      case 'sse': return b.sseScore - a.sseScore
      default: return 0
    }
  })

  const filteredCompanies = sortedCompanies.filter(company => {
    if (filterBy === 'all') return true
    if (filterBy === 'high_performers') return company.irr > 30
    if (filterBy === 'at_risk') return company.runway < 18
    if (filterBy === 'strong_signals') return company.alphaSignal === 'strong_buy'
    if (filterBy === 'unicorn_potential') return company.currentValue > 10000000
    return true
  })

  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400 bg-green-900/20 border-green-400/30'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      case 'high': return 'text-red-400 bg-red-900/20 border-red-400/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
    }
  }

  const getSignalColor = (signal) => {
    return AlphaScoreEngine.getAlphaSignalColor(signal)
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Portfolio Companies
            <Badge variant="outline" className="ml-2">
              {filteredCompanies.length} companies
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="irr">Sort by IRR</option>
              <option value="moic">Sort by MOIC</option>
              <option value="value">Sort by Value</option>
              <option value="risk">Sort by Risk</option>
              <option value="sse">Sort by SSE Score</option>
            </select>
            <select
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value)}
              className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
            >
              <option value="all">All Companies</option>
              <option value="high_performers">High Performers (IRR >30%)</option>
              <option value="at_risk">At Risk (Runway <18mo)</option>
              <option value="strong_signals">Strong Buy Signals</option>
              <option value="unicorn_potential">Unicorn Potential (>$10M)</option>
            </select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCompanies.map((company) => (
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
                <Badge 
                  className={getRiskColor(company.riskLevel)}
                >
                  {company.riskLevel} risk
                </Badge>
              </div>

              <div className="grid grid-cols-3 gap-2 mb-3">
                <div>
                  <div className="text-lg font-bold text-green-400">
                    {company.irr.toFixed(1)}%
                  </div>
                  <div className="text-xs text-gray-400">IRR</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-blue-400">
                    {company.moic.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-400">MOIC</div>
                </div>
                <div>
                  <div className="text-lg font-bold text-purple-400">
                    {company.sseScore}
                  </div>
                  <div className="text-xs text-gray-400">SSE</div>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-sm">
                  <span className="text-gray-400">Value: </span>
                  <span className="text-white font-semibold">
                    ${(company.currentValue / 1000000).toFixed(1)}M
                  </span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-400">MRR: </span>
                  <span className="text-green-400 font-semibold">
                    ${(company.mrr / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="text-xs text-gray-400">
                  {company.employees} employees • {company.runway}mo runway
                </div>
                <div className="text-xs text-gray-400">
                  Churn: {company.churnRate}%
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Badge 
                  style={{ 
                    backgroundColor: getSignalColor(company.alphaSignal),
                    color: 'white'
                  }}
                >
                  {AlphaScoreEngine.getAlphaSignalText(company.alphaSignal)}
                </Badge>
                <div className="text-xs text-gray-400">
                  Next: {company.nextMilestone}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Market Intelligence Dashboard
const MarketIntelligence = () => {
  const [selectedSector, setSelectedSector] = useState(null)

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Radar className="w-6 h-6" />
          Market Intelligence
          <Badge variant="premium" className="ml-2">
            AI-Powered • Live Data
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Market Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-400">
              {marketIntelligence.marketConditions.overallSentiment === 'bullish' ? '📈' : '📉'}
            </div>
            <div className="text-sm text-gray-400">Market Sentiment</div>
            <div className="text-xs text-blue-400 font-semibold">
              {marketIntelligence.marketConditions.overallSentiment.toUpperCase()}
            </div>
          </div>
          <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-400/30">
            <div className="text-2xl font-bold text-green-400">
              {marketIntelligence.marketConditions.liquidityScore}
            </div>
            <div className="text-sm text-gray-400">Liquidity Score</div>
            <div className="text-xs text-green-400 font-semibold">HIGH</div>
          </div>
          <div className="text-center p-3 bg-yellow-900/20 rounded-lg border border-yellow-400/30">
            <div className="text-2xl font-bold text-yellow-400">
              {marketIntelligence.marketConditions.volatilityIndex}
            </div>
            <div className="text-sm text-gray-400">Volatility Index</div>
            <div className="text-xs text-yellow-400 font-semibold">MODERATE</div>
          </div>
          <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
            <div className="text-2xl font-bold text-purple-400">
              ${(marketIntelligence.predictiveInsights.nextQuarterFunding / 1000000000).toFixed(1)}B
            </div>
            <div className="text-sm text-gray-400">Q4 Funding Forecast</div>
            <div className="text-xs text-purple-400 font-semibold">PROJECTED</div>
          </div>
        </div>

        {/* Sector Trends */}
        <div className="mb-6">
          <h4 className="font-semibold text-white mb-4">Sector Performance & Trends</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {marketIntelligence.sectorTrends.map((sector) => (
              <motion.div
                key={sector.sector}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedSector === sector.sector
                    ? 'border-blue-400 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
                onClick={() => setSelectedSector(sector.sector)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-semibold text-white">{sector.sector}</h5>
                  <div className="flex items-center gap-1">
                    <Badge variant={sector.growth > 30 ? 'success' : sector.growth > 20 ? 'warning' : 'secondary'}>
                      {sector.growth.toFixed(1)}%
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {sector.momentum}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Funding:</span>
                    <span className="text-white">${(sector.funding / 1000000000).toFixed(1)}B</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Deals:</span>
                    <span className="text-white">{sector.dealCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Avg Valuation:</span>
                    <span className="text-white">${(sector.avgValuation / 1000000).toFixed(0)}M</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Predictive Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-white mb-4">Emerging Opportunities</h4>
            <div className="space-y-3">
              {marketIntelligence.predictiveInsights.opportunities.map((opp, index) => (
                <div key={index} className="p-3 bg-green-900/20 border border-green-400/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <span className="text-green-400 font-semibold">{opp}</span>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                <h5 className="font-semibold text-blue-400 mb-2">Exit Opportunities</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  {marketIntelligence.predictiveInsights.exitOpportunities.map((exit, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <ArrowUpRight className="w-3 h-3 text-blue-400" />
                      {exit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-white mb-4">Risk Factors & Monitoring</h4>
            <div className="space-y-3">
              {marketIntelligence.predictiveInsights.riskFactors.map((risk, index) => (
                <div key={index} className="p-3 bg-red-900/20 border border-red-400/30 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-400" />
                    <span className="text-red-400 font-semibold">{risk}</span>
                  </div>
                </div>
              ))}
              <div className="p-3 bg-purple-900/20 border border-purple-400/30 rounded-lg">
                <h5 className="font-semibold text-purple-400 mb-2">Emerging Sectors</h5>
                <ul className="text-sm text-gray-300 space-y-1">
                  {marketIntelligence.predictiveInsights.emergingSectors.map((sector, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Sparkles className="w-3 h-3 text-purple-400" />
                      {sector}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// IRR Prediction Engine Component
const IRRPredictionEngine = () => {
  const [timeHorizon, setTimeHorizon] = useState(5)
  const [growthAssumption, setGrowthAssumption] = useState(0.15)
  const [predictions, setPredictions] = useState(null)

  const calculatePredictions = () => {
    const currentIRR = vcProfile.metrics.currentIRR
    const projectedIRR = IRRCalculationEngine.projectFutureIRR(currentIRR, timeHorizon, growthAssumption)
    
    const scenarios = [
      {
        name: 'Bear Case',
        growth: growthAssumption * 0.6,
        irr: IRRCalculationEngine.projectFutureIRR(currentIRR, timeHorizon, growthAssumption * 0.6),
        probability: 20,
        color: '#EF4444'
      },
      {
        name: 'Base Case',
        growth: growthAssumption,
        irr: projectedIRR,
        probability: 50,
        color: '#3B82F6'
      },
      {
        name: 'Bull Case',
        growth: growthAssumption * 1.4,
        irr: IRRCalculationEngine.projectFutureIRR(currentIRR, timeHorizon, growthAssumption * 1.4),
        probability: 30,
        color: '#10B981'
      }
    ]

    setPredictions(scenarios)
  }

  useEffect(() => {
    calculatePredictions()
  }, [timeHorizon, growthAssumption])

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Calculator className="w-6 h-6" />
          IRR Prediction Engine
          <Badge variant="premium" className="ml-2">
            AI-Powered Monte Carlo
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Controls */}
          <div>
            <h4 className="font-semibold text-white mb-4">Prediction Parameters</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Time Horizon: {timeHorizon} years
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={timeHorizon}
                  onChange={(e) => setTimeHorizon(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1yr</span>
                  <span>10yr</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Growth Assumption: {(growthAssumption * 100).toFixed(1)}%
                </label>
                <input
                  type="range"
                  min="0.05"
                  max="0.30"
                  step="0.01"
                  value={growthAssumption}
                  onChange={(e) => setGrowthAssumption(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>5%</span>
                  <span>30%</span>
                </div>
              </div>
              <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                <div className="text-sm text-blue-400 font-semibold mb-1">Current Portfolio IRR</div>
                <div className="text-3xl font-bold text-white">{vcProfile.metrics.currentIRR}%</div>
                <div className="text-xs text-gray-400 mt-1">
                  Target: {vcProfile.fundData.targetReturns.irr}% • 
                  Outperforming by {(vcProfile.metrics.currentIRR - vcProfile.fundData.targetReturns.irr).toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Predictions */}
          <div>
            <h4 className="font-semibold text-white mb-4">Monte Carlo Scenario Analysis</h4>
            {predictions && (
              <div className="space-y-4">
                {predictions.map((scenario, index) => (
                  <motion.div
                    key={scenario.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-4 rounded-lg border"
                    style={{ 
                      borderColor: scenario.color + '50',
                      backgroundColor: scenario.color + '20'
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-semibold text-white">{scenario.name}</h5>
                      <Badge variant="outline" style={{ color: scenario.color, borderColor: scenario.color }}>
                        {scenario.probability}% probability
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-400">Projected IRR</div>
                        <div className="text-2xl font-bold text-white">
                          {scenario.irr.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-400">Growth Rate</div>
                        <div className="text-lg font-semibold text-white">
                          {(scenario.growth * 100).toFixed(1)}%
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-600">
                      <div className="text-sm text-gray-400">Portfolio Value Projection</div>
                      <div className="text-lg font-bold" style={{ color: scenario.color }}>
                        ${((vcProfile.metrics.portfolioValue * (scenario.irr / 100) * timeHorizon) / 1000000).toFixed(0)}M
                      </div>
                    </div>
                  </motion.div>
                ))}
                
                {/* Summary */}
                <div className="mt-6 p-4 bg-gray-800/50 border border-gray-600 rounded-lg">
                  <h5 className="font-semibold text-white mb-2">AI Recommendation</h5>
                  <p className="text-sm text-gray-300">
                    Based on current portfolio performance and market conditions, there's a{' '}
                    <span className="text-green-400 font-semibold">80% probability</span> of exceeding target returns.
                    Consider <span className="text-blue-400 font-semibold">increasing allocation</span> to AI/ML and Fintech sectors.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
export default function FerrariVCDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Alpha Overview', icon: Brain },
    { id: 'companies', label: 'Portfolio', icon: Building2 },
    { id: 'market', label: 'Market Intel', icon: Radar },
    { id: 'predictions', label: 'IRR Engine', icon: Calculator },
    { id: 'reports', label: 'LP Reports', icon: FileText }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <AlphaScoreDisplay />
            <PortfolioMetrics />
          </div>
        )
      case 'companies':
        return <PortfolioCompaniesGrid />
      case 'market':
        return <MarketIntelligence />
      case 'predictions':
        return <IRRPredictionEngine />
      case 'reports':
        return <LPReportGenerator />
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
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AUXEIRA VC
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
              <Badge className="bg-green-500 text-white">
                IRR: {vcProfile.metrics.currentIRR}%
              </Badge>
              <Badge className="bg-blue-500 text-white">
                MOIC: {vcProfile.metrics.currentMOIC}x
              </Badge>
              <Badge className="bg-purple-500 text-white">
                Alpha: {AlphaScoreEngine.calculatePortfolioAlpha(portfolioCompanies)}
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
            Welcome back, {vcProfile.name}
          </h1>
          <p className="text-gray-400">
            {vcProfile.fund} • {vcProfile.title} • 
            ${(vcProfile.fundData.fundSize / 1000000).toFixed(0)}M Fund • 
            {vcProfile.metrics.activeInvestments} Active Investments • 
            Alpha Score: {AlphaScoreEngine.calculatePortfolioAlpha(portfolioCompanies)}
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
