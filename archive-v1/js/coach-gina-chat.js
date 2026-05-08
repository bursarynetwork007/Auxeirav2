/**
 * Coach Gina Chat Interface
 * AI-powered startup mentor using Claude API
 */

class CoachGinaChat {
    constructor(apiKey, apiEndpoint) {
        this.apiKey = apiKey;
        this.apiEndpoint = apiEndpoint || '/api/coach-gina';
        this.conversationHistory = [];
        this.isOpen = false;
        this.isTyping = false;
        this.founderContext = {};
        
        this.init();
    }

    init() {
        this.createChatUI();
        this.attachEventListeners();
        this.loadConversationHistory();
    }

    createChatUI() {
        const chatHTML = `
            <!-- Coach Gina Chat Widget -->
            <div id="coachGinaWidget" class="coach-gina-widget">
                <!-- Chat Button -->
                <button id="coachGinaChatBtn" class="coach-gina-btn" title="Chat with Coach Gina">
                    <i class="fas fa-comments"></i>
                    <span class="notification-badge" id="ginaNotificationBadge" style="display: none;">1</span>
                </button>

                <!-- Chat Window -->
                <div id="coachGinaChatWindow" class="coach-gina-chat-window" style="display: none;">
                    <!-- Header -->
                    <div class="chat-header">
                        <div class="d-flex align-items-center">
                            <div class="coach-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="ms-3">
                                <h6 class="mb-0">Coach Gina</h6>
                                <small class="text-secondary">AI Startup Mentor</small>
                            </div>
                        </div>
                        <div class="header-actions">
                            <button class="btn-icon" id="minimizeChat" title="Minimize">
                                <i class="fas fa-minus"></i>
                            </button>
                            <button class="btn-icon" id="closeChat" title="Close">
                                <i class="fas fa-times"></i>
                            </button>
                        </div>
                    </div>

                    <!-- Messages Container -->
                    <div class="chat-messages" id="chatMessages">
                        <!-- Welcome Message -->
                        <div class="message gina-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <div class="message-bubble">
                                    <p class="mb-2">Hey there! I'm Coach Gina, your AI startup mentor. 👋</p>
                                    <p class="mb-0">I'm here to help you navigate the chaotic early-stage journey with practical guidance, emotional support, and brutal clarity when you need it.</p>
                                </div>
                                <small class="message-time">Just now</small>
                            </div>
                        </div>
                    </div>

                    <!-- Typing Indicator -->
                    <div class="typing-indicator" id="typingIndicator" style="display: none;">
                        <div class="message gina-message">
                            <div class="message-avatar">
                                <i class="fas fa-robot"></i>
                            </div>
                            <div class="message-content">
                                <div class="typing-dots">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Input Area -->
                    <div class="chat-input-area">
                        <div class="context-pills" id="contextPills">
                            <!-- Dynamic context pills will be inserted here -->
                        </div>
                        <div class="input-wrapper">
                            <textarea 
                                id="chatInput" 
                                class="chat-input" 
                                placeholder="Ask Coach Gina anything about your startup..."
                                rows="1"
                            ></textarea>
                            <button id="sendMessage" class="btn-send" title="Send message">
                                <i class="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div class="quick-actions" id="quickActions">
                            <button class="quick-action-btn" data-action="metrics">
                                <i class="fas fa-chart-line"></i> Review Metrics
                            </button>
                            <button class="quick-action-btn" data-action="funding">
                                <i class="fas fa-money-bill-wave"></i> Funding Advice
                            </button>
                            <button class="quick-action-btn" data-action="growth">
                                <i class="fas fa-rocket"></i> Growth Strategy
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <style>
                /* Coach Gina Widget Styles */
                .coach-gina-widget {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    z-index: 9999;
                }

                .coach-gina-btn {
                    width: 60px;
                    height: 60px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border: none;
                    color: white;
                    font-size: 24px;
                    cursor: pointer;
                    box-shadow: 0 8px 24px rgba(59, 130, 246, 0.4);
                    transition: all 0.3s ease;
                    position: relative;
                }

                .coach-gina-btn:hover {
                    transform: scale(1.1);
                    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.6);
                }

                .notification-badge {
                    position: absolute;
                    top: -4px;
                    right: -4px;
                    background: #ef4444;
                    color: white;
                    border-radius: 50%;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: bold;
                    border: 2px solid white;
                }

                .coach-gina-chat-window {
                    position: fixed;
                    bottom: 100px;
                    right: 24px;
                    width: 420px;
                    height: 600px;
                    background: rgba(10, 10, 10, 0.98);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                    display: flex;
                    flex-direction: column;
                    animation: slideUp 0.3s ease;
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .chat-header {
                    padding: 16px 20px;
                    background: rgba(59, 130, 246, 0.1);
                    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 16px 16px 0 0;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .coach-avatar {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 20px;
                }

                .header-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-icon {
                    background: transparent;
                    border: none;
                    color: #a1a1aa;
                    cursor: pointer;
                    padding: 4px 8px;
                    border-radius: 4px;
                    transition: all 0.2s ease;
                }

                .btn-icon:hover {
                    background: rgba(255, 255, 255, 0.1);
                    color: white;
                }

                .chat-messages {
                    flex: 1;
                    overflow-y: auto;
                    padding: 20px;
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .chat-messages::-webkit-scrollbar {
                    width: 6px;
                }

                .chat-messages::-webkit-scrollbar-track {
                    background: rgba(255, 255, 255, 0.05);
                }

                .chat-messages::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.2);
                    border-radius: 3px;
                }

                .message {
                    display: flex;
                    gap: 12px;
                    animation: fadeIn 0.3s ease;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(10px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .message-avatar {
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-size: 16px;
                    flex-shrink: 0;
                }

                .user-message .message-avatar {
                    background: linear-gradient(135deg, #10b981, #059669);
                }

                .message-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .message-bubble {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: white;
                    line-height: 1.5;
                }

                .user-message .message-bubble {
                    background: rgba(59, 130, 246, 0.2);
                    border-color: rgba(59, 130, 246, 0.3);
                }

                .message-time {
                    color: #71717a;
                    font-size: 11px;
                    padding-left: 4px;
                }

                .typing-indicator {
                    padding: 0 20px;
                }

                .typing-dots {
                    display: flex;
                    gap: 4px;
                    padding: 12px 16px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    width: fit-content;
                }

                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #3b82f6;
                    animation: typing 1.4s infinite;
                }

                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }

                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }

                @keyframes typing {
                    0%, 60%, 100% {
                        opacity: 0.3;
                        transform: translateY(0);
                    }
                    30% {
                        opacity: 1;
                        transform: translateY(-8px);
                    }
                }

                .chat-input-area {
                    border-top: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 16px;
                    background: rgba(0, 0, 0, 0.3);
                }

                .context-pills {
                    display: flex;
                    gap: 8px;
                    margin-bottom: 12px;
                    flex-wrap: wrap;
                }

                .context-pill {
                    background: rgba(59, 130, 246, 0.2);
                    border: 1px solid rgba(59, 130, 246, 0.3);
                    color: #60a5fa;
                    padding: 4px 12px;
                    border-radius: 12px;
                    font-size: 12px;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .input-wrapper {
                    display: flex;
                    gap: 8px;
                    align-items: flex-end;
                }

                .chat-input {
                    flex: 1;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    padding: 12px 16px;
                    color: white;
                    resize: none;
                    max-height: 120px;
                    font-size: 14px;
                    font-family: inherit;
                }

                .chat-input:focus {
                    outline: none;
                    border-color: #3b82f6;
                    background: rgba(255, 255, 255, 0.08);
                }

                .chat-input::placeholder {
                    color: #71717a;
                }

                .btn-send {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
                    border: none;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .btn-send:hover {
                    transform: scale(1.1);
                    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                }

                .btn-send:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                    transform: none;
                }

                .quick-actions {
                    display: flex;
                    gap: 8px;
                    margin-top: 12px;
                    flex-wrap: wrap;
                }

                .quick-action-btn {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    color: #a1a1aa;
                    padding: 6px 12px;
                    border-radius: 8px;
                    font-size: 12px;
                    cursor: pointer;
                    transition: all 0.2s ease;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .quick-action-btn:hover {
                    background: rgba(59, 130, 246, 0.2);
                    border-color: rgba(59, 130, 246, 0.3);
                    color: #60a5fa;
                }

                /* Mobile Responsive */
                @media (max-width: 768px) {
                    .coach-gina-chat-window {
                        width: calc(100vw - 32px);
                        height: calc(100vh - 120px);
                        right: 16px;
                        bottom: 90px;
                    }
                }
            </style>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    attachEventListeners() {
        // Toggle chat window
        document.getElementById('coachGinaChatBtn').addEventListener('click', () => {
            this.toggleChat();
        });

        // Close chat
        document.getElementById('closeChat').addEventListener('click', () => {
            this.closeChat();
        });

        // Minimize chat
        document.getElementById('minimizeChat').addEventListener('click', () => {
            this.minimizeChat();
        });

        // Send message
        document.getElementById('sendMessage').addEventListener('click', () => {
            this.sendMessage();
        });

        // Enter to send (Shift+Enter for new line)
        document.getElementById('chatInput').addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize textarea
        document.getElementById('chatInput').addEventListener('input', (e) => {
            e.target.style.height = 'auto';
            e.target.style.height = e.target.scrollHeight + 'px';
        });

        // Quick actions
        document.querySelectorAll('.quick-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                this.handleQuickAction(action);
            });
        });
    }

    toggleChat() {
        const chatWindow = document.getElementById('coachGinaChatWindow');
        const isVisible = chatWindow.style.display !== 'none';
        
        if (isVisible) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        document.getElementById('coachGinaChatWindow').style.display = 'flex';
        document.getElementById('ginaNotificationBadge').style.display = 'none';
        this.isOpen = true;
        
        // Focus input
        setTimeout(() => {
            document.getElementById('chatInput').focus();
        }, 100);
    }

    closeChat() {
        document.getElementById('coachGinaChatWindow').style.display = 'none';
        this.isOpen = false;
    }

    minimizeChat() {
        this.closeChat();
    }

    async sendMessage() {
        const input = document.getElementById('chatInput');
        const message = input.value.trim();
        
        if (!message || this.isTyping) return;
        
        // Add user message to UI
        this.addMessage(message, 'user');
        
        // Clear input
        input.value = '';
        input.style.height = 'auto';
        
        // Show typing indicator
        this.showTyping();
        
        try {
            // Send to Coach Gina API
            const response = await this.callCoachGinaAPI(message);
            
            // Hide typing indicator
            this.hideTyping();
            
            // Add Gina's response
            this.addMessage(response, 'gina');
            
            // Save to history
            this.saveConversation(message, response);
            
        } catch (error) {
            console.error('Error calling Coach Gina API:', error);
            this.hideTyping();
            this.addMessage(
                "I'm having trouble connecting right now. Please try again in a moment.",
                'gina',
                true
            );
        }
    }

    addMessage(content, sender, isError = false) {
        const messagesContainer = document.getElementById('chatMessages');
        const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        const messageHTML = `
            <div class="message ${sender}-message">
                <div class="message-avatar">
                    <i class="fas fa-${sender === 'user' ? 'user' : 'robot'}"></i>
                </div>
                <div class="message-content">
                    <div class="message-bubble ${isError ? 'error' : ''}">
                        ${this.formatMessage(content)}
                    </div>
                    <small class="message-time">${timestamp}</small>
                </div>
            </div>
        `;
        
        messagesContainer.insertAdjacentHTML('beforeend', messageHTML);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    formatMessage(content) {
        // Convert markdown-style formatting to HTML
        return content
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>');
    }

    showTyping() {
        this.isTyping = true;
        document.getElementById('typingIndicator').style.display = 'block';
        document.getElementById('sendMessage').disabled = true;
        
        const messagesContainer = document.getElementById('chatMessages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    hideTyping() {
        this.isTyping = false;
        document.getElementById('typingIndicator').style.display = 'none';
        document.getElementById('sendMessage').disabled = false;
    }

    async callCoachGinaAPI(message) {
        // Prepare founder context
        const context = this.buildFounderContext();
        
        const response = await fetch(this.apiEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: message,
                context: context,
                conversationHistory: this.conversationHistory.slice(-10) // Last 10 messages
            })
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        return data.response;
    }

    buildFounderContext() {
        // Get current dashboard data
        return {
            stage: this.founderContext.stage || 'Early traction',
            industry: this.founderContext.industry || 'FinTech',
            geography: this.founderContext.geography || 'Unknown',
            teamSize: this.founderContext.teamSize || 0,
            runway: this.founderContext.runway || 0,
            metrics: {
                mrr: this.founderContext.mrr || 0,
                customers: this.founderContext.customers || 0,
                cac: this.founderContext.cac || 0,
                ltv: this.founderContext.ltv || 0,
                churnRate: this.founderContext.churnRate || 0,
                nps: this.founderContext.nps || 0
            },
            recentMilestones: this.founderContext.recentMilestones || [],
            activeChallenges: this.founderContext.activeChallenges || []
        };
    }

    updateFounderContext(context) {
        this.founderContext = { ...this.founderContext, ...context };
        this.updateContextPills();
    }

    updateContextPills() {
        const pillsContainer = document.getElementById('contextPills');
        const pills = [];
        
        if (this.founderContext.stage) {
            pills.push(`<span class="context-pill"><i class="fas fa-layer-group"></i>${this.founderContext.stage}</span>`);
        }
        if (this.founderContext.industry) {
            pills.push(`<span class="context-pill"><i class="fas fa-industry"></i>${this.founderContext.industry}</span>`);
        }
        if (this.founderContext.mrr) {
            pills.push(`<span class="context-pill"><i class="fas fa-dollar-sign"></i>$${this.founderContext.mrr} MRR</span>`);
        }
        
        pillsContainer.innerHTML = pills.join('');
    }

    handleQuickAction(action) {
        const quickMessages = {
            metrics: "Can you review my current metrics and give me insights on what to focus on?",
            funding: "I'm preparing for fundraising. What should I prioritize to improve my chances?",
            growth: "What growth strategies would you recommend based on my current stage?"
        };
        
        const message = quickMessages[action];
        if (message) {
            document.getElementById('chatInput').value = message;
            this.sendMessage();
        }
    }

    saveConversation(userMessage, ginaResponse) {
        this.conversationHistory.push({
            user: userMessage,
            gina: ginaResponse,
            timestamp: new Date().toISOString()
        });
        
        // Save to localStorage
        localStorage.setItem('coachGinaHistory', JSON.stringify(this.conversationHistory));
    }

    loadConversationHistory() {
        const saved = localStorage.getItem('coachGinaHistory');
        if (saved) {
            try {
                this.conversationHistory = JSON.parse(saved);
                
                // Restore last 5 messages to UI
                const recentMessages = this.conversationHistory.slice(-5);
                recentMessages.forEach(msg => {
                    this.addMessage(msg.user, 'user');
                    this.addMessage(msg.gina, 'gina');
                });
            } catch (e) {
                console.error('Error loading conversation history:', e);
            }
        }
    }

    showNotification() {
        if (!this.isOpen) {
            document.getElementById('ginaNotificationBadge').style.display = 'flex';
        }
    }
}

// Initialize Coach Gina when DOM is ready
if (typeof window !== 'undefined') {
    window.CoachGinaChat = CoachGinaChat;
}
