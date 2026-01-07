/**
 * DLP Chatbot - Main Application Logic
 * Merged: Chat History + Assessment + Guidelines + Feedback
 */

class DLPChatbotApp {
    constructor() {
        // Core State
        this.conversations = []; // Stores ALL conversations
        this.activeChatId = null; // ID of the currently open chat
        this.apiBaseUrl = '/api';
        this.selectedRating = 0;
        this.currentUtterance = null; // Track current speech object
        
        
        this.init();
    }

    init() {
        this.cacheElements();
        this.attachEventListeners();
        this.loadSavedData(); // Loads all chats from LocalStorage
    }
cacheElements() {
        // Navigation & Sidebar
        this.navTabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.conversationListEl = document.getElementById('conversationList');
        this.newChatBtn = document.getElementById('newChatBtn');
        
        // Chat Area
        this.userInput = document.getElementById('userInput');
        this.sendBtn = document.getElementById('sendBtn');
        this.chatMessages = document.getElementById('chatMessages');

        // Guidelines Area
        this.backToChatBtn = document.getElementById('backToChatBtn');

        // Forms
        this.assessmentForm = document.getElementById('assessmentForm');
        this.assessmentResult = document.getElementById('assessmentResult');
        this.feedbackForm = document.getElementById('feedbackForm');
        this.feedbackStatus = document.getElementById('feedbackStatus');
        this.stars = document.querySelectorAll('.star');
        this.ratingInput = document.getElementById('rating');

        // Legal Section
        this.legalContent = document.getElementById('legalContent');
        
        // General UI
        this.clearDataBtn = document.getElementById('clearAllData');
        this.toggleThemeBtn = document.getElementById('toggleTheme');
        this.notification = document.getElementById('notification');
    }

    attachEventListeners() {
        // Navigation
        this.navTabs.forEach(tab => {
            tab.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Chat Actions
        this.newChatBtn.addEventListener('click', () => this.startNewChat());
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        // Enter Key to Send
        this.userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) { 
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Auto-resize Textarea
        this.userInput.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';
        });

        // Back Button in Guidelines
        if (this.backToChatBtn) {
            this.backToChatBtn.addEventListener('click', () => this.switchTab('chat'));
        }

        // Form Submissions
        if (this.assessmentForm) {
            this.assessmentForm.addEventListener('submit', (e) => this.handleAssessment(e));
        }
        if (this.feedbackForm) {
            this.feedbackForm.addEventListener('submit', (e) => this.handleFeedback(e));
        }

        // Rating Stars
        this.stars.forEach(star => {
            star.addEventListener('click', () => this.setRating(star.dataset.value));
            star.addEventListener('mouseover', () => this.hoverRating(star.dataset.value));
            star.addEventListener('mouseout', () => this.unhoverRating());
        });

        // Settings
        if (this.clearDataBtn) this.clearDataBtn.addEventListener('click', () => this.clearAllData());
        if (this.toggleThemeBtn) this.toggleThemeBtn.addEventListener('click', () => this.toggleTheme());
    }

    // ==========================================================
    // 1. CONVERSATION MANAGEMENT (History, Save, Load)
    // ==========================================================

    loadSavedData() {
        // Load Theme
        if (localStorage.getItem('theme') === 'light') {
            document.body.classList.add('light-mode');
        }

        // Load Conversations
        const saved = localStorage.getItem('dlp_conversations');
        if (saved) {
            try {
                this.conversations = JSON.parse(saved);
            } catch (e) {
                console.error("Error loading history", e);
                this.conversations = [];
            }
        }

        // Open recent chat or create new
        if (this.conversations.length > 0) {
            this.loadChat(this.conversations[0].id);
        } else {
            this.startNewChat();
        }
        
        this.renderSidebarHistory();
    }

    saveData() {
        localStorage.setItem('dlp_conversations', JSON.stringify(this.conversations));
        this.renderSidebarHistory();
    }

    startNewChat() {
        const newChatId = Date.now();
        const newChat = {
            id: newChatId,
            title: "New Chat",
            messages: []
        };

        this.conversations.unshift(newChat);
        this.loadChat(newChatId);
        this.saveData();
        this.switchTab('chat');
    }

    loadChat(chatId) {
        this.stopSpeaking();
        this.activeChatId = chatId;
        const chat = this.conversations.find(c => c.id === chatId);
        if (!chat) return;

        this.chatMessages.innerHTML = '';
        chat.messages.forEach(msg => {
            this.renderMessageHTML(msg.text, msg.sender);
        });
        
        this.renderSidebarHistory();
    }

