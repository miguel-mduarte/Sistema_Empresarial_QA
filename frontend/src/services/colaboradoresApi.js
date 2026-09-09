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
