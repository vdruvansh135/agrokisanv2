from database import get_database
from models.water import (
    WaterListingCreate, WaterListingUpdate, 
    WaterRequestCreate, WaterRequestStatusUpdate
)
from typing import List, Optional
import logging
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)

class WaterService:
    
    @staticmethod
    def get_listings_collection():
        db = get_database()
        return db["water_listings"]

    @staticmethod
    def get_requests_collection():
        db = get_database()
        return db["water_requests"]

    # ==========================================
    # WATER LISTINGS (PROVIDERS)
    # ==========================================

    @classmethod
    def create_listing(cls, listing_data: WaterListingCreate) -> dict:
        collection = cls.get_listings_collection()
        data_dict = listing_data.model_dump()
        
        now = datetime.now(timezone.utc)
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = collection.insert_one(data_dict)
        
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_listings(
        cls, 
        state: str, 
        district: str, 
        village: Optional[str] = None, 
        water_source: Optional[str] = None, 
        availability: Optional[bool] = True
    ) -> List[dict]:
        collection = cls.get_listings_collection()
        query = {
            "state": state,
            "district": district
        }
        
        if village:
            query["village"] = village
        if water_source:
            query["water_source"] = water_source
        if availability is not None:
            query["availability"] = availability

        listings = list(collection.find(query))
        
        formatted = []
        for item in listings:
            item["id"] = str(item["_id"])
            if "_id" in item:
                del item["_id"]
            formatted.append(item)
            
        return formatted

    @classmethod
    def get_listing_by_id(cls, listing_id: str) -> Optional[dict]:
        try:
            obj_id = ObjectId(listing_id)
        except InvalidId:
            raise ValueError("Invalid Water Listing ID format.")

        collection = cls.get_listings_collection()
        listing = collection.find_one({"_id": obj_id})
        
        if listing:
            listing["id"] = str(listing["_id"])
            del listing["_id"]
            return listing
        return None

    @classmethod
    def update_listing(cls, listing_id: str, update_data: WaterListingUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(listing_id)
        except InvalidId:
            raise ValueError("Invalid Water Listing ID format.")

        collection = cls.get_listings_collection()
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            return cls.get_listing_by_id(listing_id)

        update_dict["updated_at"] = datetime.now(timezone.utc)
        
        result = collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return None
            
        return cls.get_listing_by_id(listing_id)

    # ==========================================
    # WATER REQUESTS (SEEKERS)
    # ==========================================

    @classmethod
    def create_request(cls, request_data: WaterRequestCreate) -> dict:
        requests_collection = cls.get_requests_collection()
        data_dict = request_data.model_dump()
        
        # If targeting a specific listing, verify it exists
        if data_dict.get("water_listing_id"):
            listing = cls.get_listing_by_id(data_dict["water_listing_id"])
            if not listing:
                raise ValueError("Target water listing not found.")
            if not listing.get("availability"):
                raise ValueError("Target water listing is currently inactive.")

        now = datetime.now(timezone.utc)
        data_dict["status"] = "pending"
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = requests_collection.insert_one(data_dict)
        
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_request_by_id(cls, request_id: str) -> Optional[dict]:
        try:
            obj_id = ObjectId(request_id)
        except InvalidId:
            raise ValueError("Invalid Water Request ID format.")

        collection = cls.get_requests_collection()
        request_obj = collection.find_one({"_id": obj_id})
        
        if request_obj:
            request_obj["id"] = str(request_obj["_id"])
            del request_obj["_id"]
            return request_obj
        return None

    @classmethod
    def get_requests_by_farmer(cls, farmer_id: str) -> List[dict]:
        collection = cls.get_requests_collection()
        requests = list(collection.find({"farmer_id": farmer_id}))
        
        formatted = []
        for req in requests:
            req["id"] = str(req["_id"])
            if "_id" in req:
                del req["_id"]
            formatted.append(req)
            
        return formatted

    @classmethod
    def update_request_status(cls, request_id: str, status_data: WaterRequestStatusUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(request_id)
        except InvalidId:
            raise ValueError("Invalid Water Request ID format.")

        collection = cls.get_requests_collection()
        
        update_dict = {
            "status": status_data.status,
            "updated_at": datetime.now(timezone.utc)
        }
        
        result = collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return None
            
        return cls.get_request_by_id(request_id)