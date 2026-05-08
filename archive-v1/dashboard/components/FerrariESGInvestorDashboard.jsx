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
  TrendingUpIcon, TrendingDownIcon, DollarSignIcon, TargetIcon, UsersIcon, Leaf,
  Recycle, Wind, Sun, Droplets, TreePine, Factory, Home, Car, Plane, Ship,
  Scale, Gavel, Award, Medal, Star, Handshake, UserHeart, Baby, GraduationCap,
  Stethoscope, Wheat, Zap as Energy, Hammer, Wifi, Mountain, Fish, Bird, Flower2
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
// ESG INVESTOR PROFILE & PORTFOLIO DATA
// ============================================================================

const esgProfile = {
  id: 'esg_investor_456',
  name: 'Dr. Sarah Martinez',
  title: 'ESG Fund Manager & Impact Investor',
  email: 'sarah.martinez@impactfund.com',
  tier: 'free', // free, standard, premium
  location: 'London, UK',
  
  // ESG Investment Profile
  investmentProfile: {
    totalInvested: 15000000, // $15M
    portfolioValue: 28500000, // $28.5M
    activeInvestments: 24,
    impactThemes: ['Climate Tech', 'Social Impact', 'Sustainable Agriculture', 'Clean Energy'],
    sdgFocus: [3, 7, 8, 13, 15], // Health, Energy, Work, Climate, Life on Land
    geographies: ['Europe', 'North America', 'Emerging Markets'],
    profileCompletion: 45,
    esgFramework: 'SASB', // SASB, GRI, TCFD, SFDR
    impactMeasurement: 'IRIS+',
    carbonNeutralCommitment: true,
    diversityTargets: true
  },
  
  // ESG Performance Metrics
  metrics: {
    totalROI: 1.9, // Financial return
    impactROI: 4.2, // Social/Environmental return
    esgScore: 87, // Overall ESG performance
    carbonFootprint: -125000, // Negative = carbon positive (tons CO2 avoided)
    socialImpact: 450000, // Lives positively impacted
    governanceScore: 92,
    diversityScore: 78,
    sustainabilityRating: 'A+',
    impactAlignment: 94, // % alignment with SDGs
    riskAdjustedReturn: 18.5,
    blendedValue: 8.7 // Combined financial + impact score
  },
  
  // Subscription & Billing
  billing: {
    plan: 'free',
    monthlyPrice: 0,
    standardPrice: 199,
    premiumPrice: 499,
    status: 'active',
    nextBilling: null,
    paymentMethod: null,
    trialEndsAt: null
  }
}

