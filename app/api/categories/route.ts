import { NextResponse } from "next/server";

const API_BASE = "http://sannai.test/api/v2";
const SYSTEM_KEY =
  "$2y$10$0oj5nwGr0flo5Udh49U3o.SqzgNNA7K4N0.rIRPloMM0ANtfk7PJK";

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/categories`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const data = await res.json();

    return NextResponse.json({
      success: true,
      categories: data?.data ?? [],
    });
  } catch (error) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load categories" },
      { status: 500 }
    );
  }
}
