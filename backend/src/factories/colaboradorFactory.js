const ColaboradorComissionado = require("../models/colaboradorComissionadoModel");
const ColaboradorPadrao = require("../models/colaboradorPadraoModel");
const ColaboradorProducao = require("../models/colaboradorProducaoModel");

const criadoresPorTipo = {
  Comissionado: (dados) => new ColaboradorComissionado(dados),
  Padrão: (dados) => new ColaboradorPadrao(dados),
  Produção: (dados) => new ColaboradorProducao(dados),
};

class ColaboradorFactory {
  static get tiposSuportados() {
    return Object.keys(criadoresPorTipo);
  }

  static criar(dados) {
    const criarColaborador = criadoresPorTipo[dados.tipo];

    if (!criarColaborador) {
      throw new Error(`Tipo de colaborador não suportado: ${dados.tipo}.`);
    }

    return criarColaborador(dados);
  }
}

module.exports = ColaboradorFactory;
