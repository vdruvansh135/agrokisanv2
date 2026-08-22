# Agro Kisan — FastAPI backend

## Run

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env          # add GEMINI_API_KEY, MONGODB_URI
uvicorn main:app --reload --port 8000
```

Docs: http://localhost:8000/docs

- MongoDB is seeded automatically on first boot (`workers`, `jobs`, `schemes`).
- If MongoDB is not reachable the API serves the same demo documents from memory, so the app still works.
- If `GEMINI_API_KEY` is absent, `/api/ai/intent` falls back to deterministic keyword routing that returns the identical JSON payload.

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/api/labor` | filters: `skill`, `max_distance`, `available_today`, `max_wage` |
| GET | `/api/jobs` | open work posts |
| GET | `/api/schemes` | filter: `acres` |
| GET | `/api/schemes/{id}` | single scheme |
| POST | `/api/ai/intent` | `{ transcript, language, acres, crop }` → strict action JSON |
| GET | `/api/health` | storage mode |

## Frontend wiring

The React app reads `VITE_API_BASE_URL` (default `http://localhost:8000`). CORS already allows
`localhost:5173`, `localhost:8080` and `*.lovable.app`.
