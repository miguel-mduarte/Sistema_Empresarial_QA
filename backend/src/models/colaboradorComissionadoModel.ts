import Colaborador from "./colaboradorModel.js";
import { multiplicarMoeda } from "./valoresMonetarios.js";
import type { DadosComissionado } from "./colaboradorTypes.js";

class ColaboradorComissionado extends Colaborador {
  valorVendas: number;
  percentualComissao: number;

  constructor(dados: DadosComissionado) {
    super(dados);
    this.valorVendas = dados.valorVendas;
    this.percentualComissao = dados.percentualComissao;
    this.definirRemuneracao();
  }

  calcularAdicional() {
    return multiplicarMoeda(this.valorVendas, this.percentualComissao, true);
  }
}

export default ColaboradorComissionado;
