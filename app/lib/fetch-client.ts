/**
 * Fetch wrapper that automatically includes Bearer token from localStorage
 * when making API requests to Next.js API routes
 */
export async function fetchWithAuth(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  // Only add token on client side
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("sannai_auth_token");
    
    const headers = new Headers(options.headers);
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    
    return fetch(url, {
      ...options,
      headers,
    });
  }
  
  // Server side - just pass through
  return fetch(url, options);
}

