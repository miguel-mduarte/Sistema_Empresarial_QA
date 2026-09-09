const Colaborador = require("./colaboradorModel");

class ColaboradorComissionado extends Colaborador {
  constructor(dados) {
    super(dados);
    this.valorVendas = dados.valorVendas;
    this.percentualComissao = dados.percentualComissao;
    this.definirRemuneracao();
  }

  calcularAdicional() {
    return this.valorVendas * (this.percentualComissao / 100);
  }
}

module.exports = ColaboradorComissionado;
