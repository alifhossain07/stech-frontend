import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const bearerToken = getBearerToken(req);
    
    const headers: Record<string, string> = {
      "System-Key": SYSTEM_KEY,
      Accept: "application/json",
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const response = await axios.get(`${API_BASE}/camping-offers`, {
      headers,
    });

    return NextResponse.json(response.data);
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data ?? err.message,
        },
        { status: err.response?.status || 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
