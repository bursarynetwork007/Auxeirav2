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
  Stethoscope, Wheat, Zap as Energy, Hammer, Wifi, Mountain, Fish, Bird, Flower2,
  BookOpen, PenTool, Microscope, Calculator as CalcIcon, Globe2, Languages,
  School, Library, Laptop, Tablet, Smartphone, Headphones as HeadphonesIcon,
  Gamepad2, Puzzle, Palette, Music, Drama, Film, Camera as CameraIcon, Mic2,
  Radio, Tv, Monitor, Projector, Printer, Scanner, Keyboard, Mouse, Webcam,
  Cpu as CpuIcon, HardDrive, Wifi as WifiIcon, Router, Bluetooth, Usb, Battery,
  Plug, Power, Lightbulb as LightbulbIcon, Flashlight, Candle, Flame as FlameIcon,
  Flag, MapIcon, Navigation, Compass, Map, Route, Signpost, Milestone, Waypoints
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
// GOVERNMENT AGENCY INVESTOR PROFILE & DATA
// ============================================================================

const governmentAgencyProfile = {
  id: 'gov_agency_123',
  name: 'Dr. Adaora Okafor',
  title: 'Director of Innovation & Economic Development, Federal Ministry of Industry',
  email: 'adaora.okafor@fmiti.gov.ng',
  tier: 'free', // free, standard, premium
  location: 'Abuja, Nigeria',
  agency: 'Federal Ministry of Industry, Trade & Investment',
  
  // Government Investment Profile
  investmentProfile: {
    totalBudgetAllocated: 2500000000, // $2.5B
    portfolioValue: 4800000000, // $4.8B economic impact
    activePrograms: 28,
    startupsSupportedTotal: 1247,
    jobsCreatedTotal: 45680,
    economicMultiplier: 2.4,
    taxRevenueGenerated: 890000000, // $890M
    profileCompletion: 78,
    policyPriorities: ['Job Creation', 'Export Growth', 'Technology Transfer', 'SME Development'],
    sdgFocus: [8, 9, 1, 5], // Decent Work, Innovation, No Poverty, Gender Equality
    geographies: ['Nigeria', 'West Africa', 'Sub-Saharan Africa'],
    complianceFrameworks: ['OECD', 'AU Agenda 2063', 'ECOWAS', 'WTO'],
    innovationHubs: 12,
    publicPrivatePartnerships: 156
  },
  
  // Government Impact Metrics
  metrics: {
    economicROI: 2.4, // Economic multiplier
    jobCreationRate: 36.7, // Jobs per $1M invested
    taxROI: 0.36, // Tax revenue per dollar invested
    complianceScore: 94, // Regulatory compliance
    innovationIndex: 87, // Innovation ecosystem health
    exportGrowth: 28, // % increase in exports
    smeGrowthRate: 42, // SME development rate
    genderParityIndex: 0.78, // Women in supported businesses
    youthEmploymentRate: 65, // Youth employment in programs
    ruralDevelopmentScore: 72, // Rural area impact
    technologyTransferRate: 89, // Tech adoption rate
    sustainabilityRating: 'A-',
    policyEffectivenessScore: 91,
    stakeholderSatisfaction: 88
  },
  
  // Subscription & Billing
  billing: {
    plan: 'free',
    monthlyPrice: 0,
    standardPrice: 2499, // Government pricing
    premiumPrice: 4999,
    status: 'active',
    nextBilling: null,
    paymentMethod: null,
    trialEndsAt: null
  }
}

