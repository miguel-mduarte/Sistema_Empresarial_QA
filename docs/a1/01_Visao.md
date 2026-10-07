# 1. Documento de visão do sistema

## Objetivo

Centralizar o cadastro de colaboradores e calcular automaticamente a remuneração
das três categorias do cliente, permitindo consultar dados, emitir folhas
individuais e consolidadas e conhecer o custo total da folha.

## Escopo incluído

Cadastro com matrícula, nome, tipo e salário base; vendas e percentual para
Comissionado; quantidade e valor unitário para Produção; consulta, alteração e
exclusão; validação; cálculo automático; persistência no backend; folha com
base, adicional e salário final; resumo com quantidade, total geral e total
por categoria. RF009, RN001 e resumo por categoria, recomendados pelo cliente,
foram adotados no escopo da equipe.

## Fora do escopo

Tributos, INSS, FGTS, IRRF, férias, 13º salário, descontos, integração bancária,
controle de ponto, autenticação, múltiplas empresas e histórico mensal. Não
se interpreta a remuneração acadêmica como uma folha legal ou salário líquido.
Inclusões futuras precisam de avaliação de impacto em ERS, arquitetura e testes.

## Partes interessadas

| Parte | Interesse | Participação esperada |
| --- | --- | --- |
| Administrador / operador de RH | Cadastrar e obter valores corretos | Validar fluxos e clareza das mensagens |
| Gestor | Conhecer custo total e por categoria | Conferir resumo e relatórios |
| Colaborador | Dados e remuneração corretos | Interessado nos resultados; sem acesso próprio previsto |
| Professor / cliente acadêmico | Conformidade e evidências | Avaliar artefatos e esclarecer ambiguidades |
| Equipe de desenvolvimento | Solução testável e sustentável | Implementar, revisar, testar e documentar |

## Premissas

Operador fornece dados corretos e possui acesso autorizado à máquina; uma API
local gerencia um arquivo JSON; Node e navegador estão disponíveis; dados de
demonstração são fictícios; valores monetários são apresentados em reais.
A percentagem informada como 5 significa 5%, convenção explicitada na ERS.

## Restrições

A1 até 20/10/2026; A3 até 01/12/2026. A entrega A1 prioriza planejamento,
modelagem e qualidade. Persistência em JSON é a decisão atual do projeto.
Não há suporte garantido a escrita concorrente entre processos nem controle de
acesso por usuário. A documentação deve refletir a implementação inspecionada,
sem atribuir aprovação a testes manuais ainda não realizados.

## Benefícios e indicadores

Reduzir cálculo manual (três fórmulas automatizadas); reduzir inconsistências
(validação das oito regras de negócio); facilitar conferência (folha individual,
consolidada e totais); permitir auditoria acadêmica (cada requisito ligado a
critério de aceitação, caso de uso, componente e caso de teste). O benefício é
esperado; não foi medido ganho de produtividade com usuários reais.
