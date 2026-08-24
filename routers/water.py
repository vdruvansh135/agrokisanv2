from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from models.water import (
    WaterListingCreate, WaterListingUpdate, WaterListingResponse,
    WaterRequestCreate, WaterRequestStatusUpdate, WaterRequestResponse
)
from services.water_service import WaterService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/water", tags=["Water Exchange"])

# ==========================================
# WATER LISTINGS API
# ==========================================

@router.post("/listings", response_model=WaterListingResponse, status_code=status.HTTP_201_CREATED)
def create_water_listing(listing: WaterListingCreate):
    """Create a new water availability listing."""
    try:
        new_listing = WaterService.create_listing(listing)
        return new_listing
    except Exception as e:
        logger.error(f"Failed to create water listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/listings", response_model=List[WaterListingResponse])
def get_water_listings(
    state: str = Query(..., description="Required state filter"),
    district: str = Query(..., description="Required district filter"),
    village: Optional[str] = Query(None, description="Optional village filter"),
    water_source: Optional[str] = Query(None, description="Optional water source filter"),
    availability: Optional[bool] = Query(True, description="Filter by active/inactive status")
):
    """Search for available water listings."""
    try:
        return WaterService.get_listings(
            state=state, 
            district=district, 
            village=village, 
            water_source=water_source, 
            availability=availability
        )
    except Exception as e:
        logger.error(f"Failed to retrieve water listings: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/listings/{listing_id}", response_model=WaterListingResponse)
def get_water_listing(listing_id: str):
    """Get details of a specific water listing."""
    try:
        listing = WaterService.get_listing_by_id(listing_id)
        if not listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water listing not found.")
        return listing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving water listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/listings/{listing_id}", response_model=WaterListingResponse)
def update_water_listing(listing_id: str, update_data: WaterListingUpdate):
    """Update a water listing (e.g., mark it inactive)."""
    try:
        updated_listing = WaterService.update_listing(listing_id, update_data)
        if not updated_listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water listing not found.")
        return updated_listing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating water listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


# ==========================================
# WATER REQUESTS API
# ==========================================

@router.post("/requests", response_model=WaterRequestResponse, status_code=status.HTTP_201_CREATED)
def create_water_request(request_data: WaterRequestCreate):
    """Create a new request for water (can be tied to a specific listing or general)."""
    try:
        new_request = WaterService.create_request(request_data)
        return new_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create water request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/requests/{request_id}", response_model=WaterRequestResponse)
def get_water_request(request_id: str):
    """Get details of a specific water request."""
    try:
        request_obj = WaterService.get_request_by_id(request_id)
        if not request_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water request not found.")
        return request_obj
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving water request: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/farmer/{farmer_id}/requests", response_model=List[WaterRequestResponse])
def get_farmer_water_requests(farmer_id: str):
    """Get all water requests created by a specific farmer."""
    try:
        return WaterService.get_requests_by_farmer(farmer_id)
    except Exception as e:
        logger.error(f"Error retrieving farmer water requests: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/requests/{request_id}/status", response_model=WaterRequestResponse)
def update_water_request_status(request_id: str, status_data: WaterRequestStatusUpdate):
    """Update the status of a water request."""
    try:
        updated_request = WaterService.update_request_status(request_id, status_data)
        if not updated_request:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Water request not found.")
        return updated_request
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating water request status: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")