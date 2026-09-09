import type { Request, Response, NextFunction } from "express";
import {
  cadastrarColaboradorService,
  listarColaboradoresService,
  buscarColaboradorPorMatriculaService,
  alterarColaboradorService,
  excluirColaboradorService,
  verificarTipoColaboradorService,
} from "../services/colaboradorService.js";
import { obterRepositorio } from "../data/colaboradorContext.js";
import { matchedData } from "express-validator";
import type { DadosColaborador, TipoColaborador } from "../models/colaboradorTypes.js";
import ErroDeNegocio from "../errors/erroDeNegocio.js";

type ColaboradorRequest = Request<{ matricula: string }, unknown, unknown>;
type ColaboradorResponse = Response<unknown, { tipoColaborador?: TipoColaborador }>;

export function cadastrarColaborador(req: ColaboradorRequest, res: ColaboradorResponse, next: NextFunction) {
  try {
    const dados = matchedData<DadosColaborador>(req, { locations: ["body"] });
    const colaborador = cadastrarColaboradorService(obterRepositorio(req.app), dados);
    return res.status(201).json(colaborador);
  } catch (error) {
    return next(error);
  }
}

export function listarColaboradores(req: ColaboradorRequest, res: ColaboradorResponse, next: NextFunction) {
  try {
    const colaboradores = listarColaboradoresService(obterRepositorio(req.app));
    const tipo = res.locals.tipoColaborador;
    return res.json(tipo ? colaboradores.filter((colaborador) => colaborador.tipo === tipo) : colaboradores);
  } catch (error) {
    return next(error);
  }
}

export function buscarColaboradorPorMatricula(req: ColaboradorRequest, res: ColaboradorResponse, next: NextFunction) {
  try {
    const repository = obterRepositorio(req.app);
    const tipo = res.locals.tipoColaborador;
    const colaborador = tipo
      ? verificarTipoColaboradorService(repository, req.params.matricula, tipo)
      : buscarColaboradorPorMatriculaService(repository, req.params.matricula);
    if (!colaborador) throw new ErroDeNegocio("Colaborador não encontrado.", 404);
    return res.json(colaborador);
  } catch (error) {
    return next(error);
  }
}

export function alterarColaborador(req: ColaboradorRequest, res: ColaboradorResponse, next: NextFunction) {
  try {
    const repository = obterRepositorio(req.app);
    const tipo = res.locals.tipoColaborador;
    if (tipo) verificarTipoColaboradorService(repository, req.params.matricula, tipo);
    const dados = matchedData<DadosColaborador>(req, { locations: ["body"] });
    return res.json(alterarColaboradorService(repository, req.params.matricula, dados));
  } catch (error) {
    return next(error);
  }
}

export function excluirColaborador(req: ColaboradorRequest, res: ColaboradorResponse, next: NextFunction) {
  try {
    const repository = obterRepositorio(req.app);
    const tipo = res.locals.tipoColaborador;
    if (tipo) verificarTipoColaboradorService(repository, req.params.matricula, tipo);
    excluirColaboradorService(repository, req.params.matricula);
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
}
