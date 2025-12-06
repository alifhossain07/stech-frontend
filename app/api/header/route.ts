import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      throw new Error("API_BASE or SYSTEM_KEY is not defined in environment variables");
    }

    // Fetch logo from external API
    const res = await fetch(`${apiBase}/header/logo`, {
      headers: {
        "Authorization": `Bearer ${systemKey}`, // API expects SYSTEM_KEY
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) throw new Error("Failed to fetch logo");

    const data = await res.json();

    // Extract full URL from the response
    const fullUrl = data?.data?.url;

    return NextResponse.json({
      logoUrl: fullUrl || "/images/placeholder.png", // fallback
    });
  } catch (err) {
    console.error("Error fetching logo:", err);
    return NextResponse.json({
      logoUrl: "/images/placeholder.png",
    });
  }
}
