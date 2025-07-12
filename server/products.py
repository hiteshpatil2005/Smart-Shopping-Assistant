# products.py
from fastapi import APIRouter
from database import db

router = APIRouter()

@router.get("/products")
async def get_products():
    # Ensure database connection
    if db.db is None:
        await db.connect()
    
    cursor = db.products.find()
    products = []
    async for product in cursor:
        product["_id"] = str(product["_id"])  # convert ObjectId to string
        products.append(product)
    return products