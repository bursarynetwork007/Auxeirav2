import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FileText, Download, Eye, Lock, Unlock, CheckSquare, Square, 
  TrendingUp, TrendingDown, DollarSign, Target, Users, Brain, 
  Shield, AlertTriangle, CheckCircle, Clock, Flame, Trophy, 
  Lightbulb, BarChart3, PieChart, Calendar, Send, CreditCard,
  Crown, Gem, Sparkles, ArrowRight, ExternalLink, Building2,
  Radar, Calculator, Network, Activity, Zap, RefreshCw, Plus,
  X, Info, HelpCircle, Star, Award, Briefcase, Globe, MapPin
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card.jsx'
import { Badge } from '../ui/badge.jsx'
import { Button } from '../ui/button.jsx'
import { Progress } from '../ui/progress.jsx'
import { Input } from '../ui/input.jsx'

// Sample LP Report Data
const lpReportData = {
  reportId: 'LP_Q4_2024_001',
  generatedDate: new Date().toISOString(),
  reportingPeriod: 'Q4 2024',
  fund: {
    name: 'Alpha Ventures Fund III',
    vintage: 2022,
    fundSize: 250000000,
    deployedCapital: 180000000,
    remainingCapital: 70000000
  },
  performance: {
    irr: 28.4,
    moic: 2.8,
    dpi: 0.9,
    tvpi: 1.8,
    alphaScore: 76,
    portfolioValue: 450000000,
    unrealizedGains: 270000000,
    realizedGains: 45000000
  },
  companies: [
    {
      name: 'CloudSec',
      sector: 'Cybersecurity',
      stage: 'Series B',
      investment: 8000000,
      currentValue: 24000000,
      irr: 45.2,
      moic: 3.0,
      sseScore: 92,
      status: 'Strong Performer',
      keyUpdates: [
        'Closed $15M Series B led by Sequoia',
        'Achieved SOC 2 Type II compliance',
        'Expanded to European markets',
        'ARR grew 150% YoY to $12M'
      ]
    },
    {
      name: 'HealthTech',
      sector: 'Healthcare',
      stage: 'Series A',
      investment: 5000000,
      currentValue: 12000000,
      irr: 32.1,
      moic: 2.4,
      sseScore: 78,
      status: 'Watch List',
      keyUpdates: [
        'FDA breakthrough device designation received',
        'Burn rate optimization reduced monthly spend by 20%',
        'Key hire: VP of Clinical Affairs from Medtronic',
        'Pilot program with 3 major health systems'
      ]
    },
    {
      name: 'FinanceApp',
      sector: 'Fintech',
      stage: 'Seed',
      investment: 2000000,
      currentValue: 8000000,
      irr: 78.5,
      moic: 4.0,
      sseScore: 88,
      status: 'Star Performer',
      keyUpdates: [
        'User base grew 300% to 500K active users',
        'Revenue run rate hit $4M ARR',
        'Banking partnership with JPMorgan Chase',
        'Series A fundraising process initiated'
      ]
    }
  ],
  riskAssessment: {
    overallRisk: 'Medium',
    sectorConcentration: 'Low',
    stageConcentration: 'Medium',
    liquidityRisk: 'Low',
    marketRisk: 'Medium',
    alerts: [
      {
        type: 'warning',
        company: 'HealthTech',
        message: 'Runway reduced to 14 months due to increased R&D spend',
        recommendation: 'Consider bridge funding or Series B acceleration'
      },
      {
        type: 'opportunity',
        company: 'DataCorp',
        message: 'Strong Q3 performance indicates Series B readiness',
        recommendation: 'Evaluate follow-on investment opportunity'
      }
    ]
  },
  marketIntelligence: {
    sectorTrends: [
      { sector: 'AI/ML', growth: 45.2, outlook: 'Very Positive' },
      { sector: 'Fintech', growth: 23.8, outlook: 'Positive' },
      { sector: 'Healthcare', growth: 18.5, outlook: 'Stable' },
      { sector: 'Cybersecurity', growth: 32.1, outlook: 'Very Positive' }
    ],
    exitEnvironment: 'Favorable',
    valuationTrends: 'Stable to Increasing',
    competitivePosition: 'Strong'
  },
  valueAddActivities: [
    {
      category: 'Strategic Guidance',
      activities: [
        'Board participation across 28 portfolio companies',
        'Strategic planning sessions with 15 companies',
        'Go-to-market strategy development for 8 companies'
      ]
    },
    {
      category: 'Network Access',
      activities: [
        '45 customer introductions facilitated',
        '12 strategic partnership connections',
        '8 key executive hires through network'
      ]
    },
    {
      category: 'Operational Support',
      activities: [
        'Financial planning support for 20 companies',
        'Legal and compliance guidance',
        'Technology infrastructure optimization'
      ]
    }
  ],
  benchmarkComparisons: {
    peerFunds: [
      { metric: 'IRR', ourFund: 28.4, peerMedian: 22.1, peerTop25: 31.2 },
      { metric: 'MOIC', ourFund: 2.8, peerMedian: 2.2, peerTop25: 3.1 },
      { metric: 'DPI', ourFund: 0.9, peerMedian: 0.7, peerTop25: 1.2 }
    ],
    marketIndices: [
      { index: 'Cambridge Associates VC Index', ourPerformance: '+6.3%' },
      { index: 'PitchBook VC Index', ourPerformance: '+4.8%' },
      { index: 'NVCA Yearbook Median', ourPerformance: '+7.2%' }
    ]
  },
  predictiveAnalytics: {
    projectedIRR: {
      conservative: 25.8,
      base: 31.2,
      optimistic: 38.7
    },
    exitProbabilities: [
      { company: 'TechCo', exitType: 'IPO', probability: 65, timeframe: '18-24 months' },
      { company: 'CloudSec', exitType: 'Strategic Acquisition', probability: 45, timeframe: '12-18 months' },
      { company: 'FinanceApp', exitType: 'Strategic Acquisition', probability: 35, timeframe: '24-36 months' }
    ],
    portfolioValuation: {
      currentQuarter: 450000000,
      nextQuarter: 485000000,
      yearEnd: 520000000
    }
  },
  counterfactualAnalysis: {
    withSSE: {
      averageIRR: 28.4,
      portfolioValue: 450000000,
      successRate: 85
    },
    withoutSSE: {
      averageIRR: 19.7,
      portfolioValue: 320000000,
      successRate: 62
    },
    causalImpact: {
      irrLift: 8.7,
      valueLift: 130000000,
      successRateLift: 23,
      statisticalSignificance: 0.001
    }
  }
}

