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

    const body = await req.json();

    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        // Or, if your backend expects bearer-style:
        // "Authorization": `Bearer ${systemKey}`,
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Login proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Login failed" },
      { status: 500 }
    );
  }
}