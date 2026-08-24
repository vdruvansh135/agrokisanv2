from pydantic import BaseModel, Field, ConfigDict, model_validator
from typing import Optional, List, Literal
from datetime import datetime

class MachineryListingBase(BaseModel):
    owner_id: str = Field(..., description="ID of the machinery owner")
    owner_name: str = Field(..., description="Name of the machinery owner")
    machinery_name: str = Field(..., description="Name or model of the machinery")
    machinery_type: str = Field(..., description="Type (e.g., tractor, harvester, rotavator)")
    description: str = Field(..., description="Details about condition, attachments, etc.")
    state: str = Field(..., description="State location")
    district: str = Field(..., description="District location")
    village: str = Field(..., description="Village location")
    rental_price: float = Field(..., description="Price for renting")
    price_unit: str = Field(..., description="Unit (e.g., per_hour, per_day, per_acre, custom)")
    availability: bool = Field(default=True, description="Is this currently available for rent?")
    contact_number: str = Field(..., description="Contact phone number of the owner")

class MachineryListingCreate(MachineryListingBase):
    pass

class MachineryListingUpdate(BaseModel):
    owner_name: Optional[str] = None
    machinery_name: Optional[str] = None
    machinery_type: Optional[str] = None
    description: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    rental_price: Optional[float] = None
    price_unit: Optional[str] = None
    availability: Optional[bool] = None
    contact_number: Optional[str] = None

class MachineryListingResponse(MachineryListingBase):
    id: str = Field(..., description="Primary key ID")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class MachineryBookingBase(BaseModel):
    farmer_id: str = Field(..., description="ID of the farmer booking the machinery")
    machinery_id: str = Field(..., description="ID of the machinery listing")
    start_date: datetime = Field(..., description="Requested start date and time")
    end_date: datetime = Field(..., description="Requested end date and time")
    booking_notes: Optional[str] = Field(default=None, description="Additional context or requirements")

class MachineryBookingCreate(MachineryBookingBase):
    @model_validator(mode='after')
    def check_dates(self):
        if self.start_date and self.end_date:
            if self.end_date < self.start_date:
                raise ValueError("end_date cannot be before start_date")
        return self

class MachineryBookingStatusUpdate(BaseModel):
    status: Literal["pending", "accepted", "rejected", "cancelled", "completed"] = Field(
        ..., description="Updated status of the booking"
    )

class MachineryBookingResponse(MachineryBookingBase):
    id: str = Field(..., description="Primary key ID")
    status: str = Field(..., description="Current status of the booking")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )