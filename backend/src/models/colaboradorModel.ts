import { randomUUID } from "node:crypto";
import { arredondarMoeda, somarMoeda } from "./valoresMonetarios.js";
import type { DadosBase, TipoColaborador } from "./colaboradorTypes.js";

class Colaborador<Tipo extends string = TipoColaborador> {
  id: string;
  matricula: string;
  nome: string;
  salarioBase: number;
  tipo: Tipo;
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
  }: DadosBase & { tipo: Tipo }) {
    this.id = id ?? randomUUID();
    this.matricula = matricula;
    this.nome = nome;
    this.salarioBase = arredondarMoeda(salarioBase);
    this.tipo = tipo;
    this.criadoEm = criadoEm ?? new Date().toISOString();
    if (atualizadoEm) this.atualizadoEm = atualizadoEm;
  }

  calcularAdicional() {
    return 0;
  }

  definirRemuneracao() {
    this.adicional = Colaborador.arredondarValor(this.calcularAdicional());
    this.salarioFinal = somarMoeda([this.salarioBase, this.adicional]);
  }

  static arredondarValor(valor: number) {
    return arredondarMoeda(valor);
  }
}

export default Colaborador;
