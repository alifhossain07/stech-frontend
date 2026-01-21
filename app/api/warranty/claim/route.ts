
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

    const backendUrl = `${apiBase}/warranty/claim`;
    console.log("Proxy Request URL:", backendUrl);
    console.log("Proxy Request Body:", JSON.stringify(body));

    const res = await fetch(backendUrl, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    console.log("Proxy Response Status:", res.status);
    const responseText = await res.text();
    console.log("Proxy Response Text:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch {
      return NextResponse.json(
        { result: false, message: "Backend communication error" },
        { status: res.status }
      );
    }

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error("Warranty Claim Proxy Error:", error);
    return NextResponse.json(
      { result: false, message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
