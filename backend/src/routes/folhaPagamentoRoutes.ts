import { Router } from "express";
import { gerarFolhaPagamento } from "../controllers/folhaPagamentoController.js";

const router = Router();
router.get("/", gerarFolhaPagamento);

export default router;
