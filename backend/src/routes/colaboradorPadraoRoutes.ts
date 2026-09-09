import { Router } from "express";
import { colaboradorValidation, matriculaValidation } from "../validations/colaboradorValidations.js";
import { validate } from "../middlewares/handleValidation.js";
import { normalizarColaborador } from "../middlewares/normalizarColaborador.js";
import {
  listarColaboradores,
  cadastrarColaborador,
  buscarColaboradorPorMatricula,
  alterarColaborador,
  excluirColaborador,
} from "../controllers/colaboradorController.js";
import { definirCategoria } from "../validations/categoriaValidation.js";

const router = Router();
router.use(definirCategoria("Padrão"));

router.get("/", listarColaboradores);
router.post("/", normalizarColaborador, colaboradorValidation(), validate, cadastrarColaborador);
router.get("/:matricula", matriculaValidation(), validate, buscarColaboradorPorMatricula);
router.put("/:matricula", normalizarColaborador, matriculaValidation(), colaboradorValidation(), validate, alterarColaborador);
router.delete("/:matricula", matriculaValidation(), validate, excluirColaborador);

export default router;
