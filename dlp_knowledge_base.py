# dlp_knowledge_base.py — Correct version (Malaysian DLP rules)

DLP_RULES = {
    "definition": "Defect Liability Period (DLP) in Malaysia is **24 months** from the date of Vacant Possession + keys handover. Developer must repair all defects FREE of charge (Housing Development Act 1966, Schedule H/I).",
    "duration": "24 months from the date stated in Schedule G/H of the Sale & Purchase Agreement.",
    "covered": "Cracks, leaks, peeling paint, faulty wiring/plumbing, doors, windows, roof, flooring etc. due to poor workmanship.",
    "not covered": "Normal wear and tear, damage by owner, acts of God.",
    "claim process": "1. Report in writing + photos to developer\n2. Developer must rectify within 30 days\n3. If not fixed → file at Tribunal Penuntut Pembeli Rumah (max RM50,000, fee RM10 only).",
    "tribunal": "Can file even after DLP ends, as long as within 12 months after expiry.",
    "latent defects": "Hidden defects → can sue in court within 3 years from date of discovery.",
    "references": "• Housing Development Act 1966\n• Strata Titles Act 1985\n• Strata Management Act 2013"
}

def get_dlp_info(topic):
    key = topic.lower().strip()
    for k in DLP_RULES:
        if k in key:
            return DLP_RULES[k]
    return None
