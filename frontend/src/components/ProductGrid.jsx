import ProductCard from "./ProductCard";

export default function ProductGrid({ products, loading, emptyText = "No products found." }) {
  if (loading) return <div className="state-box">Loading products...</div>;
  if (!products.length) return <div className="state-box">{emptyText}</div>;

  return (
    <div className="product-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
