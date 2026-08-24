from database import get_database
from models.machinery import (
    MachineryListingCreate, MachineryListingUpdate,
    MachineryBookingCreate, MachineryBookingStatusUpdate
)
from typing import List, Optional
import logging
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)

class MachineryService:
    
    @staticmethod
    def get_listings_collection():
        db = get_database()
        return db["machinery_listings"]

    @staticmethod
    def get_bookings_collection():
        db = get_database()
        return db["machinery_bookings"]

    # ==========================================
    # MACHINERY LISTINGS
    # ==========================================

    @classmethod
    def create_listing(cls, listing_data: MachineryListingCreate) -> dict:
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
        machinery_type: Optional[str] = None, 
        availability: Optional[bool] = True
    ) -> List[dict]:
        collection = cls.get_listings_collection()
        query = {
            "state": state,
            "district": district
        }
        
        if village:
            query["village"] = village
        if machinery_type:
            query["machinery_type"] = machinery_type
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
            raise ValueError("Invalid Machinery Listing ID format.")

        collection = cls.get_listings_collection()
        listing = collection.find_one({"_id": obj_id})
        
        if listing:
            listing["id"] = str(listing["_id"])
            del listing["_id"]
            return listing
        return None

    @classmethod
    def update_listing(cls, listing_id: str, update_data: MachineryListingUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(listing_id)
        except InvalidId:
            raise ValueError("Invalid Machinery Listing ID format.")

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
    # MACHINERY BOOKINGS
    # ==========================================

    @classmethod
    def create_booking(cls, booking_data: MachineryBookingCreate) -> dict:
        bookings_collection = cls.get_bookings_collection()
        data_dict = booking_data.model_dump()
        
        # Verify the target machinery listing exists
        listing = cls.get_listing_by_id(data_dict["machinery_id"])
        if not listing:
            raise ValueError("Target machinery listing not found.")
        if not listing.get("availability"):
            raise ValueError("Target machinery is not currently marked as available.")

        now = datetime.now(timezone.utc)
        data_dict["status"] = "pending"
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = bookings_collection.insert_one(data_dict)
        
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_booking_by_id(cls, booking_id: str) -> Optional[dict]:
        try:
            obj_id = ObjectId(booking_id)
        except InvalidId:
            raise ValueError("Invalid Machinery Booking ID format.")

        collection = cls.get_bookings_collection()
        booking_obj = collection.find_one({"_id": obj_id})
        
        if booking_obj:
            booking_obj["id"] = str(booking_obj["_id"])
            del booking_obj["_id"]
            return booking_obj
        return None

    @classmethod
    def get_bookings_by_farmer(cls, farmer_id: str) -> List[dict]:
        collection = cls.get_bookings_collection()
        bookings = list(collection.find({"farmer_id": farmer_id}))
        
        formatted = []
        for req in bookings:
            req["id"] = str(req["_id"])
            if "_id" in req:
                del req["_id"]
            formatted.append(req)
            
        return formatted

    @classmethod
    def update_booking_status(cls, booking_id: str, status_data: MachineryBookingStatusUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(booking_id)
        except InvalidId:
            raise ValueError("Invalid Machinery Booking ID format.")

        collection = cls.get_bookings_collection()
        
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
            
        return cls.get_booking_by_id(booking_id)