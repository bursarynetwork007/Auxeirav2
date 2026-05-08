import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Users, 
  Target, 
  Zap,
  Brain,
  Award,
  Star,
  Activity,
  BarChart3,
  PieChart,
  Eye,
  AlertTriangle,
  CheckCircle,
  Clock,
  Trophy,
  Crown,
  Gem,
  Shield,
  Search,
  Filter,
  Download,
  FileText,
  Mail,
  Phone,
  ExternalLink,
  Plus,
  Minus,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Briefcase,
  Building,
  Globe,
  Calendar,
  Percent,
  Calculator,
  LineChart,
  Radar,
  Settings,
  Bell,
  Bookmark,
  Heart,
  MessageSquare,
  UserPlus,
  Network,
  Handshake,
  Share2,
  TrendingUpIcon
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

// Angel Investor Profile
const angelProfile = {
  name: 'Michael Chen',
  totalInvested: 2500000,
  portfolioSize: 23,
  activeInvestments: 18,
  exits: 5,
  avgCheck: 50000,
  successRate: 65.2,
  totalReturns: 4200000,
  irr: 28.5,
  sectors: ['AI/ML', 'Fintech', 'Healthcare', 'SaaS'],
  stage: ['Pre-Seed', 'Seed'],
  geography: ['Bay Area', 'NYC', 'Austin'],
  networkSize: 156,
  referrals: 34,
  coInvestments: 12
}

// Portfolio Investments
const portfolioInvestments = [
  {
    id: 1,
    name: 'DataFlow AI',
    sector: 'AI/ML',
    stage: 'Seed',
    investment: 75000,
    currentValuation: 25000000,
    investmentDate: '2023-01-15',
    roi: 420,
    status: 'active',
    lastUpdate: '2 days ago',
    founder: 'Sarah Kim',
    coInvestors: ['Sequoia Capital', 'a16z'],
    nextMilestone: 'Series A',
    riskLevel: 'medium',
    sseScore: 87
  },
  {
    id: 2,
    name: 'HealthTech Pro',
    sector: 'Healthcare',
    stage: 'Pre-Seed',
    investment: 25000,
    currentValuation: 8000000,
    investmentDate: '2023-06-20',
    roi: 180,
    status: 'active',
    lastUpdate: '1 week ago',
    founder: 'Dr. James Wilson',
    coInvestors: ['First Round', 'Bessemer'],
    nextMilestone: 'FDA Approval',
    riskLevel: 'high',
    sseScore: 82
  },
  {
    id: 3,
    name: 'FinSecure',
    sector: 'Fintech',
    stage: 'Seed',
    investment: 100000,
    currentValuation: 45000000,
    investmentDate: '2022-09-10',
    roi: 650,
    status: 'exited',
    lastUpdate: '3 months ago',
    founder: 'Alex Rodriguez',
    coInvestors: ['Stripe', 'Square Ventures'],
    nextMilestone: 'Acquired by PayPal',
    riskLevel: 'low',
    sseScore: 94
  }
]

// Deal Sourcing Opportunities
const dealOpportunities = [
  {
    id: 1,
    name: 'VoiceAI',
    sector: 'AI/ML',
    stage: 'Pre-Seed',
    seeking: 500000,
    valuation: 4000000,
    founder: 'Lisa Zhang',
    team: 4,
    traction: 'Early customers',
    location: 'San Francisco',
    sseScore: 89,
    matchScore: 92,
    source: 'Network referral',
    referrer: 'John Smith (Founder, DataFlow AI)',
    highlights: ['Ex-Google team', 'Strong IP', 'Enterprise interest'],
    riskFactors: ['Competitive market', 'Regulatory uncertainty']
  },
  {
    id: 2,
    name: 'BioMarker',
    sector: 'Healthcare',
    stage: 'Seed',
    seeking: 1200000,
    valuation: 8000000,
    founder: 'Dr. Maria Santos',
    team: 8,
    traction: 'Clinical trials',
    location: 'Boston',
    sseScore: 85,
    matchScore: 88,
    source: 'Platform discovery',
    referrer: null,
    highlights: ['FDA breakthrough', 'Strong clinical data', 'Experienced team'],
    riskFactors: ['Long development cycle', 'Regulatory risk']
  }
]

