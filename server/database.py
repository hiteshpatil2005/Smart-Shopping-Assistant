# database.py
from motor.motor_asyncio import AsyncIOMotorClient
from typing import Optional
from dotenv import load_dotenv
import os

load_dotenv()

# Get MongoDB connection string from environment variable
MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://hiteshpatil2005:HDPatil%402005@cluster0.rkbgruy.mongodb.net/smartShopDB?retryWrites=true&w=majority&tls=true&tlsAllowInvalidCertificates=false")

class Database:
    def __init__(self):
        self.client = None
        self.db = None

    async def connect(self):
        if self.client is None:  # Fixed: Use explicit None comparison
            self.client = AsyncIOMotorClient(MONGO_URI)
            self.db = self.client.smartShopDB
        return self.db

    async def close(self):
        if self.client is not None:  # Fixed: Use explicit None comparison
            self.client.close()

    def __getattr__(self, name):
        # Proxy database operations to the actual database
        if self.db is not None:  # Fixed: Use explicit None comparison
            return getattr(self.db, name)
        raise AttributeError(f"Database not connected. Call connect() first.")

# Create a global instance
db = Database()