import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { getProductImageUrl } from "../api/productApi";

export default function Cart() {
  const { cart, total, changeQuantity, removeFromCart, clearCart } = useCart();

  if (!cart.length) {
    return (
      <main className="page-container cart-empty">
        <div className="empty-icon">🛒</div>
        <h1>Your cart is empty</h1>
        <p>Add some products from the home page.</p>
        <Link to="/" className="primary-btn">Continue Shopping</Link>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className="page-heading compact">
        <p className="eyebrow">SHOPPING CART</p>
        <h1>Your Cart</h1>
      </div>

      <div className="cart-layout">
        <section className="cart-items">
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={getProductImageUrl(item.id)}
                alt={item.name}
                onError={(e) => { e.currentTarget.src = "/placeholder.svg"; }}
              />
              <div className="cart-item-info">
                <Link to={`/product/${item.id}`}>{item.name}</Link>
                <small>{item.brand} · {item.category}</small>
                <strong>₹{Number(item.price || 0).toLocaleString("en-IN")}</strong>
              </div>
              <div className="quantity">
                <button onClick={() => changeQuantity(item.id, -1)}>−</button>
                <span>{item.cartQuantity}</span>
                <button onClick={() => changeQuantity(item.id, 1)}>+</button>
              </div>
              <button className="remove" onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
        </section>

        <aside className="cart-summary">
          <h2>Order Summary</h2>
          <div><span>Items</span><span>{cart.reduce((s, x) => s + x.cartQuantity, 0)}</span></div>
          <div className="total"><span>Total</span><strong>₹{total.toLocaleString("en-IN")}</strong></div>
          <button className="primary-btn checkout">Proceed to Checkout</button>
          <button className="clear-btn" onClick={clearCart}>Clear Cart</button>
        </aside>
      </div>
    </main>
  );
}