// Network Connections
const networkConnections = [
  {
    id: 1,
    name: 'Jennifer Park',
    role: 'Angel Investor',
    company: 'Ex-Uber',
    investments: 45,
    sharedInvestments: 3,
    location: 'San Francisco',
    sectors: ['Mobility', 'AI/ML'],
    lastInteraction: '2 weeks ago',
    connectionStrength: 'strong'
  },
  {
    id: 2,
    name: 'David Kim',
    role: 'VC Partner',
    company: 'Lightspeed Ventures',
    investments: 120,
    sharedInvestments: 2,
    location: 'Palo Alto',
    sectors: ['Enterprise', 'SaaS'],
    lastInteraction: '1 month ago',
    connectionStrength: 'medium'
  },
  {
    id: 3,
    name: 'Sarah Johnson',
    role: 'Founder',
    company: 'TechFlow (Exited)',
    investments: 12,
    sharedInvestments: 1,
    location: 'Austin',
    sectors: ['B2B SaaS', 'Fintech'],
    lastInteraction: '3 days ago',
    connectionStrength: 'strong'
  }
]

// Syndicate Opportunities
const syndicateDeals = [
  {
    id: 1,
    name: 'CloudSecure',
    lead: 'Jennifer Park',
    totalRaise: 2000000,
    angelAllocation: 400000,
    minCheck: 10000,
    maxCheck: 50000,
    committed: 280000,
    remaining: 120000,
    deadline: '2024-11-15',
    sector: 'Cybersecurity',
    stage: 'Seed',
    participants: 8,
    sseScore: 91
  },
  {
    id: 2,
    name: 'EduTech Plus',
    lead: 'David Kim',
    totalRaise: 1500000,
    angelAllocation: 300000,
    minCheck: 5000,
    maxCheck: 25000,
    committed: 180000,
    remaining: 120000,
    deadline: '2024-11-30',
    sector: 'EdTech',
    stage: 'Pre-Seed',
    participants: 12,
    sseScore: 84
  }
]