// Government Portfolio Programs Data
const governmentPortfolioPrograms = [
  {
    id: 'gov_program_1',
    name: 'Nigeria Startup Support Initiative (NSSI)',
    sector: 'Multi-Sector Innovation',
    stage: 'Active',
    budgetAllocated: 500000000, // $500M
    economicImpact: 1200000000, // $1.2B
    roi: 2.4,
    complianceScore: 96,
    startupsSupported: 285,
    jobsCreated: 12500,
    taxRevenueGenerated: 180000000, // $180M
    sdgAlignment: [8, 9, 1], // Decent Work, Innovation, No Poverty
    status: 'Exceeding Targets',
    lastUpdate: '2024-03-15',
    nextMilestone: 'Phase 2 Expansion',
    riskLevel: 'low',
    keyMetrics: {
      startupSurvivalRate: '89%',
      averageJobsPerStartup: '44',
      exportRevenue: '$85M',
      womenLedBusinesses: '42%'
    },
    policyImpacts: {
      regulatoryReforms: 12,
      taxIncentivesCreated: 8,
      tradeAgreements: 3,
      infrastructureProjects: 15
    },
    sustainabilityMetrics: {
      carbonReduction: 25000, // tons CO2
      renewableEnergyAdoption: 78, // %
      circularEconomyProjects: 45,
      greenJobsCreated: 3200
    }
  },
  {
    id: 'gov_program_2',
    name: 'AgriTech Innovation Hub',
    sector: 'Agriculture Technology',
    stage: 'Scaling',
    budgetAllocated: 200000000, // $200M
    economicImpact: 680000000, // $680M
    roi: 3.4,
    complianceScore: 92,
    startupsSupported: 125,
    jobsCreated: 8500,
    taxRevenueGenerated: 95000000, // $95M
    sdgAlignment: [2, 8, 15], // Zero Hunger, Decent Work, Life on Land
    status: 'Strong Performance',
    lastUpdate: '2024-03-12',
    nextMilestone: 'Regional Expansion',
    riskLevel: 'low',
    keyMetrics: {
      farmersReached: '45,000',
      yieldIncrease: '35%',
      foodSecurityImprovement: '28%',
      ruralIncomeGrowth: '52%'
    },
    policyImpacts: {
      agriculturalPolicies: 8,
      landReforms: 5,
      subsidyPrograms: 12,
      marketAccessInitiatives: 18
    },
    sustainabilityMetrics: {
      soilHealthImprovement: 65, // %
      waterConservation: 42, // %
      biodiversityProjects: 28,
      organicFarmingAdoption: 38 // %
    }
  },
  {
    id: 'gov_program_3',
    name: 'FinTech Regulatory Sandbox',
    sector: 'Financial Technology',
    stage: 'Mature',
    budgetAllocated: 150000000, // $150M
    economicImpact: 450000000, // $450M
    roi: 3.0,
    complianceScore: 98,
    startupsSupported: 85,
    jobsCreated: 6200,
    taxRevenueGenerated: 125000000, // $125M
    sdgAlignment: [8, 10, 1], // Decent Work, Reduced Inequalities, No Poverty
    status: 'Policy Leader',
    lastUpdate: '2024-03-10',
    nextMilestone: 'International Framework',
    riskLevel: 'low',
    keyMetrics: {
      financialInclusion: '78%',
      digitalPaymentGrowth: '156%',
      creditAccessImprovement: '89%',
      regulatoryClarity: '94%'
    },
    policyImpacts: {
      financialRegulations: 15,
      digitalPaymentLaws: 6,
      cybersecurityFrameworks: 8,
      consumerProtections: 12
    },
    sustainabilityMetrics: {
      paperlessTransactions: 92, // %
      energyEfficientSystems: 85,
      greenFinanceProducts: 24,
      carbonNeutralOperations: 67 // %
    }
  },
  {
    id: 'gov_program_4',
    name: 'Women Entrepreneurs Accelerator',
    sector: 'Gender Inclusive Innovation',
    stage: 'Expanding',
    budgetAllocated: 100000000, // $100M
    economicImpact: 280000000, // $280M
    roi: 2.8,
    complianceScore: 89,
    startupsSupported: 180,
    jobsCreated: 5500,
    taxRevenueGenerated: 45000000, // $45M
    sdgAlignment: [5, 8, 10], // Gender Equality, Decent Work, Reduced Inequalities
    status: 'Impact Champion',
    lastUpdate: '2024-03-08',
    nextMilestone: 'Pan-African Expansion',
    riskLevel: 'medium',
    keyMetrics: {
      womenEntrepreneurs: '100%',
      businessSurvivalRate: '85%',
      revenueGrowth: '67%',
      leadershipPositions: '78%'
    },
    policyImpacts: {
      genderEqualityLaws: 6,
      businessSupportPrograms: 18,
      accessToFinanceInitiatives: 12,
      mentorshipFrameworks: 8
    },
    sustainabilityMetrics: {
      socialImpactProjects: 156,
      communityDevelopment: 89, // %
      educationPrograms: 45,
      healthcareAccess: 67 // %
    }
  }
]

