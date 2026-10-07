# 5. Documento de arquitetura

## Estilo e tecnologias

Aplicação cliente-servidor com API REST e backend em camadas. Frontend React 19,
React Router 7, TypeScript 6 e Vite 8. Backend Node.js, Express 5, TypeScript 6,
express-validator 7 e dotenv 17. Testes com Vitest 5 e cobertura V8; análise
estática com ESLint 10, TypeScript estrito e SonarJS. Versões exatas resolvidas
estão nos `package-lock.json`; Node mínimo documentado: 22.13.

## Componentes e dependências

| Camada | Caminho | Responsabilidade |
| --- | --- | --- |
| Interface | frontend/src/pages e components | Formulários, listagem, navegação, estados e impressão |
| Orquestração cliente | frontend/src/hooks | Carregar, atualizar e apresentar sucesso/erro |
| Comunicação | frontend/src/services | Fetch, contratos HTTP e base da API |
| Entrada HTTP | backend/src/routes e controllers | Rotas, parâmetros e respostas |
| Validação | backend/src/validations e middlewares | Normalizar tipo, conferir entradas e extrair dados permitidos |
| Negócio | backend/src/services | Unicidade, manutenção, consultas e composição da folha |
| Domínio | backend/src/models | Classes de remuneração e fábrica |
| Persistência | backend/src/data | Contexto por aplicação, parser e repositório JSON |
| Erros | backend/src/errors | Erros de negócio e respostas centralizadas |

Fluxo: página → hook → serviço HTTP → rota → validação → controller → serviço
de negócio → fábrica/modelos + repositório. O servidor é composto em `app.ts`.
`createApp` recebe caminho de dados e não abre porta; `startServer` inicia HTTP.
O repositório pertence à aplicação (`app.locals`), permitindo testes isolados.

## Contratos principais

`/api/colaboradores`: POST cadastra (201), GET lista (200); `/:matricula`:
GET consulta (200), PUT substitui dados (200), DELETE exclui (204).
Bases por categoria: `colaboradores-padrao`, `colaboradores-comissionados` e
`colaboradores-producao`, com o mesmo CRUD e isolamento de tipo.
`GET /api/folha-pagamento` retorna `{itens, resumo}`;
`GET /api/folha-pagamento/:matricula` retorna um item detalhado.
Erros: 400 entrada inválida, 404 ausente, 409 matrícula duplicada, 500 falha
interna. API usa `mensagem` e, nas validações, `errors` com campo/mensagem.

## Modelo de persistência

Arquivo padrão: `backend/data/colaboradores.json`, lista de objetos contendo
`id`, `matricula`, `nome`, `salarioBase`, `tipo`, `criadoEm`, opcional
`atualizadoEm`, adicional, salário final e campos específicos da categoria.
`COLABORADORES_DB_PATH` pode substituir o caminho. Arquivo inexistente é criado
como `[]`. Leitura valida formato e registros; conteúdo inválido gera erro.
Consultas recriam o modelo e recalculam remuneração, não confiam nos totais
armazenados. Escrita usa arquivo temporário no mesmo diretório e rename.

Não há scripts SQL porque não há SGBD. O pacote registra essa decisão em
`06_Banco_Dados/README.md`. Não se distribuem os registros locais da equipe.
Backup proposto: parar a API, copiar o JSON válido, armazenar cópia com data;
restauração com API parada e validação pela consulta. Procedimento a ensaiar na A3.

## Decisões e justificativas

| Decisão | Razão | Consequência / limite |
| --- | --- | --- |
| React + API separada | Separar apresentação de regras | Contratos devem permanecer compatíveis |
| TypeScript estrito | Detectar incompatibilidades antecipadamente | Validação de dados externos continua necessária |
| Herança e fábrica | Compartilhar identificação e especializar fórmulas | Novos tipos exigem atualizar pontos de registro |
| JSON local | Baixo custo de instalação e escopo acadêmico | Sem transações entre processos ou consultas de grande volume |
| Escrita temporária + rename | Evitar exposição de conteúdo parcialmente escrito | Não substitui backup nem resolve múltiplos escritores |
| HTTP + diretórios temporários nos testes | Exercitar contrato e persistência reais | Ambiente de execução precisa permitir portas locais |

## Implantação e limites

Desenvolvimento: navegador → Vite (5173) → proxy `/api` → Express (3000) → JSON.
Build frontend gera arquivos estáticos; backend gera `dist/app.js` para Node.
Uma publicação exigiria hospedagem estática/proxy e configuração de origem.
Sem autenticação ou autorização implementadas, a versão é de demonstração local.
O modelo atual não oferece rastreio histórico de folha ou concorrência robusta.
