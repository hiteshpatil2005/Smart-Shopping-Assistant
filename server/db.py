from motor.motor_asyncio import AsyncIOMotorClient

# Your MongoDB connection string
MONGO_URI = "mongodb+srv://hiteshpatil2005:HDPatil%402005@cluster0.rkbgruy.mongodb.net/smartShopDB?retryWrites=true&w=majority&appName=Cluster0"

# Create the MongoDB client
client = AsyncIOMotorClient(MONGO_URI)

# Reference to your database
db = client.smartShopDB
