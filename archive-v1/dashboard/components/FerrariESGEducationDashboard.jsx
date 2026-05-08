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
  Plug, Power, Lightbulb as LightbulbIcon, Flashlight, Candle, Flame as FlameIcon
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
// ESG EDUCATION INVESTOR PROFILE & DATA
// ============================================================================

const esgEducationProfile = {
  id: 'esg_education_investor_123',
  name: 'Dr. Amara Okafor',
  title: 'ESG Education Fund Manager & Former UNESCO Director',
  email: 'amara.okafor@educationfund.org',
  tier: 'free', // free, standard, premium
  location: 'Lagos, Nigeria',
  
  // Education Investment Profile
  investmentProfile: {
    totalInvested: 8500000, // $8.5M
    portfolioValue: 18200000, // $18.2M
    activeInvestments: 16,
    educationFocus: ['Early Childhood', 'Teacher Training', 'Digital Literacy', 'STEM Education', 'Vocational Skills'],
    sdgFocus: [4, 5, 8, 10], // Quality Education, Gender Equality, Decent Work, Reduced Inequalities
    geographies: ['Sub-Saharan Africa', 'Southeast Asia', 'Latin America'],
    profileCompletion: 65,
    impactFramework: 'IRIS+',
    learningOutcomes: 'UNESCO Framework',
    digitalDivideCommitment: true,
    genderEquityTargets: true,
    ruralAccessPriority: true
  },
  
  // Education Impact Metrics
  metrics: {
    totalROI: 2.14, // Financial return
    educationROI: 5.8, // Learning outcome return
    impactScore: 91, // Overall education impact
    studentsReached: 285000, // Direct beneficiaries
    teachersTrained: 12500, // Educators impacted
    schoolsSupported: 450, // Institutions reached
    literacyImprovement: 42, // % improvement in literacy rates
    numeracyImprovement: 38, // % improvement in numeracy
    graduationRateIncrease: 28, // % increase in completion rates
    genderParityIndex: 0.94, // UNESCO Gender Parity Index
    digitalLiteracyScore: 78, // Digital skills assessment
    carbonFootprintReduction: 15000, // CO2 tons saved through digital learning
    costPerStudent: 65, // USD cost per student reached
    sustainabilityRating: 'A',
    equityScore: 89
  },
  
  // Subscription & Billing
  billing: {
    plan: 'free',
    monthlyPrice: 0,
    standardPrice: 299,
    premiumPrice: 699,
    status: 'active',
    nextBilling: null,
    paymentMethod: null,
    trialEndsAt: null
  }
}

