# chatbot_core.py
from ollama import Client
from dlp_knowledge_base import get_dlp_info, DLP_RULES

# 1. USE THE WORKING IP (From your successful test earlier)
# 2. ADD TIMEOUT (60 seconds) so it doesn't crash if the AI is slow
client = Client(
    host='http://172.29.118.16:11434',
    timeout=60.0
)

def process_query(user_query):
    # Rule-based matching
    lower_query = user_query.lower()
    for key in DLP_RULES.keys():
        if key in lower_query:
            return get_dlp_info(key)
    
    # AI Fallback
    try:
        print(f"DEBUG: Sending '{user_query}' to Ollama...", flush=True)
        
        response = client.chat(
            model="qwen2.5:1.5b",  # Matches your installed model
            messages=[{
                "role": "system",
                "content": "You are a helpful assistant specialized in Malaysian Property Law."
            }, {
                "role": "user",
                "content": user_query
            }]
        )
        
        print("DEBUG: Success! Response received.", flush=True)
        return response['message']['content']
    
    except Exception as e:
        # This prints the REAL error to your terminal so we can see it
        print(f"CRITICAL ERROR: {e}", flush=True)
        # This returns the error to the chat window instead of "Sorry..."
        return f"System Error: {str(e)}"