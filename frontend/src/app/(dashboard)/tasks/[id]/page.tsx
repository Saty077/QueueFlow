"use client";

import { useState, FormEvent, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { TaskResponse } from "@/types/task";

export default function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["task", id],
    queryFn: () =>
      api.get<TaskResponse>(`/tasks/${id}`).then((res) => res.data),
  });

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (data?.task) {
      setTitle(data.task.title);
      setDescription(data.task.description || "");
    }
  }, [data]);

  const updateMutation = useMutation({
    mutationFn: () =>
      api.patch<TaskResponse>(`/tasks/${id}`, { title, description }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const retryMutation = useMutation({
    mutationFn: () => api.post(`/tasks/${id}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["task", id] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
      router.push("/tasks");
    },
  });

  const handleSave = (e: FormEvent) => {
    e.preventDefault();
    updateMutation.mutate();
  };

  if (isLoading) return <p>Loading task...</p>;
  if (isError || !data) return <p>Task not found.</p>;

  const task = data.task;

  return (
    <div style={styles.wrap}>
      <a href="/tasks">&larr; Back to tasks</a>
      <h1>{task.title}</h1>
      <p style={styles.meta}>
        Status: <strong>{task.status}</strong> · Retries: {task.retryCount} ·
        Created {new Date(task.createdAt).toLocaleString()}
      </p>

      {task.result && <p>Result: {task.result}</p>}
      {task.error && <p style={styles.error}>Error: {task.error}</p>}

      <form onSubmit={handleSave} style={styles.form}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={styles.textarea}
        />
        <button
          type="submit"
          disabled={updateMutation.isPending}
          style={styles.button}
        >
          {updateMutation.isPending ? "Saving..." : "Save changes"}
        </button>
      </form>

      <div style={styles.actionsRow}>
        {task.status === "failed" && (
          <button
            onClick={() => retryMutation.mutate()}
            disabled={retryMutation.isPending}
            style={styles.button}
          >
            {retryMutation.isPending ? "Retrying..." : "Retry task"}
          </button>
        )}
        <button
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
          style={styles.btnDanger}
        >
          Delete task
        </button>
      </div>
    </div>
  );
}

const styles = {
  wrap: { maxWidth: "500px" },
  meta: { fontSize: "13px", color: "#666" },
  error: { color: "#dc2626" },
  form: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "8px",
    margin: "16px 0",
  },
  input: { padding: "8px", border: "1px solid #ccc", borderRadius: "4px" },
  textarea: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    minHeight: "80px",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    background: "#171717",
    color: "#fff",
    cursor: "pointer",
    width: "fit-content",
  },
  actionsRow: { display: "flex", gap: "8px", marginTop: "8px" },
  btnDanger: {
    padding: "8px 16px",
    border: "1px solid #dc2626",
    borderRadius: "4px",
    background: "#fff",
    color: "#dc2626",
    cursor: "pointer",
  },
};
