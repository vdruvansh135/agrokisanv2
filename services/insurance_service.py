from database import get_database
from models.insurances import InsuranceCreate
from typing import List, Dict, Any
import logging
import uuid

logger = logging.getLogger(__name__)

class InsuranceService:
    @staticmethod
    def get_collection():
        db = get_database()
        return db["insurances"]

    @staticmethod
    def calculate_risk_and_premium(land_size_acres: float, groundwater_level_m: float, crop_name: str) -> Dict[str, Any]:
        """
        Deterministic rule-based risk and premium calculations for hackathon MVP.
        """
        if groundwater_level_m < 10.0:
            gw_status = "Safe"
            gw_risk_factor = 1.0
        elif groundwater_level_m <= 25.0:
            gw_status = "Critical"
            gw_risk_factor = 1.3
        else:
            gw_status = "Over-exploited"
            gw_risk_factor = 1.6

        base_crop_risk = 35.0
        if crop_name.lower() in ["paddy", "rice", "sugarcane"]:
            base_crop_risk = 55.0
        
        crop_risk_score = min(100.0, base_crop_risk * gw_risk_factor)
        base_rate_per_acre = 1200.0
        estimated_premium = round(land_size_acres * base_rate_per_acre * (crop_risk_score / 50.0), 2)

        recommendations = []
        if gw_status == "Over-exploited":
            recommendations.append("Switch to micro-irrigation (drip/sprinkler) to mitigate groundwater depletion.")
        if crop_risk_score > 50.0:
            recommendations.append("Consider drought-resistant crop varieties or intercropping.")
        else:
            recommendations.append("Standard crop management practices are optimal for current conditions.")

        return {
            "crop_risk_score": round(crop_risk_score, 2),
            "estimated_premium": estimated_premium,
            "groundwater_risk_status": gw_status,
            "eligibility_status": True,
            "recommendations": recommendations,
            "claim_status": "Submitted"
        }

    @classmethod
    def create_insurance_application(cls, data: InsuranceCreate) -> dict:
        try:
            collection = cls.get_collection()
            calc = cls.calculate_risk_and_premium(
                data.land_size_acres, 
                data.groundwater_level_m, 
                data.crop_name
            )
            
            data_dict = data.model_dump()
            data_dict.update(calc)
            
            result = collection.insert_one(data_dict)
            data_dict["id"] = str(result.inserted_id)
            if "_id" in data_dict:
                del data_dict["_id"]
            return data_dict
        except Exception as e:
            logger.error(f"Error creating insurance application: {str(e)}")
            data_dict = data.model_dump()
            calc = cls.calculate_risk_and_premium(data.land_size_acres, data.groundwater_level_m, data.crop_name)
            data_dict.update(calc)
            data_dict["id"] = f"temp_{uuid.uuid4().hex[:8]}"
            return data_dict

    @classmethod
    def get_applications_by_farmer(cls, farmer_id: str) -> List[dict]:
        try:
            collection = cls.get_collection()
            apps = list(collection.find({"farmer_id": farmer_id}))
            for app in apps:
                app["id"] = str(app["_id"])
                del app["_id"]
            
            if not apps:
                return [{
                    "id": "mock_app_1",
                    "farmer_id": farmer_id,
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
                    "claim_status": "Under Review"
                }]
            return apps
        except Exception as e:
            logger.error(f"Error fetching insurance applications: {str(e)}")
            return []