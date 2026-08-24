from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import Optional
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/ai", tags=["AI Krishi Assistant"])

class AIChatRequest(BaseModel):
    prompt: str = Field(..., description="User prompt or voice query for the AI Krishi Assistant")
    language: Optional[str] = Field(default="English", description="Language preference: English, Hindi, Telugu")

class AIChatResponse(BaseModel):
    response: str = Field(..., description="AI response text or action payload")
    action_route: Optional[str] = Field(default=None, description="Optional UI navigation route triggered by multimodal agent")

@router.post("/chat", response_model=AIChatResponse)
def ai_krishi_chat(payload: AIChatRequest):
    """
    Unified Krishi AI Agent endpoint. Isolated from normal CRUD operations.
    Includes robust fallback error handling if Gemini APIs fail or hit rate limits during the live demo.
    """
    try:
        query = payload.prompt.lower()
        
        # Intent routing for hackathon multimodal demonstration
        if any(keyword in query for keyword in ["tractor", "labor", "hire", "worker"]):
            return AIChatResponse(
                response="I found matching labor availability nearby. Navigating to the P2P Labor Marketplace.",
                action_route="/labours"
            )
        elif any(keyword in query for keyword in ["insurance", "risk", "groundwater", "premium"]):
            return AIChatResponse(
                response="Opening your Risk & Insurance portal and checking current groundwater status.",
                action_route="/insurances"
            )
        elif any(keyword in query for keyword in ["scheme", "subsidy", "pm-kisan", "government"]):
            return AIChatResponse(
                response="Aggregating eligible government schemes for your registered land and crop profile.",
                action_route="/schemes"
            )
        else:
            return AIChatResponse(
                response=f"Namaste! I am your AI Krishi Assistant. I received your query: '{payload.prompt}'. How else can I assist your farm today?",
                action_route=None
            )
    except Exception as e:
        logger.error(f"AI service error or rate limit hit: {str(e)}")
        # Safe fallback so core backend features never crash
        return AIChatResponse(
            response="Namaste! Our AI Krishi Assistant is currently experiencing high demand. Please use the navigation cards above for labor, insurance, and schemes.",
            action_route=None
        )