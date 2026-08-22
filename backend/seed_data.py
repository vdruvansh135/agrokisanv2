"""Seed documents inserted into MongoDB on first boot."""

WORKERS = [
    {
        "id": "w1", "name": "Ramesh Naidu", "initials": "RN", "village": "Kotapalli, Guntur",
        "location": "Guntur", "skills": ["Harvesting", "Tractor Driver"], "daily_wage": 500,
        "distance_km": 2, "rating": 4.8, "jobs_done": 132, "available_today": True,
        "phone": "+91 98490 11223",
    },
    {
        "id": "w2", "name": "Lakshmi Devi", "initials": "LD", "village": "Peddapuram, E. Godavari",
        "location": "East Godavari", "skills": ["Transplanting", "Weeding"], "daily_wage": 420,
        "distance_km": 3.5, "rating": 4.9, "jobs_done": 210, "available_today": True,
        "phone": "+91 90005 44192",
    },
    {
        "id": "w3", "name": "Suresh Yadav", "initials": "SY", "village": "Bhainsa, Nirmal",
        "location": "Nirmal", "skills": ["Spraying", "Harvesting"], "daily_wage": 550,
        "distance_km": 5, "rating": 4.4, "jobs_done": 76, "available_today": False,
        "phone": "+91 91778 20114",
    },
    {
        "id": "w4", "name": "Anjamma Bai", "initials": "AB", "village": "Warangal Rural",
        "location": "Warangal", "skills": ["Cotton Picking", "Harvesting"], "daily_wage": 450,
        "distance_km": 6.2, "rating": 4.7, "jobs_done": 188, "available_today": True,
        "phone": "+91 96666 78321",
    },
    {
        "id": "w5", "name": "Mohan Reddy", "initials": "MR", "village": "Kurnool",
        "location": "Kurnool", "skills": ["Tractor Driver", "Borewell Repair"], "daily_wage": 700,
        "distance_km": 8, "rating": 4.6, "jobs_done": 95, "available_today": True,
        "phone": "+91 93910 55480",
    },
]

JOBS = [
    {
        "id": "j1", "title": "Cotton picking — 3 acres", "farmer": "Venkat Rao",
        "village": "Kotapalli", "distance_km": 1.8, "date": "Tomorrow, 6 AM",
        "workers_needed": 6, "daily_wage": 480,
    },
    {
        "id": "j2", "title": "Paddy transplanting", "farmer": "Sita Mahalakshmi",
        "village": "Tenali", "distance_km": 4.4, "date": "Sat, 7 AM",
        "workers_needed": 10, "daily_wage": 430,
    },
    {
        "id": "j3", "title": "Pesticide spraying — chilli", "farmer": "Ibrahim Khan",
        "village": "Guntur Rural", "distance_km": 7.1, "date": "Mon, 5:30 AM",
        "workers_needed": 3, "daily_wage": 600,
    },
]

SCHEMES = [
    {
        "id": "s1", "name": "PM Kisan Samman Nidhi", "department": "Ministry of Agriculture, GoI",
        "description": "Direct income support of ₹6,000 per year paid in three equal instalments.",
        "benefit": "₹6,000 / year", "match_percentage": 98,
        "requirements": ["Aadhaar card", "Land records (Pattadar passbook)", "Bank passbook linked to Aadhaar"],
        "mistakes": ["Name mismatch between Aadhaar and land record", "Inactive or unseeded bank account"],
        "deadline": "2026-09-30", "url": "https://pmkisan.gov.in", "min_acres": 0, "max_acres": 1000,
    },
    {
        "id": "s2", "name": "Pradhan Mantri Fasal Bima Yojana", "department": "PMFBY, GoI",
        "description": "Crop insurance covering drought, flood and pest losses at a subsidised premium.",
        "benefit": "Up to ₹45,000 / acre cover", "match_percentage": 94,
        "requirements": ["Sowing certificate", "Aadhaar card", "Bank account details", "Land ownership proof"],
        "mistakes": ["Applying after the notified cut-off date", "Declaring the wrong crop for the survey number"],
        "deadline": "2026-08-31", "url": "https://pmfby.gov.in", "min_acres": 0.5, "max_acres": 1000,
    },
    {
        "id": "s3", "name": "Rythu Bharosa", "department": "Govt. of Andhra Pradesh",
        "description": "State investment support for cultivating farmer families each crop season.",
        "benefit": "₹13,500 / year", "match_percentage": 88,
        "requirements": ["Ration card", "Aadhaar card", "Land record / tenancy certificate"],
        "mistakes": ["Tenant farmers not obtaining a CCRC card"],
        "deadline": "2026-10-15", "url": "https://ysrrythubharosa.ap.gov.in", "min_acres": 0, "max_acres": 12.5,
    },
    {
        "id": "s4", "name": "Kisan Credit Card", "department": "NABARD / Scheduled Banks",
        "description": "Short-term crop loan at 4% effective interest with prompt repayment incentive.",
        "benefit": "Loans up to ₹3 lakh @ 4%", "match_percentage": 82,
        "requirements": ["Aadhaar card", "Land documents", "Two passport photos", "PAN card"],
        "mistakes": ["Missing the annual renewal and losing the interest subvention"],
        "deadline": "2026-12-31", "url": "https://www.nabard.org", "min_acres": 0, "max_acres": 1000,
    },
]
