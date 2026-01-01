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

    // Validate required fields
    if (!body.phone || !body.password) {
      return NextResponse.json(
        { result: false, message: "Phone number and password are required" },
        { status: 400 }
      );
    }

    // Phone-only login - backend expects 'phone' field when login_by is 'phone'
    const phoneValue = String(body.phone).trim();
    
    // Ensure phone is not empty
    if (!phoneValue) {
      return NextResponse.json(
        { result: false, message: "Phone number is required" },
        { status: 400 }
      );
    }
    
    // Backend validation specifically looks for 'phone' field when login_by is 'phone'
    const loginBody = {
      login_by: "phone",
      phone: phoneValue,
      password: body.password,
    };

    // Detailed logging for debugging
    console.log("=== LOGIN DEBUG INFO ===");
    console.log("API Base URL:", apiBase);
    console.log("Full endpoint:", `${apiBase}/auth/login`);
    console.log("Request body:", JSON.stringify(loginBody, null, 2));
    console.log("Phone value:", phoneValue);
    console.log("Phone type:", typeof phoneValue);
    console.log("Phone length:", phoneValue.length);
    console.log("Phone isEmpty:", phoneValue === "");
    console.log("System-Key present:", !!systemKey);
    console.log("=========================");

    const res = await fetch(`${apiBase}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
      },
      body: JSON.stringify(loginBody),
    });

    console.log("Backend response status:", res.status);
    console.log("Backend response headers:", Object.fromEntries(res.headers.entries()));

    const data = await res.json();
    
    // Log full backend response for debugging
    console.log("=== BACKEND RESPONSE ===");
    console.log("Full response:", JSON.stringify(data, null, 2));
    console.log("Response result:", data.result);
    console.log("Response message:", data.message);
    console.log("========================");
    
    // Log backend response for debugging
    if (!data.result) {
      console.error("Backend login error:", data);
    }
    
    return NextResponse.json(data, { status: res.status });
  } catch (e) {
    console.error("Login proxy error:", e);
    return NextResponse.json(
      { result: false, message: "Login failed" },
      { status: 500 }
    );
  }
}