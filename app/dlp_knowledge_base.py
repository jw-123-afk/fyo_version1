"""
DLP Knowledge Base - Malaysian Property Law
Stores the static rules, guidelines, and legal references used by the chatbot.
"""

# ==========================================
# 1. THE CORE KNOWLEDGE RULES
# ==========================================
# Keys = Keywords to search for in user questions
# Values = The detailed context text to give to the AI

DLP_RULES = {
    "what is dlp": """
        DEFINITION: The Defect Liability Period (DLP) is a warranty period provided by the developer to the homebuyer.
        DETAILS: During this period, the developer is contractually obligated to repair any defects in the property due to poor workmanship or materials at their own cost.
        CONTEXT: It is often described as the "warranty period" for a new house.
    """,
    
    "duration": """
        STANDARD DURATION: For residential properties governed by the Housing Development Act (HDA) 1966, the DLP is twenty-four (24) months.
        START DATE: The period starts from the date of delivery of Vacant Possession (VP), which is when you receive the keys to your property.
        COMMERCIAL: For commercial properties (e.g., SoHo, office suites) not under HDA, the duration depends strictly on the Sale and Purchase Agreement (SPA), though 12-24 months is common.
    """,
    
    "time to repair": """
        REPAIR TIMELINE: Under the standard Schedule G and H agreements, the developer has thirty (30) days to repair the defects from the date they receive your written notice.
        FAILURE TO REPAIR: If the developer fails to repair within 30 days, the homebuyer may carry out the repairs themselves and charge the cost to the developer (subject to specific notification procedures).
    """,
    
    "renovation": """
        RENOVATION WARNING: Major renovations can void your DLP for the affected areas.
        ADVICE: It is highly recommended to inspect the property and get the developer to fix defects BEFORE starting any renovation work.
        SCOPE: If you renovate the wet kitchen and a leak occurs there later, the developer may argue the leak was caused by your renovation, not their workmanship.
    """,
    
    "hda": """
        LAW: The Housing Development (Control and Licensing) Act 1966 (HDA) is the primary law protecting homebuyers in Malaysia.
        PROTECTION: It mandates the standard Sale and Purchase Agreements (Schedule G for landed, Schedule H for strata) which define the 24-month DLP.
    """,
    
    "schedule g": """
        DOCUMENT: Schedule G is the standard Sale and Purchase Agreement for Landed Properties (individual titles) under the HDA.
        CLAUSE: Clause 26 usually covers the Defect Liability Period.
    """,
    
    "schedule h": """
        DOCUMENT: Schedule H is the standard Sale and Purchase Agreement for Strata Properties (condos, apartments, gated communities) under the HDA.
        CLAUSE: Clause 30 usually covers the Defect Liability Period.
    """,
    
    "tribunal": """
        DISPUTE RESOLUTION: If the developer refuses to fix defects or pays for repairs, homebuyers can file a claim with the Tribunal for Homebuyer Claims (TTPR).
        LIMIT: The claim limit is RM50,000. It is a faster and cheaper alternative to court.
    """,
    
    "commercial": """
        COMMERCIAL PROPERTY: Properties like retail shops, offices, or some SoVo/SoFo units might not be protected by the HDA.
        ADVICE: For these properties, the DLP terms are strictly governed by the contract you signed. You must check your specific SPA document.
    """,
    
    "procedure": """
        STEP 1: Identify the defect (take photos/videos).
        STEP 2: Mark the defect (masking tape is common).
        STEP 3: Submit a written complaint form to the developer (keep a copy/proof of receipt).
        STEP 4: Developer has 30 days to repair.
        STEP 5: Joint inspection to verify repairs are done.
    """,
    
    "secondary market": """
        SUBSALE: The DLP usually stays with the property, not the owner.
        TRANSFER: If you buy a sub-sale house that is still less than 24 months old (from VP), the remaining DLP balance transfers to you. You must notify the developer of the ownership change.
    """
}

# ==========================================
# 2. HELPER FUNCTIONS
# ==========================================

def get_dlp_info(key):
    """
    Returns the specific rule text for a given keyword.
    """
    return DLP_RULES.get(key, "Information not found in knowledge base.")

def get_all_guidelines():
    """
    Returns a list of structured guidelines for the UI (Guidelines Tab).
    """
    return [
        {
            "title": "What is DLP?",
            "content": "A 24-month warranty period where developers must fix defects free of charge."
        },
        {
            "title": "How to Report?",
            "content": "Submit a written form to the developer. Keep the acknowledgement receipt."
        },
        {
            "title": "Repair Timeline",
            "content": "Developer typically has 30 days to rectify defects upon receiving notice."
        },
        {
            "title": "Renovations",
            "content": "Do not renovate before inspection. Renovations may void the warranty for affected areas."
        }
    ]

def get_all_legal_references():
    """
    Returns a list of legal acts for the UI (Legal Tab).
    """
    return [
        {
            "title": "Housing Development Act 1966",
            "content": "The main act governing residential property and protecting buyer rights."
        },
        {
            "title": "Schedule H (Strata)",
            "content": "Standard agreement for condos/apartments. Defines Clause 30 for DLP."
        },
        {
            "title": "Schedule G (Landed)",
            "content": "Standard agreement for landed houses. Defines Clause 26 for DLP."
        },
        {
            "title": "Strata Management Act 2013",
            "content": "Governs the management of common properties and facilities."
        }
    ]
