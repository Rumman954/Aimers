const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "aimers_token";

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

type ApiOptions = {
  method?: string;
  body?: unknown;
  token?: string | null;
  auth?: boolean;
};

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export async function api<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const token = options.token ?? (options.auth === false ? null : getToken());
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new ApiError(
      (data as { message?: string }).message || "Request failed",
      res.status
    );
  }

  return data as T;
}

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatar?: string;
};

export type AuthResponse = {
  success: boolean;
  token: string;
  user: AuthUser;
};

export type CourseApi = {
  id: string;
  _id?: string;
  title: string;
  shortDescription: string;
  fullDescription?: string;
  price: number;
  category: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  thumbnail: string;
  images?: string[];
  rating: number;
  reviewCount: number;
  instructorName: string;
  instructorId?: string;
  students?: number;
  tags?: string[];
  status?: string;
};

export type CourseListResponse = {
  success: boolean;
  data: CourseApi[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
};
