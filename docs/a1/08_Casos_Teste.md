# 8. Especificação de casos de teste

30 casos documentados no template solicitado; 28 vinculados à automação e 2 planejados. Os resultados referem-se às asserções executadas no backend, não à execução de interface. A suíte completa contém 59 testes. Cada pré-condição deve ser preparada antes de reproduzir o caso isoladamente.

## CT-001 - Cadastrar dados básicos

ID: CT-001

Título: Cadastrar dados básicos

Requisito(s): RF001

Pré-condição: API disponível e matrícula RF001-01 livre.

Dados de entrada: RF001-01; Ana Souza; Padrão; salarioBase=2500.

Passos:

1. Enviar POST /api/colaboradores com os dados.
2. Ler o status e o corpo JSON.
3. Conferir identificação, tipo, base e id.

Resultado esperado: HTTP 201; matrícula, nome, base e tipo preservados; id textual gerado.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF001 - cadastra colaborador com matrícula, nome, salário base e tipo.

## CT-002 - Cadastrar colaborador Padrão

ID: CT-002

Título: Cadastrar colaborador Padrão

Requisito(s): RF002, RN008

Pré-condição: API disponível e matrícula RF002-01 livre.

Dados de entrada: RF002-01; Bruno Lima; Padrão; salarioBase=1800.

Passos:

1. Enviar POST /api/colaboradores.
2. Ler remuneração retornada.
3. Comparar adicional e final com a base.

Resultado esperado: HTTP 201; adicional=0; salarioFinal=1800.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF002 - cadastra colaborador padrão que recebe somente o salário base.

## CT-003 - Registrar campos de comissão

ID: CT-003

Título: Registrar campos de comissão

Requisito(s): RF003

Pré-condição: API disponível e matrícula RF003-01 livre.

Dados de entrada: RF003-01; Carla Mendes; Comissionado; base=2000; vendas=10000; percentual=5.

Passos:

1. Enviar POST com valorVendas e percentualComissao.
2. Ler o corpo retornado.
3. Conferir categoria e campos específicos.

Resultado esperado: HTTP 201; tipo Comissionado, vendas=10000 e percentual=5 preservados. A fórmula é verificada em CT-006.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF003 - cadastra colaborador comissionado com vendas e percentual.

## CT-004 - Registrar campos de produção

ID: CT-004

Título: Registrar campos de produção

Requisito(s): RF004

Pré-condição: API disponível e matrícula RF004-01 livre.

Dados de entrada: RF004-01; Diego Alves; Produção; base=1500; quantidade=80; valorPorUnidade=12.5.

Passos:

1. Enviar POST com quantidadeProduzida e valorPorUnidade.
2. Ler o corpo retornado.
3. Conferir categoria e campos específicos.

Resultado esperado: HTTP 201; tipo Produção, quantidade=80 e valorPorUnidade=12.5 preservados. A fórmula é verificada em CT-006.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF004 - cadastra colaborador por produção com quantidade e valor unitário.

## CT-005 - Listar dados e remuneração

ID: CT-005

Título: Listar dados e remuneração

Requisito(s): RF005

Pré-condição: API isolada sem cadastros.

Dados de entrada: RF005-01; Elisa Ramos; Comissionado; base=2200; vendas=3000; percentual=10.

Passos:

1. Cadastrar o colaborador por POST.
2. Executar GET /api/colaboradores.
3. Conferir quantidade, identificação e remuneração.

Resultado esperado: HTTP 200; um registro com base=2200, adicional=300 e final=2500.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF005 - consulta a lista com dados cadastrais e remuneratórios.

## CT-006 - Calcular as três remunerações

ID: CT-006

Título: Calcular as três remunerações

Requisito(s): RF006, RN008

Pré-condição: API isolada; três matrículas livres.

Dados de entrada: Base=1000 para todos; Padrão; Comissionado com vendas=2000 e percentual=10; Produção com quantidade=20 e valor=5.

Passos:

1. Cadastrar cada categoria com matrícula própria.
2. Ler o salário final de cada resposta.
3. Comparar com cálculo independente das três fórmulas.

