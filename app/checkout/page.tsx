"use client";

import Image from "next/image";
// import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { RiDeleteBin6Line } from "react-icons/ri";
import toast from "react-hot-toast";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";

// ------------------------- Types -------------------------
interface CartItem {
  id: string;
  name: string;
  img: string;
  price: number;
  oldPrice: number;
  qty: number;
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
  const { cart, selectedItems, increaseQty, decreaseQty, removeFromCart } = useCart();

  // Filter selected items
  const selectedCart: CartItem[] = cart.filter(item => selectedItems.includes(item.id));

  // Totals
  const subtotal = selectedCart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const discount = selectedCart.reduce((acc, item) => acc + (item.oldPrice - item.price) * item.qty, 0);

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
      payment: "online",
      agreeTerms: false,
      promoCode: "",
    },
  });

  const shippingMethod = watch("shipping"); // "inside", "outside", or "free"

  let deliveryCharge = 0;
  if (shippingMethod === "inside") deliveryCharge = 70;
  else if (shippingMethod === "outside") deliveryCharge = 140;
  else if (shippingMethod === "free") deliveryCharge = 0;

  // ------------------------- Promo Code Logic -------------------------
  const promoCodes: Record<
    string,
    (total: number, delivery: number) => { newTotal: number; newDelivery?: number }
  > = {
    SAVE10: (total) => ({ newTotal: total * 0.9 }),
    BD50: (total) => ({ newTotal: total - 50 }),
    FREESHIP: (total) => ({ newTotal: total, newDelivery: 0 }),
    BUY1GET1: (total) => ({ newTotal: total * 0.5 }),
    WELCOME20: (total) => ({ newTotal: total * 0.8 }),
  };

  const [appliedPromo, setAppliedPromo] = React.useState<string | null>(null);
  const [promoDiscount, setPromoDiscount] = React.useState<number>(0);
  const [promoDelivery, setPromoDelivery] = React.useState<number | undefined>(undefined);

const handleApplyPromo = () => {
  const code = watch("promoCode")?.toUpperCase();
  if (code && promoCodes[code]) {
    const baseTotal = subtotal - discount + deliveryCharge;
    const result = promoCodes[code](baseTotal, deliveryCharge);

    setAppliedPromo(code);
    setPromoDiscount(baseTotal - result.newTotal);
    if (result.newDelivery !== undefined) setPromoDelivery(result.newDelivery);
    else setPromoDelivery(undefined);

    // Green toast for promo success
    toast.success(`Promo code "${code}" applied! 🎉`, {
      style: {
        background: "#22c55e", // Tailwind green-500
        color: "#ffffff",
        fontWeight: 500,
         transform: "translateX(100%)", // start off-screen right
      animation: "slideInRight 0.5s forwards", // slide in
      },
    });
  } else {
    setAppliedPromo(null);
    setPromoDiscount(0);
    setPromoDelivery(undefined);

    // Red toast for invalid promo
    toast.error("Invalid promo code ❌", {
      style: {
        background: "#ef4444", // Tailwind red-500
        color: "#ffffff",
        fontWeight: 500,
      },
    });
  }
};


 const effectiveDelivery = promoDelivery !== undefined ? promoDelivery : deliveryCharge;
