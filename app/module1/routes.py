from flask import Blueprint, request, jsonify
import json
from datetime import datetime

# Safe Imports
try:
    from ..chatbot_core import process_query
    from ..conversation_logger import save_history
    from ..dlp_knowledge_base import get_all_guidelines, get_all_legal_references
    from ..feedback_manager import save_feedback
except ImportError as e:
    print(f"IMPORT ERROR: {e}")
    # Fallback to prevent crash during startup
    process_query = lambda x: f"System Error: Backend modules missing. {str(e)}"
    save_history = lambda x: None
    get_all_guidelines = lambda: []
    get_all_legal_references = lambda: []

module1 = Blueprint('module1', __name__, url_prefix='/api')

# --- CHAT ENDPOINT ---
@module1.route('/chat', methods=['POST'])
def api_chat():
    try:
        data = request.json
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({"error": "Empty message"}), 400
        
        # 1. Get Response from AI (Core Logic)
        response_text = process_query(message)
        
        # 2. Save Conversation
        try:
            save_history({"user": message, "bot": response_text})
        except Exception as log_error:
            print(f"WARNING: History save failed: {log_error}")
            
        return jsonify({"response": response_text})
        
    except Exception as e:
        print(f"CRITICAL ROUTE ERROR: {e}")
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

# --- GUIDELINES ENDPOINT ---
@module1.route('/guidelines', methods=['GET'])
def api_guidelines():
    return jsonify({"guidelines": get_all_guidelines()})

# --- LEGAL REFS ENDPOINT ---
@module1.route('/legal-references', methods=['GET'])
def api_legal_references():
    return jsonify({"references": get_all_legal_references()})