Resultado esperado: Salários finais: Padrão=1000, Comissionado=1200 e Produção=1100.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF006 - calcula automaticamente o salário final conforme a categoria.

## CT-007 - Gerar folha detalhada consolidada

ID: CT-007

Título: Gerar folha detalhada consolidada

Requisito(s): RF007

Pré-condição: API isolada sem cadastros.

Dados de entrada: RF007-01/Fábio Castro/Padrão/base=2100; RF007-02/Gisele Moraes/Comissionado/base=2000/vendas=5000/percentual=4.

Passos:

1. Cadastrar os dois colaboradores.
2. Executar GET /api/folha-pagamento.
3. Comparar os itens e todos os campos remuneratórios.

Resultado esperado: HTTP 200; dois itens com matrícula, nome, tipo, base, adicional e final; finais 2100 e 2200.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF007 - gera folha detalhada para todos os colaboradores cadastrados.

## CT-008 - Somar o total da folha

ID: CT-008

Título: Somar o total da folha

Requisito(s): RF008

Pré-condição: API isolada sem cadastros.

Dados de entrada: RF008-01/Helena Reis/Padrão/base=1800; RF008-02/Igor Nunes/Produção/base=1200/quantidade=100/valor=3.

Passos:

1. Cadastrar os dois colaboradores.
2. Executar GET /api/folha-pagamento.
3. Comparar quantidade e total do resumo.

Resultado esperado: HTTP 200; quantidadeColaboradores=2; totalFolha=3300.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF008 - emite resumo com o valor total da folha.

## CT-009 - Executar manutenção completa

ID: CT-009

Título: Executar manutenção completa

Requisito(s): RF009

Pré-condição: API isolada; RF009-01 livre.

Dados de entrada: Joana Freitas; Padrão; base inicial=1600; novo nome=Joana Freitas Atualizada; nova base=1900.

Passos:

1. Cadastrar RF009-01 e consultar sua matrícula.
2. Enviar PUT completo com novo nome e base; conferir retorno.
3. Enviar DELETE e consultar novamente.

Resultado esperado: Cadastro 201; consulta 200; alteração 200 e final=1900; exclusão 204; consulta final 404.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/requisitosFuncionais.test.ts :: RF009 - inclui, consulta, altera e exclui um cadastro.

## CT-010 - Rejeitar matrícula duplicada

ID: CT-010

Título: Rejeitar matrícula duplicada

Requisito(s): RN001, RF001

Pré-condição: Existe FC-1007 na base de teste.

Dados de entrada: Nova matrícula fc-1007; Outro nome; Padrão; base=1000.

Passos:

1. Enviar POST com matrícula em minúsculas.
2. Ler status e mensagem.
3. Comparar com a rejeição de duplicidade esperada.

Resultado esperado: HTTP 409; mensagem A matrícula já está cadastrada.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: rejeita matrícula duplicada sem diferenciar maiúsculas.

## CT-011 - Rejeitar nome em branco

ID: CT-011

Título: Rejeitar nome em branco

Requisito(s): RN002, RNF002

Pré-condição: API disponível; RN-002 livre.

Dados de entrada: RN-002; nome com três espaços; Padrão; base=1000.

Passos:

1. Montar cadastro com nome somente espaços.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para nome inválido.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-012 - Rejeitar salário base negativo

ID: CT-012

Título: Rejeitar salário base negativo

Requisito(s): RN003, RNF002

Pré-condição: API disponível; RN-003 livre.

Dados de entrada: RN-003; Nome válido; Padrão; salarioBase=-0.01.

Passos:

1. Montar cadastro com base negativa.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para salário base negativo.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-013 - Rejeitar vendas negativas

ID: CT-013

Título: Rejeitar vendas negativas

Requisito(s): RN004, RNF002

Pré-condição: API disponível; RN-004 livre.

Dados de entrada: RN-004; Nome válido; Comissionado; base=1000; vendas=-0.01; percentual=10.

Passos:

1. Montar cadastro com vendas negativas.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para valor de vendas negativo.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-014 - Rejeitar percentual negativo

ID: CT-014

Título: Rejeitar percentual negativo

