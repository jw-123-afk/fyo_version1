# module2/routes.py
from flask import Blueprint, jsonify
from ..dlp_knowledge_base import DLP_RULES

module2 = Blueprint('module2', __name__)

@module2.route('/dlp_info', methods=['GET'])
def dlp_info():
    return jsonify(DLP_RULES)