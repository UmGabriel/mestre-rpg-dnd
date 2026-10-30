// Gera regras/glossario-2024.md: nomes em inglês (SRD 5.2) → português (Livro do Jogador 2024, tradução da comunidade).
// O glossário vai para o Projeto do Claude, para o Mestre narrar com os mesmos termos do app.
// Uso: npm run glossario
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import * as D from '../app/js/dados.js';

export const ARQUIVO = fileURLToPath(new URL('../regras/glossario-2024.md', import.meta.url));

// Termos de regra que não estão em dados.js (glossário de regras do livro).
const GERAIS = [
  ['Spell level (1st-level spell)', 'Círculo (magia de 1º círculo)'], ['Cantrip', 'Truque'],
  ['Hit Point Die', 'Dado de Ponto de Vida'], ['Bonus Action', 'Ação Bônus'], ['Reaction', 'Reação'],
  ['Short Rest / Long Rest', 'Descanso Curto / Descanso Longo'], ['Proficiency Bonus', 'Bônus de Proficiência'],
  ['Saving Throw', 'Salvaguarda'], ['D20 Test', 'Teste de D20'], ['Heroic Inspiration', 'Inspiração Heroica'],
  ['Expertise', 'Especialização'], ['Unarmed Strike', 'Ataque Desarmado'], ['Dash', 'Correr'],
  ['Magic action', 'Usar Magia'], ['Utilize action', 'Usar Objeto'], ['Tremorsense', 'Sismiconsciência'],
  ['Darkvision', 'Visão no Escuro'], ['Speed', 'Deslocamento'], ['Alignment', 'Alinhamento'],
  ['Lawful / Chaotic', 'Ordeiro / Caótico'], ['Spellbook', 'Livro de Magias'], ['Reach (weapon property)', 'Extensão'],
  ['Origin feat', 'Talento de Origem'], ['Fiendish Legacy', 'Legado Ínfero'], ['Draconic Ancestry', 'Herança Dracônica'],
];
const DANO = [
  ['Acid', 'Ácido'], ['Bludgeoning', 'Contundente'], ['Cold', 'Gélido'], ['Fire', 'Ígneo'], ['Force', 'Energético'],
  ['Lightning', 'Elétrico'], ['Necrotic', 'Necrótico'], ['Piercing', 'Perfurante'], ['Poison', 'Venenoso'],
  ['Psychic', 'Psíquico'], ['Radiant', 'Radiante'], ['Slashing', 'Cortante'], ['Thunder', 'Trovejante'],
];
const CONDICOES = [
  ['Blinded', 'Cego'], ['Charmed', 'Enfeitiçado'], ['Deafened', 'Surdo'], ['Exhaustion', 'Exaustão'],
  ['Frightened', 'Amedrontado'], ['Grappled', 'Imobilizado'], ['Incapacitated', 'Incapacitado'], ['Invisible', 'Invisível'],
  ['Paralyzed', 'Paralisado'], ['Petrified', 'Petrificado'], ['Poisoned', 'Envenenado'], ['Prone', 'Caído'],
  ['Restrained', 'Contido'], ['Stunned', 'Atordoado'], ['Unconscious', 'Inconsciente'],
];

const pares = (obj) => Object.values(obj).filter((x) => x.en).map((x) => [x.en, x.nome]);
const tabela = (titulo, linhas) => {
  const ordenadas = [...linhas].sort((a, b) => a[0].localeCompare(b[0], 'en'));
  return `## ${titulo}\n| Inglês (SRD 5.2) | Português (2024) |\n|---|---|\n${ordenadas.map(([en, pt]) => `| ${en} | ${pt} |`).join('\n')}\n`;
};

export function gerarGlossario() {
  const magias = Object.values(D.MAGIAS);
  return [
    '# Glossário: inglês → português (D&D 2024)',
    '',
    'Termos usados no app e pelo Mestre. Regras: SRD 5.2 (CC-BY-4.0). Nomes em português: Livro do Jogador 2024,',
    'tradução da comunidade. Gerado por `npm run glossario` a partir de `app/js/dados.js`: não edite à mão.',
    '',
    tabela('Termos de regra', GERAIS),
    tabela('Classes', pares(D.CLASSES)),
    tabela('Espécies', pares(D.ESPECIES)),
    tabela('Antecedentes', pares(D.ANTECEDENTES).filter(([en]) => !en.startsWith('Custom'))),
    tabela('Talentos', [...pares(D.TALENTOS), ...pares(D.ESTILOS_LUTA)]),
    tabela('Perícias', D.PERICIAS.map((s) => [s.en, s.nome])),
    tabela('Invocações Místicas (sem pré-requisito)', pares(D.INVOCACOES)),
    tabela('Truques', magias.filter((m) => m.nivel === 0).map((m) => [m.en, m.nome])),
    tabela('Magias de 1º círculo', magias.filter((m) => m.nivel === 1).map((m) => [m.en, m.nome])),
    tabela('Maestrias de arma', pares(D.MAESTRIAS)),
    tabela('Armas', pares(D.ARMAS)),
    tabela('Armaduras', [...pares(D.ARMADURAS), [D.ESCUDO.en, D.ESCUDO.nome]]),
    tabela('Kits de equipamento', pares(D.PACOTES)),
    tabela('Tipos de dano', DANO),
    tabela('Condições', CONDICOES),
  ].join('\n');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  writeFileSync(ARQUIVO, gerarGlossario(), 'utf8');
  console.log('Gerado:', ARQUIVO);
}