// Personal Portfolio Component
const PersonalPortfolio = () => {
  const [selectedInvestment, setSelectedInvestment] = useState(null)
  const [sortBy, setSortBy] = useState('roi')
  
  const portfolioPerformance = [
    { month: 'Jan', value: 2.1, invested: 2.0 },
    { month: 'Feb', value: 2.3, invested: 2.1 },
    { month: 'Mar', value: 2.6, invested: 2.2 },
    { month: 'Apr', value: 2.8, invested: 2.3 },
    { month: 'May', value: 3.2, invested: 2.4 },
    { month: 'Jun', value: 3.5, invested: 2.5 }
  ]
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'text-green-400 border-green-400/30'
      case 'exited': return 'text-blue-400 border-blue-400/30'
      case 'failed': return 'text-red-400 border-red-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }
  
  const getRiskColor = (level) => {
    switch (level) {
      case 'low': return 'text-green-400'
      case 'medium': return 'text-yellow-400'
      case 'high': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Invested</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${(angelProfile.totalInvested / 1000000).toFixed(1)}M
                </p>
                <div className="text-sm text-gray-400">
                  {angelProfile.portfolioSize} investments
                </div>
              </div>
              <DollarSign className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Total Returns</p>
                <p className="text-2xl font-bold text-green-400">
                  ${(angelProfile.totalReturns / 1000000).toFixed(1)}M
                </p>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>{angelProfile.irr}% IRR</span>
                </div>
              </div>
              <TrendingUp className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Success Rate</p>
                <p className="text-2xl font-bold text-purple-400">{angelProfile.successRate}%</p>
                <div className="text-sm text-gray-400">
                  {angelProfile.exits} exits
                </div>
              </div>
              <Trophy className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Avg Check</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${(angelProfile.avgCheck / 1000).toFixed(0)}K
                </p>
                <div className="text-sm text-gray-400">
                  Per investment
                </div>
              </div>
              <Calculator className="w-8 h-8 text-orange-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portfolio Performance Chart */}
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <LineChart className="w-6 h-6" />
            Portfolio Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioPerformance}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorInvested" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="month" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `$${value}M`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}M`, 'Portfolio Value']}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorValue)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="invested" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorInvested)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Investment List */}
      <Card className="bg-gray-900/50 border-purple-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
              <Briefcase className="w-6 h-6" />
              Portfolio Investments
            </CardTitle>
            <div className="flex items-center gap-2">
              <select 
                className="p-2 bg-gray-800 border border-gray-600 rounded-lg text-white text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="roi">Sort by ROI</option>
                <option value="investment">Sort by Investment</option>
                <option value="date">Sort by Date</option>
                <option value="sector">Sort by Sector</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioInvestments.map((investment) => (
              <motion.div
                key={investment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg cursor-pointer hover:border-purple-400/50 transition-all"
                onClick={() => setSelectedInvestment(investment)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {investment.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{investment.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{investment.sector}</span>
                        <span>•</span>
                        <span>{investment.stage}</span>
                        <span>•</span>
                        <span>Founded by {investment.founder}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getStatusColor(investment.status)}>
                      {investment.status}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-1">
                      Updated {investment.lastUpdate}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Investment</div>
                    <div className="font-bold text-blue-400">
                      ${(investment.investment / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Valuation</div>
                    <div className="font-bold text-green-400">
                      ${(investment.currentValuation / 1000000).toFixed(0)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ROI</div>
                    <div className="font-bold text-purple-400">
                      +{investment.roi}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">SSE Score</div>
                    <div className="font-bold text-yellow-400">{investment.sseScore}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Risk Level</div>
                    <div className={`font-bold ${getRiskColor(investment.riskLevel)}`}>
                      {investment.riskLevel}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Next Milestone</div>
                    <div className="font-bold text-orange-400 text-xs">
                      {investment.nextMilestone}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Co-investors: {investment.coInvestors.join(', ')}
                  </div>
                  <Button size="sm" variant="outline" className="border-purple-400/30 text-purple-400">
                    <FileText className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Deal Sourcing Component
const DealSourcing = () => {
  const [filters, setFilters] = useState({
    sector: 'all',
    stage: 'all',
    checkSize: [5000, 100000]
  })

  return (
    <div className="space-y-6">
      {/* Deal Sourcing Filters */}
      <Card className="bg-gray-900/50 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-400 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Deal Sourcing Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sector</label>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                value={filters.sector}
                onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
              >
                <option value="all">All Sectors</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Fintech">Fintech</option>
                <option value="SaaS">SaaS</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Stage</label>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                value={filters.stage}
                onChange={(e) => setFilters(prev => ({ ...prev, stage: e.target.value }))}
              >
                <option value="all">All Stages</option>
                <option value="Pre-Seed">Pre-Seed</option>
                <option value="Seed">Seed</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Check Size Range</label>
              <div className="flex items-center gap-2">
                <input 
                  type="number" 
                  placeholder="Min"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={filters.checkSize[0]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    checkSize: [parseInt(e.target.value), prev.checkSize[1]] 
                  }))}
                />
                <span className="text-gray-400">-</span>
                <input 
                  type="number" 
                  placeholder="Max"
                  className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                  value={filters.checkSize[1]}
                  onChange={(e) => setFilters(prev => ({ 
                    ...prev, 
                    checkSize: [prev.checkSize[0], parseInt(e.target.value)] 
                  }))}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Opportunities */}
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Deal Opportunities
            <Badge className="bg-blue-500 text-white ml-auto">
              {dealOpportunities.length} Matches
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealOpportunities.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 bg-gray-800/30 border border-gray-600/30 rounded-lg hover:border-blue-400/50 transition-all"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-xl">
                        {deal.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-xl">{deal.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
                        <span>{deal.sector}</span>
                        <span>•</span>
                        <span>{deal.stage}</span>
                        <span>•</span>
                        <span>{deal.location}</span>
                        <span>•</span>
                        <span>Founded by {deal.founder}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-green-400 border-green-400/30">
                      {deal.matchScore}% Match
                    </Badge>
                    <Button variant="ghost" size="sm">
                      <Heart className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Seeking</div>
                    <div className="font-bold text-green-400">
                      ${(deal.seeking / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Valuation</div>
                    <div className="font-bold text-blue-400">
                      ${(deal.valuation / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">SSE Score</div>
                    <div className="font-bold text-yellow-400">{deal.sseScore}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Team Size</div>
                    <div className="font-bold text-purple-400">{deal.team}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Traction</div>
                    <div className="font-bold text-orange-400">{deal.traction}</div>
                  </div>
                </div>
                
                {deal.referrer && (
                  <div className="mb-4 p-3 bg-blue-900/20 border border-blue-400/30 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-400">
                      <UserPlus className="w-4 h-4" />
                      <span className="font-semibold">Warm Introduction Available</span>
                    </div>
                    <p className="text-sm text-gray-300 mt-1">
                      Referred by {deal.referrer}
                    </p>
                  </div>
                )}
                
                <div className="mb-4">
                  <h5 className="font-semibold text-green-400 mb-2">Key Highlights</h5>
                  <div className="flex flex-wrap gap-2">
                    {deal.highlights.map((highlight, index) => (
                      <Badge key={index} variant="outline" className="text-green-400 border-green-400/30">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Source: <span className="text-blue-400">{deal.source}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-400/30 text-blue-400">
                      <FileText className="w-4 h-4 mr-2" />
                      View Deck
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Express Interest
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Network Building Component
const NetworkBuilding = () => {
  const [selectedConnection, setSelectedConnection] = useState(null)
  
  const getConnectionStrengthColor = (strength) => {
    switch (strength) {
      case 'strong': return 'text-green-400 border-green-400/30'
      case 'medium': return 'text-yellow-400 border-yellow-400/30'
      case 'weak': return 'text-red-400 border-red-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }

  return (
    <div className="space-y-6">
      {/* Network Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-gray-900/50 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Network Size</p>
                <p className="text-2xl font-bold text-blue-400">{angelProfile.networkSize}</p>
                <div className="text-sm text-gray-400">
                  Active connections
                </div>
              </div>
              <Network className="w-8 h-8 text-blue-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-green-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Referrals Made</p>
                <p className="text-2xl font-bold text-green-400">{angelProfile.referrals}</p>
                <div className="text-sm text-gray-400">
                  This year
                </div>
              </div>
              <Share2 className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Co-Investments</p>
                <p className="text-2xl font-bold text-purple-400">{angelProfile.coInvestments}</p>
                <div className="text-sm text-gray-400">
                  Joint deals
                </div>
              </div>
              <Handshake className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Connections */}
      <Card className="bg-gray-900/50 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
            <Users className="w-6 h-6" />
            Network Connections
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {networkConnections.map((connection) => (
              <motion.div
                key={connection.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg hover:border-purple-400/50 transition-all cursor-pointer"
                onClick={() => setSelectedConnection(connection)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {connection.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{connection.name}</h4>
                      <div className="text-sm text-gray-400">
                        {connection.role} at {connection.company}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getConnectionStrengthColor(connection.connectionStrength)}>
                      {connection.connectionStrength}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-1">
                      {connection.lastInteraction}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Location</div>
                    <div className="font-semibold text-blue-400">{connection.location}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Investments</div>
                    <div className="font-semibold text-green-400">{connection.investments}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Shared Deals</div>
                    <div className="font-semibold text-purple-400">{connection.sharedInvestments}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Focus Sectors</div>
                    <div className="font-semibold text-orange-400 text-xs">
                      {connection.sectors.join(', ')}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Sectors: {connection.sectors.join(', ')}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-400/30 text-blue-400">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button size="sm" className="bg-purple-600 hover:bg-purple-700">
                      <Share2 className="w-4 h-4 mr-2" />
                      Refer Deal
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Syndicate Opportunities */}
      <Card className="bg-gray-900/50 border-gold-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gold-400 flex items-center gap-2">
            <Handshake className="w-6 h-6" />
            Syndicate Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {syndicateDeals.map((deal) => (
              <motion.div
                key={deal.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-semibold text-white text-lg">{deal.name}</h4>
                    <div className="text-sm text-gray-400">
                      Led by {deal.lead} • {deal.sector} • {deal.stage}
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                      SSE: {deal.sseScore}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-1">
                      {deal.participants} participants
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Total Raise</div>
                    <div className="font-bold text-blue-400">
                      ${(deal.totalRaise / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Angel Allocation</div>
                    <div className="font-bold text-green-400">
                      ${(deal.angelAllocation / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Check Range</div>
                    <div className="font-bold text-purple-400">
                      ${(deal.minCheck / 1000).toFixed(0)}K - ${(deal.maxCheck / 1000).toFixed(0)}K
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Deadline</div>
                    <div className="font-bold text-orange-400">
                      {new Date(deal.deadline).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-400">Funding Progress</span>
                    <span className="text-blue-400">
                      ${(deal.committed / 1000).toFixed(0)}K / ${(deal.angelAllocation / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Progress value={(deal.committed / deal.angelAllocation) * 100} className="h-2" />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    ${(deal.remaining / 1000).toFixed(0)}K remaining
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-gold-400/30 text-gold-400">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-gold-600 hover:bg-gold-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Join Syndicate
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Angel Investor Dashboard Component
export default function EnhancedAngelInvestorDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio')
  
  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'deals', label: 'Deal Sourcing', icon: Target },
    { id: 'network', label: 'Network', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <PersonalPortfolio />
      case 'deals':
        return <DealSourcing />
      case 'network':
        return <NetworkBuilding />
      default:
        return <PersonalPortfolio />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            Welcome back, {angelProfile.name}
          </h1>
          <p className="text-gray-400 mt-1">
            Angel Investor • {angelProfile.portfolioSize} Investments • {angelProfile.networkSize} Network Connections
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-purple-500 text-white">Angel Investor</Badge>
          <Button variant="outline" className="border-blue-400/30 text-blue-400">
            <Plus className="w-4 h-4 mr-2" />
            New Investment
          </Button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-2 border-b border-gray-700">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-t-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-blue-600 text-white border-b-2 border-blue-400'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          )
        })}
      </div>

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
  )
}
