from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class FarmerBase(BaseModel):
    name: str = Field(..., description="Full name of the farmer")
    phone: str = Field(..., description="Contact phone number")
    state: str = Field(..., description="State of residence")
    district: str = Field(..., description="District of residence")
    village: str = Field(..., description="Village of residence")
    land_size_acres: float = Field(..., description="Total land size in acres")
    land_type: str = Field(..., description="Type of land (e.g., Irrigated, Rainfed)")
    crops: List[str] = Field(default_factory=list, description="List of cultivated crops")
    farmer_category: str = Field(..., description="Category (e.g., Small, Marginal, Large)")
    irrigation_source: str = Field(..., description="Primary source of irrigation")
    preferred_language: Optional[str] = Field(default="en", description="Preferred communication language")

class FarmerCreate(FarmerBase):
    pass

class FarmerUpdate(BaseModel):
    name: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    land_size_acres: Optional[float] = None
    land_type: Optional[str] = None
    crops: Optional[List[str]] = None
    farmer_category: Optional[str] = None
    irrigation_source: Optional[str] = None
    preferred_language: Optional[str] = None

class FarmerResponse(FarmerBase):
    id: str = Field(..., description="Primary key ID")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class FarmerSummaryResponse(BaseModel):
    id: str
    name: str
    phone: str
    village: str
    crops: List[str]
    completion_percentage: float