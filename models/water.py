from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal
from datetime import datetime

class WaterListingBase(BaseModel):
    provider_id: str = Field(..., description="ID of the farmer or provider offering water")
    provider_name: str = Field(..., description="Name of the provider")
    state: str = Field(..., description="State location")
    district: str = Field(..., description="District location")
    village: str = Field(..., description="Village location")
    water_available: float = Field(..., description="Quantity of water available")
    water_unit: str = Field(..., description="Unit of measurement (e.g., Liters, Tankers, Gallons)")
    water_source: str = Field(..., description="Source (e.g., borewell, canal, tanker, pond, other)")
    availability: bool = Field(default=True, description="Is this listing currently active?")
    contact_number: str = Field(..., description="Contact phone number")

class WaterListingCreate(WaterListingBase):
    pass

class WaterListingUpdate(BaseModel):
    provider_name: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    water_available: Optional[float] = None
    water_unit: Optional[str] = None
    water_source: Optional[str] = None
    availability: Optional[bool] = None
    contact_number: Optional[str] = None

class WaterListingResponse(WaterListingBase):
    id: str = Field(..., description="Primary key ID")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class WaterRequestBase(BaseModel):
    farmer_id: str = Field(..., description="ID of the farmer requesting water")
    water_listing_id: Optional[str] = Field(default=None, description="Optional ID of a specific water listing being requested")
    state: str = Field(..., description="State location")
    district: str = Field(..., description="District location")
    village: str = Field(..., description="Village location")
    water_required: float = Field(..., description="Quantity of water needed")
    water_unit: str = Field(..., description="Unit of measurement (e.g., Liters, Tankers)")
    purpose: str = Field(..., description="Purpose (e.g., irrigation, livestock, agricultural use)")
    required_date: datetime = Field(..., description="When the water is needed")
    contact_number: str = Field(..., description="Contact phone number of requester")
    notes: Optional[str] = Field(default=None, description="Additional context or requirements")

class WaterRequestCreate(WaterRequestBase):
    pass

class WaterRequestStatusUpdate(BaseModel):
    status: Literal["pending", "matched", "accepted", "rejected", "completed", "cancelled"] = Field(
        ..., description="Updated status of the request"
    )

class WaterRequestResponse(WaterRequestBase):
    id: str = Field(..., description="Primary key ID")
    status: str = Field(..., description="Current status of the request")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )