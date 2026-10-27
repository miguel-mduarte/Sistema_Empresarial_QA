import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync, execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dest = path.join(root, 'docs/a3/evidencias');
fs.mkdirSync(dest, { recursive: true });
const runs = [];
const commands = [
  ['backend', 'npm', ['run', 'typecheck']], ['backend', 'npm', ['run', 'lint']],
  ['backend', 'npm', ['run', 'build']],
  ['frontend', 'npm', ['run', 'typecheck']], ['frontend', 'npm', ['run', 'lint']],
  ['frontend', 'npm', ['run', 'build']],
  ['backend', 'npm', ['run', 'test:coverage', '--', '--reporter=default', '--reporter=json', `--outputFile=${dest}/backend.json`]],
  ['frontend', 'npm', ['test', '--', '--reporter=default', '--reporter=json', `--outputFile=${dest}/frontend.json`]],
  ['.', process.execPath, ['--test', 'scripts/test_banco_a3.mjs']],
];
const startedAt = new Date().toISOString();
for (const [cwd, command, args] of commands) {
  const result = spawnSync(command, args, { cwd: path.join(root, cwd), encoding: 'utf8' });
  const log = `check-${runs.length + 1}.log`;
  fs.writeFileSync(path.join(dest, log), (result.stdout || '') + (result.stderr || '') + (result.error?.message || ''));
  runs.push({ cwd, command: [command, ...args].join(' '), exitCode: result.status, log });
  console.log(`${cwd}: ${command} ${args.slice(0, 2).join(' ')} => ${result.status}`);
  if (result.status !== 0) {
    fs.writeFileSync(path.join(dest, 'ultima_falha.json'), JSON.stringify({ startedAt, runs }, null, 2));
    console.error(`Verificação interrompida. Consulte ${dest}/${log}`);
    process.exit(1);
  }
}
const hashes = {};
function inventory(dir) {
  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {
    if (item.isSymbolicLink() || ['node_modules', 'dist', 'coverage', '.git'].includes(item.name)) continue;
    const p = path.join(dir, item.name);
    if (p === path.join(root, 'backend/data')) continue;
    if (item.name.startsWith('.env') && item.name !== '.env.example') continue;
    if (item.isDirectory()) inventory(p);
    else hashes[path.relative(root, p)] = createHash('sha256').update(fs.readFileSync(p)).digest('hex');
  }
}
inventory(path.join(root, 'backend'));
inventory(path.join(root, 'frontend'));
fs.copyFileSync(path.join(root, 'backend/coverage/coverage-final.json'), path.join(dest, 'coverage-final.json'));
fs.writeFileSync(path.join(dest, 'execucao.json'), JSON.stringify({ startedAt, finishedAt: new Date().toISOString(),
  node: process.version, baseCommit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  runs, hashes }, null, 2));
console.log('Evidências A3 salvas. Não implica homologação humana.');
