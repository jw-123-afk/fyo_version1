from groq import Groq
from .dlp_knowledge_base import get_dlp_info, DLP_RULES

# =====================================================
# 1. CONFIGURATION (GROQ SETUP)
# =====================================================

# ⚠️ IMPORTANT: Paste your NEW Groq API Key inside these quotes:
GROQ_API_KEY = "put your own api key "

try:
    client = Groq(api_key=GROQ_API_KEY)
except Exception as e:
    print(f"Groq Client Error: {e}")
    client = None

# Using the new supported model
MODEL_NAME = "llama-3.3-70b-versatile"

# =====================================================
# 2. SYSTEM PROMPTS
# =====================================================

# Strict prompt to ensure it only answers property law questions
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
    if not client:
        return "Error: AI Client not initialized. Check API Key."

    lower_query = user_query.lower()
    retrieved_context = []
    
    # Simple Keyword Search (RAG)
    for key in DLP_RULES.keys():
        if key in lower_query:
            info = get_dlp_info(key)
            retrieved_context.append(f"--- Info regarding '{key}' ---\n{info}")

    if retrieved_context:
        full_context_text = "\n\n".join(retrieved_context)
    else:
        full_context_text = "No specific documents found in internal database."

    try:
        # Construct the final prompt
        user_prompt = f"""
        Retrieved Context:
        {full_context_text}

        User Question:
        {user_query}
        """
        
        # Send to Groq
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_INSTRUCTION},
                {"role": "user", "content": user_prompt}
            ],
            model=MODEL_NAME,
            temperature=0.3, # Low temperature = strict and factual
        )
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        return f"AI Error: {str(e)}"

def analyze_legal_text(document_text):
    if not client:
        return "Error: AI Client not initialized."

    # Detailed prompt for document analysis
    ANALYSIS_PROMPT = f"""
    You are a Malaysian Property Law Analyst.
    
    TASK: Analyze the following legal text snippet.
    
    DOCUMENT TEXT:
    "{document_text}"
    
    INSTRUCTIONS:
    1. First, determine if this is related to Malaysian Property (SPA, Loan, Title, Tenancy).
    2. If NOT related, strictly say: "I can only analyze Malaysian property documents."
    3. If related, summarize the key point in 1 sentence.
    4. Highlight any potential risks or "gotchas" (e.g., late interest, strict deadlines).
    5. Explain any legal jargon in simple English.
    6. END WITH: "This is a general explanation. Please have a lawyer review your actual document."
    """
    
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": "You are a helpful legal analyst."},
                {"role": "user", "content": ANALYSIS_PROMPT}
            ],
            model=MODEL_NAME,
            temperature=0.3,
        )
        return chat_completion.choices[0].message.content
        
    except Exception as e:
        return f"Analysis Error: {str(e)}"