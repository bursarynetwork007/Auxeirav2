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
  ExternalLink
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, BarChart, Bar } from 'recharts'

// SSE Components Configuration
const SSE_COMPONENTS = {
  team: {
    weight: 0.25,
    maxScore: 25,
    title: 'Team Assessment',
    icon: Users,
    color: 'text-blue-400',
    description: 'Evaluate your founding team strength and advisory board'
  },
  market: {
    weight: 0.20,
    maxScore: 20,
    title: 'Market Analysis',
    icon: Target,
    color: 'text-green-400',
    description: 'Assess market size, growth, and competitive landscape'
  },
  product: {
    weight: 0.20,
    maxScore: 20,
    title: 'Product/Technology',
    icon: Rocket,
    color: 'text-purple-400',
    description: 'Evaluate product development and technical differentiation'
  },
  business: {
    weight: 0.15,
    maxScore: 15,
    title: 'Business Model',
    icon: BarChart3,
    color: 'text-orange-400',
    description: 'Analyze revenue model and scalability potential'
  },
  financial: {
    weight: 0.10,
    maxScore: 10,
    title: 'Financial Health',
    icon: DollarSign,
    color: 'text-yellow-400',
    description: 'Review funding status and financial projections'
  },
  traction: {
    weight: 0.10,
    maxScore: 10,
    title: 'Traction & Growth',
    icon: TrendingUp,
    color: 'text-pink-400',
    description: 'Track customer acquisition and revenue growth'
  }
}

// Mock Data
const founderProfile = {
  name: 'Sarah Chen',
  company: 'QuantumAI',
  stage: 'Series A',
  founded: '2023-03-15',
  team: 12,
  totalRaised: 2500000,
  runway: 18,
  currentSSE: 78,
  previousSSE: 72,
  profileCompletion: 85,
  investorVisibility: true,
  streak: 15,
  tokens: 2450,
  level: 'Growth Stage'
}

const sseHistory = [
  { date: '2024-07', score: 65 },
  { date: '2024-08', score: 68 },
  { date: '2024-09', score: 72 },
  { date: '2024-10', score: 78 }
]

const componentScores = {
  team: { current: 22, max: 25, completion: 90 },
  market: { current: 16, max: 20, completion: 85 },
  product: { current: 15, max: 20, completion: 80 },
  business: { current: 12, max: 15, completion: 75 },
  financial: { current: 8, max: 10, completion: 70 },
  traction: { current: 5, max: 10, completion: 60 }
}

const dailyActions = [
  {
    id: 1,
    title: 'Customer Interview',
    domain: 'market_access',
    baseTokens: 50,
    completed: true,
    description: 'Conduct user interview to validate product-market fit',
    impact: 'High',
    timeEstimate: '45 min'
  },
  {
    id: 2,
    title: 'Financial Model Update',
    domain: 'funding',
    baseTokens: 75,
    completed: false,
    description: 'Update financial projections with Q3 actuals',
    impact: 'Medium',
    timeEstimate: '2 hours'
  },
  {
    id: 3,
    title: 'Team Performance Review',
    domain: 'management',
    baseTokens: 100,
    completed: false,
    description: 'Quarterly performance reviews with key team members',
    impact: 'High',
    timeEstimate: '3 hours'
  },
  {
    id: 4,
    title: 'Product Roadmap Planning',
    domain: 'operations',
    baseTokens: 60,
    completed: false,
    description: 'Plan next quarter product development priorities',
    impact: 'Medium',
    timeEstimate: '1.5 hours'
  }
]

const integrations = [
  { name: 'Stripe', status: 'connected', lastSync: '2 min ago', bonus: 100, icon: DollarSign },
  { name: 'QuickBooks', status: 'connected', lastSync: '1 hour ago', bonus: 150, icon: FileText },
  { name: 'HubSpot', status: 'disconnected', lastSync: 'Never', bonus: 200, icon: Users },
  { name: 'Google Analytics', status: 'connected', lastSync: '5 min ago', bonus: 75, icon: BarChart3 }
]

