import type { Request, Response, NextFunction } from "express";
import { gerarFolhaPagamentoService } from "../services/folhaPagamentoService.js";
import { obterRepositorio } from "../data/colaboradorContext.js";

export function gerarFolhaPagamento(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(gerarFolhaPagamentoService(obterRepositorio(req.app)));
  } catch (error) {
    return next(error);
  }
}
