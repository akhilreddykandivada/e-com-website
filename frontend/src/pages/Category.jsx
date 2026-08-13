import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProducts } from "../api/productApi";
import ProductGrid from "../components/ProductGrid";

export default function Category() {
  const { categoryName } = useParams();
  const category = decodeURIComponent(categoryName);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProducts()
      .then((res) => setProducts(Array.isArray(res.data) ? res.data : []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter(
    (p) => String(p.category || "").toLowerCase() === category.toLowerCase()
  );

  return (
    <main className="page-container">
      <div className="page-heading">
        <p className="eyebrow">CATEGORY</p>
        <h1>{category}</h1>
        <p>Products available in this category.</p>
      </div>
      <ProductGrid products={filtered} loading={loading} />
    </main>
  );
}
