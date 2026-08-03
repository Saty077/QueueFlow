"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import { logout } from "@/store/authSlice";
import { clearUserFromStorage } from "@/lib/authStorage";
import api from "@/lib/axios";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isLoading, isAuthenticated, router]);

  const handleLogout = async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearUserFromStorage();
      dispatch(logout());
      router.push("/login");
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div>
      <header style={styles.header}>
        <span style={styles.brand}>QueueFlow</span>
        <nav style={styles.nav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/tasks">Tasks</a>
        </nav>
        <div style={styles.userArea}>
          <span>
            {user?.name} ({user?.role})
          </span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </header>
      <main style={styles.main}>{children}</main>
    </div>
  );
}

const styles = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 24px",
    borderBottom: "1px solid #ddd",
  },
  brand: { fontWeight: 600 },
  nav: { display: "flex", gap: "16px" },
  userArea: { display: "flex", alignItems: "center", gap: "12px" },
  logoutBtn: {
    padding: "6px 12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
  },
  main: { padding: "24px" },
};
