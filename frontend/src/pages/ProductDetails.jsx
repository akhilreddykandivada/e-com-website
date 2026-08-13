import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getProduct, getProductImageUrl } from "../api/productApi";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProduct(id)
      .then((res) => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="state-box page-state">Loading product...</div>;
  if (!product) return <div className="state-box page-state">Product not found.</div>;

  return (
    <main className="page-container">
      <Link to="/" className="back-link">← Back to products</Link>

      <section className="details">
        <div className="details-image">
          <img
            src={getProductImageUrl(product.id)}
            alt={product.name}
            onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
          />
        </div>

        <div className="details-content">
          <span className="pill">{product.category}</span>
          <h1>{product.name}</h1>
          <p className="details-brand">Brand: <strong>{product.brand}</strong></p>
          <p className="details-description">{product.description}</p>

          <div className="details-price">
            ₹{Number(product.price || 0).toLocaleString("en-IN")}
          </div>

          <div className="details-meta">
            <span>Stock: {product.quantity}</span>
            <span>{product.available ? "✓ Available" : "✕ Not Available"}</span>
          </div>

          <button
            className="primary-btn"
            disabled={!product.available}
            onClick={() => addToCart(product)}
          >
            {product.available ? "Add to Cart" : "Unavailable"}
          </button>
        </div>
      </section>
    </main>
  );
}
