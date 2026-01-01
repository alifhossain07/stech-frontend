"use client";
import axios from "axios";
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { useRouter } from "next/navigation";

// ------------------------- Types -------------------------
interface CartItem {
  id: string | number;
  name: string;
  img: string;
  price: number;
  oldPrice: number;
  qty: number;
  variant?: string;
  variantImage?: string;
}

interface CheckoutFormData {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  shipping: "inside" | "outside" | "free";
  payment: "online" | "cod";
  agreeTerms: boolean;
  promoCode?: string;
  pathao_city_id?: number | null;
  pathao_zone_id?: number | null;
  pathao_area_id?: number | null;
}
interface CouponData {
  id?: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  min_order?: number;
  max_discount?: number;
  expiry_date?: string;
 
}


// ------------------------- Yup Schema -------------------------
const schema: yup.ObjectSchema<CheckoutFormData> = yup.object({
  name: yup.string().required("Name is required"),
  mobile: yup
    .string()
    .matches(/^\d{11}$/, "Mobile must be 11 digits")
    .required("Mobile number is required"),
  email: yup.string().email("Invalid email").optional(),
  address: yup.string().required("Address is required"),
  pathao_city_id: yup.number().typeError("City is required").required("City is required"),
  pathao_zone_id: yup.number().typeError("Zone is required").required("Zone is required"),
  pathao_area_id: yup.number().nullable().optional(),
  shipping: yup
    .mixed<CheckoutFormData["shipping"]>()
    .required("Shipping method is required"),
  payment: yup
    .mixed<CheckoutFormData["payment"]>()
    .required("Payment method is required"),
  agreeTerms: yup
    .boolean()
    .oneOf([true], "You must accept terms")
    .required("You must accept terms"),
  promoCode: yup.string().optional(),
});

