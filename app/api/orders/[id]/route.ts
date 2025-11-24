import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

type Order = {
  id: number | string;
  customer: {
    name: string;
    mobile: string;
    email?: string;
    address: string;
  };
  items: {
    id: string | number;
    name: string;
    qty: number;
    price: number;
  }[];
  totalAmount: number;
};

const ordersFilePath = path.join(process.cwd(), "database", "orders.json");

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const orderId = params.id;

    if (!fs.existsSync(ordersFilePath)) {
      return NextResponse.json(
        { success: false, message: "No orders found" },
        { status: 404 }
      );
    }

    const fileData = fs.readFileSync(ordersFilePath, "utf-8");
    const orders: Order[] = JSON.parse(fileData);

    const order = orders.find((o) => o.id.toString() === orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Error fetching order", error },
      { status: 500 }
    );
  }
}
