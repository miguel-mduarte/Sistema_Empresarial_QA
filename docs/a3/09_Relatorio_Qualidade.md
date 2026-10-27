# Relatório final de qualidade A3

Preparado em 2026-10-27T20:01:32-03:00.
Execução: 2026-10-27T22:54:04.338Z. Node: v24.18.0.

## Conclusão

Implementação e verificações técnicas concluídas no escopo registrado. A entrega
formal ainda requer apresentação/submissão. Após a correção de impressão,
Felipe Vergara Chico (QA) confirmou a execução manual do CT-A3-010 e autorizou
o aceite. A ressalva de impressão está encerrada.

Não houve implantação na VPS nesta preparação. Os resultados são do build local.

## Métricas

- Backend: 78 testes Vitest aprovados.
- Frontend: 11 testes Vitest aprovados.
- Persistência operacional: 1 teste Node aprovado (check-9.log).
- Verificações de tipagem, lint e build: seis comandos aprovados.
- Aceitação: 10/10 casos aprovados (100%): nove por execução técnica em navegador e CT-A3-010 por confirmação do QA.
- Defeitos conhecidos registrados: 6 encontrados e 6 corrigidos/retestados tecnicamente; DEF-006 confirmado pelo QA após a correção.
- Requisitos rastreados: 21 (9 RF, 8 RN, 4 RNF); não equivale a 100% de homologação.
- Plano A1: 30 casos históricos preservados em 04_Testes; A3: 10 cenários adicionais. Casos documentados não equivalem à quantidade de funções de teste automatizadas.
- RNF004: extensão experimental validada em teste isolado e revisão, sem adicionar categoria ao produto.

## Cobertura do backend

O frontend tem testes, mas não teve cobertura medida. Percentuais abaixo cobrem somente backend/src.

- Linhas: 98.91% (273/276).
- Instruções: 98.65% (293/297).
- Funções: 98.77% (80/81).
- Ramificações: 97.22% (140/144).

| Arquivo | Linhas | Instruções | Funções | Ramificações |
| --- | --- | --- | --- | --- |
| app.ts | 93.75% | 94.12% | 100.00% | 81.82% |
| controllers/colaboradorController.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| controllers/folhaPagamentoController.ts | 83.33% | 83.33% | 100.00% | 100.00% |
| data/colaboradorContext.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| data/colaboradorParser.ts | 95.83% | 95.83% | 83.33% | 96.43% |
| data/colaboradorRepository.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| errors/erroDeNegocio.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| errors/errorHandler.ts | 100.00% | 87.50% | 100.00% | 90.00% |
| middlewares/handleValidation.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| middlewares/normalizarColaborador.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorComissionadoModel.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorFactory.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorModel.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorPadraoModel.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorProducaoModel.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/colaboradorTypes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| models/valoresMonetarios.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| routes/colaboradorComissionadoRoutes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| routes/colaboradorPadraoRoutes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| routes/colaboradorProducaoRoutes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| routes/colaboradorRoutes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| routes/folhaPagamentoRoutes.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| services/colaboradorService.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| services/folhaPagamentoService.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| validations/categoriaValidation.ts | 100.00% | 100.00% | 100.00% | 100.00% |
| validations/colaboradorValidations.ts | 100.00% | 100.00% | 100.00% | 100.00% |

## Revisão exata e conferência

Commit-base: 6ac0616343a439a97c24215d0780bff050d48748. Há alterações locais não commitadas: esse hash não identifica sozinho a entrega A3.
O MANIFESTO_SHA256.txt na raiz do ZIP identifica os bytes entregues, incluindo código,
testes, documentação, evidências e executável. execucao.json associa as fontes de backend
e frontend à execução. O histórico Git e o README integral estão neste dossiê e no pacote.
Não foram criados commits nem enviado código ao remoto.

Repositório configurado: https://github.com/miguel-mduarte/Sistema_Empresarial_QA
(disponibilidade pública não verificada; a conferência não depende desse acesso).

## Limitações e fechamento

CT-A3-010: relato do QA confirmou corte de colunas (DEF-006). CSS corrigido e
seis cenários automatizados de impressão A4 aprovados. QA confirmou
a execução manual após a correção, registrada no CT-A3-010.
Os registros distinguem os testes automatizados da validação manual do QA.
Aceite aprovado pelo QA, sem ressalva de impressão. A confirmação manual é um
relato do responsável; não foram anexados novos PDFs produzidos por ele.
Os testes não cobrem carga, concorrência entre processos ou segurança de exposição pública.
O JSON é destinado à execução local de uma única instância, sem autenticação.
Após mudanças nas fontes, rodar a3:verificar e a3:documentos novamente.
