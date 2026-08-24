from fastapi import APIRouter, HTTPException, status, Query
from typing import List, Optional
from models.machinery import (
    MachineryListingCreate, MachineryListingUpdate, MachineryListingResponse,
    MachineryBookingCreate, MachineryBookingStatusUpdate, MachineryBookingResponse
)
from services.machinery_service import MachineryService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/machinery", tags=["Machinery Rental"])

# ==========================================
# MACHINERY LISTINGS API
# ==========================================

@router.post("/listings", response_model=MachineryListingResponse, status_code=status.HTTP_201_CREATED)
def create_machinery_listing(listing: MachineryListingCreate):
    """Create a new machinery availability listing."""
    try:
        new_listing = MachineryService.create_listing(listing)
        return new_listing
    except Exception as e:
        logger.error(f"Failed to create machinery listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/listings", response_model=List[MachineryListingResponse])
def get_machinery_listings(
    state: str = Query(..., description="Required state filter"),
    district: str = Query(..., description="Required district filter"),
    village: Optional[str] = Query(None, description="Optional village filter"),
    machinery_type: Optional[str] = Query(None, description="Optional machinery type filter"),
    availability: Optional[bool] = Query(True, description="Filter by active/inactive availability")
):
    """Search for available machinery listings."""
    try:
        return MachineryService.get_listings(
            state=state, 
            district=district, 
            village=village, 
            machinery_type=machinery_type, 
            availability=availability
        )
    except Exception as e:
        logger.error(f"Failed to retrieve machinery listings: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/listings/{machinery_id}", response_model=MachineryListingResponse)
def get_machinery_listing(machinery_id: str):
    """Get details of a specific machinery listing."""
    try:
        listing = MachineryService.get_listing_by_id(machinery_id)
        if not listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery listing not found.")
        return listing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving machinery listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/listings/{machinery_id}", response_model=MachineryListingResponse)
def update_machinery_listing(machinery_id: str, update_data: MachineryListingUpdate):
    """Update machinery details or toggle availability."""
    try:
        updated_listing = MachineryService.update_listing(machinery_id, update_data)
        if not updated_listing:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery listing not found.")
        return updated_listing
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating machinery listing: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")


# ==========================================
# MACHINERY BOOKINGS API
# ==========================================

@router.post("/bookings", response_model=MachineryBookingResponse, status_code=status.HTTP_201_CREATED)
def create_machinery_booking(booking_data: MachineryBookingCreate):
    """Create a new booking request for a machinery listing."""
    try:
        new_booking = MachineryService.create_booking(booking_data)
        return new_booking
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create machinery booking: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/bookings/{booking_id}", response_model=MachineryBookingResponse)
def get_machinery_booking(booking_id: str):
    """Get details of a specific machinery booking."""
    try:
        booking_obj = MachineryService.get_booking_by_id(booking_id)
        if not booking_obj:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery booking not found.")
        return booking_obj
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving machinery booking: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/farmer/{farmer_id}/bookings", response_model=List[MachineryBookingResponse])
def get_farmer_machinery_bookings(farmer_id: str):
    """Get all machinery bookings created by a specific farmer."""
    try:
        return MachineryService.get_bookings_by_farmer(farmer_id)
    except Exception as e:
        logger.error(f"Error retrieving farmer machinery bookings: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/bookings/{booking_id}/status", response_model=MachineryBookingResponse)
def update_machinery_booking_status(booking_id: str, status_data: MachineryBookingStatusUpdate):
    """Update the status of a machinery booking."""
    try:
        updated_booking = MachineryService.update_booking_status(booking_id, status_data)
        if not updated_booking:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Machinery booking not found.")
        return updated_booking
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating machinery booking status: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")