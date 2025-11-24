import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Path to your orders.json file
const ordersFilePath = path.join(process.cwd(), "database", "orders.json");

// ------------------------- Types -------------------------
interface CartItem {
  id: string;
  name: string;
  qty: number;
  price: number;
  oldPrice: number;
}

interface Order {
  id: number;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    address: string;
  };
  shippingMethod: "inside" | "outside" | "free";
  shippingCharge: number;
  paymentMethod: string;
  paymentNumber?: string | null;
  promoCode?: string | null;
  promoDiscount?: number;
  items: CartItem[];
  subtotal: number;
  discount: number;
  totalAmount: number;
  timestamp: string;
}

// ------------------------- POST -------------------------
export async function POST(req: NextRequest) {
  try {
    const orderData: Order = await req.json();

    // Read existing orders
    let orders: Order[] = [];
    if (fs.existsSync(ordersFilePath)) {
      const fileData = fs.readFileSync(ordersFilePath, "utf-8");
      orders = fileData ? JSON.parse(fileData) : [];
    }

    // Append new order
    orders.push(orderData);

    // Write back to file
    fs.writeFileSync(ordersFilePath, JSON.stringify(orders, null, 2), "utf-8");

    return NextResponse.json({
      success: true,
      message: "Order saved successfully!",
      order: orderData,
    });
  } catch (error) {
    console.error("Error saving order:", error);
    return NextResponse.json(
      { success: false, message: "Failed to save order", error },
      { status: 500 }
    );
  }
}

// ------------------------- GET -------------------------
export async function GET() {
  try {
    let orders: Order[] = [];
    if (fs.existsSync(ordersFilePath)) {
      const fileData = fs.readFileSync(ordersFilePath, "utf-8");
      orders = fileData ? JSON.parse(fileData) : [];
    }

    return NextResponse.json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("Error reading orders:", error);
    return NextResponse.json(
      { success: false, message: "Failed to read orders", error },
      { status: 500 }
    );
  }
}
