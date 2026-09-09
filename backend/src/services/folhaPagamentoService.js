const ColaboradorService = require("./colaboradorService");

function arredondarMoeda(valor) {
  return Math.round((valor + Number.EPSILON) * 100) / 100;
}

class FolhaPagamentoService {
  constructor(colaboradorService = new ColaboradorService()) {
    this.colaboradorService = colaboradorService;
  }

  gerar() {
    const colaboradores = this.colaboradorService.listar();
    const itens = colaboradores.map((colaborador) => ({
      matricula: colaborador.matricula,
      nome: colaborador.nome,
      tipo: colaborador.tipo,
      salarioFinal: colaborador.salarioFinal,
    }));
    const totalFolha = itens.reduce(
      (total, colaborador) => total + colaborador.salarioFinal,
      0,
    );

    return {
      itens,
      resumo: {
        quantidadeColaboradores: itens.length,
        totalFolha: arredondarMoeda(totalFolha),
      },
    };
  }
}

module.exports = FolhaPagamentoService;
