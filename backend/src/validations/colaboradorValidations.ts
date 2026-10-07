import { body, param } from "express-validator";

function numeroNaoNegativo(campo: string, nome: string, tipo?: string) {
  const validation = body(campo);
  if (tipo) validation.if(body("tipo").equals(tipo));
  return validation
    .custom((valor: unknown) => (
      (typeof valor === "number" || typeof valor === "string")
      && String(valor).trim() !== ""
      && Number.isFinite(Number(valor))
      && Number(valor) >= 0
    ))
    .withMessage(`${nome} deve ser um número igual ou maior que zero.`)
    .bail()
    .isFloat({ min: 0 }).withMessage(`${nome} deve ser um número decimal válido.`)
    .bail()
    .customSanitizer((valor: unknown) => Number(valor));
}

export const colaboradorValidation = () => [
  body("matricula").isString().withMessage("A matrícula é obrigatória.").bail()
    .trim().notEmpty().withMessage("A matrícula é obrigatória.").bail()
    .custom((valor: string) => valor !== "." && valor !== "..")
    .withMessage("Use uma matrícula diferente de ponto ou dois pontos consecutivos."),
  body("nome").isString().withMessage("O nome é obrigatório.").bail()
    .trim().notEmpty().withMessage("O nome é obrigatório."),
  body("tipo").isIn(["Padrão", "Comissionado", "Produção"])
    .withMessage("O tipo de colaborador informado é inválido."),
  numeroNaoNegativo("salarioBase", "O salário base"),
  numeroNaoNegativo("valorVendas", "O valor das vendas", "Comissionado"),
  numeroNaoNegativo("percentualComissao", "O percentual de comissão", "Comissionado"),
  numeroNaoNegativo("quantidadeProduzida", "A quantidade produzida", "Produção"),
  numeroNaoNegativo("valorPorUnidade", "O valor por unidade", "Produção"),
];

export const matriculaValidation = () => [
  param("matricula").isString().bail().trim().notEmpty()
    .withMessage("A matrícula é obrigatória."),
];
