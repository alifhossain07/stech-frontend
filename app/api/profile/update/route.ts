import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

/**
 * POST /api/profile/update
 * Updates user profile information
 * 
 * Headers:
 * - Authorization: Bearer {token} (required)
 * 
 * Body:
 * {
 *   "name": "Meherab",
 *   "phone": "01234567892",  // optional
 *   "password": "123456789"  // optional
 * }
 * 
 * Backend: POST /api/v2/profile/update
 */
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

        // Extract Bearer token from Authorization header
        const bearerToken = getBearerToken(req);
        if (!bearerToken) {
            return NextResponse.json(
                { result: false, message: "Authorization token required" },
                { status: 401 }
            );
        }

        const payload = await req.json();

        // Call backend API: POST /api/v2/profile/update
        const res = await fetch(`${apiBase}/profile/update`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "System-Key": systemKey,
                "Authorization": `Bearer ${bearerToken}`,
                "Accept": "application/json",
            },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (e) {
        console.error("Profile update proxy error:", e);
        return NextResponse.json(
            { result: false, message: "Profile update failed" },
            { status: 500 }
        );
    }
}
