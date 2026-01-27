// app/lib/get-scripts.ts

const API_BASE = process.env.API_BASE!;
const SYSTEM_KEY = process.env.SYSTEM_KEY!;

/**
 * Core function to fetch all settings from the external backend.
 * Used by Metadata and other server components.
 */
export async function fetchBusinessSettings() {
  try {
    const headers: Record<string, string> = {
      "Accept": "application/json",
      "System-Key": SYSTEM_KEY,
    };

    const res = await fetch(`${API_BASE}/business-settings`, {
      method: "GET",
      headers,
      next: { revalidate: 0 } 
    });

    if (!res.ok) {
        console.error(`Backend settings fetch failed: ${res.status}`);
        return null;
    }

    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        console.error(`Unexpected content-type: ${contentType}`);
        return null;
    }

    try {
      const result = await res.json();
      // Return the array regardless of whether it's nested in .data or not
      return Array.isArray(result) ? result : (result && result.data) || [];
    } catch (jsonError) {
      console.error("Failed to parse settings JSON:", jsonError);
      return null;
    }
  } catch (error) {
    console.error("Settings fetch error:", error);
    return null;
  }
}

/**
 * Specifically extracts and formats the scripts for the Layout.
 */
export async function fetchScriptsInternal() {
  const settingsArray = await fetchBusinessSettings();
  
  if (!settingsArray || !Array.isArray(settingsArray)) {
    return { header_script: "", footer_script: "" };
  }

  interface Setting {
    type?: string;
    key?: string;
    value?: string;
  }

  // Use 'type' or 'key' based on your backend response structure
  let headerScript = settingsArray.find((s: Setting) => s.type === "header_script" || s.key === "header_script")?.value || "";
  let footerScript = settingsArray.find((s: Setting) => s.type === "footer_script" || s.key === "footer_script")?.value || "";

  // Safety check: If the script is just the website name or looks like HTML error, ignore it
  const isInvalid = (s: string) => !s || s.trim().length < 5 || s.includes("<!DOCTYPE") || s.includes("<html");
  
  if (isInvalid(headerScript)) {
    if (headerScript) console.warn("Invalid header script detected (likely non-JS data from local API):", headerScript.substring(0, 50) + "...");
    headerScript = "";
  }
  if (isInvalid(footerScript)) {
    if (footerScript) console.warn("Invalid footer script detected (likely non-JS data from local API):", footerScript.substring(0, 50) + "...");
    footerScript = "";
  }

  return {
    header_script: headerScript,
    footer_script: footerScript,
  };
}