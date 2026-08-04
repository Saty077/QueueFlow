import Link from "next/link";
import type { Task } from "@/types/task";

const statusColors: Record<string, string> = {
  pending: "#f59e0b",
  processing: "#3b82f6",
  completed: "#16a34a",
  failed: "#dc2626",
};

export default function TaskCard({
  task,
  onRetry,
  onDelete,
}: {
  task: Task;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div style={styles.card}>
      <div>
        <Link href={`/tasks/${task._id}`}>{task.title}</Link>
        <p style={styles.date}>{new Date(task.createdAt).toLocaleString()}</p>
      </div>
      <div style={styles.actions}>
        <span
          style={{ ...styles.badge, background: statusColors[task.status] }}
        >
          {task.status}
        </span>
        {task.status === "failed" && (
          <button onClick={() => onRetry(task._id)} style={styles.btn}>
            Retry
          </button>
        )}
        <button onClick={() => onDelete(task._id)} style={styles.btnDanger}>
          Delete
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    border: "1px solid #ddd",
    borderRadius: "8px",
    padding: "12px 16px",
    marginBottom: "8px",
  },

  date: { margin: "4px 0 0", fontSize: "12px", color: "#666" },
  actions: { display: "flex", alignItems: "center", gap: "8px" },
  badge: {
    color: "#fff",
    fontSize: "12px",
    padding: "4px 8px",
    borderRadius: "4px",
    textTransform: "capitalize" as const,
  },
  btn: {
    padding: "6px 10px",
    fontSize: "12px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    background: "#fff",
    cursor: "pointer",
    color: "black",
  },
  btnDanger: {
    padding: "6px 10px",
    fontSize: "12px",
    border: "1px solid #dc2626",
    borderRadius: "4px",
    background: "#fff",
    color: "#dc2626",
    cursor: "pointer",
  },
};
