import type { RequestHandler } from "express";
import { validationResult } from "express-validator";

export const validate: RequestHandler = (req, res, next) => {
  const resultado = validationResult(req);
  if (resultado.isEmpty()) return next();

  const errors = resultado.array({ onlyFirstError: true }).map((erro) => ({
    campo: erro.type === "field" ? erro.path : "",
    mensagem: String(erro.msg),
  }));
  return res.status(400).json({ mensagem: errors[0].mensagem, errors });
};
