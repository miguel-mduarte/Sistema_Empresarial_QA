const Colaborador = require("./colaboradorModel");

class ColaboradorProducao extends Colaborador {
  constructor(dados) {
    super(dados);
    this.quantidadeProduzida = dados.quantidadeProduzida;
    this.valorPorUnidade = dados.valorPorUnidade;
    this.definirRemuneracao();
  }

  calcularAdicional() {
    return this.quantidadeProduzida * this.valorPorUnidade;
  }
}

module.exports = ColaboradorProducao;