// Report Section Configuration
const reportSections = [
  {
    id: 'executive_summary',
    title: 'Executive Summary',
    description: 'High-level performance overview and key highlights',
    required: true,
    premium: false
  },
  {
    id: 'portfolio_overview',
    title: 'Portfolio Overview & Health',
    description: 'Comprehensive portfolio metrics and valuation data',
    required: true,
    premium: false
  },
  {
    id: 'company_updates',
    title: 'Individual Company Updates',
    description: 'Detailed performance updates for each portfolio company',
    required: false,
    premium: true
  },
  {
    id: 'sse_performance',
    title: 'Aggregate SSE Performance',
    description: 'Alpha score analysis and startup success engine metrics',
    required: false,
    premium: true
  },
  {
    id: 'risk_assessment',
    title: 'Risk Assessment & Alerts',
    description: 'Portfolio risk analysis and critical alerts',
    required: false,
    premium: false
  },
  {
    id: 'new_investments',
    title: 'New Investments & Pipeline',
    description: 'Recent investments and deal flow analysis',
    required: false,
    premium: true
  },
  {
    id: 'exits_returns',
    title: 'Exits & Returns',
    description: 'Exit activity and realized returns analysis',
    required: false,
    premium: true
  },
  {
    id: 'predictive_analytics',
    title: 'Predictive Analytics',
    description: 'AI-powered forecasts and scenario analysis',
    required: false,
    premium: true
  },
  {
    id: 'benchmark_comparisons',
    title: 'Benchmark Comparisons',
    description: 'Performance vs. peer funds and market indices',
    required: false,
    premium: true
  },
  {
    id: 'value_add',
    title: 'Value-Add Activities',
    description: 'Platform-driven value creation activities',
    required: false,
    premium: false
  },
  {
    id: 'market_intelligence',
    title: 'Market Intelligence',
    description: 'Sector trends and competitive landscape analysis',
    required: false,
    premium: true
  },
  {
    id: 'counterfactual',
    title: 'Counterfactual Analysis',
    description: 'Statistical evidence of platform value creation',
    required: false,
    premium: true
  }
]

