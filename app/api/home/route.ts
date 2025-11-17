import { NextResponse } from "next/server";

const API_BASE = "http://sannai.test/api/v2";
const SYSTEM_KEY =
  "$2y$10$0oj5nwGr0flo5Udh49U3o.SqzgNNA7K4N0.rIRPloMM0ANtfk7PJK";

// ---- TYPE DEFINITIONS ----
type LaravelResponse<T> = {
  data?: T;
  success?: boolean;
  message?: string;
};

type Banner = {
  id: number;
  image: string;
  position: number | string;
};

type Slider = {
  id: number;
  image: string;
};

// ---- FIXED FUNCTION (typed properly) ----
async function fetchFromLaravel<T>(endpoint: string): Promise<LaravelResponse<T>> {
  const res = await fetch(`${API_BASE}/${endpoint}`, {
    headers: {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
    },
    cache: "no-store",
  });

  return res.json();
}

export async function GET() {
  try {
    const [bannersRes, slidersRes] = await Promise.all([
      fetchFromLaravel<Banner[]>("banners"),
      fetchFromLaravel<Slider[]>("sliders"),
    ]);

    const banners = Array.isArray(bannersRes.data) ? bannersRes.data : [];
    const sliders = Array.isArray(slidersRes.data) ? slidersRes.data : [];

    const rightBanners = banners.filter(
      (b) => Number(b.position) === 1
    );

    return NextResponse.json({
      sliders,
      rightBanners,
      success: true,
    });

  } catch (error) {
    // error is unknown → fix by casting to Error
    const message = error instanceof Error ? error.message : "Unknown error";

    return NextResponse.json(
      { success: false, error: message },
      { status: 500 }
    );
  }
}
