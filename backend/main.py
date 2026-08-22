from contextlib import asynccontextmanager
from typing import List, Optional

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from ai import parse_intent
from database import close_client, get_db
from models import GovtScheme, IntentRequest, IntentResponse, JobPost, WorkerProfile, _oid
from seed_data import JOBS, SCHEMES, WORKERS

USE_MEMORY_FALLBACK = {"value": False}


async def seed_if_empty() -> None:
    """Create indexes and insert demo documents on first boot."""
    db = get_db()
    await db.workers.create_index("id", unique=True)
    await db.jobs.create_index("id", unique=True)
    await db.schemes.create_index("id", unique=True)
    if await db.workers.count_documents({}) == 0:
        await db.workers.insert_many([dict(w) for w in WORKERS])
    if await db.jobs.count_documents({}) == 0:
        await db.jobs.insert_many([dict(j) for j in JOBS])
    if await db.schemes.count_documents({}) == 0:
        await db.schemes.insert_many([dict(s) for s in SCHEMES])


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        await seed_if_empty()
    except Exception as exc:  # MongoDB not running -> serve seed data from memory
        USE_MEMORY_FALLBACK["value"] = True
        print(f"[agro-kisan] MongoDB unavailable ({exc}); serving in-memory demo data.")
    yield
    await close_client()


app = FastAPI(title="Agro Kisan API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:3000",
    ],
    allow_origin_regex=r"https://.*\.lovable\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/health")
async def health():
    return {"ok": True, "storage": "memory" if USE_MEMORY_FALLBACK["value"] else "mongodb"}


@app.get("/api/labor", response_model=List[WorkerProfile])
async def list_labor(
    skill: Optional[str] = Query(None, description="Filter by skill tag"),
    max_distance: Optional[float] = Query(None, ge=0, description="Max distance in km"),
    available_today: Optional[bool] = Query(None),
    max_wage: Optional[int] = Query(None, ge=0),
):
    if USE_MEMORY_FALLBACK["value"]:
        rows = [dict(w) for w in WORKERS]
    else:
        query: dict = {}
        if skill:
            query["skills"] = skill
        if max_distance is not None:
            query["distance_km"] = {"$lte": max_distance}
        if available_today is not None:
            query["available_today"] = available_today
        if max_wage is not None:
            query["daily_wage"] = {"$lte": max_wage}
        cursor = get_db().workers.find(query).sort("distance_km", 1)
        return [WorkerProfile(**_oid(doc)) async for doc in cursor]

    if skill:
        rows = [w for w in rows if skill in w["skills"]]
    if max_distance is not None:
        rows = [w for w in rows if w["distance_km"] <= max_distance]
    if available_today is not None:
        rows = [w for w in rows if w["available_today"] == available_today]
    if max_wage is not None:
        rows = [w for w in rows if w["daily_wage"] <= max_wage]
    rows.sort(key=lambda w: w["distance_km"])
    return [WorkerProfile(**w) for w in rows]


@app.get("/api/jobs", response_model=List[JobPost])
async def list_jobs():
    if USE_MEMORY_FALLBACK["value"]:
        return [JobPost(**j) for j in JOBS]
    cursor = get_db().jobs.find({}).sort("distance_km", 1)
    return [JobPost(**_oid(doc)) async for doc in cursor]


@app.get("/api/schemes", response_model=List[GovtScheme])
async def list_schemes(acres: Optional[float] = Query(None, ge=0)):
    if USE_MEMORY_FALLBACK["value"]:
        rows = [dict(s) for s in SCHEMES]
    else:
        cursor = get_db().schemes.find({}).sort("match_percentage", -1)
        rows = [_oid(doc) async for doc in cursor]

    if acres is not None:
        rows = [s for s in rows if s["min_acres"] <= acres <= s["max_acres"]]
    rows.sort(key=lambda s: s["match_percentage"], reverse=True)
    return [GovtScheme(**s) for s in rows]


@app.get("/api/schemes/{scheme_id}", response_model=GovtScheme)
async def get_scheme(scheme_id: str):
    if USE_MEMORY_FALLBACK["value"]:
        doc = next((s for s in SCHEMES if s["id"] == scheme_id), None)
    else:
        doc = await get_db().schemes.find_one({"id": scheme_id})
        doc = _oid(doc) if doc else None
    if not doc:
        raise HTTPException(status_code=404, detail="Scheme not found")
    return GovtScheme(**doc)


@app.post("/api/ai/intent", response_model=IntentResponse)
async def ai_intent(payload: IntentRequest):
    result = await parse_intent(payload.transcript, payload.language, payload.acres, payload.crop)
    return IntentResponse(**result)


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