// ESG Portfolio Companies Data
const esgPortfolioCompanies = [
  {
    id: 'esg_company_1',
    name: 'SolarTech Solutions',
    sector: 'Clean Energy',
    stage: 'Series B',
    investment: 2500000,
    currentValue: 8200000,
    roi: 3.28,
    esgScore: 94,
    carbonImpact: -45000, // CO2 tons avoided
    socialImpact: 125000, // People served
    sdgAlignment: [7, 13], // Affordable Energy, Climate Action
    status: 'Impact Leader',
    lastUpdate: '2024-03-15',
    nextMilestone: 'IPO Preparation',
    riskLevel: 'low',
    governanceScore: 96,
    diversityScore: 85,
    sustainabilityMetrics: {
      energyEfficiency: 92,
      wasteReduction: 88,
      waterConservation: 76,
      biodiversityImpact: 82
    },
    impactKPIs: {
      renewableEnergyGenerated: '450 GWh',
      co2Avoided: '45,000 tons',
      jobsCreated: 1250,
      communitiesServed: 89
    }
  },
  {
    id: 'esg_company_2',
    name: 'AgriGreen Innovations',
    sector: 'Sustainable Agriculture',
    stage: 'Series A',
    investment: 1800000,
    currentValue: 4200000,
    roi: 2.33,
    esgScore: 89,
    carbonImpact: -28000,
    socialImpact: 85000,
    sdgAlignment: [2, 15], // Zero Hunger, Life on Land
    status: 'Strong Performer',
    lastUpdate: '2024-03-12',
    nextMilestone: 'Market Expansion',
    riskLevel: 'medium',
    governanceScore: 88,
    diversityScore: 92,
    sustainabilityMetrics: {
      soilHealth: 94,
      waterEfficiency: 89,
      biodiversityIndex: 91,
      chemicalReduction: 87
    },
    impactKPIs: {
      farmersSupported: 12500,
      organicLandConverted: '25,000 hectares',
      yieldIncrease: '35%',
      pesticideReduction: '60%'
    }
  },
  {
    id: 'esg_company_3',
    name: 'HealthAccess Global',
    sector: 'Healthcare Technology',
    stage: 'Seed',
    investment: 1200000,
    currentValue: 2800000,
    roi: 2.33,
    esgScore: 86,
    carbonImpact: -5000,
    socialImpact: 180000,
    sdgAlignment: [3, 10], // Good Health, Reduced Inequalities
    status: 'Impact Champion',
    lastUpdate: '2024-03-10',
    nextMilestone: 'Series A',
    riskLevel: 'medium',
    governanceScore: 84,
    diversityScore: 96,
    sustainabilityMetrics: {
      accessibilityScore: 95,
      affordabilityIndex: 88,
      qualityMetrics: 92,
      digitalInclusion: 87
    },
    impactKPIs: {
      patientsServed: 180000,
      healthcareAccess: '45 rural communities',
      costReduction: '40%',
      healthOutcomes: '+25% improvement'
    }
  },
  {
    id: 'esg_company_4',
    name: 'CircularTech',
    sector: 'Circular Economy',
    stage: 'Series A',
    investment: 2000000,
    currentValue: 3500000,
    roi: 1.75,
    esgScore: 91,
    carbonImpact: -35000,
    socialImpact: 65000,
    sdgAlignment: [12, 14], // Responsible Consumption, Life Below Water
    status: 'Monitor',
    lastUpdate: '2024-03-08',
    nextMilestone: 'Product Launch',
    riskLevel: 'medium',
    governanceScore: 89,
    diversityScore: 78,
    sustainabilityMetrics: {
      wasteReduction: 96,
      recyclingRate: 94,
      materialEfficiency: 88,
      circularityIndex: 92
    },
    impactKPIs: {
      wasteProcessed: '125,000 tons',
      materialsRecycled: '85%',
      oceanPlasticRemoved: '2,500 tons',
      circularJobs: 450
    }
  }
]

