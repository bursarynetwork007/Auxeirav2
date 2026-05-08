/**
 * Activity Feed Component
 * Displays timestamped activities with 365-day rolling feed (default) and 5-year toggle
 */

class ActivityFeed {
    constructor(profileId = null, containerId = 'activityFeedContainer') {
        this.profileId = profileId || apiClient.getCurrentProfileId();
        this.containerId = containerId;
        this.timeRange = 365; // Default 365-day rolling feed
        this.currentPage = 1;
        this.limit = 50;
        this.filters = {
            activity_type: '',
            industry: ''
        };
        this.activities = [];
        this.pagination = {};
        
        if (!this.profileId) {
            console.error('No profile ID available for activity feed');
            return;
        }

        this.init();
    }

    /**
     * Initialize activity feed
     */
    async init() {
        this.setupUI();
        this.setupEventListeners();
        await this.fetchActivities();
    }

    /**
     * Setup UI elements
     */
    setupUI() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`Container ${this.containerId} not found`);
            return;
        }

        container.innerHTML = `
            <div class="activity-feed-wrapper">
                <!-- Header -->
                <div class="d-flex justify-content-between align-items-center mb-4">
                    <h4 class="mb-0">
                        <i class="fas fa-stream me-2"></i>
                        Activity Feed
                    </h4>
                    <div>
                        <button class="btn btn-sm btn-outline-primary" id="toggleTimeRange">
                            <i class="fas fa-clock me-2"></i>
                            <span id="timeRangeText">Show 5-Year History</span>
                        </button>
                        <button class="btn btn-sm btn-outline-secondary ms-2" id="refreshFeed">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>

                <!-- Time Range Indicator -->
                <div class="alert alert-info mb-3" id="timeRangeIndicator">
                    <i class="fas fa-info-circle me-2"></i>
                    Showing activities from the last <strong id="currentTimeRange">365 days</strong>
                    <span class="badge bg-primary ms-2" id="activityCount">0 activities</span>
                </div>

                <!-- Filters -->
                <div class="row mb-3">
                    <div class="col-md-4">
                        <select class="form-select" id="activityTypeFilter">
                            <option value="">All Activity Types</option>
                            <option value="Product Launch">Product Launch</option>
                            <option value="Funding Round">Funding Round</option>
                            <option value="Partnership">Partnership</option>
                            <option value="Customer Interviews">Customer Interviews</option>
                            <option value="Market Research">Market Research</option>
                            <option value="Team Expansion">Team Expansion</option>
                            <option value="Revenue Milestone">Revenue Milestone</option>
                            <option value="User Growth">User Growth</option>
                            <option value="Product Update">Product Update</option>
                            <option value="Marketing Campaign">Marketing Campaign</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <select class="form-select" id="industryFilter">
                            <option value="">All Industries</option>
                            <option value="Technology">Technology</option>
                            <option value="Healthcare">Healthcare</option>
                            <option value="Finance">Finance</option>
                            <option value="Education">Education</option>
                            <option value="E-commerce">E-commerce</option>
                            <option value="SaaS">SaaS</option>
                            <option value="Biotech">Biotech</option>
                            <option value="CleanTech">CleanTech</option>
                        </select>
                    </div>
                    <div class="col-md-4">
                        <input type="text" class="form-control" id="searchActivities" 
                               placeholder="Search activities...">
                    </div>
                </div>

                <!-- Loading State -->
                <div id="feedLoading" class="text-center py-5" style="display: none;">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-3 text-secondary">Loading activities...</p>
                </div>

                <!-- Activities Container -->
                <div id="activitiesList">
                    <!-- Activities will be rendered here -->
                </div>

                <!-- Empty State -->
                <div id="emptyState" class="text-center py-5" style="display: none;">
                    <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
                    <p class="text-secondary">No activities found</p>
                </div>

                <!-- Pagination -->
                <div class="d-flex justify-content-center mt-4" id="activityPagination">
                    <!-- Pagination will be rendered here -->
                </div>
            </div>
        `;
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Toggle time range button
        const toggleBtn = document.getElementById('toggleTimeRange');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleTimeRange());
        }

        // Refresh button
        const refreshBtn = document.getElementById('refreshFeed');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => this.refresh());
        }

        // Activity type filter
        const typeFilter = document.getElementById('activityTypeFilter');
        if (typeFilter) {
            typeFilter.addEventListener('change', (e) => {
                this.filters.activity_type = e.target.value;
                this.currentPage = 1;
                this.fetchActivities();
            });
        }

        // Industry filter
        const industryFilter = document.getElementById('industryFilter');
        if (industryFilter) {
            industryFilter.addEventListener('change', (e) => {
                this.filters.industry = e.target.value;
                this.currentPage = 1;
                this.fetchActivities();
            });
        }

        // Search input (debounced)
        const searchInput = document.getElementById('searchActivities');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', (e) => {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    this.filters.search = e.target.value;
                    this.currentPage = 1;
                    this.fetchActivities();
                }, 500);
            });
        }
    }

    /**
     * Fetch activities from API
     */
    async fetchActivities() {
        this.showLoading();

        try {
            const response = await apiClient.getActivityFeed({
                days: this.timeRange,
                profile_id: this.profileId,
                page: this.currentPage,
                limit: this.limit,
                ...this.filters
            });

            if (response.success) {
                this.activities = response.data.activities;
                this.pagination = response.data.pagination;
                this.renderActivities();
                this.renderPagination();
                this.updateTimeRangeIndicator(response.data.timeRange);
            } else {
                throw new Error('Failed to fetch activities');
            }

        } catch (error) {
            console.error('Error fetching activities:', error);
            this.showError('Failed to load activities');
        } finally {
            this.hideLoading();
        }
    }

    /**
     * Render activities
     */
    renderActivities() {
        const container = document.getElementById('activitiesList');
        const emptyState = document.getElementById('emptyState');

        if (!container) return;

        if (this.activities.length === 0) {
            container.innerHTML = '';
            if (emptyState) emptyState.style.display = 'block';
            return;
        }

        if (emptyState) emptyState.style.display = 'none';

        container.innerHTML = this.activities.map(activity => `
            <div class="activity-item glass-card mb-3 p-3" data-activity-id="${activity.activity_id}">
                <div class="d-flex justify-content-between align-items-start">
                    <div class="flex-grow-1">
                        <div class="d-flex align-items-center mb-2">
                            <span class="activity-icon me-2">
                                ${this.getActivityIcon(activity.activity_type)}
                            </span>
                            <h6 class="mb-0 text-primary">${activity.activity_title}</h6>
                        </div>
                        <p class="text-secondary mb-2">${activity.activity_description || 'No description'}</p>
                        <div class="d-flex flex-wrap gap-2 align-items-center">
                            <small class="text-muted">
                                <i class="fas fa-building me-1"></i>
                                ${activity.company_name}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-industry me-1"></i>
                                ${activity.industry}
                            </small>
                            <small class="text-muted">
                                <i class="fas fa-calendar me-1"></i>
                                ${apiClient.formatRelativeTime(activity.activity_date)}
                            </small>
                            <span class="badge bg-secondary">${activity.stage}</span>
                        </div>
                    </div>
                    <div class="text-end ms-3">
                        <span class="badge bg-primary fs-6">
                            Impact: ${activity.impact_score || 0}/10
                        </span>
                        ${activity.sse_score ? `
                            <div class="mt-2">
                                <small class="text-muted">SSE: ${activity.sse_score}</small>
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        `).join('');
    }

    /**
     * Get icon for activity type
     */
    getActivityIcon(activityType) {
        const icons = {
            'Product Launch': '<i class="fas fa-rocket text-primary"></i>',
            'Funding Round': '<i class="fas fa-dollar-sign text-success"></i>',
            'Partnership': '<i class="fas fa-handshake text-info"></i>',
            'Customer Interviews': '<i class="fas fa-users text-warning"></i>',
            'Market Research': '<i class="fas fa-chart-line text-primary"></i>',
            'Team Expansion': '<i class="fas fa-user-plus text-success"></i>',
            'Revenue Milestone': '<i class="fas fa-trophy text-warning"></i>',
            'User Growth': '<i class="fas fa-chart-bar text-info"></i>',
            'Product Update': '<i class="fas fa-code text-primary"></i>',
            'Marketing Campaign': '<i class="fas fa-bullhorn text-danger"></i>'
        };

        return icons[activityType] || '<i class="fas fa-circle text-secondary"></i>';
    }

    /**
     * Render pagination
     */
    renderPagination() {
        const container = document.getElementById('activityPagination');
        if (!container || !this.pagination) return;

        const { page, totalPages, hasNext, hasPrev, total } = this.pagination;

        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        container.innerHTML = `
            <nav aria-label="Activity feed pagination">
                <ul class="pagination">
                    <li class="page-item ${!hasPrev ? 'disabled' : ''}">
                        <button class="page-link" onclick="activityFeed.previousPage()" ${!hasPrev ? 'disabled' : ''}>
                            <i class="fas fa-chevron-left"></i> Previous
                        </button>
                    </li>
                    <li class="page-item active">
                        <span class="page-link">
                            Page ${page} of ${totalPages}
                            <small class="ms-2">(${total} total)</small>
                        </span>
                    </li>
                    <li class="page-item ${!hasNext ? 'disabled' : ''}">
                        <button class="page-link" onclick="activityFeed.nextPage()" ${!hasNext ? 'disabled' : ''}>
                            Next <i class="fas fa-chevron-right"></i>
                        </button>
                    </li>
                </ul>
            </nav>
        `;
    }

    /**
     * Update time range indicator
     */
    updateTimeRangeIndicator(timeRangeData) {
        const indicator = document.getElementById('currentTimeRange');
        const countBadge = document.getElementById('activityCount');

        if (indicator) {
            indicator.textContent = timeRangeData.isFiveYear ? '5 years' : '365 days';
        }

        if (countBadge && this.pagination) {
            countBadge.textContent = `${this.pagination.total} activities`;
        }
    }

    /**
     * Toggle between 365-day and 5-year view
     */
    async toggleTimeRange() {
        const toggleBtn = document.getElementById('toggleTimeRange');
        const toggleText = document.getElementById('timeRangeText');

        if (this.timeRange === 365) {
            this.timeRange = 1825; // 5 years
            if (toggleText) toggleText.textContent = 'Show Last 365 Days';
            if (toggleBtn) toggleBtn.classList.add('active');
        } else {
            this.timeRange = 365; // Back to 365 days
            if (toggleText) toggleText.textContent = 'Show 5-Year History';
            if (toggleBtn) toggleBtn.classList.remove('active');
        }

        this.currentPage = 1;
        await this.fetchActivities();
    }

    /**
     * Go to previous page
     */
    async previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            await this.fetchActivities();
            this.scrollToTop();
        }
    }

    /**
     * Go to next page
     */
    async nextPage() {
        if (this.pagination.hasNext) {
            this.currentPage++;
            await this.fetchActivities();
            this.scrollToTop();
        }
    }

    /**
     * Refresh activity feed
     */
    async refresh() {
        // Clear cache
        apiClient.clearCache();
        await this.fetchActivities();
    }

    /**
     * Scroll to top of feed
     */
    scrollToTop() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }

    /**
     * Show loading state
     */
    showLoading() {
        const loading = document.getElementById('feedLoading');
        const list = document.getElementById('activitiesList');
        const pagination = document.getElementById('activityPagination');

        if (loading) loading.style.display = 'block';
        if (list) list.style.display = 'none';
        if (pagination) pagination.style.display = 'none';
    }

    /**
     * Hide loading state
     */
    hideLoading() {
        const loading = document.getElementById('feedLoading');
        const list = document.getElementById('activitiesList');
        const pagination = document.getElementById('activityPagination');

        if (loading) loading.style.display = 'none';
        if (list) list.style.display = 'block';
        if (pagination) pagination.style.display = 'flex';
    }

    /**
     * Show error message
     */
    showError(message) {
        const container = document.getElementById('activitiesList');
        if (container) {
            container.innerHTML = `
                <div class="alert alert-danger" role="alert">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    ${message}
                    <button class="btn btn-sm btn-outline-danger ms-3" onclick="activityFeed.refresh()">
                        Retry
                    </button>
                </div>
            `;
        }
    }

    /**
     * Destroy activity feed
     */
    destroy() {
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
    }
}

// Make available globally
if (typeof window !== 'undefined') {
    window.ActivityFeed = ActivityFeed;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ActivityFeed;
}
