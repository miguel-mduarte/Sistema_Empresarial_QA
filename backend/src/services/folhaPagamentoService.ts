import type ColaboradorRepository from "../data/colaboradorRepository.js";
import { buscarColaboradorPorMatriculaService, listarColaboradoresService } from "./colaboradorService.js";
import ErroDeNegocio from "../errors/erroDeNegocio.js";
import ColaboradorFactory from "../models/colaboradorFactory.js";
import { somarMoeda } from "../models/valoresMonetarios.js";

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
      total: somarMoeda(registros.map((item) => item.salarioFinal)),
    };
  });
  const total = somarMoeda(itens.map((colaborador) => colaborador.salarioFinal));
  return {
    itens,
    resumo: {
      quantidadeColaboradores: itens.length,
      totalFolha: total,
      totaisPorCategoria,
    },
  };
}