// Paystack Payment Component
const PaystackPayment = ({ onSuccess, onClose, reportId }) => {
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)

  const handlePayment = async () => {
    setIsProcessing(true)
    
    // Simulate Paystack payment flow
    try {
      // In real implementation, this would integrate with Paystack API
      const paymentData = {
        email: 'sarah.chen@alphaventures.com',
        amount: 4900, // $49 in cents
        currency: 'USD',
        reference: `LP_REPORT_${reportId}_${Date.now()}`,
        metadata: {
          reportId,
          userId: 'vc_fund_456',
          reportType: 'LP_Premium_Report'
        }
      }

      // Simulate payment processing delay
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      setPaymentSuccess(true)
      setTimeout(() => {
        onSuccess(paymentData)
      }, 2000)
      
    } catch (error) {
      console.error('Payment failed:', error)
      setIsProcessing(false)
    }
  }

  if (paymentSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center p-8"
      >
        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Payment Successful!</h3>
        <p className="text-gray-400 mb-4">
          Your premium LP report is being generated and will be available shortly.
        </p>
        <div className="flex items-center justify-center gap-2 text-green-400">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span>Generating premium report...</span>
        </div>
      </motion.div>
    )
  }

  return (
    <div className="p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Unlock Premium LP Report</h3>
        <p className="text-gray-400">
          Get the complete report with detailed analytics, company updates, and predictive insights
        </p>
      </div>

      <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
        <h4 className="font-semibold text-white mb-3">Premium Features Included:</h4>
        <ul className="space-y-2 text-sm text-gray-300">
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Individual company performance updates
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            AI-powered predictive analytics
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Benchmark comparisons vs. peer funds
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Counterfactual analysis with statistical significance
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Market intelligence and sector trends
          </li>
          <li className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-400" />
            Professional PDF export for LP distribution
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-4 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-white font-bold text-lg">Premium LP Report</div>
            <div className="text-blue-100 text-sm">One-time purchase</div>
          </div>
          <div className="text-right">
            <div className="text-white font-bold text-2xl">$49</div>
            <div className="text-blue-100 text-sm">USD</div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onClose}
          variant="outline"
          className="flex-1"
          disabled={isProcessing}
        >
          Cancel
        </Button>
        <Button
          onClick={handlePayment}
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <div className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" />
              Processing...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Pay with Paystack
            </div>
          )}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500">
          Secure payment powered by Paystack • 256-bit SSL encryption
        </p>
      </div>
    </div>
  )
}

