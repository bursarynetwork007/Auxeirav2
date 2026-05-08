import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Rocket, Target, Users, TrendingUp, DollarSign, Zap, Brain, Award, Star,
  CheckCircle, AlertTriangle, Clock, Flame, Trophy, Lightbulb, MessageCircle,
  Bot, Shield, Activity, BarChart3, PieChart, Eye, EyeOff, Settings, Plus,
  ArrowRight, Sparkles, Crown, Gem, Coins, Calendar, FileText, Link, ExternalLink,
  Upload, Download, Play, Pause, X, Send, Wallet, TrendingDown, AlertCircle,
  CheckSquare, Square, Camera, Mic, Video, FileImage, Percent, Calculator,
  Network, Share2, Bell, Bookmark, Heart, Filter, Search, MoreHorizontal,
  ChevronRight, ChevronDown, ChevronUp, Info, HelpCircle, Lock, Unlock,
  Globe, MapPin, Building, Mail, Phone, CreditCard, Package, Upgrade,
  Volume2, MicOff, Users2, BarChart4, ArrowUpRight, ArrowDownLeft, Timer, 
  ZapOff, HeartHandshake, GitBranch, Cpu, Database, Cloud, Server, Code, Cog,
  WalletCards, Landmark, Building2, Briefcase, PhoneCall, MessageSquare,
  ThumbsUp, ThumbsDown, Vote, UsersRound, UserCheck, UserX, UserPlus, UserMinus,
  RefreshCw, Layers, Radar, Gauge, Pulse, Waves, Satellite, Crosshair,
  Fingerprint, ShieldCheck, KeyRound, Scan, MonitorSpeaker, Headphones,
  ScanLine, Zap as ZapIcon, Sparkles as SparklesIcon
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

// ============================================================================
// CORPORATE PARTNER PROFILE & DATA
// ============================================================================

const corporatePartnerProfile = {
  id: 'corp_partner_789',
  name: 'Marcus Chen',
  company: 'AWS Cloud Services',
  title: 'VP Strategic Partnerships',
  email: 'marcus.chen@aws.com',
  tier: 'executive', // base, executive, enterprise
  
  // Billing & Subscription
  billing: {
    seats: 3,
    baseSeats: 3,
    execSeats: 1,
    basePrice: 299, // per seat
    execPrice: 999, // per exec seat
    totalMonthly: (299 * 3) + (999 * 1), // $1,896/month
    status: 'active',
    nextBilling: '2024-11-15',
    paymentMethod: 'paystack',
    trialEndsAt: null,
    subscriptionTier: 'enterprise'
  },
  
  // Performance Metrics
  metrics: {
    shadowValue: 98000, // Unrealized paper gains
    influence: 72, // Influence score (0-100)
    streak: 15, // Days active
    saves: 8, // Startups helped
    conversionRate: 87, // Success rate
    totalExposure: 14500, // Total startup exposure
    rank: 7, // Leaderboard position
    score: 28, // Gamification score
    decayRate: 4 // Daily influence decay %
  },
  
  // Access Controls
  restrictions: {
    directFounderAccess: false, // Hard restriction
    introFee: 49, // Fee for founder introductions
    maxDailyActions: 25, // Action limits
    voiceCommands: true, // Executive tier feature
    blindAuctionSlots: 3 // Monthly auction slots
  },
  
  // Company Context
  companyData: {
    industry: 'Cloud Infrastructure',
    products: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'AWS RDS'],
    targetStartups: ['cloud', 'saas', 'ai', 'fintech'],
    partnershipBudget: 500000, // Annual budget
    region: 'North America'
  }
}

// Real-time Ecosystem Pulse Data
const ecosystemPulse = {
  lastUpdated: new Date(),
  totalSignals: 39,
  conversionProbability: 84,
  signals: [
    { 
      category: 'cloud', 
      count: 14, 
      conversionOdds: 87, 
      urgency: 'high',
      trend: 'up',
      change: 15,
      avgDeal: 2400,
      timeToClose: '3-5 days'
    },
    { 
      category: 'payment', 
      count: 8, 
      conversionOdds: 92, 
      urgency: 'medium',
      trend: 'up',
      change: 8,
      avgDeal: 1800,
      timeToClose: '1-2 days'
    },
    { 
      category: 'analytics', 
      count: 12, 
      conversionOdds: 78, 
      urgency: 'high',
      trend: 'stable',
      change: 2,
      avgDeal: 1200,
      timeToClose: '2-4 days'
    },
    { 
      category: 'ai', 
      count: 5, 
      conversionOdds: 95, 
      urgency: 'critical',
      trend: 'up',
      change: 25,
      avgDeal: 5000,
      timeToClose: '1-3 days'
    }
  ],
  marketIntelligence: {
    totalMarketSize: 2400000,
    auxeiraShare: 12.5,
    growthRate: 23.8,
    competitorActivity: 'moderate'
  }
}

// Blind Auction Engine Data
const blindAuctions = {
  active: [
    { 
      id: 'auction_1', 
      category: 'cloud', 
      commitment: '90-day exclusive lock', 
      score: 82, 
      timeLeft: '2h 15m',
      estimatedValue: 3500,
      startupSSE: 78,
      encrypted: true
    },
    { 
      id: 'auction_2', 
      category: 'payment', 
      commitment: '60-day priority access', 
      score: 91, 
      timeLeft: '1h 30m',
      estimatedValue: 2200,
      startupSSE: 85,
      encrypted: true
    },
    { 
      id: 'auction_3', 
      category: 'ai', 
      commitment: '120-day strategic partnership', 
      score: 96, 
      timeLeft: '4h 45m',
      estimatedValue: 8500,
      startupSSE: 92,
      encrypted: true
    }
  ],
  slotsRemaining: 3,
  totalThisMonth: 12,
  approvedThisMonth: 9,
  successRate: 75,
  avgROI: 340
}

