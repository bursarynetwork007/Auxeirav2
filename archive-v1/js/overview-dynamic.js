/**
 * Overview Dynamic Content Manager
 * Handles dynamic nudges and urgent actions for the Overview tab
 */

class OverviewDynamicManager {
    constructor(nudgesApiUrl, urgentActionsApiUrl) {
        this.nudgesApiUrl = nudgesApiUrl;
        this.urgentActionsApiUrl = urgentActionsApiUrl;
        this.cache = {
            nudges: null,
            urgentActions: null,
            timestamp: null
        };
        this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
    }

    /**
     * Generate dynamic nudges
     */
    async generateNudges(context) {
        // Check cache
        if (this.cache.nudges && this.cache.timestamp && 
            (Date.now() - this.cache.timestamp < this.CACHE_DURATION)) {
            console.log('Using cached nudges');
            return this.cache.nudges;
        }

        try {
            console.log('Generating nudges from API...');
            const response = await fetch(this.nudgesApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ context })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success || !data.data || !data.data.nudges) {
                throw new Error('Invalid response structure');
            }

            const nudges = data.data.nudges;

            // Cache the results
            this.cache.nudges = nudges;
            this.cache.timestamp = Date.now();

            console.log('Nudges generated:', nudges);
            return nudges;
        } catch (error) {
            console.error('Error generating nudges:', error);
            return this.getFallbackNudges(context);
        }
    }

    /**
     * Generate urgent actions
     */
    async generateUrgentActions(context) {
        // Check cache
        if (this.cache.urgentActions && this.cache.timestamp && 
            (Date.now() - this.cache.timestamp < this.CACHE_DURATION)) {
            console.log('Using cached urgent actions');
            return this.cache.urgentActions;
        }

        try {
            console.log('Generating urgent actions from API...');
            const response = await fetch(this.urgentActionsApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ context })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.status}`);
            }

            const data = await response.json();
            
            if (!data.success || !data.data || !data.data.actions) {
                throw new Error('Invalid response structure');
            }

            const actions = data.data.actions;

            // Cache the results
            this.cache.urgentActions = actions;
            this.cache.timestamp = Date.now();

            console.log('Urgent actions generated:', actions);
            return actions;
        } catch (error) {
            console.error('Error generating urgent actions:', error);
            return this.getFallbackUrgentActions(context);
        }
    }

    /**
     * Fallback nudges if API fails
     */
    getFallbackNudges(context) {
        console.log('Using fallback nudges');
        return [
            {
                type: 'growth',
                goal: 'Launch Customer Referral Program',
                description: 'Reduce CAC by 25% through customer referrals with proven templates.',
                buttonText: 'Launch Program',
                auxReward: 120,
                difficulty: 'Medium'
            },
            {
                type: 'validation',
                goal: 'Complete Customer Interviews',
                description: 'Need 2 more interviews to reach Series A validation threshold.',
                buttonText: 'Schedule Interviews',
                auxReward: 180,
                difficulty: 'High'
            },
            {
                type: 'funding',
                goal: 'Update Financial Projections',
                description: 'Refresh 18-month model to reflect recent MRR growth trends.',
                buttonText: 'Update Model',
                auxReward: 220,
                difficulty: 'High'
            }
        ];
    }

    /**
     * Fallback urgent actions if API fails
     */
    getFallbackUrgentActions(context) {
        console.log('Using fallback urgent actions');
        return [
            {
                title: 'Customer Interview #8',
                description: 'Required to unlock Series A assessment. Complete final validation interview.',
                buttonText: 'Start Now',
                urgencyColor: 'red',
                auxReward: 150,
                actionId: 'customer_interview_8',
                workflowType: 'Modal'
            },
            {
                title: 'Financial Model Update',
                description: 'Your projections are 30 days old - Overdue. Update to reflect current metrics.',
                buttonText: 'Update',
                urgencyColor: 'yellow',
                auxReward: 200,
                actionId: 'financial_model_update',
                workflowType: 'Edit'
            },
            {
                title: 'Investor Introduction',
                description: 'Warm intro to Series A investor available. High-fit based on your traction.',
                buttonText: 'Accept',
                urgencyColor: 'blue',
                auxReward: 500,
                actionId: 'investor_intro',
                workflowType: 'Redirect'
            }
        ];
    }

    /**
     * Render nudges in the Overview tab
     */
    renderNudges(nudges, containerSelector = '#nudgesContainer') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('Nudges container not found');
            return;
        }

        const colorMap = {
            growth: { color: 'success', icon: 'bullseye', cssVar: '--success-green' },
            validation: { color: 'warning', icon: 'chart-line', cssVar: '--neon-gold' },
            funding: { color: 'primary', icon: 'rocket', cssVar: '--neon-blue' }
        };

        const html = nudges.map(nudge => {
            const config = colorMap[nudge.type];
            const badgeClass = nudge.type === 'validation' ? 'bg-warning text-dark' : `bg-${config.color}`;
            
            return `
                <div class="col-md-4">
                    <div class="nudge-card" style="border-left-color: var(${config.cssVar});">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="text-${config.color} mb-1">
                                <i class="fas fa-${config.icon} me-1"></i>${nudge.type.charAt(0).toUpperCase() + nudge.type.slice(1)} Nudge
                            </h6>
                            <span class="badge ${badgeClass}">+${nudge.auxReward} AUX</span>
                        </div>
                        <p class="small mb-2">
                            <strong>${nudge.goal}:</strong> ${nudge.description}
                        </p>
                        <button class="btn btn-sm btn-${config.color} w-100" id="${nudge.type}NudgeBtn">${nudge.buttonText}</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Render urgent actions in the Overview tab
     */
    renderUrgentActions(actions, containerSelector = '#urgentActionsContainer') {
        const container = document.querySelector(containerSelector);
        if (!container) {
            console.error('Urgent actions container not found');
            return;
        }

        const colorMap = {
            red: { cssClass: 'danger', cssVar: '--danger-red' },
            yellow: { cssClass: 'warning', cssVar: '--warning-orange' },
            blue: { cssClass: 'primary', cssVar: '--neon-blue' }
        };

        const html = actions.map(action => {
            const config = colorMap[action.urgencyColor];
            const auxBadge = action.auxReward ? ` - +${action.auxReward} AUX` : '';
            
            return `
                <div class="nudge-card urgent mb-3" style="border-left-color: var(${config.cssVar});">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h6 class="text-${config.cssClass} mb-0">${action.title}</h6>
                            <p class="mb-0 small text-secondary">${action.description}${auxBadge}</p>
                        </div>
                        <button class="btn btn-sm btn-${config.cssClass}" data-action-id="${action.actionId}">${action.buttonText}</button>
                    </div>
                </div>
            `;
        }).join('');

        container.innerHTML = html;
    }

    /**
     * Initialize and load all dynamic content
     */
    async initialize(context) {
        try {
            console.log('Initializing dynamic content with context:', context);
            
            // Generate nudges and urgent actions in parallel
            const [nudges, urgentActions] = await Promise.all([
                this.generateNudges(context),
                this.urgentActionsApiUrl ? this.generateUrgentActions(context) : Promise.resolve(this.getFallbackUrgentActions(context))
            ]);

            // Render both sections
            this.renderNudges(nudges);
            this.renderUrgentActions(urgentActions);

            return { nudges, urgentActions };
        } catch (error) {
            console.error('Error initializing dynamic content:', error);
            
            // Render fallbacks
            this.renderNudges(this.getFallbackNudges(context));
            this.renderUrgentActions(this.getFallbackUrgentActions(context));
        }
    }

    /**
     * Clear cache (useful for testing or manual refresh)
     */
    clearCache() {
        this.cache = {
            nudges: null,
            urgentActions: null,
            timestamp: null
        };
        console.log('Cache cleared');
    }
}

// Export for use in dashboard
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OverviewDynamicManager;
}
