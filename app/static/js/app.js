/**
 * DLP Chatbot - Main Application Logic
 * Handles chat interface, tab navigation, form submissions, and API communication
 */

class DLPChatbotApp {
    constructor() {
        this.currentTab = 'chat';
        this.conversationHistory = [];
        this.selectedRating = 0;
        this.apiBaseUrl = '/api';
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadInitialContent();
        console.log('DLP Chatbot initialized successfully');
    }

    /**
     * Cache DOM elements for better performance
     */
    cacheElements() {
        // Navigation
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        
        // Chat
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');
        
        // Forms
        this.assessmentForm = document.getElementById('assessmentForm');
        this.feedbackForm = document.getElementById('feedbackForm');
        
        // Buttons
        this.clearHistoryBtn = document.getElementById('clearHistory');
        this.toggleThemeBtn = document.getElementById('toggleTheme');
        
        // Content containers
        this.guidelinesContent = document.getElementById('guidelinesContent');
        this.historyContent = document.getElementById('historyContent');
        this.legalContent = document.getElementById('legalContent');
        this.assessmentResult = document.getElementById('assessmentResult');
        this.feedbackStatus = document.getElementById('feedbackStatus');
        this.notification = document.getElementById('notification');
        
        // Stars
        this.stars = document.querySelectorAll('.star');
        this.ratingInput = document.getElementById('rating');
    }

    /**
     * Attach event listeners to elements
     */
    attachEventListeners() {
        // Tab navigation
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Chat
        this.sendBtn.addEventListener('click', () => this.sendMessage());
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Forms
        this.assessmentForm.addEventListener('submit', (e) => this.handleAssessment(e));
        this.feedbackForm.addEventListener('submit', (e) => this.handleFeedback(e));

        // Buttons
        this.clearHistoryBtn.addEventListener('click', () => this.clearHistory());
        this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());