// Education Portfolio Companies Data
const educationPortfolioCompanies = [
  {
    id: 'edu_company_1',
    name: 'LearnBridge Africa',
    sector: 'Digital Learning Platform',
    stage: 'Series B',
    investment: 2200000,
    currentValue: 6800000,
    roi: 3.09,
    impactScore: 94,
    studentsReached: 85000,
    teachersTrained: 2800,
    schoolsSupported: 120,
    sdgAlignment: [4, 5, 10], // Quality Education, Gender Equality, Reduced Inequalities
    status: 'Impact Leader',
    lastUpdate: '2024-03-15',
    nextMilestone: 'Series C Funding',
    riskLevel: 'low',
    learningOutcomes: {
      literacyImprovement: 48,
      numeracyImprovement: 45,
      criticalThinking: 52,
      digitalSkills: 89
    },
    impactKPIs: {
      completionRate: '92%',
      genderParity: '0.96',
      ruralReach: '65%',
      costEfficiency: '$42/student'
    },
    sustainabilityMetrics: {
      carbonSavings: 8500, // tons CO2
      paperReduction: 85, // %
      energyEfficiency: 78,
      localEmployment: 94 // % local hires
    }
  },
  {
    id: 'edu_company_2',
    name: 'STEM Sisters Initiative',
    sector: 'STEM Education & Gender Equity',
    stage: 'Series A',
    investment: 1500000,
    currentValue: 4200000,
    roi: 2.8,
    impactScore: 96,
    studentsReached: 45000,
    teachersTrained: 1200,
    schoolsSupported: 85,
    sdgAlignment: [4, 5, 8], // Quality Education, Gender Equality, Decent Work
    status: 'Impact Champion',
    lastUpdate: '2024-03-12',
    nextMilestone: 'Government Partnership',
    riskLevel: 'low',
    learningOutcomes: {
      stemProficiency: 67,
      problemSolving: 72,
      confidence: 84,
      careerReadiness: 78
    },
    impactKPIs: {
      femaleParticipation: '78%',
      stemCareerPipeline: '65%',
      mentorshipHours: '25,000',
      scholarshipsAwarded: 450
    },
    sustainabilityMetrics: {
      carbonSavings: 3200,
      renewableEnergy: 92,
      wasteReduction: 76,
      communityEngagement: 89
    }
  },
  {
    id: 'edu_company_3',
    name: 'Rural Teacher Connect',
    sector: 'Teacher Training & Support',
    stage: 'Seed',
    investment: 800000,
    currentValue: 2100000,
    roi: 2.63,
    impactScore: 88,
    studentsReached: 65000,
    teachersTrained: 3500,
    schoolsSupported: 180,
    sdgAlignment: [4, 8, 10], // Quality Education, Decent Work, Reduced Inequalities
    status: 'Strong Performer',
    lastUpdate: '2024-03-10',
    nextMilestone: 'Series A',
    riskLevel: 'medium',
    learningOutcomes: {
      teacherRetention: 89,
      studentEngagement: 76,
      learningGains: 34,
      professionalDevelopment: 92
    },
    impactKPIs: {
      ruralCoverage: '85%',
      trainingHours: '180,000',
      certificationRate: '94%',
      salaryIncrease: '35%'
    },
    sustainabilityMetrics: {
      carbonSavings: 2100,
      digitalDelivery: 88,
      localCapacity: 96,
      knowledgeSharing: 87
    }
  },
  {
    id: 'edu_company_4',
    name: 'VocationalPath',
    sector: 'Vocational Skills & Employment',
    stage: 'Series A',
    investment: 1800000,
    currentValue: 3200000,
    roi: 1.78,
    impactScore: 85,
    studentsReached: 28000,
    teachersTrained: 850,
    schoolsSupported: 65,
    sdgAlignment: [4, 8, 9], // Quality Education, Decent Work, Innovation
    status: 'Monitor',
    lastUpdate: '2024-03-08',
    nextMilestone: 'Industry Partnerships',
    riskLevel: 'medium',
    learningOutcomes: {
      skillsCertification: 82,
      employmentRate: 74,
      wageIncrease: 45,
      entrepreneurship: 28
    },
    impactKPIs: {
      jobPlacement: '74%',
      skillsMatching: '89%',
      industryPartnerships: 125,
      incomeIncrease: '45%'
    },
    sustainabilityMetrics: {
      carbonSavings: 1200,
      localSourcing: 78,
      circularEconomy: 65,
      socialCohesion: 83
    }
  }
]

