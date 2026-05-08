// Auxeira Ferrari-Level Dashboard System
// Bloomberg Terminal-Inspired Investment Platform

// Core Dashboards
export { default as CompleteStartupFounderDashboard } from './CompleteStartupFounderDashboard.jsx'
export { default as FerrariVCDashboard } from './FerrariVCDashboard.jsx'
export { default as FerrariAngelInvestorDashboard } from './FerrariAngelInvestorDashboard.jsx'
export { default as FerrariESGEducationDashboard } from './FerrariESGEducationDashboard.jsx'
export { default as FerrariGovernmentAgencyDashboard } from './FerrariGovernmentAgencyDashboard.jsx'

// Additional Dashboards (Legacy/Alternative versions)
export { default as StartupFounderDashboard } from './StartupFounderDashboard.jsx'
export { default as VentureCapitalDashboard } from './VentureCapitalDashboard.jsx'
export { default as AngelInvestorDashboard } from './AngelInvestorDashboard.jsx'
export { default as CorporateShareValuePartnerDashboard } from './CorporateShareValuePartnerDashboard.jsx'
export { default as FerrariESGInvestorDashboard } from './FerrariESGInvestorDashboard.jsx'

// Specialized Components with Subscription Features
export { default as StartupDashboardWithBilling } from './StartupDashboardWithBilling.jsx'
export { default as GatedStartupDashboard } from './GatedStartupDashboard.jsx'
export { default as LPReportGenerator } from './LPReportGenerator.jsx'

// Subscription System Components
export { default as SubscriptionGating } from '../subscription/SubscriptionGating.jsx'

// UI Components
export * from './ui/button.jsx'
export * from './ui/card.jsx'
export * from './ui/badge.jsx'
export * from './ui/progress.jsx'
export * from './ui/input.jsx'

// Dashboard Types
export const DASHBOARD_TYPES = {
  STARTUP_FOUNDER: 'startup_founder',
  VENTURE_CAPITAL: 'venture_capital', 
  ANGEL_INVESTOR: 'angel_investor',
  ESG_EDUCATION: 'esg_education',
  ESG_GENERAL: 'esg_general',
  GOVERNMENT_AGENCY: 'government_agency',
  CORPORATE_PARTNER: 'corporate_partner'
}

// ESG Dashboard Types (17 UN SDG Goals)
export const ESG_DASHBOARD_TYPES = {
  SDG_1_NO_POVERTY: 'esg_sdg_1_no_poverty',
  SDG_2_ZERO_HUNGER: 'esg_sdg_2_zero_hunger',
  SDG_3_GOOD_HEALTH: 'esg_sdg_3_good_health',
  SDG_4_QUALITY_EDUCATION: 'esg_sdg_4_quality_education', // ✅ COMPLETED
  SDG_5_GENDER_EQUALITY: 'esg_sdg_5_gender_equality',
  SDG_6_CLEAN_WATER: 'esg_sdg_6_clean_water',
  SDG_7_AFFORDABLE_ENERGY: 'esg_sdg_7_affordable_energy',
  SDG_8_DECENT_WORK: 'esg_sdg_8_decent_work',
  SDG_9_INNOVATION: 'esg_sdg_9_innovation',
  SDG_10_REDUCED_INEQUALITIES: 'esg_sdg_10_reduced_inequalities',
  SDG_11_SUSTAINABLE_CITIES: 'esg_sdg_11_sustainable_cities',
  SDG_12_RESPONSIBLE_CONSUMPTION: 'esg_sdg_12_responsible_consumption',
  SDG_13_CLIMATE_ACTION: 'esg_sdg_13_climate_action',
  SDG_14_LIFE_BELOW_WATER: 'esg_sdg_14_life_below_water',
  SDG_15_LIFE_ON_LAND: 'esg_sdg_15_life_on_land',
  SDG_16_PEACE_JUSTICE: 'esg_sdg_16_peace_justice',
  SDG_17_PARTNERSHIPS: 'esg_sdg_17_partnerships'
}

