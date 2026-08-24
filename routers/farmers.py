from fastapi import APIRouter, HTTPException, status
from models.farmers import FarmerCreate, FarmerUpdate, FarmerResponse, FarmerSummaryResponse
from services.farmer_service import FarmerService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/farmers", tags=["Farmers"])

@router.post("/", response_model=FarmerResponse, status_code=status.HTTP_201_CREATED)
def create_farmer_profile(farmer: FarmerCreate):
    try:
        new_farmer = FarmerService.create_farmer(farmer)
        return new_farmer
    except ValueError as e:
        # Caught validation errors like duplicate phone
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Failed to create farmer profile: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/{farmer_id}", response_model=FarmerResponse)
def get_farmer_profile(farmer_id: str):
    try:
        farmer = FarmerService.get_farmer_by_id(farmer_id)
        if not farmer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found.")
        return farmer
    except ValueError as e:
        # Caught invalid ObjectId
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving farmer: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.patch("/{farmer_id}", response_model=FarmerResponse)
def update_farmer_profile(farmer_id: str, update_data: FarmerUpdate):
    try:
        updated_farmer = FarmerService.update_farmer(farmer_id, update_data)
        if not updated_farmer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found.")
        return updated_farmer
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error updating farmer: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/{farmer_id}/summary", response_model=FarmerSummaryResponse)
def get_farmer_summary(farmer_id: str):
    try:
        farmer = FarmerService.get_farmer_by_id(farmer_id)
        if not farmer:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Farmer profile not found.")
        
        completion = FarmerService.calculate_completion(farmer)
        
        return FarmerSummaryResponse(
            id=farmer["id"],
            name=farmer["name"],
            phone=farmer["phone"],
            village=farmer.get("village", ""),
            crops=farmer.get("crops", []),
            completion_percentage=completion
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error generating farmer summary: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")