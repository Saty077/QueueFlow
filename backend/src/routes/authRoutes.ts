import { Router } from "express";
import {
  register,
  login,
  refresh,
  logout,
} from "../controllers/authController";
import { protect, authorize } from "../middlewares/authMiddleware";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);

// router.get("/me", protect, getMe);
// router.get("/admin-only", protect, authorize("admin"), adminOnly);

export default router;
