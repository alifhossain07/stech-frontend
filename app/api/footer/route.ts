import { NextRequest, NextResponse } from "next/server";
import { getBearerToken } from "@/app/lib/auth-utils";

const API_BASE = process.env.API_BASE;
const SYSTEM_KEY = process.env.SYSTEM_KEY;

interface BusinessSetting {
  type: string;
  // value can be string, array, object, null, etc.
  // We keep it as-is from the backend.
  value: unknown;
}

interface BusinessSettingsResponse {
  data: BusinessSetting[];
}

type FooterField =
  | "footer_logo"
  | "about_us_description"
  | "frontend_copyright_text"
  | "app_store_link"
  | "play_store_link"
  | "show_social_links"
  | "facebook_link"
  | "twitter_link"
  | "instagram_link"
  | "youtube_link"
  | "widget_one_labels"
  | "widget_one_links"
  | "helpline_number"
  | "contact_address"
  | "contact_email";

const FOOTER_FIELDS = new Set<FooterField>([
  "footer_logo",
  "about_us_description",
  "frontend_copyright_text",
  "app_store_link",
  "play_store_link",
  "show_social_links",
  "facebook_link",
  "twitter_link",
  "instagram_link",
  "youtube_link",
  "widget_one_labels",
  "widget_one_links",
  "contact_address",
  "contact_email",
]);

function isFooterField(type: string): type is FooterField {
  return FOOTER_FIELDS.has(type as FooterField);
}

export async function GET(req: NextRequest) {
  try {
    if (!API_BASE || !SYSTEM_KEY) {
      return NextResponse.json(
        { success: false, error: "API_BASE or SYSTEM_KEY is missing" },
        { status: 500 }
      );
    }

    // Extract Bearer token from Authorization header (returns null for guest users)
    const bearerToken = getBearerToken(req);
    
    // Build headers
    const headers: Record<string, string> = {
      Accept: "application/json",
      "System-Key": SYSTEM_KEY,
      ...(bearerToken && { Authorization: `Bearer ${bearerToken}` }),
    };

    const res = await fetch(`${API_BASE}/business-settings`, {
      method: "GET",
      headers,
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to fetch business settings",
          status: res.status,
        },
        { status: res.status }
      );
    }

    const json: BusinessSettingsResponse = await res.json();

    const footerData: Partial<Record<FooterField, unknown>> = {};

    if (Array.isArray(json.data)) {
      for (const setting of json.data) {
        if (isFooterField(setting.type)) {
          // Keep the value exactly as provided by the backend
          footerData[setting.type] = setting.value;
        }

        // Map backend contact_phone to helpline_number for the frontend footer
        if (setting.type === "contact_phone") {
          footerData.helpline_number = setting.value;
        }
      }
    }

    return NextResponse.json({ success: true, data: footerData });
  } catch (error) {
    console.error("Footer settings API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
