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
  MessageSquare
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart as RechartsPieChart, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts'

// VC Profile Data
const vcProfile = {
  name: 'Alexandra Rodriguez',
  firm: 'Quantum Ventures',
  tier: 'market_intelligence', // portfolio_only, deal_flow, market_intelligence
  aum: 250000000,
  portfolioSize: 47,
  activeDeals: 12,
  successRate: 68.5,
  avgCheck: 2500000,
  sectors: ['AI/ML', 'Biotech', 'Fintech', 'CleanTech'],
  stage: ['Series A', 'Series B'],
  geography: ['North America', 'Europe']
}

// Portfolio Companies Data
const portfolioCompanies = [
  {
    id: 1,
    name: 'QuantumAI',
    sector: 'AI/ML',
    stage: 'Series B',
    investment: 5000000,
    currentValuation: 120000000,
    sseScore: 94,
    sseTrend: 'up',
    lastUpdate: '2 hours ago',
    healthStatus: 'excellent',
    roi: 340,
    founded: '2022-03-15',
    team: 45,
    runway: 24,
    nextMilestone: 'Series C',
    riskScore: 2.1,
    alerts: []
  },
  {
    id: 2,
    name: 'BioSynth',
    sector: 'Biotech',
    stage: 'Series A',
    investment: 3000000,
    currentValuation: 85000000,
    sseScore: 89,
    sseTrend: 'up',
    lastUpdate: '1 day ago',
    healthStatus: 'good',
    roi: 280,
    founded: '2021-08-20',
    team: 32,
    runway: 18,
    nextMilestone: 'FDA Approval',
    riskScore: 3.4,
    alerts: ['Regulatory milestone approaching']
  },
  {
    id: 3,
    name: 'FinFlow',
    sector: 'Fintech',
    stage: 'Seed',
    investment: 1500000,
    currentValuation: 25000000,
    sseScore: 76,
    sseTrend: 'stable',
    lastUpdate: '3 hours ago',
    healthStatus: 'warning',
    roi: 180,
    founded: '2023-01-10',
    team: 18,
    runway: 12,
    nextMilestone: 'Series A',
    riskScore: 6.8,
    alerts: ['Burn rate increasing', 'Competition intensifying']
  },
  {
    id: 4,
    name: 'CleanTech',
    sector: 'Energy',
    stage: 'Series A',
    investment: 4000000,
    currentValuation: 65000000,
    sseScore: 82,
    sseTrend: 'up',
    lastUpdate: '5 hours ago',
    healthStatus: 'good',
    roi: 220,
    founded: '2022-06-30',
    team: 28,
    runway: 20,
    nextMilestone: 'Commercial Deployment',
    riskScore: 4.2,
    alerts: []
  }
]

// Deal Flow Data
const dealFlowOpportunities = [
  {
    id: 1,
    name: 'NeuralNet Pro',
    sector: 'AI/ML',
    stage: 'Series A',
    seeking: 8000000,
    valuation: 45000000,
    sseScore: 91,
    founded: '2023-02-15',
    team: 22,
    traction: 'Strong',
    location: 'San Francisco',
    introduction: 'Available',
    matchScore: 95,
    highlights: ['Ex-Google founders', 'Enterprise customers', 'Patent portfolio'],
    riskFactors: ['Competitive market', 'Regulatory uncertainty']
  },
  {
    id: 2,
    name: 'BioHeal',
    sector: 'Biotech',
    stage: 'Seed',
    seeking: 3500000,
    valuation: 18000000,
    sseScore: 87,
    founded: '2023-05-20',
    team: 15,
    traction: 'Early',
    location: 'Boston',
    introduction: 'Warm intro available',
    matchScore: 88,
    highlights: ['FDA breakthrough designation', 'Strong IP', 'Experienced team'],
    riskFactors: ['Long development cycle', 'Regulatory risk']
  },
  {
    id: 3,
    name: 'GreenEnergy',
    sector: 'CleanTech',
    stage: 'Series A',
    seeking: 12000000,
    valuation: 60000000,
    sseScore: 84,
    founded: '2022-09-10',
    team: 35,
    traction: 'Proven',
    location: 'Austin',
    introduction: 'Direct contact',
    matchScore: 82,
    highlights: ['Government contracts', 'Scalable technology', 'Revenue positive'],
    riskFactors: ['Policy dependency', 'Capital intensive']
  }
]

