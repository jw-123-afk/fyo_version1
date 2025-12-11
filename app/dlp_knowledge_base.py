
# dlp_knowledge_base.py - Rule-based data for DLP claims in Malaysian Property Law

DLP_RULES = {
    "definition": "The Defect Liability Period (DLP) in Malaysian property law is a 24-month period starting from the date of vacant possession (handover of keys). During this time, developers must repair any defects reported by homeowners at no cost, as per the Housing Development (Control and Licensing) Act 1966 (HDA).",
    
    "duration": "24 months from the date you receive vacant possession. For strata properties, it's governed by the Strata Titles Act 1985.",
    
    "what_covered": "Visible defects like cracks, leaks, faulty wiring, or poor workmanship. Latent defects (hidden) can be claimed up to 3 years after discovery, but may require legal action beyond DLP.",
    
    "claim_process": """
    1. Inspect your property thoroughly upon handover and during DLP.
    2. Report defects in writing to the developer (email/letter) with photos and details.
    3. Developer must acknowledge within 14 days and fix within 30 days (or reasonable time).
    4. If not fixed, escalate to the Housing Tribunal (claim within 12 months after DLP expiry, max RM50,000).
    5. For latent defects post-DLP, sue in court within 3 years of discovery (Limitation Act 1953).
    """,
    
    "examples": """
    - Crack in wall: Report during DLP; developer fixes free.
    - Roof leak discovered after 25 months: If latent, claim via tribunal or court if within 3 years of discovery.
    - Faulty elevator in condo: Covered under Strata Management Act; JMB/MC can enforce.
    """,
    
    "rights": "Homebuyers' rights: Free repairs, compensation for delays. Developers can't charge. Tribunal filing fee: RM10.",
    
    "references": "HDA 1966, Strata Titles Act 1985, Strata Management Act 2013, Limitation Act 1953."
}

DLP_GUIDELINES = [
    {
        "title": "DLP Duration",
        "content": "The Defect Liability Period lasts 24 months from the date of vacant possession. This is a statutory right for all homebuyers in Malaysia."
    },
    {
        "title": "What is Covered",
        "content": "Structural defects, water leaks, electrical faults, cracks in walls, poor finishing work, and other visible defects are covered during the DLP period."
    },
    {
        "title": "Reporting Process",
        "content": "Report all defects to the developer in writing with photographs and detailed descriptions. Keep copies of all communications."
    },
    {
        "title": "Developer Obligations",
        "content": "The developer must acknowledge defect reports within 14 days and complete repairs within 30 days or a reasonable timeframe."
    },
    {
        "title": "What is Not Covered",
        "content": "Normal wear and tear, damage due to user negligence, modifications made by the homeowner, and defects not reported during DLP."
    },
    {
        "title": "Post-DLP Claims",
        "content": "For latent (hidden) defects discovered after DLP, you may claim through Housing Tribunal or court within 3 years of discovery."
    },
    {
        "title": "Housing Tribunal",
        "content": "File a complaint with the Housing Tribunal if the developer fails to fix defects. Maximum claim: RM50,000. Filing fee: RM10."
    },
    {
        "title": "Documentation",
        "content": "Keep all proof of defects, communications with developer, inspection reports, and repair costs for evidence if escalation is needed."
    },
    {
        "title": "Legal Rights",
        "content": "You have the right to free repairs, compensation for delays, and legal recourse if the developer breaches DLP obligations."
    },
    {
        "title": "Special Cases",
        "content": "For strata properties (condos), refer to the Strata Titles Act. Common area defects are managed by the Joint Management Body (JMB) or Management Corporation (MC)."
    }
]

LEGAL_REFERENCES = [
    {
        "title": "Housing Development (Control and Licensing) Act 1966 (HDA)",
        "content": "The primary legislation governing defect liability periods in Malaysia. Requires developers to maintain properties for 24 months from vacant possession."
    },
    {
        "title": "Strata Titles Act 1985",
        "content": "Governs parcel ownership in strata properties. Includes provisions for DLP in stratified buildings and responsibilities of the Joint Management Body."
    },
    {
        "title": "Strata Management Act 2013",
        "content": "Replaced the Management Corporation Act. Governs management and maintenance of strata properties, including defect rectification."
    },
    {
        "title": "Limitation Act 1953",
        "content": "Specifies the time limits for bringing legal action. Latent defects can be claimed within 3 years of discovery."
    }
]

def get_dlp_info(topic):
    return DLP_RULES.get(topic.lower(), "No info found on that topic. Ask a specific query.")

def get_all_guidelines():
    """Return all DLP guidelines"""
    return DLP_GUIDELINES

def get_all_legal_references():
    """Return all legal references"""
    return LEGAL_REFERENCES
