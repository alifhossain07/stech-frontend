
import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

export const dynamic = "force-dynamic";

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

     const bearerToken = getBearerToken(req);
    
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
        "System-Key": systemKey,
        "Accept": "application/json",
    };
     if (bearerToken) {
        headers["Authorization"] = `Bearer ${bearerToken}`;
    }

    const body = await req.json();

    const res = await fetch(`${apiBase}/warranty/my-claims`, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Fetch My Claims Proxy Error:", error);
    return NextResponse.json(
      { result: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