Requisito(s): RN005, RNF002

Pré-condição: API disponível; RN-005 livre.

Dados de entrada: RN-005; Nome válido; Comissionado; base=1000; vendas=100; percentual=-0.01.

Passos:

1. Montar cadastro com percentual negativo.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para percentual negativo.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-015 - Rejeitar quantidade negativa

ID: CT-015

Título: Rejeitar quantidade negativa

Requisito(s): RN006, RNF002

Pré-condição: API disponível; RN-006 livre.

Dados de entrada: RN-006; Nome válido; Produção; base=1000; quantidade=-1; valor=10.

Passos:

1. Montar cadastro com quantidade negativa.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para quantidade produzida negativa.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-016 - Rejeitar valor unitário negativo

ID: CT-016

Título: Rejeitar valor unitário negativo

Requisito(s): RN007, RNF002

Pré-condição: API disponível; RN-007 livre.

Dados de entrada: RN-007; Nome válido; Produção; base=1000; quantidade=1; valor=-0.01.

Passos:

1. Montar cadastro com valor unitário negativo.
2. Enviar POST /api/colaboradores.
3. Conferir rejeição HTTP.

Resultado esperado: HTTP 400 para valor por unidade negativo.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: aplica RN002 a RN007 a todos os dados de remuneração. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-017 - Consultar folha individual atualizada

ID: CT-017

Título: Consultar folha individual atualizada

Requisito(s): RF005, RF006, RF007

Pré-condição: API isolada com PAD/Padrão/base=1000.25 e outros registros da suíte de relatórios.

Dados de entrada: GET /api/folha-pagamento/pad; PUT PAD com base=3000; DELETE PAD.

Passos:

1. Consultar folha de PAD e conferir seus seis campos.
2. Atualizar PAD; consultar folha e comparar final.
3. Excluir PAD e consultar folha novamente.

Resultado esperado: Detalhe 200; salário após alteração=3000; detalhe após exclusão=404.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/relatorios.test.ts :: relatórios individuais refletem cadastro, alteração, exclusão e total por categoria. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-018 - Conferir resumo por categoria

ID: CT-018

Título: Conferir resumo por categoria

Requisito(s): RF008

Pré-condição: API isolada; cadastrar PAD, COM, PRO e PAD2.

Dados de entrada: Padrão: 1000.25 e 0.10; Comissionado: base=2000,vendas=1000,percentual=10; Produção: base=1500,quantidade=10,valor=2.5.

Passos:

1. Cadastrar os quatro registros.
2. Consultar a folha consolidada.
3. Comparar quantidade, total geral e totais por categoria.

Resultado esperado: Quantidade=4; total=4625.35; Padrão=1000.35, Comissionado=2100, Produção=1525.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/relatorios.test.ts :: relatórios individuais refletem cadastro, alteração, exclusão e total por categoria. Cenário coberto dentro de teste agrupado; não é uma execução independente.

## CT-019 - Gerar folha vazia

ID: CT-019

Título: Gerar folha vazia

Requisito(s): RF007, RF008

Pré-condição: JSON de teste contém [].

Dados de entrada: GET /api/folha-pagamento sem registros.

Passos:

1. Iniciar API com a base vazia.
2. Solicitar a folha.
3. Conferir itens, quantidade e totais.

Resultado esperado: HTTP 200; itens=[]; quantidade=0; totalFolha=0; três categorias com quantidade e total zero.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: gera folha vazia com totais zerados em todas as categorias.

## CT-020 - Aceitar zero e persistir cadastro

ID: CT-020

Título: Aceitar zero e persistir cadastro

Requisito(s): RF002, RN003, RNF003

Pré-condição: API isolada; FC-1007 livre.

Dados de entrada: FC-1007; Mariana Oliveira; Padrão; salarioBase=0.

Passos:

1. Cadastrar por POST.
2. Conferir status, id, adicional e final.
3. Ler o JSON e comparar com o retorno.

Resultado esperado: HTTP 201; id gerado; adicional=0 e final=0; arquivo contém exatamente o cadastro retornado.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: cadastra e persiste um colaborador padrão.

