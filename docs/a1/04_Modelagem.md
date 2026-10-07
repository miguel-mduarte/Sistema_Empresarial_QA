# 4. Modelagem UML

Três diagramas aparecem desenhados no PDF e possuem fontes PlantUML em
`diagramas/`. A modelagem representa o código inspecionado em 29/09/2026.

## Casos de uso

UC01-UC04 preservam os nomes do cliente. UC05-UC08 detalham manutenção,
cálculo e folha individual. Um único ator, Administrador, representa o operador.

| Caso | Requisitos | Fluxo principal e pós-condição | Alternativas |
| --- | --- | --- | --- |
| UC01 Cadastrar | RF001-RF004, RN001-RN008 | Informar identificação; selecionar tipo; preencher remuneração; confirmar; validar, calcular e persistir | Entrada inválida: 400; duplicata: 409; nenhum cadastro novo |
| UC02 Consultar | RF005 | Abrir colaboradores; solicitar lista/detalhe; recuperar e calcular dados; exibir | Lista vazia: 200 com []; matrícula ausente: 404 |
| UC03 Gerar folha | RF006, RF007 | Solicitar folha; ler registros; executar UC07 para cada item; exibir detalhamento | Nenhum cadastro: itens vazios; falha de persistência: erro |
| UC04 Emitir resumo | RF008 | Solicitar resumo; calcular folha; somar quantidades, valores e categorias; exibir | Base vazia: totais e quantidades zero |
| UC05 Alterar cadastro | RF009 | Consultar matrícula; editar dados completos; validar; recalcular; persistir mantendo id | Ausente: 404; matrícula em uso: 409; inválido: 400 |
| UC06 Excluir cadastro | RF009 | Selecionar registro; confirmar na interface; excluir; atualizar consulta/folha | Cancelamento não envia exclusão; ausente: 404 |
| UC07 Calcular remuneração | RF006, RN008 | Instanciar categoria; calcular adicional; arredondar; obter final | Categoria inválida é bloqueada pela validação |
| UC08 Emitir folha individual | RF005-RF007 | Selecionar matrícula; buscar e calcular colaborador; exibir folha individual | Ausente: 404; matrícula vazia: 400 |

Pré-condições comuns: aplicação disponível, JSON acessível e entradas válidas
para o fluxo de sucesso. UC05/UC06/UC08 exigem cadastro existente.
UC07 é incluído pelos fluxos que calculam; não é uma ação separada na interface.

## Classes

`Colaborador` contém identificação, base, adicional e final, além de
`calcularAdicional()` e `definirRemuneracao()`. É classe concreta no código.
`ColaboradorPadrao`, `ColaboradorComissionado` e `ColaboradorProducao` herdam
dela. A fábrica cria a classe adequada. O repositório persiste registros JSON.
Services e controllers são módulos com funções, não classes; foram omitidos do
diagrama de classes e aparecem na sequência e arquitetura.

## Sequência

Fluxo escolhido: cadastro comissionado (UC01), pois atravessa interface,
validação, serviço, fábrica, modelo e persistência. O fragmento alternativo
distingue sucesso (201), entrada inválida (400) e matrícula duplicada (409).
A validação ocorre antes da criação do modelo e da gravação.
