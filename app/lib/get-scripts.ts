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
        console.error(`Backend fetch failed: ${res.status}`);
        return null;
    }

    const result = await res.json();
    // Return the array regardless of whether it's nested in .data or not
    return Array.isArray(result) ? result : result.data || [];
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
  const headerScript = settingsArray.find((s: Setting) => s.type === "header_script" || s.key === "header_script")?.value || "";
  const footerScript = settingsArray.find((s: Setting) => s.type === "footer_script" || s.key === "footer_script")?.value || "";

  return {
    header_script: headerScript,
    footer_script: footerScript,
  };
}