// Government Deal Flow Data (Policy Opportunities)
const governmentDealFlowData = [
  {
    id: 'gov_deal_1',
    programName: 'Digital Nigeria 2030',
    sector: 'Digital Infrastructure & Innovation',
    stage: 'Policy Development',
    budgetRequest: 1000000000, // $1B
    governmentCommitment: 300000000, // $300M
    economicImpactProjection: 2500000000, // $2.5B
    jobCreationTarget: 25000,
    policyMatchScore: 96,
    location: 'Nationwide, Nigeria',
    description: 'Comprehensive digital transformation initiative to build innovation hubs, improve connectivity, and develop tech talent',
    keyStakeholders: ['Ministry of Communications', 'NITDA', 'Private Sector Coalition'],
    impactMetrics: {
      digitalLiteracyTarget: '15M citizens',
      startupHubsPlanned: '50 hubs',
      fiberOpticExpansion: '100,000 km',
      techJobsCreated: '25,000'
    },
    sdgAlignment: [8, 9, 4], // Decent Work, Innovation, Quality Education
    policyRisks: ['Regulatory complexity', 'Infrastructure gaps', 'Skills shortage'],
    impactOpportunities: ['Digital inclusion', 'Innovation ecosystem', 'Export competitiveness'],
    timeline: '18 months implementation',
    leadAgency: 'Federal Ministry of Communications',
    stakeholderBuyIn: 'High',
    internationalSupport: ['World Bank', 'AfDB', 'EU Digital4Development']
  },
  {
    id: 'gov_deal_2',
    programName: 'Green Economy Transition Fund',
    sector: 'Climate & Sustainability',
    stage: 'Stakeholder Consultation',
    budgetRequest: 750000000, // $750M
    governmentCommitment: 200000000, // $200M
    economicImpactProjection: 1800000000, // $1.8B
    jobCreationTarget: 18000,
    policyMatchScore: 92,
    location: 'Multi-State, Nigeria',
    description: 'Comprehensive green economy initiative supporting renewable energy, sustainable agriculture, and circular economy startups',
    keyStakeholders: ['Ministry of Environment', 'Ministry of Power', 'Climate Investment Funds'],
    impactMetrics: {
      renewableEnergyCapacity: '2,000 MW',
      greenJobsCreated: '18,000',
      carbonReduction: '500,000 tons CO2',
      sustainableBusinesses: '300'
    },
    sdgAlignment: [7, 13, 15], // Affordable Energy, Climate Action, Life on Land
    policyRisks: ['Climate policy uncertainty', 'Technology costs', 'Market readiness'],
    impactOpportunities: ['Energy independence', 'Climate resilience', 'Green export markets'],
    timeline: '24 months rollout',
    leadAgency: 'Federal Ministry of Environment',
    stakeholderBuyIn: 'Medium-High',
    internationalSupport: ['Green Climate Fund', 'UNEP', 'IFC Climate Business']
  },
  {
    id: 'gov_deal_3',
    programName: 'Healthcare Innovation Initiative',
    sector: 'Health Technology & Access',
    stage: 'Pilot Phase',
    budgetRequest: 400000000, // $400M
    governmentCommitment: 150000000, // $150M
    economicImpactProjection: 950000000, // $950M
    jobCreationTarget: 12000,
    policyMatchScore: 89,
    location: 'Lagos, Kano, Port Harcourt',
    description: 'Healthcare technology acceleration program focusing on telemedicine, medical devices, and health data systems',
    keyStakeholders: ['Ministry of Health', 'NAFDAC', 'Healthcare Private Sector'],
    impactMetrics: {
      patientsServed: '2M citizens',
      healthTechStartups: '150',
      medicalDevicesLocalized: '50',
      healthcareJobs: '12,000'
    },
    sdgAlignment: [3, 8, 10], // Good Health, Decent Work, Reduced Inequalities
    policyRisks: ['Regulatory approval delays', 'Healthcare system integration', 'Data privacy concerns'],
    impactOpportunities: ['Universal health coverage', 'Medical innovation', 'Health equity'],
    timeline: '12 months pilot',
    leadAgency: 'Federal Ministry of Health',
    stakeholderBuyIn: 'High',
    internationalSupport: ['WHO', 'Gates Foundation', 'USAID Global Health']
  }
]

