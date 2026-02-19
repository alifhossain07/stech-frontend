import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const month = searchParams.get('month');
        const year = searchParams.get('year');

        const headers: Record<string, string> = {
            "System-Key": SYSTEM_KEY,
            Accept: "application/json",
        };

        let apiUrl = `${API_BASE}/dealer/top-sellers/rankings`;
        const params = new URLSearchParams();
        if (month) params.append('month', month);
        if (year) params.append('year', year);
        if (params.toString()) apiUrl += `?${params.toString()}`;

        const response = await fetch(apiUrl, {
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
        console.log("Error fetching top sellers rankings:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch top sellers rankings" },
            { status: 500 }
        );
    }
}