// ESG Deal Flow Data
const esgDealFlowData = [
  {
    id: 'esg_deal_1',
    companyName: 'CarbonCapture Pro',
    sector: 'Climate Technology',
    stage: 'Series A',
    askAmount: 8000000,
    checkSize: 1500000,
    esgMatchScore: 96,
    impactScore: 94,
    location: 'Copenhagen, Denmark',
    description: 'Direct air capture technology for carbon removal at scale',
    founders: ['Dr. Erik Hansen (Climate Scientist)', 'Maria Johansson (Ex-Tesla)'],
    impactMetrics: {
      co2CaptureCapacity: '100,000 tons/year',
      energyEfficiency: '95%',
      scalabilityPotential: 'Global',
      costPerTon: '$150'
    },
    sdgAlignment: [7, 13, 15],
    esgRisks: ['Technology scalability', 'Energy requirements'],
    impactOpportunities: ['Carbon market leadership', 'Climate reversal potential'],
    timeline: '3 weeks left',
    leadInvestor: 'Breakthrough Energy Ventures',
    warmIntro: true,
    certifications: ['B-Corp Pending', 'EU Taxonomy Aligned', 'TCFD Compliant']
  },
  {
    id: 'esg_deal_2',
    companyName: 'EduTech Inclusion',
    sector: 'Education Technology',
    stage: 'Seed',
    askAmount: 3000000,
    checkSize: 800000,
    esgMatchScore: 89,
    impactScore: 92,
    location: 'Nairobi, Kenya',
    description: 'AI-powered education platform for underserved communities',
    founders: ['Grace Wanjiku (Education Expert)', 'James Ochieng (Tech Lead)'],
    impactMetrics: {
      studentsReached: '50,000+',
      learningImprovement: '40%',
      teacherTraining: '2,500 educators',
      costReduction: '70%'
    },
    sdgAlignment: [4, 5, 10],
    esgRisks: ['Market penetration challenges', 'Technology adoption'],
    impactOpportunities: ['Education equity', 'Digital literacy', 'Economic mobility'],
    timeline: '2 weeks left',
    leadInvestor: 'Acumen Fund',
    warmIntro: false,
    certifications: ['B-Corp Certified', 'GIIRS Rated', 'UN Global Compact']
  },
  {
    id: 'esg_deal_3',
    companyName: 'Ocean Restoration Labs',
    sector: 'Marine Conservation',
    stage: 'Pre-seed',
    askAmount: 2500000,
    checkSize: 600000,
    esgMatchScore: 87,
    impactScore: 95,
    location: 'Sydney, Australia',
    description: 'Coral reef restoration using biotechnology and AI monitoring',
    founders: ['Dr. Sarah Chen (Marine Biologist)', 'Alex Thompson (Biotech)'],
    impactMetrics: {
      coralReefArea: '500 hectares restored',
      marineSpecies: '150+ species protected',
      carbonSequestration: '25,000 tons CO2',
      fisheriesSupported: 45
    },
    sdgAlignment: [14, 15, 1],
    esgRisks: ['Environmental complexity', 'Long-term outcomes'],
    impactOpportunities: ['Biodiversity restoration', 'Climate resilience', 'Coastal protection'],
    timeline: '4 weeks left',
    leadInvestor: 'Ocean Impact Fund',
    warmIntro: true,
    certifications: ['Marine Stewardship Council', 'Blue Economy Certified']
  }
]

// SDG Goals Data
const sdgGoals = [
  { id: 1, name: 'No Poverty', icon: '🏠', color: '#E5243B' },
  { id: 2, name: 'Zero Hunger', icon: '🌾', color: '#DDA63A' },
  { id: 3, name: 'Good Health', icon: '❤️', color: '#4C9F38' },
  { id: 4, name: 'Quality Education', icon: '📚', color: '#C5192D' },
  { id: 5, name: 'Gender Equality', icon: '⚖️', color: '#FF3A21' },
  { id: 6, name: 'Clean Water', icon: '💧', color: '#26BDE2' },
  { id: 7, name: 'Affordable Energy', icon: '⚡', color: '#FCC30B' },
  { id: 8, name: 'Decent Work', icon: '💼', color: '#A21942' },
  { id: 9, name: 'Innovation', icon: '🏭', color: '#FD6925' },
  { id: 10, name: 'Reduced Inequalities', icon: '🤝', color: '#DD1367' },
  { id: 11, name: 'Sustainable Cities', icon: '🏙️', color: '#FD9D24' },
  { id: 12, name: 'Responsible Consumption', icon: '♻️', color: '#BF8B2E' },
  { id: 13, name: 'Climate Action', icon: '🌍', color: '#3F7E44' },
  { id: 14, name: 'Life Below Water', icon: '🐟', color: '#0A97D9' },
  { id: 15, name: 'Life on Land', icon: '🌳', color: '#56C02B' },
  { id: 16, name: 'Peace & Justice', icon: '⚖️', color: '#00689D' },
  { id: 17, name: 'Partnerships', icon: '🤝', color: '#19486A' }
]

// ESG Frameworks
const esgFrameworks = [
  { id: 'SASB', name: 'SASB Standards', description: 'Sustainability Accounting Standards Board' },
  { id: 'GRI', name: 'GRI Standards', description: 'Global Reporting Initiative' },
  { id: 'TCFD', name: 'TCFD Framework', description: 'Task Force on Climate-related Financial Disclosures' },
  { id: 'SFDR', name: 'SFDR Compliance', description: 'Sustainable Finance Disclosure Regulation' },
  { id: 'EU_TAXONOMY', name: 'EU Taxonomy', description: 'European Union Taxonomy for Sustainable Activities' },
  { id: 'IRIS_PLUS', name: 'IRIS+ System', description: 'Impact Measurement & Management System' }
]

