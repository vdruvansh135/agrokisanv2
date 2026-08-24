from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from models.soil_test import (
    SoilTestAgentCreate, SoilTestAgentUpdate, SoilTestAgentResponse,
    SoilTestRequestCreate, SoilTestRequestStatusUpdate, SoilTestRequestResponse
)
from services.soil_test_service import SoilTestService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/soil-tests", tags=["Soil Testing"])

# ==========================================
# SOIL TEST AGENTS API
# ==========================================

@router.post("/agents", response_model=SoilTestAgentResponse, status_code=status.HTTP_201_CREATED)
def create_soil_test_agent(agent: SoilTestAgentCreate):
    """Create a new soil testing agent or service provider."""
    try:
        new_agent = SoilTestService.create_agent(agent)
        return new_agent
    except Exception as e:
        logger.error(f"Failed to create soil test agent: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/agents", response_model=List[SoilTestAgentResponse])
def get_soil_test_agents(
    state: str = Query(..., description="Required state filter"),
    district: str = Query(..., description="Required district filter"),
    village: Optional[str] = Query(None, description="Optional village filter"),
    availability: Optional[bool] = Query(True, description="Filter by active/inactive availability")
):
    """Search for soil testing agents based on location."""
    try:
        return SoilTestService.get_agents(
            state=state, 
            district=district, 
            village=village, 
            availability=availability
        )
    except Exception as e:
        logger.error(f"Failed to retrieve soil test agents: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/agents/{agent_id}", response_model=SoilTestAgentResponse)
def get_soil_test_agent(agent_id: str):
    """Get details of a specific soil testing agent."""
    try:
        agent = SoilTestService.get_agent_by_id(agent_id)
        if not agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil test agent not found.")
        return agent
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving soil test agent: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/agents/{agent_id}", response_model=SoilTestAgentResponse)
def update_soil_test_agent(agent_id: str, update_data: SoilTestAgentUpdate):
    """Update agent details or availability."""
    try:
        updated_agent = SoilTestService.update_agent(agent_id, update_data)
        if not updated_agent:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil test agent not found.")
        return updated_agent
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating soil test agent: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


# ==========================================
# SOIL TEST REQUESTS API
# ==========================================

@router.post("/requests", response_model=SoilTestRequestResponse, status_code=status.HTTP_201_CREATED)
def create_soil_test_request(request_data: SoilTestRequestCreate):
    """Create a new request for a soil test service."""
    try:
        new_request = SoilTestService.create_request(request_data)
        return new_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create soil test request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/requests/{request_id}", response_model=SoilTestRequestResponse)
def get_soil_test_request(request_id: str):
    """Get details of a specific soil testing request."""
    try:
        request_obj = SoilTestService.get_request_by_id(request_id)
        if not request_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil test request not found.")
        return request_obj
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving soil test request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/farmer/{farmer_id}/requests", response_model=List[SoilTestRequestResponse])
def get_farmer_soil_test_requests(farmer_id: str):
    """Get all soil testing requests created by a specific farmer."""
    try:
        return SoilTestService.get_requests_by_farmer(farmer_id)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving farmer soil test requests: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/requests/{request_id}/status", response_model=SoilTestRequestResponse)
def update_soil_test_request_status(request_id: str, status_data: SoilTestRequestStatusUpdate):
    """Update the status of a soil testing request."""
    try:
        updated_request = SoilTestService.update_request_status(request_id, status_data)
        if not updated_request:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Soil test request not found.")
        return updated_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating soil test request status: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")