// Education Deal Flow Data
const educationDealFlowData = [
  {
    id: 'edu_deal_1',
    companyName: 'AI Tutor Global',
    sector: 'AI-Powered Personalized Learning',
    stage: 'Series A',
    askAmount: 5000000,
    checkSize: 1200000,
    impactMatchScore: 94,
    educationScore: 96,
    location: 'Bangalore, India',
    description: 'AI-powered personalized tutoring platform for K-12 students in emerging markets',
    founders: ['Dr. Priya Sharma (AI Researcher)', 'Raj Patel (EdTech Veteran)'],
    impactMetrics: {
      studentsServed: '150,000+',
      learningGains: '65% improvement',
      teacherSupport: '5,000 educators',
      costReduction: '80% vs traditional tutoring'
    },
    sdgAlignment: [4, 10, 9],
    educationRisks: ['Technology adoption barriers', 'Internet connectivity requirements'],
    impactOpportunities: ['Personalized learning at scale', 'Teacher augmentation', 'Rural access'],
    timeline: '4 weeks left',
    leadInvestor: 'Reach Capital',
    warmIntro: true,
    certifications: ['UNESCO Partnership', 'UNICEF Innovation Fund', 'B-Corp Pending']
  },
  {
    id: 'edu_deal_2',
    companyName: 'Climate Education Labs',
    sector: 'Climate & Environmental Education',
    stage: 'Seed',
    askAmount: 2500000,
    checkSize: 600000,
    impactMatchScore: 91,
    educationScore: 89,
    location: 'São Paulo, Brazil',
    description: 'Immersive climate education curriculum and teacher training for Latin America',
    founders: ['Dr. Carlos Mendez (Climate Scientist)', 'Ana Rodriguez (Curriculum Designer)'],
    impactMetrics: {
      studentsReached: '75,000',
      teachersTrained: '2,500',
      curriculumAdoption: '450 schools',
      behaviorChange: '78% environmental awareness'
    },
    sdgAlignment: [4, 13, 15],
    educationRisks: ['Curriculum integration challenges', 'Government approval processes'],
    impactOpportunities: ['Climate literacy', 'Behavior change', 'Policy influence'],
    timeline: '2 weeks left',
    leadInvestor: 'Climate Education Fund',
    warmIntro: false,
    certifications: ['UN Climate Education Alliance', 'Green Schools Certified']
  },
  {
    id: 'edu_deal_3',
    companyName: 'Inclusive Learning Tech',
    sector: 'Special Needs & Accessibility',
    stage: 'Pre-seed',
    askAmount: 1800000,
    checkSize: 400000,
    impactMatchScore: 88,
    educationScore: 92,
    location: 'Cape Town, South Africa',
    description: 'Assistive technology and inclusive curriculum for students with disabilities',
    founders: ['Dr. Nomsa Mbeki (Special Education)', 'James Wilson (Accessibility Tech)'],
    impactMetrics: {
      studentsSupported: '12,000',
      accessibilityTools: '25 adaptive technologies',
      teacherTraining: '800 educators',
      inclusionRate: '85% mainstream integration'
    },
    sdgAlignment: [4, 10, 3],
    educationRisks: ['High development costs', 'Limited market size'],
    impactOpportunities: ['Disability inclusion', 'Universal design', 'Equity advancement'],
    timeline: '3 weeks left',
    leadInvestor: 'Inclusive Ventures',
    warmIntro: true,
    certifications: ['Disability Rights Certified', 'Accessibility Standards Compliant']
  }
]

// Education Focus Areas
const educationFocusAreas = [
  { id: 'early_childhood', name: 'Early Childhood Development', icon: '👶', color: '#FF6B6B' },
  { id: 'literacy', name: 'Literacy & Language', icon: '📚', color: '#4ECDC4' },
  { id: 'numeracy', name: 'Numeracy & Mathematics', icon: '🔢', color: '#45B7D1' },
  { id: 'stem', name: 'STEM Education', icon: '🔬', color: '#96CEB4' },
  { id: 'digital_literacy', name: 'Digital Literacy', icon: '💻', color: '#FFEAA7' },
  { id: 'teacher_training', name: 'Teacher Training', icon: '👩‍🏫', color: '#DDA0DD' },
  { id: 'vocational', name: 'Vocational Skills', icon: '🛠️', color: '#98D8C8' },
  { id: 'special_needs', name: 'Special Needs Education', icon: '🤝', color: '#F7DC6F' },
  { id: 'climate_education', name: 'Climate Education', icon: '🌍', color: '#82E0AA' },
  { id: 'gender_equity', name: 'Gender Equity', icon: '⚖️', color: '#F8C471' }
]

// Learning Outcome Frameworks
const learningFrameworks = [
  { id: 'UNESCO', name: 'UNESCO Framework', description: 'Global Education Monitoring Report indicators' },
  { id: 'SDG4', name: 'SDG 4 Targets', description: 'UN Sustainable Development Goal 4 metrics' },
  { id: 'PISA', name: 'PISA Standards', description: 'Programme for International Student Assessment' },
  { id: 'TIMSS', name: 'TIMSS Benchmarks', description: 'Trends in International Mathematics and Science Study' },
  { id: 'EGRA_EGMA', name: 'EGRA/EGMA', description: 'Early Grade Reading and Mathematics Assessment' },
  { id: 'IRIS_PLUS', name: 'IRIS+ Education', description: 'Impact measurement for education investments' }
]

