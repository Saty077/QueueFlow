import type { AuthUser } from "@/store/authSlice";

const USER_KEY = "queueflow_user";

export function saveUserToStorage(user: AuthUser): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserFromStorage(): AuthUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearUserFromStorage(): void {
  localStorage.removeItem(USER_KEY);
}
