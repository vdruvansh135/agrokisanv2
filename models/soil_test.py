from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, Literal
from datetime import datetime

class SoilTestAgentBase(BaseModel):
    agent_name: str = Field(..., description="Name of the soil testing agent or agency")
    phone: str = Field(..., description="Contact phone number")
    state: str = Field(..., description="State location")
    district: str = Field(..., description="District location")
    village: str = Field(..., description="Village location")
    email: Optional[str] = Field(default=None, description="Contact email address")
    service_area: Optional[str] = Field(default=None, description="Description of the area covered by the agent")
    services: List[str] = Field(default_factory=list, description="Services offered e.g., soil_sample_collection, soil_testing")
    availability: bool = Field(default=True, description="Is the agent currently available for new requests?")

class SoilTestAgentCreate(SoilTestAgentBase):
    pass

class SoilTestAgentUpdate(BaseModel):
    agent_name: Optional[str] = None
    phone: Optional[str] = None
    state: Optional[str] = None
    district: Optional[str] = None
    village: Optional[str] = None
    email: Optional[str] = None
    service_area: Optional[str] = None
    services: Optional[List[str]] = None
    availability: Optional[bool] = None

class SoilTestAgentResponse(SoilTestAgentBase):
    id: str = Field(..., description="Primary key ID")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class SoilTestRequestBase(BaseModel):
    farmer_id: str = Field(..., description="ID of the farmer making the request")
    agent_id: str = Field(..., description="ID of the soil test agent")
    farm_location: str = Field(..., description="Specific location/address of the farm for sample collection")
    land_size_acres: float = Field(..., description="Size of the land in acres")
    preferred_date: datetime = Field(..., description="Preferred date and time for the service")
    notes: Optional[str] = Field(default=None, description="Additional context or requirements from the farmer")

class SoilTestRequestCreate(SoilTestRequestBase):
    pass

class SoilTestRequestStatusUpdate(BaseModel):
    status: Literal["pending", "contacted", "accepted", "sample_collected", "completed", "cancelled"] = Field(
        ..., description="Updated status of the soil test request"
    )

class SoilTestRequestResponse(SoilTestRequestBase):
    id: str = Field(..., description="Primary key ID")
    status: str = Field(..., description="Current status of the request")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )