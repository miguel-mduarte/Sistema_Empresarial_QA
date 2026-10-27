import fs from 'node:fs';
import path from 'node:path';
import validarColaborador from '../backend/dist/data/colaboradorParser.js';
import Factory from '../backend/dist/models/colaboradorFactory.js';
import { somarMoeda } from '../backend/dist/models/valoresMonetarios.js';

function validar(content) {
  const list = JSON.parse(content);
  if (!Array.isArray(list)) throw new Error('O arquivo deve conter uma lista JSON.');
  const matriculas = [];
  const registros = list.map((item) => {
    const dados = validarColaborador(item);
    if (['.', '..'].includes(dados.matricula)) throw new Error('Matrícula reservada.');
    if (matriculas.some((m) => m.localeCompare(dados.matricula, 'pt-BR', { sensitivity: 'accent' }) === 0)) {
      throw new Error('Matrícula duplicada.');
    }
    matriculas.push(dados.matricula);
    return Factory.criar({ ...dados, id: item.id, criadoEm: item.criadoEm, atualizadoEm: item.atualizadoEm });
  });
  somarMoeda(registros.map((item) => item.salarioFinal));
  return registros;
}

const [command, input, destination] = process.argv.slice(2);
try {
  if (!input || !['init', 'demo', 'backup', 'restore', 'check'].includes(command)) {
    throw new Error('Uso: banco_a3.mjs init|demo|check ARQUIVO ou backup|restore ORIGEM NOVO_DESTINO. Nunca sobrescreve arquivos.');
  }
  if (['init', 'demo'].includes(command)) {
    const values = command === 'init' ? [] : [
      { matricula: 'DEMO-P', nome: 'Ana Exemplo', tipo: 'Padrão', salarioBase: 1800 },
      { matricula: 'DEMO-C', nome: 'Bruno Exemplo', tipo: 'Comissionado', salarioBase: 2000, valorVendas: 10000, percentualComissao: 5 },
      { matricula: 'DEMO-R', nome: 'Carla Exemplo', tipo: 'Produção', salarioBase: 1500, quantidadeProduzida: 80, valorPorUnidade: 12.5 },
    ];
    const content = JSON.stringify(validar(JSON.stringify(values)), null, 2) + '\n';
    fs.mkdirSync(path.dirname(path.resolve(input)), { recursive: true });
    fs.writeFileSync(input, content, { flag: 'wx' });
  } else {
    const content = fs.readFileSync(input, 'utf8');
    validar(content);
    if (command !== 'check') {
      if (!destination) throw new Error('Informe um destino novo.');
      fs.mkdirSync(path.dirname(path.resolve(destination)), { recursive: true });
      // Preserva bytes e metadados do backup; valida antes de copiar.
      fs.writeFileSync(destination, content, { flag: 'wx' });
    }
  }
  console.log(`Operação ${command} concluída. Nenhum arquivo existente foi sobrescrito.`);
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
