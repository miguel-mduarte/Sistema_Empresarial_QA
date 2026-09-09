import type { Application } from "express";
import ColaboradorRepository from "./colaboradorRepository.js";

// A configuração pertence à aplicação, para que cada teste possa usar seu JSON.
export function obterRepositorio(app: Application): ColaboradorRepository {
  const repository: unknown = app.locals.colaboradorRepository;
  if (!(repository instanceof ColaboradorRepository)) {
    throw new Error("O repositório de colaboradores não foi configurado.");
  }
  return repository;
}
