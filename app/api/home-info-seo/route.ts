import { NextResponse } from "next/server";

// Get API base URL and System Key from environment variables
const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

type InfoRow = Record<string, string>;

export async function GET() {
  try {
    const res = await fetch(`${API_BASE}/home-bottom-info`, {
      headers: {
        Accept: "application/json",
        "System-Key": SYSTEM_KEY,
      },
      cache: "no-store",
    });

    const seoJson = await res.json();

   if (seoJson?.data?.[0]?.info_rows) {
  const infoRows = seoJson.data[0].info_rows.map((item: InfoRow) => {
    const titleKey = Object.keys(item).find(key =>
      key.startsWith("title_")
    );

    const paragraphKey = Object.keys(item).find(key =>
      key.startsWith("paragraph_")
    );

    return {
      title: titleKey ? item[titleKey] : "",
      paragraph: paragraphKey ? item[paragraphKey] : "",
    };
  });

  return NextResponse.json({
    success: true,
    banner: seoJson.data[0].banner ?? "",
    rows: infoRows,
  });
}

    return NextResponse.json(
      { success: false, error: "Failed to load home bottom info data" },
      { status: 500 }
    );
  } catch (error) {
    console.error("Home Bottom INFO API error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load home bottom info data" },
      { status: 500 }
    );
  }
}