const achievements = [
  { id: 1, title: 'First SSE Score', description: 'Completed your first SSE assessment', unlocked: true, tokens: 100, rarity: 'common' },
  { id: 2, title: 'Profile Master', description: 'Achieved 80%+ profile completion', unlocked: true, tokens: 200, rarity: 'uncommon' },
  { id: 3, title: 'Integration Champion', description: 'Connected 3+ data integrations', unlocked: false, tokens: 300, rarity: 'rare' },
  { id: 4, title: 'Consistency King', description: 'Maintained 30-day action streak', unlocked: false, tokens: 500, rarity: 'epic' }
]

const mentorInsights = [
  {
    type: 'opportunity',
    title: 'Market Expansion Opportunity',
    description: 'Based on your customer data, consider expanding to the European market. Similar companies saw 40% revenue growth.',
    confidence: 0.87,
    impact: 'High',
    timeframe: '3-6 months'
  },
  {
    type: 'risk',
    title: 'Burn Rate Alert',
    description: 'Your current burn rate suggests runway concerns. Consider cost optimization or accelerated fundraising.',
    confidence: 0.92,
    impact: 'Critical',
    timeframe: 'Immediate'
  },
  {
    type: 'optimization',
    title: 'Team Scaling Recommendation',
    description: 'Your product development velocity could benefit from 2 additional senior engineers based on roadmap analysis.',
    confidence: 0.78,
    impact: 'Medium',
    timeframe: '1-2 months'
  }
]

