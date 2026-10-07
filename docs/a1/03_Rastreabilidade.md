# 3. Matriz de rastreabilidade

Cada um dos 21 requisitos do cliente possui critério na ERS e caso de teste.
Ter um vínculo não equivale a homologação. CT-029 e CT-030 estão planejados;
os demais têm evidência automatizada, com agrupamentos explicados nos CTs.

| Requisito | Aceitação | Caso de uso | Componente backend / frontend | Casos de teste |
| --- | --- | --- | --- | --- |
| RF001 | CA001 | UC01 | colaboradorController, validações / EmployeesPage | CT-001, CT-010, CT-027 |
| RF002 | CA002 | UC01, UC07 | ColaboradorPadrao / CompensationFields | CT-002, CT-020 |
| RF003 | CA003 | UC01, UC07 | ColaboradorComissionado / CompensationFields | CT-003, CT-006 |
| RF004 | CA004 | UC01, UC07 | ColaboradorProducao / CompensationFields | CT-004, CT-006 |
| RF005 | CA005 | UC02, UC08 | listar/buscarColaborador / EmployeesList | CT-005, CT-017, CT-024 |
| RF006 | CA006 | UC07 | models + ColaboradorFactory | CT-006, CT-021, CT-028 |
| RF007 | CA007 | UC03, UC08 | folhaPagamentoService / PayrollPage, IndividualPayrollPage | CT-007, CT-017, CT-019 |
| RF008 | CA008 | UC04 | gerarFolhaPagamentoService / PayrollSummary | CT-008, CT-018, CT-019 |
| RF009 | CA009 | UC01, UC02, UC05, UC06 | colaboradorService / EmployeeMaintenancePanel | CT-009, CT-021, CT-022, CT-023 |
| RN001 | CA-RN001 | UC01, UC05 | colaboradorService | CT-010, CT-022 |
| RN002 | CA-RN002 | UC01, UC05 | colaboradorValidations | CT-011 |
| RN003 | CA-RN003 | UC01, UC05 | colaboradorValidations | CT-012, CT-020 |
| RN004 | CA-RN004 | UC01, UC05 | colaboradorValidations | CT-013, CT-025 |
| RN005 | CA-RN005 | UC01, UC05 | colaboradorValidations | CT-014 |
| RN006 | CA-RN006 | UC01, UC05 | colaboradorValidations | CT-015 |
| RN007 | CA-RN007 | UC01, UC05 | colaboradorValidations | CT-016 |
| RN008 | CA-RN008 | UC07 | Colaborador e subclasses | CT-002, CT-006, CT-027, CT-028 |
| RNF001 | CA-NF001 | UC01-UC08 | pages, components, styles | CT-029 (manual planejado) |
| RNF002 | CA-NF002 | UC01, UC05 | middlewares + validations | CT-011 a CT-016, CT-025, CT-027 |
| RNF003 | CA-NF003 | UC01, UC02 | ColaboradorRepository | CT-020, CT-024, CT-026 |
| RNF004 | CA-NF004 | UC07 | subclasses + fábrica + tipos | CT-030 (revisão planejada) |

Referências de código: `backend/src/` e `frontend/src/`. A especificação dos
CTs inclui o caminho e o título exato do teste automatizado, permitindo o
caminho inverso teste → CT → requisito. 21/21 requisitos estão rastreados.
19/21 possuem cenários automatizados associados; RNF001/RNF004 ainda dependem
das verificações planejadas. Esse indicador não significa 19 requisitos
formalmente homologados ou cobertura integral de cada requisito.