// ------------------------- Checkout Page -------------------------
const CheckoutPage: React.FC = () => {
  const { cart, selectedItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const router = useRouter();

  // Filter selected items
  const selectedCart: CartItem[] = cart.filter((item) =>
    selectedItems.includes(item.id)
  );

  // Totals
  // Subtotal should reflect pre-discount sum; discount reflects savings
  const subtotal = selectedCart.reduce(
    (acc, item) => acc + (Number(item.oldPrice ?? item.price) * item.qty),
    0
  );
  const discount = selectedCart.reduce(
    (acc, item) => acc + Math.max(0, Number(item.oldPrice) - Number(item.price)) * item.qty,
    0
  );

  // ------------------------- React Hook Form -------------------------
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<CheckoutFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mobile: "",
      email: "",
      address: "",
      shipping: "inside",
      payment: "cod",
      agreeTerms: true,
      promoCode: "",
      pathao_city_id: null,
      pathao_zone_id: null,
      pathao_area_id: null,
    },
  });

  // ------------------------- Pathao Cities, Zones, Areas -------------------------
  type PathaoCity = { id: number; name: string };
  type PathaoZone = { id: number; city_id: number; name: string };
  type PathaoArea = { id: number; zone_id: number; name: string };

  const [cities, setCities] = React.useState<PathaoCity[]>([]);
  const [zones, setZones] = React.useState<PathaoZone[]>([]);
  const [areas, setAreas] = React.useState<PathaoArea[]>([]);
  
  const [cityQuery, setCityQuery] = React.useState<string>("");
  const [zoneQuery, setZoneQuery] = React.useState<string>("");
  const [areaQuery, setAreaQuery] = React.useState<string>("");
  
  const [citiesLoading, setCitiesLoading] = React.useState<boolean>(false);
  const [zonesLoading, setZonesLoading] = React.useState<boolean>(false);
  const [areasLoading, setAreasLoading] = React.useState<boolean>(false);
  
  const [cityOpen, setCityOpen] = React.useState<boolean>(false);
  const [zoneOpen, setZoneOpen] = React.useState<boolean>(false);
  const [areaOpen, setAreaOpen] = React.useState<boolean>(false);

  const [citySelected, setCitySelected] = React.useState<boolean>(false);
  const [zoneSelected, setZoneSelected] = React.useState<boolean>(false);
  const [areaSelected, setAreaSelected] = React.useState<boolean>(false);

  const selectedCityId = watch("pathao_city_id");
  const selectedZoneId = watch("pathao_zone_id");
  const selectedAreaId = watch("pathao_area_id");

  // Load cities on mount
  React.useEffect(() => {
    let cancelled = false;
    const loadCities = async () => {
      try {
        setCitiesLoading(true);
        const res = await fetch("/api/pathao-cities", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const list: PathaoCity[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) setCities(list);
      } catch {
        // ignore
      } finally {
        setCitiesLoading(false);
      }
    };
    loadCities();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-set shipping based on selected city
  React.useEffect(() => {
    if (!selectedCityId || cities.length === 0) return;
    
    const selectedCity = cities.find(c => c.id === selectedCityId);
    if (selectedCity) {
      // If city_id is 1 or city name is "Dhaka" (case-insensitive), set to "inside", else "outside"
      const isDhaka = selectedCity.id === 1 || selectedCity.name.toLowerCase().trim() === "dhaka";
      setValue("shipping", isDhaka ? "inside" : "outside", { shouldValidate: true });
    }
  }, [selectedCityId, cities, setValue]);

  // Load zones when city is selected
  React.useEffect(() => {
    if (!selectedCityId) {
      setZones([]);
      setAreas([]);
      setValue("pathao_zone_id", null);
      setValue("pathao_area_id", null);
      setZoneQuery("");
      setAreaQuery("");
      return;
    }

    let cancelled = false;
    const loadZones = async () => {
      try {
        setZonesLoading(true);
        const res = await fetch(`/api/pathao-zones/${selectedCityId}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const list: PathaoZone[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) {
          setZones(list);
          // Reset zone and area when city changes
          setValue("pathao_zone_id", null);
          setValue("pathao_area_id", null);
          setZoneQuery("");
          setAreaQuery("");
          setAreas([]);
        }
      } catch {
        // ignore
      } finally {
        setZonesLoading(false);
      }
    };
    loadZones();
    return () => {
      cancelled = true;
    };
  }, [selectedCityId, setValue]);

  // Load areas when zone is selected
  React.useEffect(() => {
    if (!selectedZoneId) {
      setAreas([]);
      setValue("pathao_area_id", null);
      setAreaQuery("");
      return;
    }

    let cancelled = false;
    const loadAreas = async () => {
      try {
        setAreasLoading(true);
        const res = await fetch(`/api/pathao-areas/${selectedZoneId}`, { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const list: PathaoArea[] = Array.isArray(json?.data) ? json.data : [];
        if (!cancelled) {
          setAreas(list);
          // Reset area when zone changes
          setValue("pathao_area_id", null);
          setAreaQuery("");
        }
      } catch {
        // ignore
      } finally {
        setAreasLoading(false);
      }
    };
    loadAreas();
    return () => {
      cancelled = true;
    };
  }, [selectedZoneId, setValue]);

  // Filter cities based on query
  const filteredCities = React.useMemo(() => {
    const q = cityQuery.trim().toLowerCase();
    if (!q) return cities;
    return cities.filter((c) => c.name.toLowerCase().includes(q));
  }, [cityQuery, cities]);

  // Filter zones based on query
  const filteredZones = React.useMemo(() => {
    const q = zoneQuery.trim().toLowerCase();
    if (!q) return zones;
    return zones.filter((z) => z.name.toLowerCase().includes(q));
  }, [zoneQuery, zones]);

  // Filter areas based on query
  const filteredAreas = React.useMemo(() => {
    const q = areaQuery.trim().toLowerCase();
    if (!q) return areas;
    return areas.filter((a) => a.name.toLowerCase().includes(q));
  }, [areaQuery, areas]);

  const handleSelectCity = (city: PathaoCity) => {
    setCityQuery(city.name);
    setValue("pathao_city_id", city.id, { shouldValidate: true });
    setCityOpen(false);
    setCitySelected(true);
    
    // Auto set shipping based on city_id or city name
    // If city_id is 1 or city name is "Dhaka" (case-insensitive), set to "inside", else "outside"
    const isDhaka = city.id === 1 || city.name.toLowerCase().trim() === "dhaka";
    setValue("shipping", isDhaka ? "inside" : "outside", { shouldValidate: true });
  };

  const handleClearCity = () => {
    setCityQuery("");
    setValue("pathao_city_id", null, { shouldValidate: true });
    setCitySelected(false);
    setValue("pathao_zone_id", null);
    setValue("pathao_area_id", null);
    setZoneQuery("");
    setAreaQuery("");
    setZoneSelected(false);
    setAreaSelected(false);
    setZones([]);
    setAreas([]);
  };

  const handleSelectZone = (zone: PathaoZone) => {
    setZoneQuery(zone.name);
    setValue("pathao_zone_id", zone.id, { shouldValidate: true });
    setZoneOpen(false);
    setZoneSelected(true);
  };

  const handleClearZone = () => {
    setZoneQuery("");
    setValue("pathao_zone_id", null, { shouldValidate: true });
    setZoneSelected(false);
    setValue("pathao_area_id", null);
    setAreaQuery("");
    setAreaSelected(false);
    setAreas([]);
  };

  const handleSelectArea = (area: PathaoArea) => {
    setAreaQuery(area.name);
    setValue("pathao_area_id", area.id, { shouldValidate: true });
    setAreaOpen(false);
    setAreaSelected(true);
  };

  const handleClearArea = () => {
    setAreaQuery("");
    setValue("pathao_area_id", null, { shouldValidate: true });
    setAreaSelected(false);
  };

  // Update selected states when values change
  React.useEffect(() => {
    setCitySelected(!!selectedCityId);
  }, [selectedCityId]);

  React.useEffect(() => {
    setZoneSelected(!!selectedZoneId);
  }, [selectedZoneId]);

  React.useEffect(() => {
    setAreaSelected(!!selectedAreaId);
  }, [selectedAreaId]);

  const shippingMethod = watch("shipping");
  // Dynamic shipping config
  const [shippingConfig, setShippingConfig] = React.useState<{
    shipping_cost_inside_dhaka: number;
    shipping_cost_outside_dhaka: number;
    stroked_shipping_cost_inside_dhaka?: number;
    stroked_shipping_cost_outside_dhaka?: number;
    free_shipping_min_amount: number;
    currency_symbol?: string;
    currency_code?: string;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    const loadConfig = async () => {
      try {
        const res = await fetch("/api/shipping-config", { cache: "no-store" });
        if (!res.ok) return;
        const json = await res.json();
        const data = json?.data || json; // support either {result,data} or direct
        if (!cancelled && data) setShippingConfig(data);
      } catch {
        // ignore
      }
    };
    loadConfig();
    return () => {
      cancelled = true;
    };
  }, []);

  // Shipping charges (dynamic from config)
  const insideDhaka = shippingConfig?.shipping_cost_inside_dhaka ?? 60;
  const outsideDhaka = shippingConfig?.shipping_cost_outside_dhaka ?? 140;
  const strokedInsideDhaka = shippingConfig?.stroked_shipping_cost_inside_dhaka;
  const strokedOutsideDhaka = shippingConfig?.stroked_shipping_cost_outside_dhaka;
  const freeMin = shippingConfig?.free_shipping_min_amount ?? 0;
  const currencySymbol = shippingConfig?.currency_symbol ?? "৳";

  const merchandiseTotal = subtotal - discount;

  // Calculate delivery charge based on shipping method - use useMemo to ensure it updates
  const { deliveryCharge, strokedDeliveryCharge } = React.useMemo(() => {
    let charge = 0;
    let stroked: number | undefined = undefined;
    
    if (shippingMethod === "inside") {
      charge = insideDhaka;
      stroked = strokedInsideDhaka;
    } else if (shippingMethod === "outside") {
      charge = outsideDhaka;
      stroked = strokedOutsideDhaka;
    } else if (shippingMethod === "free") {
      charge = 0;
      stroked = undefined;
    }

    // Apply free shipping if applicable
    if (freeMin > 0 && merchandiseTotal >= freeMin && charge > 0) {
      charge = 0;
      stroked = undefined;
    }

    return { deliveryCharge: charge, strokedDeliveryCharge: stroked };
  }, [shippingMethod, insideDhaka, outsideDhaka, strokedInsideDhaka, strokedOutsideDhaka, freeMin, merchandiseTotal]);

  // ------------------------- Promo Code States & Logic -------------------------
  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);
  const [couponData, setCouponData] = React.useState<CouponData | null>(null);
  const [isValidatingPromo, setIsValidatingPromo] = React.useState(false);

  // Real API promo validation
 const validatePromoCode = async (code: string) => {
  try {
    setIsValidatingPromo(true);
    const response = await axios.post<{ result: boolean; data?: CouponData; message?: string }>("/api/coupon-apply", {
      code: code.toUpperCase(),
    });

    if (response.data.result) {
      setCouponData(response.data.data!); // "!" because data exists if result is true
      setAppliedPromo(code.toUpperCase());
      toast.success(`Promo code "${code.toUpperCase()}" applied! 🎉`, {
        style: {
          background: "#22c55e",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
      return true;
    } else {
      throw new Error(response.data.message || "Invalid coupon");
    }
  } catch (error: unknown) {
    setAppliedPromo(null);
    setCouponData(null);
    setPromoDiscount(0);

    if (axios.isAxiosError(error)) {
      // Axios-specific error
      toast.error(error.response?.data?.message || "Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    } else if (error instanceof Error) {
      // Regular JS error
      toast.error(error.message || "Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    } else {
      // Fallback
      toast.error("Invalid promo code ❌", {
        style: {
          background: "#ef4444",
          color: "#ffffff",
          fontWeight: 500,
        },
      });
    }

    return false;
  } finally {
    setIsValidatingPromo(false);
  }
};

  const handleApplyPromo = async () => {
    const code = watch("promoCode")?.toUpperCase().trim();
    if (!code) {
      toast.error("Please enter a promo code ❌");
      return;
    }

    await validatePromoCode(code);
  };

  // Calculate promo discount based on API response
  React.useEffect(() => {
    if (couponData) {
      const baseAmount = subtotal - discount;
      let discountAmount = 0;
      
      if (couponData.type === "percentage") {
        discountAmount = baseAmount * (couponData.value / 100);
      } else {
        discountAmount = couponData.value;
      }
      
      setPromoDiscount(Math.min(discountAmount, baseAmount)); // Don't exceed base amount
    } else {
      setPromoDiscount(0);
    }
  }, [couponData, subtotal, discount]);

  const effectiveDelivery = deliveryCharge;
  const total = subtotal - discount + effectiveDelivery - promoDiscount;

  // ------------------------- Payment Modal -------------------------
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState<CheckoutFormData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<"visa" | "mastercard" | "bkash" | "nagad">("visa");
  const [paymentNumber, setPaymentNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmOrder = (data: CheckoutFormData) => {
    // Clear promo on new order
    setAppliedPromo(null);
    setCouponData(null);
    setPromoDiscount(0);

    if (data.payment === "cod") {
      submitOrder(data);
    } else {
      setPaymentData(data);
      setShowPaymentModal(true);
    }
  };

  const submitOrder = async (data: CheckoutFormData) => {
    if (selectedCart.length === 0) {
      toast.error("Your cart is empty ❌");
      return;
    }

    // Build payload exactly like backend expects
    const shipping_zone =
      data.shipping === "inside" ? "insideDhaka" : data.shipping === "outside" ? "outsideDhaka" : null;
    const payload = {
      customer: {
        name: data.name,
        mobile: data.mobile,
        email: data.email || null,
        address: data.address?.trim() || "",
        country_id: null,
        state_id: null,
        city_id: null,
        area_id: null,
        pathao_city_id: data.pathao_city_id ?? null,
        pathao_zone_id: data.pathao_zone_id ?? null,
        pathao_area_id: data.pathao_area_id ?? null,
      },
      items: selectedCart.map((item) => ({
        id: Number(item.id),
        qty: Number(item.qty),
        variant:  item.variant || null,
        variation: item.variant || null,
        referral_code: null,
      })),
      shipping_method:
        data.shipping === "inside" || data.shipping === "outside"
          ? "home_delivery"
          : "pickup_point",
      shipping_zone,
      shipping_charge: effectiveDelivery,
      payment_method: data.payment === "cod" ? "Cash on Delivery" : selectedPaymentMethod.toLowerCase(),
      payment_number: data.payment === "cod" ? null : paymentNumber || null,
      promo_code: appliedPromo || null,
      note: "",
      pickup_point_id: null,
      carrier_id: null,
    };

    try {
      setIsLoading(true);
      const response = await axios.post("/api/orders", payload);

      if (response.data.success && response.data.data?.result) {
        toast.success(response.data.data.message || "Order placed successfully! 🎉");
        try {
          if (typeof window !== "undefined") {
            const backendData = response.data.data;
            const transactionId =
              backendData?.orders?.[0]?.code ||
              backendData?.order?.code ||
              backendData?.order_code ||
              backendData?.code ||
              String(backendData?.combined_order_id || "");

            const itemsForAnalytics = selectedCart.map((item) => ({
              item_id: String(item.id),
              item_name: item.name,
              price: item.price,
              quantity: item.qty,
              item_variant: item.variant || "",
              item_brand: "",
              item_category: "",
            }));

            const shipping = effectiveDelivery;
            const value = subtotal - discount - promoDiscount + shipping;

           window.dataLayer = window.dataLayer || [];
window.dataLayer.push({
  event: "purchase",
  ecommerce: {
    transaction_id: transactionId,
    affiliation: "Online Store",
    value,
    tax: 0,
    shipping,
    currency: "BDT",
    coupon: appliedPromo || "",
    items: itemsForAnalytics,
  },
});

            // Persist minimal order summary for order-complete page
            const shippingMethodLabel =
              data.shipping === "inside"
                ? "Inside Dhaka – Home Delivery"
                : data.shipping === "outside"
                ? "Outside Dhaka – Home Delivery"
                : "Free Shipping / Pickup Point";

            const orderSummary = {
              orderId: transactionId || null,
              customer: {
                name: data.name,
                mobile: data.mobile,
                email: data.email || "",
                address: data.address?.trim() || "",
              },
              items: selectedCart.map((item) => ({
                id: item.id,
                name: item.name,
                qty: item.qty,
                price: item.price,
              })),
              shipping: {
                method: data.shipping,
                methodLabel: shippingMethodLabel,
                charge: effectiveDelivery,
              },
              totals: {
                subtotal,
                discount,
                deliveryCharge: effectiveDelivery,
                promoDiscount,
                total: subtotal - discount + effectiveDelivery - promoDiscount,
              },
            };

            try {
              sessionStorage.setItem("lastOrder", JSON.stringify(orderSummary));
            } catch {}

            // Navigate with orderId when available
            const nextHref = `/checkout/ordercomplete${transactionId ? `?orderId=${encodeURIComponent(transactionId)}` : ""}`;
            // Clear and navigate after persisting
            clearCart();
            setShowPaymentModal(false);
            router.push(nextHref);
            return;
          }
        } catch (e) {
          console.error("Failed to push purchase event", e);
        }
        // Fallback navigation if window/data persistence failed
        clearCart();
        setShowPaymentModal(false);
        router.push("/checkout/ordercomplete");
      } else {
        toast.error(response.data.message || "Failed to place order ❌");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Order submit error:", error.response || error);
        toast.error(
          error.response?.data?.message || "Something went wrong while placing the order ❌"
        );
      } else {
        console.error("Unexpected error:", error);
        toast.error("Something went wrong while placing the order ❌");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalPaymentConfirm = async () => {
    if (!paymentData) return;

    try {
      setIsLoading(true);
      await submitOrder(paymentData);
      setIsLoading(false);
      setShowPaymentModal(false);
      router.push("/checkout/ordercomplete");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      toast.error("Something went wrong ❌");
    }
  };

  const handleModalCancel = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  // ------------------------- JSX -------------------------
  return (
    <div className="w-11/12 mx-auto mt-9 min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shipping Information</h1>
      <form onSubmit={handleSubmit(handleConfirmOrder)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* In Your Cart */}
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">In Your Cart</h2>
          </div>
          {selectedCart.length === 0 ? (
            <p className="text-gray-500 text-sm">No items selected.</p>
          ) : (
            selectedCart.map((item) => (
              <div key={item.id} className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative">
                <div className="md:w-28 md:h-28 h-20 w-20 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image
                    src={item.img}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm md:text-lg">{item.name}</h3>
                  {item.variant && (
  <p className="text-xs text-gray-500 mt-1">
    {item.variant}
  </p>
)}
                  <div className="font-semibold text-orange-600 text-sm md:text-lg mt-1">
                    ৳{item.price}
                    <span className="line-through text-gray-400 ml-2 text-xs">৳{item.oldPrice}</span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-sm md:text-sm">
                    <span className="font-medium">QTY :</span>
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => decreaseQty(item.id)}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => increaseQty(item.id)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id)}
                  className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 text-lg"
                >
                  <RiDeleteBin6Line className="text-xl mr-2 mb-2" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Customer Info + Shipping */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">Customer Information</h2>
            <div className="flex flex-col gap-3">
              <label>Your Name*</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="border p-2 mb-1 rounded"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <label>Mobile*</label>
              <input
                type="text"
                placeholder="019*******"
                className="border p-2 mb-1 rounded"
                {...register("mobile")}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              <label>E-mail (optional)</label>
              <input
                type="email"
                placeholder="@email"
                className="border p-2 mb-1 rounded"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
              <label>City*</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Select or search city"
                  className={`border p-2 mb-1 rounded w-full pr-8 ${citySelected ? "bg-gray-50 cursor-default" : ""}`}
                  value={cityQuery}
                  onChange={(e) => {
                    if (citySelected) return;
                    setCityQuery(e.target.value);
                    setCityOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (citySelected && e.key !== "Escape") {
                      e.preventDefault();
                    }
                  }}
                  onFocus={() => {
                    if (!citySelected) {
                      setCityOpen(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setCityOpen(false), 150)}
                  readOnly={citySelected}
                />
                {citySelected && (
                  <button
                    type="button"
                    onClick={handleClearCity}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl font-bold"
                    title="Clear selection"
                  >
                    ×
                  </button>
                )}
                <input type="hidden" {...register("pathao_city_id")} />
                {cityOpen && !citySelected && (
                  <div className="absolute z-30 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                    {citiesLoading && (
                      <div className="p-2 text-sm text-gray-500">Loading...</div>
                    )}
                    {!citiesLoading && filteredCities.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No cities found</div>
                    )}
                    {!citiesLoading && filteredCities.map((city) => (
                      <button
                        type="button"
                        key={city.id}
                        className="w-full text-left px-3 py-2 hover:bg-orange-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectCity(city)}
                      >
                        <span className="font-medium text-gray-800">{city.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.pathao_city_id && (
                <p className="text-red-500 text-sm">{String(errors.pathao_city_id.message)}</p>
              )}

              <label>Zone*</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedCityId ? "Select or search zone" : "Select city first"}
                  className={`border p-2 mb-1 rounded w-full pr-8 ${!selectedCityId ? "bg-gray-100 cursor-not-allowed" : zoneSelected ? "bg-gray-50 cursor-default" : ""}`}
                  value={zoneQuery}
                  onChange={(e) => {
                    if (!selectedCityId || zoneSelected) return;
                    setZoneQuery(e.target.value);
                    setZoneOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (zoneSelected && e.key !== "Escape") {
                      e.preventDefault();
                    }
                  }}
                  onFocus={() => {
                    if (selectedCityId && !zoneSelected) {
                      setZoneOpen(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setZoneOpen(false), 150)}
                  disabled={!selectedCityId}
                  readOnly={!selectedCityId || zoneSelected}
                />
                {zoneSelected && (
                  <button
                    type="button"
                    onClick={handleClearZone}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl font-bold"
                    title="Clear selection"
                  >
                    ×
                  </button>
                )}
                <input type="hidden" {...register("pathao_zone_id")} />
                {zoneOpen && selectedCityId && !zoneSelected && zones.length > 0 && (
                  <div className="absolute z-30 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                    {zonesLoading && (
                      <div className="p-2 text-sm text-gray-500">Loading...</div>
                    )}
                    {!zonesLoading && filteredZones.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No zones found</div>
                    )}
                    {!zonesLoading && filteredZones.map((zone) => (
                      <button
                        type="button"
                        key={zone.id}
                        className="w-full text-left px-3 py-2 hover:bg-orange-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectZone(zone)}
                      >
                        <span className="font-medium text-gray-800">{zone.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.pathao_zone_id && (
                <p className="text-red-500 text-sm">{String(errors.pathao_zone_id.message)}</p>
              )}

              <label>Area (optional)</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedZoneId ? "Select or search area (optional)" : "Select zone first"}
                  className={`border p-2 mb-1 rounded w-full pr-8 ${!selectedZoneId ? "bg-gray-100 cursor-not-allowed" : areaSelected ? "bg-gray-50 cursor-default" : ""}`}
                  value={areaQuery}
                  onChange={(e) => {
                    if (!selectedZoneId || areaSelected) return;
                    setAreaQuery(e.target.value);
                    setAreaOpen(true);
                  }}
                  onKeyDown={(e) => {
                    if (areaSelected && e.key !== "Escape") {
                      e.preventDefault();
                    }
                  }}
                  onFocus={() => {
                    if (selectedZoneId && !areaSelected) {
                      setAreaOpen(true);
                    }
                  }}
                  onBlur={() => setTimeout(() => setAreaOpen(false), 150)}
                  disabled={!selectedZoneId}
                  readOnly={!selectedZoneId || areaSelected}
                />
                {areaSelected && (
                  <button
                    type="button"
                    onClick={handleClearArea}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-500 text-xl font-bold"
                    title="Clear selection"
                  >
                    ×
                  </button>
                )}
                <input type="hidden" {...register("pathao_area_id")} />
                {areaOpen && selectedZoneId && !areaSelected && (
                  <div className="absolute z-30 w-full max-h-56 overflow-auto bg-white border rounded shadow mt-1">
                    {areasLoading && (
                      <div className="p-2 text-sm text-gray-500">Loading...</div>
                    )}
                    {!areasLoading && areas.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No areas available for this zone. You can proceed without selecting an area.</div>
                    )}
                    {!areasLoading && areas.length > 0 && filteredAreas.length === 0 && (
                      <div className="p-2 text-sm text-gray-500">No areas found matching your search</div>
                    )}
                    {!areasLoading && filteredAreas.map((area) => (
                      <button
                        type="button"
                        key={area.id}
                        className="w-full text-left px-3 py-2 hover:bg-orange-50"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={() => handleSelectArea(area)}
                      >
                        <span className="font-medium text-gray-800">{area.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {errors.pathao_area_id && (
                <p className="text-red-500 text-sm">{String(errors.pathao_area_id.message)}</p>
              )}
              
              <label>Address*</label>
              <input
                type="text"
                placeholder="Delivery address"
                className="border p-2 mb-1 rounded"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>

          {/* Shipping Method */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">Shipping Method</h2>
            {/* <p className="text-xs text-gray-500 mb-2">Auto-selected based on Area. Changes are disabled.</p> */}
            <Controller
              name="shipping"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-4 md:text-lg xl:text-base 2xl:text-lg text-base mt-8">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="inside"
                      checked={field.value === "inside"}
                      onChange={() => field.onChange("inside")}
                      disabled
                    />
                    {`Inside Dhaka - 2/4 Days ${currencySymbol} ${insideDhaka.toLocaleString()}`}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="outside"
                      checked={field.value === "outside"}
                      onChange={() => field.onChange("outside")}
                      disabled
                    />
                    {`Outside Dhaka - 4/6 Days ( Advanced First ) ${currencySymbol} ${outsideDhaka.toLocaleString()}`}
                  </label>
                  {/* <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="free"
                      checked={field.value === "free"}
                      onChange={() => field.onChange("free")}
                    />
                    Free Shipping ( Upto ৳ 2000 )
                  </label> */}
                  {errors.shipping && (
                    <p className="text-red-500 text-sm">{errors.shipping.message}</p>
                  )}
                </div>
              )}
            />
          </div>
        </div>

        {/* Payment + Summary */}
        <div className="flex flex-col gap-6">
          {/* Payment Method */}
          {/* Payment Method */}
<div className="border rounded-md p-4 bg-white shadow-sm">
  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
  <Controller
    name="payment"
    control={control}
    render={({ field }) => (
      <>
        {/* Online Payment Hidden and Disabled */}
        <label className="hidden items-center gap-2 text-lg mb-6">
          <input
            type="radio"
            value="online"
            checked={field.value === "online"}
            onChange={() => field.onChange("online")}
            disabled
          />
          Online Payment*
        </label>

        {/* Payment logos hidden to clean up the UI */}
        <div className="hidden gap-2 mb-5 items-center">
          <h1 className="text-[#8f8f8f] text-sm">We Accept</h1>
          <div className="flex items-center gap-2">
            <Image src="/images/visa.png" alt="Visa" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
            <Image src="/images/mastercard.png" alt="Mastercard" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
            <Image src="/images/bkash.png" alt="bKash" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
            <Image src="/images/nagad.png" alt="Nagad" width={32} height={20} className="w-12 h-10 md:w-16 md:h-12 object-contain" />
          </div>
        </div>

        {/* Cash on Delivery - Visible and selected by default */}
        <label className="flex items-center gap-2 text-lg mb-6 cursor-pointer">
          <input
            type="radio"
            value="cod"
            checked={field.value === "cod"}
            onChange={() => field.onChange("cod")}
          />
          Cash On Delivery*
        </label>

        {errors.payment && (
          <p className="text-red-500 text-sm">{errors.payment.message}</p>
        )}
      </>
    )}
  />

  <label className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
    <input type="checkbox" {...register("agreeTerms")} className="shrink-0" />
    <span className="flex-1">
      I have read & agree to the{" "}
      <span className="text-orange-500">Terms & Conditions, Privacy Policy</span> and{" "}
      <span className="text-orange-500">Return Policy</span>.
    </span>
  </label>
  {errors.agreeTerms && (
    <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
  )}
</div>

          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-3">Promo Code</h2>
            <input
              type="text"
              className="border p-2 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder="Enter promo code"
            />
            <div className="cursor-pointer flex justify-end items-center">
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo}
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-300 duration-300 mt-2 disabled:opacity-50"
              >
                {isValidatingPromo ? "Applying..." : "Apply"}
              </button>
            </div>
            {appliedPromo && (
              <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-sm">
                ✅ {appliedPromo} applied! {couponData?.type === "percentage" ? `${couponData.value}%` : `৳${couponData?.value}`} off
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">In Your Order Summary</h2>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Sub Total :</span>
              <span>৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Delivery Charge :</span>
              <span className="flex items-center gap-2">
                {strokedDeliveryCharge && strokedDeliveryCharge > deliveryCharge && deliveryCharge > 0 && (
                  <span className="line-through text-gray-400 text-md tracking-wide">
                    ৳{strokedDeliveryCharge.toLocaleString()}
                  </span>
                )}
                <span>৳ {deliveryCharge.toLocaleString()}</span>
              </span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Discount :</span>
              <span>৳ {discount.toLocaleString()}</span>
            </div>
            {appliedPromo && promoDiscount > 0 && (
              <div className="flex justify-between md:text-lg text-base mb-2 text-green-600 font-medium">
                <span>Promo Discount ({appliedPromo}) :</span>
                <span>-৳ {promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex bg-[#f4f4f4] py-4 px-2 justify-between font-semibold text-orange-600 text-lg md:text-xl mt-4">
              <span>Total Amount :</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              className={`w-full bg-orange-500 text-white py-3 rounded-full font-semibold text-center mt-4 ${
                !isValid ? "opacity-60 cursor-not-allowed" : ""
              }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? "Processing..." : "Confirm Order"}
            </button>
          </div>
        </div>
      </form>

      {/* ------------------------- Payment Modal ------------------------- */}
      {showPaymentModal && paymentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[650px] relative shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Demo Payment</h2>
            <p className="mb-4">
              Amount: <span className="font-bold">৳ {total.toLocaleString()}</span>
            </p>
            {/* Payment Method Selection */}
            <div className="flex gap-3">
              {(["visa", "mastercard", "bkash", "nagad"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`flex-1 p-2 border rounded hover:border-orange-500 flex items-center justify-center gap-2 ${
                    selectedPaymentMethod === method
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300"
                  }`}
                >
                  <Image
                    src={`/images/${method}.png`}
                    alt={method}
                    width={40}
                    height={24}
                    className="object-contain"
                  />
                  <span className="capitalize">{method}</span>
                </button>
              ))}
            </div>
            {/* Demo Card / Number Input */}
            <div className="mb-4 mt-4">
              <label className="block mb-1 font-medium">Enter Number</label>
              <input
                type="text"
                placeholder={
                  selectedPaymentMethod === "bkash" || selectedPaymentMethod === "nagad"
                    ? "e.g. 01XXXXXXXXX"
                    : "Card Number"
                }
                className="w-full border p-2 rounded"
                value={paymentNumber}
                onChange={(e) => setPaymentNumber(e.target.value)}
              />
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button
                onClick={handleModalCancel}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                disabled={isLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleModalPaymentConfirm}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                disabled={!paymentNumber || !selectedPaymentMethod || isLoading}
              >
                {isLoading ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
          {isLoading && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-lg z-50">
              <div className="w-12 h-12 border-4 border-t-orange-500 border-gray-200 rounded-full animate-spin"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
