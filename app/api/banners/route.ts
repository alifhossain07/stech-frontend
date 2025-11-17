import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("http://sannai.test/api/v2/banners", {
      headers: {
        Accept: "application/json",
        "System-Key": "$2y$10$0oj5nwGr0flo5Udh49U3o.SqzgNNA7K4N0.rIRPloMM0ANtfk7PJK",
      },
      cache: "no-store",
    });

    const json = await res.json();

    // Ensure data always exists as array
    const data = Array.isArray(json.data) ? json.data : [];

    return NextResponse.json(data);
  } catch {
    return NextResponse.json([], { status: 500 });
  }
}
