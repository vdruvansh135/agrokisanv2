from database import get_database
from models.soil_test import (
    SoilTestAgentCreate, SoilTestAgentUpdate,
    SoilTestRequestCreate, SoilTestRequestStatusUpdate
)
from services.farmer_service import FarmerService
from typing import List, Optional
import logging
from datetime import datetime, timezone
from bson import ObjectId
from bson.errors import InvalidId

logger = logging.getLogger(__name__)

class SoilTestService:
    
    @staticmethod
    def get_agents_collection():
        db = get_database()
        return db["soil_test_agents"]

    @staticmethod
    def get_requests_collection():
        db = get_database()
        return db["soil_test_requests"]

    # ==========================================
    # SOIL TEST AGENTS
    # ==========================================

    @classmethod
    def create_agent(cls, agent_data: SoilTestAgentCreate) -> dict:
        collection = cls.get_agents_collection()
        data_dict = agent_data.model_dump()
        
        now = datetime.now(timezone.utc)
        data_dict["created_at"] = now
        data_dict["updated_at"] = now

        result = collection.insert_one(data_dict)
        
        data_dict["id"] = str(result.inserted_id)
        if "_id" in data_dict:
            del data_dict["_id"]
            
        return data_dict

    @classmethod
    def get_agents(
        cls, 
        state: str, 
        district: str, 
        village: Optional[str] = None, 
        availability: Optional[bool] = True
    ) -> List[dict]:
        collection = cls.get_agents_collection()
        query = {
            "state": state,
            "district": district
        }
        
        if village:
            query["village"] = village
        if availability is not None:
            query["availability"] = availability

        agents = list(collection.find(query))
        
        formatted = []
        for item in agents:
            item["id"] = str(item["_id"])
            if "_id" in item:
                del item["_id"]
            formatted.append(item)
            
        return formatted

    @classmethod
    def get_agent_by_id(cls, agent_id: str) -> Optional[dict]:
        try:
            obj_id = ObjectId(agent_id)
        except InvalidId:
            raise ValueError("Invalid Soil Test Agent ID format.")

        collection = cls.get_agents_collection()
        agent = collection.find_one({"_id": obj_id})
        
        if agent:
            agent["id"] = str(agent["_id"])
            del agent["_id"]
            return agent
        return None

    @classmethod
    def update_agent(cls, agent_id: str, update_data: SoilTestAgentUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(agent_id)
        except InvalidId:
            raise ValueError("Invalid Soil Test Agent ID format.")

        collection = cls.get_agents_collection()
        update_dict = update_data.model_dump(exclude_unset=True)
        
        if not update_dict:
            return cls.get_agent_by_id(agent_id)

        update_dict["updated_at"] = datetime.now(timezone.utc)
        
        result = collection.update_one(
            {"_id": obj_id},
            {"$set": update_dict}
        )
        
        if result.matched_count == 0:
            return None
            
        return cls.get_agent_by_id(agent_id)

    # ==========================================
    # SOIL TEST REQUESTS
    # ==========================================

    @classmethod
    def create_request(cls, request_data: SoilTestRequestCreate) -> dict:
        # Validate the farmer exists via the existing FarmerService
        farmer = FarmerService.get_farmer_by_id(request_data.farmer_id)
        if not farmer:
            raise ValueError("Farmer profile not found.")

        # Validate the agent exists
        agent = cls.get_agent_by_id(request_data.agent_id)
        if not agent:
            raise ValueError("Soil Test Agent not found.")
        if not agent.get("availability"):
            raise ValueError("Target agent is currently marked as unavailable.")

        requests_collection = cls.get_requests_collection()
        data_dict = request_data.model_dump()
        
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
            raise ValueError("Invalid Soil Test Request ID format.")

        collection = cls.get_requests_collection()
        request_obj = collection.find_one({"_id": obj_id})
        
        if request_obj:
            request_obj["id"] = str(request_obj["_id"])
            del request_obj["_id"]
            return request_obj
        return None

    @classmethod
    def get_requests_by_farmer(cls, farmer_id: str) -> List[dict]:
        # Validate farmer_id format to prevent silent bad queries
        try:
            ObjectId(farmer_id)
        except InvalidId:
            raise ValueError("Invalid Farmer ID format.")

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
    def update_request_status(cls, request_id: str, status_data: SoilTestRequestStatusUpdate) -> Optional[dict]:
        try:
            obj_id = ObjectId(request_id)
        except InvalidId:
            raise ValueError("Invalid Soil Test Request ID format.")

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