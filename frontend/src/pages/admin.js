/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import { getProducts, addProduct, deleteProduct } from "../pages/api/api";

export default function AdminPage() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "",
    image_url: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  // Fetch products from Flask API
  const fetchProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Handle input change for new product form
  const handleChange = (e) => {
    setNewProduct({ ...newProduct, [e.target.name]: e.target.value });
  };

  // Add new product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.image_url || !newProduct.category) {
      alert("All fields are required!");
      return;
    }

    try {
      await addProduct(newProduct);
      setNewProduct({ name: "", price: "", category: "", image_url: "" }); // Reset form
      fetchProducts();
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Delete product
  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProduct(productId);
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      {/* Add Product Form */}
      <form onSubmit={handleAddProduct} className="mb-6">
        <h2 className="text-lg font-semibold mb-2">Add New Product</h2>
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={newProduct.name}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newProduct.price}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newProduct.category}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <input
          type="text"
          name="image_url"
          placeholder="Image URL"
          value={newProduct.image_url}
          onChange={handleChange}
          className="border p-2 rounded w-full mb-2"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Add Product
        </button>
      </form>

      {/* Product List */}
      <h2 className="text-lg font-semibold mt-4">Product List</h2>
      <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        {products.map((product) => (
          <div key={product._id} className="border p-2 shadow-lg rounded-md relative">
            <img src={product.image_url || "https://via.placeholder.com/150"} alt={product.name} className="w-full h-40 object-cover" style={{width: "280px"}}/>
            <h3 className="text-md font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-700">${product.price}</p>
            <p className="text-sm text-gray-500">{product.category}</p>
            <button
              className="bg-red-500 text-white px-4 py-1 rounded mt-2 absolute top-2 right-2"
              onClick={() => handleDeleteProduct(product._id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
