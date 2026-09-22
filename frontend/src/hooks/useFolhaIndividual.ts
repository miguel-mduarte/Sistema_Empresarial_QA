import { useEffect, useState } from "react";
import { gerarFolhaIndividual } from "../services/folhaPagamentoApi";
import type { PayrollItem } from "../types/colaborador";

export default function useFolhaIndividual(matricula: string) {
  const [folha, setFolha] = useState<PayrollItem | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    gerarFolhaIndividual(matricula).then((data) => {
      if (active) setFolha(data);
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : "Não foi possível carregar a folha.");
    });
    return () => { active = false; };
  }, [matricula]);
  return { folha, error };
}
