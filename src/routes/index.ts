import { Router } from "express";
import authRoutes from "./auth.routes";
import anuncioRoutes from "./anuncios.routes";

const router = Router();

router.use("/auth", authRoutes);
router.use("/post", anuncioRoutes);

export default router;
