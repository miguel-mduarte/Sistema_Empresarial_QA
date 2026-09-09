export type TipoColaborador = "Padrão" | "Comissionado" | "Produção";

export interface DadosBase {
  id?: string;
  matricula: string;
  nome: string;
  salarioBase: number;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type DadosPadrao = DadosBase & { tipo: "Padrão" };
export type DadosComissionado = DadosBase & {
  tipo: "Comissionado";
  valorVendas: number;
  percentualComissao: number;
};
export type DadosProducao = DadosBase & {
  tipo: "Produção";
  quantidadeProduzida: number;
  valorPorUnidade: number;
};
export type DadosColaborador = DadosPadrao | DadosComissionado | DadosProducao;
