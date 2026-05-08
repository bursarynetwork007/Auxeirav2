// Auxeira Bloomberg-Inspired Website JavaScript
// Enhanced with intelligent multi-step sign-up flows

// Global state management
const AuxeiraApp = {
    currentModal: null,
    currentStep: 1,
    maxSteps: 4,
    userType: null,
    formData: {},
    
    // Initialize the application
    init() {
        this.bindEvents();
        this.initAnimations();
        this.initMobileMenu();
    },
    
    // Bind event listeners
    bindEvents() {
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            const modal = document.getElementById('authModal');
            if (e.target === modal) {
                this.closeAuthModal();
            }
        });
        
        // Handle escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentModal) {
                this.closeAuthModal();
            }
        });
        
        // Handle form submissions
        document.addEventListener('submit', function(e) {
            if (e.target.classList.contains('auth-form')) {
                e.preventDefault();
                AuxeiraApp.handleFormSubmit(e.target);
            }
        });
        
        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    },
    
    // Initialize animations
    initAnimations() {
        // Intersection Observer for scroll animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-in-up');
                }
            });
        }, observerOptions);
        
        // Observe elements for animation
        document.querySelectorAll('.stat-card, .value-prop-card, .pricing-card, .feature-item').forEach(el => {
            observer.observe(el);
        });
    },
    
    // Initialize mobile menu
    initMobileMenu() {
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const mobileMenu = document.querySelector('.mobile-menu');
        
        if (mobileMenuBtn && mobileMenu) {
            mobileMenuBtn.addEventListener('click', () => {
                mobileMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }
    },

    // Handle form submission
    handleFormSubmit(form) {
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        // Determine endpoint based on form type
        let endpoint = "/api/auth/register";
        if (form.querySelector("input[name=\"action\"]")?.value === "login") {
            endpoint = "/api/auth/login";
        }
        
        // Submit to backend API
        fetch(API_CONFIG.BASE_URL + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.success) {
                console.log("Authentication successful:", result);
                // Store tokens and close modal
                if (result.data?.access_token) {
                    localStorage.setItem("access_token", result.data.access_token);
                }
                this.closeAuthModal();
            } else {
                console.error("Authentication failed:", result.message);
                alert("Authentication failed: " + result.message);
            }
        })
        .catch(error => {
            console.error("Form submission error:", error);
            alert("Network error. Please try again.");
        });
    },
};

// Authentication Modal Functions
function openAuthModal(type = 'signup') {
    const modal = document.getElementById('authModal');
    const content = document.getElementById('authContent');
    
    AuxeiraApp.currentModal = type;
    AuxeiraApp.currentStep = 1;
    AuxeiraApp.userType = type === 'startup' || type === 'investor' ? type : null;
    AuxeiraApp.formData = {};
    
    if (type === 'login') {
        content.innerHTML = generateLoginForm();
    } else if (type === 'startup') {
        content.innerHTML = generateStartupSignupForm();
    } else if (type === 'investor') {
        content.innerHTML = generateInvestorSignupForm();
    } else {
        content.innerHTML = generateUserTypeSelection();
    }
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus first input
    setTimeout(() => {
        const firstInput = content.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }, 100);
}

