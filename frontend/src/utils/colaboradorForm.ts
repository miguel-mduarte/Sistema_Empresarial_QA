import type { EmployeeForm, FormErrors, Colaborador, ColaboradorPayload } from "../types/colaborador";
function validateNonNegativeNumber(value: string, emptyMessage: string, invalidMessage: string) {
  if (value === "") return emptyMessage;

  const number = Number(value);
  return !Number.isFinite(number) || number < 0 ? invalidMessage : undefined;
}

const specificValidators = {
  Comissionado(form: EmployeeForm) {
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
  Produção(form: EmployeeForm) {
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

export const initialEmployeeForm: EmployeeForm = {
  matricula: "",
  nome: "",
  percentualComissao: "",
  quantidadeProduzida: "",
  salarioBase: "",
  tipo: "Padrão",
  valorPorUnidade: "",
  valorVendas: "",
};

export function validateEmployeeForm(form: EmployeeForm): FormErrors {
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

export function buildEmployeePayload(form: EmployeeForm): ColaboradorPayload {
  const payload = {
    matricula: form.matricula.trim(),
    nome: form.nome.trim(),
    salarioBase: Number(form.salarioBase),
    
  };

  if (form.tipo === "Comissionado") {
    return {
      ...payload,
      tipo: "Comissionado",
      percentualComissao: Number(form.percentualComissao),
      valorVendas: Number(form.valorVendas),
    };
  }

  if (form.tipo === "Produção") {
    return {
      ...payload,
      tipo: "Produção",
      quantidadeProduzida: Number(form.quantidadeProduzida),
      valorPorUnidade: Number(form.valorPorUnidade),
    };
  }

  return { ...payload, tipo: "Padrão" };
}

export function employeeToForm(employee: Colaborador): EmployeeForm {
  return {
    ...initialEmployeeForm,
    matricula: employee.matricula,
    nome: employee.nome,
    percentualComissao: String(employee.percentualComissao ?? ""),
    quantidadeProduzida: String(employee.quantidadeProduzida ?? ""),
    salarioBase: String(employee.salarioBase),
    tipo: employee.tipo,
    valorPorUnidade: String(employee.valorPorUnidade ?? ""),
    valorVendas: String(employee.valorVendas ?? ""),
  };
}
