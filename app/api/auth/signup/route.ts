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

    // Ensure phone-only registration
    const signupBody = {
      ...body,
      register_by: "phone",
    };

    const res = await fetch(`${apiBase}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
      },
      body: JSON.stringify(signupBody),
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