// Founder Mirror Feed Data
const mirrorFeed = {
  activePleas: [
    { 
      id: 'plea_1', 
      category: 'cloud', 
      need: 'Need $1K cloud credits for MVP launch - cash crunch hitting hard', 
      urgency: 'high', 
      votes: { yes: 15, no: 3 },
      confidence: 83,
      estimatedImpact: 'high',
      timePosted: '2 hours ago'
    },
    { 
      id: 'plea_2', 
      category: 'payment', 
      need: 'Struggling with payment integration costs - $500/month killing us', 
      urgency: 'medium', 
      votes: { yes: 8, no: 2 },
      confidence: 80,
      estimatedImpact: 'medium',
      timePosted: '4 hours ago'
    },
    { 
      id: 'plea_3', 
      category: 'analytics', 
      need: 'Require analytics platform for seed round demo next week', 
      urgency: 'critical', 
      votes: { yes: 12, no: 1 },
      confidence: 92,
      estimatedImpact: 'high',
      timePosted: '1 hour ago'
    }
  ],
  recentApprovals: [
    { id: 'approval_1', category: 'cloud', impact: 'startup saved', timestamp: '2 hours ago', value: 1000 },
    { id: 'approval_2', category: 'payment', impact: 'growth enabled', timestamp: '1 day ago', value: 500 },
    { id: 'approval_3', category: 'ai', impact: 'demo success', timestamp: '2 days ago', value: 2000 }
  ],
  totalSaved: 47,
  totalValue: 125000
}

// Gamification & Leaderboard Data
const gamification = {
  leaderboard: {
    personal: { 
      rank: 7, 
      score: 28, 
      nextRank: 6, 
      gap: 2,
      tier: 'gold',
      nextTier: 'platinum'
    },
    top5: [
      { name: 'Alpha Architect', score: 42, revealed: true, tier: 'platinum' },
      { name: 'Stripe Ventures', score: 38, revealed: true, tier: 'platinum' },
      { name: 'Tech Angels', score: 31, revealed: true, tier: 'gold' },
      { name: 'Anonymous Partner', score: 30, revealed: false, tier: 'gold' },
      { name: 'Anonymous Partner', score: 29, revealed: false, tier: 'gold' }
    ],
    decay: { 
      rate: 4, 
      daysUntilDrop: 17, 
      currentTier: 'gold', 
      nextTier: 'silver',
      warningThreshold: 7
    }
  },
  influence: {
    current: 72,
    max: 100,
    dailyChange: -2,
    streak: 15,
    lastActive: new Date(),
    decayStarted: true
  },
  achievements: [
    { id: 'first_save', name: 'First Save', unlocked: true, rarity: 'common' },
    { id: 'streak_10', name: '10-Day Streak', unlocked: true, rarity: 'uncommon' },
    { id: 'top_10', name: 'Top 10 Partner', unlocked: true, rarity: 'rare' },
    { id: 'shadow_100k', name: 'Shadow Value 100K', unlocked: false, rarity: 'epic' }
  ]
}

// Shadow Value Calculation Engine
class ShadowValueEngine {
  static calculateShadowValue(monthlyInvestment, upliftMultiplier = 2.1, partnerWeight = 1.8) {
    // Actuarial calculation: base investment × market uplift × partner tier weight
    const baseValue = monthlyInvestment * 12 // Annualize
    const marketAdjustedValue = baseValue * upliftMultiplier
    const partnerAdjustedValue = marketAdjustedValue * partnerWeight
    
    // Add time-based appreciation (compound monthly)
    const monthsActive = 6 // Assume 6 months active
    const monthlyAppreciation = 1.02 // 2% monthly appreciation
    const timeAdjustedValue = partnerAdjustedValue * Math.pow(monthlyAppreciation, monthsActive)
    
    return Math.round(timeAdjustedValue)
  }

  static getROIMultiple(shadowValue, totalInvested) {
    return Math.round((shadowValue / totalInvested) * 10) / 10
  }

  static getValueTrend(currentValue, previousValue) {
    const change = ((currentValue - previousValue) / previousValue) * 100
    return {
      change: Math.round(change * 100) / 100,
      trend: change > 0 ? 'up' : change < 0 ? 'down' : 'stable',
      color: change > 0 ? 'green' : change < 0 ? 'red' : 'gray'
    }
  }
}

// Blind Auction Encryption Engine
class BlindAuctionEngine {
  static encryptStartupIdentity(startupData) {
    // Simulate AES-GCM encryption for startup identity
    const timestamp = Date.now()
    const randomSalt = Math.random().toString(36).substr(2, 9)
    return {
      encryptedId: `enc_${timestamp}_${randomSalt}`,
      category: startupData.category,
      score: startupData.score,
      commitment: startupData.commitment,
      estimatedValue: startupData.estimatedValue,
      encrypted: true,
      timestamp: new Date().toISOString()
    }
  }

  static calculateMatchScore(startup, partnerPreferences) {
    let score = 50 // Base score
    
    // Category match bonus
    if (partnerPreferences.targetStartups.includes(startup.category)) {
      score += 25
    }
    
    // SSE score bonus (higher SSE = better founders)
    score += (startup.startupSSE / 100) * 20
    
    // Commitment level bonus
    if (startup.commitment.includes('120')) score += 15
    else if (startup.commitment.includes('90')) score += 10
    else if (startup.commitment.includes('60')) score += 5
    
    // Urgency bonus
    if (startup.urgency === 'critical') score += 10
    else if (startup.urgency === 'high') score += 5
    
    return Math.min(100, Math.round(score))
  }
}

