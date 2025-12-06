export interface User {
  id: number;
  type: string | null;
  name: string;
  email: string | null;
  avatar: string | null;
  avatar_original: string;
  phone: string;
  email_verified: boolean;
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
  login_by: "phone" | "email";
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Login failed");
  return res.json();
}

export async function fetchProfile(access_token: string): Promise<AuthResponse> {
  const res = await fetch("/api/auth/info", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ access_token }),
  });
  if (!res.ok) throw new Error("Fetching profile failed");
  return res.json();
}