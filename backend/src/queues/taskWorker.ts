import { Worker, Job } from "bullmq";
import redisConnection from "../config/redis";
import Task from "../models/Task";

interface TaskJobData {
  taskId: string;
}

const processTask = async (job: Job<TaskJobData>) => {
  const { taskId } = job.data;

  await Task.findByIdAndUpdate(taskId, { status: "processing" });

  const delay = Math.floor(Math.random() * 3000) + 1000;
  await new Promise((resolve) => setTimeout(resolve, delay));

  if (Math.random() < 0.15) {
    throw new Error("Task processing failed (simulated)");
  }

  await Task.findByIdAndUpdate(taskId, {
    status: "completed",
    result: "Task completed successfully",
  });
};

const taskWorker = new Worker<TaskJobData>("taskQueue", processTask, {
  connection: redisConnection,
  concurrency: 5,
});

taskWorker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

taskWorker.on("failed", async (job, err) => {
  console.error(`Job ${job?.id} failed:`, err.message);
  if (job) {
    await Task.findByIdAndUpdate(job.data.taskId, {
      status: "failed",
      error: err.message,
    });
  }
});

export default taskWorker;
