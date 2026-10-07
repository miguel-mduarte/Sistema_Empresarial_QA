# Folha Clara - Sistema de Folha de Pagamento

Projeto acadêmico de Garantia da Qualidade de Software. Cadastro, manutenção e
cálculo de remuneração de colaboradores Padrão, Comissionado e Produção, com
folha individual, consolidada e resumo por categoria.

## Entrega A1 - 20/10/2026

- [Índice e checklist dos nove entregáveis](docs/a1/README.md)
- [Dossiê PDF](output/pdf/Dossie_A1_Folha_Clara.pdf)
- [Pacote organizado para entrega](output/Entrega_A1_Folha_Clara.zip)

Os documentos editáveis estão em `docs/a1/`. O pacote reproduz a estrutura
`Projeto_FolhaPagamento/` pedida no enunciado. A identificação nominal da equipe
está em `docs/a1/IDENTIFICACAO.md`.

## Instalação e execução local

Pré-requisito: Node.js >= 22.13 e npm. Use dois terminais, a partir da raiz:

```sh
cd backend
npm ci --registry=https://registry.npmmirror.com
npm run dev
```

```sh
cd frontend
npm ci --registry=https://registry.npmmirror.com
npm run dev
```

Abra o endereço informado pelo Vite (normalmente http://localhost:5173).
A API usa http://localhost:3000; o proxy do Vite encaminha `/api` para ela.
As opções de ambiente do backend estão em `backend/.env.example`.
`PORT` altera a porta da API; `COLABORADORES_DB_PATH` altera o JSON persistido.
Se alterar a porta, ajuste o proxy de desenvolvimento. `VITE_API_URL` permite
configurar outra base de API; acesso entre origens exige configuração adicional.

O JSON `backend/data/colaboradores.json` é criado automaticamente com uma lista
vazia. Não há banco SQL, migração ou carga de dados pessoais necessária.
Para uma demonstração isolada, defina `COLABORADORES_DB_PATH` com outro caminho.

## Verificação

No backend: `npm run typecheck`, `npm run lint`, `npm run test:coverage` e
`npm run build`. No frontend: `npm run typecheck`, `npm run lint` e `npm run build`.
O backend exige ao menos 80% por arquivo em linhas, instruções, funções e
ramificações. A cobertura é do backend, não da interface.

Os testes usam arquivos temporários e portas locais livres. O ambiente precisa
permitir escuta HTTP local. Evidências da preparação A1 estão em
`docs/a1/evidencias/`; não substituem uma execução posterior ao alterar código.

## Organização

```text
backend/src/       API, regras de negócio, modelos e persistência
backend/test/      Suíte Vitest, incluindo RF001 a RF009
frontend/src/      Páginas, componentes, hooks e serviços React
docs/a1/           Planejamento, requisitos, UML, qualidade e testes
scripts/          Geração reproduzível do pacote A1
output/           PDF consolidado e ZIP de entrega
```

Detalhes: [backend](backend/README.md) e [frontend](frontend/README.md).
Histórico real: `git log --oneline --graph --all`. O pacote contém uma exportação
textual desse histórico; o repositório Git original continua sendo sua fonte.

## Regenerar a entrega

Requer Python 3.10 ou superior. Prepare as dependências de documentação uma vez:

```sh
python3 -m venv .venv
.venv/bin/python -m pip install -r scripts/requirements-a1.txt
```

No Windows, use `python` e `.venv\Scripts\python.exe`. Os comandos npm abaixo
encontram automaticamente o Python da `.venv`; a variável `PYTHON` permite
escolher outro interpretador. O pacote raiz não tem dependências npm: não é
necessário executar `npm install` na raiz.

```sh
npm run a1:verificar
npm run a1:entrega
```

`a1:verificar` confere documentos, mínimo de 20 CTs, IDs e vínculos dos 21
requisitos com testes reais; executa os testes do gerador, typecheck, lint,
build e Vitest com cobertura. Não substitui evidências nem documentos.

`a1:entrega` executa as mesmas verificações, salva evidências atuais, logs e
hashes das fontes, atualiza o histórico e gera PDF/ZIP. Se alguma verificação
falhar, o comando termina com erro e preserva as evidências anteriores.

Para editar somente os documentos e usar os resultados já salvos:

```sh
npm run a1:documentos
```

Esse modo não reexecuta testes e recusa evidências incompatíveis quando o
código mudou. Também pode ser chamado diretamente:
`python3 scripts/gerar_entrega_a1.py`. Edite `docs/a1/casos.json` para mudar
os CTs; `08_Casos_Teste.md` é gerado. A data da geração e a data dos testes
são distintas. A revisão visual e o aceite humano continuam necessários.

O ZIP inclui fontes novas ainda não commitadas e os próprios scripts, permitindo
regenerar a entrega a partir de `05_Codigo_Fonte/`. Dados locais, `.env`,
dependências instaladas e builds ficam excluídos. Testes da preparação:
`npm run a1:test`.

## Limites da versão acadêmica

Um processo backend escreve o JSON; não há suporte declarado a múltiplos
escritores, autenticação, encargos trabalhistas, descontos, férias, 13º salário
ou histórico por competência. Os valores representam a remuneração definida
pelo documento do cliente. A A3 tem planejamento próprio e não está homologada.
