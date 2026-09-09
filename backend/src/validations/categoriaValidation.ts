import type { RequestHandler } from "express";
import type { TipoColaborador } from "../models/colaboradorTypes.js";

export function definirCategoria(tipo: TipoColaborador): RequestHandler {
  return (_req, res, next) => {
    res.locals.tipoColaborador = tipo;
    next();
  };
}
