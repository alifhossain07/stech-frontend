import { NextResponse } from "next/server";
import axios from "axios";

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

// Types
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

type BottomBannerIcon = {
  photo: string;
  link: string | null;
};

type HomeBottomBanner = {
  image: string;
  title: string;
  subtitle: string;
  icons: BottomBannerIcon[];
};

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [bannersRes, slidersRes, bottomBannerRes] = await Promise.all([
      axios.get(`${API_BASE}/banners`, {
        headers: { "System-Key": SYSTEM_KEY },
      }),
      axios.get(`${API_BASE}/sliders`, {
        headers: { "System-Key": SYSTEM_KEY },
      }),
      axios.get(`${API_BASE}/home-bottom-banner`, {
        headers: { "System-Key": SYSTEM_KEY },
      }),
    ]);

    const banners: Banner[] = bannersRes.data.data || [];
    const sliders: Slider[] = slidersRes.data.data || [];
    const bottomBanner: HomeBottomBanner | null =
      bottomBannerRes.data.data?.[0] ?? null;

    return NextResponse.json({
      success: true,
      sliders,
      rightBanners: banners.filter((b) => Number(b.position) === 1),
      leftBanners: banners.filter((b) => Number(b.position) === 2),
      bottomBanners: banners.filter((b) => Number(b.position) === 3),

      // ✨ New Section Returned
      homeBottomBanner: bottomBanner,
    });
  } catch (err) {
    if (axios.isAxiosError(err)) {
      return NextResponse.json(
        {
          success: false,
          error: err.response?.data ?? err.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Unknown error occurred",
      },
      { status: 500 }
    );
  }
}
