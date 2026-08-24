from __future__ import annotations
from fastapi import APIRouter, status
from typing import List, Dict, Any
from models.insurances import InsuranceCreate, InsuranceResponse
from services.insurance_service import InsuranceService

router = APIRouter(prefix="/insurances", tags=["Insurances & Risk"])

@router.post("/", response_model=InsuranceResponse, status_code=status.HTTP_201_CREATED)
def calculate_and_create_insurance(application: InsuranceCreate) -> Dict[str, Any]:
    """Calculate crop risk, groundwater risk, and estimated insurance premium, then save the application."""
    result = InsuranceService.create_insurance_application(application)
    return result

@router.get("/farmer/{farmer_id}", response_model=List[InsuranceResponse])
def get_farmer_insurance_applications(farmer_id: str) -> List[Dict[str, Any]]:
    """Get insurance applications and claim status timeline tracker for a specific farmer."""
    return InsuranceService.get_applications_by_farmer(farmer_id)