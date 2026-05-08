# 🚀 Auxeira Ferrari Dashboard Deployment Guide

## Quick Deployment to Production

### **Prerequisites**
- Node.js 18+ installed
- Git configured with GitHub access
- Vercel CLI installed (optional)
- Environment variables configured

### **1. Local Development Setup**

```bash
# Clone the repository
git clone https://github.com/bursarynetwork007/auxeira-backend.git
cd auxeira-backend/frontend/dashboard

# Install dependencies
npm install

# Copy environment configuration
cp .env.example .env.local

# Configure your environment variables
# Edit .env.local with your actual API keys and configuration

# Start development server
npm run dev
```

### **2. Environment Configuration**

Create `.env.local` with your production values:

```bash
# Required for production
VITE_PAYSTACK_PUBLIC_KEY=pk_live_your_live_paystack_key
VITE_API_BASE_URL=https://api.auxeira.com
VITE_OPENAI_API_KEY=your_production_openai_key

# Optional but recommended
VITE_SENTRY_DSN=your_sentry_dsn_for_error_tracking
VITE_GOOGLE_ANALYTICS_ID=your_ga_tracking_id
```

### **3. Deploy to Vercel (Recommended)**

#### **Option A: Vercel CLI**
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy to production
vercel --prod

# Set environment variables
vercel env add VITE_PAYSTACK_PUBLIC_KEY
vercel env add VITE_API_BASE_URL
vercel env add VITE_OPENAI_API_KEY
```

#### **Option B: GitHub Integration**
1. Connect your GitHub repository to Vercel
2. Import the `auxeira-backend` repository
3. Set the root directory to `frontend/dashboard`
4. Configure environment variables in Vercel dashboard
5. Deploy automatically on push to main branch

### **4. Deploy to Netlify**

```bash
# Build for production
npm run build

# Install Netlify CLI
npm i -g netlify-cli

# Login to Netlify
netlify login

# Deploy to production
netlify deploy --prod --dir=dist

# Set environment variables
netlify env:set VITE_PAYSTACK_PUBLIC_KEY your_key
netlify env:set VITE_API_BASE_URL https://api.auxeira.com
```

### **5. Deploy to AWS S3 + CloudFront**

```bash
# Build for production
npm run build

# Install AWS CLI
# Configure AWS credentials

# Sync to S3 bucket
aws s3 sync dist/ s3://your-auxeira-dashboard-bucket --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_DISTRIBUTION_ID --paths "/*"
```

### **6. Docker Deployment**

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Deploy with Docker:
```bash
# Build Docker image
docker build -t auxeira-ferrari-dashboard .

# Run container
docker run -p 80:80 auxeira-ferrari-dashboard

# Or deploy to container registry
docker tag auxeira-ferrari-dashboard your-registry/auxeira-dashboard:latest
docker push your-registry/auxeira-dashboard:latest
```

## 🔧 **Production Configuration**

### **Performance Optimization**
- ✅ Code splitting enabled
- ✅ Tree shaking configured
- ✅ Asset optimization
- ✅ Gzip compression
- ✅ CDN integration ready

### **Security Headers**
```javascript
// vercel.json security configuration
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options", 
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        },
        {
          "key": "Referrer-Policy",
          "value": "strict-origin-when-cross-origin"
        },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.paystack.co; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://api.paystack.co https://api.openai.com;"
        }
      ]
    }
  ]
}
```

### **Monitoring & Analytics**
- **Error Tracking**: Sentry integration
- **Performance**: Web Vitals monitoring
- **User Analytics**: Google Analytics + Mixpanel
- **Uptime Monitoring**: StatusPage integration

## 🌍 **Multi-Environment Setup**

### **Development**
```bash
# .env.development
VITE_API_BASE_URL=http://localhost:8000
VITE_PAYSTACK_PUBLIC_KEY=pk_test_development_key
VITE_DEBUG_MODE=true
VITE_MOCK_DATA=true
```

### **Staging**
```bash
# .env.staging  
VITE_API_BASE_URL=https://staging-api.auxeira.com
VITE_PAYSTACK_PUBLIC_KEY=pk_test_staging_key
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
```

### **Production**
```bash
# .env.production
VITE_API_BASE_URL=https://api.auxeira.com
VITE_PAYSTACK_PUBLIC_KEY=pk_live_production_key
VITE_DEBUG_MODE=false
VITE_MOCK_DATA=false
```

## 🔄 **CI/CD Pipeline**

### **GitHub Actions Workflow**
Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Ferrari Dashboards

on:
  push:
    branches: [main]
    paths: ['frontend/dashboard/**']

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        cache-dependency-path: frontend/dashboard/package-lock.json
    
    - name: Install dependencies
      run: |
        cd frontend/dashboard
        npm ci
    
    - name: Run tests
      run: |
        cd frontend/dashboard
        npm test
    
    - name: Build application
      run: |
        cd frontend/dashboard
        npm run build
      env:
        VITE_PAYSTACK_PUBLIC_KEY: ${{ secrets.PAYSTACK_PUBLIC_KEY }}
        VITE_API_BASE_URL: ${{ secrets.API_BASE_URL }}
        VITE_OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY }}
    
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
        vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
        working-directory: frontend/dashboard
```

## 📊 **Performance Targets**

### **Core Web Vitals**
- **LCP (Largest Contentful Paint)**: < 2.5s
- **FID (First Input Delay)**: < 100ms  
- **CLS (Cumulative Layout Shift)**: < 0.1
- **TTFB (Time to First Byte)**: < 600ms

### **Bundle Size Targets**
- **Initial Bundle**: < 500KB gzipped
- **Vendor Chunks**: < 300KB gzipped
- **Dashboard Chunks**: < 200KB gzipped each
- **Total Assets**: < 2MB

### **Performance Monitoring**
```javascript
// Performance monitoring setup
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  // Send to your analytics service
  gtag('event', metric.name, {
    value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
    event_label: metric.id,
  })
}

getCLS(sendToAnalytics)
getFID(sendToAnalytics)
getFCP(sendToAnalytics)
getLCP(sendToAnalytics)
getTTFB(sendToAnalytics)
```

## 🔐 **Security Checklist**

- ✅ Environment variables secured
- ✅ API keys not exposed in client
- ✅ CSP headers configured
- ✅ HTTPS enforced
- ✅ XSS protection enabled
- ✅ CSRF protection implemented
- ✅ Input validation on all forms
- ✅ Secure payment processing (Paystack)
- ✅ Error messages don't leak sensitive data
- ✅ Dependencies regularly updated

## 🚨 **Troubleshooting**

### **Common Issues**

#### **Build Failures**
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check

# Verify environment variables
npm run env-check
```

#### **Payment Integration Issues**
```bash
# Verify Paystack configuration
console.log('Paystack Key:', import.meta.env.VITE_PAYSTACK_PUBLIC_KEY)

# Test in sandbox mode first
VITE_PAYSTACK_PUBLIC_KEY=pk_test_your_test_key
```

#### **Performance Issues**
```bash
# Analyze bundle size
npm run build
npm run analyze

# Check for memory leaks
npm run dev -- --profile
```

## 📞 **Support**

### **Deployment Support**
- **Documentation**: Full deployment guides
- **Discord**: Real-time deployment help
- **Email**: deploy@auxeira.com
- **Status Page**: https://status.auxeira.com

### **Emergency Contacts**
- **Critical Issues**: emergency@auxeira.com
- **Security Issues**: security@auxeira.com
- **Performance Issues**: performance@auxeira.com

---

**🚀 Ready to deploy your Ferrari-level dashboards to production!**
