from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone

class SchemeBase(BaseModel):
    scheme_name: str = Field(..., description="Name of the government agricultural scheme")
    announcement_date: str = Field(..., description="Date when the scheme was announced")
    state: str = Field(..., description="Target state or 'All India' for central schemes")
    crop_type: Optional[str] = Field(default=None, description="Applicable crop type if specific")
    max_land_size_acres: Optional[float] = Field(default=None, description="Maximum land size in acres for eligibility")
    farmer_category: str = Field(..., description="Category of farmer e.g., All, Small & Marginal, Women")
    benefits: List[str] = Field(default=[], description="Financial limits and core benefits offered")
    eligibility_criteria: List[str] = Field(default=[], description="Detailed criteria on who the scheme is for")
    required_documents: List[str] = Field(default=[], description="Checklist of required documents")
    mistakes_to_avoid: List[str] = Field(default=[], description="Warning box of common application mistakes")
    deadline: str = Field(..., description="Application deadline date or countdown reference")
    registration_link: str = Field(..., description="External official government portal registration link")

class SchemeCreate(SchemeBase):
    pass

class SchemeInDB(SchemeBase):
    id: str = Field(..., alias="_id")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

    model_config = ConfigDict(
        populate_by_name=True,
        json_encoders={datetime: lambda v: v.isoformat()}
    )

class SchemeResponse(SchemeBase):
    id: str

    model_config = ConfigDict(
        populate_by_name=True
    )