import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="page-container cart-empty">
      <h1>404</h1>
      <p>That page does not exist.</p>
      <Link to="/" className="primary-btn">Go Home</Link>
    </main>
  );
}
