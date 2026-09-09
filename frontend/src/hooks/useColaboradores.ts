import type { Colaborador } from "../types/colaborador";
import { useCallback, useEffect, useState } from "react";
import { listarColaboradores } from "../services/colaboradoresApi";

function getErrorMessage(error: unknown) {
  return error instanceof Error
    ? error.message
    : "Não foi possível consultar os colaboradores.";
}

function useColaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const carregarColaboradores = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      const data = await listarColaboradores();

      setColaboradores(data);
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    listarColaboradores()
      .then((data) => {
        if (isActive) setColaboradores(data);
      })
      .catch((error) => {
        if (isActive) setLoadError(getErrorMessage(error));
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  function adicionarColaborador(colaborador: Colaborador) {
    setColaboradores((current) => [...current, colaborador]);
  }

  function atualizarColaborador(colaboradorAtualizado: Colaborador) {
    setColaboradores((current) => current.map((colaborador) => (
      colaborador.id === colaboradorAtualizado.id
        ? colaboradorAtualizado
        : colaborador
    )));
  }

  function removerColaborador(matricula: string) {
    setColaboradores((current) => current.filter(
      (colaborador) => colaborador.matricula !== matricula,
    ));
  }

  return {
    adicionarColaborador,
    atualizarColaborador,
    carregarColaboradores,
    colaboradores,
    isLoading,
    loadError,
    removerColaborador,
  };
}

export default useColaboradores;