    renderSidebarHistory() {
        if(!this.conversationListEl) return;
        this.conversationListEl.innerHTML = '';

        this.conversations.forEach(chat => {
            const row = document.createElement('div');
            row.className = `history-item-row ${chat.id === this.activeChatId ? 'active' : ''}`;
            
            row.addEventListener('click', (e) => {
                if (e.target.closest('.history-actions') || e.target.tagName === 'INPUT') return;
                this.loadChat(chat.id);
                this.switchTab('chat');
            });

            const titleSpan = document.createElement('span');
            titleSpan.className = 'history-title-text';
            titleSpan.textContent = chat.title || 'New Chat';
            titleSpan.addEventListener('dblclick', () => this.enableRenaming(chat.id, titleSpan));

            const actionsDiv = document.createElement('div');
            actionsDiv.className = 'history-actions';

            const editBtn = document.createElement('button');
            editBtn.className = 'btn-icon-action';
            editBtn.innerHTML = '✏️';
            editBtn.title = "Rename Chat";
            editBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.enableRenaming(chat.id, titleSpan);
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'btn-icon-action btn-delete';
            deleteBtn.innerHTML = '🗑️';
            deleteBtn.title = "Delete Chat";
            deleteBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.deleteChat(chat.id);
            });

            actionsDiv.appendChild(editBtn);
            actionsDiv.appendChild(deleteBtn);
            row.appendChild(titleSpan);
            row.appendChild(actionsDiv);
            this.conversationListEl.appendChild(row);
        });
    }

    deleteChat(chatId) {
        if (!confirm('Are you sure you want to delete this conversation?')) return;
        this.conversations = this.conversations.filter(c => c.id !== chatId);
        
        if (chatId === this.activeChatId) {
            if (this.conversations.length > 0) {
                this.loadChat(this.conversations[0].id);
            } else {
                this.startNewChat();
                return;
            }
        }
        this.saveData();
    }

    enableRenaming(chatId, titleElement) {
        const currentTitle = titleElement.textContent;
        const input = document.createElement('input');
        input.type = 'text';
        input.className = 'history-rename-input';
        input.value = currentTitle;
        
        const save = () => {
            const newTitle = input.value.trim();
            if (newTitle) {
                this.updateChatTitle(chatId, newTitle);
            } else {
                this.renderSidebarHistory();
            }
        };

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') input.blur();
            if (e.key === 'Escape') this.renderSidebarHistory();
        });
        input.addEventListener('blur', save);

        titleElement.innerHTML = '';
        titleElement.appendChild(input);
        input.focus();
    }

    updateChatTitle(chatId, newTitle) {
        const chat = this.conversations.find(c => c.id === chatId);
        if (chat) {
            chat.title = newTitle;
            this.saveData();
        }
    }

    // ==========================================================
    // 2. MESSAGING LOGIC
    // ==========================================================
     async sendMessage() {
        const text = this.userInput.value.trim();
        if (!text) return;

        // Reset input height
        this.userInput.style.height = 'auto';
        this.userInput.value = '';

        // 1. Show User Message
        this.addMessageToActiveChat(text, 'user', false);

        // 2. Show Typing Indicator
        this.showTypingIndicator();

        try {
            // FIX IS HERE: We interpret the URL directly as '/api/chat'
            // We removed the ${endpoint} variable that was causing the error.
            const response = await fetch('/api/chat', { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: text })
            });

            const data = await response.json();
            
            if (data.error) {
                throw new Error(data.error);
            }

            const botReply = data.response || "I didn't understand that.";

            // 3. Show Bot Message
            this.removeTypingIndicator();
            this.addMessageToActiveChat(botReply, 'bot', true);

        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator();
            this.addMessageToActiveChat(`Error: ${error.message || "Connection failed"}`, 'bot', false);
        }
    }
    /**
     * Add message to data and UI
     * @param {string} text - The message text
     * @param {string} sender - 'user' or 'bot'
     * @param {boolean} animate - Whether to use typewriter effect
     */
    addMessageToActiveChat(text, sender, animate = false) {
        const chat = this.conversations.find(c => c.id === this.activeChatId);
        if (!chat) return;

        // Save to memory
        chat.messages.push({ text, sender, timestamp: new Date() });

        // Auto-title if new chat
        if (chat.messages.length === 1 && sender === 'user') {
            chat.title = text.substring(0, 30) + (text.length > 30 ? '...' : '');
        }

        this.saveData();

        // Render to screen
        if (animate && sender === 'bot') {
            this.renderMessageTypewriter(text);
        } else {
            this.renderMessageHTML(text, sender);
        }
    }

    renderMessageHTML(message, sender) {
        const messageDiv = this.createMessageStructure(message, sender);
        this.chatMessages.appendChild(messageDiv);
        this.scrollToBottom();
    }

    /**
     * Typewriter Render (Gradual)
     */
    renderMessageTypewriter(text) {
        // 1. Create the empty shell
        const messageDiv = this.createMessageStructure('', 'bot'); // Empty text first
        const bubble = messageDiv.querySelector('.message-bubble');
        const readBtn = messageDiv.querySelector('.btn-read-aloud');
        
        // Hide the speaker icon while typing
        if(readBtn) readBtn.classList.add('hidden');

        this.chatMessages.appendChild(messageDiv);
        
        // 2. Start Typing Loop
        let i = 0;
        const speed = 15; // Speed in ms (lower is faster)

        const typeLoop = () => {
            if (i < text.length) {
                bubble.textContent += text.charAt(i);
                i++;
                this.scrollToBottom(); // Keep scrolling as text grows
                setTimeout(typeLoop, speed);
            } else {
                // Done typing: Show speaker button
                if(readBtn) readBtn.classList.remove('hidden');
                
                // Re-attach the click listener for the speaker (since we just revealed it)
                // Note: The listener is already attached in createMessageStructure, 
                // we just need to update the text payload if needed, but here it's static.
            }
        };

        typeLoop();
    }

    /**
     * Helper to create the HTML structure
     */
    createMessageStructure(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `chat-message ${sender}`;

        // Avatar
        if (sender === 'bot') {
            const avatar = document.createElement('div');
            avatar.className = 'chat-avatar';
            avatar.innerHTML = '🤖';
            messageDiv.appendChild(avatar);
        }

        // Bubble
        const bubble = document.createElement('div');
        bubble.className = 'message-bubble';
        bubble.textContent = text;
        messageDiv.appendChild(bubble);

        // Speaker Button
        if (sender === 'bot') {
            const readBtn = document.createElement('button');
            readBtn.className = 'btn-read-aloud';
            readBtn.innerHTML = '🔊';
            readBtn.title = "Read Aloud";
            
            // Attach Speech Event (using the full text passed in initially)
            // Note: For typewriter, the text variable here is empty initially, 
            // so we need to ensure the click handler grabs the *current* text from the bubble.
            readBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                // Grab text dynamically from the bubble in case it was typed in later
                const finalText = bubble.textContent; 
                this.toggleSpeech(finalText, readBtn, messageDiv);
            });

            messageDiv.appendChild(readBtn);
        }

        return messageDiv;
    }

    // --- TYPING INDICATORS ---

    showTypingIndicator() {
        const div = document.createElement('div');
        div.id = 'typingIndicator';
        div.className = 'chat-message bot';
        div.innerHTML = `
            <div class="chat-avatar">🤖</div>
            <div class="typing-indicator">
                <div class="dot"></div>
                <div class="dot"></div>
                <div class="dot"></div>
            </div>
        `;
        this.chatMessages.appendChild(div);
        this.scrollToBottom();
    }

    removeTypingIndicator() {
        const el = document.getElementById('typingIndicator');
        if (el) el.remove();
    }

    scrollToBottom() {
        const chatContainer = this.chatMessages.parentElement;
        chatContainer.scrollTop = chatContainer.scrollHeight;
    }

    // ==========================================================
    // 3. ASSESSMENT & FORMS LOGIC (Restored)
    // ==========================================================

    async handleAssessment(e) {
        e.preventDefault();
        
        // Basic data gathering
        const formData = {
            defect_type: document.getElementById('defectType').value,
            reported_within: document.getElementById('reportedWithin').value,
            severity: document.getElementById('severity').value,
            repair_cost: document.getElementById('repairCost').value
        };

        // Simple mock response if backend isn't ready
        // You can replace this with a real fetch call if your Python backend handles '/assess'
        this.displayAssessmentResult({
            defect_type: formData.defect_type,
            liability_status: formData.reported_within === 'yes' ? 'Developer Likely Liable' : 'Owner Likely Liable',
            recommendation: 'Please consult the specific clause in your SPA.',
            severity: formData.severity
        });
    }

    displayAssessmentResult(result) {
        const html = `
            <h3>Assessment Result</h3>
            <p><strong>Defect Type:</strong> ${result.defect_type}</p>
            <p><strong>Liability Status:</strong> ${result.liability_status}</p>
            <p><strong>Recommendation:</strong> ${result.recommendation}</p>
            <span class="result-status ${result.severity}">${result.severity.toUpperCase()}</span>
        `;
        this.assessmentResult.innerHTML = html;
        this.showNotification('Assessment Completed', 'success');
    }

    async handleFeedback(e) {
        e.preventDefault();
        // Just a mock success for now
        this.feedbackForm.reset();
        this.selectedRating = 0;
        this.updateStarDisplay();
        this.showNotification('Feedback Submitted!', 'success');
    }

    // ==========================================================
    // 4. UTILITIES (Tabs, Theme, Ratings, Notifications)
    // ==========================================================

    switchTab(tabName) {
        this.stopSpeaking();
        this.navTabs.forEach(tab => tab.classList.remove('active'));
        const activeBtn = document.querySelector(`.nav-tab[data-tab="${tabName}"]`);
        if(activeBtn) activeBtn.classList.add('active');

        this.tabContents.forEach(content => content.classList.remove('active'));
        const activeContent = document.getElementById(tabName);
        if(activeContent) activeContent.classList.add('active');

        // Scroll to bottom if opening chat
        if (tabName === 'chat') {
            const chatContainer = document.querySelector('.chat-container');
            if(chatContainer) {
                setTimeout(() => chatContainer.scrollTop = chatContainer.scrollHeight, 50);
            }
        }
    }

    toggleTheme() {
        document.body.classList.toggle('light-mode');
        const isDark = !document.body.classList.contains('light-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    }

    clearAllData() {
        if(confirm("Delete all chat history?")) {
            this.conversations = [];
            localStorage.removeItem('dlp_conversations');
            this.startNewChat();
        }
    }

    showNotification(message, type = 'info') {
        if (!this.notification) return;
        this.notification.className = `notification show ${type}`;
        this.notification.textContent = message;
        setTimeout(() => {
            this.notification.classList.remove('show');
        }, 3000);
    }

    // Rating Logic
    setRating(value) {
        this.selectedRating = parseInt(value);
        if(this.ratingInput) this.ratingInput.value = this.selectedRating;
        this.updateStarDisplay();
    }
    hoverRating(value) {
        this.stars.forEach((star, index) => {
            star.style.color = index < value ? 'var(--accent-color)' : 'var(--text-muted)';
        });
    }
    unhoverRating() {
        this.updateStarDisplay();
    }
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
     * Stop any currently playing speech
     */
    stopSpeaking() {
        if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
            window.speechSynthesis.cancel();
        }
        
        // Reset all icons back to speaker
        document.querySelectorAll('.btn-read-aloud').forEach(btn => {
            btn.textContent = '🔊';
            btn.classList.remove('speaking');
            btn.title = "Read Aloud";
        });

        // Remove highlight from bubbles
        document.querySelectorAll('.chat-message').forEach(msg => {
            msg.classList.remove('reading');
        });

        this.currentUtterance = null;
    }

    /**
     * Toggle Text-to-Speech
     */
    toggleSpeech(text, btn, messageDiv) {
        // If this specific message is already speaking, stop it.
        if (this.currentUtterance && btn.classList.contains('speaking')) {
            this.stopSpeaking();
            return;
        }

        // If something else is speaking, stop it first.
        this.stopSpeaking();

        // Create new speech utterance
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Optional: Select a voice (usually the default is fine, but you can customize)
        // const voices = window.speechSynthesis.getVoices();
        // utterance.voice = voices.find(voice => voice.lang.includes('en')) || null;

        // Events
        utterance.onstart = () => {
            btn.textContent = '⏹️'; // Switch to Stop icon
            btn.classList.add('speaking');
            messageDiv.classList.add('reading');
        };

        utterance.onend = () => {
            this.stopSpeaking(); // Reset icons when done
        };

        utterance.onerror = (e) => {
            console.error('Speech error:', e);
            this.stopSpeaking();
        };

        this.currentUtterance = utterance;
        window.speechSynthesis.speak(utterance);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    window.dlpChatbot = new DLPChatbotApp();
});