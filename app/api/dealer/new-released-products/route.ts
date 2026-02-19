import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const dateFilter = searchParams.get("date_filter");

        const headers: Record<string, string> = {
            "System-Key": SYSTEM_KEY,
            Accept: "application/json",
        };

        let url = `${API_BASE}/dealer/new-released-products`;
        if (dateFilter) {
            url += `?date_filter=${dateFilter}`;
        }

        const response = await fetch(url, {
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
        console.log("Error fetching new released products:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch new released products" },
            { status: 500 }
        );
    }
}
