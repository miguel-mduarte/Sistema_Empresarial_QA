import type { RequestHandler } from "express";
import ErroDeNegocio from "../errors/erroDeNegocio.js";

export const normalizarColaborador: RequestHandler = (req, res, next) => {
  const entrada: unknown = req.body;
  if (typeof entrada !== "object" || entrada === null || Array.isArray(entrada)) return next();
  const dados = entrada as Record<string, unknown>;
  const tipoInformado = dados.tipo ?? dados.tipoColaborador;
  const categoria: unknown = res.locals.tipoColaborador;
  if (categoria && tipoInformado !== undefined && categoria !== tipoInformado) {
    return next(new ErroDeNegocio("O tipo informado não corresponde à rota."));
  }
  req.body = { ...dados, tipo: categoria ?? tipoInformado };
  next();
};
