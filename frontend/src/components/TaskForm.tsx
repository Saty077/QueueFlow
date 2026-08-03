"use client";

import { useState, FormEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import type { TaskResponse } from "@/types/task";

export default function TaskForm() {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const createMutation = useMutation({
    mutationFn: () =>
      api
        .post<TaskResponse>("/tasks", { title, description })
        .then((res) => res.data),
    onSuccess: () => {
      setTitle("");
      setDescription("");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    createMutation.mutate();
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        type="text"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={styles.input}
        required
      />
      <input
        type="text"
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        style={styles.input}
      />
      <button
        type="submit"
        disabled={createMutation.isPending}
        style={styles.button}
      >
        {createMutation.isPending ? "Adding..." : "Add Task"}
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px",
    flexWrap: "wrap" as const,
  },
  input: {
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "14px",
    flex: "1",
    minWidth: "150px",
  },
  button: {
    padding: "8px 16px",
    border: "none",
    borderRadius: "4px",
    background: "#171717",
    color: "#fff",
    cursor: "pointer",
  },
};
