# 6. Plano de Garantia da Qualidade (PGQ)

## Objetivo e abrangência

Demonstrar conformidade com a ERS e prevenir regressões nos cálculos, validações,
relatórios e persistência. Abrange documentos A1, frontend, backend e testes.
O plano define práticas adotadas para novas alterações; não presume que todas
as revisões históricas já seguiram este processo.

## Padrões de codificação

TypeScript estrito; ES Modules; componentes React em TSX; funções e arquivos
coesos; nomenclatura de domínio em português; imports locais backend com `.js`
para execução compilada. Controllers tratam HTTP, services orquestram negócio,
models calculam e repositório grava. Não duplicar cálculos no frontend.
Executar ESLint/SonarJS e typecheck antes de revisar. Não incluir credenciais,
dados reais, dependências instaladas ou relatórios temporários nos commits.

## Controle de versões e mudança

Git é a fonte de histórico. Usar branch curta por requisito/correção, commits
descritivos e pull request com objetivo, requisito, impacto e evidências.
Antes de integrar: revisor verifica diff, testes, ERS e rastreabilidade.
Baseline A1: documentação 1.0; qualquer alteração de requisito registra motivo,
autor, impacto, decisão e atualização dos CTs. Tags/releases são decisões da
equipe; este pacote não cria retrospectivamente commits, revisões ou aprovações.

## Processo de revisão técnica

1. Autor prepara alteração e executa verificações aplicáveis.
2. Revisor confere requisito, entradas negativas/limites, cálculo, persistência, tratamento de erro e clareza da interface.
3. QA confere critérios de aceitação, rastreabilidade e evidência reproduzível.
4. Não conformidades recebem ID, descrição, severidade, prioridade, responsável e condição de reteste.
5. Autor corrige; revisor/QA retesta e fecha com evidência; coordenador aceita a baseline documental.

Papéis podem acumular pessoas em equipe pequena; quem revisa deve ser distinto
do autor quando possível. Aprovação nominal e revisões ainda não realizadas
permanecem pendentes, não são simuladas neste documento.

## Métricas e critérios

| Métrica | Cálculo | Meta / frequência |
| --- | --- | --- |
| Rastreabilidade | Requisitos com CA e CT / 21 requisitos × 100 | 100% na baseline A1 |
| Casos especificados | Contagem de IDs CT únicos | Pelo menos 20; pacote contém 30 |
| Aprovação automatizada | Testes aprovados / executados × 100 | 100% antes de integrar; ignorados reportados à parte |
| Cobertura backend | Linhas, instruções, funções e ramos cobertos / totais | >=80% por arquivo em cada métrica |
| Qualidade estática | Erros em typecheck e lint | Zero; verificar backend e frontend |
| Build | Processos concluídos com código zero | Ambos os projetos compilam |
| Defeitos abertos | Contagem por severidade | Zero crítico/alto para aceite; demais com decisão explícita |
| Documentação | Itens 5.1 a 5.9 conferidos / 9 | 100% de conteúdo; identificação preenchida antes do envio |

Cobertura mede execução de código, não comprova todos os comportamentos nem a
usabilidade. O frontend não possui cobertura automatizada declarada. Defeitos
de ambiente devem ser separados de falhas reproduzíveis do produto.

## Gestão de defeitos e risco

Modelo de registro: DEF-XXX; requisito/CT; ambiente; passos; esperado; obtido;
severidade; prioridade; responsável; status; correção/commit; evidência de reteste.
Estados: Aberto → Em análise → Em correção → Em reteste → Fechado (ou Reaberto).
Crítico: perda/corrupção de dados; alto: cálculo ou fluxo principal incorreto;
médio: fluxo secundário; baixo: apresentação sem impedir tarefa.
Prazo proposto: críticos/altos resolvidos antes da próxima baseline; demais
triados na revisão semanal. O registro começa sem defeitos de produto
formalmente triados; isso não é uma declaração de ausência de defeitos.

## Aprovação da A1

Exigir visão, ERS, UML, arquitetura, PGQ, plano de testes, >=20 CTs,
planejamento e repositório verificáveis. Conferir os 21 requisitos na matriz,
coerência das fórmulas, autoria e responsabilidades. Testes manuais planejados
podem estar não executados na A1, desde que isso esteja explícito. Homologação
e critérios finais da A3 serão avaliados em fase própria.
