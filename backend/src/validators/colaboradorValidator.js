const ErroDeNegocio = require("../errors/erroDeNegocio");
const ColaboradorFactory = require("../factories/colaboradorFactory");

function validarNumeroNaoNegativo(valor, nomeDoCampo) {
  if (valor === "" || valor === null || valor === undefined) {
    throw new ErroDeNegocio(`${nomeDoCampo} é obrigatório.`);
  }

  const numero = Number(valor);

  if (!Number.isFinite(numero) || numero < 0) {
    throw new ErroDeNegocio(
      `${nomeDoCampo} deve ser um número igual ou maior que zero.`,
    );
  }

  return numero;
}

const validadoresEspecificos = {
  Comissionado: (dados) => ({
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
  Produção: (dados) => ({
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

function validarColaborador(dados) {
  const matricula = typeof dados.matricula === "string"
    ? dados.matricula.trim()
    : "";
  const nome = typeof dados.nome === "string" ? dados.nome.trim() : "";

  if (!matricula || !nome || !dados.tipo) {
    throw new ErroDeNegocio("Matrícula, nome e tipo são obrigatórios.");
  }

  if (!ColaboradorFactory.tiposSuportados.includes(dados.tipo)) {
    throw new ErroDeNegocio("O tipo de colaborador informado é inválido.");
  }

  return {
    matricula,
    nome,
    salarioBase: validarNumeroNaoNegativo(dados.salarioBase, "O salário base"),
    tipo: dados.tipo,
    ...validadoresEspecificos[dados.tipo](dados),
  };
}

module.exports = validarColaborador;
