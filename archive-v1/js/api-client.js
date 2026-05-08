/**
 * Auxeira API Client
 * Centralized API communication for all dashboards
 * Handles authentication, error handling, and data transformation
 */

class AuxeiraAPIClient {
    constructor(baseURL = '/api') {
        this.baseURL = baseURL;
        this.token = this.getToken();
        this.cache = new Map();
        this.cacheDuration = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get authentication token from localStorage
     */
    getToken() {
        return localStorage.getItem('auxeira_token') || 
               localStorage.getItem('token') || 
               sessionStorage.getItem('auxeira_token');
    }

    /**
     * Set authentication token
     */
    setToken(token) {
        this.token = token;
        localStorage.setItem('auxeira_token', token);
    }

    /**
     * Clear authentication token
     */
    clearToken() {
        this.token = null;
        localStorage.removeItem('auxeira_token');
        localStorage.removeItem('token');
        sessionStorage.removeItem('auxeira_token');
    }

    /**
     * Get cached data if available and not expired
     */
    getCached(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheDuration) {
            return cached.data;
        }
        return null;
    }

    /**
     * Set cached data
     */
    setCached(key, data) {
        this.cache.set(key, {
            data,
            timestamp: Date.now()
        });
    }

    /**
     * Clear cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Make HTTP request to API
     */
    async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const cacheKey = `${options.method || 'GET'}_${endpoint}`;

