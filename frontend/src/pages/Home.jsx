import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { getProducts, searchProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams] = useSearchParams();

  const search = (searchParams.get("search") || "").trim();

  useEffect(() => {
    setLoading(true);
    setError("");

    const request = search ? searchProducts(search) : getProducts();

    request
      .then((res) => {
        setProducts(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => {
        console.error(err);
        setError("Could not connect to your Spring Boot backend.");
        setProducts([]);
      })
      .finally(() => setLoading(false));
  }, [search]);

  const categories = [
    ...new Set(products.map((p) => p.category).filter(Boolean))
  ];

  return (
    <>
      <main className="home">
        <section className="hero">
          <div>
            <p className="eyebrow">WELCOME TO OUR STORE</p>
            <h1>Find products you'll love.</h1>
            <p className="hero-text">
              Browse your products, explore categories, view details and add
              your favourites to the cart.
            </p>
            <Link className="primary-btn" to="#products">Shop Products</Link>
          </div>
          <div className="hero-shape">🛍️</div>
        </section>

        {error && (
          <div className="error-box">
            {error}
            <br />
            Make sure Spring Boot is running on port 8080.
          </div>
        )}

        {categories.length > 0 && (
          <section className="section">
            <div className="section-title">
              <div>
                <p className="eyebrow">EXPLORE</p>
                <h2>Shop by Category</h2>
              </div>
            </div>

            <div className="category-cards">
              {categories.map((category) => (
                <Link
                  className="category-card"
                  key={category}
                  to={`/category/${encodeURIComponent(category)}`}
                >
                  <span>◈</span>
                  <strong>{category}</strong>
                  <small>Explore products →</small>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="section" id="products">
          <div className="section-title">
            <div>
              <p className="eyebrow">
                {search ? "SEARCH RESULTS" : "OUR STORE"}
              </p>
              <h2>
                {search ? `Search: ${search}` : "All Products"}
              </h2>
            </div>

            <span className="product-count">
              {loading ? "Searching..." : `${products.length} products`}
            </span>
          </div>

          <ProductGrid
            products={products}
            loading={loading}
            emptyText={
              search
                ? "No products match your search."
                : "No products have been added yet."
            }
          />
        </section>
      </main>

      <Footer />
    </>
  );
}
