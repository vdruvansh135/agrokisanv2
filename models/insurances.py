from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime, timezone

class InsuranceBase(BaseModel):
    farmer_id: str = Field(..., description="Unique identifier for the farmer")
    aadhaar_number: str = Field(..., description="Government ID for verification (redacted or placeholder in output)")
    crop_name: str = Field(..., description="Name of the registered crop")
    land_size_acres: float = Field(..., description="Land size in acres for risk and premium calculation")
    state: str = Field(..., description="State location of the farm")
    groundwater_level_m: float = Field(..., description="Local groundwater level status in meters")

class InsuranceCreate(InsuranceBase):
    pass

class InsuranceResponse(InsuranceBase):
    id: str = Field(..., description="Application primary key")
    crop_risk_score: float = Field(default=0.0, description="Calculated crop risk score")
    estimated_premium: float = Field(default=0.0, description="Calculated estimated insurance premium in INR")
    groundwater_risk_status: str = Field(default="Safe", description="Groundwater risk status")
    eligibility_status: bool = Field(default=True, description="Eligibility status")
    recommendations: List[str] = Field(default=[], description="Recommendations list")
    claim_status: str = Field(default="Submitted", description="Application status")

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )