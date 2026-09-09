const Colaborador = require("./colaboradorModel");

class ColaboradorPadrao extends Colaborador {
  constructor(dados) {
    super(dados);
    this.definirRemuneracao();
  }
}

module.exports = ColaboradorPadrao;
