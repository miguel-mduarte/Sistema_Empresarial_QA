# Verificações da preparação A1

Execução: 2026-10-06T19:36:09.676036-03:00

Revisão-base: 1257880d04fe72a6b6ca974b50ef08aed727cd3b. Hashes dos arquivos testados em execucao.json incluem alterações ainda não commitadas.

| Projeto | Verificação | Resultado |
| --- | --- | --- |
| gestao-qualidade | -m unittest discover -s scripts/tests -v | Passou; log check-01.log |
| backend | run typecheck | Passou; log check-02.log |
| backend | run lint | Passou; log check-03.log |
| backend | run build | Passou; log check-04.log |
| frontend | run typecheck | Passou; log check-05.log |
| frontend | run lint | Passou; log check-06.log |
| frontend | run build | Passou; log check-07.log |
| backend | test:coverage (JSON e cobertura em pasta temporária isolada) | Passou; log check-08.log |

Vitest: 59/59 testes aprovados; zero falhas/ignorados. Cobertura mínima de 80% por arquivo aprovada em quatro métricas.

Cobertura medida apenas no backend. Detalhes em cobertura-resumo.json e coverage-final.json.

28 casos documentados associados à automação e 2 planejados. CT-011 a CT-016 compartilham um teste; CT-017 e CT-018 também. Casos documentados e testes Vitest são contagens diferentes.

Os testes manuais não foram executados por este comando. A revisão visual do PDF deve ser realizada antes da submissão.
