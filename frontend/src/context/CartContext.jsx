import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ecom-cart")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ecom-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((old) => {
      const found = old.find((item) => item.id === product.id);
      if (found) {
        return old.map((item) =>
          item.id === product.id
            ? { ...item, cartQuantity: item.cartQuantity + 1 }
            : item
        );
      }
      return [...old, { ...product, cartQuantity: 1 }];
    });
  };

  const removeFromCart = (id) =>
    setCart((old) => old.filter((item) => item.id !== id));

  const changeQuantity = (id, amount) =>
    setCart((old) =>
      old.map((item) =>
        item.id === id
          ? { ...item, cartQuantity: Math.max(1, item.cartQuantity + amount) }
          : item
      )
    );

  const clearCart = () => setCart([]);

  const count = cart.reduce((sum, item) => sum + item.cartQuantity, 0);
  const total = cart.reduce(
    (sum, item) => sum + Number(item.price || 0) * item.cartQuantity,
    0
  );

  return (
    <CartContext.Provider
      value={{ cart, addToCart, removeFromCart, changeQuantity, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
