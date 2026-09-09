import ErroDeNegocio from "../errors/erroDeNegocio.js";
import ColaboradorFactory from "../models/colaboradorFactory.js";
import type ColaboradorRepository from "../data/colaboradorRepository.js";
import type { DadosColaborador, TipoColaborador } from "../models/colaboradorTypes.js";

function matriculasIguais(primeiraMatricula: string, segundaMatricula: string) {
  return primeiraMatricula.localeCompare(
    segundaMatricula,
    "pt-BR",
    { sensitivity: "accent" },
  ) === 0;
}

export function cadastrarColaboradorService(repository: ColaboradorRepository, dadosValidados: DadosColaborador) {

  const colaboradorExistente = repository.listar().find(
    (colaborador) => matriculasIguais(
      colaborador.matricula,
      dadosValidados.matricula,
    ),
  );

  if (colaboradorExistente) {
    throw new ErroDeNegocio("A matrícula já está cadastrada.", 409);
  }

  const colaborador = ColaboradorFactory.criar(dadosValidados);

  return repository.adicionar(colaborador);
}

export function listarColaboradoresService(repository: ColaboradorRepository) {
  return repository.listar().map(
    (colaborador) => ColaboradorFactory.criar(colaborador),
  );
}

export function buscarColaboradorPorMatriculaService(repository: ColaboradorRepository, matricula: string) {
  return listarColaboradoresService(repository).find(
    (colaborador) => matriculasIguais(colaborador.matricula, matricula),
  );
}

export function alterarColaboradorService(repository: ColaboradorRepository, matriculaAtual: string, dadosValidados: DadosColaborador) {
  const colaboradores = repository.listar();
  const indiceAtual = colaboradores.findIndex(
    (colaborador) => matriculasIguais(
      colaborador.matricula,
      matriculaAtual,
    ),
  );
  const colaboradorAtual = colaboradores[indiceAtual];

  if (!colaboradorAtual) {
    throw new ErroDeNegocio("Colaborador não encontrado.", 404);
  }

  const matriculaEmUso = colaboradores.some(
    (colaborador, indice) => indice !== indiceAtual
      && matriculasIguais(
        colaborador.matricula,
        dadosValidados.matricula,
      ),
  );

  if (matriculaEmUso) {
    throw new ErroDeNegocio("A matrícula já está cadastrada.", 409);
  }

  const colaboradorAtualizado = ColaboradorFactory.criar({
    ...dadosValidados,
    id: colaboradorAtual.id,
    criadoEm: colaboradorAtual.criadoEm,
    atualizadoEm: new Date().toISOString(),
  });

  return repository.substituir(
    colaboradorAtual.matricula,
    colaboradorAtualizado,
  );
}

export function excluirColaboradorService(repository: ColaboradorRepository, matricula: string) {
  const colaboradorAtual = repository.listar().find(
    (colaborador) => matriculasIguais(colaborador.matricula, matricula),
  );

  if (!colaboradorAtual) {
    throw new ErroDeNegocio("Colaborador não encontrado.", 404);
  }

  return repository.excluir(colaboradorAtual.matricula);
}

export function verificarTipoColaboradorService(repository: ColaboradorRepository, matricula: string, tipo: TipoColaborador) {
  const colaborador = buscarColaboradorPorMatriculaService(repository, matricula);
  if (!colaborador || colaborador.tipo !== tipo) {
    throw new ErroDeNegocio("Colaborador não encontrado.", 404);
  }
  return colaborador;
}
