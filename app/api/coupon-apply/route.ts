import { NextRequest, NextResponse } from 'next/server';

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

    console.log('Calling backend:', `${apiBase}/coupon-apply`); // Debug

    const response = await fetch(`${apiBase}/coupon-apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Try these headers - test which one works:
        'Authorization': `Bearer ${systemKey}`,
        'X-API-Key': systemKey,
        'System-Key': systemKey, // Common custom header
      },
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
