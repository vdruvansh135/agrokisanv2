import os
from pymongo import MongoClient
from dotenv import load_dotenv
import certifi
from tinydb import TinyDB  # <-- New Import for offline fallback

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "agro_kisan")

# Initialize TinyDB as our emergency offline JSON database
tinydb_fallback = TinyDB('fallback_database.json')

try:
    # Lowered the timeout to 2000ms so the UI doesn't hang if Mongo drops
    client = MongoClient(
        MONGODB_URL,
        tls=True,
        tlsCAFile=certifi.where(),
        tlsAllowInvalidCertificates=True,
        serverSelectionTimeoutMS=2000 
    )
    db = client[DATABASE_NAME]
except Exception:
    # Preserve fallback behavior
    client = MongoClient("mongodb://localhost:27017", serverSelectionTimeoutMS=2000)
    db = client[DATABASE_NAME]

def get_database():
    """Returns the primary MongoDB instance."""
    return db

def get_fallback_db():
    """Returns the emergency TinyDB instance."""
    return tinydb_fallback