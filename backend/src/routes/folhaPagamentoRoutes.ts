import { Router } from "express";
import { gerarFolhaIndividual, gerarFolhaPagamento } from "../controllers/folhaPagamentoController.js";
import { matriculaValidation } from "../validations/colaboradorValidations.js";
import { validate } from "../middlewares/handleValidation.js";

const router = Router();
router.get("/", gerarFolhaPagamento);
router.get("/:matricula", matriculaValidation(), validate, gerarFolhaIndividual);

export default router;
