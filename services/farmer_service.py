from database import get_database, get_fallback_db
from models.farmers import FarmerCreate, FarmerUpdate
from typing import Optional, Dict, Any
import logging
from datetime import datetime, timezone
import uuid
from tinydb import Query

logger = logging.getLogger(__name__)

class FarmerService:
    
    @staticmethod
    def get_collection():
        db = get_database()
        return db["farmers"]

    @staticmethod
    def get_fallback_table():
        db = get_fallback_db()
        return db.table("farmers")

    @classmethod
    def create_farmer(cls, farmer_data: FarmerCreate) -> dict:
        data_dict = farmer_data.model_dump()
        
        # 1. UNIVERSAL ID: Generate a standard string ID so both DBs can read it
        data_dict["_id"] = uuid.uuid4().hex
        
        now = datetime.now(timezone.utc)
        # JSON/TinyDB requires datetimes to be strings
        data_dict["created_at"] = now.isoformat()
        data_dict["updated_at"] = now.isoformat()

        try:
            # PRIMARY: Attempt MongoDB
            collection = cls.get_collection()
            existing_farmer = collection.find_one({"phone": farmer_data.phone})
            if existing_farmer:
                raise ValueError("Phone number is already registered to an existing profile.")
            
            collection.insert_one(data_dict)
            
        except ValueError as ve:
            raise ve # Pass validation errors up normally
            
        except Exception as e:
            # FALLBACK: Execute against TinyDB
            logger.warning(f"MongoDB offline. Failing over to TinyDB for create_farmer: {e}")
            fallback_table = cls.get_fallback_table()
            FarmerQ = Query()
            
            if fallback_table.contains(FarmerQ.phone == farmer_data.phone):
                raise ValueError("Phone number is already registered to an existing profile.")
                
            fallback_table.insert(data_dict)
        
        data_dict["id"] = data_dict["_id"]
        del data_dict["_id"]
        return data_dict

    @classmethod
    def get_farmer_by_id(cls, farmer_id: str) -> Optional[dict]:
        try:
            # PRIMARY
            collection = cls.get_collection()
            farmer = collection.find_one({"_id": farmer_id})
        except Exception as e:
            # FALLBACK
            logger.warning(f"MongoDB offline. Failing over to TinyDB for get_farmer: {e}")
            fallback_table = cls.get_fallback_table()
            FarmerQ = Query()
            farmer = fallback_table.get(FarmerQ._id == farmer_id)
        
        if farmer:
            farmer["id"] = farmer["_id"]
            del farmer["_id"]
            return farmer
        return None

    @classmethod
    def update_farmer(cls, farmer_id: str, update_data: FarmerUpdate) -> Optional[dict]:
        update_dict = update_data.model_dump(exclude_unset=True)
        if not update_dict:
            return cls.get_farmer_by_id(farmer_id)

        update_dict["updated_at"] = datetime.now(timezone.utc).isoformat()

        try:
            # PRIMARY
            collection = cls.get_collection()
            if "phone" in update_dict:
                existing = collection.find_one({"phone": update_dict["phone"], "_id": {"$ne": farmer_id}})
                if existing:
                    raise ValueError("New phone number is already registered.")
            
            result = collection.update_one({"_id": farmer_id}, {"$set": update_dict})
            if result.matched_count == 0:
                return None
                
        except ValueError as ve:
            raise ve
            
        except Exception as e:
            # FALLBACK
            logger.warning(f"MongoDB offline. Failing over to TinyDB for update_farmer: {e}")
            fallback_table = cls.get_fallback_table()
            FarmerQ = Query()
            
            if "phone" in update_dict:
                existing = fallback_table.get((FarmerQ.phone == update_dict["phone"]) & (FarmerQ._id != farmer_id))
                if existing:
                    raise ValueError("New phone number is already registered.")
            
            # TinyDB update syntax
            updated_ids = fallback_table.update(update_dict, FarmerQ._id == farmer_id)
            if not updated_ids:
                return None
                
        return cls.get_farmer_by_id(farmer_id)

    @classmethod
    def calculate_completion(cls, farmer: Dict[str, Any]) -> float:
        # (This logic remains exactly the same as it doesn't touch the database)
        important_fields = [
            "name", "phone", "state", "district", "village", 
            "land_size_acres", "land_type", "crops", 
            "farmer_category", "irrigation_source", "preferred_language"
        ]
        
        filled_fields = 0
        for field in important_fields:
            val = farmer.get(field)
            if val is not None:
                if isinstance(val, str) and val.strip() != "":
                    filled_fields += 1
                elif isinstance(val, list) and len(val) > 0:
                    filled_fields += 1
                elif isinstance(val, (int, float)):
                    filled_fields += 1
                    
        return round((filled_fields / len(important_fields)) * 100, 2)