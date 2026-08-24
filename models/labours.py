from pydantic import BaseModel, Field, ConfigDict
from typing import Optional

class LabourBase(BaseModel):
    name: str = Field(..., description="Name of the worker or team leader")
    skill_category: str = Field(..., description="e.g., Harvesting, Sowing, Tractor Operator")
    hourly_rate: float = Field(..., description="Rate per hour in INR")
    location: str = Field(..., description="Village or district name")
    phone_number: str = Field(..., description="Contact phone number")
    is_available: bool = Field(default=True, description="Availability status")

# Dual class definitions to resolve router import conflicts
class LabourCreate(LabourBase):
    pass

class LaborerCreate(LabourBase):
    pass

class LabourResponse(LabourBase):
    id: str = Field(..., description="Primary key ID")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class LaborerResponse(LabourResponse):
    pass