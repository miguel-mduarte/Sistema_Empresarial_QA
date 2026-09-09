import { body, param } from "express-validator";

function numeroNaoNegativo(campo: string, nome: string) {
  return body(campo)
    .custom((valor: unknown) => (
      (typeof valor === "number" || typeof valor === "string")
      && String(valor).trim() !== ""
      && Number.isFinite(Number(valor))
      && Number(valor) >= 0
    ))
    .withMessage(`${nome} deve ser um número igual ou maior que zero.`)
    .bail()
    .toFloat();
}

export const colaboradorValidation = () => [
  body("matricula").isString().withMessage("A matrícula é obrigatória.").bail()
    .trim().notEmpty().withMessage("A matrícula é obrigatória."),
  body("nome").isString().withMessage("O nome é obrigatório.").bail()
    .trim().notEmpty().withMessage("O nome é obrigatório."),
  body("tipo").isIn(["Padrão", "Comissionado", "Produção"])
    .withMessage("O tipo de colaborador informado é inválido."),
  numeroNaoNegativo("salarioBase", "O salário base"),
  body("valorVendas").if(body("tipo").equals("Comissionado"))
    .custom((valor: unknown) => typeof valor === "string" || typeof valor === "number")
    .withMessage("O valor das vendas é obrigatório.").bail()
    .isFloat({ min: 0 }).withMessage("O valor das vendas deve ser igual ou maior que zero.").bail().toFloat(),
  body("percentualComissao").if(body("tipo").equals("Comissionado"))
    .custom((valor: unknown) => typeof valor === "string" || typeof valor === "number")
    .withMessage("O percentual de comissão é obrigatório.").bail()
    .isFloat({ min: 0 }).withMessage("O percentual de comissão deve ser igual ou maior que zero.").bail().toFloat(),
  body("quantidadeProduzida").if(body("tipo").equals("Produção"))
    .custom((valor: unknown) => typeof valor === "string" || typeof valor === "number")
    .withMessage("A quantidade produzida é obrigatória.").bail()
    .isFloat({ min: 0 }).withMessage("A quantidade produzida deve ser igual ou maior que zero.").bail().toFloat(),
  body("valorPorUnidade").if(body("tipo").equals("Produção"))
    .custom((valor: unknown) => typeof valor === "string" || typeof valor === "number")
    .withMessage("O valor por unidade é obrigatório.").bail()
    .isFloat({ min: 0 }).withMessage("O valor por unidade deve ser igual ou maior que zero.").bail().toFloat(),
];

export const matriculaValidation = () => [
  param("matricula").isString().bail().trim().notEmpty()
    .withMessage("A matrícula é obrigatória."),
];
