"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/axios";
import TaskForm from "@/components/TaskForm";
import TaskCard from "@/components/TaskCard";
import type { TasksResponse } from "@/types/task";

export default function TasksPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => api.get<TasksResponse>("/tasks").then((res) => res.data),
  });

  const retryMutation = useMutation({
    mutationFn: (id: string) => api.post(`/tasks/${id}/retry`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/tasks/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    },
  });

  return (
    <div>
      <h1 style={{ marginTop: 0 }}>Tasks</h1>

      <TaskForm />

      {isLoading && <p>Loading tasks...</p>}
      {isError && <p>Couldn&apos;t load tasks.</p>}
      {data?.tasks.length === 0 && <p>No tasks yet.</p>}

      {data?.tasks.map((task) => (
        <TaskCard
          key={task._id}
          task={task}
          onRetry={(id) => retryMutation.mutate(id)}
          onDelete={(id) => deleteMutation.mutate(id)}
        />
      ))}
    </div>
  );
}
