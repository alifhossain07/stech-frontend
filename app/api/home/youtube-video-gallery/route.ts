import { NextResponse } from "next/server";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await fetch(`${API_BASE}/home/youtube-video-gallery`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          error: data?.message || "Failed to fetch youtube video gallery",
          data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error("YouTube Video Gallery API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch youtube video gallery" },
      { status: 500 }
    );
  }
}