## CT-021 - Alterar categoria preservando identidade

ID: CT-021

Título: Alterar categoria preservando identidade

Requisito(s): RF009, RF006

Pré-condição: FC-1007 existe; guardar id/criadoEm; base com três colaboradores.

Dados de entrada: Renomear para FC-2007; Mariana Oliveira Atualizada; Comissionado; base=1000; vendas=2000; percentual=10.

Passos:

1. Enviar PUT /api/colaboradores/fc-1007 com os dados completos.
2. Comparar id, criadoEm, atualizadoEm e remuneração.
3. Consultar matrículas antiga/nova e conferir JSON.

Resultado esperado: HTTP 200; identidade preservada; atualizadoEm definido; adicional=200, final=1200; antiga 404/nova 200; três registros persistidos.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: altera um colaborador, preserva sua identidade e recalcula o salário.

## CT-022 - Impedir duplicidade na alteração

ID: CT-022

Título: Impedir duplicidade na alteração

Requisito(s): RN001, RF009

Pré-condição: FC-2007 e FC-1008 existem.

Dados de entrada: PUT FC-2007 com matrícula fc-1008; Mariana Oliveira Atualizada; Padrão; base=1000.

Passos:

1. Preparar alteração para matrícula de outro registro.
2. Enviar PUT completo.
3. Ler status e mensagem.

Resultado esperado: HTTP 409; mensagem A matrícula já está cadastrada.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: impede matrícula duplicada durante uma alteração.

## CT-023 - Tratar manutenção de registro inexistente

ID: CT-023

Título: Tratar manutenção de registro inexistente

Requisito(s): RF009

Pré-condição: NAO-EXISTE não está na base.

Dados de entrada: PUT NAO-EXISTE com FC-9999/Nome válido/Padrão/base=1000; DELETE NAO-EXISTE.

Passos:

1. Enviar alteração completa para matrícula inexistente.
2. Enviar exclusão para a mesma matrícula.
3. Conferir ambos os status.

Resultado esperado: PUT e DELETE retornam 404.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: responde 404 ao alterar ou excluir cadastro inexistente.

## CT-024 - Recuperar dados em nova instância

ID: CT-024

Título: Recuperar dados em nova instância

Requisito(s): RNF003, RF005

Pré-condição: Arquivo temporário compartilhado apenas entre as duas aplicações do teste.

Dados de entrada: ALIAS; Nome; tipoColaborador=Padrão; salarioBase=100.

Passos:

1. Cadastrar na primeira aplicação.
2. Criar segunda aplicação apontando ao mesmo JSON.
3. Consultar ALIAS pela segunda aplicação; encerrar e limpar.

Resultado esperado: Cadastro 201; consulta pela nova aplicação 200; salarioFinal=100. Testa reabertura do arquivo, não reinício completo do sistema operacional.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: mantém compatibilidade com tipoColaborador e com dados após reiniciar.

## CT-025 - Rejeitar tipos inválidos sem gravar

ID: CT-025

Título: Rejeitar tipos inválidos sem gravar

Requisito(s): RNF002, RN004

Pré-condição: API com arquivo JSON válido; guardar seu conteúdo antes.

Dados de entrada: Comissionado; INVALIDO/Teste/base=1000/percentual=10; valorVendas em null,true,[],{},espaço,abc,-1.

Passos:

1. Enviar um POST para cada valor inválido.
2. Verificar 400, mensagem e erro de campo valorVendas.
3. Comparar arquivo final com o conteúdo inicial.

Resultado esperado: Todos retornam 400 com erro de valorVendas; JSON permanece idêntico.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: express-validator retorna erros de campos sem alterar o arquivo.

## CT-026 - Preservar arquivo corrompido ao falhar

ID: CT-026

Título: Preservar arquivo corrompido ao falhar

Requisito(s): RNF003

Pré-condição: JSON temporário válido; guardar conteúdo para restaurar.