        // Check cache for GET requests
        if (!options.method || options.method === 'GET') {
            const cached = this.getCached(cacheKey);
            if (cached) {
                console.log(`[API Cache Hit] ${endpoint}`);
                return cached;
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };

        // Add authorization header if token exists
        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        const startTime = Date.now();

        try {
            const response = await fetch(url, { 
                ...options, 
                headers 
            });

            const duration = Date.now() - startTime;

            // Log request
            console.log({
                endpoint,
                method: options.method || 'GET',
                duration: `${duration}ms`,
                status: response.status,
                timestamp: new Date().toISOString()
            });

            if (!response.ok) {
                // Handle specific error codes
                if (response.status === 401) {
                    this.clearToken();
                    window.location.href = '/index.html';
                    throw new Error('Unauthorized - Please login again');
                }

                if (response.status === 404) {
                    throw new Error('Resource not found');
                }

                if (response.status >= 500) {
                    throw new Error('Server error - Please try again later');
                }

                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `API Error: ${response.status}`);
            }

            const data = await response.json();

            // Cache successful GET requests
            if (!options.method || options.method === 'GET') {
                this.setCached(cacheKey, data);
            }

            return data;

        } catch (error) {
            console.error({
                endpoint,
                error: error.message,
                timestamp: new Date().toISOString()
            });
            throw error;
        }
    }

    // =============================================
    // AUTHENTICATION ENDPOINTS
    // =============================================

    /**
     * Register new user
     */
    async register(email, password, userType, profile = {}) {
        const response = await this.request('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password,
                userType,
                profile
            })
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    /**
     * Login user
     */
    async login(email, password) {
        const response = await this.request('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                email,
                password
            })
        });

        if (response.success && response.data.token) {
            this.setToken(response.data.token);
        }

        return response;
    }

    /**
     * Logout user
     */
    logout() {
        this.clearToken();
        this.clearCache();
        window.location.href = '/index.html';
    }

    // =============================================
    // STARTUP PROFILES ENDPOINTS
    // =============================================

    /**
     * Get single startup profile
     */
    async getProfile(profileId, options = {}) {
        const params = new URLSearchParams(options);
        return this.request(`/startup-profiles/${profileId}?${params}`);
    }

    /**
     * List startup profiles with filters
     */
    async listProfiles(filters = {}) {
        const params = new URLSearchParams(filters);
        return this.request(`/startup-profiles/?${params}`);
    }

    /**
     * Get activity feed (365-day rolling feed by default)
     */
    async getActivityFeed(filters = {}) {
        const params = new URLSearchParams({
            days: 365, // Default 365-day rolling feed
            ...filters
        });
        return this.request(`/startup-profiles/activity-feed?${params}`);
    }

    /**
     * Get activities for specific profile
     */
    async getProfileActivities(profileId, options = {}) {
        const params = new URLSearchParams({
            days: 365, // Default 365-day rolling feed
            ...options
        });
        return this.request(`/startup-profiles/${profileId}/activities?${params}`);
    }

    /**
     * Get metrics history for profile
     */
    async getProfileMetrics(profileId, options = {}) {
        const params = new URLSearchParams({
            days: 365, // Default 365-day rolling feed
            ...options
        });
        return this.request(`/startup-profiles/${profileId}/metrics?${params}`);
    }

    /**
     * Get aggregate statistics
     */
    async getStats(options = {}) {
        const params = new URLSearchParams({
            days: 365, // Default 365-day rolling feed
            ...options
        });
        return this.request(`/startup-profiles/stats?${params}`);
    }

    /**
     * Search startup profiles
     */
    async searchProfiles(query, limit = 20) {
        const params = new URLSearchParams({ q: query, limit });
        return this.request(`/startup-profiles/search?${params}`);
    }

    // =============================================
    // DASHBOARD DATA ENDPOINTS
    // =============================================

    /**
     * Get dashboard metrics
     */
    async getDashboardMetrics(options = {}) {
        const params = new URLSearchParams(options);
        return this.request(`/dashboard/metrics?${params}`);
    }

    /**
     * Create dashboard metrics
     */
    async createDashboardMetrics(metrics) {
        return this.request('/dashboard/metrics', {
            method: 'POST',
            body: JSON.stringify({ metrics })
        });
    }

    // =============================================
    // SSE SCORING ENDPOINTS
    // =============================================

    /**
     * Calculate SSE score
     */
    async calculateSSEScore(startupId, responses, isSynthetic = false) {
        return this.request('/sse/calculate', {
            method: 'POST',
            body: JSON.stringify({
                startupId,
                responses,
                isSynthetic
            })
        });
    }

    /**
     * Get SSE score for startup
     */
    async getSSEScore(startupId) {
        return this.request(`/sse/score/${startupId}`);
    }

    // =============================================
    // GAMIFICATION ENDPOINTS
    // =============================================

    /**
     * Complete action and earn tokens
     */
    async completeAction(actionType, domain, baseTokens, metadata = {}) {
        return this.request('/gamification/action', {
            method: 'POST',
            body: JSON.stringify({
                actionType,
                domain,
                baseTokens,
                metadata
            })
        });
    }

    /**
     * Get gamification profile
     */
    async getGamificationProfile() {
        return this.request('/gamification/profile');
    }

    // =============================================
    // SYNTHETIC DATA ENDPOINTS
    // =============================================

    /**
     * Generate synthetic data
     */
    async generateSyntheticData(config) {
        return this.request('/synthetic/generate', {
            method: 'POST',
            body: JSON.stringify(config)
        });
    }

    /**
     * Get synthetic data templates
     */
    async getSyntheticTemplates() {
        return this.request('/synthetic/templates');
    }

    // =============================================
    // UTILITY METHODS
    // =============================================

    /**
     * Format currency
     */
    formatCurrency(value, options = {}) {
        if (value === null || value === undefined) return '$0';
        
        const defaults = {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        };

        return new Intl.NumberFormat('en-US', { ...defaults, ...options }).format(value);
    }

    /**
     * Format number with abbreviation (K, M, B)
     */
    formatNumber(value) {
        if (value === null || value === undefined) return '0';
        
        const num = parseFloat(value);
        
        if (num >= 1000000000) {
            return (num / 1000000000).toFixed(1) + 'B';
        }
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        
        return num.toFixed(0);
    }

    /**
     * Format date
     */
    formatDate(dateString, options = {}) {
        if (!dateString) return '';
        
        const defaults = {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        };

        return new Date(dateString).toLocaleDateString('en-US', { ...defaults, ...options });
    }

    /**
     * Format relative time (e.g., "2 days ago")
     */
    formatRelativeTime(dateString) {
        if (!dateString) return '';
        
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffSecs = Math.floor(diffMs / 1000);
        const diffMins = Math.floor(diffSecs / 60);
        const diffHours = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHours / 24);

        if (diffSecs < 60) return 'just now';
        if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
        if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
        if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
        
        return this.formatDate(dateString);
    }

    /**
     * Group metrics by month
     */
    groupByMonth(metrics) {
        const grouped = {};
        
        metrics.forEach(metric => {
            const date = new Date(metric.date || metric.metric_date);
            const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
            
            if (!grouped[monthKey]) {
                grouped[monthKey] = {
                    month: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                    values: []
                };
            }
            
            grouped[monthKey].values.push(metric);
        });

        return Object.values(grouped).map(group => ({
            month: group.month,
            value: group.values.reduce((sum, m) => sum + parseFloat(m.value || m.metric_value || 0), 0) / group.values.length
        }));
    }

    /**
     * Calculate percentage change
     */
    calculateChange(current, previous) {
        if (!previous || previous === 0) return 0;
        return ((current - previous) / previous * 100).toFixed(1);
    }

    /**
     * Get current user profile ID from token or localStorage
     */
    getCurrentProfileId() {
        // Try to get from localStorage first
        const profileId = localStorage.getItem('auxeira_profile_id');
        if (profileId) return profileId;

        // Try to decode from JWT token
        if (this.token) {
            try {
                const payload = JSON.parse(atob(this.token.split('.')[1]));
                return payload.profile_id || payload.user_id;
            } catch (error) {
                console.error('Failed to decode token:', error);
            }
        }

        return null;
    }

    /**
     * Set current profile ID
     */
    setCurrentProfileId(profileId) {
        localStorage.setItem('auxeira_profile_id', profileId);
    }
}

// Export singleton instance
const apiClient = new AuxeiraAPIClient();

// Make available globally
if (typeof window !== 'undefined') {
    window.apiClient = apiClient;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuxeiraAPIClient;
}
