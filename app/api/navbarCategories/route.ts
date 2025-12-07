import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiBase = process.env.API_BASE;

    if (!apiBase) {
      return NextResponse.json(
        { error: "API_BASE is missing in environment variables" },
        { status: 500 }
      );
    }

    const response = await fetch(`${apiBase}/categories/menu`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "System-Key": process.env.SYSTEM_KEY ?? "",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch Categories of Navbar", status: response.status },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching Categories of Navbar:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
