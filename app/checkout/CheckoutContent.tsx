"use client";
import apiClient from "@/app/lib/api-client";
import { fetchWithAuth } from "@/app/lib/fetch-client";
import axios from "axios"; // Keep for axios.isAxiosError utility
import Image from "next/image";
import { useCart } from "@/app/context/CartContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/app/context/LanguageContext";

// ------------------------- Types -------------------------

interface CheckoutFormData {
  name: string;
  mobile: string;
  email?: string;
  address: string;
  shipping: "inside" | "outside" | "free";
  payment: "online" | "cod";
  agreeTerms: boolean;
  promoCode?: string;
  // pathao_city_id?: number | null;
  // pathao_zone_id?: number | null;
  // pathao_area_id?: number | null;
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
const createCheckoutSchema = (
  t: (key: string, params?: Record<string, string | number>) => string
): yup.ObjectSchema<CheckoutFormData> =>
  yup.object({
    name: yup.string().required(t("checkout.validation.nameRequired")),
    mobile: yup
      .string()
      .matches(/^\d{11}$/, t("checkout.validation.mobileDigits"))
      .required(t("checkout.validation.mobileRequired")),
    email: yup.string().email(t("checkout.validation.invalidEmail")).optional(),
    address: yup.string().required(t("checkout.validation.addressRequired")),
    // pathao_city_id: yup
    //   .number()
    //   .typeError(t("checkout.validation.cityRequired"))
    //   .required(t("checkout.validation.cityRequired")),
    // pathao_zone_id: yup
    //   .number()
    //   .typeError(t("checkout.validation.zoneRequired"))
    //   .required(t("checkout.validation.zoneRequired")),
    // pathao_area_id: yup.number().nullable().optional(),
    shipping: yup
      .mixed<CheckoutFormData["shipping"]>()
      .required(t("checkout.validation.shippingRequired")),
    payment: yup
      .mixed<CheckoutFormData["payment"]>()
      .required(t("checkout.validation.paymentRequired")),
    agreeTerms: yup
      .boolean()
      .oneOf([true], t("checkout.validation.agreeTermsRequired"))
      .required(t("checkout.validation.agreeTermsRequired")),
    promoCode: yup.string().optional(),
  });

// ------------------------- Checkout Content -------------------------
const CheckoutContent: React.FC = () => {
  const { cart, selectedItems, increaseQty, decreaseQty, removeFromCart, clearCart } =
    useCart();
  const router = useRouter();
  const { t, setLocale } = useLanguage();
  const schema = React.useMemo(() => createCheckoutSchema(t), [t]);

  // Set Bengali as default language for checkout page
  React.useEffect(() => {
    setLocale("bn");
  }, [setLocale]);

  // Filter selected items
  const selectedCart = React.useMemo(() =>
    cart.filter((item) => selectedItems.includes(item.variant ? `${item.id}-${item.variant}` : item.id.toString())),
    [cart, selectedItems]
  );

  // Totals
  // Subtotal should reflect pre-discount sum; discount reflects savings
  const subtotal = React.useMemo(() =>
    selectedCart.reduce(
      (acc, item) => acc + (Number(item.oldPrice ?? item.price) * item.qty),
      0
    ),
    [selectedCart]
  );
  const discount = React.useMemo(() =>
    selectedCart.reduce(
      (acc, item) => acc + Math.max(0, Number(item.oldPrice) - Number(item.price)) * item.qty,
      0
    ),
    [selectedCart]
  );

  // ------------------------- React Hook Form -------------------------
  const {
    register,
    handleSubmit,
    control,
    watch,
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
      // pathao_city_id: null,
      // pathao_zone_id: null,
      // pathao_area_id: null,
    },
  });

  // ------------------------- Pathao City/Zone/Area (ARCHIVED - COMMENTED OUT) -------------------------
  // type PathaoCity = { id: number; name: string };
  // type PathaoZone = { id: number; city_id: number; name: string };
  // type PathaoArea = { id: number; zone_id: number; name: string };
  //
  // const [cities, setCities] = React.useState<PathaoCity[]>([]);
  // const [zones, setZones] = React.useState<PathaoZone[]>([]);
  // const [areas, setAreas] = React.useState<PathaoArea[]>([]);
  //
  // const [cityQuery, setCityQuery] = React.useState<string>("");
  // const [zoneQuery, setZoneQuery] = React.useState<string>("");
  // const [areaQuery, setAreaQuery] = React.useState<string>("");
  //
  // const [citiesLoading, setCitiesLoading] = React.useState<boolean>(false);
  // const [zonesLoading, setZonesLoading] = React.useState<boolean>(false);
  // const [areasLoading, setAreasLoading] = React.useState<boolean>(false);
  //
  // const [cityOpen, setCityOpen] = React.useState<boolean>(false);
  // const [zoneOpen, setZoneOpen] = React.useState<boolean>(false);
  // const [areaOpen, setAreaOpen] = React.useState<boolean>(false);
  //
  // const [citySelected, setCitySelected] = React.useState<boolean>(false);
  // const [zoneSelected, setZoneSelected] = React.useState<boolean>(false);
  // const [areaSelected, setAreaSelected] = React.useState<boolean>(false);
  //
  // const selectedCityId = watch("pathao_city_id");
  // const selectedZoneId = watch("pathao_zone_id");
  // const selectedAreaId = watch("pathao_area_id");
  //
  // NOTE: The full city/zone/area fetch, filter, select, clear and auto-shipping effects were intentionally
  // commented out for now per requirement. Re-enable by restoring the original handlers/effects and adding
  // `setValue` back from `useForm` destructuring.

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
        const res = await fetchWithAuth("/api/shipping-config", { cache: "no-store" });
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
      const response = await apiClient.post<{ result: boolean; data?: CouponData; message?: string }>("/api/coupon-apply", {
        code: code.toUpperCase(),
      });

      if (response.data.result) {
        setCouponData(response.data.data!);
        setAppliedPromo(code.toUpperCase());
        toast.success(t("checkout.toast.promoApplied", { code: code.toUpperCase() }), {
          style: {
            background: "#22c55e",
            color: "#ffffff",
            fontWeight: 500,
          },
        });
        return true;
      } else {
        throw new Error(response.data.message || t("checkout.toast.invalidCoupon"));
      }
    } catch (error: unknown) {
      setAppliedPromo(null);
      setCouponData(null);
      setPromoDiscount(0);

      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || t("checkout.toast.invalidPromo"), {
          style: {
            background: "#ef4444",
            color: "#ffffff",
            fontWeight: 500,
          },
        });
      } else if (error instanceof Error) {
        toast.error(error.message || t("checkout.toast.invalidPromo"), {
          style: {
            background: "#ef4444",
            color: "#ffffff",
            fontWeight: 500,
          },
        });
      } else {
        toast.error(t("checkout.toast.invalidPromo"), {
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
      toast.error(t("checkout.toast.enterPromo"));
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

  // ------------------------- Data Layer Events -------------------------
  const hasFiredBeginCheckout = React.useRef(false);
  const lastShippingTier = React.useRef("");
  const lastPaymentType = React.useRef("");

  React.useEffect(() => {
    if (typeof window !== "undefined" && selectedCart.length > 0 && !hasFiredBeginCheckout.current) {
      const items = selectedCart.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_variant: item.variant || "",
      }));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "begin_checkout",
        ecommerce: {
          currency: "BDT",
          value: subtotal - discount,
          items: items,
        },
      });
      hasFiredBeginCheckout.current = true;
    }
  }, [selectedCart, subtotal, discount]);

  React.useEffect(() => {
    if (typeof window !== "undefined" && shippingMethod && selectedCart.length > 0) {
      if (lastShippingTier.current === shippingMethod) return;

      const items = selectedCart.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_variant: item.variant || "",
      }));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_shipping_info",
        ecommerce: {
          currency: "BDT",
          value: subtotal - discount,
          shipping_tier: shippingMethod,
          items: items,
        },
      });
      lastShippingTier.current = shippingMethod;
    }
  }, [shippingMethod, selectedCart, subtotal, discount]);

  const paymentMethod = watch("payment");
  React.useEffect(() => {
    if (typeof window !== "undefined" && paymentMethod && selectedCart.length > 0) {
      if (lastPaymentType.current === paymentMethod) return;

      const items = selectedCart.map((item) => ({
        item_id: item.id.toString(),
        item_name: item.name,
        price: item.price,
        quantity: item.qty,
        item_variant: item.variant || "",
      }));

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "add_payment_info",
        ecommerce: {
          currency: "BDT",
          value: subtotal - discount,
          payment_type: paymentMethod === "cod" ? "Cash on Delivery" : "Online Payment",
          items: items,
        },
      });
      lastPaymentType.current = paymentMethod;
    }
  }, [paymentMethod, selectedCart, subtotal, discount]);

  // ------------------------- Payment Modal -------------------------
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [paymentData, setPaymentData] = React.useState<CheckoutFormData | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    React.useState<"visa" | "mastercard" | "bkash" | "nagad">("visa");
  const [paymentNumber, setPaymentNumber] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleConfirmOrder = (data: CheckoutFormData) => {
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
      toast.error(t("checkout.toast.emptyCart"));
      return;
    }

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
        pathao_city_id: null,
        pathao_zone_id: null,
        pathao_area_id: null,
      },
      items: selectedCart.map((item) => ({
        id: Number(item.id),
        qty: Number(item.qty),
        variant: item.variant || null,
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
      const response = await apiClient.post("/api/orders", payload);

      if (response.data.success && response.data.data?.result) {
        toast.success(response.data.data.message || t("checkout.toast.orderPlaced"));
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
              customer: {
                name: data.name,
                email: data.email || "",
                phone: data.mobile,
                address: data.address,
                city_id: null,
                zone_id: null,
                area_id: null,
              },
            });

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
                variant: item.variant || null,
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
            } catch { }

            const nextHref = `/checkout/ordercomplete${transactionId ? `?orderId=${encodeURIComponent(transactionId)}` : ""}`;
            clearCart();
            setShowPaymentModal(false);
            router.push(nextHref);
            return;
          }
        } catch (e) {
          console.error("Failed to push purchase event", e);
        }
        clearCart();
        setShowPaymentModal(false);
        router.push("/checkout/ordercomplete");
      } else {
        toast.error(response.data.message || t("checkout.toast.orderFailed"));
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Order submit error:", error.response || error);
        toast.error(
          error.response?.data?.message || t("checkout.toast.orderError")
        );
      } else {
        console.error("Unexpected error:", error);
        toast.error(t("checkout.toast.orderError"));
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
      toast.error(t("checkout.toast.genericError"));
    }
  };

  const handleModalCancel = () => {
    setShowPaymentModal(false);
    setPaymentData(null);
  };

  return (
    <div className="w-11/12 mx-auto mt-6 lg:mt-16 min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-medium mb-6">{t("checkout.title")}</h1>
      <form onSubmit={handleSubmit(handleConfirmOrder)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">{t("checkout.inCart")}</h2>
          </div>
          {selectedCart.length === 0 ? (
            <p className="text-gray-500 text-sm">{t("checkout.noItems")}</p>
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
                    <span className="font-medium">{t("checkout.qty")}</span>
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => decreaseQty(item.id, item.variant)}
                      >
                        -
                      </button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => increaseQty(item.id, item.variant)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFromCart(item.id, item.variant)}
                  className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 text-lg"
                >
                  <RiDeleteBin6Line className="text-xl mr-2 mb-2" />
                </button>
              </div>
            ))
          )}
        </div>

        <div className="flex flex-col gap-6">
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">{t("checkout.customerInfo")}</h2>
            <div className="flex flex-col gap-3">
              <label>{t("checkout.name")}</label>
              <input
                type="text"
                placeholder={t("checkout.namePlaceholder")}
                className="border p-2 mb-1 rounded"
                {...register("name")}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
              <label>{t("checkout.mobile")}</label>
              <input
                type="text"
                placeholder="019*******"
                className="border p-2 mb-1 rounded"
                {...register("mobile")}
              />
              {errors.mobile && <p className="text-red-500 text-sm">{errors.mobile.message}</p>}
              <label>{t("checkout.emailOptional")}</label>
              <input
                type="email"
                placeholder="@email"
                className="border p-2 mb-1 rounded"
                {...register("email")}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

              {/*
              ARCHIVED: City/Zone/Area fields (commented out intentionally)

              <label>{t("checkout.city")}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={t("checkout.cityPlaceholder")}
                  className={`border p-2 mb-1 rounded w-full pr-8 ${citySelected ? "bg-gray-50 cursor-default" : ""}`}
                  value={cityQuery}
                  onChange={(e) => {
                    if (citySelected) return;
                    setCityQuery(e.target.value);
                    setCityOpen(true);
                  }}
                />
                <input type="hidden" {...register("pathao_city_id")} />
              </div>

              <label>{t("checkout.zone")}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedCityId ? t("checkout.zonePlaceholder") : t("checkout.selectCityFirst")}
                  className={`border p-2 mb-1 rounded w-full pr-8 ${!selectedCityId ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={zoneQuery}
                  onChange={(e) => {
                    if (!selectedCityId || zoneSelected) return;
                    setZoneQuery(e.target.value);
                    setZoneOpen(true);
                  }}
                />
                <input type="hidden" {...register("pathao_zone_id")} />
              </div>

              <label>{t("checkout.areaOptional")}</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder={selectedZoneId ? t("checkout.areaPlaceholder") : t("checkout.selectZoneFirst")}
                  className={`border p-2 mb-1 rounded w-full pr-8 ${!selectedZoneId ? "bg-gray-100 cursor-not-allowed" : ""}`}
                  value={areaQuery}
                  onChange={(e) => {
                    if (!selectedZoneId || areaSelected) return;
                    setAreaQuery(e.target.value);
                    setAreaOpen(true);
                  }}
                />
                <input type="hidden" {...register("pathao_area_id")} />
              </div>
              */}

              <label>{t("checkout.address")}</label>
              <input
                type="text"
                placeholder={t("checkout.addressPlaceholder")}
                className="border p-2 mb-1 rounded"
                {...register("address")}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
            </div>
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">{t("checkout.shippingMethod")}</h2>
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
                    />
                      {t("checkout.insideDhaka", { currencySymbol, amount: insideDhaka.toLocaleString() })}
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      value="outside"
                      checked={field.value === "outside"}
                      onChange={() => field.onChange("outside")}
                    />
                      {t("checkout.outsideDhaka", { currencySymbol, amount: outsideDhaka.toLocaleString() })}
                  </label>
                </div>
              )}
            />
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{t("checkout.paymentMethod")}</h2>
            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center gap-2 text-lg mb-6 cursor-pointer">
                    <input
                      type="radio"
                      value="cod"
                      checked={field.value === "cod"}
                      onChange={() => field.onChange("cod")}
                    />
                    {t("checkout.cashOnDelivery")}
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
                {t("checkout.termsText")} {" "}
                <span className="text-orange-500">{t("checkout.termsLink")}</span> {t("checkout.and")}{" "}
                <span className="text-orange-500">{t("checkout.returnPolicy")}</span>.
              </span>
            </label>
            {errors.agreeTerms && (
              <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-3">{t("checkout.promoCode")}</h2>
            <input
              type="text"
              className="border p-2 rounded w-full flex-1"
              {...register("promoCode")}
              placeholder={t("checkout.promoPlaceholder")}
            />
            <div className="cursor-pointer flex justify-end items-center">
              <button
                type="button"
                onClick={handleApplyPromo}
                disabled={isValidatingPromo}
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-300 duration-300 mt-2 disabled:opacity-50"
              >
                {isValidatingPromo ? t("checkout.applying") : t("checkout.apply")}
              </button>
            </div>
            {appliedPromo && (
              <div className="mt-2 p-2 bg-green-50 rounded text-green-700 text-sm">
                {t("checkout.promoAppliedBadge", {
                  code: appliedPromo,
                  off: couponData?.type === "percentage" ? `${couponData.value}%` : `৳${couponData?.value}`,
                })}
              </div>
            )}
          </div>

          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">{t("checkout.orderSummary")}</h2>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>{t("checkout.subTotal")}</span>
              <span>৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>{t("checkout.deliveryCharge")}</span>
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
              <span>{t("checkout.discount")}</span>
              <span>৳ {discount.toLocaleString()}</span>
            </div>
            {appliedPromo && promoDiscount > 0 && (
              <div className="flex justify-between md:text-lg text-base mb-2 text-green-600 font-medium">
                <span>{t("checkout.promoDiscount", { code: appliedPromo })}</span>
                <span>-৳ {promoDiscount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex bg-[#f4f4f4] py-4 px-2 justify-between font-semibold text-orange-600 text-lg md:text-xl mt-4">
              <span>{t("checkout.totalAmount")}</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
            <button
              type="submit"
              className={`w-full bg-orange-500 text-white py-3 rounded-full font-semibold text-center mt-4 ${!isValid ? "opacity-60 cursor-not-allowed" : ""
                }`}
              disabled={!isValid || isLoading}
            >
              {isLoading ? t("checkout.processing") : t("checkout.confirmOrder")}
            </button>
          </div>
        </div>
      </form>

      {showPaymentModal && paymentData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[650px] relative shadow-lg">
            <h2 className="text-xl font-semibold mb-4">{t("checkout.demoPayment")}</h2>
            <p className="mb-4">
              {t("checkout.amount")} <span className="font-bold">৳ {total.toLocaleString()}</span>
            </p>
            <div className="flex gap-3">
              {(["visa", "mastercard", "bkash", "nagad"] as const).map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setSelectedPaymentMethod(method)}
                  className={`flex-1 p-2 border rounded hover:border-orange-500 flex items-center justify-center gap-2 ${selectedPaymentMethod === method
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
            <div className="mb-4 mt-4">
              <label className="block mb-1 font-medium">{t("checkout.enterNumber")}</label>
              <input
                type="text"
                placeholder={
                  selectedPaymentMethod === "bkash" || selectedPaymentMethod === "nagad"
                    ? t("checkout.mobileNumberExample")
                    : t("checkout.cardNumber")
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
                {t("checkout.cancel")}
              </button>
              <button
                onClick={handleModalPaymentConfirm}
                className="px-4 py-2 rounded bg-orange-500 text-white hover:bg-orange-600"
                disabled={!paymentNumber || !selectedPaymentMethod || isLoading}
              >
                {isLoading ? t("checkout.processing") : t("checkout.confirm")}
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

export default CheckoutContent;
