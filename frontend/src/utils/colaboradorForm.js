function validateNonNegativeNumber(value, emptyMessage, invalidMessage) {
  if (value === "") return emptyMessage;

  const number = Number(value);
  return !Number.isFinite(number) || number < 0 ? invalidMessage : undefined;
}

const specificValidators = {
  Comissionado(form) {
    return {
      percentualComissao: validateNonNegativeNumber(
        form.percentualComissao,
        "Informe o percentual de comissão.",
        "O percentual deve ser igual ou maior que zero.",
      ),
      valorVendas: validateNonNegativeNumber(
        form.valorVendas,
        "Informe o valor das vendas.",
        "O valor das vendas deve ser igual ou maior que zero.",
      ),
    };
  },
  Padrão() {
    return {};
  },
  Produção(form) {
    return {
      quantidadeProduzida: validateNonNegativeNumber(
        form.quantidadeProduzida,
        "Informe a quantidade produzida.",
        "A quantidade deve ser igual ou maior que zero.",
      ),
      valorPorUnidade: validateNonNegativeNumber(
        form.valorPorUnidade,
        "Informe o valor por unidade.",
        "O valor por unidade deve ser igual ou maior que zero.",
      ),
    };
  },
};

export const initialEmployeeForm = {
  matricula: "",
  nome: "",
  percentualComissao: "",
  quantidadeProduzida: "",
  salarioBase: "",
  tipo: "Padrão",
  valorPorUnidade: "",
  valorVendas: "",
};

export function validateEmployeeForm(form) {
  const errors = {
    matricula: form.matricula.trim() ? undefined : "Informe a matrícula.",
    nome: form.nome.trim() ? undefined : "Informe o nome do colaborador.",
    salarioBase: validateNonNegativeNumber(
      form.salarioBase,
      "Informe o salário base.",
      "O salário base deve ser igual ou maior que zero.",
    ),
    ...specificValidators[form.tipo](form),
  };

  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  );
}

export function buildEmployeePayload(form) {
  const payload = {
    matricula: form.matricula.trim(),
    nome: form.nome.trim(),
    salarioBase: Number(form.salarioBase),
    tipo: form.tipo,
  };

  if (form.tipo === "Comissionado") {
    return {
      ...payload,
      percentualComissao: Number(form.percentualComissao),
      valorVendas: Number(form.valorVendas),
    };
  }

  if (form.tipo === "Produção") {
    return {
      ...payload,
      quantidadeProduzida: Number(form.quantidadeProduzida),
      valorPorUnidade: Number(form.valorPorUnidade),
    };
  }

  return payload;
}
