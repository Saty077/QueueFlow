export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  owner: string;
  jobId?: string;
  result?: string;
  error?: string;
  retryCount: number;
  scheduledFor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TasksResponse {
  success: boolean;
  tasks: Task[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface TaskResponse {
  success: boolean;
  task: Task;
}

export interface DashboardStatsResponse {
  success: boolean;
  stats: {
    total: number;
    completed: number;
    failed: number;
    pending: number;
    processing: number;
  };
  queue: {
    waiting: number;
    active: number;
  };
}