function closeAuthModal() {
    const modal = document.getElementById('authModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    
    AuxeiraApp.currentModal = null;
    AuxeiraApp.currentStep = 1;
    AuxeiraApp.userType = null;
    AuxeiraApp.formData = {};
}

function toggleMobileMenu() {
    const mobileMenu = document.getElementById('mobileMenu');
    mobileMenu.classList.toggle('active');
}

// Form Generation Functions
function generateUserTypeSelection() {
    return `
        <div class="auth-header">
            <h2>Join Auxeira</h2>
            <p>Choose your path to transform entrepreneurship</p>
        </div>
        <div class="user-type-selection">
            <div class="user-type-card" onclick="openAuthModal('startup')">
                <div class="user-type-icon">🚀</div>
                <h3>I'm a Startup Founder</h3>
                <p>Build real business value and unlock $50K-$500K+ in benefits</p>
                <div class="user-type-benefits">
                    <span>✓ Free SSE score tracking</span>
                    <span>✓ Partner marketplace access</span>
                    <span>✓ Investor introductions</span>
                </div>
            </div>
            <div class="user-type-card" onclick="openAuthModal('investor')">
                <div class="user-type-icon">📊</div>
                <h3>I'm an Investor</h3>
                <p>Enhance portfolio performance with 85.7% prediction accuracy</p>
                <div class="user-type-benefits">
                    <span>✓ Real-time portfolio monitoring</span>
                    <span>✓ 15% reduction in write-offs</span>
                    <span>✓ ESG compliance tracking</span>
                </div>
            </div>
        </div>
        <div class="auth-footer">
            <p>Already have an account? <a href="#" onclick="openAuthModal('login')">Sign in</a></p>
        </div>
    `;
}

function generateLoginForm() {
    // Load CAPTCHA when generating login form
    loadCaptcha();
    
    return `
        <div class="auth-header">
            <h2>Welcome Back</h2>
            <p>Access your Auxeira dashboard</p>
        </div>
        <form class="auth-form" onsubmit="handleLogin(event)">
            <div class="form-group">
                <label for="email">Email Address</label>
                <input type="email" id="email" name="email" required 
                       placeholder="founder@startup.com" autocomplete="email">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" id="password" name="password" required 
                       placeholder="Enter your password" autocomplete="current-password">
            </div>
            ${generateCaptchaHTML()}
            <div class="form-options">
                <label class="checkbox-label">
                    <input type="checkbox" name="remember"> Remember me
                </label>
                <a href="#" class="forgot-password">Forgot password?</a>
            </div>
            <button type="submit" class="btn btn-primary btn-full">
                Sign In
                <span class="arrow">→</span>
            </button>
        </form>
        <div class="auth-footer">
            <p>Don't have an account? <a href="#" onclick="openAuthModal('signup')">Sign up</a></p>
        </div>
    `;
}

function generateStartupSignupForm() {
    const step = AuxeiraApp.currentStep;
    
    if (step === 1) {
        return generateStartupStep1();
    } else if (step === 2) {
        return generateStartupStep2();
    } else if (step === 3) {
        return generateStartupStep3();
    } else if (step === 4) {
        return generateStartupStep4();
    }
}

function generateStartupStep1() {
    return `
        <div class="auth-header">
            <h2>Join the Founding 500</h2>
            <p>Be among the first 500 startups to shape the future of entrepreneurship</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step active">1</div>
                    <div class="step">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 25%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Basic Information</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 1)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="founderName">Founder Name *</label>
                        <input type="text" id="founderName" name="founderName" required 
                               placeholder="Your full name" value="${AuxeiraApp.formData.founderName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required 
                               placeholder="founder@startup.com" value="${AuxeiraApp.formData.email || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="companyName">Company Name *</label>
                        <input type="text" id="companyName" name="companyName" required 
                               placeholder="Your startup name" value="${AuxeiraApp.formData.companyName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="phoneNumber">Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" 
                               placeholder="+1 (555) 123-4567" value="${AuxeiraApp.formData.phoneNumber || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="country">Country/Region *</label>
                        <select id="country" name="country" required>
                            <option value="">Select your country</option>
                            <option value="US" ${AuxeiraApp.formData.country === 'US' ? 'selected' : ''}>United States</option>
                            <option value="UK" ${AuxeiraApp.formData.country === 'UK' ? 'selected' : ''}>United Kingdom</option>
                            <option value="DE" ${AuxeiraApp.formData.country === 'DE' ? 'selected' : ''}>Germany</option>
                            <option value="FR" ${AuxeiraApp.formData.country === 'FR' ? 'selected' : ''}>France</option>
                            <option value="ZA" ${AuxeiraApp.formData.country === 'ZA' ? 'selected' : ''}>South Africa</option>
                            <option value="NG" ${AuxeiraApp.formData.country === 'NG' ? 'selected' : ''}>Nigeria</option>
                            <option value="KE" ${AuxeiraApp.formData.country === 'KE' ? 'selected' : ''}>Kenya</option>
                            <option value="SG" ${AuxeiraApp.formData.country === 'SG' ? 'selected' : ''}>Singapore</option>
                            <option value="IN" ${AuxeiraApp.formData.country === 'IN' ? 'selected' : ''}>India</option>
                            <option value="OTHER" ${AuxeiraApp.formData.country === 'OTHER' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="fundingStage">Funding Stage *</label>
                        <select id="fundingStage" name="fundingStage" required>
                            <option value="">Select funding stage</option>
                            <option value="idea" ${AuxeiraApp.formData.fundingStage === 'idea' ? 'selected' : ''}>Idea Stage</option>
                            <option value="pre-seed" ${AuxeiraApp.formData.fundingStage === 'pre-seed' ? 'selected' : ''}>Pre-Seed</option>
                            <option value="seed" ${AuxeiraApp.formData.fundingStage === 'seed' ? 'selected' : ''}>Seed</option>
                            <option value="pre-series-a" ${AuxeiraApp.formData.fundingStage === 'pre-series-a' ? 'selected' : ''}>Pre-Series A</option>
                            <option value="series-a" ${AuxeiraApp.formData.fundingStage === 'series-a' ? 'selected' : ''}>Series A</option>
                            <option value="series-b+" ${AuxeiraApp.formData.fundingStage === 'series-b+' ? 'selected' : ''}>Series B+</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label for="companyDescription">Company Description *</label>
                    <textarea id="companyDescription" name="companyDescription" required rows="3"
                              placeholder="Briefly describe what your startup does, the problem you're solving, and your target market...">${AuxeiraApp.formData.companyDescription || ''}</textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-full">
                        Next: Business Metrics
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateStartupStep2() {
    return `
        <div class="auth-header">
            <h2>Startup Health Assessment</h2>
            <p>Help us understand your current business metrics for personalized insights</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step active">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 50%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Business Metrics</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 2)">
                <div class="metric-section">
                    <h4>Market Access</h4>
                    <div class="form-group">
                        <label>Do you have paying customers? *</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="payingCustomers" value="yes" ${AuxeiraApp.formData.payingCustomers === 'yes' ? 'checked' : ''}>
                                <span>Yes</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="payingCustomers" value="no" ${AuxeiraApp.formData.payingCustomers === 'no' ? 'checked' : ''}>
                                <span>No</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="payingCustomers" value="pilot" ${AuxeiraApp.formData.payingCustomers === 'pilot' ? 'checked' : ''}>
                                <span>Pilot customers</span>
                            </label>
                        </div>
                    </div>
                    <div class="form-group">
                        <label for="monthlyRevenue">Monthly Revenue (USD)</label>
                        <select id="monthlyRevenue" name="monthlyRevenue">
                            <option value="">Select range</option>
                            <option value="0" ${AuxeiraApp.formData.monthlyRevenue === '0' ? 'selected' : ''}>$0</option>
                            <option value="1-1000" ${AuxeiraApp.formData.monthlyRevenue === '1-1000' ? 'selected' : ''}>$1 - $1,000</option>
                            <option value="1000-5000" ${AuxeiraApp.formData.monthlyRevenue === '1000-5000' ? 'selected' : ''}>$1,000 - $5,000</option>
                            <option value="5000-25000" ${AuxeiraApp.formData.monthlyRevenue === '5000-25000' ? 'selected' : ''}>$5,000 - $25,000</option>
                            <option value="25000-100000" ${AuxeiraApp.formData.monthlyRevenue === '25000-100000' ? 'selected' : ''}>$25,000 - $100,000</option>
                            <option value="100000+" ${AuxeiraApp.formData.monthlyRevenue === '100000+' ? 'selected' : ''}>$100,000+</option>
                        </select>
                    </div>
                </div>
                
                <div class="metric-section">
                    <h4>Management</h4>
                    <div class="form-group">
                        <label for="teamSize">Team Size *</label>
                        <select id="teamSize" name="teamSize" required>
                            <option value="">Select team size</option>
                            <option value="1" ${AuxeiraApp.formData.teamSize === '1' ? 'selected' : ''}>Just me (1)</option>
                            <option value="2-5" ${AuxeiraApp.formData.teamSize === '2-5' ? 'selected' : ''}>2-5 people</option>
                            <option value="6-15" ${AuxeiraApp.formData.teamSize === '6-15' ? 'selected' : ''}>6-15 people</option>
                            <option value="16-50" ${AuxeiraApp.formData.teamSize === '16-50' ? 'selected' : ''}>16-50 people</option>
                            <option value="50+" ${AuxeiraApp.formData.teamSize === '50+' ? 'selected' : ''}>50+ people</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label>Do you have a co-founder? *</label>
                        <div class="radio-group">
                            <label class="radio-label">
                                <input type="radio" name="hasCofounder" value="yes" ${AuxeiraApp.formData.hasCofounder === 'yes' ? 'checked' : ''}>
                                <span>Yes</span>
                            </label>
                            <label class="radio-label">
                                <input type="radio" name="hasCofounder" value="no" ${AuxeiraApp.formData.hasCofounder === 'no' ? 'checked' : ''}>
                                <span>No</span>
                            </label>
                        </div>
                    </div>
                </div>
                
                <div class="metric-section">
                    <h4>Funding</h4>
                    <div class="form-group">
                        <label for="totalFunding">Total Funding Raised (USD)</label>
                        <select id="totalFunding" name="totalFunding">
                            <option value="">Select range</option>
                            <option value="0" ${AuxeiraApp.formData.totalFunding === '0' ? 'selected' : ''}>$0 (Bootstrapped)</option>
                            <option value="1-10000" ${AuxeiraApp.formData.totalFunding === '1-10000' ? 'selected' : ''}>$1 - $10,000</option>
                            <option value="10000-100000" ${AuxeiraApp.formData.totalFunding === '10000-100000' ? 'selected' : ''}>$10,000 - $100,000</option>
                            <option value="100000-500000" ${AuxeiraApp.formData.totalFunding === '100000-500000' ? 'selected' : ''}>$100,000 - $500,000</option>
                            <option value="500000-5000000" ${AuxeiraApp.formData.totalFunding === '500000-5000000' ? 'selected' : ''}>$500,000 - $5M</option>
                            <option value="5000000+" ${AuxeiraApp.formData.totalFunding === '5000000+' ? 'selected' : ''}>$5M+</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="currentRunway">Current Runway (months)</label>
                        <select id="currentRunway" name="currentRunway">
                            <option value="">Select runway</option>
                            <option value="0-3" ${AuxeiraApp.formData.currentRunway === '0-3' ? 'selected' : ''}>0-3 months</option>
                            <option value="3-6" ${AuxeiraApp.formData.currentRunway === '3-6' ? 'selected' : ''}>3-6 months</option>
                            <option value="6-12" ${AuxeiraApp.formData.currentRunway === '6-12' ? 'selected' : ''}>6-12 months</option>
                            <option value="12-24" ${AuxeiraApp.formData.currentRunway === '12-24' ? 'selected' : ''}>12-24 months</option>
                            <option value="24+" ${AuxeiraApp.formData.currentRunway === '24+' ? 'selected' : ''}>24+ months</option>
                            <option value="profitable" ${AuxeiraApp.formData.currentRunway === 'profitable' ? 'selected' : ''}>Profitable</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Next: Goals & Commitment
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateStartupStep3() {
    return `
        <div class="auth-header">
            <h2>Goals & Commitment</h2>
            <p>Tell us about your goals and commitment to help us provide the best experience</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step active">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 75%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Your Goals & Preferences</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 3)">
                <div class="form-group">
                    <label>What are your primary goals for joining Auxeira? *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="improve-metrics" ${AuxeiraApp.formData.goals?.includes('improve-metrics') ? 'checked' : ''}>
                            <span>Improve business health metrics</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="funding-access" ${AuxeiraApp.formData.goals?.includes('funding-access') ? 'checked' : ''}>
                            <span>Access to funding opportunities</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="benchmarking" ${AuxeiraApp.formData.goals?.includes('benchmarking') ? 'checked' : ''}>
                            <span>Benchmark against industry standards</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="rewards" ${AuxeiraApp.formData.goals?.includes('rewards') ? 'checked' : ''}>
                            <span>Earn rewards and recognition</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="networking" ${AuxeiraApp.formData.goals?.includes('networking') ? 'checked' : ''}>
                            <span>Connect with other entrepreneurs</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="goals" value="partner-benefits" ${AuxeiraApp.formData.goals?.includes('partner-benefits') ? 'checked' : ''}>
                            <span>Access partner benefits and discounts</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>Are you committed to providing monthly progress updates? *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="monthlyUpdates" value="yes" ${AuxeiraApp.formData.monthlyUpdates === 'yes' ? 'checked' : ''}>
                            <span>Yes, I commit to monthly updates</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="monthlyUpdates" value="no" ${AuxeiraApp.formData.monthlyUpdates === 'no' ? 'checked' : ''}>
                            <span>No, I cannot commit to this</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="referralSource">How did you hear about Auxeira?</label>
                    <select id="referralSource" name="referralSource">
                        <option value="">Select source</option>
                        <option value="google" ${AuxeiraApp.formData.referralSource === 'google' ? 'selected' : ''}>Google Search</option>
                        <option value="social-media" ${AuxeiraApp.formData.referralSource === 'social-media' ? 'selected' : ''}>Social Media</option>
                        <option value="friend-referral" ${AuxeiraApp.formData.referralSource === 'friend-referral' ? 'selected' : ''}>Friend/Colleague Referral</option>
                        <option value="investor" ${AuxeiraApp.formData.referralSource === 'investor' ? 'selected' : ''}>Investor Recommendation</option>
                        <option value="accelerator" ${AuxeiraApp.formData.referralSource === 'accelerator' ? 'selected' : ''}>Accelerator/Incubator</option>
                        <option value="conference" ${AuxeiraApp.formData.referralSource === 'conference' ? 'selected' : ''}>Conference/Event</option>
                        <option value="press" ${AuxeiraApp.formData.referralSource === 'press' ? 'selected' : ''}>Press/Media</option>
                        <option value="other" ${AuxeiraApp.formData.referralSource === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="additionalComments">Additional Comments</label>
                    <textarea id="additionalComments" name="additionalComments" rows="3"
                              placeholder="Any specific challenges you're facing or additional information you'd like to share...">${AuxeiraApp.formData.additionalComments || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Next: Account Setup
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateStartupStep4() {
    return `
        <div class="auth-header">
            <h2>Account Setup</h2>
            <p>Create your secure account and complete your registration</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step active">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 100%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Secure Your Account</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 4)">
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="Create a strong password" minlength="8">
                    <div class="password-requirements">
                        <small>Password must be at least 8 characters long</small>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password *</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required 
                           placeholder="Confirm your password">
                </div>
                
                <div class="form-group">
                    <label for="preferredTier">Recommended Tier Based on Your Metrics</label>
                    <div class="tier-recommendation">
                        <div class="recommended-tier">
                            <div class="tier-badge">${getRecommendedTier()}</div>
                            <div class="tier-details">
                                <h4>${getTierName()}</h4>
                                <p>${getTierDescription()}</p>
                                <div class="tier-price">${getTierPrice()}</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label agreement">
                        <input type="checkbox" name="agreeTerms" required>
                        <span>I agree to Auxeira's <a href="terms.html" target="_blank">Terms of Service</a> and <a href="privacy.html" target="_blank">Privacy Policy</a>. I understand that participation in the pilot program is free and that I can withdraw at any time. *</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="marketingEmails">
                        <span>I'd like to receive updates about new features, partner benefits, and industry insights</span>
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary btn-full">
                        Complete Registration
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateInvestorSignupForm() {
    const step = AuxeiraApp.currentStep;
    
    if (step === 1) {
        return generateInvestorStep1();
    } else if (step === 2) {
        return generateInvestorStep2();
    } else if (step === 3) {
        return generateInvestorStep3();
    } else if (step === 4) {
        return generateInvestorStep4();
    }
}

function generateInvestorStep1() {
    return `
        <div class="auth-header">
            <h2>Enhance Portfolio Performance</h2>
            <p>Join leading investors using Auxeira for 20-35% portfolio IRR improvement</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step active">1</div>
                    <div class="step">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 25%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Professional Information</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 1)">
                <div class="form-row">
                    <div class="form-group">
                        <label for="fullName">Full Name *</label>
                        <input type="text" id="fullName" name="fullName" required 
                               placeholder="Your full name" value="${AuxeiraApp.formData.fullName || ''}">
                    </div>
                    <div class="form-group">
                        <label for="email">Email Address *</label>
                        <input type="email" id="email" name="email" required 
                               placeholder="investor@fund.com" value="${AuxeiraApp.formData.email || ''}">
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="jobTitle">Job Title *</label>
                        <input type="text" id="jobTitle" name="jobTitle" required 
                               placeholder="e.g., Partner, Principal, Associate" value="${AuxeiraApp.formData.jobTitle || ''}">
                    </div>
                    <div class="form-group">
                        <label for="phoneNumber">Phone Number</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" 
                               placeholder="+1 (555) 123-4567" value="${AuxeiraApp.formData.phoneNumber || ''}">
                    </div>
                </div>
                <div class="form-group">
                    <label for="organization">Organization/Fund Name *</label>
                    <input type="text" id="organization" name="organization" required 
                           placeholder="Your investment firm or fund name" value="${AuxeiraApp.formData.organization || ''}">
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="investorType">Investor Type *</label>
                        <select id="investorType" name="investorType" required>
                            <option value="">Select investor type</option>
                            <option value="vc" ${AuxeiraApp.formData.investorType === 'vc' ? 'selected' : ''}>Venture Capital</option>
                            <option value="pe" ${AuxeiraApp.formData.investorType === 'pe' ? 'selected' : ''}>Private Equity</option>
                            <option value="angel" ${AuxeiraApp.formData.investorType === 'angel' ? 'selected' : ''}>Angel Investor</option>
                            <option value="family-office" ${AuxeiraApp.formData.investorType === 'family-office' ? 'selected' : ''}>Family Office</option>
                            <option value="corporate-vc" ${AuxeiraApp.formData.investorType === 'corporate-vc' ? 'selected' : ''}>Corporate VC</option>
                            <option value="accelerator" ${AuxeiraApp.formData.investorType === 'accelerator' ? 'selected' : ''}>Accelerator/Incubator</option>
                            <option value="government" ${AuxeiraApp.formData.investorType === 'government' ? 'selected' : ''}>Government/DFI</option>
                            <option value="other" ${AuxeiraApp.formData.investorType === 'other' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="country">Country/Region *</label>
                        <select id="country" name="country" required>
                            <option value="">Select your country</option>
                            <option value="US" ${AuxeiraApp.formData.country === 'US' ? 'selected' : ''}>United States</option>
                            <option value="UK" ${AuxeiraApp.formData.country === 'UK' ? 'selected' : ''}>United Kingdom</option>
                            <option value="DE" ${AuxeiraApp.formData.country === 'DE' ? 'selected' : ''}>Germany</option>
                            <option value="FR" ${AuxeiraApp.formData.country === 'FR' ? 'selected' : ''}>France</option>
                            <option value="ZA" ${AuxeiraApp.formData.country === 'ZA' ? 'selected' : ''}>South Africa</option>
                            <option value="NG" ${AuxeiraApp.formData.country === 'NG' ? 'selected' : ''}>Nigeria</option>
                            <option value="KE" ${AuxeiraApp.formData.country === 'KE' ? 'selected' : ''}>Kenya</option>
                            <option value="SG" ${AuxeiraApp.formData.country === 'SG' ? 'selected' : ''}>Singapore</option>
                            <option value="IN" ${AuxeiraApp.formData.country === 'IN' ? 'selected' : ''}>India</option>
                            <option value="OTHER" ${AuxeiraApp.formData.country === 'OTHER' ? 'selected' : ''}>Other</option>
                        </select>
                    </div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary btn-full">
                        Next: Investment Profile
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateInvestorStep2() {
    return `
        <div class="auth-header">
            <h2>Investment Profile</h2>
            <p>Help us understand your investment focus and portfolio</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step active">2</div>
                    <div class="step">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 50%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Investment Details</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 2)">
                <div class="form-group">
                    <label for="fundSize">Fund Size (AUM) *</label>
                    <select id="fundSize" name="fundSize" required>
                        <option value="">Select fund size</option>
                        <option value="under-10m" ${AuxeiraApp.formData.fundSize === 'under-10m' ? 'selected' : ''}>Under $10M</option>
                        <option value="10m-50m" ${AuxeiraApp.formData.fundSize === '10m-50m' ? 'selected' : ''}>$10M - $50M</option>
                        <option value="50m-100m" ${AuxeiraApp.formData.fundSize === '50m-100m' ? 'selected' : ''}>$50M - $100M</option>
                        <option value="100m-500m" ${AuxeiraApp.formData.fundSize === '100m-500m' ? 'selected' : ''}>$100M - $500M</option>
                        <option value="500m-1b" ${AuxeiraApp.formData.fundSize === '500m-1b' ? 'selected' : ''}>$500M - $1B</option>
                        <option value="over-1b" ${AuxeiraApp.formData.fundSize === 'over-1b' ? 'selected' : ''}>Over $1B</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="investmentStage">Primary Investment Stage *</label>
                    <select id="investmentStage" name="investmentStage" required>
                        <option value="">Select investment stage</option>
                        <option value="pre-seed" ${AuxeiraApp.formData.investmentStage === 'pre-seed' ? 'selected' : ''}>Pre-Seed</option>
                        <option value="seed" ${AuxeiraApp.formData.investmentStage === 'seed' ? 'selected' : ''}>Seed</option>
                        <option value="series-a" ${AuxeiraApp.formData.investmentStage === 'series-a' ? 'selected' : ''}>Series A</option>
                        <option value="series-b" ${AuxeiraApp.formData.investmentStage === 'series-b' ? 'selected' : ''}>Series B</option>
                        <option value="growth" ${AuxeiraApp.formData.investmentStage === 'growth' ? 'selected' : ''}>Growth/Late Stage</option>
                        <option value="multi-stage" ${AuxeiraApp.formData.investmentStage === 'multi-stage' ? 'selected' : ''}>Multi-Stage</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label>Investment Focus Areas *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="fintech" ${AuxeiraApp.formData.focusAreas?.includes('fintech') ? 'checked' : ''}>
                            <span>FinTech</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="healthtech" ${AuxeiraApp.formData.focusAreas?.includes('healthtech') ? 'checked' : ''}>
                            <span>HealthTech</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="edtech" ${AuxeiraApp.formData.focusAreas?.includes('edtech') ? 'checked' : ''}>
                            <span>EdTech</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="enterprise-saas" ${AuxeiraApp.formData.focusAreas?.includes('enterprise-saas') ? 'checked' : ''}>
                            <span>Enterprise SaaS</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="consumer" ${AuxeiraApp.formData.focusAreas?.includes('consumer') ? 'checked' : ''}>
                            <span>Consumer</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="marketplace" ${AuxeiraApp.formData.focusAreas?.includes('marketplace') ? 'checked' : ''}>
                            <span>Marketplace</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="climate" ${AuxeiraApp.formData.focusAreas?.includes('climate') ? 'checked' : ''}>
                            <span>Climate Tech</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="ai-ml" ${AuxeiraApp.formData.focusAreas?.includes('ai-ml') ? 'checked' : ''}>
                            <span>AI/ML</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="focusAreas" value="other" ${AuxeiraApp.formData.focusAreas?.includes('other') ? 'checked' : ''}>
                            <span>Other</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="portfolioSize">Current Portfolio Size *</label>
                    <select id="portfolioSize" name="portfolioSize" required>
                        <option value="">Select portfolio size</option>
                        <option value="1-10" ${AuxeiraApp.formData.portfolioSize === '1-10' ? 'selected' : ''}>1-10 companies</option>
                        <option value="11-25" ${AuxeiraApp.formData.portfolioSize === '11-25' ? 'selected' : ''}>11-25 companies</option>
                        <option value="26-50" ${AuxeiraApp.formData.portfolioSize === '26-50' ? 'selected' : ''}>26-50 companies</option>
                        <option value="51-100" ${AuxeiraApp.formData.portfolioSize === '51-100' ? 'selected' : ''}>51-100 companies</option>
                        <option value="over-100" ${AuxeiraApp.formData.portfolioSize === 'over-100' ? 'selected' : ''}>Over 100 companies</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="geographicFocus">Geographic Focus *</label>
                    <select id="geographicFocus" name="geographicFocus" required>
                        <option value="">Select geographic focus</option>
                        <option value="north-america" ${AuxeiraApp.formData.geographicFocus === 'north-america' ? 'selected' : ''}>North America</option>
                        <option value="europe" ${AuxeiraApp.formData.geographicFocus === 'europe' ? 'selected' : ''}>Europe</option>
                        <option value="asia-pacific" ${AuxeiraApp.formData.geographicFocus === 'asia-pacific' ? 'selected' : ''}>Asia Pacific</option>
                        <option value="africa" ${AuxeiraApp.formData.geographicFocus === 'africa' ? 'selected' : ''}>Africa</option>
                        <option value="latin-america" ${AuxeiraApp.formData.geographicFocus === 'latin-america' ? 'selected' : ''}>Latin America</option>
                        <option value="global" ${AuxeiraApp.formData.geographicFocus === 'global' ? 'selected' : ''}>Global</option>
                    </select>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Next: Platform Interests
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateInvestorStep3() {
    return `
        <div class="auth-header">
            <h2>Platform Interests</h2>
            <p>Tell us about your specific interests and goals with Auxeira</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step active">3</div>
                    <div class="step">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 75%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Your Platform Goals</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 3)">
                <div class="form-group">
                    <label>What are your primary interests in Auxeira? *</label>
                    <div class="checkbox-group">
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="portfolio-monitoring" ${AuxeiraApp.formData.interests?.includes('portfolio-monitoring') ? 'checked' : ''}>
                            <span>Real-time portfolio monitoring</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="risk-assessment" ${AuxeiraApp.formData.interests?.includes('risk-assessment') ? 'checked' : ''}>
                            <span>Enhanced risk assessment</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="esg-compliance" ${AuxeiraApp.formData.interests?.includes('esg-compliance') ? 'checked' : ''}>
                            <span>ESG compliance tracking</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="deal-sourcing" ${AuxeiraApp.formData.interests?.includes('deal-sourcing') ? 'checked' : ''}>
                            <span>Deal sourcing and pipeline</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="lp-reporting" ${AuxeiraApp.formData.interests?.includes('lp-reporting') ? 'checked' : ''}>
                            <span>Automated LP reporting</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="benchmarking" ${AuxeiraApp.formData.interests?.includes('benchmarking') ? 'checked' : ''}>
                            <span>Industry benchmarking</span>
                        </label>
                        <label class="checkbox-label">
                            <input type="checkbox" name="interests" value="due-diligence" ${AuxeiraApp.formData.interests?.includes('due-diligence') ? 'checked' : ''}>
                            <span>Enhanced due diligence</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label>What is your current portfolio monitoring approach? *</label>
                    <div class="radio-group">
                        <label class="radio-label">
                            <input type="radio" name="currentApproach" value="manual" ${AuxeiraApp.formData.currentApproach === 'manual' ? 'checked' : ''}>
                            <span>Manual reporting and spreadsheets</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="currentApproach" value="basic-tools" ${AuxeiraApp.formData.currentApproach === 'basic-tools' ? 'checked' : ''}>
                            <span>Basic portfolio management tools</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="currentApproach" value="advanced-platform" ${AuxeiraApp.formData.currentApproach === 'advanced-platform' ? 'checked' : ''}>
                            <span>Advanced portfolio platform</span>
                        </label>
                        <label class="radio-label">
                            <input type="radio" name="currentApproach" value="custom-solution" ${AuxeiraApp.formData.currentApproach === 'custom-solution' ? 'checked' : ''}>
                            <span>Custom-built solution</span>
                        </label>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="reportingFrequency">How often do you currently receive portfolio updates? *</label>
                    <select id="reportingFrequency" name="reportingFrequency" required>
                        <option value="">Select frequency</option>
                        <option value="weekly" ${AuxeiraApp.formData.reportingFrequency === 'weekly' ? 'selected' : ''}>Weekly</option>
                        <option value="monthly" ${AuxeiraApp.formData.reportingFrequency === 'monthly' ? 'selected' : ''}>Monthly</option>
                        <option value="quarterly" ${AuxeiraApp.formData.reportingFrequency === 'quarterly' ? 'selected' : ''}>Quarterly</option>
                        <option value="ad-hoc" ${AuxeiraApp.formData.reportingFrequency === 'ad-hoc' ? 'selected' : ''}>Ad-hoc/As needed</option>
                        <option value="annual" ${AuxeiraApp.formData.reportingFrequency === 'annual' ? 'selected' : ''}>Annual only</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="referralSource">How did you hear about Auxeira?</label>
                    <select id="referralSource" name="referralSource">
                        <option value="">Select source</option>
                        <option value="portfolio-company" ${AuxeiraApp.formData.referralSource === 'portfolio-company' ? 'selected' : ''}>Portfolio Company</option>
                        <option value="peer-investor" ${AuxeiraApp.formData.referralSource === 'peer-investor' ? 'selected' : ''}>Peer Investor</option>
                        <option value="conference" ${AuxeiraApp.formData.referralSource === 'conference' ? 'selected' : ''}>Conference/Event</option>
                        <option value="press" ${AuxeiraApp.formData.referralSource === 'press' ? 'selected' : ''}>Press/Media</option>
                        <option value="linkedin" ${AuxeiraApp.formData.referralSource === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
                        <option value="google" ${AuxeiraApp.formData.referralSource === 'google' ? 'selected' : ''}>Google Search</option>
                        <option value="other" ${AuxeiraApp.formData.referralSource === 'other' ? 'selected' : ''}>Other</option>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="additionalComments">Additional Comments</label>
                    <textarea id="additionalComments" name="additionalComments" rows="3"
                              placeholder="Any specific requirements or questions about Auxeira's platform...">${AuxeiraApp.formData.additionalComments || ''}</textarea>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Next: Account Setup
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

function generateInvestorStep4() {
    return `
        <div class="auth-header">
            <h2>Account Setup</h2>
            <p>Create your secure account and complete your registration</p>
            <div class="progress-bar">
                <div class="progress-steps">
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step completed">✓</div>
                    <div class="step active">4</div>
                </div>
                <div class="progress-line">
                    <div class="progress-fill" style="width: 100%"></div>
                </div>
            </div>
        </div>
        <div class="step-content">
            <h3>Secure Your Account</h3>
            <form class="auth-form" onsubmit="handleStepSubmit(event, 4)">
                <div class="form-group">
                    <label for="password">Password *</label>
                    <input type="password" id="password" name="password" required 
                           placeholder="Create a strong password" minlength="8">
                    <div class="password-requirements">
                        <small>Password must be at least 8 characters long</small>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password *</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required 
                           placeholder="Confirm your password">
                </div>
                
                <div class="form-group">
                    <label for="preferredPlan">Recommended Plan</label>
                    <div class="plan-recommendation">
                        <div class="recommended-plan">
                            <div class="plan-badge">Recommended</div>
                            <div class="plan-details">
                                <h4>Portfolio Plan</h4>
                                <p>Perfect for your portfolio size and investment focus</p>
                                <div class="plan-price">$20/startup/month</div>
                                <div class="plan-features">
                                    <span>✓ Real-time monitoring</span>
                                    <span>✓ ESG compliance tracking</span>
                                    <span>✓ Automated reporting</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label agreement">
                        <input type="checkbox" name="agreeTerms" required>
                        <span>I agree to Auxeira's <a href="terms.html" target="_blank">Terms of Service</a> and <a href="privacy.html" target="_blank">Privacy Policy</a>. I understand the platform pricing and can cancel at any time. *</span>
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" name="marketingEmails">
                        <span>I'd like to receive updates about new features, market insights, and platform developments</span>
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-outline" onclick="previousStep()">
                        ← Previous
                    </button>
                    <button type="submit" class="btn btn-primary btn-full">
                        Complete Registration
                        <span class="arrow">→</span>
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Form Handling Functions
function handleStepSubmit(event, step) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        if (key === 'goals' || key === 'focusAreas' || key === 'interests') {
            // Handle checkbox arrays
            if (!AuxeiraApp.formData[key]) {
                AuxeiraApp.formData[key] = [];
            }
            AuxeiraApp.formData[key].push(value);
        } else {
            AuxeiraApp.formData[key] = value;
        }
    }
    
    // Handle checkbox arrays that weren't checked
    const checkboxGroups = ['goals', 'focusAreas', 'interests'];
    checkboxGroups.forEach(group => {
        const checkboxes = form.querySelectorAll(`input[name="${group}"]`);
        if (checkboxes.length > 0) {
            AuxeiraApp.formData[group] = [];
            checkboxes.forEach(checkbox => {
                if (checkbox.checked) {
                    AuxeiraApp.formData[group].push(checkbox.value);
                }
            });
        }
    });
    
    // Validate step
    if (!validateStep(step)) {
        return;
    }
    
    // Move to next step or complete registration
    if (step < AuxeiraApp.maxSteps) {
        nextStep();
    } else {
        completeRegistration();
    }
}

function validateStep(step) {
    // Add step-specific validation logic here
    if (step === 4) {
        const password = AuxeiraApp.formData.password;
        const confirmPassword = AuxeiraApp.formData.confirmPassword;
        
        if (password !== confirmPassword) {
            alert('Passwords do not match. Please try again.');
            return false;
        }
        
        if (password.length < 8) {
            alert('Password must be at least 8 characters long.');
            return false;
        }
    }
    
    return true;
}

function nextStep() {
    AuxeiraApp.currentStep++;
    const content = document.getElementById('authContent');
    
    if (AuxeiraApp.userType === 'startup') {
        content.innerHTML = generateStartupSignupForm();
    } else if (AuxeiraApp.userType === 'investor') {
        content.innerHTML = generateInvestorSignupForm();
    }
    
    // Focus first input
    setTimeout(() => {
        const firstInput = content.querySelector('input, select, textarea');
        if (firstInput) firstInput.focus();
    }, 100);
}

function previousStep() {
    if (AuxeiraApp.currentStep > 1) {
        AuxeiraApp.currentStep--;
        const content = document.getElementById('authContent');
        
        if (AuxeiraApp.userType === 'startup') {
            content.innerHTML = generateStartupSignupForm();
        } else if (AuxeiraApp.userType === 'investor') {
            content.innerHTML = generateInvestorSignupForm();
        }
        
        // Focus first input
        setTimeout(() => {
            const firstInput = content.querySelector('input, select, textarea');
            if (firstInput) firstInput.focus();
        }, 100);
    }
}

function completeRegistration() {
    // Show success message
    const content = document.getElementById('authContent');
    content.innerHTML = `
        <div class="registration-success">
            <div class="success-icon">✓</div>
            <h2>Welcome to Auxeira!</h2>
            <p>Your registration has been completed successfully.</p>
            <div class="success-details">
                <h3>What's Next?</h3>
                <div class="next-steps">
                    <div class="step-item">
                        <span class="step-number">1</span>
                        <span>Check your email for verification link</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">2</span>
                        <span>Complete your profile setup</span>
                    </div>
                    <div class="step-item">
                        <span class="step-number">3</span>
                        <span>Access your personalized dashboard</span>
                    </div>
                </div>
            </div>
            <button class="btn btn-primary btn-full" onclick="redirectToDashboard()">
                Access Dashboard
                <span class="arrow">→</span>
            </button>
        </div>
    `;
    
    // In a real application, you would send the data to your backend
    console.log('Registration data:', AuxeiraApp.formData);
}

function handleLogin(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const email = formData.get('email');
    const password = formData.get('password');
    
    // In a real application, you would authenticate with your backend
    console.log('Login attempt:', { email, password });
    
    // Simulate successful login
    setTimeout(() => {
        redirectToDashboard();
    }, 1000);
}

// API Configuration
const API_BASE_URL = API_CONFIG.BASE_URL;

// CAPTCHA Management
let currentCaptcha = null;

async function loadCaptcha() {
    try {
        const response = await makeAPIRequest('/api/captcha/generate');
        currentCaptcha = response;
        return response;
    } catch (error) {
        console.error('Failed to load CAPTCHA:', error);
        return null;
    }
}

async function verifyCaptcha(answer) {
    try {
        await makeAPIRequest('/api/captcha/verify', 'POST', { answer });
        return true;
    } catch (error) {
        console.error('CAPTCHA verification failed:', error);
        return false;
    }
}

function generateCaptchaHTML() {
    if (!currentCaptcha) {
        return `
            <div class="form-group captcha-group">
                <label>Security Verification</label>
                <div class="captcha-loading">Loading security challenge...</div>
                <button type="button" class="btn btn-outline btn-small" onclick="refreshCaptcha()">Refresh</button>
            </div>
        `;
    }
    
    return `
        <div class="form-group captcha-group">
            <label for="captcha">Security Verification *</label>
            <div class="captcha-challenge">
                <span class="captcha-question">What is ${currentCaptcha.question}?</span>
                <input type="number" id="captcha" name="captcha" required 
                       placeholder="Enter answer" autocomplete="off">
                <button type="button" class="btn btn-outline btn-small" onclick="refreshCaptcha()">Refresh</button>
            </div>
            <small class="captcha-help">Please solve this simple math problem to verify you're human</small>
        </div>
    `;
}

async function refreshCaptcha() {
    const captchaGroup = document.querySelector('.captcha-group');
    if (captchaGroup) {
        captchaGroup.innerHTML = `
            <label>Security Verification</label>
            <div class="captcha-loading">Loading new challenge...</div>
        `;
    }
    
    await loadCaptcha();
    
    if (captchaGroup) {
        captchaGroup.outerHTML = generateCaptchaHTML();
    }
}

// Authentication API Functions
async function makeAPIRequest(endpoint, method = 'GET', data = null, customHeaders = {}) {
    const config = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...customHeaders
        },
    };
    
    if (data) {
        config.body = JSON.stringify(data);
    }
    
    // Add token from localStorage if not already provided in custom headers
    if (!config.headers['Authorization']) {
        const token = localStorage.getItem('auxeira_token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.error || result.message || 'Request failed');
        }
        
        return result;
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

function showLoadingState(button) {
    const originalText = button.innerHTML;
    button.innerHTML = '<span>Loading...</span>';
    button.disabled = true;
    return originalText;
}

function hideLoadingState(button, originalText) {
    button.innerHTML = originalText;
    button.disabled = false;
}

function showError(message) {
    // Create error notification
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-notification';
    errorDiv.innerHTML = `
        <div class="error-content">
            <span class="error-icon">⚠️</span>
            <span class="error-message">${message}</span>
            <button class="error-close" onclick="this.parentElement.parentElement.remove()">×</button>
        </div>
    `;
    
    // Add error styles if not already added
    if (!document.querySelector('#error-styles')) {
        const errorStyles = document.createElement('style');
        errorStyles.id = 'error-styles';
        errorStyles.textContent = `
            .error-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: #ff4444;
                color: white;
                padding: 1rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                z-index: 10000;
                max-width: 400px;
                animation: slideIn 0.3s ease;
            }
            .error-content {
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }
            .error-close {
                background: none;
                border: none;
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                margin-left: auto;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(errorStyles);
    }
    
    document.body.appendChild(errorDiv);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentElement) {
            errorDiv.remove();
        }
    }, 5000);
}

function completeRegistration() {
    const submitButton = document.querySelector('.auth-form button[type="submit"]');
    if (!submitButton) return;
    
    const originalText = showLoadingState(submitButton);
    
    // Prepare registration data
    const registrationData = {
        email: AuxeiraApp.formData.email,
        password: AuxeiraApp.formData.password,
        first_name: AuxeiraApp.formData.founderName ? AuxeiraApp.formData.founderName.split(' ')[0] : '',
        last_name: AuxeiraApp.formData.founderName ? AuxeiraApp.formData.founderName.split(' ').slice(1).join(' ') || AuxeiraApp.formData.founderName.split(' ')[0] : '',
        company_name: AuxeiraApp.formData.companyName,
        phone_number: AuxeiraApp.formData.phoneNumber,
        country: AuxeiraApp.formData.country,
        funding_stage: AuxeiraApp.formData.fundingStage,
        company_description: AuxeiraApp.formData.companyDescription,
        user_type: AuxeiraApp.userType || 'startup',
        paying_customers: AuxeiraApp.formData.payingCustomers,
        monthly_revenue: AuxeiraApp.formData.monthlyRevenue,
        team_size: AuxeiraApp.formData.teamSize,
        funding_raised: AuxeiraApp.formData.totalFunding
    };
    
    // Make API call
    makeAPIRequest('/api/auth/signup', 'POST', registrationData)
        .then(response => {
            // Store token
            localStorage.setItem('auxeira_token', response.access_token);
            localStorage.setItem('auxeira_user', JSON.stringify(response.user));
            
            // Show success message
            const content = document.getElementById('authContent');
            content.innerHTML = `
                <div class="registration-success">
                    <div class="success-icon">✓</div>
                    <h2>Welcome to Auxeira!</h2>
                    <p>Your registration has been completed successfully.</p>
                    <div class="success-details">
                        <h3>What's Next?</h3>
                        <div class="next-steps">
                            <div class="step-item">
                                <span class="step-number">1</span>
                                <span>Complete your profile setup</span>
                            </div>
                            <div class="step-item">
                                <span class="step-number">2</span>
                                <span>Access your personalized dashboard</span>
                            </div>
                            <div class="step-item">
                                <span class="step-number">3</span>
                                <span>Start tracking your startup metrics</span>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-primary btn-full" onclick="redirectToDashboard()">
                        Access Dashboard
                        <span class="arrow">→</span>
                    </button>
                </div>
            `;
        })
        .catch(error => {
            hideLoadingState(submitButton, originalText);
            showError(error.message || 'Registration failed. Please try again.');
        });
}

async function handleLogin(event) {
    event.preventDefault();
    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = showLoadingState(submitButton);
    
    const formData = new FormData(form);
    const captchaAnswer = formData.get('captcha');
    
    try {
        // Verify CAPTCHA first
        if (!captchaAnswer) {
            throw new Error('Please complete the security verification');
        }
        
        const captchaValid = await verifyCaptcha(captchaAnswer);
        if (!captchaValid) {
            throw new Error('Security verification failed. Please try again.');
        }
        
        // Proceed with login
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password')
        };
        
        const response = await makeAPIRequest('/api/auth/login', 'POST', loginData);
        
        // Store token and user data with consistent naming
        localStorage.setItem('auxeira_token', response.access_token);
        localStorage.setItem('auxeira_user', JSON.stringify(response.user));
        localStorage.setItem('auxeira_login_timestamp', Date.now().toString());
        
        // Set current user for redirect function
        AuxeiraApp.currentUser = response.user;
        
        // Redirect to dashboard
        redirectToDashboard();
        
    } catch (error) {
        hideLoadingState(submitButton, originalText);
        showError(error.message || 'Login failed. Please check your credentials.');
        
        // Refresh CAPTCHA on error
        await refreshCaptcha();
    }
}

function redirectToDashboard() {
    // Close modal first
    closeAuthModal();
    
    // Get the authentication token from localStorage
    const token = localStorage.getItem('auxeira_token');
    
    if (token) {
        // Pass the token to the dashboard via URL parameter
        const dashboardUrl = `https://dashboard.auxeira.com?token=${encodeURIComponent(token)}`;
        
        // Store additional user data for the dashboard
        localStorage.setItem('auxeira_user_email', AuxeiraApp.currentUser?.email || '');
        localStorage.setItem('auxeira_login_timestamp', Date.now().toString());
        
        // Redirect to dashboard with token
        window.location.href = dashboardUrl;
    } else {
        // Fallback: redirect without token (dashboard will show login)
        window.location.href = 'https://dashboard.auxeira.com';
    }
}

// Check authentication status on page load
function checkAuthStatus() {
    const token = localStorage.getItem('auxeira_token');
    if (token) {
        // Verify token with backend using correct endpoint
        makeAPIRequest('/api/auth/verify', 'POST')
            .then(response => {
                // User is authenticated, update UI if needed
                console.log('User is authenticated:', response.user);
                // Store/update user data if provided
                if (response.user) {
                    localStorage.setItem('auxeira_user', JSON.stringify(response.user));
                }
            })
            .catch(error => {
                // Token is invalid, clear all authentication data
                console.log('Token verification failed:', error);
                clearAuthData();
            });
    }
}

// Clear all authentication data
function clearAuthData() {
    localStorage.removeItem('auxeira_token');
    localStorage.removeItem('auxeira_user');
    localStorage.removeItem('auxeira_user_email');
    localStorage.removeItem('auxeira_login_timestamp');
    console.log('Authentication data cleared');
}

// Logout function
function logout() {
    clearAuthData();
    // Redirect to main site or reload page
    window.location.href = 'https://auxeira.com';
}

// Utility Functions
function getRecommendedTier() {
    const funding = AuxeiraApp.formData.totalFunding;
    const revenue = AuxeiraApp.formData.monthlyRevenue;
    const teamSize = AuxeiraApp.formData.teamSize;
    
    if (!funding || funding === '0') {
        return 'Founder';
    } else if (funding === '1-10000' || funding === '10000-100000') {
        return 'Startup';
    } else if (funding === '100000-500000' || funding === '500000-5000000') {
        return 'Growth';
    } else {
        return 'Scale';
    }
}

function getTierName() {
    const tier = getRecommendedTier();
    return tier;
}

function getTierDescription() {
    const tier = getRecommendedTier();
    const descriptions = {
        'Founder': 'Perfect for bootstrap and pre-revenue startups',
        'Startup': 'Ideal for pre-seed to seed stage companies',
        'Growth': 'Best for Series A and growing companies',
        'Scale': 'Designed for Series B+ and scaling companies'
    };
    return descriptions[tier] || 'Customized for your needs';
}

function getTierPrice() {
    const tier = getRecommendedTier();
    const prices = {
        'Founder': 'FREE',
        'Startup': '$99/month',
        'Growth': '$299/month',
        'Scale': '$699/month'
    };
    return prices[tier] || 'Contact for pricing';
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    AuxeiraApp.init();
    checkAuthStatus();
});

// Add CSS for modal and form styles
const modalStyles = `
<style>
/* Modal Styles */
.auth-header {
    text-align: center;
    padding: 2rem 2rem 1rem 2rem;
    border-bottom: 1px solid var(--bloomberg-gray);
}

.auth-header h2 {
    font-size: 1.75rem;
    margin-bottom: 0.5rem;
    color: var(--bloomberg-text);
}

.auth-header p {
    color: var(--bloomberg-text-secondary);
    margin-bottom: 1rem;
}

/* CAPTCHA Styles */
.captcha-group {
    background: rgba(42, 42, 42, 0.3);
    border: 1px solid var(--bloomberg-gray);
    border-radius: var(--border-radius);
    padding: 1rem;
    margin-bottom: 1.5rem;
}

.captcha-challenge {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin-top: 0.5rem;
}

.captcha-question {
    font-weight: 600;
    color: var(--bloomberg-orange);
    font-family: var(--font-mono);
    font-size: 1.1rem;
    min-width: 120px;
}

.captcha-challenge input {
    width: 80px;
    text-align: center;
    font-weight: 600;
}

.btn-small {
    padding: 0.4rem 0.8rem;
    font-size: 0.75rem;
    min-width: auto;
}

.captcha-help {
    color: var(--bloomberg-text-muted);
    font-size: 0.75rem;
    margin-top: 0.5rem;
    display: block;
}

.captcha-loading {
    color: var(--bloomberg-text-secondary);
    font-style: italic;
    padding: 0.5rem 0;
}

.progress-bar {
    margin-top: 1.5rem;
}

.progress-steps {
    display: flex;
    justify-content: center;
    gap: 2rem;
    margin-bottom: 1rem;
}

.step {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bloomberg-gray);
    color: var(--bloomberg-text-secondary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.875rem;
    transition: all 0.3s ease;
}

.step.active {
    background: var(--bloomberg-orange);
    color: white;
}

.step.completed {
    background: var(--bloomberg-success);
    color: white;
}

.progress-line {
    height: 2px;
    background: var(--bloomberg-gray);
    border-radius: 1px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    background: var(--bloomberg-orange);
    transition: width 0.3s ease;
}

.step-content {
    padding: 2rem;
}

.step-content h3 {
    font-size: 1.25rem;
    margin-bottom: 1.5rem;
    color: var(--bloomberg-text);
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
}

.form-group {
    margin-bottom: 1.5rem;
}

.form-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: var(--bloomberg-text);
    font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid var(--bloomberg-gray);
    border-radius: var(--border-radius);
    background: var(--bloomberg-dark);
    color: var(--bloomberg-text);
    font-family: var(--font-primary);
    font-size: 0.875rem;
    transition: all 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--bloomberg-orange);
    box-shadow: 0 0 0 2px rgba(255, 107, 53, 0.1);
}

.radio-group,
.checkbox-group {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.radio-label,
.checkbox-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: var(--border-radius);
    transition: all 0.2s ease;
}

.radio-label:hover,
.checkbox-label:hover {
    background: rgba(255, 107, 53, 0.1);
}

.radio-label input,
.checkbox-label input {
    width: auto;
    margin: 0;
}

.form-options {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.forgot-password {
    color: var(--bloomberg-blue);
    font-size: 0.875rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-full {
    flex: 1;
}

.metric-section {
    margin-bottom: 2rem;
    padding: 1.5rem;
    background: rgba(42, 42, 42, 0.3);
    border: 1px solid var(--bloomberg-gray);
    border-radius: var(--border-radius-lg);
}

.metric-section h4 {
    font-size: 1rem;
    margin-bottom: 1rem;
    color: var(--bloomberg-orange);
    font-weight: 600;
}

.tier-recommendation,
.plan-recommendation {
    margin: 1rem 0;
}

.recommended-tier,
.recommended-plan {
    background: rgba(255, 107, 53, 0.1);
    border: 1px solid rgba(255, 107, 53, 0.3);
    border-radius: var(--border-radius-lg);
    padding: 1.5rem;
    position: relative;
}

.tier-badge,
.plan-badge {
    position: absolute;
    top: -8px;
    left: 1rem;
    background: var(--bloomberg-orange);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 50px;
    font-size: 0.75rem;
    font-weight: 600;
}

.tier-details,
.plan-details {
    margin-top: 0.5rem;
}

.tier-details h4,
.plan-details h4 {
    font-size: 1.125rem;
    margin-bottom: 0.5rem;
    color: var(--bloomberg-text);
}

.tier-price,
.plan-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--bloomberg-orange);
    font-family: var(--font-mono);
    margin-top: 0.5rem;
}

.plan-features {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.75rem;
}

.plan-features span {
    font-size: 0.75rem;
    color: var(--bloomberg-text-secondary);
}

.password-requirements {
    margin-top: 0.25rem;
}

.password-requirements small {
    color: var(--bloomberg-text-muted);
    font-size: 0.75rem;
}

.agreement {
    align-items: flex-start;
    line-height: 1.4;
}

.agreement span {
    font-size: 0.875rem;
}

.auth-footer {
    text-align: center;
    padding: 1rem 2rem 2rem 2rem;
    border-top: 1px solid var(--bloomberg-gray);
}

.auth-footer p {
    margin: 0;
    color: var(--bloomberg-text-secondary);
    font-size: 0.875rem;
}

.auth-footer a {
    color: var(--bloomberg-blue);
    font-weight: 500;
}

.user-type-selection {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.5rem;
    padding: 2rem;
}

.user-type-card {
    background: rgba(26, 26, 26, 0.8);
    border: 1px solid var(--bloomberg-gray);
    border-radius: var(--border-radius-lg);
    padding: 2rem;
    text-align: center;
    cursor: pointer;
    transition: all 0.3s ease;
}

.user-type-card:hover {
    border-color: var(--bloomberg-orange);
    transform: translateY(-4px);
    box-shadow: var(--shadow-lg);
}

.user-type-icon {
    font-size: 3rem;
    margin-bottom: 1rem;
}

.user-type-card h3 {
    font-size: 1.25rem;
    margin-bottom: 0.75rem;
    color: var(--bloomberg-text);
}

.user-type-card p {
    color: var(--bloomberg-text-secondary);
    margin-bottom: 1rem;
    font-size: 0.875rem;
}

.user-type-benefits {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.user-type-benefits span {
    font-size: 0.75rem;
    color: var(--bloomberg-accent);
}

.registration-success {
    text-align: center;
    padding: 3rem 2rem;
}

.success-icon {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: var(--bloomberg-success);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    font-weight: bold;
    margin: 0 auto 1.5rem auto;
}

.registration-success h2 {
    font-size: 1.75rem;
    margin-bottom: 0.75rem;
    color: var(--bloomberg-text);
}

.registration-success p {
    color: var(--bloomberg-text-secondary);
    margin-bottom: 2rem;
}

.success-details {
    background: rgba(42, 42, 42, 0.3);
    border: 1px solid var(--bloomberg-gray);
    border-radius: var(--border-radius-lg);
    padding: 1.5rem;
    margin-bottom: 2rem;
}

.success-details h3 {
    font-size: 1.125rem;
    margin-bottom: 1rem;
    color: var(--bloomberg-text);
}

.next-steps {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.step-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
}

.step-number {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: var(--bloomberg-orange);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.75rem;
    font-weight: 600;
    flex-shrink: 0;
}

/* Responsive Design for Modal */
@media (max-width: 768px) {
    .modal-content {
        margin: 2% auto;
        width: 95%;
        max-height: 95vh;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
    
    .user-type-selection {
        grid-template-columns: 1fr;
    }
    
    .form-actions {
        flex-direction: column;
    }
    
    .progress-steps {
        gap: 1rem;
    }
}
</style>
`;

// Inject modal styles
document.head.insertAdjacentHTML('beforeend', modalStyles);

