"use client";

import { useQuery } from "@tanstack/react-query";
import api from "@/lib/axios";
import StatCard from "@/components/StatCard";
import type { DashboardStatsResponse } from "@/types/task";

export default function DashboardPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: () =>
      api.get<DashboardStatsResponse>("/tasks/stats").then((res) => res.data),
    refetchInterval: 5000, // queue counts change as jobs process, poll for it
  });

  if (isLoading) return <p>Loading stats...</p>;
  if (isError || !data) return <p>Couldn&apos;t load dashboard stats.</p>;

  const { stats, queue } = data;

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Dashboard</h1>

      <h2 style={styles.sectionTitle}>Tasks</h2>
      <div style={styles.grid}>
        <StatCard label="Total" value={stats.total} />
        <StatCard label="Pending" value={stats.pending} />
        <StatCard label="Processing" value={stats.processing} />
        <StatCard label="Completed" value={stats.completed} />
        <StatCard label="Failed" value={stats.failed} />
      </div>

      <h2 style={styles.sectionTitle}>Queue</h2>
      <div style={styles.grid}>
        <StatCard label="Waiting" value={queue.waiting} />
        <StatCard label="Active" value={queue.active} />
      </div>
    </div>
  );
}

const styles = {
  sectionTitle: { fontSize: "16px", color: "#666", marginBottom: "8px" },
  grid: {
    display: "flex",
    gap: "12px",
    marginBottom: "24px",
    flexWrap: "wrap" as const,
  },
};