// Market Intelligence Data
const marketIntelligence = {
  sectors: [
    { name: 'AI/ML', deals: 234, volume: 12.4e9, avgValuation: 52e6, growth: 45, trend: 'up' },
    { name: 'Biotech', deals: 156, volume: 8.7e9, avgValuation: 55e6, growth: 32, trend: 'up' },
    { name: 'Fintech', deals: 189, volume: 6.2e9, avgValuation: 33e6, growth: -12, trend: 'down' },
    { name: 'CleanTech', deals: 98, volume: 4.1e9, avgValuation: 42e6, growth: 28, trend: 'up' }
  ],
  trends: [
    { quarter: 'Q1 2024', aiml: 8.2, biotech: 6.1, fintech: 4.8, cleantech: 3.2 },
    { quarter: 'Q2 2024', aiml: 9.8, biotech: 7.3, fintech: 4.2, cleantech: 3.8 },
    { quarter: 'Q3 2024', aiml: 12.4, biotech: 8.7, fintech: 6.2, cleantech: 4.1 },
    { quarter: 'Q4 2024', aiml: 14.1, biotech: 9.2, fintech: 5.8, cleantech: 4.9 }
  ]
}

// Portfolio Performance Component
const PortfolioPerformance = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('1Y')
  const [selectedCompany, setSelectedCompany] = useState(null)
  
  const timeframes = ['1M', '3M', '6M', '1Y', 'All']
  
  const portfolioPerformance = [
    { month: 'Jan', value: 180, benchmark: 165 },
    { month: 'Feb', value: 195, benchmark: 172 },
    { month: 'Mar', value: 210, benchmark: 180 },
    { month: 'Apr', value: 225, benchmark: 188 },
    { month: 'May', value: 240, benchmark: 195 },
    { month: 'Jun', value: 250, benchmark: 200 }
  ]
  
  const getHealthColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-green-400 border-green-400/30'
      case 'good': return 'text-blue-400 border-blue-400/30'
      case 'warning': return 'text-yellow-400 border-yellow-400/30'
      case 'critical': return 'text-red-400 border-red-400/30'
      default: return 'text-gray-400 border-gray-400/30'
    }
  }
  
  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />
      default: return <Activity className="w-4 h-4 text-gray-400" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Portfolio Overview Chart */}
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-semibold text-blue-400 flex items-center gap-2">
              <LineChart className="w-6 h-6" />
              Portfolio Performance
            </CardTitle>
            <div className="flex gap-2">
              {timeframes.map((timeframe) => (
                <Button
                  key={timeframe}
                  variant={selectedTimeframe === timeframe ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setSelectedTimeframe(timeframe)}
                  className={selectedTimeframe === timeframe ? "bg-blue-600" : ""}
                >
                  {timeframe}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={portfolioPerformance}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
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
                  fill="url(#colorPortfolio)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fillOpacity={1} 
                  fill="url(#colorBenchmark)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Companies Grid */}
      <Card className="bg-gray-900/50 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            Portfolio Companies
            <Badge className="bg-purple-500 text-white ml-auto">
              {portfolioCompanies.length} Companies
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {portfolioCompanies.map((company) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.01 }}
                className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg cursor-pointer hover:border-purple-400/50 transition-all"
                onClick={() => setSelectedCompany(company)}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                      <span className="text-white font-bold text-lg">
                        {company.name.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-lg">{company.name}</h4>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        <span>{company.sector}</span>
                        <span>•</span>
                        <span>{company.stage}</span>
                        <span>•</span>
                        <span>Founded {new Date(company.founded).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className={getHealthColor(company.healthStatus)}>
                      {company.healthStatus}
                    </Badge>
                    <div className="text-sm text-gray-400 mt-1">
                      Updated {company.lastUpdate}
                    </div>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-6 gap-4 mb-3">
                  <div>
                    <div className="text-xs text-gray-400">Investment</div>
                    <div className="font-bold text-blue-400">
                      ${(company.investment / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Valuation</div>
                    <div className="font-bold text-green-400">
                      ${(company.currentValuation / 1000000).toFixed(0)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">ROI</div>
                    <div className="font-bold text-purple-400">
                      +{company.roi}%
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">SSE Score</div>
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-yellow-400">{company.sseScore}</span>
                      {getTrendIcon(company.sseTrend)}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Team</div>
                    <div className="font-bold text-orange-400">{company.team}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Runway</div>
                    <div className="font-bold text-pink-400">{company.runway}mo</div>
                  </div>
                </div>
                
                {company.alerts.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {company.alerts.map((alert, index) => (
                      <Badge key={index} variant="outline" className="text-yellow-400 border-yellow-400/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {alert}
                      </Badge>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Deal Flow Discovery Component
const DealFlowDiscovery = () => {
  const [filters, setFilters] = useState({
    sector: 'all',
    stage: 'all',
    sseScore: [70, 100],
    seeking: [0, 50000000]
  })
  const [sortBy, setSortBy] = useState('matchScore')
  const [savedDeals, setSavedDeals] = useState(new Set())
  
  const handleSaveDeal = (dealId) => {
    setSavedDeals(prev => {
      const newSet = new Set(prev)
      if (newSet.has(dealId)) {
        newSet.delete(dealId)
      } else {
        newSet.add(dealId)
      }
      return newSet
    })
  }
  
  const getMatchScoreColor = (score) => {
    if (score >= 90) return 'text-green-400 border-green-400/30'
    if (score >= 80) return 'text-blue-400 border-blue-400/30'
    if (score >= 70) return 'text-yellow-400 border-yellow-400/30'
    return 'text-red-400 border-red-400/30'
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="bg-gray-900/50 border-green-400/30">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-green-400 flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Deal Flow Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sector</label>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                value={filters.sector}
                onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value }))}
              >
                <option value="all">All Sectors</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Biotech">Biotech</option>
                <option value="Fintech">Fintech</option>
                <option value="CleanTech">CleanTech</option>
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
                <option value="Seed">Seed</option>
                <option value="Series A">Series A</option>
                <option value="Series B">Series B</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Min SSE Score</label>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={filters.sseScore[0]}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  sseScore: [parseInt(e.target.value), prev.sseScore[1]] 
                }))}
                className="w-full"
              />
              <div className="text-xs text-gray-400 mt-1">{filters.sseScore[0]}/100</div>
            </div>
            <div>
              <label className="text-sm text-gray-400 mb-2 block">Sort By</label>
              <select 
                className="w-full p-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="matchScore">Match Score</option>
                <option value="sseScore">SSE Score</option>
                <option value="valuation">Valuation</option>
                <option value="seeking">Funding Amount</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Deal Flow Opportunities */}
      <Card className="bg-gray-900/50 border-blue-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-blue-400 flex items-center gap-2">
            <Target className="w-6 h-6" />
            Deal Flow Opportunities
            <Badge className="bg-blue-500 text-white ml-auto">
              {dealFlowOpportunities.length} Matches
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dealFlowOpportunities.map((deal) => (
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
                        <span>Founded {new Date(deal.founded).getFullYear()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className={getMatchScoreColor(deal.matchScore)}>
                      {deal.matchScore}% Match
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSaveDeal(deal.id)}
                      className={savedDeals.has(deal.id) ? 'text-red-400' : 'text-gray-400'}
                    >
                      <Heart className={`w-4 h-4 ${savedDeals.has(deal.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-400">Seeking</div>
                    <div className="font-bold text-green-400">
                      ${(deal.seeking / 1000000).toFixed(1)}M
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">Valuation</div>
                    <div className="font-bold text-blue-400">
                      ${(deal.valuation / 1000000).toFixed(0)}M
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
                
                <div className="mb-4">
                  <h5 className="font-semibold text-red-400 mb-2">Risk Factors</h5>
                  <div className="flex flex-wrap gap-2">
                    {deal.riskFactors.map((risk, index) => (
                      <Badge key={index} variant="outline" className="text-red-400 border-red-400/30">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        {risk}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Introduction: <span className="text-blue-400">{deal.introduction}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-blue-400/30 text-blue-400">
                      <FileText className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Mail className="w-4 h-4 mr-2" />
                      Request Introduction
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

// Market Intelligence Component
const MarketIntelligenceView = () => {
  const [selectedSector, setSelectedSector] = useState('AI/ML')
  
  const sectorColors = {
    'AI/ML': '#3b82f6',
    'Biotech': '#10b981',
    'Fintech': '#f59e0b',
    'CleanTech': '#8b5cf6'
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {marketIntelligence.sectors.map((sector) => (
          <Card key={sector.name} className="bg-gray-900/50 border-blue-400/30">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-blue-400">{sector.name}</h4>
                <Badge variant="outline" className={`${
                  sector.trend === 'up' ? 'text-green-400 border-green-400/30' :
                  sector.trend === 'down' ? 'text-red-400 border-red-400/30' :
                  'text-yellow-400 border-yellow-400/30'
                }`}>
                  {sector.growth > 0 ? '+' : ''}{sector.growth}%
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Deals</span>
                  <span className="font-semibold">{sector.deals}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Volume</span>
                  <span className="font-semibold">${(sector.volume / 1e9).toFixed(1)}B</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Avg Valuation</span>
                  <span className="font-semibold">${(sector.avgValuation / 1e6).toFixed(0)}M</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sector Trends Chart */}
      <Card className="bg-gray-900/50 border-purple-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
            <BarChart3 className="w-6 h-6" />
            Sector Investment Trends
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={marketIntelligence.trends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="quarter" stroke="#888" />
                <YAxis stroke="#888" tickFormatter={(value) => `$${value}B`} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0a0a0a', 
                    border: '1px solid #333',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}B`, 'Investment Volume']}
                />
                <Bar dataKey="aiml" fill="#3b82f6" name="AI/ML" />
                <Bar dataKey="biotech" fill="#10b981" name="Biotech" />
                <Bar dataKey="fintech" fill="#f59e0b" name="Fintech" />
                <Bar dataKey="cleantech" fill="#8b5cf6" name="CleanTech" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Insights */}
      <Card className="bg-gray-900/50 border-gold-400/30">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gold-400 flex items-center gap-2">
            <Brain className="w-6 h-6" />
            AI Market Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <TrendingUp className="w-5 h-5 text-blue-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-blue-400">AI/ML Sector Surge</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    AI/ML investments increased 45% this quarter, driven by enterprise adoption and 
                    breakthrough developments in LLMs. Average valuations up 32% YoY.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-green-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-green-400">Biotech Momentum</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Biotech sector showing strong fundamentals with 32% growth. FDA approvals 
                    accelerating and aging population driving demand.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-1" />
                <div>
                  <h4 className="font-semibold text-red-400">Fintech Headwinds</h4>
                  <p className="text-sm text-gray-300 mt-1">
                    Fintech facing regulatory pressure and market saturation. Investment volume 
                    down 12% as investors become more selective.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main VC Dashboard Component
export default function EnhancedVentureCapitalDashboard() {
  const [activeTab, setActiveTab] = useState('portfolio')
  
  const tabs = [
    { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
    { id: 'dealflow', label: 'Deal Flow', icon: Target },
    { id: 'intelligence', label: 'Market Intelligence', icon: Brain },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'portfolio':
        return <PortfolioPerformance />
      case 'dealflow':
        return <DealFlowDiscovery />
      case 'intelligence':
        return <MarketIntelligenceView />
      default:
        return <PortfolioPerformance />
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
            Welcome back, {vcProfile.name}
          </h1>
          <p className="text-gray-400 mt-1">
            {vcProfile.firm} • {vcProfile.portfolioSize} Portfolio Companies • ${(vcProfile.aum / 1000000).toFixed(0)}M AUM
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className={`${
            vcProfile.tier === 'market_intelligence' ? 'bg-gold-500 text-black' :
            vcProfile.tier === 'deal_flow' ? 'bg-purple-500 text-white' :
            'bg-blue-500 text-white'
          }`}>
            {vcProfile.tier.replace('_', ' ').toUpperCase()}
          </Badge>
          <Button variant="outline" className="border-blue-400/30 text-blue-400">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Tier
          </Button>
        </div>
      </motion.div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-gray-900/50 border-blue-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Portfolio Value</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${(vcProfile.aum / 1000000).toFixed(0)}M
                </p>
                <div className="flex items-center gap-1 text-sm text-green-400">
                  <TrendingUp className="w-3 h-3" />
                  <span>+12.5%</span>
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
                <p className="text-xs text-gray-400 uppercase tracking-wide">Success Rate</p>
                <p className="text-2xl font-bold text-green-400">{vcProfile.successRate}%</p>
                <div className="text-sm text-gray-400">
                  Above industry avg
                </div>
              </div>
              <Trophy className="w-8 h-8 text-green-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-purple-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Active Deals</p>
                <p className="text-2xl font-bold text-purple-400">{vcProfile.activeDeals}</p>
                <div className="text-sm text-gray-400">
                  In pipeline
                </div>
              </div>
              <Activity className="w-8 h-8 text-purple-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gray-900/50 border-orange-400/30">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide">Avg Check</p>
                <p className="text-2xl font-bold text-orange-400">
                  ${(vcProfile.avgCheck / 1000000).toFixed(1)}M
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
