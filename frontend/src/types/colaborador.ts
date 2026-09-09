import type { ChangeEventHandler } from "react";

export type TipoColaborador = "Padrão" | "Comissionado" | "Produção";
interface DadosBase { matricula: string; nome: string; salarioBase: number }
type Remuneracao =
  | { tipo: "Padrão"; valorVendas?: never; percentualComissao?: never; quantidadeProduzida?: never; valorPorUnidade?: never }
  | { tipo: "Comissionado"; valorVendas: number; percentualComissao: number; quantidadeProduzida?: never; valorPorUnidade?: never }
  | { tipo: "Produção"; quantidadeProduzida: number; valorPorUnidade: number; valorVendas?: never; percentualComissao?: never };
export type ColaboradorPayload = DadosBase & Remuneracao;
export type Colaborador = ColaboradorPayload & {
  id: string; criadoEm: string; atualizadoEm?: string; adicional: number; salarioFinal: number;
};
export interface EmployeeForm {
  matricula: string; nome: string; salarioBase: string; tipo: TipoColaborador;
  percentualComissao: string; quantidadeProduzida: string; valorPorUnidade: string; valorVendas: string;
}
export type FormErrors = Partial<Record<keyof EmployeeForm, string>>;
export interface EmployeeFormProps {
  errors: FormErrors; form: EmployeeForm; idPrefix?: string;
  onChange: ChangeEventHandler<HTMLInputElement | HTMLSelectElement>;
}
export interface EmployeesTableProps {
  employees: Colaborador[];
  onDelete: (employee: Colaborador) => void;
  onEdit: (employee: Colaborador) => void;
}
export interface FeedbackProps {
  isLoading: boolean; loadError: string; onRetry: () => void;
}
export interface MaintenanceProps {
  action: "edit" | "delete"; employee: Colaborador; onCancel: () => void;
  onDeleted: (employee: Colaborador) => void;
  onUpdated: (employee: Colaborador) => void;
}
export type PayrollItem = Pick<Colaborador, "matricula" | "nome" | "tipo" | "salarioFinal">;
export interface FolhaPagamento {
  itens: PayrollItem[];
  resumo: { quantidadeColaboradores: number; totalFolha: number };
}
