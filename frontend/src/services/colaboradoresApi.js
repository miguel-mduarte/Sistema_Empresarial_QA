import { apiRequest } from "./apiClient";

export async function listarColaboradores() {
  return apiRequest("/colaboradores");
}

export async function cadastrarColaborador(employee) {
  return apiRequest("/colaboradores", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
}

export async function alterarColaborador(matriculaAtual, employee) {
  return apiRequest(`/colaboradores/${encodeURIComponent(matriculaAtual)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(employee),
  });
}

export async function excluirColaborador(matricula) {
  return apiRequest(`/colaboradores/${encodeURIComponent(matricula)}`, {
    method: "DELETE",
  });
}
