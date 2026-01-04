import { NextRequest, NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function POST(req: NextRequest) {
  try {
    const apiBase = API_BASE;
    const systemKey = SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.content) {
      return NextResponse.json(
        { result: false, message: "Name, email, phone, and content are required" },
        { status: 400 }
      );
    }

    const res = await fetch(`${apiBase}/contact/store`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "System-Key": systemKey,
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: body.name.trim(),
        email: body.email.trim(),
        phone: body.phone.trim(),
        content: body.content.trim(),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Contact form submission error:", error);
    return NextResponse.json(
      { result: false, message: "Failed to submit contact form" },
      { status: 500 }
    );
  }
}

