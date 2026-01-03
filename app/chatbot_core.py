from ollama import Client
from .dlp_knowledge_base import get_dlp_info, DLP_RULES

# 1. CONFIGURATION
client = Client(
    host='http://172.29.118.16:11434',
    timeout=60.0
)

# 2. STRICT SYSTEM PROMPT
# This tells the AI exactly how to behave based on your requirements.
SYSTEM_INSTRUCTION = """
You are a specialized legal assistant for Malaysian Property Law.
You must strictly follow these rules:

1.  **Source Material:** Use ONLY the provided "Retrieved Context" to answer. Do not use your own outside general knowledge.
2.  **On-Topic (Information Found):** If the user's question is about Malaysian property law AND the Context contains the answer, provide a clear, accurate explanation based solely on that Context.
3.  **On-Topic (Information Missing):** If the question is about Malaysian property law but the Context is empty or does not have the answer, respond EXACTLY: "I don't have sufficient information from my Malaysian property law sources to answer this accurately."
4.  **Off-Topic:** If the question is NOT about Malaysian property law (e.g., cooking, general life, criminal law, international law), respond EXACTLY: "I'm sorry, but I am specialized only in Malaysian property law and cannot assist with questions outside this topic. Please ask something related to property law in Malaysia."
5.  **Disclaimer:** Always end your response with this exact phrase: "This is not legal advice. Please consult a qualified Malaysian lawyer for your specific situation."
"""

def process_query(user_query):
    # --- STEP 1: RETRIEVE CONTEXT ---
    # We search your DLP_RULES for any keywords matching the user's query.
    # Instead of returning immediately, we collect the info to give to the AI.
    lower_query = user_query.lower()
    retrieved_context = []
    
    found_match = False
    for key in DLP_RULES.keys():
        if key in lower_query:
            # We found a keyword! Add its detailed info to the context.
            info = get_dlp_info(key)
            retrieved_context.append(f"--- Info regarding '{key}' ---\n{info}")
            found_match = True

    # Join all found context into one block of text
    if found_match:
        full_context_text = "\n\n".join(retrieved_context)
    else:
        full_context_text = "No specific documents found in internal database."

    # --- STEP 2: SEND TO AI ---
    try:
        print(f"DEBUG: Sending to Ollama with Context...", flush=True)
        
        # We construct a prompt that forces the AI to look at the context
        user_prompt = f"""
        Retrieved Context:
        {full_context_text}

        User Question:
        {user_query}
        """

        response = client.chat(
            model="qwen2.5:1.5b",
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_prompt}
            ]
        )
        
        print("DEBUG: Success! Response received.", flush=True)
        return response['message']['content']
    
    except Exception as e:
        print(f"CRITICAL ERROR: {e}", flush=True)
        return f"System Error: {str(e)}"