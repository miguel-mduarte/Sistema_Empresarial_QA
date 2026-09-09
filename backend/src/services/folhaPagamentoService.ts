import type ColaboradorRepository from "../data/colaboradorRepository.js";
import { listarColaboradoresService } from "./colaboradorService.js";

export function gerarFolhaPagamentoService(repository: ColaboradorRepository) {
  const itens = listarColaboradoresService(repository).map((colaborador) => ({
    matricula: colaborador.matricula,
    nome: colaborador.nome,
    tipo: colaborador.tipo,
    salarioFinal: colaborador.salarioFinal,
  }));
  const total = itens.reduce((soma, colaborador) => soma + colaborador.salarioFinal, 0);
  return {
    itens,
    resumo: {
      quantidadeColaboradores: itens.length,
      totalFolha: Math.round((total + Number.EPSILON) * 100) / 100,
    },
  };
}
