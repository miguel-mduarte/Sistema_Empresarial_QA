import Colaborador from "./colaboradorModel.js";
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
    return this.valorVendas * (this.percentualComissao / 100);
  }
}

export default ColaboradorComissionado;
