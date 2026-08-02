import { Request, Response } from "express";
import Task from "../models/Task";
import ApiError from "../utils/ApiError";
import wrapAsync from "../utils/wrapAsync";
import { taskQueue } from "../queues/taskQueue";

export const createTask = wrapAsync(async (req: Request, res: Response) => {
  const { title, description, scheduledFor } = req.body;

  if (!title) {
    throw new ApiError(400, "Title is required");
  }

  const task = await Task.create({
    title,
    description,
    owner: req.user!.userId,
    scheduledFor: scheduledFor ? new Date(scheduledFor) : undefined,
  });

  const delay = scheduledFor
    ? Math.max(new Date(scheduledFor).getTime() - Date.now(), 0)
    : 0;

  const job = await taskQueue.add(
    "processTask",
    { taskId: task._id.toString() },
    { delay },
  );

  task.jobId = job.id;
  await task.save();

  res.status(201).json({ success: true, task });
});

export const getTasks = wrapAsync(async (req: Request, res: Response) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Number(req.query.limit) || 10, 50);
  const status = req.query.status as string | undefined;

  const filter: Record<string, unknown> = { owner: req.user!.userId };
  if (status) filter.status = status;

  const [tasks, total] = await Promise.all([
    Task.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Task.countDocuments(filter),
  ]);

  res.status(200).json({
    success: true,
    tasks,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
});

export const getTaskById = wrapAsync(async (req: Request, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    owner: req.user!.userId,
  });
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json({ success: true, task });
});

export const updateTask = wrapAsync(async (req: Request, res: Response) => {
  const { title, description } = req.body;

  const task = await Task.findOne({
    _id: req.params.id,
    owner: req.user!.userId,
  });
  if (!task) throw new ApiError(404, "Task not found");

  if (title) task.title = title;
  if (description !== undefined) task.description = description;

  await task.save();

  res.status(200).json({ success: true, task });
});

export const deleteTask = wrapAsync(async (req: Request, res: Response) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    owner: req.user!.userId,
  });
  if (!task) throw new ApiError(404, "Task not found");
  res.status(200).json({ success: true, message: "Task deleted" });
});

export const retryTask = wrapAsync(async (req: Request, res: Response) => {
  const task = await Task.findOne({
    _id: req.params.id,
    owner: req.user!.userId,
  });
  if (!task) throw new ApiError(404, "Task not found");

  if (task.status !== "failed") {
    throw new ApiError(400, "Only failed tasks can be retried");
  }

  task.status = "pending";
  task.error = undefined;
  task.retryCount += 1;

  const job = await taskQueue.add("processTask", {
    taskId: task._id.toString(),
  });
  task.jobId = job.id;

  await task.save();

  res.status(200).json({ success: true, task });
});

export const getDashboardStats = wrapAsync(
  async (req: Request, res: Response) => {
    const ownerId = req.user!.userId;

    const [total, completed, failed, pending, processing] = await Promise.all([
      Task.countDocuments({ owner: ownerId }),
      Task.countDocuments({ owner: ownerId, status: "completed" }),
      Task.countDocuments({ owner: ownerId, status: "failed" }),
      Task.countDocuments({ owner: ownerId, status: "pending" }),
      Task.countDocuments({ owner: ownerId, status: "processing" }),
    ]);

    const [waiting, active] = await Promise.all([
      taskQueue.getWaitingCount(),
      taskQueue.getActiveCount(),
    ]);

    res.status(200).json({
      success: true,
      stats: { total, completed, failed, pending, processing },
      queue: { waiting, active },
    });
  },
);
