from fastapi import APIRouter, status, Query
from typing import List, Optional
from models.schemes import SchemeCreate, SchemeResponse
from services.scheme_service import SchemeService

router = APIRouter(prefix="/schemes", tags=["Government Schemes"])

@router.get("/", response_model=List[SchemeResponse])
def get_schemes(
    state: Optional[str] = Query(None, description="Filter schemes by state or 'All India'"),
    crop_type: Optional[str] = Query(None, description="Filter schemes by crop type"),
    land_size_acres: Optional[float] = Query(None, description="Filter schemes by land size in acres"),
    farmer_category: Optional[str] = Query(None, description="Filter by farmer category e.g., All, Small & Marginal")
):
    """Smart Government Scheme Aggregator filtered by state, crop type, land size, and category."""
    return SchemeService.get_filtered_schemes(
        state=state,
        crop_type=crop_type,
        land_size_acres=land_size_acres,
        farmer_category=farmer_category
    )

@router.post("/", response_model=SchemeResponse, status_code=status.HTTP_201_CREATED)
def create_scheme(scheme: SchemeCreate):
    """Add a new government scheme to the aggregator database."""
    result = SchemeService.create_scheme(scheme)
    return result