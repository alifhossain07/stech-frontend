import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    const systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    const formData = await req.formData();
    
    // Ensure we are sending to the correct endpoint
    const backendUrl = `${apiBase}/auth/signup`;

    const res = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "System-Key": systemKey,
        // Content-Type is left out to let the browser/fetch set it with boundary for FormData
        "Accept": "application/json",
      },
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Dealer signup proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Dealer signup failed" },
      { status: 500 }
    );
  }
}
