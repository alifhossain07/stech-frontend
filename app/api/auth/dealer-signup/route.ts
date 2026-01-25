import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: NextRequest) {
  try {
    const apiBase = process.env.API_BASE;
    let systemKey = process.env.SYSTEM_KEY;

    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: "API_BASE or SYSTEM_KEY not configured" },
        { status: 500 }
      );
    }

    // Clean up SYSTEM_KEY (remove literal backslashes if present from .env)
    systemKey = systemKey.replace(/\\/g, '');

    const formData = await req.formData();

    try {
      const response = await axios.post(`${apiBase}/auth/signup`, formData, {
        headers: {
          "System-Key": systemKey,
          "Accept": "*/*",
          "User-Agent": "PostmanRuntime/7.51.0",
          "Accept-Encoding": "gzip, deflate, br",
          "Connection": "keep-alive",
          "X-Requested-With": "XMLHttpRequest",
        },
      });

      console.log("Dealer signup backend success:", response.data);
      return NextResponse.json(response.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        console.error("Dealer signup backend error status:", err.response?.status);
        console.error("Dealer signup backend error headers:", err.response?.headers);
        console.error("Dealer signup backend error body:", JSON.stringify(err.response?.data, null, 2));
        
        // If the response is HTML (like the 406 page), log a snippet
        if (typeof err.response?.data === 'string' && err.response.data.includes('<!DOCTYPE html>')) {
             console.error("Backend returned HTML error page.");
        }

        return NextResponse.json(
          err.response?.data || { result: false, message: "Backend error" },
          { status: err.response?.status || 500 }
        );
      }
      throw err;
    }
  } catch (err: any) {
    console.error("Dealer signup proxy critical error:", err.message);
    return NextResponse.json(
      { result: false, message: "Dealer signup failed", error: err.message },
      { status: 500 }
    );
  }
}