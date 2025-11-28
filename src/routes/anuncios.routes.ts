import { Router } from "express";
import { criar, listar, visualizar, like, search } from "../controllers/anuncios.controller";
import authMiddleware from "../middlewares/auth.middleware";

const router = Router();

router.get("/:termoBusca/search", search);
router.get("/", listar);
router.get("/:id", visualizar);

router.post("/", authMiddleware, criar);
router.post("/:anuncioId/like/:userId", authMiddleware, (req, res) => {
  // Pass explicit ids from params
  like(
    { ...req, params: { ...req.params, id: req.params.anuncioId } }, 
    res
  );
});

export default router;
