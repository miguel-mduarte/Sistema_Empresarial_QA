# Folha Clara na VPS

Instalação em 20/10/2026, via `ssh vps-pizzaria`.

- URL pública: http://164.163.10.12:8083
- API pelo mesmo endereço, em `/api`.
- Diretório remoto: `/home/felipe/apps/folha-clara`.
- Release: `releases/20261020`; link `current` aponta para ela.
- Dados persistentes: `data/colaboradores.json`, fora da release. Base inicialmente vazia; dados locais não foram enviados.
- API escuta somente em `127.0.0.1:3183`.
- Nginx independente do usuário escuta em `0.0.0.0:8083`.
- Serviços systemd do usuário: `folha-clara-api` e `folha-clara-web`, habilitados na inicialização (Linger=yes).

## Operação

```sh
ssh vps-pizzaria 'systemctl --user status folha-clara-api folha-clara-web'
ssh vps-pizzaria 'journalctl --user -u folha-clara-api -n 50 --no-pager'
ssh vps-pizzaria 'systemctl --user restart folha-clara-api folha-clara-web'
```

As configurações nesta pasta foram copiadas para a release. O arquivo `server.mjs` importa o aplicativo compilado e limita a API ao loopback. Apenas artefatos compilados, manifests npm e configurações de deploy foram transferidos; nenhum `.env` ou documento acadêmico foi enviado.

## Validação e pendência

Builds do front e back passaram; 59 testes do backend passaram fora do sandbox.
Front e API respondem internamente na VPS. Cadastro, leitura e cálculo de folha foram testados via HTTP com um registro temporário removido ao final.
Após a liberação da porta 8083 no UFW pelo usuário, o acesso externo ao HTML e à API de folha foi confirmado em 20/10/2026, com resposta HTTP 200 e JSON válido.

Teste visual no navegador ainda pendente. O protótipo não possui autenticação; use dados fictícios na demonstração pública.
