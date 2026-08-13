import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { deleteProduct, getProductImageUrl, getProducts } from "../api/productApi";

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await getProducts();
      setProducts(response.data);
    } catch (err) {
      console.error(err);
      setError("Could not load products. Check your Spring Boot server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id, name) => {
    const confirmed = window.confirm(`Delete "${name}"? This cannot be undone.`);
    if (!confirmed) return;

    try {
      await deleteProduct(id);
      setProducts((old) => old.filter((product) => product.id !== id));
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
          "Delete failed. Implement DELETE /api/product/{id} in Spring Boot."
      );
    }
  };

  if (loading) {
    return <div className="state-box page-state">Loading products...</div>;
  }

  return (
    <main className="page-container">
      <div className="manage-heading">
        <div>
          <span className="eyebrow">STORE ADMIN</span>
          <h1>Manage Products</h1>
          <p>Update or delete products without changing your existing store pages.</p>
        </div>
        <Link to="/add-product" className="primary-btn">+ Add Product</Link>
      </div>

      {error && <div className="error-box">{error}</div>}

      {!error && products.length === 0 && (
        <div className="state-box">No products found.</div>
      )}

      <div className="manage-list">
        {products.map((product) => (
          <article className="manage-card" key={product.id}>
            <img
              src={getProductImageUrl(product.id)}
              alt={product.name}
              onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
            />

            <div className="manage-info">
              <span className="pill">{product.category}</span>
              <h2>{product.name}</h2>
              <p>Brand: <strong>{product.brand}</strong></p>
              <p>Price: <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong></p>
              <p>Quantity: {product.quantity}</p>
              <p>{product.available ? "✓ Available" : "✕ Not Available"}</p>
            </div>

            <div className="manage-actions">
              <button
                className="secondary-btn"
                onClick={() => navigate(`/update-product/${product.id}`)}
              >
                Update
              </button>
              <button
                className="danger-btn"
                onClick={() => handleDelete(product.id, product.name)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </main>
  );
}