// ============================================================================
// MAIN DASHBOARD COMPONENTS
// ============================================================================

// Critical ESG Action Banner
const CriticalESGActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 'alert_1',
      type: 'impact_opportunity',
      company: 'CarbonCapture Pro',
      message: 'High-impact climate deal: 96% ESG match, 100K tons CO2 capture potential',
      action: 'Review investment opportunity',
      impact: 'Climate Critical'
    },
    {
      id: 'alert_2',
      type: 'portfolio_alert',
      company: 'CircularTech',
      message: 'ESG score improvement: +8 points, waste reduction target exceeded',
      action: 'Update impact reporting',
      impact: 'Positive'
    }
  ])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-500 to-blue-500 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Leaf className="w-5 h-5 animate-pulse" />
            <div>
              <strong>ESG INTELLIGENCE:</strong>
              <span className="ml-2">
                Impact Score: {esgProfile.metrics.impactROI} • 
                Carbon Positive: {Math.abs(esgProfile.metrics.carbonFootprint).toLocaleString()} tons CO2 • 
                {criticalAlerts.length} impact alerts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              Live Impact Tracking
            </Badge>
            <Button 
              size="sm" 
              className="bg-white text-green-600 hover:bg-gray-100"
              onClick={() => {/* Open alerts modal */}}
            >
              <Eye className="w-4 h-4 mr-1" />
              View Impact
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

