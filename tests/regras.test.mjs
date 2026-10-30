import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  personagemNovo, calcular, modificador, custoCompra, rolar4d6, atributosFinais, pendencias, inventario,
} from '../app/js/regras.js';
import { CLASSES, ANTECEDENTES, ESPECIES, LISTAS_MAGIA, MAGIAS, ARMAS } from '../app/js/dados.js';

function guerreiroAnao() {
  const p = personagemNovo();
  p.conceito.nome = 'Borin';
  p.classe = { id: 'guerreiro', opcao: null, estilo: 'defesa', invocacao: null, maestria: ['espada-grande', 'mangual', 'azagaia'] };
  p.antecedente.id = 'soldado';
  p.antecedente.ferramenta = 'Dados';
  p.especie = { id: 'anao', opcoes: {} };
  p.atributos.metodo = 'padrao';
  p.atributos.base = { for: 15, des: 13, con: 14, int: 8, sab: 12, car: 10 };
  p.atributos.bonus = { modo: '2-1', mais2: 'for', mais1: 'con' };
  p.pericias.classe = ['percepcao', 'sobrevivencia'];
  p.idiomas = ['anao', 'gigante'];
  p.detalhes.tendencia = 'Leal e Bom';
  return p;
}

test('modificador segue a tabela do SRD', () => {
  assert.equal(modificador(3), -4);
  assert.equal(modificador(8), -1);
  assert.equal(modificador(10), 0);
  assert.equal(modificador(15), 2);
  assert.equal(modificador(20), 5);
});

test('compra de pontos: 15,15,15,8,8,8 custa 27', () => {
  assert.deepEqual(custoCompra({ for: 15, des: 15, con: 15, int: 8, sab: 8, car: 8 }), { gasto: 27, resta: 0 });
  assert.equal(custoCompra({ for: 14, des: 14, con: 14, int: 14, sab: 8, car: 8 }).resta, -1);
});

test('4d6 descarta o menor dado', () => {
  const seq = [3, 6, 1, 5];
  const r = rolar4d6(() => seq.shift());
  assert.equal(r.total, 14);
  assert.equal(r.descartado, 2);
});

test('bônus do antecedente: +2/+1 e teto 20', () => {
  const p = guerreiroAnao();
  p.atributos.base.for = 19;
  const f = atributosFinais(p);
  assert.equal(f.for, 20);
  assert.equal(f.con, 15);
  p.atributos.bonus = { modo: '1-1-1' };
  const g = atributosFinais(p);
  assert.deepEqual([g.for, g.des, g.con], [20, 14, 15]);
});

test('guerreiro anão soldado: PV, CA, iniciativa e ataques', () => {
  const d = calcular(guerreiroAnao());
  // FOR 17 (+3), DES 13 (+1), CON 15 (+2)
  assert.equal(d.pvMax, 10 + 2 + 1); // d10 + CON + Robustez Anã
  assert.equal(d.ca.ca, 17); // Cota de Malha 16 + Defesa 1
  assert.equal(d.iniciativa, 1);
  assert.equal(d.deslocamento, 9);
  const espada = d.ataques.find((a) => a.id === 'espada-grande');
  assert.equal(espada.bonus, 5);
  assert.match(espada.dano, /^2d6 \+3 cortante/);
  assert.equal(espada.maestria, 'raspao');
  const lanca = d.ataques.find((a) => a.id === 'lanca');
  assert.equal(lanca.qtd, 1);
  assert.equal(d.salvaguardas.find((s) => s.id === 'for').bonus, 5);
  assert.equal(d.percepcaoPassiva, 10 + 1 + 2);
  assert.deepEqual(d.avisos, []);
  assert.deepEqual(pendencias(guerreiroAnao()), {});
});

test('ouro: kits A do guerreiro (4) e do soldado (14) = 18 PO', () => {
  const inv = inventario(guerreiroAnao());
  assert.equal(inv.pc, 1800);
});

test('monge usa Defesa sem Armadura com SAB e artes marciais', () => {
  const p = guerreiroAnao();
  p.classe = { id: 'monge', opcao: null, estilo: null, invocacao: null, maestria: [] };
  p.atributos.base = { for: 12, des: 15, con: 13, int: 10, sab: 14, car: 8 };
  p.atributos.bonus = { modo: '2-1', mais2: 'des', mais1: 'con' };
  const d = calcular(p);
  assert.equal(d.ca.ca, 10 + 3 + 2);
  const soco = d.ataques.find((a) => a.id === 'desarmado');
  assert.match(soco.dano, /^1d6 \+3/);
});

test('alerta soma proficiência na iniciativa; mago tem CD de magia', () => {
  const p = personagemNovo();
  p.classe.id = 'mago';
  p.antecedente.id = 'criminoso';
  p.especie = { id: 'humano', opcoes: { tamanho: 'Médio', pericia: 'percepcao', talento: 'habilidoso' } };
  p.atributos.metodo = 'padrao';
  p.atributos.base = { for: 8, des: 14, con: 13, int: 15, sab: 12, car: 10 };
  p.atributos.bonus = { modo: '2-1', mais2: 'int', mais1: 'des' };
  const d = calcular(p);
  assert.equal(d.iniciativa, 2 + 2);
  assert.equal(d.magia.cd, 8 + 2 + 3);
  assert.equal(d.magia.ataque, 5);
  assert.equal(d.pvMax, 6 + 1);
});

test('clérigo taumaturgo ganha truque extra e bônus em Religião', () => {
  const p = guerreiroAnao();
  p.classe = { id: 'clerigo', opcao: 'taumaturgo', estilo: null, invocacao: null, maestria: [] };
  p.atributos.base = { for: 14, des: 8, con: 13, int: 10, sab: 15, car: 12 };
  p.atributos.bonus = { modo: '2-1', mais2: 'con', mais1: 'for' };
  const d = calcular(p);
  assert.equal(d.magia.limiteTruques, 4);
  assert.equal(d.pericias.find((s) => s.id === 'religiao').bonus, 0 + 2);
  // Camisão de malha 13 + DES (−1) + escudo 2
  assert.equal(d.ca.ca, 14);
});

test('dados consistentes: listas de magia, armas dos kits e espécies', () => {
  for (const [cls, lista] of Object.entries(LISTAS_MAGIA)) {
    for (const id of lista) assert.ok(MAGIAS[id], `${cls}: magia ${id} sem dados`);
  }
  for (const [id, c] of Object.entries({ ...CLASSES, ...ANTECEDENTES })) {
    for (const k of c.kits) for (const a of k.armas) assert.ok(ARMAS[a], `${id}: arma ${a} sem dados`);
  }
  for (const [id, e] of Object.entries(ESPECIES)) assert.ok(Array.isArray(e.tracos({})), id);
});
