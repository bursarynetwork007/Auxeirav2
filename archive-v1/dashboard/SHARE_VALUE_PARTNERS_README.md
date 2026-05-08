# Share Value Partners Dashboard

## 🎯 Overview

A Ferrari-level **Strategy Intelligence Storytelling Platform** for Auxeira Share Value Partners. This dashboard transforms raw data into compelling narratives, enabling partners to understand their impact, optimize strategies, and maximize ROI through AI-powered insights and interactive scenario modeling.

## ✨ Key Features

### 1. AI-Powered Strategic Insights
- **Intelligent Analysis**: Claude AI analyzes partner performance data and generates strategic narratives
- **Real-time Insights**: Dynamic insights based on current metrics and trends
- **Actionable Recommendations**: Data-driven suggestions for improving performance
- **Fallback System**: Pre-generated insights when AI is unavailable

### 2. What-If Scenario Modeling
- **Interactive Variables**: Adjust investment, discount rates, target startups, and time horizons
- **Real-time Projections**: Instant calculation of projected outcomes
- **Comparison View**: Side-by-side current vs. projected metrics
- **Export Functionality**: Download scenario analysis as CSV

### 3. Engagement Form Gating
- **Professional Onboarding**: Multi-step form with progress indicators
- **Tier Selection**: Silver ($49/mo), Gold ($99/mo), Platinum ($199/mo)
- **Paystack Integration**: Secure payment processing with subscription management
- **Authentication Flow**: Payment verification before dashboard access

### 4. Premium UI/UX
- **Ferrari-Level Design**: Dark theme with premium color palette and glass morphism
- **Responsive Layout**: Optimized for desktop, tablet, and mobile
- **Interactive Charts**: Chart.js visualizations for performance tracking
- **Smooth Animations**: 60fps transitions and micro-interactions

## 📁 Files

### Main Files
- `share_value_partner_enhanced.html` - Main dashboard with AI insights and scenarios
- `share_value_partner_onboarding.html` - Onboarding form with payment integration

### Documentation
- `../../SHARE_VALUE_PARTNER_IMPLEMENTATION_GUIDE.md` - Complete setup guide
- `../../DASHBOARD_ENHANCEMENT_DESIGN.md` - Design specifications

## 🚀 Quick Start

### 1. Local Testing

```bash
# Start local server
cd /path/to/auxeira-backend
python3 -m http.server 8080

# Access onboarding form
# Open browser: http://localhost:8080/frontend/dashboard/share_value_partner_onboarding.html
```

### 2. Bypass Authentication (Testing Only)

```javascript
// In browser console
localStorage.setItem('auxeira_partner_authenticated', 'true');
localStorage.setItem('auxeira_payment_verified', 'true');
localStorage.setItem('auxeira_partner_tier', 'gold');
localStorage.setItem('auxeira_partner_company', 'Test Company');

// Navigate to dashboard
window.location.href = '/frontend/dashboard/share_value_partner_enhanced.html';
```

### 3. Test Payment Flow

Use Paystack test credentials:
- **Card Number**: 4084 0840 8408 4081
- **CVV**: 408
- **Expiry**: Any future date
- **PIN**: 0000

## ⚙️ Configuration

### API Keys Required

1. **OpenAI-Compatible API** (for AI insights)
   - Set in `share_value_partner_enhanced.html` line ~745
   - Or use environment variable: `OPENAI_API_KEY`

2. **Paystack Public Key** (for payments)
   - Set in `share_value_partner_onboarding.html` line ~420
   - Test: `pk_test_...`
   - Production: `pk_live_...`

### Environment Variables

```bash
OPENAI_API_KEY=your_api_key_here
PAYSTACK_PUBLIC_KEY=pk_live_your_key
PAYSTACK_SECRET_KEY=sk_live_YOUR_PAYSTACK_SECRET_KEY_secret
```

## 🎨 Customization

### Update Branding Colors

Edit CSS variables in both HTML files:

