import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getBearerToken } from "@/app/lib/auth-utils";

export async function GET(
    req: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        const { slug } = params;
        const API_BASE = process.env.API_BASE;
        const SYSTEM_KEY = process.env.SYSTEM_KEY;

        if (!API_BASE || !SYSTEM_KEY) {
            return NextResponse.json(
                { success: false, message: "Server configuration error" },
                { status: 500 }
            );
        }

        const bearerToken = getBearerToken(req);

        if (!bearerToken) {
            // If no token, product cannot be in wishlist (assuming user-specific wishlist)
            // Or we can return 200 false.
            // API seems to depend on auth token to identify user.
            return NextResponse.json(
                { is_in_wishlist: false, message: "Unauthorized" },
                { status: 200 } // Return 200 with false state rather than 401 hard error for check
            );
        }

        const headers: Record<string, string> = {
            "System-Key": SYSTEM_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Bearer ${bearerToken}`,
        };

        const response = await axios.get(
            `${API_BASE}/wishlists-check-product/${slug}`,
            {
                headers,
            }
        );

        return NextResponse.json(response.data);
    } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
            // If 404, likely not found/not in wishlist depending on API design,
            // but user example shows successful response structure.
            // If API returns 404 for "not in wishlist", we handle it.
            // Assuming standard error handling.
            console.error(
                `Proxy /api/wishlists/check-product/${params.slug} error:`,
                err.message
            );
            return NextResponse.json(
                {
                    success: false,
                    is_in_wishlist: false,
                    message: err.response?.data?.message || err.message,
                },
                { status: err.response?.status || 500 }
            );
        }

        console.error("Unexpected error:", err);
        return NextResponse.json(
            { success: false, message: "An unexpected error occurred" },
            { status: 500 }
        );
    }
}