Dados de entrada: Substituir temporariamente por {invalido; GET /api/colaboradores.

Passos:

1. Corromper somente o arquivo temporário do teste.
2. Solicitar listagem e conferir status e conteúdo do arquivo.
3. Restaurar conteúdo original no bloco de limpeza.

Resultado esperado: HTTP 500; arquivo permanece {invalido até a restauração pelo teste.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: arquivo corrompido resulta em 500 e não é sobrescrito.

## CT-027 - Normalizar entrada e impedir salário forjado

ID: CT-027

Título: Normalizar entrada e impedir salário forjado

Requisito(s): RN008, RNF002, RF001

Pré-condição: Matrícula VALIDATOR livre.

Dados de entrada: matricula e nome com espaços; Padrão; salarioBase=string 1234.50; id=forjado; salarioFinal=1; valorVendas=999; campoExtra=ignorar.

Passos:

1. Enviar POST com campos legítimos e extras.
2. Ler identificação, base e salário calculado.
3. Conferir remoção dos campos indevidos; excluir dado de teste.

Resultado esperado: HTTP 201; textos aparados; base/final=1234.5; id diferente de forjado; campoExtra e valorVendas ausentes.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: express-validator normaliza campos e descarta dados não autorizados.

## CT-028 - Recalcular valores derivados ao consultar

ID: CT-028

Título: Recalcular valores derivados ao consultar

Requisito(s): RF006, RN008

Pré-condição: Comissionado base=2000/vendas=10500/percentual=7.5 e Produção base=1800/quantidade=180/valor=12.35 persistidos.

Dados de entrada: Alterar adicional e salarioFinal dos dois registros no JSON temporário para 1.

Passos:

1. Modificar somente os campos derivados no arquivo de teste.
2. Solicitar GET /api/colaboradores.
3. Conferir os valores recalculados das duas categorias.

Resultado esperado: HTTP 200; Comissionado adicional=787.5/final=2787.5; Produção adicional=2223/final=4023.

Resultado obtido: Asserções do cenário aprovadas na rodada de 06/10/2026 19:36:08 (America/Sao_Paulo).

Status: (X) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: backend/test/colaboradoresApi.test.ts :: recalcula salários ao consultar os registros persistidos.

## CT-029 - Validar usabilidade dos fluxos principais

ID: CT-029

Título: Validar usabilidade dos fluxos principais

Requisito(s): RNF001

Pré-condição: Frontend e API locais; operador disponível; dados fictícios; telas 1366×768 e 390×844.

Dados de entrada: UX-01; Pessoa Teste; Padrão; base=1500; repetir envio com nome vazio.

Passos:

1. Operador localiza cadastro, preenche campos rotulados e salva; registrar dificuldade.
2. Consultar o registro e abrir folha individual/consolidada em ambas as larguras.
3. Enviar nome vazio, conferir mensagem compreensível, legibilidade e ausência de sobreposição.

Resultado esperado: Operador conclui cadastro, consulta e folha; campos e ações identificáveis; erro explica correção; conteúdo legível nos dois tamanhos. Registrar observações e decisão do operador.

Resultado obtido: Não executado. Preencher após execução planejada, com observações e evidência.

Status: ( ) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: Execução manual/revisão planejada.

## CT-030 - Revisar extensão das categorias

ID: CT-030

Título: Revisar extensão das categorias

Requisito(s): RNF004

Pré-condição: Código disponível; revisão por desenvolvimento e QA; ramo de experimento isolado.

Dados de entrada: Categoria experimental com adicional fixo=100; base=1000; exemplos atuais do CT-006.

Passos:

1. Identificar subclasse, fábrica, tipos, validações e interface como pontos de extensão.
2. No ramo isolado, introduzir categoria experimental sem editar as fórmulas das três classes existentes.
3. Conferir diff, testar final=1100 da nova categoria e reexecutar regressão existente; registrar revisão.

Resultado esperado: Nova categoria calcula 1100; fórmulas existentes inalteradas e testes antigos aprovados. Documentar pontos alterados e parecer do revisor; experimento não entra na baseline automaticamente.

Resultado obtido: Não executado. Preencher após execução planejada, com observações e evidência.

Status: ( ) Passou  ( ) Falhou  ( ) Bloqueado

Evidência: Execução manual/revisão planejada.