// SSE Score Builder Component
const SSEScoreBuilder = () => {
  const [selectedComponent, setSelectedComponent] = useState('team')
  
  const radarData = Object.entries(componentScores).map(([key, data]) => ({
    component: SSE_COMPONENTS[key].title,
    current: data.current,
    max: data.max,
    percentage: (data.current / data.max) * 100
  }))

  return (
    <Card className="bg-gray-900/50 border-blue-400/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-blue-400 flex items-center gap-2">
          <Target className="w-6 h-6" />
          SSE Score Builder
          <Badge className="bg-green-500 text-black ml-auto">
            {founderProfile.currentSSE}/100
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Radar Chart */}
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#333" />
                <PolarAngleAxis dataKey="component" tick={{ fontSize: 10, fill: '#888' }} />
                <PolarRadiusAxis 
                  angle={90} 
                  domain={[0, 100]} 
                  tick={{ fontSize: 8, fill: '#888' }}
                />
                <Radar 
                  name="Current Score" 
                  dataKey="percentage" 
                  stroke="#3b82f6" 
                  fill="#3b82f6" 
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          
          {/* Component Details */}
          <div className="space-y-4">
            {Object.entries(SSE_COMPONENTS).map(([key, component]) => {
              const Icon = component.icon
              const score = componentScores[key]
              const isSelected = selectedComponent === key
              
              return (
                <motion.div
                  key={key}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => setSelectedComponent(key)}
                  className={`p-4 rounded-lg border cursor-pointer transition-all ${
                    isSelected 
                      ? 'border-blue-400/50 bg-blue-900/20' 
                      : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <Icon className={`w-5 h-5 ${component.color}`} />
                      <span className="font-semibold">{component.title}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-blue-400">
                        {score.current}/{score.max}
                      </div>
                      <div className="text-xs text-gray-400">
                        {score.completion}% complete
                      </div>
                    </div>
                  </div>
                  <Progress value={score.completion} className="h-2 mb-2" />
                  <p className="text-sm text-gray-400">{component.description}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
        
        {/* Action Button */}
        <div className="mt-6 text-center">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Complete Assessment
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// AI Auxeira Mentor Component
const AuxeiraMentor = () => {
  const [selectedInsight, setSelectedInsight] = useState(0)
  
  const getInsightIcon = (type) => {
    switch (type) {
      case 'opportunity': return <Lightbulb className="w-5 h-5 text-green-400" />
      case 'risk': return <AlertTriangle className="w-5 h-5 text-red-400" />
      case 'optimization': return <Zap className="w-5 h-5 text-blue-400" />
      default: return <Brain className="w-5 h-5 text-purple-400" />
    }
  }
  
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical': return 'text-red-400 border-red-400/30'
      case 'High': return 'text-orange-400 border-orange-400/30'
      case 'Medium': return 'text-yellow-400 border-yellow-400/30'
      default: return 'text-green-400 border-green-400/30'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-400/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
          <Bot className="w-6 h-6" />
          AI Auxeira Mentor
          <Badge className="bg-purple-500 text-white ml-auto">
            EXCLUSIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mentorInsights.map((insight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-4 rounded-lg border cursor-pointer transition-all ${
                selectedInsight === index 
                  ? 'border-purple-400/50 bg-purple-900/20' 
                  : 'border-gray-600/30 bg-gray-800/30 hover:border-gray-500/50'
              }`}
              onClick={() => setSelectedInsight(index)}
            >
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{insight.title}</h4>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact}
                      </Badge>
                      <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                        {(insight.confidence * 100).toFixed(0)}% confidence
                      </Badge>
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 mb-2">{insight.description}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>Timeframe: {insight.timeframe}</span>
                    <Button variant="ghost" size="sm" className="h-auto p-1">
                      <MessageCircle className="w-3 h-3 mr-1" />
                      Discuss with AI
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-6 p-4 bg-purple-900/20 border border-purple-400/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="font-semibold text-purple-400">AI Mentor Chat</span>
          </div>
          <p className="text-sm text-gray-300 mb-3">
            Get personalized advice and strategic insights from your AI mentor, trained on successful startup patterns.
          </p>
          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            <MessageCircle className="w-4 h-4 mr-2" />
            Start Conversation
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Daily Actions Component
const DailyActionsTracker = () => {
  const [completedActions, setCompletedActions] = useState(new Set([1]))
  
  const handleActionComplete = (actionId) => {
    setCompletedActions(prev => new Set([...prev, actionId]))
  }
  
  const getImpactColor = (impact) => {
    switch (impact) {
      case 'High': return 'text-red-400 border-red-400/30'
      case 'Medium': return 'text-yellow-400 border-yellow-400/30'
      default: return 'text-green-400 border-green-400/30'
    }
  }
  
  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'market_access': return <Target className="w-4 h-4" />
      case 'funding': return <DollarSign className="w-4 h-4" />
      case 'management': return <Users className="w-4 h-4" />
      case 'operations': return <Settings className="w-4 h-4" />
      default: return <Activity className="w-4 h-4" />
    }
  }

  return (
    <Card className="bg-gray-900/50 border-green-400/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-green-400 flex items-center gap-2">
          <Calendar className="w-6 h-6" />
          Daily Actions
          <div className="ml-auto flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm">{founderProfile.streak} day streak</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dailyActions.map((action) => {
            const isCompleted = completedActions.has(action.id)
            
            return (
              <motion.div
                key={action.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  isCompleted 
                    ? 'border-green-400/30 bg-green-900/20' 
                    : 'border-gray-600/30 bg-gray-800/30'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      isCompleted ? 'bg-green-500/20' : 'bg-blue-500/20'
                    }`}>
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : (
                        getDomainIcon(action.domain)
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">{action.title}</h4>
                      <p className="text-sm text-gray-400 mt-1">{action.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant="outline" className="text-gold-400 border-gold-400/30 mb-2">
                      +{action.baseTokens} AUX
                    </Badge>
                    <div className="flex gap-1">
                      <Badge variant="outline" className={getImpactColor(action.impact)}>
                        {action.impact}
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{action.timeEstimate}</span>
                    </div>
                    <div className="capitalize">{action.domain.replace('_', ' ')}</div>
                  </div>
                  
                  {!isCompleted && (
                    <Button 
                      size="sm" 
                      onClick={() => handleActionComplete(action.id)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-blue-400">Today's Progress</h4>
              <p className="text-sm text-gray-400">Complete all actions to maintain your streak</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-400">
                {completedActions.size}/{dailyActions.length}
              </div>
              <div className="text-xs text-gray-400">Actions completed</div>
            </div>
          </div>
          <Progress value={(completedActions.size / dailyActions.length) * 100} className="h-2 mt-3" />
        </div>
      </CardContent>
    </Card>
  )
}

// Data Integrations Component
const DataIntegrations = () => {
  const [connectingService, setConnectingService] = useState(null)
  
  const handleConnect = (serviceName) => {
    setConnectingService(serviceName)
    // Simulate connection process
    setTimeout(() => {
      setConnectingService(null)
    }, 2000)
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-400'
      case 'disconnected': return 'text-red-400'
      default: return 'text-gray-400'
    }
  }

  return (
    <Card className="bg-gray-900/50 border-purple-400/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-purple-400 flex items-center gap-2">
          <Link className="w-6 h-6" />
          Data Integrations
          <Badge className="bg-purple-500 text-white ml-auto">
            Auto-Sync
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {integrations.map((integration, index) => {
            const Icon = integration.icon
            const isConnecting = connectingService === integration.name
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-gray-800/30 border border-gray-600/30 rounded-lg"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{integration.name}</h4>
                      <div className={`text-sm ${getStatusColor(integration.status)}`}>
                        {integration.status}
                      </div>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-gold-400 border-gold-400/30">
                    +{integration.bonus} AUX
                  </Badge>
                </div>
                
                <div className="text-sm text-gray-400 mb-3">
                  Last sync: {integration.lastSync}
                </div>
                
                {integration.status === 'connected' ? (
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-sm text-green-400">Active</span>
                    <Button variant="ghost" size="sm" className="ml-auto">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <Button 
                    size="sm" 
                    onClick={() => handleConnect(integration.name)}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 hover:bg-blue-700"
                  >
                    {isConnecting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                        Connecting...
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                )}
              </motion.div>
            )
          })}
        </div>
        
        <div className="mt-6 p-4 bg-green-900/20 border border-green-400/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="font-semibold text-green-400">Data Security</span>
          </div>
          <p className="text-sm text-gray-300">
            All integrations use OAuth 2.0 and are encrypted with quantum-secure protocols. 
            Your data is never stored permanently and is only used for SSE calculations.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

// Investor Visibility Controls
const InvestorVisibilityControls = () => {
  const [visibility, setVisibility] = useState(founderProfile.investorVisibility)
  const [granularSettings, setGranularSettings] = useState({
    basicInfo: true,
    financials: false,
    team: true,
    product: true,
    traction: false
  })

  return (
    <Card className="bg-gray-900/50 border-yellow-400/30">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-yellow-400 flex items-center gap-2">
          {visibility ? <Eye className="w-6 h-6" /> : <EyeOff className="w-6 h-6" />}
          Investor Visibility
          <Badge className={`ml-auto ${visibility ? 'bg-green-500' : 'bg-red-500'} text-white`}>
            {visibility ? 'VISIBLE' : 'HIDDEN'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Master Toggle */}
          <div className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
            <div>
              <h4 className="font-semibold">Master Visibility</h4>
              <p className="text-sm text-gray-400">
                Allow qualified investors to discover your startup
              </p>
            </div>
            <Button
              onClick={() => setVisibility(!visibility)}
              className={`${visibility ? 'bg-green-600 hover:bg-green-700' : 'bg-red-600 hover:bg-red-700'}`}
            >
              {visibility ? 'Visible' : 'Hidden'}
            </Button>
          </div>
          
          {/* Granular Controls */}
          {visibility && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="space-y-3"
            >
              <h4 className="font-semibold text-blue-400">Data Sharing Permissions</h4>
              {Object.entries(granularSettings).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between p-3 bg-gray-800/20 rounded-lg">
                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                  <Button
                    size="sm"
                    variant={value ? "default" : "outline"}
                    onClick={() => setGranularSettings(prev => ({ ...prev, [key]: !value }))}
                  >
                    {value ? 'Shared' : 'Private'}
                  </Button>
                </div>
              ))}
            </motion.div>
          )}
          
          {/* Anonymous Mode */}
          <div className="p-4 bg-blue-900/20 border border-blue-400/30 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-4 h-4 text-blue-400" />
              <span className="font-semibold text-blue-400">Anonymous Mode</span>
            </div>
            <p className="text-sm text-gray-300 mb-3">
              Share your metrics without revealing company identity until mutual interest is confirmed.
            </p>
            <Button variant="outline" className="border-blue-400/30 text-blue-400">
              Enable Anonymous Mode
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Main Startup Founder Dashboard Component
export default function EnhancedStartupFounderDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Rocket },
    { id: 'sse-builder', label: 'SSE Builder', icon: Target },
    { id: 'ai-mentor', label: 'AI Mentor', icon: Bot },
    { id: 'actions', label: 'Daily Actions', icon: Calendar },
    { id: 'integrations', label: 'Integrations', icon: Link },
    { id: 'visibility', label: 'Investor Visibility', icon: Eye }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'sse-builder':
        return <SSEScoreBuilder />
      case 'ai-mentor':
        return <AuxeiraMentor />
      case 'actions':
        return <DailyActionsTracker />
      case 'integrations':
        return <DataIntegrations />
      case 'visibility':
        return <InvestorVisibilityControls />
      default:
        return (
          <div className="space-y-6">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  Welcome back, {founderProfile.name}
                </h1>
                <p className="text-gray-400 mt-1">
                  {founderProfile.company} • {founderProfile.stage} • Founded {new Date(founderProfile.founded).getFullYear()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <Badge className="bg-gold-500 text-black">{founderProfile.level}</Badge>
                <div className="flex items-center gap-1">
                  <Coins className="w-4 h-4 text-gold-400" />
                  <span className="font-bold text-gold-400">{founderProfile.tokens.toLocaleString()}</span>
                </div>
              </div>
            </motion.div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="bg-gray-900/50 border-blue-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">SSE Score</p>
                      <p className="text-2xl font-bold text-blue-400">{founderProfile.currentSSE}/100</p>
                      <div className="flex items-center gap-1 text-sm text-green-400">
                        <TrendingUp className="w-3 h-3" />
                        <span>+{founderProfile.currentSSE - founderProfile.previousSSE}</span>
                      </div>
                    </div>
                    <Target className="w-8 h-8 text-blue-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-green-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Total Raised</p>
                      <p className="text-2xl font-bold text-green-400">
                        ${(founderProfile.totalRaised / 1000000).toFixed(1)}M
                      </p>
                      <div className="text-sm text-gray-400">
                        {founderProfile.runway} months runway
                      </div>
                    </div>
                    <DollarSign className="w-8 h-8 text-green-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-purple-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Team Size</p>
                      <p className="text-2xl font-bold text-purple-400">{founderProfile.team}</p>
                      <div className="text-sm text-gray-400">
                        Growing team
                      </div>
                    </div>
                    <Users className="w-8 h-8 text-purple-400" />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-orange-400/30">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400 uppercase tracking-wide">Profile</p>
                      <p className="text-2xl font-bold text-orange-400">{founderProfile.profileCompletion}%</p>
                      <div className="text-sm text-gray-400">
                        Complete
                      </div>
                    </div>
                    <CheckCircle className="w-8 h-8 text-orange-400" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* SSE Score History */}
            <Card className="bg-gray-900/50 border-blue-400/30">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-blue-400">SSE Score Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={sseHistory}>
                      <defs>
                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                      <XAxis dataKey="date" stroke="#888" />
                      <YAxis stroke="#888" domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#0a0a0a', 
                          border: '1px solid #333',
                          borderRadius: '8px'
                        }}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="score" 
                        stroke="#3b82f6" 
                        strokeWidth={3}
                        fillOpacity={1} 
                        fill="url(#colorScore)" 
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-gray-900/50 border-green-400/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-green-400">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    <Button className="h-16 bg-blue-600 hover:bg-blue-700 flex-col gap-2">
                      <Target className="w-5 h-5" />
                      <span className="text-sm">Update SSE</span>
                    </Button>
                    <Button className="h-16 bg-purple-600 hover:bg-purple-700 flex-col gap-2">
                      <Bot className="w-5 h-5" />
                      <span className="text-sm">AI Mentor</span>
                    </Button>
                    <Button className="h-16 bg-green-600 hover:bg-green-700 flex-col gap-2">
                      <Calendar className="w-5 h-5" />
                      <span className="text-sm">Daily Actions</span>
                    </Button>
                    <Button className="h-16 bg-orange-600 hover:bg-orange-700 flex-col gap-2">
                      <Link className="w-5 h-5" />
                      <span className="text-sm">Integrations</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900/50 border-gold-400/30">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold text-gold-400">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {achievements.filter(a => a.unlocked).map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-2 bg-gold-900/20 rounded-lg">
                        <Trophy className="w-5 h-5 text-gold-400" />
                        <div className="flex-1">
                          <div className="font-semibold text-gold-400">{achievement.title}</div>
                          <div className="text-xs text-gray-400">{achievement.description}</div>
                        </div>
                        <Badge variant="outline" className="text-gold-400 border-gold-400/30">
                          +{achievement.tokens}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6">
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
