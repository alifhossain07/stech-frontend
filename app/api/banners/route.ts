import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = "http://sannai.test/api/v2";
const SYSTEM_KEY =
  "$2y$10$0oj5nwGr0flo5Udh49U3o.SqzgNNA7K4N0.rIRPloMM0ANtfk7PJK";

type Banner = {
  id?: number;
  photo: string;
  url?: string;
  position: number | string;
};

type Slider = {
  id?: number;
  photo: string;
};

export async function GET() {
  try {
    const [bannersRes, slidersRes] = await Promise.all([
      axios.get(`${API_BASE}/banners`, {
        headers: { "System-Key": SYSTEM_KEY },
      }),
      axios.get(`${API_BASE}/sliders`, {
        headers: { "System-Key": SYSTEM_KEY },
      }),
    ]);

    const banners: Banner[] = bannersRes.data.data || [];
    const sliders: Slider[] = slidersRes.data.data || [];

    return NextResponse.json({
      success: true,
      sliders,
      rightBanners: banners.filter((b) => Number(b.position) === 1),
      leftBanners: banners.filter((b) => Number(b.position) === 2),
      bottomBanners: banners.filter((b) => Number(b.position) === 3),
    });
  } catch (err: unknown) {
    // Type narrowing for AxiosError
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data ?? err.message,
        },
        { status: 500 }
      );
    }

    // Non-Axios error (fallback)
    return NextResponse.json(
      {
        success: false,
        error: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
