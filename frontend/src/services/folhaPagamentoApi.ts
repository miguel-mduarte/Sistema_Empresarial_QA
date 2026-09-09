import { apiRequest } from "./apiClient";
import type { FolhaPagamento } from "../types/colaborador";

export function gerarFolhaPagamento() {
  return apiRequest<FolhaPagamento>("/folha-pagamento");
}
