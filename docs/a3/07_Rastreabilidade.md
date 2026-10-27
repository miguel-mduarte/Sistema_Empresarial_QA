# Rastreabilidade final

Atendido tecnicamente significa implementação e evidência no escopo testado,
não assinatura de homologação. A impressão foi confirmada pelo QA após a correção.
Os CT-001 a CT-028 da A1 são reavaliados com a rodada atual no relatório gerado.
CT-029 é complementado pelo CT-A3-009; CT-030 pelo experimento unitário e revisão.

| Requisito | Implementação | Evidência atual | Situação técnica |
| --- | --- | --- | --- |
| RF001 | Cadastro e validação | requisitosFuncionais RF001; CT-A3-001/002 | Atendido |
| RF002 | ColaboradorPadrao | RF002; CT-A3-002 | Atendido |
| RF003 | Comissionado e percentual | RF003; precisaoApi; CT-A3-003 | Atendido |
| RF004 | Produção | RF004; valoresMonetarios; CT-A3-004 | Atendido |
| RF005 | Listagem e consulta | RF005; CT-A3-002/007 | Atendido |
| RF006 | Modelos e aritmética decimal | RF006; valoresMonetarios; precisaoApi | Atendido |
| RF007 | Folha individual e consolidada | RF007; relatorios; CT-A3-005/006 | Atendido em tela/API; impressão confirmada pelo QA |
| RF008 | Total e categorias em centavos | RF008; precisaoApi; CT-A3-005/008 | Atendido |
| RF009 | CRUD com identidade preservada | RF009; CT-A3-007/008 | Atendido |
| RN001 | Comparação única de matrícula | colaboradoresApi: duplicidade | Atendido |
| RN002 | Nome obrigatório | colaboradoresApi; CT-A3-001/009 | Atendido |
| RN003 | Base não negativa | colaboradoresApi; formulario | Atendido |
| RN004 | Vendas não negativas | colaboradoresApi | Atendido |
| RN005 | Percentual não negativo | colaboradoresApi | Atendido |
| RN006 | Quantidade não negativa | colaboradoresApi | Atendido |
| RN007 | Valor unitário não negativo | colaboradoresApi | Atendido |
| RN008 | Recálculo automático | RF006; valoresMonetarios; precisaoApi | Atendido |
| RNF001 | Interface com rótulos e estados | CT-A3-009; impressão CT-A3-010 | Verificação exploratória aprovada; aceite do QA registrado |
| RNF002 | Validação antes de gravar | colaboradoresApi; precisaoApi; formulario | Atendido |
| RNF003 | Repositório JSON e operações seguras | colaboradoresApi reinício; test_banco_a3; CT-A3-007 | Atendido |
| RNF004 | Herança e fábrica | valoresMonetarios CT-030; revisão técnica | Atendido no experimento isolado |

Não calcular uma porcentagem de requisitos homologados a partir desta tabela.
Existem 21 requisitos rastreados, 9 funcionais, 8 regras e 4 não funcionais.
Todos têm implementação/evidência. A ressalva de impressão de RF007 e RNF001
foi encerrada por confirmação do QA; a decisão de homologação consta no termo.
