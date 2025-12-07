import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { error: "API_BASE or SYSTEM_KEY is missing" },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiBase}/header/logo`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey, // REQUIRED
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch logo", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 🔥 Return EXACT response, unchanged
    return NextResponse.json(data, { status: 200 });

  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