// ESG Profile Completion Widget
const ESGProfileCompletionWidget = () => {
  const [completionPercentage, setCompletionPercentage] = useState(esgProfile.investmentProfile.profileCompletion)
  
  const profileTasks = [
    { id: 1, task: 'Basic ESG Framework', completed: true },
    { id: 2, task: 'SDG Focus Areas', completed: false },
    { id: 3, task: 'Impact Measurement Preferences', completed: false },
    { id: 4, task: 'Carbon Neutrality Commitment', completed: true },
    { id: 5, task: 'Diversity & Inclusion Targets', completed: false },
    { id: 6, task: 'Geographic Impact Priorities', completed: false },
    { id: 7, task: 'Sector Exclusions & Preferences', completed: false }
  ]

  const completedTasks = profileTasks.filter(task => task.completed).length
  const totalTasks = profileTasks.length

  return (
    <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Complete Your ESG Profile for Better Impact Matching</h3>
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
          Complete your ESG profile to unlock personalized impact deal flow and comprehensive ESG reporting. 
          We use this data to match you with investments aligned to your impact thesis.
        </p>

        <div className="space-y-2 mb-4">
          {profileTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                task.completed ? 'bg-white text-green-500' : ''
              }`}>
                {task.completed && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${task.completed ? 'opacity-70 line-through' : ''}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-white text-green-600 hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-2" />
          Complete ESG Profile Now
        </Button>
      </CardContent>
    </Card>
  )
}

// ESG Impact Metrics Dashboard
const ESGImpactMetrics = () => {
  const metrics = esgProfile.metrics
  
  const impactMetricsData = [
    {
      label: 'Impact ROI',
      value: `${metrics.impactROI}x`,
      change: '+0.6x vs last quarter',
      trend: 'up',
      color: 'green',
      icon: HeartHandshake,
      description: 'Social & Environmental Return'
    },
    {
      label: 'ESG Score',
      value: metrics.esgScore.toString(),
      change: '+5 points',
      trend: 'up',
      color: 'blue',
      icon: Shield,
      description: 'Overall ESG Performance'
    },
    {
      label: 'Carbon Impact',
      value: `${Math.abs(metrics.carbonFootprint / 1000).toFixed(0)}K tons`,
      change: 'CO2 Avoided',
      trend: 'up',
      color: 'green',
      icon: Leaf,
      description: 'Carbon Positive Portfolio'
    },
    {
      label: 'Social Impact',
      value: `${(metrics.socialImpact / 1000).toFixed(0)}K`,
      change: 'Lives Improved',
      trend: 'up',
      color: 'purple',
      icon: Users,
      description: 'People Positively Impacted'
    },
    {
      label: 'Governance Score',
      value: metrics.governanceScore.toString(),
      change: '+3 points',
      trend: 'up',
      color: 'indigo',
      icon: Scale,
      description: 'Corporate Governance Rating'
    },
    {
      label: 'SDG Alignment',
      value: `${metrics.impactAlignment}%`,
      change: 'UN Goals Aligned',
      trend: 'up',
      color: 'orange',
      icon: Target,
      description: 'Sustainable Development Goals'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {impactMetricsData.map((metric, index) => {
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
                  <Badge variant={metric.trend === 'up' ? 'success' : 'secondary'}>
                    {metric.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="text-2xl font-bold text-white">{metric.value}</div>
                  <div className="text-sm text-gray-400">{metric.label}</div>
                  <div className="text-xs text-gray-500">{metric.description}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

// SDG Alignment Visualization
const SDGAlignmentChart = () => {
  const alignedSDGs = esgProfile.investmentProfile.sdgFocus
  
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-6 h-6" />
          SDG Portfolio Alignment
          <Badge variant="outline" className="ml-2">
            {alignedSDGs.length} Goals
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {sdgGoals.map((sdg) => {
            const isAligned = alignedSDGs.includes(sdg.id)
            return (
              <motion.div
                key={sdg.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: sdg.id * 0.05 }}
                className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${
                  isAligned 
                    ? 'border-green-400 bg-green-900/20 text-white' 
                    : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                }`}
                style={{ borderColor: isAligned ? sdg.color : undefined }}
              >
                <div className="text-2xl mb-2">{sdg.icon}</div>
                <div className="text-xs font-semibold">{sdg.id}</div>
                <div className="text-xs mt-1">{sdg.name}</div>
                {isAligned && (
                  <Badge variant="success" className="mt-2 text-xs">
                    Active
                  </Badge>
                )}
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Portfolio Impact Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-400 font-semibold">Climate Action (SDG 13)</div>
              <div className="text-gray-300">125K tons CO2 avoided across 8 companies</div>
            </div>
            <div>
              <div className="text-green-400 font-semibold">Clean Energy (SDG 7)</div>
              <div className="text-gray-300">450 GWh renewable energy generated</div>
            </div>
            <div>
              <div className="text-purple-400 font-semibold">Good Health (SDG 3)</div>
              <div className="text-gray-300">180K people with improved healthcare access</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ESG Portfolio Companies Grid
const ESGPortfolioGrid = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [sortBy, setSortBy] = useState('esgScore')

  const sortedCompanies = [...esgPortfolioCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'esgScore': return b.esgScore - a.esgScore
      case 'carbonImpact': return a.carbonImpact - b.carbonImpact // More negative = better
      case 'socialImpact': return b.socialImpact - a.socialImpact
      case 'roi': return b.roi - a.roi
      default: return 0
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Impact Leader': return 'text-green-400 bg-green-900/20 border-green-400/30'
      case 'Impact Champion': return 'text-blue-400 bg-blue-900/20 border-blue-400/30'
      case 'Strong Performer': return 'text-purple-400 bg-purple-900/20 border-purple-400/30'
      case 'Monitor': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6" />
            ESG Portfolio Companies
            <Badge variant="outline" className="ml-2">
              {sortedCompanies.length} companies
            </Badge>
          </CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="esgScore">Sort by ESG Score</option>
            <option value="carbonImpact">Sort by Carbon Impact</option>
            <option value="socialImpact">Sort by Social Impact</option>
            <option value="roi">Sort by ROI</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedCompanies.map((company) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition-all"
              onClick={() => setSelectedCompany(company)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">{company.name}</h4>
                  <p className="text-sm text-gray-400">{company.sector} • {company.stage}</p>
                </div>
                <Badge className={getStatusColor(company.status)}>
                  {company.status}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {company.roi.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-400">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {company.esgScore}
                  </div>
                  <div className="text-xs text-gray-400">ESG</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">
                    {Math.abs(company.carbonImpact / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">CO2 Avoided</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {(company.socialImpact / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">Lives</div>
                </div>
              </div>

              {/* SDG Alignment */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">SDG Alignment</div>
                <div className="flex gap-2">
                  {company.sdgAlignment.map((sdgId) => {
                    const sdg = sdgGoals.find(g => g.id === sdgId)
                    return (
                      <div
                        key={sdgId}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: sdg?.color }}
                      >
                        {sdgId}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Impact KPIs */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Key Impact Metrics</div>
                {Object.entries(company.impactKPIs).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-green-400 font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Governance & Diversity Scores */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                <div>
                  <div className="text-xs text-gray-400">Governance</div>
                  <div className="text-sm font-semibold text-indigo-400">{company.governanceScore}/100</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Diversity</div>
                  <div className="text-sm font-semibold text-pink-400">{company.diversityScore}/100</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// ESG Deal Flow Component
const ESGDealFlowGrid = () => {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filterBy, setFilterBy] = useState('all')

  const filteredDeals = esgDealFlowData.filter(deal => {
    if (filterBy === 'all') return true
    if (filterBy === 'high_impact') return deal.impactScore >= 90
    if (filterBy === 'climate') return deal.sector.toLowerCase().includes('climate') || deal.sector.toLowerCase().includes('energy')
    if (filterBy === 'social') return deal.sector.toLowerCase().includes('education') || deal.sector.toLowerCase().includes('health')
    return true
  })

  const getImpactScoreColor = (score) => {
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
            ESG Deal Flow
            <Badge variant="premium" className="ml-2">
              Impact-Matched
            </Badge>
          </CardTitle>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Deals</option>
            <option value="high_impact">High Impact (90%+)</option>
            <option value="climate">Climate & Energy</option>
            <option value="social">Social Impact</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
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
                  <Badge className={`${getImpactScoreColor(deal.impactScore)} font-bold text-lg px-3 py-1`}>
                    {deal.impactScore}% Impact
                  </Badge>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      ESG Match: {deal.esgMatchScore}%
                    </Badge>
                  </div>
                  {deal.warmIntro && (
                    <Badge variant="success" className="ml-2 mt-2">
                      Warm Intro
                    </Badge>
                  )}
                </div>
              </div>

              {/* Investment Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Ask Amount</div>
                  <div className="font-semibold text-white">${(deal.askAmount / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Your Check Size</div>
                  <div className="font-semibold text-green-400">${(deal.checkSize / 1000000).toFixed(1)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Lead Investor</div>
                  <div className="font-semibold text-blue-400">{deal.leadInvestor}</div>
                </div>
              </div>

              {/* SDG Alignment */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">SDG Alignment</div>
                <div className="flex gap-2">
                  {deal.sdgAlignment.map((sdgId) => {
                    const sdg = sdgGoals.find(g => g.id === sdgId)
                    return (
                      <div
                        key={sdgId}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                        style={{ backgroundColor: sdg?.color }}
                        title={sdg?.name}
                      >
                        {sdgId}
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Impact Metrics</div>
                  <div className="space-y-1">
                    {Object.entries(deal.impactMetrics).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-xs">
                        <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span className="text-green-400 font-semibold">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-2">Certifications</div>
                  <div className="space-y-1">
                    {deal.certifications.map((cert, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                        {cert}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Risk & Opportunities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-1">Impact Opportunities</div>
                  <ul className="text-xs text-green-400 space-y-1">
                    {deal.impactOpportunities.map((opp, index) => (
                      <li key={index}>• {opp}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="text-sm text-gray-400 mb-1">ESG Risk Factors</div>
                  <ul className="text-xs text-red-400 space-y-1">
                    {deal.esgRisks.map((risk, index) => (
                      <li key={index}>• {risk}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-400">
                  <span className="mr-4">📍 {deal.location}</span>
                  <span className="mr-4">⏰ {deal.timeline}</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Impact Report
                  </Button>
                  <Button size="sm" className="bg-green-600 hover:bg-green-700">
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

// ESG Impact Report Generator (Premium Feature)
const ESGImpactReportGenerator = ({ isPremium }) => {
  const [selectedSections, setSelectedSections] = useState([])
  const [reportType, setReportType] = useState('quarterly')

  const reportSections = [
    { id: 'executive_summary', name: 'Executive Summary', free: true, description: 'High-level impact overview' },
    { id: 'portfolio_impact', name: 'Portfolio Impact Analysis', free: true, description: 'Aggregate ESG performance' },
    { id: 'sdg_alignment', name: 'SDG Alignment Report', free: false, description: 'UN Sustainable Development Goals tracking' },
    { id: 'carbon_footprint', name: 'Carbon Footprint Analysis', free: false, description: 'Detailed carbon impact assessment' },
    { id: 'social_impact', name: 'Social Impact Metrics', free: false, description: 'Lives impacted and community outcomes' },
    { id: 'governance_assessment', name: 'Governance Assessment', free: false, description: 'Corporate governance evaluation' },
    { id: 'risk_analysis', name: 'ESG Risk Analysis', free: false, description: 'Climate and social risk evaluation' },
    { id: 'benchmark_comparison', name: 'Benchmark Comparisons', free: false, description: 'Performance vs ESG indices' },
    { id: 'impact_forecast', name: 'Impact Forecasting', free: false, description: 'Predictive impact modeling' },
    { id: 'regulatory_compliance', name: 'Regulatory Compliance', free: false, description: 'SFDR, EU Taxonomy, TCFD compliance' },
    { id: 'stakeholder_engagement', name: 'Stakeholder Engagement', free: false, description: 'Community and investor relations' },
    { id: 'materiality_assessment', name: 'Materiality Assessment', free: false, description: 'ESG materiality analysis' }
  ]

  if (!isPremium) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            ESG Impact Reports
            <Badge variant="outline" className="ml-2">
              Professional Reporting
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generate Professional ESG Reports</h3>
            <p className="text-gray-400">
              Create comprehensive impact reports for investors, regulators, and stakeholders
            </p>
          </div>

          {/* Free Preview Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Free Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Executive Summary</li>
                <li>• Portfolio Impact Overview</li>
                <li>• Basic ESG Metrics</li>
              </ul>
            </div>
            <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Premium Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• SDG Alignment Analysis</li>
                <li>• Carbon Footprint Assessment</li>
                <li>• Regulatory Compliance Reports</li>
                <li>• Impact Forecasting & Modeling</li>
              </ul>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Standard Report</h4>
                  <p className="text-sm text-gray-400">Quarterly impact summary</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$99</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-900/20 to-blue-900/20 border border-green-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Premium Report</h4>
                  <p className="text-sm text-gray-400">Complete ESG analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-400">$199</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Generate Standard Report - $99
            </Button>
            <Button className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Generate Premium Report - $199
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Premium version with full functionality
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <FileText className="w-6 h-6" />
          ESG Impact Report Generator
          <Badge variant="premium" className="ml-2">
            Premium Access
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Report Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">Report Type</label>
          <select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
            className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white"
          >
            <option value="quarterly">Quarterly Impact Report</option>
            <option value="annual">Annual ESG Report</option>
            <option value="regulatory">Regulatory Compliance Report</option>
            <option value="investor">Investor Update Report</option>
          </select>
        </div>

        {/* Section Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-3">Report Sections</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {reportSections.map((section) => (
              <div
                key={section.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedSections.includes(section.id)
                    ? 'border-blue-400 bg-blue-900/20'
                    : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                }`}
                onClick={() => {
                  if (selectedSections.includes(section.id)) {
                    setSelectedSections(selectedSections.filter(id => id !== section.id))
                  } else {
                    setSelectedSections([...selectedSections, section.id])
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-white text-sm">{section.name}</div>
                    <div className="text-xs text-gray-400">{section.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!section.free && <Crown className="w-4 h-4 text-yellow-400" />}
                    <div className={`w-4 h-4 border rounded ${
                      selectedSections.includes(section.id)
                        ? 'bg-blue-500 border-blue-500'
                        : 'border-gray-400'
                    }`}>
                      {selectedSections.includes(section.id) && (
                        <CheckCircle className="w-4 h-4 text-white" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Report Preview */}
        <div className="mb-6 p-4 bg-gray-800/30 border border-gray-600 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Report Preview</h4>
          <div className="text-sm text-gray-300">
            <div className="mb-2">
              <strong>Report Type:</strong> {reportType.charAt(0).toUpperCase() + reportType.slice(1)} Report
            </div>
            <div className="mb-2">
              <strong>Sections Selected:</strong> {selectedSections.length} of {reportSections.length}
            </div>
            <div>
              <strong>Estimated Pages:</strong> {Math.max(5, selectedSections.length * 2)} pages
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <Button 
          className="w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          disabled={selectedSections.length === 0}
        >
          <Download className="w-4 h-4 mr-2" />
          Generate ESG Report ({selectedSections.length} sections)
        </Button>
      </CardContent>
    </Card>
  )
}

// Premium Paywall Teaser for ESG
const ESGPremiumPaywallTeaser = () => {
  return (
    <Card className="bg-gradient-to-br from-green-500 to-blue-500 text-white border-none">
      <CardContent className="p-8 text-center">
        <Leaf className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">
          Your portfolio avoids 125K tons CO2… but are you maximizing impact?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Unlock Premium ESG features for $199/month to access advanced impact analytics, regulatory compliance reports, and SDG tracking
        </p>
        <Button className="bg-white text-green-600 hover:bg-gray-100 text-lg px-8 py-3">
          <CreditCard className="w-5 h-5 mr-2" />
          Unlock Premium for $199/month
        </Button>
        <p className="text-sm mt-3 opacity-75">
          Paystack secure payment - instant access
        </p>
      </CardContent>
    </Card>
  )
}

// Main ESG Dashboard Component
export default function FerrariESGInvestorDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPremium, setIsPremium] = useState(false)
  
  const tabs = [
    { id: 'overview', label: 'Impact Overview', icon: BarChart3 },
    { id: 'portfolio', label: 'ESG Portfolio', icon: Briefcase },
    { id: 'dealflow', label: 'Impact Deal Flow', icon: Search },
    { id: 'sdg', label: 'SDG Tracking', icon: Target },
    { id: 'reports', label: 'Impact Reports', icon: FileText },
    { id: 'compliance', label: 'Compliance', icon: Shield, premium: true }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <ESGProfileCompletionWidget />
            <ESGPremiumPaywallTeaser />
            <ESGImpactMetrics />
            <SDGAlignmentChart />
          </div>
        )
      case 'portfolio':
        return <ESGPortfolioGrid />
      case 'dealflow':
        return <ESGDealFlowGrid />
      case 'sdg':
        return <SDGAlignmentChart />
      case 'reports':
        return <ESGImpactReportGenerator isPremium={isPremium} />
      case 'compliance':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Regulatory Compliance - Premium Feature</h3>
              <p className="text-gray-400 mb-4">
                Access SFDR, EU Taxonomy, TCFD compliance tracking and automated reporting
              </p>
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade to Premium
              </Button>
            </CardContent>
          </Card>
        )
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Critical ESG Action Banner */}
      <CriticalESGActionBanner />

      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              AUXEIRA ESG
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
                        ? 'bg-green-600 text-white'
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
              <Badge className="bg-green-500 text-white">
                Impact: {esgProfile.metrics.impactROI}x
              </Badge>
              <Badge className="bg-blue-500 text-white">
                ESG: {esgProfile.metrics.esgScore}
              </Badge>
              <Badge className="bg-purple-500 text-white">
                Carbon: -{Math.abs(esgProfile.metrics.carbonFootprint / 1000).toFixed(0)}K tons
              </Badge>
              <div className="flex items-center gap-1 text-green-400 text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                LIVE IMPACT
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
            Welcome back, {esgProfile.name}
          </h1>
          <p className="text-gray-400">
            {esgProfile.title} • 
            ${(esgProfile.investmentProfile.totalInvested / 1000000).toFixed(0)}M Invested • 
            {esgProfile.investmentProfile.activeInvestments} Impact Companies • 
            {Math.abs(esgProfile.metrics.carbonFootprint).toLocaleString()} tons CO2 avoided • 
            {esgProfile.metrics.socialImpact.toLocaleString()} lives impacted
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