// Report Preview Component
const ReportPreview = ({ selectedSections, isPremium }) => {
  const renderExecutiveSummary = () => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Executive Summary</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-900/20 border border-green-400/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400">{lpReportData.performance.irr}%</div>
          <div className="text-sm text-gray-400">Net IRR</div>
          <div className="text-xs text-green-400">+{(lpReportData.performance.irr - 25).toFixed(1)}% vs target</div>
        </div>
        <div className="bg-blue-900/20 border border-blue-400/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-400">{lpReportData.performance.moic}x</div>
          <div className="text-sm text-gray-400">MOIC</div>
          <div className="text-xs text-blue-400">Top quartile performance</div>
        </div>
        <div className="bg-purple-900/20 border border-purple-400/30 rounded-lg p-4">
          <div className="text-2xl font-bold text-purple-400">${(lpReportData.performance.portfolioValue / 1000000).toFixed(0)}M</div>
          <div className="text-sm text-gray-400">Portfolio Value</div>
          <div className="text-xs text-purple-400">+18% this quarter</div>
        </div>
      </div>
      <p className="text-gray-300 text-sm leading-relaxed">
        <strong>Fund III continues to deliver exceptional performance</strong>, with a net IRR of {lpReportData.performance.irr}% 
        and MOIC of {lpReportData.performance.moic}x, significantly outperforming our target returns and peer benchmarks. 
        The portfolio's aggregate value reached ${(lpReportData.performance.portfolioValue / 1000000).toFixed(0)}M this quarter, 
        driven by strong performance from CloudSec, FinanceApp, and DataCorp. Our AI-powered Startup Success Engine (SSE) 
        continues to generate alpha, with a portfolio-wide SSE score of {lpReportData.performance.alphaScore}.
      </p>
    </div>
  )

  const renderPortfolioOverview = () => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Portfolio Overview & Health</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-white mb-3">Fund Deployment</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Fund Size:</span>
              <span className="text-white">${(lpReportData.fund.fundSize / 1000000).toFixed(0)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Deployed Capital:</span>
              <span className="text-white">${(lpReportData.fund.deployedCapital / 1000000).toFixed(0)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Remaining Capital:</span>
              <span className="text-white">${(lpReportData.fund.remainingCapital / 1000000).toFixed(0)}M</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-500 h-2 rounded-full" 
                style={{ width: `${(lpReportData.fund.deployedCapital / lpReportData.fund.fundSize) * 100}%` }}
              />
            </div>
            <div className="text-xs text-gray-400">
              {((lpReportData.fund.deployedCapital / lpReportData.fund.fundSize) * 100).toFixed(1)}% deployed
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Performance Metrics</h4>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">TVPI:</span>
              <span className="text-white">{lpReportData.performance.tvpi}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">DPI:</span>
              <span className="text-white">{lpReportData.performance.dpi}x</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Unrealized Gains:</span>
              <span className="text-white">${(lpReportData.performance.unrealizedGains / 1000000).toFixed(0)}M</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Realized Gains:</span>
              <span className="text-white">${(lpReportData.performance.realizedGains / 1000000).toFixed(0)}M</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderCompanyUpdates = () => {
    if (!isPremium) {
      return (
        <div className="mb-8 relative">
          <div className="absolute inset-0 bg-gray-900/80 backdrop-blur-sm rounded-lg z-10 flex items-center justify-center">
            <div className="text-center p-6">
              <Lock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h4 className="font-semibold text-white mb-2">Premium Content</h4>
              <p className="text-gray-400 text-sm">Unlock detailed company updates with premium report</p>
            </div>
          </div>
          <div className="blur-sm">
            <h3 className="text-xl font-bold text-white mb-4">Individual Company Updates</h3>
            <div className="space-y-4">
              {lpReportData.companies.slice(0, 2).map((company) => (
                <div key={company.name} className="bg-gray-800/30 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-white">{company.name}</h4>
                      <p className="text-sm text-gray-400">{company.sector} • {company.stage}</p>
                    </div>
                    <Badge variant={company.status === 'Star Performer' ? 'success' : 'warning'}>
                      {company.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-lg font-bold text-green-400">{company.irr.toFixed(1)}%</div>
                      <div className="text-xs text-gray-400">IRR</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-blue-400">{company.moic.toFixed(1)}x</div>
                      <div className="text-xs text-gray-400">MOIC</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-400">{company.sseScore}</div>
                      <div className="text-xs text-gray-400">SSE Score</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="mb-8">
        <h3 className="text-xl font-bold text-white mb-4">Individual Company Updates</h3>
        <div className="space-y-6">
          {lpReportData.companies.map((company) => (
            <div key={company.name} className="bg-gray-800/30 rounded-lg p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-semibold text-white text-lg">{company.name}</h4>
                  <p className="text-sm text-gray-400">{company.sector} • {company.stage}</p>
                </div>
                <Badge variant={company.status === 'Star Performer' ? 'success' : company.status === 'Strong Performer' ? 'default' : 'warning'}>
                  {company.status}
                </Badge>
              </div>
              
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-green-400">{company.irr.toFixed(1)}%</div>
                  <div className="text-xs text-gray-400">IRR</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-blue-400">{company.moic.toFixed(1)}x</div>
                  <div className="text-xs text-gray-400">MOIC</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-purple-400">{company.sseScore}</div>
                  <div className="text-xs text-gray-400">SSE Score</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-white">${(company.currentValue / 1000000).toFixed(1)}M</div>
                  <div className="text-xs text-gray-400">Valuation</div>
                </div>
              </div>

              <div>
                <h5 className="font-semibold text-white mb-2">Key Updates This Quarter:</h5>
                <ul className="space-y-1">
                  {company.keyUpdates.map((update, index) => (
                    <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                      {update}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderRiskAssessment = () => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Risk Assessment & Alerts</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-semibold text-white mb-3">Risk Overview</h4>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Overall Risk:</span>
              <Badge variant="warning">{lpReportData.riskAssessment.overallRisk}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Sector Concentration:</span>
              <Badge variant="success">{lpReportData.riskAssessment.sectorConcentration}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Stage Concentration:</span>
              <Badge variant="warning">{lpReportData.riskAssessment.stageConcentration}</Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400">Liquidity Risk:</span>
              <Badge variant="success">{lpReportData.riskAssessment.liquidityRisk}</Badge>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-semibold text-white mb-3">Active Alerts</h4>
          <div className="space-y-3">
            {lpReportData.riskAssessment.alerts.map((alert, index) => (
              <div 
                key={index} 
                className={`p-3 rounded-lg border ${
                  alert.type === 'warning' 
                    ? 'bg-yellow-900/20 border-yellow-400/30' 
                    : 'bg-blue-900/20 border-blue-400/30'
                }`}
              >
                <div className="flex items-start gap-2">
                  {alert.type === 'warning' ? (
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5" />
                  ) : (
                    <Lightbulb className="w-4 h-4 text-blue-400 mt-0.5" />
                  )}
                  <div>
                    <div className="font-semibold text-white text-sm">{alert.company}</div>
                    <div className="text-xs text-gray-300">{alert.message}</div>
                    <div className="text-xs text-gray-400 mt-1">{alert.recommendation}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )

  const renderValueAddActivities = () => (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-white mb-4">Value-Add Activities</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {lpReportData.valueAddActivities.map((category) => (
          <div key={category.category} className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="font-semibold text-white mb-3">{category.category}</h4>
            <ul className="space-y-2">
              {category.activities.map((activity, index) => (
                <li key={index} className="text-sm text-gray-300 flex items-start gap-2">
                  <CheckCircle className="w-3 h-3 text-green-400 mt-0.5 flex-shrink-0" />
                  {activity}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )

  const renderAcademicCitation = () => (
    <div className="mb-8 p-4 bg-blue-900/20 border-l-4 border-blue-400 rounded-r-lg">
      <h4 className="font-semibold text-blue-400 mb-2">Academic Citation & Statistical Significance</h4>
      <p className="text-sm text-gray-300 italic mb-2">
        "The implementation of AI-driven portfolio management through the Startup Success Engine (SSE) 
        demonstrates statistically significant outperformance relative to traditional VC approaches."
      </p>
      <div className="text-xs text-gray-400">
        <strong>Statistical Analysis:</strong> Two-sample t-test comparing SSE-managed vs. control portfolios 
        (n=156 companies, p&lt;0.001, Cohen's d=1.23). The SSE approach shows an average IRR lift of 8.7 
        percentage points with 95% confidence interval [6.2, 11.2].
      </div>
    </div>
  )

  return (
    <div className="bg-white text-gray-900 rounded-lg p-8 max-h-96 overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">{lpReportData.fund.name}</h2>
        <p className="text-gray-600">Limited Partner Report • {lpReportData.reportingPeriod}</p>
        <p className="text-sm text-gray-500">Generated on {new Date(lpReportData.generatedDate).toLocaleDateString()}</p>
      </div>

      {selectedSections.includes('executive_summary') && renderExecutiveSummary()}
      {selectedSections.includes('portfolio_overview') && renderPortfolioOverview()}
      {selectedSections.includes('company_updates') && renderCompanyUpdates()}
      {selectedSections.includes('risk_assessment') && renderRiskAssessment()}
      {selectedSections.includes('value_add') && renderValueAddActivities()}
      
      {isPremium && renderAcademicCitation()}

      {!isPremium && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
          <div className="text-center">
            <Crown className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900 mb-2">Unlock Complete Report</h3>
            <p className="text-gray-600 text-sm mb-4">
              Get detailed company updates, predictive analytics, benchmark comparisons, and more
            </p>
            <div className="text-2xl font-bold text-blue-600">$49</div>
            <div className="text-sm text-gray-500">One-time purchase</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Main LP Report Generator Component
export default function LPReportGenerator() {
  const [selectedSections, setSelectedSections] = useState(['executive_summary', 'portfolio_overview', 'risk_assessment', 'value_add'])
  const [showPayment, setShowPayment] = useState(false)
  const [isPremium, setIsPremium] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)

  const toggleSection = (sectionId) => {
    const section = reportSections.find(s => s.id === sectionId)
    
    if (section.premium && !isPremium) {
      setShowPayment(true)
      return
    }

    if (section.required) return

    setSelectedSections(prev => 
      prev.includes(sectionId)
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    )
  }

  const handlePaymentSuccess = (paymentData) => {
    setIsPremium(true)
    setShowPayment(false)
    
    // Add all premium sections
    const premiumSections = reportSections.filter(s => s.premium).map(s => s.id)
    setSelectedSections(prev => [...new Set([...prev, ...premiumSections])])
  }

  const generateReport = async () => {
    setIsGenerating(true)
    
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    setIsGenerating(false)
    
    // In real implementation, this would generate and download the PDF
    alert('Report generated successfully! Check your downloads folder.')
  }

  const freeSections = selectedSections.filter(id => {
    const section = reportSections.find(s => s.id === id)
    return !section.premium || isPremium
  })

  const premiumSectionsCount = reportSections.filter(s => s.premium).length
  const selectedPremiumCount = selectedSections.filter(id => {
    const section = reportSections.find(s => s.id === id)
    return section.premium
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <FileText className="w-6 h-6" />
            LP Report Generator
            <Badge variant="premium" className="ml-2">
              Professional Reports
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-900/20 rounded-lg border border-blue-400/30">
              <div className="text-2xl font-bold text-blue-400">{freeSections.length}</div>
              <div className="text-sm text-gray-400">Sections Selected</div>
            </div>
            <div className="text-center p-4 bg-purple-900/20 rounded-lg border border-purple-400/30">
              <div className="text-2xl font-bold text-purple-400">
                {isPremium ? premiumSectionsCount : 0}/{premiumSectionsCount}
              </div>
              <div className="text-sm text-gray-400">Premium Features</div>
            </div>
            <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-400/30">
              <div className="text-2xl font-bold text-green-400">Q4 2024</div>
              <div className="text-sm text-gray-400">Reporting Period</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Section Selection */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Report Sections</CardTitle>
            <p className="text-gray-400 text-sm">
              Customize your LP report by selecting relevant sections
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {reportSections.map((section) => (
                <div
                  key={section.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedSections.includes(section.id)
                      ? 'border-blue-400 bg-blue-900/20'
                      : 'border-gray-600 bg-gray-800/30 hover:border-gray-500'
                  } ${section.required ? 'opacity-75' : ''}`}
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {selectedSections.includes(section.id) ? (
                        <CheckSquare className="w-5 h-5 text-blue-400" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                      <div>
                        <div className="font-semibold text-white flex items-center gap-2">
                          {section.title}
                          {section.required && <Badge variant="outline" className="text-xs">Required</Badge>}
                          {section.premium && !isPremium && <Lock className="w-3 h-3 text-yellow-400" />}
                          {section.premium && isPremium && <Crown className="w-3 h-3 text-yellow-400" />}
                        </div>
                        <div className="text-sm text-gray-400">{section.description}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isPremium && (
              <div className="mt-6 p-4 bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-400/30 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Crown className="w-5 h-5 text-yellow-400" />
                  <h4 className="font-semibold text-white">Unlock Premium Sections</h4>
                </div>
                <p className="text-sm text-gray-400 mb-3">
                  Get access to {premiumSectionsCount} premium sections including detailed company updates, 
                  predictive analytics, and benchmark comparisons.
                </p>
                <Button
                  onClick={() => setShowPayment(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade for $49
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Report Preview */}
        <Card className="bg-gray-900/50 border-gray-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-white">Report Preview</CardTitle>
              <div className="flex gap-2">
                <Button
                  onClick={generateReport}
                  disabled={isGenerating || selectedSections.length === 0}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Generating...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      Generate PDF
                    </div>
                  )}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ReportPreview selectedSections={freeSections} isPremium={isPremium} />
          </CardContent>
        </Card>
      </div>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-gray-900 border border-gray-700 rounded-lg max-w-md w-full"
            >
              <PaystackPayment
                onSuccess={handlePaymentSuccess}
                onClose={() => setShowPayment(false)}
                reportId={lpReportData.reportId}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
