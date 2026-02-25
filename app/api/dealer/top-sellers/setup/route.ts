import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const headers: Record<string, string> = {
            "System-Key": SYSTEM_KEY,
            Accept: "application/json",
        };

        const response = await fetch(`${API_BASE}/dealer/top-sellers/setup`, {
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
        console.log("Error fetching top sellers setup:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch top sellers setup" },
            { status: 500 }
        );
    }
}
