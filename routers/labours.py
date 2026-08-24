from fastapi import APIRouter
from services.labour_services import LabourService

router = APIRouter(prefix="/labours", tags=["P2P Labour Marketplace"])

@router.get("/")
def get_labours():
    """Fetch available agricultural labourers."""
    return LabourService.get_all_labours()