// Voice Command Engine (Executive Tier Only)
class VoiceCommandEngine {
  static isVoiceEnabled(tier) {
    return tier === 'executive' || tier === 'enterprise'
  }

  static processVoiceCommand(command) {
    const lowerCommand = command.toLowerCase()
    
    if (lowerCommand.includes('pulse') || lowerCommand.includes('signals')) {
      return { action: 'showPulse', data: ecosystemPulse }
    }
    
    if (lowerCommand.includes('auction') || lowerCommand.includes('bid')) {
      return { action: 'showAuctions', data: blindAuctions }
    }
    
    if (lowerCommand.includes('shadow') || lowerCommand.includes('value')) {
      return { action: 'showShadowValue', data: corporatePartnerProfile.metrics.shadowValue }
    }
    
    if (lowerCommand.includes('leaderboard') || lowerCommand.includes('rank')) {
      return { action: 'showLeaderboard', data: gamification.leaderboard }
    }
    
    return { action: 'unknown', message: 'Command not recognized. Try "show pulse" or "show auctions".' }
  }
}

// ============================================================================
// MAIN DASHBOARD COMPONENTS
// ============================================================================

// Critical Action Banner with Payment Status
const CriticalActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [paymentStatus, setPaymentStatus] = useState(corporatePartnerProfile.billing.status)

  if (!isVisible) return null

  if (paymentStatus === 'past_due') {
    return (
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 sticky top-0 z-50 shadow-lg"
      >
        <div className="container mx-auto flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 animate-pulse" />
            <div>
              <strong>PAYMENT REQUIRED:</strong>
              <span className="ml-2">Your partner access is frozen. Update payment to resume silent engine benefits.</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              size="sm" 
              className="bg-white text-red-600 hover:bg-gray-100"
              onClick={() => setPaymentStatus('active')}
            >
              <CreditCard className="w-4 h-4 mr-1" />
              Update Payment (${corporatePartnerProfile.billing.totalMonthly}/mo)
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

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <div>
            <strong>SILENT ENGINE ACTIVE:</strong>
            <span className="ml-2">
              Shadow value: ${corporatePartnerProfile.metrics.shadowValue.toLocaleString()} • 
              Influence: {corporatePartnerProfile.metrics.influence}% • 
              Rank: #{corporatePartnerProfile.metrics.rank}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="success" className="flex items-center gap-1">
            <Pulse className="w-3 h-3" />
            Live
          </Badge>
          <Badge className="bg-gold-500 text-black">
            {corporatePartnerProfile.tier.toUpperCase()}
          </Badge>
        </div>
      </div>
    </motion.div>
  )
}

