
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from bson.objectid import ObjectId

app = Flask(__name__)
CORS(app)  # Allow requests from frontend

# MongoDB Configuration
app.config["MONGO_URI"] = "mongodb://localhost:27017/ecommerce"
mongo = PyMongo(app)
db = mongo.db

# API to add a new product
@app.route("/products", methods=["POST"])
def add_product():
    data = request.json
    if not all(k in data for k in ("name", "price", "category", "image_url")):
        return jsonify({"error": "Missing required fields"}), 400

    product_id = db.products.insert_one(data).inserted_id
    return jsonify({"message": "Product added", "product_id": str(product_id)}), 201

# API to get all products
@app.route("/products", methods=["GET"])
def get_products():
    products = list(db.products.find({}, {"_id": 1, "name": 1, "price": 1, "category": 1, "image_url": 1}))
    for product in products:
        product["_id"] = str(product["_id"])
    return jsonify(products)

# API to delete a product
@app.route("/products/<product_id>", methods=["DELETE"])
def delete_product(product_id):
    result = db.products.delete_one({"_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not found"}), 404
    return jsonify({"message": "Product deleted"}), 200

# API to add a product to the cart
@app.route("/cart", methods=["POST"])
def add_to_cart():
    data = request.json
    if "product_id" not in data:
        return jsonify({"error": "Product ID required"}), 400
    
    db.cart.insert_one({"product_id": ObjectId(data["product_id"])})
    return jsonify({"message": "Product added to cart"}), 201

# API to remove a product from the cart
@app.route("/cart/<product_id>", methods=["DELETE"])
def remove_from_cart(product_id):
    result = db.cart.delete_one({"product_id": ObjectId(product_id)})
    if result.deleted_count == 0:
        return jsonify({"error": "Product not in cart"}), 404
    return jsonify({"message": "Product removed from cart"}), 200

# API to get all cart items
@app.route("/cart", methods=["GET"])
def get_cart():
    cart_items = list(db.cart.find({}))
    enriched_cart = []
    
    for item in cart_items:
        product = db.products.find_one({"_id": item["product_id"]}, {"name": 1, "price": 1, "_id": 0})
        if product:
            enriched_cart.append({
                "product_id": str(item["product_id"]),
                "name": product["name"],
                "price": product["price"],
                "quantity": item.get("quantity", 1)  # Default to 1 if not set
            })

    return jsonify(enriched_cart)

if __name__ == "__main__":
    app.run(debug=True)