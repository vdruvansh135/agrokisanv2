"""Pydantic models mirroring the MongoDB collections used by Agro Kisan."""

from typing import Any, Dict, List, Literal, Optional

from pydantic import BaseModel, Field


def _oid(doc: Dict[str, Any]) -> Dict[str, Any]:
    """Strip Mongo's ObjectId so the doc is JSON serialisable."""
    doc = dict(doc)
    doc.pop("_id", None)
    return doc


class WorkerProfile(BaseModel):
    """Collection: workers"""

    id: str = Field(..., description="Stable worker id, e.g. 'w1'")
    name: str
    initials: str
    village: str
    location: str = Field(..., description="District / mandal label")
    skills: List[str] = Field(default_factory=list)
    daily_wage: int = Field(..., ge=0, description="Wage in INR per day")
    distance_km: float = Field(..., ge=0)
    rating: float = Field(4.5, ge=0, le=5)
    jobs_done: int = Field(0, ge=0)
    available_today: bool = True
    phone: str


class JobPost(BaseModel):
    """Collection: jobs"""

    id: str
    title: str
    farmer: str
    village: str
    distance_km: float
    date: str
    workers_needed: int
    daily_wage: int


class GovtScheme(BaseModel):
    """Collection: schemes"""

    id: str
    name: str
    department: str
    description: str
    benefit: str
    requirements: List[str] = Field(default_factory=list, description="Required documents")
    mistakes: List[str] = Field(default_factory=list)
    match_percentage: int = Field(..., ge=0, le=100)
    deadline: str
    url: str
    min_acres: float = 0
    max_acres: float = 1000


class IntentRequest(BaseModel):
    transcript: str = Field(..., min_length=1, max_length=1000)
    language: str = "en"
    acres: Optional[float] = None
    crop: Optional[str] = None


class IntentResponse(BaseModel):
    """Strict JSON action payload consumed by the React router."""

    action: Literal[
        "navigate_labor",
        "navigate_schemes",
        "navigate_risk",
        "navigate_records",
        "navigate_wallet",
        "navigate_support",
        "navigate_home",
        "unknown",
    ]
    route: str
    filters: Dict[str, Any] = Field(default_factory=dict)
    reply: str
    thinking: str