const total = subtotal - discount + effectiveDelivery - promoDiscount;

  const onSubmit = (data: CheckoutFormData) => {
    console.log("Checkout Data:", data);
    alert("Checkout submitted! Check console for data.");
    // send data + selectedCart to backend here
  };

  return (
    <div className="w-11/12 mx-auto mt-9 min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">Shipping Information</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* In Your Cart */}
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">In Your Cart</h2>
          </div>

          {selectedCart.length === 0 ? (
            <p className="text-gray-500 text-sm">No items selected.</p>
          ) : (
            selectedCart.map(item => (
              <div key={item.id} className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative">
                {/* Image */}
                <div className="md:w-28 md:h-28 h-20 w-20 xl:w-20 xl:h-20 2xl:w-24 2xl:h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <Image src={item.img} alt={item.name} width={110} height={110} className="object-contain"/>
                </div>

                {/* Details */}
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm md:text-lg">{item.name}</h3>
                  <div className="font-semibold text-orange-600 text-sm md:text-lg mt-1">
                    ৳{item.price}
                    <span className="line-through text-gray-400 ml-2 text-xs">৳{item.oldPrice}</span>
                  </div>

                  {/* Qty Row */}
                  <div className="flex items-center gap-4 mt-1 text-sm md:text-sm">
                    <span className="font-medium">QTY :</span>
                    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => decreaseQty(item.id)}
                      >-</button>
                      <span className="font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                        onClick={() => increaseQty(item.id)}
                      >+</button>
                    </div>
                  </div>
                </div>

                {/* Delete Button */}
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
            <Controller
              name="shipping"
              control={control}
              render={({ field }) => (
                <div className="flex flex-col space-y-4 md:text-lg xl:text-base 2xl:text-lg text-base mt-8">
                  <label className="flex items-center gap-2">
                    <input type="radio" value="inside" checked={field.value === "inside"} onChange={() => field.onChange("inside")} />
                    Inside Dhaka - 2/4 Days ৳ 70
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="outside" checked={field.value === "outside"} onChange={() => field.onChange("outside")} />
                    Outside Dhaka - 4/6 Days ( Advanced First ) ৳ 140
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="radio" value="free" checked={field.value === "free"} onChange={() => field.onChange("free")} />
                    Free Shipping ( Upto ৳ 2000 )
                  </label>
                  {errors.shipping && <p className="text-red-500 text-sm">{errors.shipping.message}</p>}
                </div>
              )}
            />
          </div>
        </div>

        {/* Payment + Summary */}
        <div className="flex flex-col gap-6">

          {/* Payment Method */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

            <Controller
              name="payment"
              control={control}
              render={({ field }) => (
                <>
                  <label className="flex items-center gap-2 text-lg mb-6">
                    <input type="radio" value="online" checked={field.value === "online"} onChange={() => field.onChange("online")} />
                    Online Payment*
                  </label>

                  <div className="flex gap-2 mb-5 items-center">
                    <h1 className="text-[#8f8f8f] text-sm">We Accept</h1>
                    <Image src="/images/visa.png" alt="Visa" width={40} height={24} className="w-full h-full object-contain"/>
                    <Image src="/images/master.png" alt="Mastercard" width={40} height={24} className="w-full h-full object-contain"/>
                    <Image src="/images/bkash.png" alt="bKash" width={40} height={24} className="w-full h-full object-contain"/>
                    <Image src="/images/nagad.png" alt="Nagad" width={40} height={24} className="w-full h-full object-contain"/>
                  </div>

                  <label className="flex items-center gap-2 text-lg mb-6">
                    <input type="radio" value="cod" checked={field.value === "cod"} onChange={() => field.onChange("cod")} />
                    Cash On Delivery*
                  </label>
                  {errors.payment && <p className="text-red-500 text-sm">{errors.payment.message}</p>}
                </>
              )}
            />

            <label className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <input type="checkbox" {...register("agreeTerms")} className="shrink-0" />
              <span className="flex-1">
                I have read & agree to the <span className="text-orange-500">Terms & Conditions, Privacy Policy</span> and <span className="text-orange-500">Return Policy</span>.
              </span>
            </label>
            {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>}
          </div>

          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-3">Promo Code</h2>
            <input type="text" className="border p-2 rounded w-full flex-1" {...register("promoCode")} />
            <div className="cursor-pointer flex justify-end items-center">
              <button
                type="button"
                onClick={handleApplyPromo}
                className="bg-orange-500 text-white px-4 py-2 rounded-full hover:bg-orange-300 duration-300 mt-2"
              >
                Apply
              </button>
            </div>
          </div>

          {/* Order Summary */}
          {/* Order Summary */}
<div className="border rounded-xl p-4 bg-white shadow-sm">
  <h2 className="md:text-2xl text-xl font-semibold mb-4">In Your Order Summary</h2>

  <div className="flex justify-between md:text-lg text-base mb-2">
    <span>Sub Total :</span>
    <span>৳ {subtotal.toLocaleString()}</span>
  </div>

  <div className="flex justify-between md:text-lg text-base mb-2">
    <span>Delivery Charge :</span>
    <span>৳ {effectiveDelivery.toLocaleString()}</span>
  </div>

  <div className="flex justify-between md:text-lg text-base mb-2">
    <span>Discount :</span>
    <span>৳ {discount.toLocaleString()}</span>
  </div>

  {appliedPromo && (
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
    disabled={!isValid}
  >
    Confirm Order
  </button>
</div>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
