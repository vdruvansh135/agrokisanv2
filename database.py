import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "agro_kisan")

try:
    # Explicit TLS configuration with certifi and bypass flags for Windows/OpenSSL environments
    client = MongoClient(
        MONGODB_URL,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=5000
    )
    db = client[DATABASE_NAME]
except Exception:
    # Preserve fallback behavior
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
    db = client[DATABASE_NAME]

def get_database():
    """
    Returns the database instance to be used across services and routers.
    """
    return db