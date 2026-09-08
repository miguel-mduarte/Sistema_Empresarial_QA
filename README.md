# Folha Clara

Sistema de folha de pagamento com interface web em português e persistência em arquivo JSON, sem banco de dados e sem dependências externas. Requer Node.js 22 ou superior.

## Executar

```sh
npm start
```

Acesse **http://localhost:3000**. Não é necessário instalar pacotes, configurar banco ou executar seed. O sistema inicia vazio; o diretório `data` e o arquivo `data/colaboradores.json` são criados no primeiro cadastro. Os registros continuam disponíveis após reiniciar o servidor.

Para desenvolvimento: `npm run dev`. Para testes: `npm test`.

Porta alternativa: `PORT=3001 npm start`. Arquivo alternativo: `DATA_FILE=/caminho/colaboradores.json npm start`.
