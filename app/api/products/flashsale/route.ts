import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
  try {
    // Fetch the flash sale data and the deal of the day
    const res = await axios.get(`${API_BASE}/flash-deals`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
    });

    // Extract the flash sale data and the deal of the day
    const flashSaleData = res.data.data[0]; // Assuming we only care about the first flash sale
    const banner = flashSaleData.banner;
    const products = flashSaleData.products.data;
     const title = flashSaleData.title;  // New field: title
    const date = flashSaleData.date;
    

    // Respond with the fetched data
    return NextResponse.json({
      success: true,
      banner: banner,
      products: products,
      title: title,   // Including title in the response
      date: date,
    });
  } catch (error) {
    console.error("Error fetching Flash Sale data:", error);
    return NextResponse.json({ success: false, error: "Failed to fetch flash sale data" }, { status: 500 });
  }
}
