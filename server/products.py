from fastapi import APIRouter
from db import db

router = APIRouter()

@router.get("/products")
async def get_products():
    cursor = db.products.find()
    products = []
    async for product in cursor:
        product["_id"] = str(product["_id"])  # convert ObjectId to string
        products.append(product)
    return products