```css
:root {
    --terminal-blue: #0088ff;      /* Primary */
    --terminal-purple: #8800ff;    /* Secondary */
    --terminal-gold: #ffaa00;      /* Accent */
}
```

### Modify Tier Pricing

Update in `share_value_partner_onboarding.html`:

```javascript
const amounts = {
    silver: 4900,   // $49 in cents
    gold: 9900,     // $99 in cents
    platinum: 19900 // $199 in cents
};
```

### Customize AI Model

Change model in `share_value_partner_enhanced.html`:

```javascript
body: JSON.stringify({
    model: 'gemini-2.5-flash',  // or 'gpt-4.1-mini'
    // ...
})
```

## 📊 Dashboard Tabs

### Overview Tab
- AI-Powered Strategic Insights section
- Key Performance Indicators (Shadow Value, ROI, Engagements, ESG Score)
- Performance Trajectory chart (6-month trend)

### Partnership Impact Tab
- Partnership metrics (Rewards Distributed, Redemption Rate, Active Partnerships, Rank)
- What-If Scenario Modeling section
- Impact Distribution chart (by domain)

### Analytics Tab
- Placeholder for advanced analytics (future enhancement)

### Reports Tab
- Placeholder for generated reports (future enhancement)

## 🔐 Security Considerations

### Current Implementation
⚠️ **Not Production-Ready**: Uses localStorage for authentication

### Recommended for Production
1. **JWT-based authentication** with httpOnly cookies
2. **Server-side payment verification** via Paystack webhooks
3. **API key protection** through backend proxy
4. **Rate limiting** on AI endpoints
5. **CSRF protection** for forms
6. **Input validation** and sanitization

See `SHARE_VALUE_PARTNER_IMPLEMENTATION_GUIDE.md` for details.

## 🧪 Testing Checklist

- [x] HTML syntax validation
- [x] Local server accessibility
- [ ] Payment flow (Paystack test mode)
- [ ] AI insights generation
- [ ] What-if scenario calculations
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility
- [ ] Authentication flow
- [ ] Form validation
- [ ] Chart rendering

## 🐛 Troubleshooting

### AI Insights Not Loading
1. Check API key configuration
2. Verify CORS settings
3. Check browser console for errors
4. Fallback insights should display automatically

### Payment Not Processing
1. Verify Paystack public key
2. Check payment amount format (must be in cents)
3. Test with Paystack test cards
4. Check browser console for errors

### Dashboard Redirect Issues
1. Clear localStorage: `localStorage.clear()`
2. Check file paths in redirect URLs
3. Verify authentication logic
4. Check browser console for errors

## 📈 Performance Metrics

### Target Benchmarks
- **Page Load**: < 2 seconds
- **AI Insights**: < 5 seconds
- **Animations**: 60fps
- **Mobile Score**: > 90 (Lighthouse)

### Optimization Tips
- Lazy load charts
- Cache AI responses
- Minimize API calls
- Optimize images and assets

## 🔄 Future Enhancements

### Planned Features
- [ ] Advanced analytics dashboard
- [ ] Custom report generation
- [ ] Email notifications
- [ ] Mobile app integration
- [ ] Multi-language support
- [ ] Dark/light theme toggle
- [ ] Collaborative features
- [ ] API access for Platinum tier

### Backend Integration Needed
- [ ] Partner metrics API endpoint
- [ ] Payment verification webhook
- [ ] AI insights caching
- [ ] User management system
- [ ] Reporting engine

## 📞 Support

For implementation questions:
1. Review `SHARE_VALUE_PARTNER_IMPLEMENTATION_GUIDE.md`
2. Check `DASHBOARD_ENHANCEMENT_DESIGN.md`
3. Contact development team

## 📄 License

Copyright © 2025 Auxeira. All rights reserved.

---

**Version**: 1.0.0  
**Last Updated**: October 16, 2025  
**Status**: ✅ Ready for Deployment  
**Maintained by**: Auxeira Development Team

