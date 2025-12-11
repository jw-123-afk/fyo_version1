# module4/routes.py
from flask import Blueprint, request, jsonify
from ..feedback_manager import save_feedback

module4 = Blueprint('module4', __name__)

@module4.route('/feedback', methods=['POST'])
def feedback():
    data = request.json
    feedback_text = data.get('feedback')
    save_feedback(feedback_text)
    return jsonify({"status": "Feedback saved"})