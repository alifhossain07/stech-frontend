"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  img: string;
  qty: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: Omit<CartItem, "id">) => void;
  removeFromCart: (id: string) => void;
  increaseQty: (id: string) => void;
  decreaseQty: (id: string) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: (state: boolean) => void;

  selectedItems: string[];
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);

  // New: selection state
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setCart(parsed);
      }
    } catch {
      console.warn("Failed to load cart");
    }
  }, []);

  // Save cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Cart functions
  const addToCart = (item: Omit<CartItem, "id">) => {
    setCart((prev) => [
      ...prev,
      { ...item, id: Math.random().toString(36).substring(2, 10) },
    ]);
      toast.success("Product added to cart!", {
    position: "top-right",
    style: {
      background: "#FF6D00",
      color: "#fff",
      fontWeight: "500",
      borderRadius: "8px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
      transform: "translateX(100%)", // start off-screen right
      animation: "slideInRight 0.5s forwards", // slide in
    },
    iconTheme: {
      primary: "#fff",
      secondary: "#FF6D00",
    },
  });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((i) => i !== id)); // auto unselect
  };

  const increaseQty = (id: string) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decreaseQty = (id: string) =>
    setCart((prev) =>
      prev.map((i) =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
    );

    useEffect(() => {
  const savedSelected = localStorage.getItem("selectedItems");
  if (savedSelected) {
    setSelectedItems(JSON.parse(savedSelected));
  }
}, []);

// Save selected items
useEffect(() => {
  localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
}, [selectedItems]);

  const clearCart = () => {
    setCart([]);
    setSelectedItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        increaseQty,
        decreaseQty,
        clearCart,
        cartOpen,
        setCartOpen,
        selectedItems,
        setSelectedItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext)!;
