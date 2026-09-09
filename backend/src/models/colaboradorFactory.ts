import ColaboradorComissionado from "../models/colaboradorComissionadoModel.js";
import ColaboradorPadrao from "../models/colaboradorPadraoModel.js";
import ColaboradorProducao from "../models/colaboradorProducaoModel.js";

import type { DadosColaborador } from "./colaboradorTypes.js";

class ColaboradorFactory {
  static get tiposSuportados() {
    return ["Padrão", "Comissionado", "Produção"];
  }

  static criar(dados: DadosColaborador) {
    switch (dados.tipo) {
      case "Padrão": return new ColaboradorPadrao(dados);
      case "Comissionado": return new ColaboradorComissionado(dados);
      case "Produção": return new ColaboradorProducao(dados);
    }
  }
}

export default ColaboradorFactory;
