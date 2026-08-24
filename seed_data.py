import os
from database import get_database
from datetime import datetime

def seed_database():
    db = get_database()

    print("🌱 Starting database seeding for Agro Kisan...")

    # 1. Seed Labours Collection
    labours_collection = db["labours"]
    if labours_collection.count_documents({}) == 0:
        labours_collection.insert_many([
            {
                "name": "Ramesh Kumar",
                "phone": "+919876543210",
                "location": "Rampur Village",
                "skills": ["Harvesting", "Tractor Driver"],
                "expected_daily_wage": 500.0,
                "available_today": True,
                "rating": 4.8,
                "distance_km": 3.2,
                "profile_image": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
                "created_at": datetime.utcnow()
            }
        ])
        print("✅ Seeded labours collection.")

    # 2. Seed Insurances Collection
    insurances_collection = db["insurances"]
    if insurances_collection.count_documents({}) == 0:
        insurances_collection.insert_many([
            {
                "farmer_id": "farmer_001",
                "aadhaar_number": "[Aadhaar Redacted]",
                "crop_name": "Paddy",
                "land_size_acres": 2.5,
                "state": "Telangana",
                "groundwater_level_m": 12.0,
                "crop_risk_score": 45.5,
                "estimated_premium": 3200.0,
                "groundwater_risk_status": "Critical",
                "eligibility_status": True,
                "recommendations": ["Switch to micro-irrigation"],
                "claim_status": "Under Review",
                "created_at": datetime.utcnow()
            }
        ])
        print("✅ Seeded insurances collection.")

    # 3. Seed Schemes Collection
    schemes_collection = db["schemes"]
    if schemes_collection.count_documents({}) == 0:
        schemes_collection.insert_many([
            {
                "scheme_name": "PM-KISAN Samman Nidhi",
                "announcement_date": "2019-02-01",
                "state": "All India",
                "crop_type": None,
                "max_land_size_acres": None,
                "farmer_category": "All",
                "benefits": ["₹6,000 per year"],
                "eligibility_criteria": ["All landholding farmer families"],
                "required_documents": ["Aadhaar Card", "Land Papers"],
                "mistakes_to_avoid": ["Ensure bank account is Aadhaar-seeded."],
                "deadline": "Ongoing",
                "registration_link": "https://pmkisan.gov.in",
                "created_at": datetime.utcnow()
            }
        ])
        print("✅ Seeded schemes collection.")

    print("🎉 Database seeding completed successfully!")

if __name__ == "__main__":
    seed_database()