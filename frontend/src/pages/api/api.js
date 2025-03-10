import axios from "axios";

const API_URL = "http://127.0.0.1:5000";

// Fetch all products
export const getProducts = async () => {
  const res = await axios.get(`${API_URL}/products`);
  return res.data;
};

// Add a new product
export const addProduct = async (product) => {
  await axios.post(`${API_URL}/products`, product);
};

// Delete a product
export const deleteProduct = async (id) => {
  await axios.delete(`${API_URL}/products/${id}`);
};

// Fetch all cart items
export const getCart = async () => {
  const res = await axios.get(`${API_URL}/cart`);
  return res.data;
};

// Add a product to the cart
export const addToCart = async (productId) => {
  await axios.post(`${API_URL}/cart`, { product_id: productId });
};

// Remove a product from the cart
export const removeFromCart = async (productId) => {
  await axios.delete(`${API_URL}/cart/${productId}`);
};