        // Rating stars
        this.stars.forEach(star => {
            star.addEventListener('click', () => this.setRating(star.dataset.value));
            star.addEventListener('mouseover', () => this.hoverRating(star.dataset.value));
            star.addEventListener('mouseout', () => this.unhoverRating());
        });
    }

    /**
     * Switch between tabs
     */
    switchTab(tabName) {
        // Update active tab button
        this.navTabs.forEach(tab => tab.classList.remove('active'));
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Show/hide tab content
        this.tabContents.forEach(content => content.classList.remove('active'));
        document.getElementById(tabName).classList.add('active');

        this.currentTab = tabName;

        // Load content based on tab
        if (tabName === 'guidelines') this.loadGuidelines();
        if (tabName === 'history') this.loadHistory();
        if (tabName === 'legal') this.loadLegalReferences();
    }

    /**
     * Send chat message
     */
    async sendMessage() {
        const message = this.userInput.value.trim();
        
        if (!message) {
            this.showNotification('Please enter a message', 'warning');
            return;
        }

        // Clear input
        this.userInput.value = '';

        // Add user message to UI
        this.addMessageToChat(message, 'user');

        try {
            // Send to API
            const response = await fetch(`${this.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`API error: ${response.statusText}`);
            }

            const data = await response.json();
            const botResponse = data.response || 'I could not process your message. Please try again.';
            
            // Add bot response to UI
            this.addMessageToChat(botResponse, 'bot');
            
            // Store in history
            this.conversationHistory.push({
                user: message,
                bot: botResponse,
                timestamp: new Date()
            });

        } catch (error) {
            console.error('Chat error:', error);
            this.addMessageToChat('Sorry, there was an error processing your message.', 'bot');
            this.showNotification('Error sending message', 'error');
        }
    }

    /**
     * Add message to chat display
     */
    addMessageToChat(message, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;
        
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = message;
        
        messageDiv.appendChild(bubble);
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    /**
     * Load guidelines content
     */
    async loadGuidelines() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/guidelines`);
            const data = await response.json();
            const guidelines = data.guidelines || [];

            this.guidelinesContent.innerHTML = '';
            guidelines.forEach(guideline => {
                const card = document.createElement('div');
                card.className = 'guideline-card';
                card.innerHTML = `
                    <h3>${guideline.title || 'Guideline'}</h3>
                    <p>${guideline.content || ''}</p>
                `;
                this.guidelinesContent.appendChild(card);
            });

            if (guidelines.length === 0) {
                this.guidelinesContent.innerHTML = '<p>No guidelines available.</p>';
            }
        } catch (error) {
            console.error('Error loading guidelines:', error);
            this.guidelinesContent.innerHTML = '<p>Error loading guidelines.</p>';
        }
    }

    /**
     * Load conversation history
     */
    loadHistory() {
        this.historyContent.innerHTML = '';

        if (this.conversationHistory.length === 0) {
            this.historyContent.innerHTML = '<p>No conversation history yet. Start chatting!</p>';
            return;
        }

        this.conversationHistory.forEach((item, index) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const timestamp = item.timestamp ? new Date(item.timestamp).toLocaleString() : 'Unknown time';
            
            historyItem.innerHTML = `
                <h4>Query ${index + 1}</h4>
                <p><strong>Your Question:</strong> ${item.user}</p>
                <p><strong>Response:</strong> ${item.bot}</p>
                <span class="timestamp">${timestamp}</span>
            `;
            
            this.historyContent.appendChild(historyItem);
        });
    }

    /**
     * Load legal references
     */
    async loadLegalReferences() {
        try {
            const response = await fetch(`${this.apiBaseUrl}/legal-references`);
            const data = await response.json();
            const references = data.references || [];

            this.legalContent.innerHTML = '';
            references.forEach(ref => {
                const item = document.createElement('div');
                item.className = 'legal-item';
                item.innerHTML = `
                    <h4>${ref.title || 'Reference'}</h4>
                    <p>${ref.content || ''}</p>
                `;
                this.legalContent.appendChild(item);
            });

            if (references.length === 0) {
                this.legalContent.innerHTML = '<p>No legal references available.</p>';
            }
        } catch (error) {
            console.error('Error loading legal references:', error);
            this.legalContent.innerHTML = '<p>Error loading legal references.</p>';
        }
    }

    /**
     * Handle assessment form submission
     */
    async handleAssessment(e) {
        e.preventDefault();

        const formData = {
            defect_type: document.getElementById('defectType').value,
            reported_within: document.getElementById('reportedWithin').value,
            severity: document.getElementById('severity').value,
            repair_cost: document.getElementById('repairCost').value,
            details: document.getElementById('details').value
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/assess`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            this.displayAssessmentResult(data);
            this.showNotification('Assessment completed', 'success');

        } catch (error) {
            console.error('Assessment error:', error);
            this.showNotification('Error running assessment', 'error');
        }
    }

    /**
     * Display assessment result
     */
    displayAssessmentResult(result) {
        const html = `
            <h3>Assessment Result</h3>
            <p><strong>Defect Type:</strong> ${result.defect_type || 'N/A'}</p>
            <p><strong>Liability Status:</strong> ${result.liability_status || 'N/A'}</p>
            <p><strong>Recommendation:</strong> ${result.recommendation || 'N/A'}</p>
            <span class="result-status ${result.severity || 'warning'}">${result.severity || 'Unknown'}</span>
        `;
        this.assessmentResult.innerHTML = html;
    }

    /**
     * Handle feedback form submission
     */
    async handleFeedback(e) {
        e.preventDefault();

        const feedbackData = {
            type: document.getElementById('feedbackType').value,
            rating: this.selectedRating,
            message: document.getElementById('feedbackText').value,
            email: document.getElementById('feedbackEmail').value
        };

        try {
            const response = await fetch(`${this.apiBaseUrl}/feedback`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(feedbackData)
            });

            if (response.ok) {
                this.feedbackForm.reset();
                this.selectedRating = 0;
                this.updateStarDisplay();
                this.showFeedbackStatus('Thank you for your feedback!', 'success');
                this.showNotification('Feedback submitted successfully', 'success');
            } else {
                this.showFeedbackStatus('Error submitting feedback', 'error');
            }

        } catch (error) {
            console.error('Feedback error:', error);
            this.showFeedbackStatus('Error submitting feedback', 'error');
        }
    }

    /**
     * Set rating from star click
     */
    setRating(value) {
        this.selectedRating = parseInt(value);
        this.ratingInput.value = this.selectedRating;
        this.updateStarDisplay();
    }

    /**
     * Hover rating display
     */
    hoverRating(value) {
        this.stars.forEach((star, index) => {
            if (index < value) {
                star.style.color = 'var(--accent-color)';
            } else {
                star.style.color = 'var(--text-muted)';
            }
        });
    }

    /**
     * Remove hover effect on rating
     */
    unhoverRating() {
        this.updateStarDisplay();
    }

    /**
     * Update star display based on selected rating
     */
    updateStarDisplay() {
        this.stars.forEach((star, index) => {
            if (index < this.selectedRating) {
                star.classList.add('active');
                star.style.color = 'var(--accent-color)';
            } else {
                star.classList.remove('active');
                star.style.color = 'var(--text-muted)';
            }
        });
    }

    /**
     * Show feedback status message
     */
    showFeedbackStatus(message, type) {
        this.feedbackStatus.className = `feedback-status show ${type}`;
        this.feedbackStatus.textContent = message;
        setTimeout(() => {
            this.feedbackStatus.classList.remove('show');
        }, 3000);
    }

    /**
     * Show notification toast
     */
    showNotification(message, type = 'info') {
        this.notification.className = `notification show ${type}`;
        this.notification.textContent = message;
        
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        if (confirm('Are you sure you want to clear all conversation history?')) {
            this.conversationHistory = [];
            this.chatMessages.innerHTML = '';
            this.showNotification('History cleared', 'success');
            this.loadHistory();
        }
    }

    /**
     * Toggle between light and dark theme
     */
    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        this.showNotification(`Switched to ${isDark ? 'dark' : 'light'} mode`, 'success');
    }

    /**
     * Load initial content and preferences
     */
    loadInitialContent() {
        // Load theme preference
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-mode');
        }

        // Load conversation history from localStorage if available
        const savedHistory = localStorage.getItem('dlp_history');
        if (savedHistory) {
            try {
                this.conversationHistory = JSON.parse(savedHistory);
            } catch (e) {
                console.warn('Could not load saved history');
            }
        }
    }
}

/**
 * Initialize app when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    window.dlpChatbot = new DLPChatbotApp();
});

/**
 * Save conversation history before leaving page
 */
window.addEventListener('beforeunload', () => {
    if (window.dlpChatbot && window.dlpChatbot.conversationHistory.length > 0) {
        localStorage.setItem('dlp_history', JSON.stringify(window.dlpChatbot.conversationHistory));
    }
});
