// src/api/routes/v1/index.ts
import { Router } from "express";
import adminRoutes from "./admin/index";
import publicRoutes from "./public";

const router = Router();

router.use("/admin", adminRoutes);
router.use("/public", publicRoutes);

export default router;