// Policy Priority Areas
const policyPriorityAreas = [
  { id: 'job_creation', name: 'Job Creation & Employment', icon: '👥', color: '#10B981', priority: 'High' },
  { id: 'export_growth', name: 'Export Growth & Trade', icon: '🌍', color: '#3B82F6', priority: 'High' },
  { id: 'technology_transfer', name: 'Technology Transfer', icon: '🔬', color: '#8B5CF6', priority: 'Medium' },
  { id: 'sme_development', name: 'SME Development', icon: '🏢', color: '#F59E0B', priority: 'High' },
  { id: 'innovation_hubs', name: 'Innovation Hubs', icon: '💡', color: '#EF4444', priority: 'Medium' },
  { id: 'regulatory_reform', name: 'Regulatory Reform', icon: '⚖️', color: '#06B6D4', priority: 'High' },
  { id: 'digital_transformation', name: 'Digital Transformation', icon: '💻', color: '#84CC16', priority: 'High' },
  { id: 'sustainability', name: 'Sustainability & Climate', icon: '🌱', color: '#22C55E', priority: 'Medium' }
]

// Compliance Frameworks
const complianceFrameworks = [
  { id: 'OECD', name: 'OECD Guidelines', description: 'International economic cooperation standards' },
  { id: 'AU_2063', name: 'AU Agenda 2063', description: 'African Union development framework' },
  { id: 'ECOWAS', name: 'ECOWAS Protocols', description: 'West African economic integration' },
  { id: 'WTO', name: 'WTO Agreements', description: 'World Trade Organization compliance' },
  { id: 'SDG', name: 'UN SDG Framework', description: 'Sustainable Development Goals alignment' },
  { id: 'AFCFTA', name: 'AfCFTA Standards', description: 'African Continental Free Trade Area' }
]

// ============================================================================
// MAIN DASHBOARD COMPONENTS
// ============================================================================

// Critical Government Action Banner
const CriticalGovernmentActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 'alert_1',
      type: 'policy_opportunity',
      program: 'Digital Nigeria 2030',
      message: 'High-impact policy opportunity: $1B budget, 25K jobs, 96% alignment score',
      action: 'Review policy proposal',
      impact: 'Economic Critical'
    },
    {
      id: 'alert_2',
      type: 'compliance_update',
      program: 'FinTech Regulatory Sandbox',
      message: 'Compliance milestone: 98% regulatory score, international framework ready',
      action: 'Export framework globally',
      impact: 'Policy Leadership'
    }
  ])

  if (!isVisible) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sticky top-0 z-50 shadow-lg"
    >
      <div className="container mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <Landmark className="w-5 h-5 animate-pulse" />
            <div>
              <strong>GOVERNMENT INTELLIGENCE:</strong>
              <span className="ml-2">
                Economic ROI: {governmentAgencyProfile.metrics.economicROI}x • 
                Jobs Created: {governmentAgencyProfile.metrics.jobCreationRate}/M$ • 
                Tax Revenue: ${(governmentAgencyProfile.metrics.taxROI * 100).toFixed(0)}¢/$1 • 
                {criticalAlerts.length} policy alerts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              Live Economic Analytics
            </Badge>
            <Button 
              size="sm" 
              className="bg-white text-blue-600 hover:bg-gray-100"
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

// Government Profile Completion Widget
const GovernmentProfileCompletionWidget = () => {
  const [completionPercentage, setCompletionPercentage] = useState(governmentAgencyProfile.investmentProfile.profileCompletion)
  
  const profileTasks = [
    { id: 1, task: 'Policy Priorities', completed: true },
    { id: 2, task: 'SDG Alignment', completed: true },
    { id: 3, task: 'Geographic Focus', completed: true },
    { id: 4, task: 'Compliance Frameworks', completed: true },
    { id: 5, task: 'Innovation Hub Strategy', completed: true },
    { id: 6, task: 'Public-Private Partnership Goals', completed: false },
    { id: 7, task: 'Tax Revenue Targets', completed: false },
    { id: 8, task: 'Export Growth Objectives', completed: false },
    { id: 9, task: 'Job Creation Metrics', completed: true },
    { id: 10, task: 'Regulatory Reform Priorities', completed: false }
  ]

  const completedTasks = profileTasks.filter(task => task.completed).length
  const totalTasks = profileTasks.length

  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Complete Your Government Policy Profile</h3>
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
          Complete your government profile to unlock personalized policy recommendations, economic impact forecasting, and comprehensive compliance reporting. 
          We use this data to match you with programs aligned to your policy objectives.
        </p>

        <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
          {profileTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                task.completed ? 'bg-white text-blue-600' : ''
              }`}>
                {task.completed && <CheckCircle className="w-3 h-3" />}
              </div>
              <span className={`text-sm ${task.completed ? 'opacity-70 line-through' : ''}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>

        <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
          <Plus className="w-4 h-4 mr-2" />
          Complete Policy Profile Now
        </Button>
      </CardContent>
    </Card>
  )
}

