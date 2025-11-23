"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";
import { RiDeleteBin6Line } from "react-icons/ri";

const CheckoutPage = () => {
  const { cart, increaseQty, decreaseQty, removeFromCart } = useCart();

  const subtotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const deliveryCharge = 80; // example default delivery
  const discount = cart.reduce((acc, item) => acc + (item.oldPrice - item.price) * item.qty, 0);
  const total = subtotal + deliveryCharge - discount;

  return (
    <div className="w-11/12 mx-auto mt-9 min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Shipping Information
      </h1>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* In Your Cart */}
        <div className="border rounded-md p-4 bg-white shadow-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <h2 className="md:text-2xl text-xl font-semibold">In Your Cart</h2>
          </div>

          {cart.map((item) => (
            <div key={item.slug} className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative">
              {/* Image */}
              <div className="md:w-28 md:h-28 h-20 w-20 xl:w-20 xl:h-20 2xl:w-28 2xl:h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image src={item.img} alt={item.name} width={110} height={110} className="object-contain"/>
              </div>

              {/* Details */}
              <div className="flex-1 space-y-1">
                <h3 className="text-sm md:text-lg">{item.name}</h3>

                <div className="font-semibold text-orange-600 text-sm md:text-lg mt-1">
                  ৳{item.price}
                  <span className="line-through text-gray-400 ml-2 text-xs">
                    ৳{item.oldPrice}
                  </span>
                </div>

                {/* Qty Row */}
                <div className="flex items-center gap-4 mt-1 text-sm md:text-sm">
                  <span className="font-medium">QTY :</span>

                  <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                    <button
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                      onClick={() => decreaseQty(item.slug)}
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.qty}</span>

                    <button
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                      onClick={() => increaseQty(item.slug)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeFromCart(item.slug)}
                className="absolute right-2 bottom-2 text-gray-400 hover:text-red-500 text-lg"
              >
                <RiDeleteBin6Line className="text-xl mr-2 mb-2" />
              </button>
            </div>
          ))}
        </div>

        {/* Customer Info + Shipping */}
        <div className="flex flex-col gap-6">
          {/* Customer Info */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">
              Customer Information
            </h2>

            <div className="flex flex-col gap-3">
              <label>Your Name*</label>
              <input type="text" placeholder="Enter your name" className="border p-2 mb-4 rounded"/>
              <label>Mobile*</label>
              <input type="number" placeholder="019*******" className="border p-2 mb-4 rounded"/>
              <label>E-mail (optional)</label>
              <input type="email" placeholder="@email" className="border p-2 mb-4 rounded"/>
              <label>Address*</label>
              <input type="text" placeholder="Delivery address" className="border p-2 mb-4 rounded"/>
              <div className="flex items-end justify-end rounded-full">
                <button className="bg-orange-500 rounded-full text-white px-4 py-1 md:px-6 md:py-2">
                  Save
                </button>
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-4">
              Shipping Method
            </h2>

            <div className="flex flex-col space-y-4 md:text-lg xl:text-base 2xl:text-lg text-base mt-8">
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" defaultChecked />
                Inside Dhaka - 2/4 Days ৳ 70
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                Outside Dhaka - 4/6 Days ( Advanced First ) ৳ 140
              </label>
              <label className="flex items-center gap-2">
                <input type="radio" name="shipping" />
                Free Shipping ( Upto ৳ 2000 )
              </label>
            </div>
          </div>
        </div>

        {/* Payment + Summary */}
        <div className="flex flex-col gap-6">
          {/* Payment Method */}
          <div className="border rounded-md p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

            <label className="flex items-center gap-2 text-lg mb-6">
              <input type="radio" name="payment" defaultChecked />
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
              <input type="radio" name="payment" />
              Cash On Delivery*
            </label>

            <label className="flex items-center gap-2 text-xs sm:text-sm flex-wrap">
              <input type="checkbox" className="shrink-0" />
              <span className="flex-1">
                I have read & agree to the <span className="text-orange-500">Terms & Conditions, Privacy Policy</span> and <span className="text-orange-500">Return Policy</span>.
              </span>
            </label>
          </div>

          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="md:text-2xl text-xl font-semibold mb-3">Promo Code</h2>
            <div className="flex gap-2">
              <input type="text" className="border p-2 rounded flex-1"/>
            </div>
            <div className="flex items-end justify-end">
              <button className="bg-orange-500 mt-4 text-white px-4 py-1 md:px-6 md:py-2 rounded-full">
                Apply
              </button>
            </div>
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
              <span>৳ {deliveryCharge.toLocaleString()}</span>
            </div>

            <div className="flex justify-between md:text-lg text-base mb-2">
              <span>Discount :</span>
              <span>৳ {discount.toLocaleString()}</span>
            </div>

            <div className="flex bg-[#f4f4f4] py-4 px-2 justify-between font-semibold text-orange-600 text-lg md:text-xl mt-4">
              <span>Total Amount :</span>
              <span>৳ {total.toLocaleString()}</span>
            </div>
          </div>

          <Link href="/checkout/ordercomplete">
            <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold text-center">
              Confirm Order
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
