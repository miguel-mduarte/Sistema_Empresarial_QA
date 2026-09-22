import type { Request, Response, NextFunction } from "express";
import { gerarFolhaIndividualService, gerarFolhaPagamentoService } from "../services/folhaPagamentoService.js";
import { obterRepositorio } from "../data/colaboradorContext.js";

export function gerarFolhaIndividual(req: Request<{ matricula: string }>, res: Response, next: NextFunction) {
  try {
    return res.json(gerarFolhaIndividualService(obterRepositorio(req.app), req.params.matricula));
  } catch (error) {
    return next(error);
  }
}

export function gerarFolhaPagamento(req: Request, res: Response, next: NextFunction) {
  try {
    return res.json(gerarFolhaPagamentoService(obterRepositorio(req.app)));
  } catch (error) {
    return next(error);
  }
}
