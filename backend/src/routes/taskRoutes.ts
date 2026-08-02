import { Router } from "express";
import { protect } from "../middlewares/authMiddleware";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
  retryTask,
  getDashboardStats,
} from "../controllers/taskController";

const router = Router();

router.use(protect);

// /stats has to sit above /:id, otherwise Express matches "stats" as an :id param
router.get("/stats", getDashboardStats);

router.post("/", createTask);
router.get("/", getTasks);
router.get("/:id", getTaskById);
router.patch("/:id", updateTask);
router.delete("/:id", deleteTask);
router.post("/:id/retry", retryTask);

export default router;
