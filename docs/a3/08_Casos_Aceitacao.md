# Casos de aceitação A3

data: 2026-10-27

executor: CT-A3-001 a 009: execução técnica em navegador; CT-A3-010: Felipe Vergara Chico (QA), validação manual registrada em 27/10/2026

ambiente: Build local servido em 127.0.0.1:5187, JSON temporário isolado, desktop 1366x768 e móvel 390x844

## CT-A3-001 — Campos obrigatórios

ID: CT-A3-001

Requisito: RF001, RN002, RNF002

Título: Campos obrigatórios

Pré-condição: Formulário vazio e banco de teste vazio

Dados de entrada: Matrícula, nome e salário vazios

Passos:

1. Abrir Colaboradores
2. Clicar Salvar colaborador
3. Conferir mensagens e lista

Resultado esperado: Rejeitar envio e indicar os três campos

Resultado obtido: Mensagens Informe a matrícula, Informe o nome do colaborador e Informe o salário base; nenhum cadastro criado

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-002 — Cadastrar padrão

ID: CT-A3-002

Requisito: RF001, RF002, RF005, RF006

Título: Cadastrar padrão

Pré-condição: Formulário disponível

Dados de entrada: A3-P, Ana Exemplo, Padrão, base 1800

Passos:

1. Preencher dados
2. Salvar
3. Conferir linha da tabela

Resultado esperado: Sucesso, adicional zero e final 1800

Resultado obtido: Ana Exemplo cadastrada; linha A3-P com base 1800, adicional zero e final 1800

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-003 — Comissão com arredondamento decimal

ID: CT-A3-003

Requisito: RF003, RF006, RN008

Título: Comissão com arredondamento decimal

Pré-condição: Cadastro padrão existente

Dados de entrada: A3-C, Bruno Exemplo, base 1000, vendas 4.27, percentual 50

Passos:

1. Selecionar Comissionado
2. Preencher dados e salvar
3. Conferir adicional e final

Resultado esperado: Adicional 2.14 e final 1002.14

Resultado obtido: Tabela mostrou vendas 4,27, percentual 50%, adicional 2,14 e final 1002,14

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-004 — Cadastrar produção

ID: CT-A3-004

Requisito: RF004, RF006

Título: Cadastrar produção

Pré-condição: Formulário disponível

Dados de entrada: A3-R, Carla Exemplo, base 1500, quantidade 80, unidade 12.5

Passos:

1. Selecionar Produção
2. Preencher dados e salvar
3. Conferir remuneração

Resultado esperado: Adicional 1000 e final 2500

Resultado obtido: Tabela mostrou 80 un., 12,50 por unidade, adicional 1000 e final 2500

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-005 — Folha consolidada e categorias

ID: CT-A3-005

Requisito: RF007, RF008

Título: Folha consolidada e categorias

Pré-condição: A3-P, A3-C e A3-R cadastrados pelos casos anteriores

Dados de entrada: Salários 1800, 1002.14 e 2500

Passos:

1. Abrir Folha de pagamento
2. Conferir três linhas
3. Conferir total e categorias

Resultado esperado: Três colaboradores, total 5302.14 e categorias reconciliadas

Resultado obtido: Três linhas; total R$ 5.302,14; Padrão 1800, Comissionado 1002,14 e Produção 2500

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-006 — Folha individual

ID: CT-A3-006

Requisito: RF007

Título: Folha individual

Pré-condição: A3-C na consolidada

Dados de entrada: Bruno Exemplo, A3-C

Passos:

1. Clicar Ver folha individual na linha A3-C
2. Conferir nome, matrícula e valores
3. Verificar aviso de cadastro atual

Resultado esperado: Somente Bruno, base 1000, adicional 2.14, final 1002.14

Resultado obtido: Página individual exibiu A3-C, Bruno Exemplo, Comissionado e os três valores esperados

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-007 — Alterar e recarregar

ID: CT-A3-007

Requisito: RF009, RNF003

Título: Alterar e recarregar

Pré-condição: A3-P cadastrado com base 1800

Dados de entrada: Nova base 1900

Passos:

1. Editar Ana Exemplo
2. Salvar alterações
3. Recarregar a página

Resultado esperado: Cadastro continua com base e final 1900

Resultado obtido: Após recarregar, linha A3-P mostrou base 1900, adicional zero e final 1900

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-008 — Excluir e atualizar folha

ID: CT-A3-008

Requisito: RF009, RF008

Título: Excluir e atualizar folha

Pré-condição: A3-R cadastrado, A3-P já alterado

Dados de entrada: Excluir Carla Exemplo

Passos:

1. Clicar Excluir Carla Exemplo
2. Conferir matrícula na confirmação e confirmar
3. Abrir folha

Resultado esperado: A3-R removido; duas pessoas e total 2902.14

Resultado obtido: Tabela ficou com A3-P e A3-C; folha com total R$ 2.902,14 e Produção zero

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-009 — Usabilidade em desktop e móvel

ID: CT-A3-009

Requisito: RNF001, RF001, RF005, RF007

Título: Usabilidade em desktop e móvel

Pré-condição: Sistema local em execução; viewport configurável

Dados de entrada: UX-01, Pessoa Teste, base 1500; primeiro envio sem nome

Passos:

1. Em 390x844 enviar sem nome e conferir erro
2. Informar Pessoa Teste e salvar; consultar e abrir folha individual
3. Conferir folhas em 1366x768 e restaurar viewport

Resultado esperado: Erro compreensível, operação possível e relatórios legíveis nos dois tamanhos

Resultado obtido: Nome vazio rejeitado com instrução; UX-01 salvo com final 1500; folhas legíveis em cartões no móvel e tabela no desktop, sem sobreposição observada. Avaliação exploratória, não ensaio formal de acessibilidade

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

## CT-A3-010 — Impressão e salvamento em PDF

ID: CT-A3-010

Requisito: RF007, RNF001

Título: Impressão e salvamento em PDF

Pré-condição: Navegador convencional com diálogo de impressão e registros fictícios

Dados de entrada: Folha individual A3-C e consolidada

Passos:

1. Abrir folha e clicar Imprimir
2. Selecionar Salvar como PDF, A4 e conferir prévia
3. Salvar, abrir PDF e verificar valores, todas as colunas e paginação

Resultado esperado: PDF legível das duas folhas, sem cortes e com os mesmos valores da tela

Resultado obtido: Após relato de corte de colunas (DEF-006), CSS corrigido e seis cenários automatizados A4 aprovados. Felipe Vergara Chico (QA) confirmou em 27/10/2026 a execução manual do teste das folhas individual e consolidada após a correção. Resultado aprovado por confirmação do responsável; nenhum novo PDF manual foi anexado. Data exata da execução e versão do navegador não informadas; data acima corresponde ao registro da confirmação.

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

