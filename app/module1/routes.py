# app/module1/routes.py
from flask import Blueprint, request, jsonify
# We use try/except on imports in case files are missing
try:
    from ..chatbot_core import process_query
    from ..conversation_logger import save_history
    from ..dlp_knowledge_base import get_all_guidelines, get_all_legal_references
    from ..feedback_manager import save_feedback
except ImportError:
    # Fallback if imports fail
    process_query = lambda x: "System Error: Modules missing"
    save_history = lambda x: None

import json
from datetime import datetime

module1 = Blueprint('module1', __name__, url_prefix='/api')

# --- CHAT ENDPOINT ---
@module1.route('/chat', methods=['POST'])
def api_chat():
    try:
        data = request.json
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({"error": "Empty message"}), 400
        
        # 1. Get AI Response
        response = process_query(message)
        
        # 2. Save History (Safe Mode)
        try:
            save_history({"user": message, "bot": response})
        except Exception as e:
            print(f"WARNING: History save failed: {e}")
            
        return jsonify({"response": response})
        
    except Exception as e:
        print(f"CRITICAL ROUTE ERROR: {e}")
        return jsonify({"error": str(e)}), 500

# --- OTHER ENDPOINTS ---
@module1.route('/guidelines', methods=['GET'])
def api_guidelines():
    return jsonify({"guidelines": get_all_guidelines()})

@module1.route('/legal-references', methods=['GET'])
def api_legal_references():
    return jsonify({"references": get_all_legal_references()})