// Real-time Ecosystem Pulse Component
const EcosystemPulse = () => {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [pulseData, setPulseData] = useState(ecosystemPulse)
  const [lastUpdate, setLastUpdate] = useState(new Date())

  // Simulate real-time updates every 5 seconds
  useEffect(() => {
    if (!autoRefresh) return
    
    const interval = setInterval(() => {
      setPulseData(prev => ({
        ...prev,
        signals: prev.signals.map(signal => ({
          ...signal,
          count: Math.max(1, signal.count + Math.floor(Math.random() * 3) - 1),
          conversionOdds: Math.min(99, Math.max(50, signal.conversionOdds + Math.floor(Math.random() * 6) - 3))
        }))
      }))
      setLastUpdate(new Date())
    }, 5000)
    
    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleCategoryBoost = (category) => {
    // Simulate category boost action
    console.log(`Boosting category: ${category}`)
    // In real implementation, this would call the backend API
  }

  return (
    <Card className="border-purple-400/30 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-purple-400 flex items-center gap-2">
            <Radar className="w-6 h-6" />
            Ecosystem Pulse
            <Badge variant="pulse" className="ml-2 animate-pulse">
              {pulseData.totalSignals} Signals
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={autoRefresh ? 'text-green-400 border-green-400' : 'text-gray-400'}
            >
              <RefreshCw className={`w-4 h-4 mr-1 ${autoRefresh ? 'animate-spin' : ''}`} />
              {autoRefresh ? 'Live' : 'Paused'}
            </Button>
            <Badge variant="outline" className="text-xs">
              {lastUpdate.toLocaleTimeString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Market Intelligence Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-400">
              ${(pulseData.marketIntelligence.totalMarketSize / 1000000).toFixed(1)}M
            </div>
            <div className="text-sm text-gray-400">Total Market</div>
          </div>
          <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-400/30">
            <div className="text-2xl font-bold text-green-400">
              {pulseData.marketIntelligence.auxeiraShare}%
            </div>
            <div className="text-sm text-gray-400">Auxeira Share</div>
          </div>
          <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
            <div className="text-2xl font-bold text-purple-400">
              {pulseData.marketIntelligence.growthRate}%
            </div>
            <div className="text-sm text-gray-400">Growth Rate</div>
          </div>
        </div>

        {/* Signal Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {pulseData.signals.map((signal, index) => (
            <motion.div
              key={signal.category}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedCategory === signal.category
                  ? 'border-purple-400 bg-purple-900/30 ring-2 ring-purple-400/50'
                  : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
              } ${
                signal.urgency === 'critical' ? 'ring-2 ring-red-400/50 animate-pulse' : 
                signal.urgency === 'high' ? 'ring-1 ring-orange-400/50' : ''
              }`}
              onClick={() => setSelectedCategory(signal.category)}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-semibold capitalize text-white">{signal.category}</h4>
                  {signal.trend === 'up' && (
                    <TrendingUp className="w-4 h-4 text-green-400" />
                  )}
                  {signal.trend === 'down' && (
                    <TrendingDown className="w-4 h-4 text-red-400" />
                  )}
                </div>
                <Badge 
                  variant={
                    signal.urgency === 'critical' ? 'destructive' : 
                    signal.urgency === 'high' ? 'warning' : 'secondary'
                  }
                  className="animate-pulse"
                >
                  {signal.count} signals
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Conversion Rate:</span>
                  <span className="font-bold text-green-400">{signal.conversionOdds}%</span>
                </div>
                <Progress value={signal.conversionOdds} className="h-2" />
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-400">
                    Avg Deal: <span className="text-blue-400 font-semibold">${signal.avgDeal}</span>
                  </div>
                  <div className="text-gray-400">
                    Close: <span className="text-purple-400 font-semibold">{signal.timeToClose}</span>
                  </div>
                </div>

                {signal.urgency === 'critical' && (
                  <div className="flex items-center gap-1 text-xs text-red-400 bg-red-900/20 p-2 rounded">
                    <AlertTriangle className="w-3 h-3" />
                    Critical urgency - immediate action required
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Category Boost Action */}
        <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 border border-purple-400/30 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-purple-400 mb-1">Category Boost Engine</h4>
              <p className="text-sm text-gray-400">
                Approve to unlock blind tier access for matched startups in {selectedCategory || 'selected category'}
              </p>
            </div>
            <Button 
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!selectedCategory}
              onClick={() => handleCategoryBoost(selectedCategory)}
            >
              <Zap className="w-4 h-4 mr-2" />
              Boost {selectedCategory || 'Category'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Blind Auction Engine Component
const BlindAuctionEngineComponent = () => {
  const [approvedBids, setApprovedBids] = useState(new Set())
  const [showEncrypted, setShowEncrypted] = useState(false)
  const [auctionData, setAuctionData] = useState(blindAuctions)

  const handleApproveBid = (bidId) => {
    setApprovedBids(prev => new Set([...prev, bidId]))
    setAuctionData(prev => ({
      ...prev,
      slotsRemaining: Math.max(0, prev.slotsRemaining - 1),
      approvedThisMonth: prev.approvedThisMonth + 1
    }))
    
    // Simulate backend call
    console.log(`Approved bid: ${bidId}`)
  }

  const getTimeRemaining = (timeLeft) => {
    // Convert time string to urgency level
    const hours = parseInt(timeLeft.split('h')[0])
    if (hours <= 1) return 'critical'
    if (hours <= 3) return 'high'
    return 'medium'
  }

  return (
    <Card className="border-blue-400/30 bg-gradient-to-br from-gray-900/50 to-blue-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-blue-400 flex items-center gap-2">
            <Fingerprint className="w-6 h-6" />
            Blind Auction Engine
            <Badge variant="outline" className="ml-2">
              {auctionData.slotsRemaining} slots left
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowEncrypted(!showEncrypted)}
              className="text-blue-400 border-blue-400"
            >
              <KeyRound className="w-4 h-4 mr-1" />
              {showEncrypted ? 'Hide' : 'Show'} Encryption
            </Button>
            <Badge variant="success">
              {auctionData.successRate}% Success Rate
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Auction Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-400/30">
            <div className="text-xl font-bold text-blue-400">{auctionData.active.length}</div>
            <div className="text-sm text-gray-400">Active Auctions</div>
          </div>
          <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-400/30">
            <div className="text-xl font-bold text-green-400">{auctionData.approvedThisMonth}</div>
            <div className="text-sm text-gray-400">Approved This Month</div>
          </div>
          <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
            <div className="text-xl font-bold text-purple-400">{auctionData.avgROI}%</div>
            <div className="text-sm text-gray-400">Avg ROI</div>
          </div>
          <div className="text-center p-3 bg-orange-900/20 rounded-lg border border-orange-400/30">
            <div className="text-xl font-bold text-orange-400">{auctionData.slotsRemaining}</div>
            <div className="text-sm text-gray-400">Slots Remaining</div>
          </div>
        </div>

        {/* Active Auctions */}
        <div className="space-y-4">
          {auctionData.active.map((auction) => {
            const urgency = getTimeRemaining(auction.timeLeft)
            const isApproved = approvedBids.has(auction.id)
            
            return (
              <motion.div
                key={auction.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border-2 transition-all ${
                  isApproved 
                    ? 'border-green-400 bg-green-900/20' 
                    : urgency === 'critical'
                    ? 'border-red-400 bg-red-900/20 animate-pulse'
                    : urgency === 'high'
                    ? 'border-orange-400 bg-orange-900/20'
                    : 'border-gray-600 bg-gray-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Target className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold capitalize text-white">{auction.category}</h4>
                      <p className="text-sm text-gray-400">{auction.commitment}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-400">{auction.score}</div>
                    <div className="text-xs text-gray-400">Match Score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div className="text-sm">
                    <span className="text-gray-400">Estimated Value:</span>
                    <div className="font-bold text-green-400">${auction.estimatedValue.toLocaleString()}</div>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-400">Startup SSE:</span>
                    <div className="font-bold text-purple-400">{auction.startupSSE}/100</div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <Timer className="w-4 h-4" />
                    <span>{auction.timeLeft} remaining</span>
                    {urgency === 'critical' && (
                      <Badge variant="destructive" className="ml-2 animate-pulse">
                        URGENT
                      </Badge>
                    )}
                  </div>
                  
                  {isApproved ? (
                    <Badge variant="success" className="flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Approved
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleApproveBid(auction.id)}
                      disabled={auctionData.slotsRemaining <= 0}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Approve Bid
                    </Button>
                  )}
                </div>

                {showEncrypted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="mt-3 p-3 bg-gray-900 rounded border border-gray-600"
                  >
                    <div className="font-mono text-xs text-gray-400 break-all">
                      {BlindAuctionEngine.encryptStartupIdentity(auction).encryptedId}
                    </div>
                    <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      AES-GCM Encrypted Startup Identity
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Scarcity Psychology */}
        {auctionData.slotsRemaining <= 1 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-4 p-3 bg-red-900/20 border border-red-400/30 rounded-lg text-center"
          >
            <div className="text-red-400 font-semibold flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Only {auctionData.slotsRemaining} slot{auctionData.slotsRemaining !== 1 ? 's' : ''} remaining this month!
            </div>
            <div className="text-red-300 text-sm mt-1">
              Act fast to secure your preferred startups
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}

// Silent Shareholder Mode Component
const SilentShareholderMode = () => {
  const [shadowValue, setShadowValue] = useState(corporatePartnerProfile.metrics.shadowValue)
  const [showSyndicate, setShowSyndicate] = useState(false)
  const [showBreakdown, setShowBreakdown] = useState(false)
  const [valueHistory, setValueHistory] = useState([
    { time: '9:00', value: 95000 },
    { time: '10:00', value: 96500 },
    { time: '11:00', value: 97200 },
    { time: '12:00', value: 98000 }
  ])

  // Simulate real-time value updates every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setShadowValue(prev => {
        const change = Math.random() > 0.6 ? 
          Math.floor(Math.random() * 500) + 100 : 
          -Math.floor(Math.random() * 200)
        const newValue = Math.max(50000, prev + change)
        
        // Update history
        setValueHistory(prev => {
          const newHistory = [...prev.slice(-11), { 
            time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }), 
            value: newValue 
          }]
          return newHistory
        })
        
        return newValue
      })
    }, 15000)

    return () => clearInterval(interval)
  }, [])

  const totalInvested = corporatePartnerProfile.billing.totalMonthly * 6 // 6 months
  const roiMultiple = ShadowValueEngine.getROIMultiple(shadowValue, totalInvested)

  return (
    <Card className="bg-gradient-to-br from-gray-900 to-black border-yellow-400/30">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-yellow-400 flex items-center gap-2">
            <TrendingUp className="w-6 h-6" />
            Silent Shareholder Mode
            <Badge variant="premium" className="ml-2 animate-pulse">
              Live Ticker
            </Badge>
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowBreakdown(!showBreakdown)}
            className="text-yellow-400 border-yellow-400"
          >
            <Calculator className="w-4 h-4 mr-1" />
            {showBreakdown ? 'Hide' : 'Show'} Breakdown
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {/* Main Shadow Value Display */}
        <div className="text-center mb-6">
          <motion.div
            key={shadowValue}
            initial={{ scale: 1.05, color: '#10B981' }}
            animate={{ scale: 1, color: '#F59E0B' }}
            transition={{ duration: 0.5 }}
            className="text-5xl font-bold text-yellow-400 mb-2 font-mono"
          >
            ${shadowValue.toLocaleString()}
          </motion.div>
          <div className="text-gray-400 text-sm">
            Unrealized paper gains from ${corporatePartnerProfile.billing.totalMonthly.toLocaleString()}/month investment
          </div>
          <div className="text-green-400 text-lg font-semibold mt-1">
            {roiMultiple}× ROI Multiple
          </div>
        </div>

        {/* Value Chart */}
        <div className="mb-6">
          <ResponsiveContainer width="100%" height={120}>
            <AreaChart data={valueHistory}>
              <defs>
                <linearGradient id="shadowGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#F59E0B" 
                strokeWidth={2}
                fill="url(#shadowGradient)" 
              />
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #F59E0B',
                  borderRadius: '8px',
                  color: '#F59E0B'
                }}
                formatter={(value) => [`$${value.toLocaleString()}`, 'Shadow Value']}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-white/5 rounded-lg border border-yellow-400/20">
            <div className="text-xl font-bold text-green-400">{roiMultiple}×</div>
            <div className="text-xs text-gray-400">ROI Multiple</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-yellow-400/20">
            <div className="text-xl font-bold text-blue-400">{corporatePartnerProfile.metrics.conversionRate}%</div>
            <div className="text-xs text-gray-400">Conversion Rate</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-yellow-400/20">
            <div className="text-xl font-bold text-purple-400">{corporatePartnerProfile.metrics.saves}</div>
            <div className="text-xs text-gray-400">Startups Saved</div>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg border border-yellow-400/20">
            <div className="text-xl font-bold text-orange-400">{corporatePartnerProfile.metrics.streak}</div>
            <div className="text-xs text-gray-400">Day Streak</div>
          </div>
        </div>

        {/* Actuarial Breakdown */}
        <AnimatePresence>
          {showBreakdown && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-black/50 border border-yellow-400/20 rounded-lg p-4 mb-4"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-yellow-400 text-sm font-semibold">Actuarial Breakdown</span>
                <Cog className="w-4 h-4 text-yellow-400" />
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Monthly Investment:</span>
                  <span className="text-white">${corporatePartnerProfile.billing.totalMonthly.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Market Uplift:</span>
                  <span className="text-green-400">2.1×</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Partner Weight ({corporatePartnerProfile.tier}):</span>
                  <span className="text-blue-400">1.8×</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Time Appreciation (6mo):</span>
                  <span className="text-purple-400">12.6%</span>
                </div>
                <div className="flex justify-between border-t border-yellow-400/20 pt-2">
                  <span className="text-yellow-400 font-semibold">Shadow Value:</span>
                  <span className="text-yellow-400 font-bold">${shadowValue.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Syndicate Whisper */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-yellow-900/20 border border-yellow-400/30 rounded-lg cursor-pointer"
          onClick={() => setShowSyndicate(!showSyndicate)}
        >
          <div className="flex items-center gap-2 text-yellow-400">
            <MessageSquare className="w-4 h-4" />
            <span className="text-sm font-semibold">💰 Whisper: Want real equity?</span>
          </div>
          <AnimatePresence>
            {showSyndicate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 text-xs text-yellow-300"
              >
                We syndicate direct startup investments. $10K minimum, 10% carry.
                <div className="text-yellow-200 mt-1">
                  • Direct equity stakes • Quarterly distributions • Board observer rights
                </div>
                <Button size="sm" className="w-full mt-2 bg-yellow-600 hover:bg-yellow-700 text-black">
                  <Landmark className="w-3 h-3 mr-1" />
                  Explore Syndication ($10K min)
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </CardContent>
    </Card>
  )
}

// Founder Mirror Feed Component
const FounderMirrorFeed = () => {
  const [votes, setVotes] = useState({})
  const [showApproved, setShowApproved] = useState(false)
  const [feedData, setFeedData] = useState(mirrorFeed)

  const handleVote = (pleaId, vote) => {
    setVotes(prev => ({ ...prev, [pleaId]: vote }))
    
    // Update vote counts
    setFeedData(prev => ({
      ...prev,
      activePleas: prev.activePleas.map(plea => 
        plea.id === pleaId 
          ? { 
              ...plea, 
              votes: { 
                ...plea.votes, 
                [vote]: plea.votes[vote] + 1 
              }
            }
          : plea
      )
    }))
    
    console.log(`Voted ${vote} on plea ${pleaId}`)
  }

  const getConfidenceScore = (plea) => {
    const totalVotes = plea.votes.yes + plea.votes.no
    if (totalVotes === 0) return 0
    return Math.round((plea.votes.yes / totalVotes) * 100)
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-900/20 border-red-400/30'
      case 'high': return 'text-orange-400 bg-orange-900/20 border-orange-400/30'
      case 'medium': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
    }
  }

  return (
    <Card className="border-green-400/30 bg-gradient-to-br from-gray-900/50 to-green-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-green-400 flex items-center gap-2">
            <HeartHandshake className="w-6 h-6" />
            Founder Mirror Feed
            <Badge variant="success" className="ml-2">
              {feedData.activePleas.length} Active Pleas
            </Badge>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setShowApproved(!showApproved)}
              className="text-green-400 border-green-400"
            >
              {showApproved ? 'Hide Approved' : 'Show Approved'}
            </Button>
            <Badge variant="outline">
              {feedData.totalSaved} Saved • ${feedData.totalValue.toLocaleString()}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-green-900/20 rounded-lg border border-green-400/30">
            <div className="text-2xl font-bold text-green-400">{feedData.totalSaved}</div>
            <div className="text-sm text-gray-400">Startups Saved</div>
          </div>
          <div className="text-center p-3 bg-blue-900/20 rounded-lg border border-blue-400/30">
            <div className="text-2xl font-bold text-blue-400">
              ${(feedData.totalValue / 1000).toFixed(0)}K
            </div>
            <div className="text-sm text-gray-400">Total Value Created</div>
          </div>
          <div className="text-center p-3 bg-purple-900/20 rounded-lg border border-purple-400/30">
            <div className="text-2xl font-bold text-purple-400">
              {Math.round(feedData.activePleas.reduce((sum, plea) => sum + getConfidenceScore(plea), 0) / feedData.activePleas.length)}%
            </div>
            <div className="text-sm text-gray-400">Avg Confidence</div>
          </div>
        </div>

        {/* Active Pleas */}
        <div className="space-y-4">
          {feedData.activePleas.map((plea) => {
            const userVote = votes[plea.id]
            const confidence = getConfidenceScore(plea)
            const urgencyStyle = getUrgencyColor(plea.urgency)
            
            return (
              <motion.div
                key={plea.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 bg-gray-800/30 border rounded-lg ${
                  confidence >= 73 ? 'border-green-400/50 bg-green-900/10' : 'border-gray-600'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="capitalize">
                        {plea.category}
                      </Badge>
                      <Badge className={urgencyStyle}>
                        {plea.urgency} urgency
                      </Badge>
                      <span className="text-xs text-gray-400">{plea.timePosted}</span>
                    </div>
                    <p className="text-gray-300 mb-2">{plea.need}</p>
                    <div className="text-sm text-gray-400">
                      Estimated Impact: <span className="text-blue-400 font-semibold">{plea.estimatedImpact}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4 text-green-400" />
                      <span>{plea.votes.yes} yes</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ThumbsDown className="w-4 h-4 text-red-400" />
                      <span>{plea.votes.no} no</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Target className="w-4 h-4 text-blue-400" />
                      <span>{confidence}% confidence</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {userVote ? (
                      <Badge variant={userVote === 'yes' ? 'success' : 'destructive'}>
                        Voted {userVote}
                      </Badge>
                    ) : (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(plea.id, 'yes')}
                          className="text-green-400 border-green-400 hover:bg-green-400/20"
                        >
                          <ThumbsUp className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleVote(plea.id, 'no')}
                          className="text-red-400 border-red-400 hover:bg-red-400/20"
                        >
                          <ThumbsDown className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                </div>

                {confidence >= 73 && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="mt-3 p-2 bg-green-900/20 border border-green-400/30 rounded text-center"
                  >
                    <div className="text-green-400 text-sm font-semibold flex items-center justify-center gap-1">
                      <CheckCircle className="w-4 h-4" />
                      Auto-approval threshold reached
                    </div>
                    <div className="text-green-300 text-xs">
                      This plea will be automatically granted to the startup
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )
          })}
        </div>

        {/* Recently Approved Section */}
        <AnimatePresence>
          {showApproved && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-4 border-t border-gray-600"
            >
              <h4 className="font-semibold text-green-400 mb-3">Recently Approved</h4>
              <div className="space-y-2">
                {feedData.recentApprovals.map((approval) => (
                  <div key={approval.id} className="flex items-center gap-3 p-2 bg-green-900/20 rounded">
                    <Award className="w-4 h-4 text-green-400" />
                    <div className="flex-1">
                      <span className="text-green-400 font-semibold capitalize">{approval.category}</span>
                      <span className="text-gray-400 text-sm ml-2">- {approval.impact} • {approval.timestamp}</span>
                    </div>
                    <Badge variant="success">${approval.value}</Badge>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Gamified Retention Component
const GamifiedRetention = () => {
  const [influence, setInfluence] = useState(gamification.influence.current)
  const [decayVisible, setDecayVisible] = useState(false)
  const [showAchievements, setShowAchievements] = useState(false)

  // Simulate influence decay
  useEffect(() => {
    const interval = setInterval(() => {
      setInfluence(prev => {
        const decay = gamification.influence.dailyChange / 24 // Hourly decay
        return Math.max(0, prev + decay)
      })
    }, 3600000) // Update every hour

    return () => clearInterval(interval)
  }, [])

  const getInfluenceColor = (influence) => {
    if (influence >= 80) return 'text-purple-400'
    if (influence >= 60) return 'text-blue-400'
    if (influence >= 40) return 'text-green-400'
    if (influence >= 20) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getTierColor = (tier) => {
    switch (tier) {
      case 'platinum': return 'text-purple-400 bg-purple-900/20 border-purple-400/30'
      case 'gold': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      case 'silver': return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
      default: return 'text-orange-400 bg-orange-900/20 border-orange-400/30'
    }
  }

  return (
    <Card className="border-orange-400/30 bg-gradient-to-br from-gray-900/50 to-orange-900/20">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-orange-400 flex items-center gap-2">
            <Crown className="w-6 h-6" />
            Gamified Retention
            <Badge variant="warning" className="ml-2">
              Rank #{gamification.leaderboard.personal.rank}
            </Badge>
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAchievements(!showAchievements)}
            className="text-orange-400 border-orange-400"
          >
            <Trophy className="w-4 h-4 mr-1" />
            {showAchievements ? 'Hide' : 'Show'} Achievements
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Influence Meter */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold text-white">Influence Meter</h4>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="text-sm text-orange-400">{gamification.influence.streak} day streak</span>
              </div>
            </div>
            
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Current Influence</span>
                <span className={`font-bold ${getInfluenceColor(influence)}`}>
                  {Math.round(influence)}%
                </span>
              </div>
              <Progress value={influence} className="h-3 mb-3" />
              
              <div className="flex justify-between text-xs text-gray-400 mb-3">
                <span>Bronze (0-40%)</span>
                <span>Silver (40-60%)</span>
                <span>Gold (60-80%)</span>
                <span>Platinum (80%+)</span>
              </div>

              {gamification.influence.dailyChange < 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-2 bg-red-900/20 border border-red-400/30 rounded text-center cursor-pointer"
                  onClick={() => setDecayVisible(!decayVisible)}
                >
                  <div className="text-red-400 text-sm flex items-center justify-center gap-1">
                    <TrendingDown className="w-4 h-4" />
                    Influence decaying: {gamification.influence.dailyChange}% daily
                  </div>
                  <AnimatePresence>
                    {decayVisible && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="text-red-300 text-xs mt-1"
                      >
                        Drop to {gamification.leaderboard.decay.nextTier} tier in {gamification.leaderboard.decay.daysUntilDrop} days
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>
          </div>

          {/* Ghost Leaderboard */}
          <div>
            <h4 className="font-semibold text-white mb-3">Ghost Leaderboard</h4>
            <div className="bg-gray-800 rounded-lg p-4">
              <div className="space-y-3">
                {gamification.leaderboard.top5.map((partner, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        index < 3 ? 'bg-yellow-500 text-black' : 'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-white">
                          {partner.revealed ? partner.name : 'Anonymous Partner'}
                        </div>
                        <Badge className={getTierColor(partner.tier)}>
                          {partner.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">{partner.score}</div>
                      <div className="text-xs text-gray-400">points</div>
                    </div>
                  </div>
                ))}
                
                {/* Your Position */}
                <div className="border-t border-gray-600 pt-3">
                  <div className="flex items-center justify-between bg-orange-900/20 p-2 rounded">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-orange-500 text-black flex items-center justify-center">
                        {gamification.leaderboard.personal.rank}
                      </div>
                      <div>
                        <div className="font-semibold text-orange-400">You</div>
                        <Badge className={getTierColor(gamification.leaderboard.personal.tier)}>
                          {gamification.leaderboard.personal.tier}
                        </Badge>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-400">{gamification.leaderboard.personal.score}</div>
                      <div className="text-xs text-gray-400">
                        {gamification.leaderboard.personal.gap} from #{gamification.leaderboard.personal.nextRank}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-6 pt-4 border-t border-gray-600"
            >
              <h4 className="font-semibold text-orange-400 mb-3">Achievements</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {gamification.achievements.map((achievement) => (
                  <div 
                    key={achievement.id}
                    className={`p-3 rounded-lg border ${
                      achievement.unlocked 
                        ? 'border-green-400/30 bg-green-900/20' 
                        : 'border-gray-600 bg-gray-800/30'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        achievement.unlocked ? 'bg-green-500' : 'bg-gray-600'
                      }`}>
                        {achievement.unlocked ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <Lock className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <div>
                        <div className={`font-semibold ${
                          achievement.unlocked ? 'text-green-400' : 'text-gray-400'
                        }`}>
                          {achievement.name}
                        </div>
                        <Badge variant={
                          achievement.rarity === 'epic' ? 'premium' :
                          achievement.rarity === 'rare' ? 'warning' :
                          achievement.rarity === 'uncommon' ? 'secondary' : 'outline'
                        }>
                          {achievement.rarity}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  )
}

// Executive Voice Command Interface
const ExecutiveVoiceInterface = () => {
  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [response, setResponse] = useState('')
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(
    VoiceCommandEngine.isVoiceEnabled(corporatePartnerProfile.tier)
  )

  const startListening = () => {
    if (!isVoiceEnabled) return
    
    setIsListening(true)
    setTranscript('')
    setResponse('')
    
    // Simulate voice recognition
    setTimeout(() => {
      const sampleCommands = [
        'Show me the ecosystem pulse',
        'Display active auctions',
        'What is my shadow value',
        'Show leaderboard position'
      ]
      const randomCommand = sampleCommands[Math.floor(Math.random() * sampleCommands.length)]
      setTranscript(randomCommand)
      
      const commandResult = VoiceCommandEngine.processVoiceCommand(randomCommand)
      setResponse(commandResult.message || `Executing: ${commandResult.action}`)
      setIsListening(false)
    }, 3000)
  }

  const stopListening = () => {
    setIsListening(false)
  }

  if (!isVoiceEnabled) {
    return (
      <Card className="border-gray-600/30 bg-gray-800/30">
        <CardContent className="p-4 text-center">
          <div className="text-gray-400 mb-2">
            <MicOff className="w-8 h-8 mx-auto mb-2" />
            Voice Commands Locked
          </div>
          <p className="text-sm text-gray-500">
            Upgrade to Executive tier ($999/mo) to unlock voice commands
          </p>
          <Button size="sm" className="mt-2 bg-purple-600 hover:bg-purple-700">
            <Upgrade className="w-4 h-4 mr-1" />
            Upgrade to Executive
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-purple-400/30 bg-gradient-to-br from-gray-900/50 to-purple-900/20">
      <CardHeader>
        <CardTitle className="text-purple-400 flex items-center gap-2">
          <MonitorSpeaker className="w-6 h-6" />
          Executive Voice Interface
          <Badge variant="premium" className="ml-2">
            Executive Only
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={isListening ? stopListening : startListening}
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
          >
            {isListening ? (
              <Volume2 className="w-8 h-8 text-white" />
            ) : (
              <Mic className="w-8 h-8 text-white" />
            )}
          </motion.button>
          
          <div className="mt-4">
            <p className="text-sm text-gray-400 mb-2">
              {isListening ? 'Listening...' : 'Click to speak'}
            </p>
            
            {transcript && (
              <div className="bg-gray-800 p-3 rounded-lg mb-2">
                <p className="text-sm text-blue-400">You said:</p>
                <p className="text-white">{transcript}</p>
              </div>
            )}
            
            {response && (
              <div className="bg-purple-900/20 p-3 rounded-lg">
                <p className="text-sm text-purple-400">AI Response:</p>
                <p className="text-white">{response}</p>
              </div>
            )}
          </div>
          
          <div className="mt-4 text-xs text-gray-500">
            Try: "Show pulse", "Display auctions", "My shadow value"
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Dashboard Component
export default function CorporateShareValuePartnerDashboard() {
  const [activeTab, setActiveTab] = useState('pulse')
  
  const tabs = [
    { id: 'pulse', label: 'Ecosystem Pulse', icon: Radar },
    { id: 'auctions', label: 'Blind Auctions', icon: Fingerprint },
    { id: 'shadow', label: 'Shadow Value', icon: TrendingUp },
    { id: 'mirror', label: 'Founder Mirror', icon: HeartHandshake },
    { id: 'retention', label: 'Gamification', icon: Crown },
    { id: 'voice', label: 'Voice Commands', icon: MonitorSpeaker }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'pulse':
        return <EcosystemPulse />
      case 'auctions':
        return <BlindAuctionEngineComponent />
      case 'shadow':
        return <SilentShareholderMode />
      case 'mirror':
        return <FounderMirrorFeed />
      case 'retention':
        return <GamifiedRetention />
      case 'voice':
        return <ExecutiveVoiceInterface />
      default:
        return <EcosystemPulse />
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
                  ${corporatePartnerProfile.metrics.shadowValue.toLocaleString()}
                </Badge>
                <Badge className="bg-purple-500 text-white">
                  {corporatePartnerProfile.tier.toUpperCase()}
                </Badge>
                <Badge className="bg-green-500 text-white">
                  Rank #{corporatePartnerProfile.metrics.rank}
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
              Welcome back, {corporatePartnerProfile.name}
            </h1>
            <p className="text-gray-400">
              {corporatePartnerProfile.company} • {corporatePartnerProfile.title} • 
              Silent Engine Active • ${corporatePartnerProfile.billing.totalMonthly.toLocaleString()}/month
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
    </SubscriptionProvider>
  )
}
