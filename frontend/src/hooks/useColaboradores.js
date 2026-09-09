import { useCallback, useEffect, useState } from "react";
import { listarColaboradores } from "../services/colaboradoresApi";

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Não foi possível consultar os colaboradores.";
}

function useColaboradores() {
  const [colaboradores, setColaboradores] = useState([]);
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

  function adicionarColaborador(colaborador) {
    setColaboradores((current) => [...current, colaborador]);
  }

  return {
    adicionarColaborador,
    carregarColaboradores,
    colaboradores,
    isLoading,
    loadError,
  };
}

export default useColaboradores;
