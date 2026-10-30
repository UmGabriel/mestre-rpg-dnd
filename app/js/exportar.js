// Exportação da ficha: Markdown (modelo personagens/_modelo-ficha.md), JSON e PDF (regras/ficha/FICHA_MODEL.pdf).
import { ATRIBUTOS, MAGIAS, MAESTRIAS, ARMADURAS, ESCUDO } from './dados.js';
import { sinal, metros, agrupar } from './regras.js';

// Ordem das linhas de perícia impressas na FICHA_MODEL.pdf (edição de 2014: "Adestrar Animais" é a 2ª linha).
export const ORDEM_PERICIAS_PDF = [
  'acrobacia', 'adestrar', 'arcanismo', 'atletismo', 'atuacao', 'enganacao', 'furtividade', 'historia', 'intimidacao',
  'intuicao', 'investigacao', 'medicina', 'natureza', 'percepcao', 'persuasao', 'prestidigitacao', 'religiao', 'sobrevivencia',
];

export function baixar(nome, conteudo, tipo) {
  const url = URL.createObjectURL(new Blob([conteudo], { type: tipo }));
  const a = Object.assign(document.createElement('a'), { href: url, download: nome });
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export const exportarJSON = (p) => JSON.stringify(p, null, 2);

const nomeMagia = (id) => MAGIAS[id]?.nome || id;

function listaEquipamento(p, d) {
  const inv = d.inventario;
  return [
    ...inv.armaduras.map((id) => `${ARMADURAS[id].nome} (armadura)`),
    ...(inv.escudo ? [ESCUDO.nome] : []),
    ...agrupar(inv.armas).map(({ id, qtd }) => `${d.ataques.find((a) => a.id === id)?.nome}${qtd > 1 ? ` ×${qtd}` : ''}`),
    ...inv.itens,
    ...(p.equipamento.extras ? p.equipamento.extras.split('\n').map((s) => s.trim()).filter(Boolean) : []),
  ];
}

// ---------------------------------------------------------------- Markdown

export function exportarMarkdown(p, d) {
  const v = (x) => (x == null || x === '' ? '—' : x);
  const m = d.magia;
  const truquesTodos = [...(m?.truques || []), ...d.magiasExtras.filter((x) => MAGIAS[x.id]?.nivel === 0).map((x) => x.id)];
  const extras1 = d.magiasExtras.filter((x) => MAGIAS[x.id]?.nivel === 1);
  const carac = (filtro) => d.caracteristicas.filter(filtro).map((c) => `${c.nome}: ${c.desc}`).join(' · ') || '—';
  const talentoOrigem = d.caracteristicas.filter((c) => c.nome.startsWith('Talento:')).map((c) => `${c.nome.replace('Talento: ', '')} (${c.origem}). ${c.desc}`).join(' · ');

  return `# ${p.conceito.nome || '<Nome do personagem>'}

**Jogador:** ${v(p.conceito.jogador)} · **Nível:** ${d.nivel} · **XP:** 0
**Classe:** ${v(d.cls?.nome)} · **Subclasse:** — (nível 3) · **Espécie:** ${v(d.esp?.nome)} · **Antecedente:** ${v(d.ant?.nome)}
**Alinhamento:** ${v(p.detalhes.tendencia)} · **Tamanho:** ${v(d.tamanho)} · **Deslocamento:** ${d.deslocamento ? metros(d.deslocamento) : '—'}

## Atributos
| Atributo | Valor | Mod | Salvaguarda |
|---|---|---|---|
${ATRIBUTOS.map((a) => {
    const s = d.salvaguardas.find((x) => x.id === a.id);
    return `| ${a.nome} | ${v(d.atr[a.id])} | ${d.atr[a.id] == null ? '—' : sinal(d.mods[a.id])} | ${sinal(s.bonus)}${s.prof ? ' (prof.)' : ''} |`;
  }).join('\n')}

**Bônus de Proficiência:** ${sinal(d.pb)} · **Iniciativa:** ${sinal(d.iniciativa)} · **Percepção passiva:** ${d.percepcaoPassiva}

## Combate
**PV máx.:** ${v(d.pvMax)} · **PV atuais:** ${v(d.pvMax)} · **PV temporários:** 0
**Dados de Vida:** ${v(d.dadoVida)} · **CA:** ${d.ca.ca} (${d.ca.como}) · **Condições:** nenhuma

| Ataque | Bônus | Dano | Propriedades |
|---|---|---|---|
${d.ataques.map((a) => `| ${a.nome}${a.qtd > 1 ? ` (×${a.qtd})` : ''} | ${sinal(a.bonus)} | ${a.dano} | ${[a.props, a.maestria ? `Maestria: ${MAESTRIAS[a.maestria].nome}` : ''].filter(Boolean).join(' · ') || '—'} |`).join('\n')}

## Perícias (proficientes)
${d.pericias.filter((s) => s.prof).map((s) => `- ${s.nome} ${sinal(s.bonus)}${s.especialista ? ' (especialização)' : ''}`).join('\n') || '-'}

## Talentos e características
- **Talento de origem:** ${talentoOrigem || '—'}
- **Características de classe:** ${carac((c) => c.origem === d.cls?.nome)}
- **Características de espécie:** ${carac((c) => c.origem === d.esp?.nome)}

## Magia (se houver)
${m ? `**Atributo:** ${ATRIBUTOS.find((a) => a.id === m.atr).nome} · **CD:** ${m.cd} · **Ataque:** ${sinal(m.ataque)}
**Espaços:** 1º ${'☐'.repeat(m.espacos[0])}${m.pacto ? ' (Magia de Pacto: voltam no Descanso Curto)' : ''}` : '**Atributo:** — · **CD:** — · **Ataque:** —'}
- Truques: ${truquesTodos.map(nomeMagia).join(', ') || '—'}
- Preparadas: ${[...(m?.sempre || []).map((id) => `${nomeMagia(id)} (sempre)`), ...(m?.preparadas || []).map(nomeMagia), ...extras1.map((x) => `${nomeMagia(x.id)} (${x.origem})`)].join(', ') || '—'}

## Proficiências e idiomas
- Armaduras / armas: ${d.proficiencias.armaduras} / ${d.proficiencias.armas || '—'}
- Ferramentas: ${d.proficiencias.ferramentas.join(', ') || '—'}
- Idiomas: ${d.proficiencias.idiomas.join(', ')}

## Equipamento
${listaEquipamento(p, d).map((i) => `- ${i}`).join('\n') || '-'}
**Ouro:** PO ${d.moedas.po} · PP ${d.moedas.pp} · PC ${d.moedas.pc}

## Personalidade e história
- **Aparência:** ${v([p.detalhes.aparencia, ['idade', 'altura', 'peso', 'olhos', 'pele', 'cabelo'].filter((k) => p.detalhes[k]).map((k) => `${k} ${p.detalhes[k]}`).join(', ')].filter(Boolean).join(' · '))}
- **Traços:** ${v(p.detalhes.tracos)}
- **Ideais / vínculos / defeitos:** ${v(p.detalhes.ideais)} / ${v(p.detalhes.vinculos)} / ${v(p.detalhes.defeitos)}
- **História:** ${v([p.conceito.ideia, p.detalhes.historia].filter(Boolean).join(' '))}
${p.detalhes.aliados ? `- **Aliados e organizações:** ${p.detalhes.aliados}\n` : ''}`;
}

// ---------------------------------------------------------------- PDF

// A fonte padrão do PDF (Helvetica, WinAnsi) não tem alguns símbolos: troca ou remove.
const WINANSI_EXTRA = '€‚ƒ„…†‡ˆ‰Š‹ŒŽ‘’“”•–—˜™š›œžŸ';
function limpar(texto) {
  return String(texto ?? '')
    .replace(/−/g, '-').replace(/☐/g, 'o').replace(/[●◉]/g, '*')
    .split('').filter((c) => c.charCodeAt(0) <= 0xff || WINANSI_EXTRA.includes(c)).join('');
}

function quebrar(texto, fonte, tamanho, largura) {
  const linhas = [];
  for (const paragrafo of limpar(texto).split('\n')) {
    let atual = '';
    for (const palavra of paragrafo.split(/\s+/)) {
      const teste = atual ? `${atual} ${palavra}` : palavra;
      if (fonte.widthOfTextAtSize(teste, tamanho) > largura && atual) {
        linhas.push(atual);
        atual = palavra;
      } else atual = teste;
    }
    linhas.push(atual);
  }
  return linhas;
}

async function carregarModelo(pedirArquivo) {
  try {
    const r = await fetch('../regras/ficha/FICHA_MODEL.pdf');
    if (r.ok) return new Uint8Array(await r.arrayBuffer());
  } catch { /* aberto sem servidor: pede o arquivo */ }
  return pedirArquivo();
}

export async function exportarPDF(p, d, pedirArquivo) {
  const { PDFDocument, StandardFonts, rgb } = window.PDFLib;
  const doc = await PDFDocument.load(await carregarModelo(pedirArquivo));
  const fonte = await doc.embedFont(StandardFonts.Helvetica);
  const negrito = await doc.embedFont(StandardFonts.HelveticaBold);
  const [p1, p2, p3] = doc.getPages();
  const tinta = rgb(0.08, 0.1, 0.25);
  const H = 792; // altura da página (pt); as medidas abaixo são do topo

  // Escreve com y medido do topo. alinhar: 'e' (esquerda) ou 'c' (centro em x).
  const escrever = (pg, texto, x, yTopo, { tam = 9, f = fonte, alinhar = 'e', largMax } = {}) => {
    let t = limpar(texto);
    let tamanho = tam;
    if (largMax) while (tamanho > 5 && f.widthOfTextAtSize(t, tamanho) > largMax) tamanho -= 0.5;
    const w = f.widthOfTextAtSize(t, tamanho);
    pg.drawText(t, { x: alinhar === 'c' ? x - w / 2 : x, y: H - yTopo, size: tamanho, font: f, color: tinta });
  };
  const bloco = (pg, texto, x, yTopo, largura, yFim, { tam = 7.5, entre = 1.25 } = {}) => {
    let y = yTopo;
    let t = tam;
    let linhas = quebrar(texto, fonte, t, largura);
    while (t > 5 && yTopo + linhas.length * t * entre > yFim) { t -= 0.5; linhas = quebrar(texto, fonte, t, largura); }
    for (const l of linhas) {
      if (y > yFim) break;
      if (l) pg.drawText(l, { x, y: H - y, size: t, font: fonte, color: tinta });
      y += t * entre;
    }
  };
  const bolinha = (pg, x, yTopo) => pg.drawCircle({ x, y: H - yTopo, size: 2.8, color: tinta });

  // ----- Página 1
  escrever(p1, p.conceito.nome, 66, 69, { tam: 15, f: negrito, largMax: 185 });
  escrever(p1, d.cls ? `${d.cls.nome} ${d.nivel}` : '', 275, 48, { largMax: 100 });
  escrever(p1, d.ant?.nome || '', 380, 48, { largMax: 90 });
  escrever(p1, p.conceito.jogador, 474, 48, { largMax: 90 });
  escrever(p1, d.esp ? `${d.esp.nome}${d.tamanho && d.esp.tamanho !== d.tamanho ? ` (${d.tamanho})` : ''}` : '', 275, 75, { largMax: 95 });
  escrever(p1, p.detalhes.tendencia, 372, 75, { largMax: 90 });
  escrever(p1, '0', 466, 75);

  ATRIBUTOS.forEach((a, i) => {
    const y = 138 + 73.6 * i;
    if (d.atr[a.id] == null) return;
    escrever(p1, sinal(d.mods[a.id]), 72.5, y + 27, { tam: 18, f: negrito, alinhar: 'c' });
    escrever(p1, String(d.atr[a.id]), 74, y + 47, { tam: 10, alinhar: 'c' });
  });
  escrever(p1, sinal(d.pb), 120, 171.5, { tam: 13, f: negrito, alinhar: 'c' });

  const ySalv = [202, 216, 230, 244, 257.5, 271.5];
  d.salvaguardas.forEach((s, i) => {
    if (s.prof) bolinha(p1, 116, ySalv[i]);
    escrever(p1, sinal(s.bonus), 131, ySalv[i] + 3, { tam: 8, alinhar: 'c' });
  });
  ORDEM_PERICIAS_PDF.forEach((id, i) => {
    const y = 323 + 13.97 * i;
    const s = d.pericias.find((x) => x.id === id);
    if (s.prof) bolinha(p1, 116, y);
    if (s.especialista) p1.drawCircle({ x: 116, y: H - y, size: 4.2, borderColor: tinta, borderWidth: 0.8 });
    escrever(p1, sinal(s.bonus), 131, y + 3, { tam: 8, alinhar: 'c' });
  });
  escrever(p1, String(d.percepcaoPassiva), 60, 607.5, { tam: 13, f: negrito, alinhar: 'c' });

  escrever(p1, String(d.ca.ca), 252.5, 166, { tam: 20, f: negrito, alinhar: 'c' });
  escrever(p1, sinal(d.iniciativa), 305.5, 163, { tam: 18, f: negrito, alinhar: 'c' });
  escrever(p1, d.deslocamento ? metros(d.deslocamento) : '', 361, 162, { tam: 13, f: negrito, alinhar: 'c' });
  escrever(p1, d.pvMax != null ? String(d.pvMax) : '', 305, 196.5, { tam: 9, f: negrito });
  escrever(p1, d.dadoVida || '', 260, 322.5, { tam: 8 });
  escrever(p1, d.dadoVida || '', 267, 340, { tam: 14, f: negrito, alinhar: 'c' });

  bloco(p1, p.detalhes.tracos, 415, 132, 148, 176);
  bloco(p1, p.detalhes.ideais, 415, 201, 148, 233);
  bloco(p1, p.detalhes.vinculos, 415, 258, 148, 290);
  bloco(p1, p.detalhes.defeitos, 415, 315, 148, 347);

  // Ataques: 3 linhas com caixas; o resto vai no espaço pautado abaixo.
  const yAtq = [400.5, 421.5, 442.5];
  const ataques = d.ataques.filter((a) => a.id !== 'desarmado' || d.ataques.length <= 3);
  ataques.slice(0, 3).forEach((a, i) => {
    escrever(p1, `${a.nome}${a.qtd > 1 ? ` x${a.qtd}` : ''}`, 231, yAtq[i], { tam: 8, largMax: 60 });
    escrever(p1, sinal(a.bonus), 308, yAtq[i], { tam: 9, alinhar: 'c' });
    escrever(p1, a.dano, 329, yAtq[i], { tam: 7.5, largMax: 56 });
  });
  const notasAtq = [
    ...ataques.slice(3).map((a) => `${a.nome}: ${sinal(a.bonus)}, ${a.dano}`),
    ...ataques.filter((a) => a.maestria).map((a) => `Maestria ${a.nome}: ${MAESTRIAS[a.maestria].nome} (${MAESTRIAS[a.maestria].desc})`),
    ...(d.magia ? [`Magia: CD ${d.magia.cd}, ataque ${sinal(d.magia.ataque)} (ver pág. 3)`] : []),
  ];
  bloco(p1, notasAtq.join('\n'), 229, 458, 155, 566, { tam: 7 });

  const $ = d.moedas;
  escrever(p1, String($.pc), 248.5, 613.5, { tam: 9, alinhar: 'c' });
  escrever(p1, String($.pp), 248.5, 640.5, { tam: 9, alinhar: 'c' });
  escrever(p1, String($.po), 248.5, 694, { tam: 9, alinhar: 'c' });
  bloco(p1, listaEquipamento(p, d).join('\n'), 276, 600, 110, 762, { tam: 7, entre: 1.2 });

  const prof = d.proficiencias;
  bloco(p1, [`Armaduras: ${prof.armaduras}`, `Armas: ${prof.armas || '-'}`, `Ferramentas: ${prof.ferramentas.join(', ') || '-'}`, `Idiomas: ${prof.idiomas.join(', ')}`].join('\n'),
    50, 636, 158, 760, { tam: 7.5 });
  bloco(p1, d.caracteristicas.map((c) => `${c.nome} (${c.origem}): ${c.desc}`).join('\n'), 407, 390, 162, 758, { tam: 7 });

  // ----- Página 2
  escrever(p2, p.conceito.nome, 66, 69, { tam: 15, f: negrito, largMax: 185 });
  const dt = p.detalhes;
  escrever(p2, dt.idade, 271, 50, { largMax: 95 });
  escrever(p2, dt.altura, 376, 50, { largMax: 90 });
  escrever(p2, dt.peso, 474, 50, { largMax: 90 });
  escrever(p2, dt.olhos, 271, 77, { largMax: 95 });
  escrever(p2, dt.pele, 376, 77, { largMax: 90 });
  escrever(p2, dt.cabelo, 474, 77, { largMax: 90 });

  let yAparencia = 120;
  if (dt.foto) {
    try {
      const img = await doc.embedJpg(dt.foto);
      const esc = Math.min(150 / img.width, 175 / img.height);
      const w = img.width * esc;
      const h = img.height * esc;
      p2.drawImage(img, { x: 127.5 - w / 2, y: H - 118 - h, width: w, height: h });
      yAparencia = 118 + h + 8;
    } catch (e) { console.warn('retrato não entrou no PDF', e); }
  }
  bloco(p2, dt.aparencia, 50, yAparencia, 155, 350);
  bloco(p2, dt.aliados, 229, 125, 160, 352);
  bloco(p2, [p.conceito.ideia, dt.historia].filter(Boolean).join('\n\n'), 50, 385, 158, 760);
  if (d.magiasExtras.length) {
    bloco(p2, `Magias de espécie e talentos:\n${d.magiasExtras.map((x) => `${nomeMagia(x.id)} (${x.origem}${x.atr ? `, ${x.atr.toUpperCase()}` : ''})`).join('\n')}`, 229, 375, 165, 585);
  }

  // ----- Página 3 (magias)
  const m = d.magia;
  const truques = [...(m?.truques || []), ...d.magiasExtras.filter((x) => MAGIAS[x.id]?.nivel === 0).map((x) => x.id)];
  const nivel1 = [...(m?.sempre || []), ...(m?.preparadas || []), ...d.magiasExtras.filter((x) => MAGIAS[x.id]?.nivel === 1).map((x) => x.id)];
  if (m || truques.length || nivel1.length) {
    escrever(p3, m ? d.cls.nome : 'Magias de espécie/talento', 66, 69, { tam: 14, f: negrito, largMax: 185 });
    if (m) {
      escrever(p3, ATRIBUTOS.find((a) => a.id === m.atr).nome, 316, 61, { tam: 10, f: negrito, alinhar: 'c', largMax: 62 });
      escrever(p3, String(m.cd), 411, 62, { tam: 16, f: negrito, alinhar: 'c' });
      escrever(p3, sinal(m.ataque), 509, 62, { tam: 16, f: negrito, alinhar: 'c' });
      escrever(p3, String(m.espacos[0]), 84, 325, { tam: 12, f: negrito, alinhar: 'c' });
    }
    truques.slice(0, 8).forEach((id, i) => escrever(p3, nomeMagia(id), 50, 174 + 14.5 * i, { tam: 8.5, largMax: 155 }));
    nivel1.slice(0, 11).forEach((id, i) => {
      const y = 363 + 14.5 * i;
      const preparada = m && (m.sempre.includes(id) || m.preparadas.includes(id));
      if (preparada) bolinha(p3, 50, y);
      escrever(p3, nomeMagia(id), 58, y + 3, { tam: 8.5, largMax: 148 });
    });
  }

  return doc.save();
}
