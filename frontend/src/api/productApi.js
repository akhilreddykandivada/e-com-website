import axios from "axios";

export const API_BASE_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL
});

export const getProducts = () => api.get("/products");

export const getProduct = (id) => api.get(`/product/${id}`);

export const getProductImageUrl = (id) =>
  `${API_BASE_URL}/product/${id}/image`;

// Search is handled by the Spring Boot backend.
// Example: /api/product/search?keyword=iphone
export const searchProducts = (keyword) =>
  api.get("/product/search", {
    params: { keyword }
  });

export const addProduct = (product, image) => {
  const data = new FormData();

  data.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" })
  );
  data.append("image", image);

  return api.post("/product", data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Update an existing product. The image is optional.
export const updateProduct = (id, product, image = null) => {
  const data = new FormData();

  data.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" })
  );

  if (image) {
    data.append("image", image);
  }

  return api.put(`/product/${id}`, data, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};

// Delete an existing product.
export const deleteProduct = (id) => api.delete(`/product/${id}`);

export default api;
