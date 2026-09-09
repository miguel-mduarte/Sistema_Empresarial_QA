# Folha Clara

Projeto React + TypeScript para o sistema de folha de pagamento, com Vite.

Componentes e páginas usam `.tsx`; hooks, serviços e utilitários usam `.ts`.
A entrada é `src/main.tsx`, que monta o `App.tsx`.
Os tipos de colaboradores, formulários e folha de pagamento ficam em
`src/types/colaborador.ts`. A configuração do Vite está em `vite.config.ts`.

## Verificação e build

```sh
npm run typecheck
npm run lint
npm run build
```

O build verifica os tipos em modo estrito antes de gerar os arquivos em `dist/`.
A variável opcional `VITE_API_URL` configura a URL da API; por padrão, é `/api`.

## Desenvolvimento

```sh
npm run dev
```

Abra o endereço exibido pelo Vite no terminal.

As dependências deste projeto devem ser instaladas usando o registry alternativo:

```sh
npm install --registry=https://registry.npmmirror.com
```
