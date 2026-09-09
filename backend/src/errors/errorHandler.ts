import type { ErrorRequestHandler } from "express";
import ErroDeNegocio from "./erroDeNegocio.js";

const errorHandler: ErrorRequestHandler = (error: unknown, req, res, next) => {
  if (res.headersSent) return next(error);
  if (error instanceof SyntaxError && "status" in error && error.status === 400 && "body" in error) {
    return res.status(400).json({ mensagem: "O corpo da requisição contém JSON inválido." });
  }
  if (error instanceof ErroDeNegocio) {
    return res.status(error.statusCode).json({ mensagem: error.message });
  }
  return res.status(500).json({ mensagem: "Não foi possível acessar o arquivo JSON de colaboradores." });
};

export default errorHandler;
