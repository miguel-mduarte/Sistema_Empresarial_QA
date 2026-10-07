# 2. Especificação de requisitos de software

## Origem e convenções

Baseline do produto: `T1 - Requisitos do Cliente.docx`, seções 1 a 9.
Os IDs RF001-RF009, RN001-RN008 e RNF001-RNF004 foram preservados.
Critérios CA e decisões D abaixo operacionalizam a especificação para teste;
não são novos requisitos atribuídos ao cliente. Prioridade alta para todos os
RFs; RF009 e RN001 são recomendações do cliente adotadas pela equipe.

Administrador é o ator que opera o sistema; não implica login implementado.
Salário base é a parcela fixa; adicional é comissão ou produtividade; salário
final é base mais adicional. Matrícula é identificador de negócio; UUID `id`
é a identidade técnica. Valores de entrada são números não negativos.

## Requisitos funcionais e critérios de aceitação

| ID | Especificação | Critério de aceitação verificável |
| --- | --- | --- |
| RF001 | Cadastrar matrícula, nome, salário base e tipo | CA001: dados válidos geram HTTP 201, identidade e cadastro consultável; entradas inválidas são rejeitadas |
| RF002 | Cadastrar colaborador Padrão | CA002: base 1800 resulta em adicional 0 e final 1800 |
| RF003 | Cadastrar Comissionado com vendas e percentual | CA003: vendas 10000 e percentual 5 são armazenados; com base 2000, final 2500 |
| RF004 | Cadastrar Produção com quantidade e valor por unidade | CA004: quantidade 80 e valor 12,50 são armazenados; com base 1500, final 2500 |
| RF005 | Listar dados cadastrais e remuneratórios | CA005: listar e consultar retornam matrícula, nome, tipo, base, adicional e final calculado |
| RF006 | Calcular salário automaticamente conforme categoria | CA006: base 1000 retorna 1000 para Padrão, 1200 com vendas 2000 a 10%, 1100 com 20 unidades a 5 |
| RF007 | Gerar folha para todos os colaboradores | CA007: folha consolidada contém cada cadastro e seus valores; detalhe individual retorna apenas o colaborador solicitado |
| RF008 | Apresentar total geral da folha | CA008: salários 1800 e 1500 resultam em total 3300 e quantidade 2; totais por categoria reconciliam com o geral |
| RF009 | Incluir, alterar, excluir e consultar | CA009: alteração persiste e recalcula preservando identidade; exclusão remove consulta e participação na folha |

Folha individual e detalhamento de base/adicionais derivam das seções 2, 6 e 9
do cliente e são vinculados a RF005-RF007. Quantidade e totais por categoria
derivam da seção 6 e complementam RF008. Não se criaram RFs fictícios para eles.

## Regras de negócio

| ID | Regra do cliente | Critério de aceitação |
| --- | --- | --- |
| RN001 | Matrícula única | CA-RN001: duplicata no cadastro ou alteração retorna 409; dados anteriores são mantidos |
| RN002 | Nome obrigatório | CA-RN002: nome vazio ou somente espaços retorna 400 |
| RN003 | Salário base não negativo | CA-RN003: -0,01 rejeitado; zero permitido |
| RN004 | Vendas não negativas | CA-RN004: vendas -0,01 rejeitadas para Comissionado |
| RN005 | Comissão percentual não negativa | CA-RN005: percentual -0,01 rejeitado para Comissionado |
| RN006 | Quantidade produzida não negativa | CA-RN006: quantidade -1 rejeitada para Produção |
| RN007 | Valor por unidade não negativo | CA-RN007: valor -0,01 rejeitado para Produção |
| RN008 | Salário final automático | CA-RN008: calcular e recalcular pelo domínio; salário final enviado pelo cliente não determina a remuneração |

## Fórmulas e decisões de interpretação

- D01: Padrão: final = base. Comissionado: adicional = vendas × percentual / 100; final = base + adicional. Produção: adicional = quantidade × valor unitário; final = base + adicional.
- D02: API recebe percentual em pontos percentuais (5 significa 5%). A fórmula do cliente usa a taxa; dividir por 100 converte o dado de entrada. Não se impõe limite superior de 100%, pois não foi especificado.
- D03: base e adicionais são apresentados com duas casas. O código arredonda adicional e final com `Math.round((valor + Number.EPSILON) * 100) / 100`. Não se declara precisão financeira arbitrária.
- D04: matrícula é aparada e comparada sem distinguir maiúsculas; acentos continuam significativos (`sensitivity: accent`). Alteração exige cadastro completo.
- D05: folha representa o estado atual, sem competência ou histórico mensal. Exclusão elimina o registro da folha atual.
- D06: faltam limites de magnitude e escala numérica no documento do cliente. Revisar com o cliente antes de alegar suporte a valores extremos ou regras trabalhistas.

## Requisitos não funcionais

| ID | Texto / intenção do cliente | Critério operacional proposto pela equipe |
| --- | --- | --- |
| RNF001 | Interface amigável e intuitiva | CA-NF001: operador percorre cadastro, consulta e folha; campos têm rótulos, erro é compreensível, dados são legíveis em 1366×768 e 390×844; CT-029 manual |
| RNF002 | Validar dados antes de calcular | CA-NF002: entradas obrigatórias, tipos e números inválidos retornam 400 antes de gravar; arquivo permanece idêntico |
| RNF003 | Armazenamento persistente | CA-NF003: nova instância da API usando o mesmo JSON recupera os cadastros e cálculos; CT-024 |
| RNF004 | Novos tipos sem mudar cálculos existentes | CA-NF004: nova subclasse pode implementar adicional e ser registrada na fábrica/tipos/validação sem editar fórmulas das três classes existentes; CT-030 de revisão |

RNF001 não é comprovado por cobertura do backend. RNF004 permite alterar pontos
de registro e formulários; não promete extensão sem qualquer modificação.
Critérios operacionais e decisões D01-D06 devem ser confirmados na revisão da
baseline. Critérios de aprovação documental estão no PGQ; aceite final é da A3.