// Government Impact Metrics Dashboard
const GovernmentImpactMetrics = () => {
  const metrics = governmentAgencyProfile.metrics
  
  const governmentMetricsData = [
    {
      label: 'Economic ROI',
      value: `${metrics.economicROI}x`,
      change: '+0.3x vs last year',
      trend: 'up',
      color: 'blue',
      icon: TrendingUp,
      description: 'Economic Multiplier Effect'
    },
    {
      label: 'Jobs Created',
      value: `${metrics.jobCreationRate}`,
      change: 'Per $1M Invested',
      trend: 'up',
      color: 'green',
      icon: Users,
      description: 'Employment Generation Rate'
    },
    {
      label: 'Tax Revenue ROI',
      value: `${(metrics.taxROI * 100).toFixed(0)}¢`,
      change: 'Per $1 Invested',
      trend: 'up',
      color: 'purple',
      icon: DollarSign,
      description: 'Tax Revenue Generation'
    },
    {
      label: 'Compliance Score',
      value: `${metrics.complianceScore}%`,
      change: '+6% improvement',
      trend: 'up',
      color: 'indigo',
      icon: Shield,
      description: 'Regulatory Compliance'
    },
    {
      label: 'Innovation Index',
      value: `${metrics.innovationIndex}`,
      change: 'Ecosystem Health',
      trend: 'up',
      color: 'pink',
      icon: Lightbulb,
      description: 'Innovation Ecosystem Score'
    },
    {
      label: 'Export Growth',
      value: `${metrics.exportGrowth}%`,
      change: 'YoY Increase',
      trend: 'up',
      color: 'orange',
      icon: Globe,
      description: 'International Trade Growth'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {governmentMetricsData.map((metric, index) => {
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

// Policy Priority Areas Visualization
const PolicyPriorityChart = () => {
  const priorities = governmentAgencyProfile.investmentProfile.policyPriorities
  
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-6 h-6" />
          Policy Priority Areas
          <Badge variant="outline" className="ml-2">
            {priorities.length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {policyPriorityAreas.map((area) => {
            const isActive = priorities.some(priority => 
              priority.toLowerCase().includes(area.name.toLowerCase().split(' ')[0])
            )
            return (
              <motion.div
                key={area.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: area.id.length * 0.05 }}
                className={`p-4 rounded-lg border-2 text-center cursor-pointer transition-all ${
                  isActive 
                    ? 'border-blue-400 bg-blue-900/20 text-white' 
                    : 'border-gray-600 bg-gray-800/30 text-gray-400 hover:border-gray-500'
                }`}
                style={{ borderColor: isActive ? area.color : undefined }}
              >
                <div className="text-2xl mb-2">{area.icon}</div>
                <div className="text-xs font-semibold mb-1">{area.name}</div>
                <Badge 
                  variant={area.priority === 'High' ? 'destructive' : area.priority === 'Medium' ? 'warning' : 'secondary'}
                  className="text-xs"
                >
                  {area.priority}
                </Badge>
                {isActive && (
                  <Badge variant="success" className="mt-2 text-xs block">
                    Active Policy
                  </Badge>
                )}
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Policy Impact Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-400 font-semibold">Job Creation</div>
              <div className="text-gray-300">45,680 direct jobs created across programs</div>
            </div>
            <div>
              <div className="text-green-400 font-semibold">Export Growth</div>
              <div className="text-gray-300">28% increase in export revenue</div>
            </div>
            <div>
              <div className="text-purple-400 font-semibold">SME Development</div>
              <div className="text-gray-300">1,247 startups supported nationwide</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Government Portfolio Programs Grid
const GovernmentPortfolioGrid = () => {
  const [selectedProgram, setSelectedProgram] = useState(null)
  const [sortBy, setSortBy] = useState('economicImpact')

  const sortedPrograms = [...governmentPortfolioPrograms].sort((a, b) => {
    switch (sortBy) {
      case 'economicImpact': return b.economicImpact - a.economicImpact
      case 'jobsCreated': return b.jobsCreated - a.jobsCreated
      case 'roi': return b.roi - a.roi
      case 'complianceScore': return b.complianceScore - a.complianceScore
      default: return 0
    }
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Exceeding Targets': return 'text-green-400 bg-green-900/20 border-green-400/30'
      case 'Strong Performance': return 'text-blue-400 bg-blue-900/20 border-blue-400/30'
      case 'Policy Leader': return 'text-purple-400 bg-purple-900/20 border-purple-400/30'
      case 'Impact Champion': return 'text-yellow-400 bg-yellow-900/20 border-yellow-400/30'
      default: return 'text-gray-400 bg-gray-900/20 border-gray-400/30'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center gap-2">
            <Building2 className="w-6 h-6" />
            Government Portfolio Programs
            <Badge variant="outline" className="ml-2">
              {sortedPrograms.length} programs
            </Badge>
          </CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="economicImpact">Sort by Economic Impact</option>
            <option value="jobsCreated">Sort by Jobs Created</option>
            <option value="roi">Sort by ROI</option>
            <option value="complianceScore">Sort by Compliance</option>
          </select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {sortedPrograms.map((program) => (
            <motion.div
              key={program.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              className="bg-gray-800/50 border border-gray-600 rounded-lg p-6 cursor-pointer hover:border-gray-500 transition-all"
              onClick={() => setSelectedProgram(program)}
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">{program.name}</h4>
                  <p className="text-sm text-gray-400">{program.sector} • {program.stage}</p>
                </div>
                <Badge className={getStatusColor(program.status)}>
                  {program.status}
                </Badge>
              </div>

              {/* Key Metrics */}
              <div className="grid grid-cols-4 gap-3 mb-4">
                <div className="text-center">
                  <div className="text-lg font-bold text-green-400">
                    {program.roi.toFixed(1)}x
                  </div>
                  <div className="text-xs text-gray-400">ROI</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-blue-400">
                    {program.complianceScore}%
                  </div>
                  <div className="text-xs text-gray-400">Compliance</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">
                    {(program.jobsCreated / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-400">Jobs</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {program.startupsSupported}
                  </div>
                  <div className="text-xs text-gray-400">Startups</div>
                </div>
              </div>

              {/* Budget & Impact */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Budget & Economic Impact</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Budget Allocated</span>
                    <span className="text-green-400 font-semibold">
                      ${(program.budgetAllocated / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Economic Impact</span>
                    <span className="text-blue-400 font-semibold">
                      ${(program.economicImpact / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Tax Revenue</span>
                    <span className="text-purple-400 font-semibold">
                      ${(program.taxRevenueGenerated / 1000000).toFixed(0)}M
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-300">Jobs/Startup</span>
                    <span className="text-yellow-400 font-semibold">
                      {Math.round(program.jobsCreated / program.startupsSupported)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Key Metrics */}
              <div className="space-y-2">
                <div className="text-sm text-gray-400">Program Highlights</div>
                {Object.entries(program.keyMetrics).slice(0, 2).map(([key, value]) => (
                  <div key={key} className="flex justify-between text-xs">
                    <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    <span className="text-green-400 font-semibold">{value}</span>
                  </div>
                ))}
              </div>

              {/* Policy Impacts */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                <div>
                  <div className="text-xs text-gray-400">Policy Reforms</div>
                  <div className="text-sm font-semibold text-green-400">
                    {Object.values(program.policyImpacts).reduce((a, b) => a + b, 0)} initiatives
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Sustainability</div>
                  <div className="text-sm font-semibold text-blue-400">
                    {program.sustainabilityMetrics.carbonReduction?.toLocaleString() || 'N/A'} tons CO2
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Government Deal Flow Component (Policy Opportunities)
const GovernmentDealFlowGrid = () => {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filterBy, setFilterBy] = useState('all')

  const filteredDeals = governmentDealFlowData.filter(deal => {
    if (filterBy === 'all') return true
    if (filterBy === 'high_impact') return deal.policyMatchScore >= 90
    if (filterBy === 'digital') return deal.sector.toLowerCase().includes('digital') || deal.sector.toLowerCase().includes('technology')
    if (filterBy === 'sustainability') return deal.sector.toLowerCase().includes('green') || deal.sector.toLowerCase().includes('climate')
    return true
  })

  const getPolicyScoreColor = (score) => {
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
            Policy Opportunities & Deal Flow
            <Badge variant="premium" className="ml-2">
              Government-Matched
            </Badge>
          </CardTitle>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Opportunities</option>
            <option value="high_impact">High Impact (90%+)</option>
            <option value="digital">Digital & Technology</option>
            <option value="sustainability">Sustainability & Climate</option>
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
                  <h4 className="font-semibold text-white text-lg">{deal.programName}</h4>
                  <p className="text-gray-400">{deal.sector} • {deal.stage}</p>
                  <p className="text-sm text-gray-300 mt-1">{deal.description}</p>
                </div>
                <div className="text-right">
                  <Badge className={`${getPolicyScoreColor(deal.policyMatchScore)} font-bold text-lg px-3 py-1`}>
                    {deal.policyMatchScore}% Policy Match
                  </Badge>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Jobs Target: {deal.jobCreationTarget.toLocaleString()}
                    </Badge>
                  </div>
                  {deal.stakeholderBuyIn === 'High' && (
                    <Badge variant="success" className="ml-2 mt-2">
                      High Stakeholder Buy-in
                    </Badge>
                  )}
                </div>
              </div>

              {/* Budget Details */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400">Total Budget</div>
                  <div className="font-semibold text-white">${(deal.budgetRequest / 1000000).toFixed(0)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Gov Commitment</div>
                  <div className="font-semibold text-green-400">${(deal.governmentCommitment / 1000000).toFixed(0)}M</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Economic Impact</div>
                  <div className="font-semibold text-blue-400">${(deal.economicImpactProjection / 1000000).toFixed(1)}B</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Lead Agency</div>
                  <div className="font-semibold text-purple-400">{deal.leadAgency.split(' ').slice(-2).join(' ')}</div>
                </div>
              </div>

              {/* Stakeholders */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Key Stakeholders</div>
                <div className="flex flex-wrap gap-2">
                  {deal.keyStakeholders.map((stakeholder, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {stakeholder}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Impact Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="text-sm text-gray-400 mb-2">Impact Targets</div>
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
                  <div className="text-sm text-gray-400 mb-2">International Support</div>
                  <div className="space-y-1">
                    {deal.internationalSupport.map((support, index) => (
                      <Badge key={index} variant="outline" className="text-xs mr-1 mb-1">
                        {support}
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
                  <div className="text-sm text-gray-400 mb-1">Policy Risk Factors</div>
                  <ul className="text-xs text-red-400 space-y-1">
                    {deal.policyRisks.map((risk, index) => (
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
                  <span>🤝 {deal.stakeholderBuyIn} Buy-in</span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <FileText className="w-4 h-4 mr-1" />
                    Policy Brief
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Handshake className="w-4 h-4 mr-1" />
                    Engage Stakeholders
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

// Government Impact Report Generator (Premium Feature)
const GovernmentImpactReportGenerator = ({ isPremium }) => {
  const [selectedSections, setSelectedSections] = useState([])
  const [reportType, setReportType] = useState('quarterly')

  const reportSections = [
    { id: 'executive_summary', name: 'Executive Summary', free: true, description: 'High-level economic impact overview' },
    { id: 'job_creation', name: 'Job Creation Analysis', free: true, description: 'Employment generation metrics and trends' },
    { id: 'economic_multiplier', name: 'Economic Multiplier Effects', free: false, description: 'Comprehensive economic impact analysis' },
    { id: 'tax_revenue', name: 'Tax Revenue Generation', free: false, description: 'Government revenue and ROI analysis' },
    { id: 'policy_effectiveness', name: 'Policy Effectiveness Report', free: false, description: 'Regulatory impact and compliance metrics' },
    { id: 'innovation_ecosystem', name: 'Innovation Ecosystem Health', free: false, description: 'Startup ecosystem development analysis' },
    { id: 'export_competitiveness', name: 'Export Competitiveness', free: false, description: 'International trade and market analysis' },
    { id: 'sme_development', name: 'SME Development Impact', free: false, description: 'Small business growth and support metrics' },
    { id: 'regional_analysis', name: 'Regional Development Analysis', free: false, description: 'Geographic distribution and rural impact' },
    { id: 'sustainability_metrics', name: 'Sustainability & Climate Impact', free: false, description: 'Environmental and social sustainability' },
    { id: 'compliance_audit', name: 'Compliance & Regulatory Audit', free: false, description: 'International standards and framework alignment' },
    { id: 'stakeholder_engagement', name: 'Stakeholder Engagement Report', free: false, description: 'Public-private partnership effectiveness' }
  ]

  if (!isPremium) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Government Impact Reports
            <Badge variant="outline" className="ml-2">
              Policy Intelligence
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generate Professional Government Reports</h3>
            <p className="text-gray-400">
              Create comprehensive economic impact reports for cabinet, parliament, and international stakeholders
            </p>
          </div>

          {/* Free Preview Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Free Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Executive Summary</li>
                <li>• Job Creation Overview</li>
                <li>• Basic Economic Metrics</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Premium Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Economic Multiplier Analysis</li>
                <li>• Tax Revenue Generation</li>
                <li>• Policy Effectiveness Reports</li>
                <li>• International Compliance Audits</li>
              </ul>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Standard Report</h4>
                  <p className="text-sm text-gray-400">Quarterly economic impact</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$999</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Premium Report</h4>
                  <p className="text-sm text-gray-400">Complete policy analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">$1,999</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Generate Standard Report - $999
            </Button>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Generate Premium Report - $1,999
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Premium version with full functionality would go here
  return null
}

// Premium Paywall Teaser for Government
const GovernmentPremiumPaywallTeaser = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-600 to-purple-600 text-white border-none">
      <CardContent className="p-8 text-center">
        <Landmark className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">
          Your programs created 45,680 jobs… but are you maximizing economic impact?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Unlock Premium Government features for $2,499/month to access advanced economic modeling, policy effectiveness analytics, and international compliance reporting
        </p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
          <CreditCard className="w-5 h-5 mr-2" />
          Unlock Premium for $2,499/month
        </Button>
        <p className="text-sm mt-3 opacity-75">
          Paystack secure payment - instant access to government intelligence
        </p>
      </CardContent>
    </Card>
  )
}

// Main Government Dashboard Component
export default function FerrariGovernmentAgencyDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPremium, setIsPremium] = useState(false)
  
  const tabs = [
    { id: 'overview', label: 'Economic Overview', icon: BarChart3 },
    { id: 'portfolio', label: 'Government Programs', icon: Building2 },
    { id: 'dealflow', label: 'Policy Opportunities', icon: Search },
    { id: 'priorities', label: 'Policy Priorities', icon: Target },
    { id: 'reports', label: 'Government Reports', icon: FileText },
    { id: 'analytics', label: 'Economic Analytics', icon: Brain, premium: true }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <GovernmentProfileCompletionWidget />
            <GovernmentPremiumPaywallTeaser />
            <GovernmentImpactMetrics />
            <PolicyPriorityChart />
          </div>
        )
      case 'portfolio':
        return <GovernmentPortfolioGrid />
      case 'dealflow':
        return <GovernmentDealFlowGrid />
      case 'priorities':
        return <PolicyPriorityChart />
      case 'reports':
        return <GovernmentImpactReportGenerator isPremium={isPremium} />
      case 'analytics':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Economic Analytics - Premium Feature</h3>
              <p className="text-gray-400 mb-4">
                Access advanced economic modeling, policy effectiveness analytics, and AI-powered government insights
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
      {/* Critical Government Action Banner */}
      <CriticalGovernmentActionBanner />

      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AUXEIRA GOVERNMENT
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
                    {tab.premium && !isPremium && <Lock className="w-3 h-3 text-yellow-400" />}
                  </button>
                )
              })}
            </div>

            {/* Status Badges */}
            <div className="flex items-center gap-3">
              <Badge className="bg-blue-500 text-white">
                Economic ROI: {governmentAgencyProfile.metrics.economicROI}x
              </Badge>
              <Badge className="bg-green-500 text-white">
                Jobs: {(governmentAgencyProfile.investmentProfile.jobsCreatedTotal / 1000).toFixed(0)}K
              </Badge>
              <Badge className="bg-purple-500 text-white">
                Tax ROI: {(governmentAgencyProfile.metrics.taxROI * 100).toFixed(0)}¢/$1
              </Badge>
              <div className="flex items-center gap-1 text-blue-400 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                LIVE ECONOMIC
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
            Welcome back, {governmentAgencyProfile.name}
          </h1>
          <p className="text-gray-400">
            {governmentAgencyProfile.title} • 
            ${(governmentAgencyProfile.investmentProfile.totalBudgetAllocated / 1000000000).toFixed(1)}B Budget • 
            {governmentAgencyProfile.investmentProfile.activePrograms} Programs • 
            {governmentAgencyProfile.investmentProfile.jobsCreatedTotal.toLocaleString()} jobs created • 
            {governmentAgencyProfile.investmentProfile.startupsSupportedTotal.toLocaleString()} startups supported • 
            {governmentAgencyProfile.metrics.economicROI}x economic multiplier
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
