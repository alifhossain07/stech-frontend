import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.API_BASE; // http://sannai.test/api/v2
    const systemKey = process.env.SYSTEM_KEY;

    if (!baseUrl || !systemKey) {
      return NextResponse.json(
        { error: "Missing API_BASE or SYSTEM_KEY in environment variables" },
        { status: 500 }
      );
    }

    const response = await fetch(`${baseUrl}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey, // if backend requires it
      },
      cache: "no-store",
    });

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch categories", details: error },
      { status: 500 }
    );
  }
}
