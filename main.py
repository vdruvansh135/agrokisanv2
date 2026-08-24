from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import logging
from database import get_database
# Import routers from the routers package
from routers import labours, insurances, schemes, ai

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI application
app = FastAPI(
    title="Agro Kisan Backend",
    description="Unified agriculture safety and utility platform backend for farmers and agricultural workers.",
    version="1.0.0"
)

# Configure CORS for React frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for hackathon development and live demo flexibility
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allows all headers
)

# Include routers adhering strictly to the architecture structure
app.include_router(labours.router)
app.include_router(insurances.router)
app.include_router(schemes.router)
app.include_router(ai.router)

@app.get("/", tags=["Root"])
def read_root():
    """
    Root endpoint to verify server is running smoothly during live demo.
    """
    return {
        "status": "online",
        "project": "Agro Kisan Backend",
        "message": "Welcome to the Agro Kisan API platform. All core modules are active."
    }
@app.get("/health", tags=["Health"])
def health_check():
    try:
        db = get_database()
        # Ping the database to verify live connectivity
        db.command('ping')
        return {
            "status": "healthy",
            "service": "Agro Kisan Backend",
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return {
            "status": "unhealthy",
            "service": "Agro Kisan Backend",
            "database": "disconnected",
            "error": str(e)
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)