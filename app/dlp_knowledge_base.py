"""
DLP Knowledge Base - Malaysian Property Law
"""

DLP_RULES = {
    "what is dlp": """
        DEFINITION: The Defect Liability Period (DLP) is a warranty period provided by the developer.
        DETAILS: Developer must repair defects at their own cost.
    """,
    
    "duration": """
        STANDARD: 24 months from Vacant Possession (VP) for residential (HDA).
        COMMERCIAL: Depends on the contract (usually 12-24 months).
    """,
    
    "time to repair": """
        TIMELINE: Developer has 30 days to repair defects after receiving notice.
    """,
    
    "renovation": """
        WARNING: Renovations can void the DLP for the affected areas. Inspect first!
    """,
    
    "hda": """
        LAW: Housing Development Act 1966 protects residential homebuyers.
    """,
    
    "schedule g": """
        DOCUMENT: Standard agreement for Landed Properties.
    """,
    
    "schedule h": """
        DOCUMENT: Standard agreement for Strata Properties (Condos/Apartments).
    """,
    
    "commercial": """
        NOTE: Commercial properties are not always protected by HDA. Check the SPA.
    """,
    
    "procedure": """
        STEPS: 1. Identify defect. 2. Mark it. 3. Submit written form. 4. Wait 30 days.
    """,
    
    "secondary market": """
        RULE: DLP stays with the house. If <24 months old, balance transfers to new owner.
    """,

    "strata title": """
        DEFINITION: Individual title for units (condos/apartments) sharing common facilities.
    """,

    "maintenance fee": """
        DEFINITION: Charges for managing common areas. Mandatory under Strata Management Act.
    """,

    "wall crack": """
        COVERAGE: Yes, wall cracks are covered if due to workmanship.
        ACTION: Report high severity cracks immediately.
    """
}

def get_dlp_info(key):
    return DLP_RULES.get(key, "")

def get_all_guidelines():
    return [{"title": "DLP Basics", "content": "24-month warranty for defects."}]

def get_all_legal_references():
    return [{"title": "HDA 1966", "content": "Main housing law."}]