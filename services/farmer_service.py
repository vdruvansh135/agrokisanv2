from database import get_database
from models.farmers import FarmerCreate, FarmerUpdate
from typing import Optional, Dict, Any
import logging
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)

class FarmerService:
    
    @staticmethod
    def get_collection():
        db = get_database()
        return db["farmers"]

    @classmethod
    def create_farmer(cls, farmer_data: FarmerCreate) -> dict:
        collection = cls.get_collection()
        
        # Prevent accidental duplicate profiles by phone number
        existing_farmer = collection.find_one({"phone": farmer_data.phone})
        if existing_farmer:
            raise ValueError("Phone number is already registered to an existing profile.")

        data_dict = farmer_data.model_dump()
        now = datetime.now(timezone.utc)
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = collection.insert_one(data_dict)
        
        # Safely map MongoDB ObjectId to standard string id
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_farmer_by_id(cls, farmer_id: str) -> Optional[dict]:
        """
        Reusable core function for future modules (Subsidy, Loan, AI) 
        to fetch central farmer context.
        """
        try:
            obj_id = ObjectId(farmer_id)
        except InvalidId:
            raise ValueError("Invalid Farmer ID format.")

        collection = cls.get_collection()
        farmer = collection.find_one({"_id": obj_id})
        
        if farmer:
            farmer["id"] = str(farmer["_id"])
            del farmer["_id"]
            return farmer
        return None

    @classmethod
    def update_farmer(cls, farmer_id: str, update_data: FarmerUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(farmer_id)
        except InvalidId:
            raise ValueError("Invalid Farmer ID format.")

        collection = cls.get_collection()
        
        # Extract only explicitly provided fields to avoid nulling out existing data
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            # If no updates passed, just return current state
            return cls.get_farmer_by_id(farmer_id)

        update_dict["updated_at"] = datetime.now(timezone.utc)
        
        # Check if updating phone number conflicts with another profile
        if "phone" in update_dict:
            existing = collection.find_one({"phone": update_dict["phone"], "_id": {"$ne": obj_id}})
            if existing:
                raise ValueError("New phone number is already registered to a different profile.")
        
        result = collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return None
            
        return cls.get_farmer_by_id(farmer_id)

    @classmethod
    def calculate_completion(cls, farmer: Dict[str, Any]) -> float:
        """
        Dynamically calculates profile completion, ignoring empty strings and empty lists.
        """
        important_fields = [
            "name", "phone", "state", "district", "village", 
            "land_size_acres", "land_type", "crops", 
            "farmer_category", "irrigation_source", "preferred_language"
        ]
        
        filled_fields = 0
        for field in important_fields:
            val = farmer.get(field)
            if val is not None:
                # Check for actual content rather than just key existence
                if isinstance(val, str) and val.strip() != "":
                    filled_fields += 1
                elif isinstance(val, list) and len(val) > 0:
                    filled_fields += 1
                elif isinstance(val, (int, float)):
                    filled_fields += 1
                    
        return round((filled_fields / len(important_fields)) * 100, 2)