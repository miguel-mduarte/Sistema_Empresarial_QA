import createApp from './backend/dist/app.js';
const app = createApp({ databasePath: process.env.COLABORADORES_DB_PATH });
app.listen(3183, '127.0.0.1', () => console.log('Folha Clara API: 127.0.0.1:3183'));
