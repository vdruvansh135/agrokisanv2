from database import get_database
from models.labours import LabourCreate
from typing import List
import logging
import uuid

logger = logging.getLogger(__name__)

class LabourService:
    fallback_labours = [
        {
            "id": "mock_labour_1",
            "name": "Ramesh Kumar",
            "skill_category": "Harvesting",
            "hourly_rate": 250.0,
            "location": "Warangal",
            "phone_number": "+91 9876543210",
            "is_available": True
        },
        {
            "id": "mock_labour_2",
            "name": "Suresh Patel",
            "skill_category": "Tractor Operator",
            "hourly_rate": 400.0,
            "location": "Karimnagar",
            "phone_number": "+91 9876543211",
            "is_available": True
        }
    ]

    @staticmethod
    def get_collection():
        db = get_database()
        return db["labours"]

    @classmethod
    def get_all_labours(cls) -> List[dict]:
        try:
            collection = cls.get_collection()
            labours = list(collection.find({}))
            if labours:
                formatted = []
                for item in labours:
                    item["id"] = str(item["_id"])
                    if "_id" in item:
                        del item["_id"]
                    formatted.append(item)
                return formatted
        except Exception as e:
            logger.warning(f"MongoDB issue: {str(e)}")

        return cls.fallback_labours

    @classmethod
    def create_labour(cls, labour_data: LabourCreate) -> dict:
        data_dict = labour_data.model_dump()
        try:
            collection = cls.get_collection()
            result = collection.insert_one(data_dict)
            data_dict["id"] = str(result.inserted_id)
            if "_id" in data_dict:
                del data_dict["_id"]
            return data_dict
        except Exception as e:
            logger.error(f"Error saving labour: {str(e)}")
            data_dict["id"] = f"temp_{uuid.uuid4().hex[:8]}"
            return data_dict