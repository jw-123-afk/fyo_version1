# DLP Chatbot Frontend - Quick Start Guide

## 📋 What Changed?

Your DLP Chatbot frontend has been completely redesigned with:
- ✅ **100% English text** - No Malay mixed in anymore
- ✅ **Clean code** - Semantic HTML, pure CSS, vanilla JavaScript
- ✅ **No frameworks** - No Tailwind, Bootstrap, or other dependencies
- ✅ **Better organization** - 6 clear tabs with dedicated sections
- ✅ **Professional design** - Modern dark/light theme support
- ✅ **Responsive layout** - Works perfectly on mobile, tablet, desktop

## 🚀 How to Run

### 1. Install Dependencies
```bash
cd /usr/src/app
pip install flask flask-cors python-dotenv
```

### 2. Start the Server
```bash
cd /usr/src/app/app
python start_chatbot.py
```

### 3. Open in Browser
Navigate to: **http://localhost:5000**

## 📱 Interface Overview

### Sidebar Navigation (Left)
- **Logo**: DLP Chatbot branding
- **6 Tab Buttons**: Chat, Guidelines, Assessment, History, Legal Refs, Feedback
- **Utility Buttons**: Clear History, Toggle Theme

### Main Content Area (Right)
- **Chat Tab**: Interactive chatbot interface
  - Message history display
  - Input field with send button
  - Real-time conversation
  
- **Guidelines Tab**: DLP information cards
  - Grid layout of guideline cards
  - Each card has title and description
  
- **Assessment Tab**: Evaluation form
  - Defect type selector
  - Reporting status selector
  - Severity level selector
  - Repair cost input
  - Details textarea
  - Submit button
  - Results display area
  
- **History Tab**: Conversation history
  - Shows all previous queries
  - Displays both user and bot messages
  - Timestamps for each exchange
  - Easy review of past conversations
  
- **Legal References Tab**: Malaysian law database
  - Legal documents and references
  - Title and content for each reference
  - Professional formatting
  
- **Feedback Tab**: Rating and suggestions
  - Feedback type selector
  - 5-star rating system
  - Feedback message textarea
  - Optional email field
  - Submit feedback button

## ⌨️ Keyboard Shortcuts

- **Enter** in chat input: Send message
- **Tab**: Navigate through form elements
- **Click stars**: Set rating (1-5)

## 🎨 Features

### Theme Toggle
Click the **🌙 Theme** button to switch between dark and light modes
- Dark mode: Default (professional blue-gray)
- Light mode: Light gray with dark text
- Selection saved to browser (persists on reload)

### Clear History
Click **Clear History** to reset conversation history
- Confirmation dialog appears
- History cleared from chat display
- Data removed from browser storage

### Notifications
- Toast messages appear at bottom-right
- Success (green), Error (red), Warning (orange)
- Auto-hide after 3 seconds

### Star Rating
- Hover over stars to preview rating
- Click to select rating
- Selected stars turn gold
- Rating reflected in feedback submission

## 📊 Technical Details

### Files Modified
1. **`app/templates/index.html`** (190 lines, ~7 KB)
   - Complete rewrite with semantic HTML5
   - All English text
   - No Tailwind CSS

2. **`app/static/css/style.css`** (758 lines, ~28 KB)
   - Pure CSS3 with variables
   - Dark/light mode support
   - Responsive design
   - Smooth animations

3. **`app/static/js/app.js`** (471 lines, ~17 KB)
   - ES6+ class-based approach
   - Comprehensive documentation
   - Event delegation
   - LocalStorage persistence

### Backend Compatibility
- ✅ All backend Python modules unchanged
- ✅ All API endpoints functional
- ✅ Database and storage working as before
- ✅ No breaking changes

## 🔧 Troubleshooting

### Server Won't Start
```bash
# Check if Flask is installed
pip install flask

# Try running from correct directory
cd /usr/src/app/app
python start_chatbot.py
```

### Frontend Not Loading
- Clear browser cache (Ctrl+Shift+Delete)
- Check browser console (F12) for errors
- Ensure server is running on port 5000
- Try different browser if issues persist

### Chat API Not Working
- Check server console for error messages
- Verify `/api/chat` endpoint is available
- Ensure message format is correct: `{"message": "your question"}`

### Styles Not Loading
- Check if `static/css/style.css` exists
- Verify CSS file size (~28 KB)
- Check browser Network tab (F12) for 404 errors
- Clear browser cache if needed

### JavaScript Errors
- Open browser console (F12)
- Check for errors in red text
- Verify `static/js/app.js` exists
- Ensure no errors in network loading

## 📝 API Endpoints

### Chat
```
POST /api/chat
Body: {"message": "Your question"}
```

### Guidelines
```
GET /api/guidelines
```

### Assessment
```
POST /api/assess
Body: {
  "defect_type": "structural|finishing|electrical|plumbing|other",
  "reported_within": "yes|no",
  "severity": "minor|moderate|severe",
  "repair_cost": 0,
  "details": "description"
}
```

### Legal References
```
GET /api/legal-references
```

### Feedback
```
POST /api/feedback
Body: {
  "type": "suggestion|bug|praise|other",
  "rating": 1-5,
  "message": "Your feedback",
  "email": "optional@email.com"
}
```

## 🎯 Next Steps

1. ✅ Start server and test in browser
2. ✅ Try each tab to verify functionality
3. ✅ Test chat with sample questions
4. ✅ Submit a test assessment
5. ✅ Leave feedback with rating
6. ✅ Check conversation history
7. ✅ Toggle dark/light mode
8. ✅ Test on mobile (open in phone browser)

## 📞 Support

If you encounter issues:
1. Check this guide first
2. Review browser console (F12)
3. Check server console output
4. Verify all files exist in correct locations
5. Ensure Python dependencies installed

## ✨ Summary

Your DLP Chatbot frontend is now:
- **100% English** with clean, professional text
- **Framework-free** - Pure HTML, CSS, JavaScript
- **Responsive** - Works on all devices
- **Accessible** - Keyboard navigation, semantic HTML
- **Performant** - Small file sizes, optimized code
- **Maintainable** - Well-organized, documented code

Enjoy your improved DLP Chatbot! 🎉
