"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { FiPlus, FiMinus } from "react-icons/fi";
import { useCart } from "@/app/context/CartContext";

type Brand = {
  id: number;
  name: string;
};

type FeaturedSpec = {
  icon: string;
  text: string;
};

type ProductVariant = {
  variant: string;
  price: number;
  sku: string;
  qty: number;
  image: string | null;
};

type FAQItem = {
  question: string;
  answer: string;
};

type ProductType = {
  id: number;
  name: string;
  main_price: number | string;
  stroked_price: number | string;
  discount: string;
  brand: Brand;
  product_compatible: string[];
  description: string;
  photos: { path: string }[];
  colors: string[];
  thumbnail_image?: string;
  featured_specs: FeaturedSpec[];
  current_stock: number;
  est_shipping_time: string;
  dealer_est_shipping_time: string;
  model_number?: string;
  connection_type?: string;
  weight: number;
  other_features?: string;
  faqs?: FAQItem[];
  variants: ProductVariant[];
  choice_options?: { name: string; title: string; options: string[] }[];
};



const colorMap: Record<string, string> = {
  "#000000": "Black",
  "#ffffff": "White",
  "#ff0000": "Red",
  "#00ff00": "Green",
  "#0000ff": "Blue",
  "#ffff00": "Yellow",
  "#808080": "Gray",
  "#666666": "Gray",
  "#e74c3c": "Red",
  "#27ae60": "Green",
  "#f39c12": "Orange",
  "#gray": "Gray",
  "gray": "Gray",
};

type Props = {
  slug: string | null;
  open: boolean;
  onClose: () => void;
};

const parsePrice = (priceStr: string | number | null | undefined): number => {
  if (typeof priceStr === "number") return priceStr;
  if (!priceStr) return 0;

  const cleaned = String(priceStr)
    .replace(/[^\d.]/g, "")
    .trim();

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
};

