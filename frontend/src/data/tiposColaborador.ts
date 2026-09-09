export const tiposColaborador = {
  Padrão: {
    descricao: "Recebe somente o salário base informado no cadastro.",
    formula: "Salário base",
    titulo: "Uma remuneração simples e direta.",
  },
  Comissionado: {
    descricao: "Recebe o salário base somado ao percentual aplicado sobre as vendas.",
    formula: "Base + vendas × comissão",
    titulo: "Resultados convertidos em comissão.",
  },
  Produção: {
    descricao: "Recebe o salário base somado ao valor gerado pelas unidades produzidas.",
    formula: "Base + quantidade × unidade",
    titulo: "Produção refletida na remuneração.",
  },
};

export const nomesTiposColaborador = Object.keys(tiposColaborador);
