import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('./banco_a3.mjs', import.meta.url));
test('RNF003 - inicialização, demonstração, backup e restauração sem sobrescrita', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'a3-banco-'));
  const call = (...args) => spawnSync(process.execPath, [script, ...args], { encoding: 'utf8' });
  try {
    const empty = path.join(dir, 'empty.json');
    const demo = path.join(dir, 'demo.json');
    const backup = path.join(dir, 'backup.json');
    const restored = path.join(dir, 'restored.json');
    assert.equal(call('init', empty).status, 0);
    assert.deepEqual(JSON.parse(fs.readFileSync(empty)), []);
    assert.equal(call('demo', demo).status, 0);
    assert.equal(JSON.parse(fs.readFileSync(demo)).length, 3);
    assert.equal(call('check', demo).status, 0);
    assert.equal(call('backup', demo, backup).status, 0);
    assert.equal(call('restore', backup, restored).status, 0);
    assert.equal(fs.readFileSync(demo, 'utf8'), fs.readFileSync(restored, 'utf8'));
    assert.equal(call('restore', backup, restored).status, 1);
    assert.equal(call('init', demo).status, 1);
    fs.writeFileSync(empty, '[{"matricula":"."}]');
    assert.equal(call('restore', empty, path.join(dir, 'bad.json')).status, 1);
    assert.equal(fs.existsSync(path.join(dir, 'bad.json')), false);
  } finally { fs.rmSync(dir, { recursive: true }); }
});
