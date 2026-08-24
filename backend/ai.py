"""Gemini-backed intent parsing. The API key never leaves the server."""

import json
import os
import re
from typing import Any, Dict, Optional
from dotenv import load_dotenv

# --- FASTAPI IMPORTS ---
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

SYSTEM_PROMPT = """You are Krishi AI, the assistant inside an Indian farming app.
Classify the farmer's request and reply with STRICT JSON only, no markdown fences:
{
  "action": one of ["navigate_labor","navigate_schemes","navigate_risk","navigate_records","navigate_wallet","navigate_support","navigate_market","navigate_community","navigate_alerts","navigate_machinery","navigate_water","navigate_soil","navigate_loans","navigate_home","unknown"],
  "route": one of ["/labor","/schemes","/risk","/records","/wallet","/support","/market","/community","/alerts","/machinery","/water","/soil","/loans","/"],
  "filters": {"skill": string|null, "tab": "hire"|"work"|null, "availableToday": boolean|null},
  "reply": one short, friendly conversational sentence for the farmer in their native language,
  "thinking": one short sentence describing what you are doing
}
Rules: 
- hiring/finding workers -> navigate_labor. 
- subsidies/government money -> navigate_schemes.
- insurance claims, weather risk -> navigate_risk. 
- income/expenses/yield -> navigate_records.
- crop prices/mandi -> navigate_market.
- peer to peer discussions -> navigate_community.
- warnings/notices -> navigate_alerts.
- rent tractors/tools -> navigate_machinery.
- borewell/irrigation sharing -> navigate_water.
- lab testing agents -> navigate_soil.
- bank/credit eligibility -> navigate_loans.
- If they just say "hello" or "how are you", reply warmly and set action to "unknown".
"""

ROUTES = {
    "navigate_labor": "/labor",
    "navigate_schemes": "/schemes",
    "navigate_risk": "/risk",
    "navigate_records": "/records",
    "navigate_wallet": "/wallet",
    "navigate_support": "/support",
    "navigate_market": "/market",
    "navigate_community": "/community",
    "navigate_alerts": "/alerts",
    "navigate_machinery": "/machinery",
    "navigate_water": "/water",
    "navigate_soil": "/soil",
    "navigate_loans": "/loans",
    "navigate_home": "/",
    "unknown": "/",
}

SKILLS = ["Harvesting", "Transplanting", "Weeding", "Spraying", "Cotton Picking", "Tractor Driver", "Borewell Repair"]

def _fallback(transcript: str) -> Dict[str, Any]:
    t = transcript.lower()
    rules = [
        (("worker", "labour", "labor", "coolie", "hire", "harvest", "picking"), "navigate_labor"),
        (("scheme", "subsidy", "pm kisan", "rythu", "credit"), "navigate_schemes"),
        (("insurance", "claim", "drought", "rain", "risk"), "navigate_risk"),
        (("income", "expense", "profit", "yield", "record"), "navigate_records"),
        (("price", "mandi", "market", "sell"), "navigate_market"),
        (("discuss", "forum", "community"), "navigate_community"),
        (("tractor", "rent", "machine", "equipment"), "navigate_machinery"),
        (("water", "borewell", "irrigation"), "navigate_water"),
        (("soil", "test", "lab", "agent"), "navigate_soil"),
        (("loan", "bank", "eligibility"), "navigate_loans"),
    ]
    action = "unknown"
    for keys, act in rules:
        if any(k in t for k in keys):
            action = act
            break

    filters: Dict[str, Any] = {}
    if action == "navigate_labor":
        filters["tab"] = "work" if ("find work" in t or "need job" in t) else "hire"
        for skill in SKILLS:
            if skill.lower().split()[0] in t:
                filters["skill"] = skill
                break

    return {
        "action": action,
        "route": ROUTES[action],
        "filters": filters,
        "reply": "Opening the right screen for you." if action != "unknown" else "Hello! How can I help with your farm today?",
        "thinking": "Understanding your request…",
    }

def _extract_json(text: str) -> Optional[Dict[str, Any]]:
    match = re.search(r"\{.*\}", text, re.S)
    if not match:
        return None
    try:
        return json.loads(match.group(0))
    except json.JSONDecodeError:
        return None

async def parse_intent(transcript: str, language: str = "en", acres: Optional[float] = None,
                       crop: Optional[str] = None) -> Dict[str, Any]:
    if not GEMINI_API_KEY:
        print("WARNING: GEMINI_API_KEY not found in .env file. Using fallback logic.")
        return _fallback(transcript)

    try:
        import google.generativeai as genai
        genai.configure(api_key=GEMINI_API_KEY)
        model = genai.GenerativeModel(MODEL_NAME, system_instruction=SYSTEM_PROMPT)
        context = f"Farmer grows {crop or 'mixed crops'} on {acres or 'a few'} acres. Language: {language}."
        response = await model.generate_content_async(
            f"{context}\nFarmer said: {transcript}",
            generation_config={"response_mime_type": "application/json", "temperature": 0.2},
        )
        data = _extract_json(response.text or "")
        if not data or data.get("action") not in ROUTES:
            return _fallback(transcript)
        data["route"] = ROUTES[data["action"]]
        data.setdefault("filters", {})
        data.setdefault("reply", "Opening the right screen for you.")
        data.setdefault("thinking", "Understanding your request…")
        return data
    except Exception as e:
        print(f"Gemini API Error: {e}")
        return _fallback(transcript)


# ==========================================
# FASTAPI SERVER SETUP
# ==========================================

app = FastAPI(title="Krishi AI Backend")

# THIS IS CRUCIAL: It allows your React frontend to talk to this backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the expected JSON body from React
class AIRequest(BaseModel):
    transcript: str
    language: str = "en"
    acres: Optional[float] = None
    crop: Optional[str] = None

# This creates the actual endpoint at http://localhost:8081/api/intent
@app.post("/api/intent")
async def process_intent(req: AIRequest):
    print(f"Received request: {req.transcript}")
    return await parse_intent(req.transcript, req.language, req.acres, req.crop)

if __name__ == "__main__":
    print("🚀 Starting Krishi AI Server on port 8081...")
    uvicorn.run(app, host="0.0.0.0", port=8081)