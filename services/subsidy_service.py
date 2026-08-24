from database import get_database
from models.subsidies import SubsidyCreate
from services.farmer_service import FarmerService
from typing import List, Optional, Dict, Any
import logging
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)

class SubsidyService:
    
    @staticmethod
    def get_collection():
        db = get_database()
        return db["subsidies"]

    @classmethod
    def create_subsidy(cls, subsidy_data: SubsidyCreate) -> dict:
        collection = cls.get_collection()
        data_dict = subsidy_data.model_dump()
        
        now = datetime.now(timezone.utc)
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = collection.insert_one(data_dict)
        
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_all_subsidies(cls) -> List[dict]:
        collection = cls.get_collection()
        subsidies = list(collection.find({"active": True}))
        
        formatted = []
        for sub in subsidies:
            sub["id"] = str(sub["_id"])
            if "_id" in sub:
                del sub["_id"]
            formatted.append(sub)
            
        return formatted

    @classmethod
    def get_subsidy_by_id(cls, subsidy_id: str) -> Optional[dict]:
        try:
            obj_id = ObjectId(subsidy_id)
        except InvalidId:
            raise ValueError("Invalid Subsidy ID format.")

        collection = cls.get_collection()
        subsidy = collection.find_one({"_id": obj_id})
        
        if subsidy:
            subsidy["id"] = str(subsidy["_id"])
            del subsidy["_id"]
            return subsidy
        return None

    @classmethod
    def evaluate_farmer_eligibility(cls, farmer_id: str) -> List[dict]:
        # 1. Retrieve the Farmer Profile using the existing FarmerService
        farmer = FarmerService.get_farmer_by_id(farmer_id)
        if not farmer:
            raise ValueError("Farmer profile not found.")
            
        # 2. Retrieve all active subsidies
        all_subsidies = cls.get_all_subsidies()
        eligibility_results = []
        
        # 3. Evaluate criteria
        for subsidy in all_subsidies:
            eligible = True
            reasons = []
            missing = []
            
            # State Check
            if subsidy.get("state") and subsidy["state"] != "All India":
                if not farmer.get("state"):
                    missing.append("state")
                    eligible = False
                elif farmer["state"].lower() != subsidy["state"].lower():
                    reasons.append(f"Requires state to be {subsidy['state']}")
                    eligible = False
                    
            # District Check
            if subsidy.get("district"):
                if not farmer.get("district"):
                    missing.append("district")
                    eligible = False
                elif farmer["district"].lower() != subsidy["district"].lower():
                    reasons.append(f"Requires district to be {subsidy['district']}")
                    eligible = False

            # Land Size Min Check
            if subsidy.get("min_land_acres") is not None:
                if farmer.get("land_size_acres") is None:
                    missing.append("land_size_acres")
                    eligible = False
                elif farmer["land_size_acres"] < subsidy["min_land_acres"]:
                    reasons.append(f"Requires minimum {subsidy['min_land_acres']} acres")
                    eligible = False

            # Land Size Max Check
            if subsidy.get("max_land_acres") is not None:
                if farmer.get("land_size_acres") is None:
                    missing.append("land_size_acres")
                    eligible = False
                elif farmer["land_size_acres"] > subsidy["max_land_acres"]:
                    reasons.append(f"Requires maximum {subsidy['max_land_acres']} acres")
                    eligible = False

            # Crop Check (Intersection)
            sub_crops = subsidy.get("applicable_crops")
            if sub_crops:
                farmer_crops = farmer.get("crops")
                if not farmer_crops:
                    missing.append("crops")
                    eligible = False
                else:
                    # Check if farmer grows ANY of the applicable crops
                    farmer_crops_lower = [c.lower() for c in farmer_crops]
                    sub_crops_lower = [c.lower() for c in sub_crops]
                    if not set(farmer_crops_lower).intersection(set(sub_crops_lower)):
                        reasons.append(f"Requires crops: {', '.join(sub_crops)}")
                        eligible = False

            # Farmer Category Check
            sub_categories = subsidy.get("farmer_categories")
            if sub_categories:
                if not farmer.get("farmer_category"):
                    missing.append("farmer_category")
                    eligible = False
                elif farmer["farmer_category"].lower() not in [c.lower() for c in sub_categories]:
                    reasons.append(f"Requires farmer category: {', '.join(sub_categories)}")
                    eligible = False

            # Land Type Check
            sub_land_types = subsidy.get("land_types")
            if sub_land_types:
                if not farmer.get("land_type"):
                    missing.append("land_type")
                    eligible = False
                elif farmer["land_type"].lower() not in [lt.lower() for lt in sub_land_types]:
                    reasons.append(f"Requires land type: {', '.join(sub_land_types)}")
                    eligible = False

            # Irrigation Source Check
            sub_irrigations = subsidy.get("irrigation_sources")
            if sub_irrigations:
                if not farmer.get("irrigation_source"):
                    missing.append("irrigation_source")
                    eligible = False
                elif farmer["irrigation_source"].lower() not in [i.lower() for i in sub_irrigations]:
                    reasons.append(f"Requires irrigation source: {', '.join(sub_irrigations)}")
                    eligible = False

            # Compile Results
            if eligible:
                reason_str = "You meet all configured criteria for this subsidy based on your profile."
            elif missing:
                reason_str = "Cannot determine eligibility due to missing profile information."
            else:
                reason_str = "; ".join(reasons)

            eligibility_results.append({
                "subsidy_id": subsidy["id"],
                "subsidy_name": subsidy["name"],
                "eligible": eligible,
                "eligibility_reason": reason_str,
                "missing_information": missing,
                "benefit_description": subsidy["benefit_description"],
                "application_process": subsidy["application_process"],
                "disclaimer": "Estimated eligibility based on available farmer profile and configured subsidy criteria."
            })
            
        return eligibility_results