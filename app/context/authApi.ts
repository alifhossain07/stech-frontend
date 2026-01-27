export interface User {
  id: number;
  type: string | null;
  name: string;
  email: string | null;
  avatar: string | null;
  avatar_original: string;
  phone: string;
  email_verified: boolean;
  is_dealer?: number | string;
  dealer_code?: string;
}

export interface AuthResponse {
  result: boolean;
  message: string;
  access_token: string;
  token_type: string;
  expires_at: string | null;
  user: User;
}

export async function signup(payload: {
  name: string;
  register_by: "phone" | "email";
  email_or_phone: string;
  password: string;
  password_confirmation: string;
}): Promise<AuthResponse> {
  const res = await fetch("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Signup failed");
  return res.json();
}

export async function login(payload: {
  login_by: "phone";
  phone: string;
  password: string;
}): Promise<AuthResponse> {
  // Client-side debugging
  console.log("=== CLIENT-SIDE LOGIN DEBUG ===");
  console.log("Login payload:", JSON.stringify(payload, null, 2));
  console.log("Phone value:", payload.phone);
  console.log("Phone type:", typeof payload.phone);
  console.log("===============================");

  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  console.log("API Response status:", res.status);

  const data = await res.json();
  console.log("API Response data:", data);

  // If the response is not ok, throw an error with the backend message
  if (!res.ok || !data.result) {
    const errorMessage = Array.isArray(data.message)
      ? data.message.join(", ")
      : data.message || "Login failed";
    console.error("Login error:", errorMessage);
    throw new Error(errorMessage);
  }

  return data;
}

export async function fetchProfile(access_token: string): Promise<AuthResponse> {
  const res = await fetch("/api/auth/info", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    }
  });
  if (!res.ok) throw new Error("Fetching profile failed");
  return res.json();
}

export async function updateProfile(
  payload: {
    name: string;
    phone?: string;
    password?: string;
  },
  access_token: string
): Promise<AuthResponse> {
  const res = await fetch("/api/profile/update", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Profile update failed");
  return res.json();
}