import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export async function GET() {
    try {
        const res = await fetch(`${API_BASE}/pages/about-us`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                // adjust header name if your backend expects a different one
                "System-Key": SYSTEM_KEY,
            },
            cache: "no-store",
        });

        if (!res.ok) {
            return NextResponse.json(
                { result: false, message: "Failed to fetch About Us page" },
                { status: res.status }
            );
        }

        const data = await res.json();

        return NextResponse.json(data);
    } catch {
        return NextResponse.json(
            { result: false, message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
