from pymongo import MongoClient

# Connect to MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client["ecommerce"]

# Delete all products from the collection
result = db.products.delete_many({})

print(f"Deleted {result.deleted_count} products from the database.")
