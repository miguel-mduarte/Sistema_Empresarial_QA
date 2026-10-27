import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import express from '../backend/node_modules/express/index.js';
import createApp from '../backend/dist/app.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const frontend = path.join(root, 'frontend/dist');
if (!existsSync(path.join(frontend, 'index.html'))) throw new Error('Execute npm run build na raiz antes de iniciar.');
const databasePath = process.env.COLABORADORES_DB_PATH || path.join(root, 'backend/data/colaboradores.json');
const app = createApp({ databasePath });
app.use(express.static(frontend));
app.use((req, res) => {
  if (req.method !== 'GET' || req.path.startsWith('/api/')) return res.status(404).json({ mensagem: 'Rota não encontrada.' });
  return res.sendFile(path.join(frontend, 'index.html'));
});
const host = process.env.HOST || '127.0.0.1';
const port = Number(process.env.PORT || 3000);
const server = app.listen(port, host, () => console.log(`Folha Clara: http://${host}:${server.address().port}`));
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