// Dashboard Configuration
export const DASHBOARD_CONFIG = {
  [DASHBOARD_TYPES.STARTUP_FOUNDER]: {
    name: 'Startup Founder Dashboard',
    component: 'CompleteStartupFounderDashboard',
    features: ['AI Mentor', 'Valuation Engine', 'Token Rewards', 'Subscription Gating'],
    pricing: { free: true, standard: 149, premium: 499 },
    subscriptionGating: true,
    trialDays: 30
  },
  [DASHBOARD_TYPES.VENTURE_CAPITAL]: {
    name: 'Venture Capital Dashboard', 
    component: 'FerrariVCDashboard',
    features: ['LP Reports', 'Deal Flow', 'Portfolio Analytics', 'Premium Reports'],
    pricing: { free: false, standard: 299, premium: 699 },
    subscriptionGating: true,
    trialDays: 30
  },
  [DASHBOARD_TYPES.ANGEL_INVESTOR]: {
    name: 'Angel Investor Dashboard',
    component: 'FerrariAngelInvestorDashboard', 
    features: ['Personal Portfolio', 'Ghost Network', 'Syndicate Deals', 'Tax Reports'],
    pricing: { free: true, standard: 199, premium: 399 },
    subscriptionGating: true,
    trialDays: 30
  },
  [DASHBOARD_TYPES.ESG_EDUCATION]: {
    name: 'ESG Education Investor Dashboard',
    component: 'FerrariESGEducationDashboard',
    features: ['Learning Analytics', 'Teacher Impact', 'UNESCO Compliance', 'Education Reports'],
    pricing: { free: true, standard: 299, premium: 699 },
    subscriptionGating: true,
    trialDays: 30
  },
  [DASHBOARD_TYPES.GOVERNMENT_AGENCY]: {
    name: 'Government Agency Dashboard',
    component: 'FerrariGovernmentAgencyDashboard',
    features: ['Economic Analytics', 'Job Creation', 'Policy Reports', 'Compliance Tracking'],
    pricing: { free: true, standard: 2499, premium: 4999 },
    subscriptionGating: true,
    trialDays: 30
  },
  [DASHBOARD_TYPES.CORPORATE_PARTNER]: {
    name: 'Corporate Share Value Partner Dashboard',
    component: 'CorporateShareValuePartnerDashboard',
    features: ['Ecosystem Pulse', 'Blind Auction Engine', 'Silent Shareholder Mode', 'Executive Voice Interface'],
    pricing: { free: false, standard: 1299, premium: 2499 },
    subscriptionGating: true,
    trialDays: 30
  }
}

// Subscription Tiers
export const SUBSCRIPTION_TIERS = {
  FREE: 'free',
  TRIAL: 'trial',
  STANDARD: 'standard', 
  PREMIUM: 'premium',
  ENTERPRISE: 'enterprise'
}

// Subscription Status
export const SUBSCRIPTION_STATUS = {
  ACTIVE: 'active',
  TRIAL: 'trial',
  GRACE: 'grace',
  FROZEN: 'frozen',
  CANCELLED: 'cancelled'
}

// Feature Flags
export const FEATURE_FLAGS = {
  AI_MENTOR: 'ai_mentor',
  VOICE_INTERFACE: 'voice_interface',
  BLOCKCHAIN_VERIFICATION: 'blockchain_verification',
  QUANTUM_SECURITY: 'quantum_security',
  REAL_TIME_ANALYTICS: 'real_time_analytics',
  PREMIUM_REPORTS: 'premium_reports',
  API_ACCESS: 'api_access',
  EXPORT_CAPABILITIES: 'export_capabilities',
  CRYPTO_VESTING: 'crypto_vesting',
  PARTNER_INTRODUCTIONS: 'partner_introductions',
  PREMIUM_ANALYTICS: 'premium_analytics'
}

// Subscription Gating Configuration
export const SUBSCRIPTION_GATING_CONFIG = {
  trialDays: 30,
  gracePeriodDays: 7,
  autoFreezeOnFailure: true,
  allowInlineRetry: true,
  noRefundsMidMonth: true,
  
  // Features locked behind paywall
  premiumFeatures: [
    FEATURE_FLAGS.EXPORT_CAPABILITIES,
    FEATURE_FLAGS.CRYPTO_VESTING,
    FEATURE_FLAGS.PARTNER_INTRODUCTIONS,
    FEATURE_FLAGS.PREMIUM_ANALYTICS,
    FEATURE_FLAGS.API_ACCESS,
    FEATURE_FLAGS.VOICE_INTERFACE,
    FEATURE_FLAGS.BLOCKCHAIN_VERIFICATION
  ],
  
  // Features available in free tier
  freeFeatures: [
    'basic_dashboard',
    'sse_score_tracking',
    'ai_mentor_basic',
    'company_valuation_basic'
  ]
}
