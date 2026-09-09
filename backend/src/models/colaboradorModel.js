const { randomUUID } = require("node:crypto");

class Colaborador {
  constructor({ matricula, nome, salarioBase, tipo }) {
    this.id = randomUUID();
    this.matricula = matricula;
    this.nome = nome;
    this.salarioBase = salarioBase;
    this.tipo = tipo;
    this.salarioFinal = salarioBase;
    this.criadoEm = new Date().toISOString();
  }
}

module.exports = Colaborador;
