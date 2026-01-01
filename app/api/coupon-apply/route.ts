import { NextRequest, NextResponse } from 'next/server';
import { getBearerToken } from "@/app/lib/auth-utils";

export async function POST(request: NextRequest) {
  try {
    const { code } = await request.json();
    
    const apiBase = process.env.API_BASE!; // http://sannai.test/api/v2
    const systemKey = process.env.SYSTEM_KEY!;
    
    if (!apiBase || !systemKey) {
      return NextResponse.json(
        { result: false, message: 'API config missing' },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(request);
    
    // Build headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'System-Key': systemKey,
      Accept: 'application/json',
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    console.log('Calling backend:', `${apiBase}/coupon-apply`); // Debug

    const response = await fetch(`${apiBase}/coupon-apply`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ code: code.toUpperCase() }),
    });

    console.log('Backend status:', response.status); // Debug
    const data = await response.json();

    console.log('Backend response:', data); // Debug

    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Coupon API error:', error);
    return NextResponse.json(
      { result: false, message: 'Coupon validation failed' },
      { status: 500 }
    );
  }
}
