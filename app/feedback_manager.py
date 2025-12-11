# feedback_manager.py - Handles user feedback

import json
import os

FEEDBACK_DIR = "data/feedback"
os.makedirs(FEEDBACK_DIR, exist_ok=True)
FEEDBACK_FILE = os.path.join(FEEDBACK_DIR, "feedback_log.json")

def save_feedback(feedback_text):
    feedback = load_feedback()
    feedback.append({"feedback": feedback_text})
    with open(FEEDBACK_FILE, 'w') as f:
        json.dump(feedback, f)

def load_feedback():
    if os.path.exists(FEEDBACK_FILE):
        with open(FEEDBACK_FILE, 'r') as f:
            return json.load(f)
    return []