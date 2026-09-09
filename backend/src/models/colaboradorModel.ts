import { randomUUID } from "node:crypto";
import type { DadosColaborador, TipoColaborador } from "./colaboradorTypes.js";

class Colaborador {
  id: string;
  matricula: string;
  nome: string;
  salarioBase: number;
  tipo: TipoColaborador;
  criadoEm: string;
  atualizadoEm?: string;
  adicional = 0;
  salarioFinal = 0;
  constructor({
    id,
    matricula,
    nome,
    salarioBase,
    tipo,
    criadoEm,
    atualizadoEm,
  }: DadosColaborador) {
    this.id = id ?? randomUUID();
    this.matricula = matricula;
    this.nome = nome;
    this.salarioBase = salarioBase;
    this.tipo = tipo;
    this.criadoEm = criadoEm ?? new Date().toISOString();
    if (atualizadoEm) this.atualizadoEm = atualizadoEm;
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

  static arredondarValor(valor: number) {
    return Math.round((valor + Number.EPSILON) * 100) / 100;
  }
}

export default Colaborador;
