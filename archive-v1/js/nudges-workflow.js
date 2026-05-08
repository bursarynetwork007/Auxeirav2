/**
 * AI Nudges Workflow Manager
 * Handles Growth, Validation, and Funding nudge workflows
 */

class NudgesWorkflow {
    constructor(apiEndpoint) {
        this.apiEndpoint = apiEndpoint || '/api/nudges';
        this.currentNudge = null;
        this.init();
    }

    init() {
        this.createModals();
        this.attachEventListeners();
    }

    createModals() {
        const modalsHTML = `
            <!-- Growth Nudge Modal -->
            <div id="growthNudgeModal" class="nudge-modal" style="display: none;">
                <div class="nudge-modal-content">
                    <div class="nudge-modal-header">
                        <h3><i class="fas fa-rocket me-2"></i>Referral Program Setup</h3>
                        <button class="nudge-modal-close" onclick="nudgesWorkflow.closeModal('growth')">&times;</button>
                    </div>
                    <div class="nudge-modal-body" id="growthNudgeContent">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Generating your referral program plan...</p>
                        </div>
                    </div>
                    <div class="nudge-modal-footer">
                        <button class="btn btn-secondary" onclick="nudgesWorkflow.closeModal('growth')">Cancel</button>
                        <button class="btn btn-success" id="completeGrowthNudge" style="display: none;">
                            <i class="fas fa-check me-2"></i>Mark as Complete (+100 AUX)
                        </button>
                    </div>
                </div>
            </div>

            <!-- Validation Nudge Modal -->
            <div id="validationNudgeModal" class="nudge-modal" style="display: none;">
                <div class="nudge-modal-content">
                    <div class="nudge-modal-header">
                        <h3><i class="fas fa-calendar-check me-2"></i>Customer Interview Guide</h3>
                        <button class="nudge-modal-close" onclick="nudgesWorkflow.closeModal('validation')">&times;</button>
                    </div>
                    <div class="nudge-modal-body" id="validationNudgeContent">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Generating your interview guide...</p>
                        </div>
                    </div>
                    <div class="nudge-modal-footer">
                        <button class="btn btn-secondary" onclick="nudgesWorkflow.closeModal('validation')">Cancel</button>
                        <button class="btn btn-warning" id="completeValidationNudge" style="display: none;">
                            <i class="fas fa-check me-2"></i>Mark as Complete (+150 AUX)
                        </button>
                    </div>
                </div>
            </div>

            <!-- Funding Nudge Modal -->
            <div id="fundingNudgeModal" class="nudge-modal" style="display: none;">
                <div class="nudge-modal-content">
                    <div class="nudge-modal-header">
                        <h3><i class="fas fa-chart-line me-2"></i>Financial Model Update</h3>
                        <button class="nudge-modal-close" onclick="nudgesWorkflow.closeModal('funding')">&times;</button>
                    </div>
                    <div class="nudge-modal-body" id="fundingNudgeContent">
                        <div class="loading-spinner">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Generating your financial model guidance...</p>
                        </div>
                    </div>
                    <div class="nudge-modal-footer">
                        <button class="btn btn-secondary" onclick="nudgesWorkflow.closeModal('funding')">Cancel</button>
                        <button class="btn btn-primary" id="completeFundingNudge" style="display: none;">
                            <i class="fas fa-check me-2"></i>Mark as Complete (+200 AUX)
                        </button>
                    </div>
                </div>
            </div>

            <style>
                .nudge-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0, 0, 0, 0.8);
                    backdrop-filter: blur(10px);
                    z-index: 10000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }

                .nudge-modal-content {
                    background: linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    width: 90%;
                    max-width: 800px;
                    max-height: 90vh;
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .nudge-modal-header {
                    padding: 24px;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .nudge-modal-header h3 {
                    margin: 0;
                    color: #00d4ff;
                    font-size: 1.5rem;
                }

                .nudge-modal-close {
                    background: none;
                    border: none;
                    color: #a1a1aa;
                    font-size: 2rem;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .nudge-modal-close:hover {
                    color: #ffffff;
                }

                .nudge-modal-body {
                    padding: 24px;
                    overflow-y: auto;
                    flex: 1;
                    color: #ffffff;
                }

                .nudge-modal-footer {
                    padding: 24px;
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    display: flex;
                    justify-content: flex-end;
                    gap: 12px;
                }

                .loading-spinner {
                    text-align: center;
                    padding: 40px;
                }

                .loading-spinner i {
                    font-size: 3rem;
                    color: #00d4ff;
                    margin-bottom: 16px;
                }

                .loading-spinner p {
                    color: #a1a1aa;
                    font-size: 1.1rem;
                }

                .nudge-section {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 20px;
                    margin-bottom: 20px;
                }

                .nudge-section h4 {
                    color: #00d4ff;
                    margin-bottom: 16px;
                    font-size: 1.2rem;
                }

                .nudge-section ul {
                    list-style: none;
                    padding: 0;
                }

                .nudge-section li {
                    padding: 8px 0;
                    padding-left: 24px;
                    position: relative;
                }

                .nudge-section li:before {
                    content: "✓";
                    position: absolute;
                    left: 0;
                    color: #10b981;
                    font-weight: bold;
                }

                .file-upload-area {
                    border: 2px dashed rgba(255, 255, 255, 0.2);
                    border-radius: 12px;
                    padding: 40px;
                    text-align: center;
                    cursor: pointer;
                    transition: all 0.3s;
                }

                .file-upload-area:hover {
                    border-color: #00d4ff;
                    background: rgba(0, 212, 255, 0.05);
                }

                .file-upload-area i {
                    font-size: 3rem;
                    color: #00d4ff;
                    margin-bottom: 16px;
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', modalsHTML);
    }

    attachEventListeners() {
        // Complete buttons
        document.getElementById('completeGrowthNudge')?.addEventListener('click', () => {
            this.completeNudge('growth');
        });

        document.getElementById('completeValidationNudge')?.addEventListener('click', () => {
            this.completeNudge('validation');
        });

        document.getElementById('completeFundingNudge')?.addEventListener('click', () => {
            this.completeNudge('funding');
        });
    }

    async openGrowthNudge(context) {
        this.currentNudge = 'growth';
        document.getElementById('growthNudgeModal').style.display = 'flex';
        
        try {
            const response = await this.callAPI('generate', 'growth', context);
            this.renderGrowthContent(response.data);
            document.getElementById('completeGrowthNudge').style.display = 'block';
        } catch (error) {
            this.showError('growthNudgeContent', error.message);
        }
    }

    async openValidationNudge(context) {
        this.currentNudge = 'validation';
        document.getElementById('validationNudgeModal').style.display = 'flex';
        
        try {
            const response = await this.callAPI('generate', 'validation', context);
            this.renderValidationContent(response.data);
            document.getElementById('completeValidationNudge').style.display = 'block';
        } catch (error) {
            this.showError('validationNudgeContent', error.message);
        }
    }

    async openFundingNudge(context) {
        this.currentNudge = 'funding';
        document.getElementById('fundingNudgeModal').style.display = 'flex';
        
        try {
            const response = await this.callAPI('generate', 'funding', context);
            this.renderFundingContent(response.data);
            document.getElementById('completeFundingNudge').style.display = 'block';
        } catch (error) {
            this.showError('fundingNudgeContent', error.message);
        }
    }

    renderGrowthContent(data) {
        const content = `
            <div class="nudge-section">
                <h4><i class="fas fa-gift me-2"></i>Referral Incentive Structure</h4>
                <p>${data.incentiveStructure || data.plan || 'Loading...'}</p>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-tasks me-2"></i>Implementation Checklist</h4>
                <ul>
                    ${this.formatChecklist(data.checklist)}
                </ul>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-chart-bar me-2"></i>Success Metrics</h4>
                <p>${data.metrics || 'Track referral signups, conversion rate, and CAC reduction'}</p>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-clock me-2"></i>Expected Timeline</h4>
                <p>${data.timeline || 'See 25% CAC reduction within 3-4 months'}</p>
            </div>
        `;

        document.getElementById('growthNudgeContent').innerHTML = content;
    }

    renderValidationContent(data) {
        const content = `
            <div class="nudge-section">
                <h4><i class="fas fa-envelope me-2"></i>Email Template</h4>
                <textarea class="form-control" rows="6" style="background: rgba(0,0,0,0.3); color: white; border: 1px solid rgba(255,255,255,0.2);">${data.emailTemplate || data.guide || 'Loading...'}</textarea>
                <button class="btn btn-sm btn-outline-primary mt-2" onclick="navigator.clipboard.writeText(this.previousElementSibling.value)">
                    <i class="fas fa-copy me-1"></i>Copy Template
                </button>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-question-circle me-2"></i>Critical Questions</h4>
                <ol style="padding-left: 20px;">
                    ${this.formatQuestions(data.questions)}
                </ol>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-lightbulb me-2"></i>What to Listen For</h4>
                <p>${data.signals || 'Listen for pain points, workarounds, and emotional language'}</p>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-file-alt me-2"></i>Documentation Tips</h4>
                <p>${data.documentation || 'Record interviews (with permission) and note key quotes'}</p>
            </div>
        `;

        document.getElementById('validationNudgeContent').innerHTML = content;
    }

    renderFundingContent(data) {
        const content = `
            <div class="nudge-section">
                <h4><i class="fas fa-bullseye me-2"></i>Key Focus Areas</h4>
                <p>${data.guidance || 'Loading...'}</p>
            </div>

            <div class="nudge-section">
                <h4><i class="fas fa-upload me-2"></i>Upload Financial Model</h4>
                <div class="file-upload-area" onclick="document.getElementById('financialModelFile').click()">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <p>Click to upload your updated financial model</p>
                    <small style="color: #a1a1aa;">Supported formats: Excel (.xlsx), CSV</small>
                </div>
                <input type="file" id="financialModelFile" accept=".xlsx,.xls,.csv" style="display: none;" onchange="nudgesWorkflow.handleFileUpload(this)">
                <div id="uploadStatus" style="margin-top: 16px;"></div>
            </div>
        `;

        document.getElementById('fundingNudgeContent').innerHTML = content;
    }

    formatChecklist(checklist) {
        if (Array.isArray(checklist)) {
            return checklist.map(item => `<li>${item}</li>`).join('');
        }
        return '<li>Set up referral tracking system</li><li>Design referral incentives</li><li>Create landing pages</li><li>Launch campaign</li><li>Monitor metrics</li>';
    }

    formatQuestions(questions) {
        if (Array.isArray(questions)) {
            return questions.map(q => `<li>${q}</li>`).join('');
        }
        return '<li>What problem were you trying to solve when you found us?</li><li>What nearly made you choose a competitor?</li><li>What would make you recommend us to others?</li>';
    }

    handleFileUpload(input) {
        const file = input.files[0];
        if (file) {
            const statusDiv = document.getElementById('uploadStatus');
            statusDiv.innerHTML = `
                <div class="alert alert-success">
                    <i class="fas fa-check-circle me-2"></i>
                    File uploaded: ${file.name} (${(file.size / 1024).toFixed(2)} KB)
                </div>
            `;
        }
    }

    async completeNudge(type) {
        const userId = localStorage.getItem('userId') || 'demo-user';
        
        try {
            const response = await this.callAPI('complete', type, null, userId);
            
            // Show success message
            alert(`🎉 ${response.data.message}\n\nSSE Impact: ${response.data.sseImpact}`);
            
            // Close modal
            this.closeModal(type);
            
            // Refresh page to show updated AUX balance
            window.location.reload();
        } catch (error) {
            alert('Error completing nudge: ' + error.message);
        }
    }

    closeModal(type) {
        document.getElementById(`${type}NudgeModal`).style.display = 'none';
        this.currentNudge = null;
    }

    showError(containerId, message) {
        document.getElementById(containerId).innerHTML = `
            <div class="alert alert-danger">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Error: ${message}
            </div>
        `;
    }

    async callAPI(action, nudgeType, context, userId) {
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                action,
                nudgeType,
                context,
                userId
            })
        });

        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }

        return await response.json();
    }
}

// Initialize globally
if (typeof window !== 'undefined') {
    window.NudgesWorkflow = NudgesWorkflow;
}
