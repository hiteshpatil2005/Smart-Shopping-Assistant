from fastapi import FastAPI
from products import router as products_router

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Smart Shopping Assistant Backend is running!"}

# Include the /products route
app.include_router(products_router)
