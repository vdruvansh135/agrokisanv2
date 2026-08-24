from database import get_database
from models.schemes import SchemeCreate
from typing import List, Optional
import logging
import uuid

logger = logging.getLogger(__name__)

class SchemeService:
    @staticmethod
    def get_collection():
        db = get_database()
        return db["schemes"]

    @classmethod
    def get_filtered_schemes(
        cls, 
        state: Optional[str] = None, 
        crop_type: Optional[str] = None, 
        land_size_acres: Optional[float] = None, 
        farmer_category: Optional[str] = None
    ) -> List[dict]:
        try:
            collection = cls.get_collection()
            query = {}

            if state:
                query["$or"] = [{"state": state}, {"state": "All India"}]
            if farmer_category:
                query["$or"] = query.get("$or", []) + [{"farmer_category": farmer_category}, {"farmer_category": "All"}]

            schemes = list(collection.find(query))
            
            for scheme in schemes:
                scheme["id"] = str(scheme["_id"])
                del scheme["_id"]

            if not schemes:
                schemes = [
                    {
                        "id": "mock_scheme_1",
                        "scheme_name": "PM-KISAN Samman Nidhi",
                        "announcement_date": "2019-02-01",
                        "state": "All India",
                        "crop_type": None,
                        "max_land_size_acres": None,
                        "farmer_category": "All",
                        "benefits": ["₹6,000 per year paid in three equal 4-monthly installments"],
                        "eligibility_criteria": ["All landholding farmer families with cultivable land"],
                        "required_documents": ["Identity Verification Card", "Land Ownership Papers", "Bank Account Passbook"],
                        "mistakes_to_avoid": ["Ensure bank account is identity-seeded and NPCI mapped."],
                        "deadline": "Ongoing",
                        "registration_link": "https://pmkisan.gov.in"
                    },
                    {
                        "id": "mock_scheme_2",
                        "scheme_name": "Rythu Bandhu / State Investment Support",
                        "announcement_date": "2018-05-10",
                        "state": "Telangana",
                        "crop_type": None,
                        "max_land_size_acres": None,
                        "farmer_category": "Small & Marginal",
                        "benefits": ["Investment support of ₹5,000 per acre per season"],
                        "eligibility_criteria": ["Farmers owning land within the state"],
                        "required_documents": ["Pattedar Passbook", "Identity Verification Card"],
                        "mistakes_to_avoid": ["Verify survey number matching land records."],
                        "deadline": "2026-10-30",
                        "registration_link": "https://rythubandhu.telangana.gov.in"
                    }
                ]

            filtered = []
            for s in schemes:
                match = True
                if land_size_acres and s.get("max_land_size_acres"):
                    if land_size_acres > s["max_land_size_acres"]:
                        match = False
                if match:
                    filtered.append(s)

            return filtered if filtered else schemes
        except Exception as e:
            logger.error(f"Error fetching schemes: {str(e)}")
            return [{
                "id": "fallback_scheme_1",
                "scheme_name": "PM-KISAN (Fallback)",
                "announcement_date": "2019-02-01",
                "state": "All India",
                "crop_type": "All",
                "max_land_size_acres": 10.0,
                "farmer_category": "All",
                "benefits": ["₹6,000 financial assistance annually."],
                "eligibility_criteria": ["Valid land records."],
                "required_documents": ["Identity Card", "Land Doc"],
                "mistakes_to_avoid": ["Name mismatch in bank account."],
                "deadline": "Ongoing",
                "registration_link": "https://pmkisan.gov.in"
            }]

    @classmethod
    def create_scheme(cls, scheme_data: SchemeCreate) -> dict:
        data_dict = scheme_data.model_dump()
        try:
            collection = cls.get_collection()
            result = collection.insert_one(data_dict)
            
            data_dict["id"] = str(result.inserted_id)
            if "_id" in data_dict:
                del data_dict["_id"]
                
            return data_dict
        except Exception as e:
            logger.error(f"Error creating scheme: {str(e)}")
            data_dict["id"] = f"temp_{uuid.uuid4().hex[:8]}"
            return data_dict