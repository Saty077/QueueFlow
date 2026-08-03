import type { AuthUser } from "@/store/authSlice";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  user: AuthUser;
}
