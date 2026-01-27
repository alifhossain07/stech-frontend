import { NextRequest, NextResponse } from "next/server";
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

        const response = await fetch(`${API_BASE}/dealer/upcoming-products`, {
            method: "GET",
            headers,
            cache: 'no-store'
        });

        const json = await response.json();
        return NextResponse.json(
            { success: true, data: json },
            { status: response.status }
        );
    } catch (error) {
        console.log("Error fetching upcoming products:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch upcoming products" },
            { status: 500 }
        );
    }
}
