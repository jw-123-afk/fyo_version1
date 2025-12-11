# module3/routes.py
from flask import Blueprint, jsonify
from ..conversation_logger import view_history, clear_history

module3 = Blueprint('module3', __name__)

@module3.route('/history', methods=['GET'])
def history():
    return jsonify(view_history())

@module3.route('/clear_history', methods=['POST'])
def clear():
    clear_history()
    return jsonify({"status": "History cleared"})