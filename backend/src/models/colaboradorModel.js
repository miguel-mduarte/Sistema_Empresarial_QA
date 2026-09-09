const { randomUUID } = require("node:crypto");

class Colaborador {
  constructor({ id, matricula, nome, salarioBase, tipo, criadoEm }) {
    this.id = id ?? randomUUID();
    this.matricula = matricula;
    this.nome = nome;
    this.salarioBase = salarioBase;
    this.tipo = tipo;
    this.criadoEm = criadoEm ?? new Date().toISOString();
  }

  calcularAdicional() {
    return 0;
  }

  definirRemuneracao() {
    this.adicional = Colaborador.arredondarValor(this.calcularAdicional());
    this.salarioFinal = Colaborador.arredondarValor(
      this.salarioBase + this.adicional,
    );
  }

  static arredondarValor(valor) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}

module.exports = Colaborador;
