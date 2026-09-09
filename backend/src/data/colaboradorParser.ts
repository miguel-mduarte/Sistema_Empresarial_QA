import ErroDeNegocio from "../errors/erroDeNegocio.js";
import type { DadosColaborador } from "../models/colaboradorTypes.js";

function validarNumeroNaoNegativo(valor: unknown, nomeDoCampo: string) {
  if (valor === "" || valor === null || valor === undefined) {
    throw new ErroDeNegocio(`${nomeDoCampo} é obrigatório.`);
  }

  const numero = Number(valor);

  if (!["number", "string"].includes(typeof valor) || !Number.isFinite(numero) || numero < 0) {
    throw new ErroDeNegocio(
      `${nomeDoCampo} deve ser um número igual ou maior que zero.`,
    );
  }

  return numero;
}

const validadoresEspecificos = {
  Comissionado: (dados: Record<string, unknown>) => ({
    percentualComissao: validarNumeroNaoNegativo(
      dados.percentualComissao,
      "O percentual de comissão",
    ),
    valorVendas: validarNumeroNaoNegativo(
      dados.valorVendas,
      "O valor das vendas",
    ),
  }),
  Padrão: () => ({}),
  Produção: (dados: Record<string, unknown>) => ({
    quantidadeProduzida: validarNumeroNaoNegativo(
      dados.quantidadeProduzida,
      "A quantidade produzida",
    ),
    valorPorUnidade: validarNumeroNaoNegativo(
      dados.valorPorUnidade,
      "O valor por unidade",
    ),
  }),
};

export function validarObjeto(dados: unknown): Record<string, unknown> {
  if (typeof dados !== "object" || dados === null || Array.isArray(dados)) {
    throw new ErroDeNegocio("Informe os dados do colaborador em um objeto JSON.");
  }
  return dados as Record<string, unknown>;
}

function validarColaborador(entrada: unknown): DadosColaborador {
  const dados = validarObjeto(entrada);
  const matricula = typeof dados.matricula === "string"
    ? dados.matricula.trim()
    : "";
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";

  if (!matricula || !nome || !dados.tipo) {
    throw new ErroDeNegocio("Matrícula, nome e tipo são obrigatórios.");
  }

  const base = {
    matricula,
    nome,
    salarioBase: validarNumeroNaoNegativo(dados.salarioBase, "O salário base"),
  };
  switch (dados.tipo) {
    case "Padrão": return { ...base, tipo: "Padrão" };
    case "Comissionado": return { ...base, tipo: "Comissionado", ...validadoresEspecificos.Comissionado(dados) };
    case "Produção": return { ...base, tipo: "Produção", ...validadoresEspecificos.Produção(dados) };
    default: throw new ErroDeNegocio("O tipo de colaborador informado é inválido.");
  }
}

export default validarColaborador;
