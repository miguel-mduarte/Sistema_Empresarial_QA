import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawnSync } from 'node:child_process';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mode = process.argv[2];
const commands = {
  verificar: ['scripts/preparar_a1.py', '--somente-verificar'],
  entrega: ['scripts/preparar_a1.py'],
  documentos: ['scripts/gerar_entrega_a1.py'],
  test: ['-m', 'unittest', 'discover', '-s', 'scripts/tests', '-v'],
};
if (!commands[mode]) {
  console.error('Use verificar, entrega, documentos ou test.');
  process.exit(1);
}
const localPython = path.join(root, '.venv', process.platform === 'win32' ? 'Scripts/python.exe' : 'bin/python');
const python = process.env.PYTHON || (existsSync(localPython) ? localPython : process.platform === 'win32' ? 'python' : 'python3');
const result = spawnSync(python, commands[mode], { cwd: root, stdio: 'inherit' });
if (result.error) console.error(`Não foi possível iniciar Python: ${result.error.message}. Configure PYTHON ou crie .venv.`);
process.exit(result.status ?? 1);
