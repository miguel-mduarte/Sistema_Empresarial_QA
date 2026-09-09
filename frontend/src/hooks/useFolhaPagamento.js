import { useCallback, useEffect, useState } from "react";
import { gerarFolhaPagamento } from "../services/folhaPagamentoApi";

const emptyPayroll = {
  itens: [],
  resumo: {
    quantidadeColaboradores: 0,
    totalFolha: 0,
  },
};

function getErrorMessage(error) {
  return error instanceof Error
    ? error.message
    : "Não foi possível gerar a folha de pagamento.";
}

function useFolhaPagamento() {
  const [folha, setFolha] = useState(emptyPayroll);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  const carregarFolha = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");

    try {
      setFolha(await gerarFolhaPagamento());
    } catch (error) {
      setLoadError(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    gerarFolhaPagamento()
      .then((data) => {
        if (isActive) setFolha(data);
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

  return {
    carregarFolha,
    folha,
    isLoading,
    loadError,
  };
}

export default useFolhaPagamento;
