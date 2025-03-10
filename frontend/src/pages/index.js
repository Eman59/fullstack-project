/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { getProducts, getCart, addToCart, removeFromCart } from "../pages/api/api";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({});
  const [productMap, setProductMap] = useState({}); // Map productId -> product details

  useEffect(() => {
    fetchProducts();
    fetchCart();
  }, []);

  // Fetch products from Flask API
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
      const map = data.reduce((acc, product) => {
        acc[product._id] = product;
        return acc;
      }, {});
      setProductMap(map);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch cart from Flask API
  const fetchCart = async () => {
    try {
      const cartItems = await getCart();
      const cartData = cartItems.reduce((acc, item) => {
        acc[item.product_id] = item.quantity || 1;
        return acc;
      }, {});
      setCart(cartData);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  // Add product to cart
  const handleAddToCart = async (productId) => {
    if (cart[productId]) {
      setCart((prev) => ({ ...prev, [productId]: prev[productId] + 1 }));
    } else {
      try {
        await addToCart(productId);
        fetchCart();
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    }
  };

  // Remove product from cart
  const handleDecreaseQuantity = async (productId) => {
    if (cart[productId] > 1) {
      setCart((prev) => ({ ...prev, [productId]: prev[productId] - 1 }));
    }
  };

   // Remove product from cart completely
   const handleRemoveFromCart = async (productId) => {
    try {
      await removeFromCart(productId);
      fetchCart();
    } catch (error) {
      console.error("Error removing from cart:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold">E-Commerce Store</h1>

      {/* Product List */}
      <h2 className="text-lg font-semibold mt-4">Available Products</h2>
      <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        {products.map((product) => (
          <div key={product._id} className="border p-2 shadow-lg rounded-md">
            <img src={product.image_url || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-40 object-cover"  style={{width: "280px"}} />
            <h3 className="text-md font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-700">${product.price}</p>
            <button
              className="bg-blue-500 text-white px-4 py-1 rounded mt-2"
              onClick={() => handleAddToCart(product._id)}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>

      {/* Shopping Cart */}
      <h2 className="text-lg font-semibold mt-6">Shopping Cart</h2>
      <div>
        {Object.keys(cart).length > 0 ? (
          Object.keys(cart).map((productId) => (
            <div key={productId} className="border p-2 shadow-md rounded-md flex justify-between items-center">
              <h3>{productMap[productId]?.name || "Unknown Product"}</h3>
              <div className="flex items-center">
                <button
                  className="bg-red-500 text-white px-2 py-1 rounded"
                  onClick={() => handleDecreaseQuantity(productId)}
                >
                  -
                </button>
                <span className="mx-3">{cart[productId]}</span>
                <button
                  className="bg-green-500 text-white px-2 py-1 rounded"
                  onClick={() => handleAddToCart(productId)}
                >
                  +
                </button>
              </div>

              <button
                  className="bg-gray-700 text-white px-2 py-1 rounded ml-4"
                  onClick={() => handleRemoveFromCart(productId)}
                >
                  X
                </button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Cart is empty</p>
        )}
      </div>
    </div>
  );
}
