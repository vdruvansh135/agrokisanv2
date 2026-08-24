from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

class SubsidyBase(BaseModel):
    name: str = Field(..., description="Name of the subsidy")
    description: str = Field(..., description="Detailed description of the subsidy")
    provider: str = Field(..., description="Government body or organization providing the subsidy")
    state: Optional[str] = Field(default="All India", description="Applicable state, or 'All India'")
    district: Optional[str] = Field(default=None, description="Applicable district, if restricted")
    
    # Eligibility Criteria (Empty or null means no restriction)
    applicable_crops: Optional[List[str]] = Field(default_factory=list, description="Crops covered")
    farmer_categories: Optional[List[str]] = Field(default_factory=list, description="Categories like Small, Marginal")
    min_land_acres: Optional[float] = Field(default=None, description="Minimum land size required")
    max_land_acres: Optional[float] = Field(default=None, description="Maximum land size allowed")
    land_types: Optional[List[str]] = Field(default_factory=list, description="e.g., Irrigated, Rainfed")
    irrigation_sources: Optional[List[str]] = Field(default_factory=list, description="e.g., Borewell, Canal")
    
    # Benefits & Process
    benefit_description: str = Field(..., description="Description of what the farmer receives")
    benefit_amount_or_percentage: str = Field(..., description="Exact amount or percentage subsidized")
    required_documents: List[str] = Field(default_factory=list, description="Documents needed to apply")
    application_process: str = Field(..., description="Steps to apply")
    application_url: Optional[str] = Field(default=None, description="Official portal URL")
    active: bool = Field(default=True, description="Is this subsidy currently active?")

class SubsidyCreate(SubsidyBase):
    pass

class SubsidyResponse(SubsidyBase):
    id: str = Field(..., description="Primary key ID")
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )

class SubsidyEligibilityResponse(BaseModel):
    subsidy_id: str
    subsidy_name: str
    eligible: bool
    eligibility_reason: str
    missing_information: List[str]
    benefit_description: str
    application_process: str
    disclaimer: str = "Estimated eligibility based on available farmer profile and configured subsidy criteria."