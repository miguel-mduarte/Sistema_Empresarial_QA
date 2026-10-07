# 9. Planejamento do projeto

## Base do planejamento

Data de planejamento: 29/09/2026. Prazo A1: 20/10/2026. O código e a suíte
já existem; o cronograma abaixo reserva consolidação, revisão e entrega.
As datas futuras são previstas, não registros fictícios de trabalho concluído.

## EAP - Estrutura Analítica do Projeto

1. Gestão da A1: 1.1 identificar equipe; 1.2 atribuir papéis; 1.3 acompanhar riscos; 1.4 conferir submissão.
2. Requisitos: 2.1 visão; 2.2 ERS; 2.3 critérios de aceitação; 2.4 rastreabilidade.
3. Análise e projeto: 3.1 casos de uso; 3.2 classes; 3.3 sequência; 3.4 arquitetura/persistência.
4. Qualidade: 4.1 PGQ; 4.2 plano de testes; 4.3 especificar 30 CTs; 4.4 coletar evidências.
5. Repositório: 5.1 README; 5.2 estrutura; 5.3 conferir histórico; 5.4 empacotar fontes.
6. Fechamento: 6.1 revisão cruzada; 6.2 ajustes; 6.3 conferência final; 6.4 entrega.

## Cronograma e dependências

| EAP | Atividade | Início | Fim | Dependência | Responsável | Saída |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | Identificação e atribuição nominal | 29/09 | 01/10 | Nenhuma | Coordenação | Equipe e papéis preenchidos |
| 2 | Revisar visão, ERS e critérios | 29/09 | 03/10 | Fonte do cliente | Análise | Baseline de requisitos revisada |
| 3 | Conferir UML e arquitetura | 02/10 | 06/10 | 2 | Desenvolvimento | Modelos coerentes com código |
| 4.1-4.3 | Revisar PGQ, plano e CTs | 04/10 | 08/10 | 2 e 3 | QA | Critérios e 30 casos conferidos |
| 4.4 | Reexecutar automação se houver mudanças | 09/10 | 12/10 | 4.1-4.3 | QA + Desenvolvimento | Evidências atualizadas |
| 5 | Conferir README, acesso e pacote | 10/10 | 14/10 | 3 e 4 | Configuração | Repositório reproduzível |
| 6.1-6.2 | Revisão cruzada e ajustes | 15/10 | 17/10 | 2-5 | Revisor | Pendências resolvidas |
| 6.3 | Reserva e conferência final | 18/10 | 19/10 | 6.1-6.2 | Coordenação | Checklist e identificação completos |
| 6.4 | Submissão A1 | 20/10 | 20/10 | 6.3 | Coordenação | Comprovante de entrega |

Todas as datas da tabela são de 2026. Reunião curta de acompanhamento semanal,
com revisão de pendências e registro de decisões. Desvio que comprometa 17/10
é comunicado à coordenação; 18-19/10 são reserva de ajuste, não escopo novo.

## Responsabilidades

| Papel | Executa | Revisa / aprova |
| --- | --- | --- |
| Coordenação | Cronograma, atribuição nominal e envio | Checklist final e baseline |
| Análise | Visão, ERS e rastreabilidade | Aderência dos CTs ao cliente |
| Desenvolvimento | UML, arquitetura e correções | Viabilidade técnica e fórmulas |
| QA | PGQ, plano, CTs, execução e evidências | Critérios de entrada/saída |
| Configuração | README, dependências, histórico e ZIP | Reprodutibilidade e conteúdo do pacote |
| Revisor | Revisão cruzada independente do autor quando possível | Consistência e registro de não conformidades |

Distribuição proposta para execução do plano: Felipe Vergara Chico assume
Coordenação e QA; Nicolas Uliana Ramos assume Análise e documentação; Victor
Pithan Altnetter assume Desenvolvimento frontend e revisão da interface; Miguel
Marques Durte assume Desenvolvimento backend e Configuração. Nicolas revisa
os CTs de Felipe; Felipe revisa a ERS de Nicolas; Victor e Miguel revisam
mutuamente arquitetura e contratos. Essa distribuição é planejamento, não
registro de autoria passada ou aprovação já realizada.

## Riscos e resposta

| Risco | Probabilidade / impacto | Prevenção / resposta | Dono |
| --- | --- | --- | --- |
| Ambiguidade de percentual/precisão | Média / alto | Confirmar D01-D06 e manter exemplos de cálculo | Análise |
| Alterações invalidarem evidências | Média / alto | Rodar testes e regenerar relatório após mudanças | QA |
| Dados JSON perdidos por múltiplos processos | Baixa no uso local / alto | Uma API por arquivo; backup antes de demonstrações | Desenvolvimento |
| Dependências ou portas indisponíveis | Média / médio | Instalar antes da aula e verificar HTTP local | Configuração |
| Identificação/acesso faltando | Média / alto | Conferência nominal e de acesso até 14/10 | Coordenação |
| Escopo A3 invadir fechamento A1 | Média / médio | Registrar backlog separado e congelar documentos em 17/10 | Coordenação |

A A3 (01/12/2026) requer implementação final, testes de aceitação, defeitos,
manuais e homologação. Estes itens ficam para planejamento posterior, sem
comprometer o fechamento dos nove entregáveis da A1.