// ============================================================================
// MAIN DASHBOARD COMPONENTS
// ============================================================================

// Critical Education Action Banner
const CriticalEducationActionBanner = () => {
  const [isVisible, setIsVisible] = useState(true)
  const [criticalAlerts, setCriticalAlerts] = useState([
    {
      id: 'alert_1',
      type: 'learning_opportunity',
      company: 'AI Tutor Global',
      message: 'High-impact AI education deal: 94% match, 150K students, 65% learning gains',
      action: 'Review investment opportunity',
      impact: 'Education Critical'
    },
    {
      id: 'alert_2',
      type: 'portfolio_milestone',
      company: 'STEM Sisters Initiative',
      message: 'Milestone achieved: 78% female participation, exceeding gender parity targets',
      action: 'Celebrate and scale success',
      impact: 'Positive'
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
            <GraduationCap className="w-5 h-5 animate-pulse" />
            <div>
              <strong>EDUCATION INTELLIGENCE:</strong>
              <span className="ml-2">
                Impact Score: {esgEducationProfile.metrics.educationROI} • 
                Students Reached: {esgEducationProfile.metrics.studentsReached.toLocaleString()} • 
                {criticalAlerts.length} learning alerts
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="success" className="animate-pulse">
              Live Learning Analytics
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

// Education Profile Completion Widget
const EducationProfileCompletionWidget = () => {
  const [completionPercentage, setCompletionPercentage] = useState(esgEducationProfile.investmentProfile.profileCompletion)
  
  const profileTasks = [
    { id: 1, task: 'Education Focus Areas', completed: true },
    { id: 2, task: 'Learning Outcome Framework', completed: true },
    { id: 3, task: 'Geographic Priorities', completed: true },
    { id: 4, task: 'Gender Equity Targets', completed: false },
    { id: 5, task: 'Digital Divide Commitment', completed: true },
    { id: 6, task: 'Rural Access Priority', completed: false },
    { id: 7, task: 'Teacher Training Preferences', completed: false },
    { id: 8, task: 'Impact Measurement Tools', completed: false }
  ]

  const completedTasks = profileTasks.filter(task => task.completed).length
  const totalTasks = profileTasks.length

  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg">Complete Your Education Impact Profile</h3>
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
          Complete your education profile to unlock personalized learning deal flow and comprehensive education impact reporting. 
          We use this data to match you with investments aligned to your education thesis.
        </p>

        <div className="space-y-2 mb-4">
          {profileTasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 cursor-pointer hover:bg-white/10 p-2 rounded-lg transition-colors">
              <div className={`w-5 h-5 rounded-full border-2 border-white flex items-center justify-center ${
                task.completed ? 'bg-white text-blue-500' : ''
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
          Complete Education Profile Now
        </Button>
      </CardContent>
    </Card>
  )
}

// Education Impact Metrics Dashboard
const EducationImpactMetrics = () => {
  const metrics = esgEducationProfile.metrics
  
  const educationMetricsData = [
    {
      label: 'Education ROI',
      value: `${metrics.educationROI}x`,
      change: '+1.2x vs last quarter',
      trend: 'up',
      color: 'blue',
      icon: GraduationCap,
      description: 'Learning Outcome Return'
    },
    {
      label: 'Students Reached',
      value: `${(metrics.studentsReached / 1000).toFixed(0)}K`,
      change: '+45K this quarter',
      trend: 'up',
      color: 'green',
      icon: Users,
      description: 'Direct Beneficiaries'
    },
    {
      label: 'Teachers Trained',
      value: `${(metrics.teachersTrained / 1000).toFixed(1)}K`,
      change: '+2.8K this quarter',
      trend: 'up',
      color: 'purple',
      icon: UserCheck,
      description: 'Educators Impacted'
    },
    {
      label: 'Literacy Improvement',
      value: `${metrics.literacyImprovement}%`,
      change: '+8% improvement',
      trend: 'up',
      color: 'indigo',
      icon: BookOpen,
      description: 'Reading Skills Gain'
    },
    {
      label: 'Gender Parity',
      value: metrics.genderParityIndex.toFixed(2),
      change: 'UNESCO Standard',
      trend: 'up',
      color: 'pink',
      icon: Scale,
      description: 'Gender Equality Index'
    },
    {
      label: 'Cost Efficiency',
      value: `$${metrics.costPerStudent}`,
      change: 'Per Student Reached',
      trend: 'up',
      color: 'orange',
      icon: DollarSign,
      description: 'Impact Cost Effectiveness'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {educationMetricsData.map((metric, index) => {
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

// Education Focus Areas Visualization
const EducationFocusChart = () => {
  const focusAreas = esgEducationProfile.investmentProfile.educationFocus
  
  return (
    <Card className="bg-gray-900/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Target className="w-6 h-6" />
          Education Focus Areas
          <Badge variant="outline" className="ml-2">
            {focusAreas.length} Areas
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {educationFocusAreas.map((area) => {
            const isActive = focusAreas.some(focus => 
              focus.toLowerCase().includes(area.name.toLowerCase().split(' ')[0])
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
                <div className="text-xs font-semibold">{area.name}</div>
                {isActive && (
                  <Badge variant="success" className="mt-2 text-xs">
                    Active
                  </Badge>
                )}
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <h4 className="font-semibold text-white mb-2">Portfolio Focus Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="text-blue-400 font-semibold">Digital Literacy</div>
              <div className="text-gray-300">85K students with improved digital skills</div>
            </div>
            <div>
              <div className="text-green-400 font-semibold">Teacher Training</div>
              <div className="text-gray-300">12.5K educators trained and certified</div>
            </div>
            <div>
              <div className="text-purple-400 font-semibold">STEM Education</div>
              <div className="text-gray-300">45K students in STEM programs</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Education Portfolio Companies Grid
const EducationPortfolioGrid = () => {
  const [selectedCompany, setSelectedCompany] = useState(null)
  const [sortBy, setSortBy] = useState('impactScore')

  const sortedCompanies = [...educationPortfolioCompanies].sort((a, b) => {
    switch (sortBy) {
      case 'impactScore': return b.impactScore - a.impactScore
      case 'studentsReached': return b.studentsReached - a.studentsReached
      case 'teachersTrained': return b.teachersTrained - a.teachersTrained
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
            Education Portfolio Companies
            <Badge variant="outline" className="ml-2">
              {sortedCompanies.length} companies
            </Badge>
          </CardTitle>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="impactScore">Sort by Impact Score</option>
            <option value="studentsReached">Sort by Students Reached</option>
            <option value="teachersTrained">Sort by Teachers Trained</option>
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
                    {company.impactScore}
                  </div>
                  <div className="text-xs text-gray-400">Impact</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-purple-400">
                    {(company.studentsReached / 1000).toFixed(0)}K
                  </div>
                  <div className="text-xs text-gray-400">Students</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold text-yellow-400">
                    {(company.teachersTrained / 1000).toFixed(1)}K
                  </div>
                  <div className="text-xs text-gray-400">Teachers</div>
                </div>
              </div>

              {/* Learning Outcomes */}
              <div className="mb-4">
                <div className="text-sm text-gray-400 mb-2">Learning Outcomes</div>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(company.learningOutcomes).slice(0, 4).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-gray-300 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="text-green-400 font-semibold">
                        {typeof value === 'number' ? `${value}%` : value}
                      </span>
                    </div>
                  ))}
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

              {/* Sustainability Metrics */}
              <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-600">
                <div>
                  <div className="text-xs text-gray-400">Carbon Savings</div>
                  <div className="text-sm font-semibold text-green-400">{company.sustainabilityMetrics.carbonSavings} tons</div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">Local Employment</div>
                  <div className="text-sm font-semibold text-blue-400">{company.sustainabilityMetrics.localEmployment}%</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// Education Deal Flow Component
const EducationDealFlowGrid = () => {
  const [selectedDeal, setSelectedDeal] = useState(null)
  const [filterBy, setFilterBy] = useState('all')

  const filteredDeals = educationDealFlowData.filter(deal => {
    if (filterBy === 'all') return true
    if (filterBy === 'high_impact') return deal.educationScore >= 90
    if (filterBy === 'ai_tech') return deal.sector.toLowerCase().includes('ai') || deal.sector.toLowerCase().includes('technology')
    if (filterBy === 'teacher_training') return deal.sector.toLowerCase().includes('teacher') || deal.sector.toLowerCase().includes('training')
    return true
  })

  const getEducationScoreColor = (score) => {
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
            Education Deal Flow
            <Badge variant="premium" className="ml-2">
              Learning-Matched
            </Badge>
          </CardTitle>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-1 text-white text-sm"
          >
            <option value="all">All Deals</option>
            <option value="high_impact">High Impact (90%+)</option>
            <option value="ai_tech">AI & Technology</option>
            <option value="teacher_training">Teacher Training</option>
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
                  <Badge className={`${getEducationScoreColor(deal.educationScore)} font-bold text-lg px-3 py-1`}>
                    {deal.educationScore}% Education
                  </Badge>
                  <div className="mt-2">
                    <Badge variant="outline" className="text-xs">
                      Impact Match: {deal.impactMatchScore}%
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

              {/* Founders */}
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
                  <div className="text-sm text-gray-400 mb-1">Education Risk Factors</div>
                  <ul className="text-xs text-red-400 space-y-1">
                    {deal.educationRisks.map((risk, index) => (
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
                    Education Report
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

// Education Impact Report Generator (Premium Feature)
const EducationImpactReportGenerator = ({ isPremium }) => {
  const [selectedSections, setSelectedSections] = useState([])
  const [reportType, setReportType] = useState('quarterly')

  const reportSections = [
    { id: 'executive_summary', name: 'Executive Summary', free: true, description: 'High-level education impact overview' },
    { id: 'learning_outcomes', name: 'Learning Outcomes Analysis', free: true, description: 'Student achievement and progress metrics' },
    { id: 'teacher_impact', name: 'Teacher Training Impact', free: false, description: 'Educator development and retention' },
    { id: 'gender_equity', name: 'Gender Equity Report', free: false, description: 'Gender parity and inclusion metrics' },
    { id: 'digital_divide', name: 'Digital Divide Analysis', free: false, description: 'Technology access and digital literacy' },
    { id: 'cost_effectiveness', name: 'Cost Effectiveness Study', free: false, description: 'Cost per student and efficiency metrics' },
    { id: 'sustainability', name: 'Sustainability Assessment', free: false, description: 'Environmental and social sustainability' },
    { id: 'policy_influence', name: 'Policy Influence Report', free: false, description: 'Government engagement and policy impact' },
    { id: 'community_engagement', name: 'Community Engagement', free: false, description: 'Parent and community involvement' },
    { id: 'scalability_analysis', name: 'Scalability Analysis', free: false, description: 'Growth potential and replication strategies' },
    { id: 'benchmark_comparison', name: 'Benchmark Comparisons', free: false, description: 'Performance vs education standards' },
    { id: 'impact_forecast', name: 'Impact Forecasting', free: false, description: 'Predictive education outcome modeling' }
  ]

  if (!isPremium) {
    return (
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            Education Impact Reports
            <Badge variant="outline" className="ml-2">
              Professional Reporting
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Generate Professional Education Reports</h3>
            <p className="text-gray-400">
              Create comprehensive learning impact reports for stakeholders, donors, and education authorities
            </p>
          </div>

          {/* Free Preview Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Free Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Executive Summary</li>
                <li>• Learning Outcomes Overview</li>
                <li>• Basic Impact Metrics</li>
              </ul>
            </div>
            <div className="p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Premium Sections</h4>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Teacher Training Impact</li>
                <li>• Gender Equity Analysis</li>
                <li>• Digital Divide Assessment</li>
                <li>• Policy Influence Reports</li>
              </ul>
            </div>
          </div>

          {/* Pricing Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Standard Report</h4>
                  <p className="text-sm text-gray-400">Quarterly learning impact</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-blue-400">$149</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 border border-purple-400/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h4 className="font-semibold text-white">Premium Report</h4>
                  <p className="text-sm text-gray-400">Complete education analysis</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-purple-400">$299</div>
                  <div className="text-xs text-gray-400">One-time</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Download className="w-4 h-4 mr-2" />
              Generate Standard Report - $149
            </Button>
            <Button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              <Crown className="w-4 h-4 mr-2" />
              Generate Premium Report - $299
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Premium version with full functionality would go here
  return null
}

// Premium Paywall Teaser for Education
const EducationPremiumPaywallTeaser = () => {
  return (
    <Card className="bg-gradient-to-br from-blue-500 to-purple-500 text-white border-none">
      <CardContent className="p-8 text-center">
        <GraduationCap className="w-16 h-16 mx-auto mb-4" />
        <h3 className="text-2xl font-bold mb-4">
          Your portfolio reached 285K students… but are you maximizing learning outcomes?
        </h3>
        <p className="text-lg mb-6 opacity-90">
          Unlock Premium Education features for $299/month to access advanced learning analytics, teacher impact tracking, and UNESCO-compliant reporting
        </p>
        <Button className="bg-white text-blue-600 hover:bg-gray-100 text-lg px-8 py-3">
          <CreditCard className="w-5 h-5 mr-2" />
          Unlock Premium for $299/month
        </Button>
        <p className="text-sm mt-3 opacity-75">
          Paystack secure payment - instant access to education intelligence
        </p>
      </CardContent>
    </Card>
  )
}

// Main Education Dashboard Component
export default function FerrariESGEducationDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [isPremium, setIsPremium] = useState(false)
  
  const tabs = [
    { id: 'overview', label: 'Learning Overview', icon: BarChart3 },
    { id: 'portfolio', label: 'Education Portfolio', icon: Briefcase },
    { id: 'dealflow', label: 'Learning Deal Flow', icon: Search },
    { id: 'focus', label: 'Focus Areas', icon: Target },
    { id: 'reports', label: 'Education Reports', icon: FileText },
    { id: 'analytics', label: 'Learning Analytics', icon: Brain, premium: true }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <EducationProfileCompletionWidget />
            <EducationPremiumPaywallTeaser />
            <EducationImpactMetrics />
            <EducationFocusChart />
          </div>
        )
      case 'portfolio':
        return <EducationPortfolioGrid />
      case 'dealflow':
        return <EducationDealFlowGrid />
      case 'focus':
        return <EducationFocusChart />
      case 'reports':
        return <EducationImpactReportGenerator isPremium={isPremium} />
      case 'analytics':
        return (
          <Card className="bg-gray-900/50 border-gray-700">
            <CardContent className="p-8 text-center">
              <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Learning Analytics - Premium Feature</h3>
              <p className="text-gray-400 mb-4">
                Access advanced learning outcome analytics, predictive modeling, and AI-powered education insights
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
      {/* Critical Education Action Banner */}
      <CriticalEducationActionBanner />

      {/* Top Navigation */}
      <div className="bg-gray-900 border-b border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              AUXEIRA EDUCATION
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
                Education ROI: {esgEducationProfile.metrics.educationROI}x
              </Badge>
              <Badge className="bg-green-500 text-white">
                Students: {(esgEducationProfile.metrics.studentsReached / 1000).toFixed(0)}K
              </Badge>
              <Badge className="bg-purple-500 text-white">
                Teachers: {(esgEducationProfile.metrics.teachersTrained / 1000).toFixed(1)}K
              </Badge>
              <div className="flex items-center gap-1 text-blue-400 text-sm">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                LIVE LEARNING
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
            Welcome back, {esgEducationProfile.name}
          </h1>
          <p className="text-gray-400">
            {esgEducationProfile.title} • 
            ${(esgEducationProfile.investmentProfile.totalInvested / 1000000).toFixed(1)}M Invested • 
            {esgEducationProfile.investmentProfile.activeInvestments} Education Companies • 
            {esgEducationProfile.metrics.studentsReached.toLocaleString()} students reached • 
            {esgEducationProfile.metrics.teachersTrained.toLocaleString()} teachers trained • 
            {esgEducationProfile.metrics.literacyImprovement}% literacy improvement
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