export default function ProductOptionsModal({ slug, open, onClose }: Props) {
  const { addToCart, setCartOpen } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch product details when opened
  useEffect(() => {
    if (!open || !slug) return;

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      setQuantity(1);
      setQuantity(1);

      try {
        const res = await fetch(`/api/products/${slug}`);
        if (!res.ok) throw new Error("Failed to fetch product");

        const data: ProductType = await res.json();
        setProduct(data);

        if (data.variants && data.variants.length > 0) {
          // setSelectedVariant(data.variants[0].variant);
        }
        if (data.colors && data.colors.length > 0) {
          setSelectedColor(data.colors[0]);
        }
        if (data.choice_options && data.choice_options.length > 0) {
          const initialOptions: Record<string, string> = {};
          data.choice_options.forEach((opt) => {
            if (opt.options.length > 0) {
              initialOptions[opt.title] = opt.options[0];
            }
          });
          setSelectedOptions(initialOptions);
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [open, slug]);

  const getEffectiveVariant = () => {
    if (!product || !product.variants || product.variants.length === 0) return null;

    const colorName = colorMap[selectedColor.toLowerCase()] || "";
    const selectedParts = [colorName, ...Object.values(selectedOptions)].filter(Boolean).map(s => s.toLowerCase().replace(/\s+/g, ""));

    return product.variants.find(v => {
      const variantLow = v.variant.toLowerCase().replace(/\s+/g, "");
      return selectedParts.every(part => variantLow.includes(part));
    }) || product.variants[0];
  };

  const currentVariant = getEffectiveVariant();
  const displayPrice = currentVariant ? currentVariant.price : parsePrice(product?.main_price);

  const increment = () => setQuantity((q) => q + 1);
  const decrement = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  const handleConfirmAdd = () => {
    if (!product || !slug) return;
    if (product.current_stock === 0) return;

    setAdding(true);
    setTimeout(() => {
      if (!product) {
        setAdding(false);
        return;
      }

      const price = parsePrice(displayPrice);
      const strokedPrice = parsePrice(product.stroked_price);
      const cartOldPrice = Math.max(price, strokedPrice);

      const image =
        currentVariant?.image ||
        product.thumbnail_image ||
        product.photos[0]?.path ||
        "/images/placeholder.png";

      addToCart({
        id: product.id.toString(),
        slug,
        name: product.name,
        price,
        oldPrice: cartOldPrice,
        img: image,
        qty: quantity,
        variant: currentVariant?.variant || undefined,
        variantImage: image,
      });

      if (typeof window !== "undefined") {
        const item = {
          item_id: product.id.toString(),
          item_name: product.name,
          item_brand: product.brand?.name || "",
          item_category: "",
          price,
          quantity,
          item_variant: currentVariant?.variant || "",
          item_sku: currentVariant?.sku || "",
        };

        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({
          event: "add_to_cart",
          ecommerce: {
            currency: "BDT",
            value: price * quantity,
            items: [item],
          },
        });
      }

      setCartOpen(true);
      setAdding(false);
      onClose();
    }, 500);
  };

  if (!open || !mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[20000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-[20001] w-11/12 max-w-md bg-white rounded-2xl shadow-xl overflow-hidden animate-[fadeIn_0.2s_ease-out]">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="text-sm md:text-base font-semibold">
            Choose Options
          </h2>
          <button
            onClick={onClose}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 text-sm"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 max-h-[75vh] overflow-y-auto">
          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!loading && error && (
            <p className="text-center text-red-500 text-sm py-4">{error}</p>
          )}

          {!loading && !error && product && (
            <>
              {/* Top: Image + basic info */}
              <div className="flex gap-3">
                <div className="w-24 h-24 flex-shrink-0 bg-[#f5f5f5] rounded-lg flex items-center justify-center overflow-hidden">
                  <Image
                    src={product.thumbnail_image || product.photos[0]?.path || "/images/placeholder.png"}
                    alt={product.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-sm md:text-base font-semibold line-clamp-2 mb-1">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mb-1">
                    {product.current_stock === 0 ? (
                      <span className="text-red-600 font-semibold">
                        Stock Out
                      </span>
                    ) : product.current_stock < 5 ? (
                      <span className="text-orange-500 font-semibold">
                        Low Stock
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        In Stock
                      </span>
                    )}
                    <span className="text-gray-400">
                      • ID: {product.id}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-orange-500 font-semibold text-lg">
                      ৳{displayPrice}
                    </span>
                    {(() => {
                      // Parse discount to check if it's 0 or empty
                      const discountValue = parseFloat(String(product.discount || '0').replace(/[^\d.]/g, ''));
                      const currentPrice = parsePrice(displayPrice);
                      const strokedPrice = parsePrice(product.stroked_price);
                      const hasDiscount = discountValue > 0 && strokedPrice !== currentPrice;

                      if (!hasDiscount) return null;

                      return (
                        <>
                          <span className="line-through text-gray-400 text-xs">
                            ৳{parsePrice(product.stroked_price)}
                          </span>
                          <span className="px-2 py-[2px] rounded-full bg-green-100 text-green-600 text-[10px] font-semibold">
                            {product.discount} OFF
                          </span>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {/* Choice Options */}
              {product.choice_options?.map((opt) => (
                <div key={opt.name} className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">
                    {opt.title}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {opt.options.map((val) => (
                      <button
                        key={val}
                        onClick={() => setSelectedOptions(prev => ({ ...prev, [opt.title]: val }))}
                        className={`px-3 py-1 rounded-full border text-xs ${selectedOptions[opt.title] === val
                          ? "bg-black text-white border-black"
                          : "bg-white text-gray-700 border-gray-300 hover:border-black"
                          }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-gray-700">
                    Color
                  </p>
                  <div className="flex items-center gap-3">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-6 h-6 rounded-full border-[2px] transition-all duration-200 ${selectedColor === color
                          ? "border-orange-500 scale-110"
                          : "border-gray-300 hover:scale-105"
                          }`}
                        style={{ backgroundColor: color }}
                      ></button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity selector */}
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-gray-700">
                  Quantity
                </p>
                <div className="flex items-center gap-3">
                  <button
                    onClick={decrement}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FiMinus className="text-sm" />
                  </button>
                  <span className="min-w-[24px] text-center text-sm font-semibold">
                    {quantity}
                  </span>
                  <button
                    onClick={increment}
                    className="w-7 h-7 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                  >
                    <FiPlus className="text-sm" />
                  </button>
                </div>
              </div>

              {/* Small specs preview */}

            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t flex gap-3">
          <button
            onClick={onClose}
            className="w-1/2 py-2 rounded-full border border-gray-300 text-xs md:text-sm text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            disabled={adding || loading || !product || product.current_stock === 0}
            onClick={handleConfirmAdd}
            className={`w-1/2 py-2 rounded-full text-xs md:text-sm font-semibold text-white transition ${adding || loading || !product || product.current_stock === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-orange-500 hover:bg-orange-600"
              }`}
          >
            {adding ? "Adding..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}