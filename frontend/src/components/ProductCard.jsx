import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImageUrl } from "../api/productApi";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <article className="product-card">
      <Link to={`/product/${product.id}`} className="image-wrap">
        <img
          src={getProductImageUrl(product.id)}
          alt={product.name}
          onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
        />
      </Link>

      <div className="product-info">
        <div className="product-category">{product.category || "Product"}</div>
        <Link to={`/product/${product.id}`} className="product-name">
          {product.name}
        </Link>
        <p className="product-brand">{product.brand}</p>
        <div className="card-bottom">
          <strong>₹{Number(product.price || 0).toLocaleString("en-IN")}</strong>
          <button
            className="small-cart"
            disabled={product.available === false}
            onClick={() => addToCart(product)}
          >
            {product.available === false ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </article>
  );
}
