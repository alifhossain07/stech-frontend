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

    const res = await fetch(`${apiBase}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // add the same style of auth you use elsewhere:
        "System-Key": systemKey,
        // "Authorization": `Bearer ${systemKey}`, // uncomment if your auth APIs require this instead
      },
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Signup proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Signup failed" },
      { status: 500 }
    );
  }
}