from fastapi import APIRouter, HTTPException, status
from typing import List
from models.subsidies import SubsidyCreate, SubsidyResponse, SubsidyEligibilityResponse
from services.subsidy_service import SubsidyService
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/subsidies", tags=["Subsidies"])

@router.post("/", response_model=SubsidyResponse, status_code=status.HTTP_201_CREATED)
def create_subsidy(subsidy: SubsidyCreate):
    """Add a new government subsidy to the aggregator database."""
    try:
        new_subsidy = SubsidyService.create_subsidy(subsidy)
        return new_subsidy
    except Exception as e:
        logger.error(f"Failed to create subsidy: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/", response_model=List[SubsidyResponse])
def get_all_subsidies():
    """Retrieve all active subsidies."""
    try:
        return SubsidyService.get_all_subsidies()
    except Exception as e:
        logger.error(f"Failed to retrieve subsidies: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/{subsidy_id}", response_model=SubsidyResponse)
def get_subsidy(subsidy_id: str):
    """Get details of a specific subsidy by its ID."""
    try:
        subsidy = SubsidyService.get_subsidy_by_id(subsidy_id)
        if not subsidy:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Subsidy not found.")
        return subsidy
    except ValueError as e:
        # Caught invalid ObjectId format
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error retrieving subsidy: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")

@router.get("/farmer/{farmer_id}/eligible", response_model=List[SubsidyEligibilityResponse])
def get_farmer_eligible_subsidies(farmer_id: str):
    """Evaluate and return personalized subsidy recommendations for a specific farmer profile."""
    try:
        results = SubsidyService.evaluate_farmer_eligibility(farmer_id)
        return results
    except ValueError as e:
        if str(e) == "Farmer profile not found.":
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=str(e))
        # Handle InvalidId for Farmer ID
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    except Exception as e:
        logger.error(f"Error calculating subsidy eligibility: {str(e)}")
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Internal Server Error")