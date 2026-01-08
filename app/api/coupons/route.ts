import { NextResponse } from "next/server";

export async function GET() {
    try {
        const res = await fetch(
            `${process.env.API_BASE}/coupon-list`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "System-Key": process.env.SYSTEM_KEY || "",
                },
                cache: "no-store", // always fresh data
            }
        );

        if (!res.ok) {
            return NextResponse.json(
                { success: false, message: "Failed to fetch coupons" },
                { status: res.status }
            );
        }

        const data = await res.json();

        // return everything as-is
        return NextResponse.json(data, { status: 200 });
    } catch {
        return NextResponse.json(
            { success: false, message: "Server error" },
            { status: 500 }
        );
    }
}
