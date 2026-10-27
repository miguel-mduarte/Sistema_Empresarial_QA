# Manual do usuário

## Finalidade

O Folha Clara cadastra colaboradores, calcula a remuneração atual e apresenta
folhas individual e consolidada. Os valores são acadêmicos, sem encargos, descontos
ou histórico mensal. Utilize dados fictícios na apresentação.

## Instalação e configuração

Instale Node.js 22.13 ou superior e npm. Extraia 05_Codigo_Fonte do pacote e abra
um terminal nessa pasta. Execute, nesta ordem:

- npm --prefix backend ci
- npm --prefix frontend ci
- npm run build
- npm start

Abra http://127.0.0.1:3000. A interface e a API são servidas juntas; não é necessário
iniciar o Vite. A primeira execução cria backend/data/colaboradores.json vazio.
Se a instalação padrão não estiver acessível, o projeto também foi instalado
com --registry=https://registry.npmmirror.com. Prefira a configuração institucional.

O servidor integrado lê variáveis do ambiente: PORT (padrão 3000), HOST (padrão
127.0.0.1) e COLABORADORES_DB_PATH (caminho do JSON). Não publica o sistema na internet.
Exemplo Linux/macOS para demonstração isolada, depois do build:

- npm run banco -- demo ./dados-demo.json
- COLABORADORES_DB_PATH=./dados-demo.json npm start

No PowerShell, defina $env:COLABORADORES_DB_PATH="./dados-demo.json" antes de npm start.
Se o arquivo já existir, o comando demo falha em vez de sobrescrever.

## Cadastrar e consultar

1. Abra Colaboradores no menu.
2. Informe matrícula única, nome e salário base não negativo.
3. Selecione a categoria e preencha os dados específicos.
4. Clique em Salvar colaborador. Confira a mensagem de sucesso e a linha na tabela.

Padrão recebe apenas a base. Comissionado soma vendas multiplicadas pelo percentual
dividido por 100: informe 5 para 5%. Produção soma quantidade multiplicada pelo valor
unitário. Exemplo: base 1500, quantidade 80, unidade 12,50 resulta em 2500.
Os números usam a convenção aceita pelo navegador; confira o valor antes de salvar.

Campos vazios, negativos, matrículas duplicadas e os identificadores ponto ou dois
pontos consecutivos são rejeitados. Corrija o campo indicado e reenvie. Valores que
ultrapassem o limite técnico exibem mensagem; não são gravados silenciosamente.

## Alterar e excluir

Na tabela, clique em Editar no colaborador desejado. Revise os campos e clique em
Salvar alterações. A remuneração é recalculada e o identificador técnico preservado.
Cancelar fecha a edição sem gravar. Recarregar a página confirma a persistência.

Excluir abre uma confirmação com nome e matrícula. Cancelar preserva o cadastro;
Confirmar exclusão remove o colaborador e sua participação na folha atual. Não há
lixeira nem desfazer pela interface: faça backup antes de alterações importantes.

## Gerar relatórios

Abra Folha de pagamento. Confira matrícula, nome, categoria, base, adicionais e
salário final; ao final estão quantidade, total geral e totais por categoria.
Clique em Ver folha individual na linha desejada. O relatório individual mostra
somente aquele colaborador. Voltar à folha consolidada retorna à lista.

Imprimir folha ou Imprimir / salvar PDF solicita a impressão do navegador. Escolha
Salvar como PDF, papel A4 e confira a prévia antes de salvar. Abra o arquivo salvo
e verifique todos os campos e páginas. A validação da impressão foi confirmada
pelo QA no CT-A3-010 após a correção do layout A4.

## Backup e recuperação

Encerre o servidor com Ctrl+C antes da manutenção dos dados. Na raiz dos fontes:

- npm run banco -- check backend/data/colaboradores.json
- npm run banco -- backup backend/data/colaboradores.json backups/folha-2026-10-27.json
- npm run banco -- restore backups/folha-2026-10-27.json dados-restaurados.json

A restauração exige um destino novo. Depois, configure COLABORADORES_DB_PATH para
esse arquivo e reinicie. Preserve o arquivo anterior para reversão. Não apague
dados para resolver mensagens de erro. Os backups podem conter dados pessoais;
guarde-os em local protegido e não os publique no repositório.

## Problemas frequentes

Porta ocupada: encerre outra instância ou configure PORT. Erro de conexão: confirme
que npm start está ativo e acesse o endereço indicado. JSON inválido: pare o servidor,
preserve uma cópia e restaure um backup validado em novo caminho. Não abra duas APIs
escrevendo no mesmo JSON. Para sair, encerre o processo com Ctrl+C.
