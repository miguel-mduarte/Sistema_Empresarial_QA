import Colaborador from "./colaboradorModel.js";
import type { DadosProducao } from "./colaboradorTypes.js";

class ColaboradorProducao extends Colaborador {
  quantidadeProduzida: number;
  valorPorUnidade: number;

  constructor(dados: DadosProducao) {
    super(dados);
    this.quantidadeProduzida = dados.quantidadeProduzida;
    this.valorPorUnidade = dados.valorPorUnidade;
    this.definirRemuneracao();
  }

  calcularAdicional() {
    return this.quantidadeProduzida * this.valorPorUnidade;
  }
}

export default ColaboradorProducao;
