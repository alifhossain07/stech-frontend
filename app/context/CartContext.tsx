"use client";

import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export type CartItem = {
  id: string | number; // database product ID
  slug: string;
  name: string;
  price: number;
  oldPrice: number;
  img: string;
  qty: number;
  variant?: string;          // NEW
  variantImage?: string;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string | number) => void;
  increaseQty: (id: string | number) => void;
  decreaseQty: (id: string | number) => void;
  clearCart: () => void;
  cartOpen: boolean;
  setCartOpen: React.Dispatch<React.SetStateAction<boolean>>;

  selectedItems: (string | number)[];
  setSelectedItems: React.Dispatch<React.SetStateAction<(string | number)[]>>;
};

const CartContext = createContext<CartContextType | null>(null);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  // Load cart
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      console.warn("Failed to load cart");
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Load selected items
  useEffect(() => {
    const savedSelected = localStorage.getItem("selectedItems");
    if (savedSelected) setSelectedItems(JSON.parse(savedSelected));
  }, []);

  useEffect(() => {
    localStorage.setItem("selectedItems", JSON.stringify(selectedItems));
  }, [selectedItems]);

  const addToCart = (item: CartItem) => {
    // Check if already in cart, increase qty
    const exists = cart.find((i) => i.id === item.id);
    if (exists) {
      setCart((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + item.qty } : i))
      );
    } else {
      setCart((prev) => [...prev, item]);
    }

    toast.success("Product added to cart!", {
      position: "top-right",
      style: {
        background: "#FF6D00",
        color: "#fff",
        fontWeight: "500",
        borderRadius: "8px",
      },
    });
  };

  const removeFromCart = (id: string | number) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
    setSelectedItems((prev) => prev.filter((i) => i !== id));
  };

  const increaseQty = (id: string | number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );

  const decreaseQty = (id: string | number) =>
    setCart((prev) =>
      prev.map((i) => (i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i))
    );

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
