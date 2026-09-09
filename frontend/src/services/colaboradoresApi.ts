import { apiRequest } from "./apiClient";
import type { Colaborador, ColaboradorPayload } from "../types/colaborador";

export async function listarColaboradores() {
  return apiRequest<Colaborador[]>("/colaboradores");
}

export async function cadastrarColaborador(employee: ColaboradorPayload) {
  return apiRequest<Colaborador>("/colaboradores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
}

export async function alterarColaborador(matriculaAtual: string, employee: ColaboradorPayload) {
  return apiRequest<Colaborador>(`/colaboradores/${encodeURIComponent(matriculaAtual)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
}

export async function excluirColaborador(matricula: string) {
  return apiRequest<null>(`/colaboradores/${encodeURIComponent(matricula)}`, {
    method: "DELETE",
  });
}
