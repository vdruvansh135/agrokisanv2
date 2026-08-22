"""Gemini-backed intent parsing. The API key never leaves the server."""

import json
import os
import re
from typing import Any, Dict, Optional

from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")
MODEL_NAME = os.environ.get("GEMINI_MODEL", "gemini-1.5-flash")

SYSTEM_PROMPT = """You are Krishi AI, the assistant inside an Indian farming app.
Classify the farmer's request and reply with STRICT JSON only, no markdown fences:
{
  "action": one of ["navigate_labor","navigate_schemes","navigate_risk","navigate_records","navigate_wallet","navigate_support","navigate_home","unknown"],
  "route": one of ["/labor","/schemes","/risk","/records","/wallet","/support","/"],
  "filters": {"skill": string|null, "tab": "hire"|"work"|null, "availableToday": boolean|null},
  "reply": one short sentence for the farmer,
  "thinking": one short sentence describing what you are doing
}
Rules: hiring/finding workers -> navigate_labor. subsidies/government money -> navigate_schemes.
insurance claims, groundwater, weather risk -> navigate_risk. income/expenses/yield -> navigate_records.
land papers/documents -> navigate_wallet. officer or helpline -> navigate_support.
"""

ROUTES = {
    "navigate_labor": "/labor",
    "navigate_schemes": "/schemes",
    "navigate_risk": "/risk",
    "navigate_records": "/records",
    "navigate_wallet": "/wallet",
    "navigate_support": "/support",
    "navigate_home": "/",
    "unknown": "/",
}

SKILLS = ["Harvesting", "Transplanting", "Weeding", "Spraying", "Cotton Picking", "Tractor Driver", "Borewell Repair"]


def _fallback(transcript: str) -> Dict[str, Any]:
    """Keyword routing used when no Gemini key is configured or the call fails."""
    t = transcript.lower()
    rules = [
        (("worker", "labour", "labor", "coolie", "hire", "harvest", "picking", "tractor"), "navigate_labor"),
        (("scheme", "subsidy", "pm kisan", "rythu", "loan", "credit"), "navigate_schemes"),
        (("insurance", "claim", "water", "borewell", "drought", "rain", "risk"), "navigate_risk"),
        (("income", "expense", "profit", "yield", "record", "season"), "navigate_records"),
        (("document", "pattadar", "land paper", "wallet", "certificate"), "navigate_wallet"),
        (("officer", "helpline", "complaint", "support", "call vro"), "navigate_support"),
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
        "reply": "Opening the right screen for you." if action != "unknown" else "I could not understand that yet.",
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
    except Exception:  # network, quota, SDK errors -> deterministic fallback
        return _fallback(transcript)
