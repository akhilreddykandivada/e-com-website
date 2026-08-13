import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useEffect, useRef, useState } from "react";
import { searchProducts } from "../api/productApi";

const categories = ["Electronics", "Mobiles", "Laptops", "Accessories", "Clothing", "Home"];

export default function Navbar() {
  const { count } = useCart();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    const keyword = query.trim();
    clearTimeout(timer.current);

    if (!keyword) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    timer.current = setTimeout(async () => {
      try {
        setSearching(true);
        const response = await searchProducts(keyword);
        setSuggestions(Array.isArray(response.data) ? response.data : []);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search failed:", error);
        setSuggestions([]);
        setShowSuggestions(true);
      } finally {
        setSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer.current);
  }, [query]);

  const doSearch = () => {
    const keyword = query.trim();
    if (!keyword) {
      navigate("/");
      return;
    }
    setShowSuggestions(false);
    navigate(`/?search=${encodeURIComponent(keyword)}`);
  };

  const clearSearch = () => {
    setQuery("");
    setSuggestions([]);
    setShowSuggestions(false);
    navigate("/");
  };

  const openProduct = (id) => {
    setShowSuggestions(false);
    navigate(`/product/${id}`);
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">OG ELECTRONICS Store</Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/add-product">Add Product</Link>
        <Link to="/manage-products">Manage Products</Link>

        <div className="category-menu">
          <button>Categories <span>▼</span></button>
          <div className="category-dropdown">
            {categories.map((category) => (
              <Link key={category} to={`/category/${encodeURIComponent(category)}`}>
                {category}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div className="nav-right">
        <div className="search-container">
          <div className="search-box">
            <input
              className="nav-search"
              value={query}
              placeholder="Search products, brands, categories..."
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => query.trim() && setShowSuggestions(true)}
              onKeyDown={(e) => {
                if (e.key === "Enter") doSearch();
                if (e.key === "Escape") setShowSuggestions(false);
              }}
            />
            {query && <button type="button" className="search-clear" onClick={clearSearch}>×</button>}
            <button type="button" className="search-btn" onClick={doSearch}>Search</button>
          </div>

          {showSuggestions && (
            <div className="search-suggestions">
              {searching && <div className="search-message">Searching...</div>}
              {!searching && suggestions.length === 0 && (
                <div className="search-message">No matching products found</div>
              )}
              {!searching && suggestions.map((product) => (
                <button className="suggestion-item" key={product.id} type="button" onClick={() => openProduct(product.id)}>
                  <img
                    src={`http://localhost:8080/api/product/${product.id}/image`}
                    alt={product.name}
                    onError={(e) => { e.currentTarget.style.display = "none"; }}
                  />
                  <span>
                    <strong>{product.name}</strong>
                    <small>{product.brand || ""} {product.category ? `• ${product.category}` : ""}</small>
                    <small>{product.description || ""}</small>
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        <button className="theme-btn" onClick={() => document.body.classList.toggle("light")}>☾</button>
        <button className="cart-btn" onClick={() => navigate("/cart")}>🛒 Cart {count > 0 && <span className="cart-count">{count}</span>}</button>
      </div>
    </nav>
  );
}
