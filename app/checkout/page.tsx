"use client";
import Image from "next/image";
import React from "react";

import { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
const Page = () => {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
    },
    {
      id: 2,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 2,
      img: "/images/tws.png",
    },
    {
      id: 3,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
    },
    {
      id: 4,
      name: "Sannai OpenArc Open-Ear Wireless",
      color: "Black & Orange",
      price: 2140,
      oldPrice: 2200,
      qty: 1,
      img: "/images/tws.png",
    },
  ]);

  const increaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((i) => (i.id === id ? { ...i, qty: i.qty + 1 } : i))
    );
  };

  const decreaseQty = (id: number) => {
    setCartItems((items) =>
      items.map((i) =>
        i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((i) => i.id !== id));
  };
  return (
    <div className="w-11/12 mx-auto mt-9 min-h-[50vh]">
      <h1 className="text-2xl md:text-3xl font-bold mb-6">
        Shipping Information
      </h1>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* In Your Cart */}
        <div className="border rounded-xl p-4 bg-white shadow-sm w-full">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">In Your Cart</h2>

            <button className="flex items-center gap-1 bg-[#e8e8e8] text-[#6b6b6b] px-3 py-1 rounded-md text-sm">
              Add Cart <span className="text-lg">+</span>
            </button>
          </div>

          {/* Cart Items */}
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex gap-3 p-3 mb-3 w-11/12 rounded-lg relative"
            >
              {/* Image */}
              <div className="w-28 h-28 bg-gray-100 rounded-lg flex items-center justify-center">
                <Image
                  src={item.img}
                  alt={item.name}
                  width={110}
                  height={110}
                  className="object-contain"
                />
              </div>

              {/* Details */}
              <div className="flex-1 space-y-1">
                <h3 className=" text-lg">{item.name}</h3>
                <p className="text-base text-gray-500">{item.color}</p>

                <div className="font-semibold text-orange-600 text-lg mt-1">
                  ৳{item.price}
                  <span className="line-through text-gray-400 ml-2 text-xs">
                    ৳{item.oldPrice}
                  </span>
                </div>

                {/* Qty Row */}
                <div className="flex items-center gap-4 mt-1 text-sm">
                  <span className="font-medium">QTY :</span>

                  <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 gap-3">
                    <button
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                      onClick={() => decreaseQty(item.id)}
                    >
                      -
                    </button>

                    <span className="font-semibold">{item.qty}</span>

                    <button
                      className="w-5 h-5 flex items-center justify-center bg-black text-white rounded-full"
                      onClick={() => increaseQty(item.id)}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Button on Right Side */}
              <button
                onClick={() => removeItem(item.id)}
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
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Customer Information</h2>

            <div className="flex flex-col gap-3">
              <label>Your Name*</label>
              <input
                type="text"
                placeholder="aman***"
                className="border p-2 mb-4 rounded"
              />
              <label>Mobile*</label>
              <input
                type="number"
                placeholder="019*******"
                className="border p-2 mb-4  rounded"
              />
              <label>E-mail &#40;optional&#41;*</label>
              <input
                type="email"
                placeholder="@email*****"
                className="border p-2 mb-4 rounded"
              />
              <label>Address*</label>
              <input
                type="text"
                placeholder="suggested location"
                className="border p-2 mb-4 rounded"
              />
              <div className="flex items-end justify-end rounded-full">
                <button className="bg-orange-500 rounded-full text-white  px-6 py-2 ">
                Save
              </button>
              </div>
             
            </div>
          </div>

          {/* Shipping Method */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="text-2xl font-semibold mb-4">Shipping Method</h2>

            <div className="flex flex-col space-y-4 text-lg gap-3 mt-8 text-sm">
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
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">Payment Method</h2>

            <label className="flex items-center gap-2 text-sm mb-2">
              <input type="radio" name="payment" defaultChecked />
              Online Payment*
            </label>

            <div className="flex gap-2 mb-3">
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
              <div className="w-10 h-6 bg-gray-200 rounded"></div>
            </div>

            <label className="flex items-center gap-2 text-sm mb-2">
              <input type="radio" name="payment" />
              Cash On Delivery*
            </label>

            <label className="flex items-center gap-2 text-xs">
              <input type="checkbox" />I have read & agree to the Terms &
              Conditions, Privacy policy, and Return Policy
            </label>
          </div>

          {/* Promo Code */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-3">Promo Code</h2>
            <div className="flex gap-2">
              <input type="text" className="border p-2 rounded flex-1" />
              <button className="bg-orange-500 text-white px-4 py-2 rounded">
                Send
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border rounded-xl p-4 bg-white shadow-sm">
            <h2 className="text-lg font-semibold mb-4">
              In Your Order Summary
            </h2>

            <div className="flex justify-between text-sm mb-2">
              <span>Sub Total :</span>
              <span>৳ 800</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Delivery Charge :</span>
              <span>৳ 80</span>
            </div>

            <div className="flex justify-between text-sm mb-2">
              <span>Discount :</span>
              <span>৳ 10</span>
            </div>

            <div className="flex justify-between font-semibold text-orange-600 text-lg mt-4">
              <span>Total Amount :</span>
              <span>৳ 890</span>
            </div>
          </div>

          <button className="w-full bg-orange-500 text-white py-3 rounded-full font-semibold text-center">
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
