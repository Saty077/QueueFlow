"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import api from "@/lib/axios";
import { useAppDispatch } from "@/store/hooks";
import { setCredentials } from "@/store/authSlice";
import { saveUserToStorage } from "@/lib/authStorage";
import type { LoginPayload, AuthResponse } from "@/types/auth";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [form, setForm] = useState<LoginPayload>({ email: "", password: "" });
  const [error, setError] = useState("");

  const loginMutation = useMutation({
    mutationFn: (payload: LoginPayload) =>
      api.post<AuthResponse>("/auth/login", payload).then((res) => res.data),
    onSuccess: (data) => {
      dispatch(
        setCredentials({ user: data.user, accessToken: data.accessToken }),
      );
      saveUserToStorage(data.user);
      router.push("/dashboard");
    },
    onError: (err: AxiosError<{ message: string }>) => {
      setError(err.response?.data?.message || "Login failed");
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError("");
    loginMutation.mutate(form);
  };

  return (
    <div style={styles.page}>
      <form onSubmit={handleSubmit} style={styles.card}>
        <h1 style={styles.title}>Log in</h1>

        {error && <p style={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          style={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          style={styles.input}
          required
        />
        <button
          type="submit"
          disabled={loginMutation.isPending}
          style={styles.button}
        >
          {loginMutation.isPending ? "Logging in..." : "Log in"}
        </button>

        <p style={styles.footerText}>
          No account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

const styles = {
  page: {
    display: "flex",
    minHeight: "100vh",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: "360px",
    padding: "24px",
    border: "1px solid #ddd",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  title: { margin: 0, fontSize: "20px" },
  error: { color: "#dc2626", fontSize: "14px", margin: 0 },
  input: {
    padding: "10px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
  },
  button: {
    padding: "10px",
    border: "none",
    borderRadius: "4px",
    background: "#171717",
    color: "#fff",
    fontSize: "14px",
    cursor: "pointer",
  },
  footerText: { fontSize: "14px", margin: 0 },
};
