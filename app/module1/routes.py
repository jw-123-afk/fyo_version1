from flask import Blueprint, request, jsonify

# Safe Imports with Error Handling
try:
    from ..chatbot_core import process_query, analyze_legal_text
    from ..conversation_logger import save_history
    from ..dlp_knowledge_base import get_all_guidelines, get_all_legal_references
    from ..feedback_manager import save_feedback
except ImportError as err:
    print(f"CRITICAL IMPORT ERROR: {err}")
    # Create dummy functions so the app doesn't crash on start
    process_query = lambda x: f"System Error: Backend modules failed to load. {str(err)}"
    analyze_legal_text = lambda x: f"System Error: Backend modules failed to load. {str(err)}"
    save_history = lambda x: None
    get_all_guidelines = lambda: []
    get_all_legal_references = lambda: []

module1 = Blueprint('module1', __name__, url_prefix='/api')

@module1.route('/chat', methods=['POST'])
def api_chat():
    try:
        data = request.json
        message = data.get('message', '').strip()
        
        if not message:
            return jsonify({"error": "Empty message"}), 400
        
        response_text = process_query(message)
        
        try:
            save_history({"user": message, "bot": response_text})
        except Exception:
            pass # Ignore history save errors
            
        return jsonify({"response": response_text})
        
    except Exception as e:  # <--- THIS IS THE FIX (added 'as e')
        print(f"ROUTE ERROR: {e}")
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@module1.route('/analyze', methods=['POST'])
def api_analyze():
    try:
        data = request.json
        text = data.get('message', '').strip()
        
        if not text:
            return jsonify({"error": "Empty text"}), 400
            
        response_text = analyze_legal_text(text)
        return jsonify({"response": response_text})
        
    except Exception as e: # <--- THIS IS THE FIX (added 'as e')
        print(f"ANALYZE ERROR: {e}")
        return jsonify({"error": f"Server Error: {str(e)}"}), 500

@module1.route('/guidelines', methods=['GET'])
def api_guidelines():
    return jsonify({"guidelines": get_all_guidelines()})

@module1.route('/legal-references', methods=['GET'])
def api_legal_references():
    return jsonify({"references": get_all_legal_references()})