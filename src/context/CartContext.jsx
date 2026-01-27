import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    const saved = localStorage.getItem("rokfit-cart");
    try {
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem("rokfit-cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find(
        (item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size,
      );

      if (exists) {
        return prev.map((item) =>
          item.id === product.id &&
          item.color === product.color &&
          item.size === product.size
            ? { ...item, qty: item.qty + product.qty }
            : item,
        );
      }

      return [...prev, product];
    });
  };

  const decreaseQty = (id, color, size) => {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id && item.color === color && item.size === size
            ? { ...item, qty: item.qty - 1 }
            : item,
        )
        .filter((item) => item.qty > 0),
    );
  };

  const removeFromCart = (id, color, size) => {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.color === color && item.size === size),
      ),
    );
  };

  // Clear cart
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        decreaseQty,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
