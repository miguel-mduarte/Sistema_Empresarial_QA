import type ColaboradorRepository from "../data/colaboradorRepository.js";
import { buscarColaboradorPorMatriculaService, listarColaboradoresService } from "./colaboradorService.js";
import ErroDeNegocio from "../errors/erroDeNegocio.js";
import ColaboradorFactory from "../models/colaboradorFactory.js";

function detalharColaborador(colaborador: ReturnType<typeof ColaboradorFactory.criar>) {
  return {
    matricula: colaborador.matricula,
    nome: colaborador.nome,
    tipo: colaborador.tipo,
    salarioBase: colaborador.salarioBase,
    adicional: colaborador.adicional,
    salarioFinal: colaborador.salarioFinal,
  };
}

export function gerarFolhaIndividualService(repository: ColaboradorRepository, matricula: string) {
  const colaborador = buscarColaboradorPorMatriculaService(repository, matricula);
  if (!colaborador) throw new ErroDeNegocio("Colaborador não encontrado.", 404);
  return detalharColaborador(colaborador);
}

export function gerarFolhaPagamentoService(repository: ColaboradorRepository) {
  const itens = listarColaboradoresService(repository).map(detalharColaborador);
  const totaisPorCategoria = ColaboradorFactory.tiposSuportados.map((tipo) => {
    const registros = itens.filter((item) => item.tipo === tipo);
    return {
      tipo,
      quantidadeColaboradores: registros.length,
      total: registros.reduce((soma, item) => soma + Math.round(item.salarioFinal * 100), 0) / 100,
    };
  });
  const total = itens.reduce((soma, colaborador) => soma + colaborador.salarioFinal, 0);
  return {
    itens,
    resumo: {
      quantidadeColaboradores: itens.length,
      totalFolha: Math.round((total + Number.EPSILON) * 100) / 100,
      totaisPorCategoria,
    },
  };
}
