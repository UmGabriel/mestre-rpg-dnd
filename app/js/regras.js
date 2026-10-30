// Cálculos da ficha (funções puras, sem DOM). Tudo derivado do estado do personagem.
import {
  ATRIBUTOS, PERICIAS, CLASSES, ANTECEDENTES, ESPECIES, TALENTOS, ARMAS, ARMADURAS, ESCUDO,
  MAGIAS, ESTILOS_LUTA, INVOCACOES, IDIOMAS_PADRAO, CUSTO_PONTOS, PONTOS_TOTAL, ARRAY_PADRAO,
  LISTAS_INICIADO, PACOTES,
} from './dados.js';

export const NIVEL = 1;
export const BONUS_PROF = 2;

export const modificador = (valor) => Math.floor((valor - 10) / 2);
export const sinal = (n) => (n >= 0 ? `+${n}` : `−${Math.abs(n)}`);
export const metros = (m) => `${String(m).replace('.', ',')} m`;

export function personagemNovo() {
  return {
    v: 1,
    passo: 0,
    conceito: { nome: '', jogador: '', ideia: '', arquetipos: [] },
    classe: { id: null, opcao: null, estilo: null, invocacao: null, maestria: [] },
    antecedente: { id: null, kit: 'A', ferramenta: '', personalizado: { atributos: [], pericias: [], ferramenta: '', talento: null } },
    especie: { id: null, opcoes: {} },
    atributos: {
      metodo: null,
      base: { for: null, des: null, con: null, int: null, sab: null, car: null },
      rolagens: [],
      manual: false,
      bonus: { modo: '2-1', mais2: null, mais1: null },
    },
    pericias: { classe: [], especialista: [] },
    ferramentas: { classe: '' },
    idiomas: [],
    idiomaExtra: '',
    talentos: {},
    equipamento: { kitClasse: 'A', kitAntecedente: 'A', compras: [], extras: '' },
    magias: { truques: [], preparadas: [] },
    detalhes: {
      tendencia: '', idade: '', altura: '', peso: '', olhos: '', pele: '', cabelo: '',
      aparencia: '', tracos: '', ideais: '', vinculos: '', defeitos: '', historia: '', aliados: '', foto: '',
    },
  };
}

// ---------------------------------------------------------------- Atributos

export function custoCompra(base) {
  let total = 0;
  for (const a of ATRIBUTOS) {
    const v = base[a.id];
    if (v == null) continue;
    total += CUSTO_PONTOS[v] ?? 0;
  }
  return { gasto: total, resta: PONTOS_TOTAL - total };
}

// Valores disponíveis para distribuir (array padrão ou as 6 rolagens), conforme o método.
export function valoresDisponiveis(at) {
  if (at.metodo === 'padrao') return [...ARRAY_PADRAO];
  if (at.metodo === 'rolagem') return at.rolagens.map((r) => r.total).filter((t) => t != null);
  return null;
}

// 4d6, descarta o menor. `rolar` recebe o número de lados e devolve 1..lados.
export function rolar4d6(rolar) {
  const dados = [rolar(6), rolar(6), rolar(6), rolar(6)];
  const menor = dados.indexOf(Math.min(...dados));
  const total = dados.reduce((s, d, i) => (i === menor ? s : s + d), 0);
  return { dados, descartado: menor, total };
}

// Atributos finais = base + bônus do antecedente (máximo 20).
export function bonusAntecedente(p) {
  const bonus = { for: 0, des: 0, con: 0, int: 0, sab: 0, car: 0 };
  const opcoes = atributosDoAntecedente(p);
  if (!opcoes) return bonus;
  const b = p.atributos.bonus;
  if (b.modo === '1-1-1') {
    for (const a of opcoes) bonus[a] += 1;
  } else {
    if (b.mais2 && opcoes.includes(b.mais2)) bonus[b.mais2] += 2;
    if (b.mais1 && opcoes.includes(b.mais1) && b.mais1 !== b.mais2) bonus[b.mais1] += 1;
  }
  return bonus;
}

export function atributosDoAntecedente(p) {
  const ant = ANTECEDENTES[p.antecedente.id];
  if (!ant) return null;
  if (ant.personalizado) return p.antecedente.personalizado.atributos.length === 3 ? p.antecedente.personalizado.atributos : null;
  return ant.atributos;
}

export function atributosFinais(p) {
  const bonus = bonusAntecedente(p);
  const out = {};
  for (const a of ATRIBUTOS) {
    const base = p.atributos.base[a.id];
    out[a.id] = base == null ? null : Math.min(20, base + bonus[a.id]);
  }
  return out;
}

// ---------------------------------------------------------------- Talentos de origem

// Lista as fontes de talento de origem: o do antecedente e o do Humano (Versátil).
export function fontesTalento(p) {
  const fontes = [];
  const ant = ANTECEDENTES[p.antecedente.id];
  if (ant) {
    const id = ant.personalizado ? p.antecedente.personalizado.talento : ant.talento;
    if (id) fontes.push({ chave: 'antecedente', id, origem: `Antecedente (${ant.nome})`, listaFixa: ant.listaIniciado || null });
  }
  if (p.especie.id === 'humano' && p.especie.opcoes.talento) {
    fontes.push({ chave: 'humano', id: p.especie.opcoes.talento, origem: 'Humano (Versátil)', listaFixa: null });
  }
  return fontes;
}

export function configTalento(p, chave) {
  return p.talentos[chave] || { lista: null, atributo: null, truques: [], magia: null, pericias: [], ferramentas: '' };
}

// ---------------------------------------------------------------- Proficiências

export function periciasFixas(p) {
  // Perícias que vêm prontas (antecedente, espécie, talento Habilidoso), com a origem.
  const fixas = new Map();
  const ant = ANTECEDENTES[p.antecedente.id];
  if (ant) {
    const lista = ant.personalizado ? p.antecedente.personalizado.pericias : ant.pericias;
    for (const id of lista) fixas.set(id, `Antecedente (${ant.nome})`);
  }
  const esp = p.especie;
  if ((esp.id === 'elfo' || esp.id === 'humano') && esp.opcoes.pericia) {
    fixas.set(esp.opcoes.pericia, ESPECIES[esp.id].nome);
  }
  for (const f of fontesTalento(p)) {
    if (f.id !== 'habilidoso') continue;
    for (const id of configTalento(p, f.chave).pericias) fixas.set(id, 'Talento Habilidoso');
  }
  return fixas;
}

export function periciasProficientes(p) {
  const set = new Set(periciasFixas(p).keys());
  for (const id of p.pericias.classe) set.add(id);
  return set;
}

function categoriasArmas(cls, opcao) {
  const cats = new Set(cls ? cls.armas : []);
  if (opcao?.armas) opcao.armas.forEach((c) => cats.add(c));
  return cats;
}

export function proficienteComArma(armaId, cats) {
  const a = ARMAS[armaId];
  if (!a) return false;
  if (cats.has(a.cat)) return true;
  if (a.cat === 'marcial' && cats.has('marcial-leve') && a.props.includes('leve')) return true;
  if (a.cat === 'marcial' && cats.has('marcial-acuidade-leve') && (a.props.includes('leve') || a.props.includes('acuidade'))) return true;
  return false;
}

export function armadurasTreinadas(p) {
  const cls = CLASSES[p.classe.id];
  const set = new Set(cls ? cls.armaduras : []);
  const op = cls?.opcao?.itens[p.classe.opcao];
  if (op?.armaduras) op.armaduras.forEach((c) => set.add(c));
  return set;
}

// ---------------------------------------------------------------- Equipamento

export function inventario(p) {
  const cls = CLASSES[p.classe.id];
  const ant = ANTECEDENTES[p.antecedente.id];
  const inv = { armas: [], armaduras: [], escudo: false, itens: [], pc: 0 };
  const somarKit = (k) => {
    if (!k) return;
    inv.armas.push(...k.armas);
    if (k.armadura) inv.armaduras.push(k.armadura);
    if (k.escudo) inv.escudo = true;
    inv.itens.push(...k.itens);
    inv.pc += k.po * 100;
  };
  if (cls) somarKit(cls.kits.find((k) => k.letra === p.equipamento.kitClasse) || cls.kits[0]);
  if (ant) somarKit(ant.kits.find((k) => k.letra === p.equipamento.kitAntecedente) || ant.kits[0]);
  for (const c of p.equipamento.compras) {
    if (c.tipo === 'arma' && ARMAS[c.id]) { inv.armas.push(c.id); inv.pc -= ARMAS[c.id].custo; }
    if (c.tipo === 'armadura' && ARMADURAS[c.id]) { inv.armaduras.push(c.id); inv.pc -= ARMADURAS[c.id].custo; }
    if (c.tipo === 'escudo') { inv.escudo = true; inv.pc -= ESCUDO.custo; }
    if (c.tipo === 'pacote' && PACOTES[c.id]) { inv.itens.push(PACOTES[c.id].nome); inv.pc -= PACOTES[c.id].custo; }
  }
  return inv;
}

export function moedas(pc) {
  const neg = pc < 0;
  const v = Math.abs(pc);
  return { po: Math.floor(v / 100) * (neg ? -1 : 1), pp: Math.floor((v % 100) / 10), pc: v % 10, negativo: neg };
}

// Agrupa repetidos: ['adaga','adaga'] → [{id:'adaga', qtd:2}]
export function agrupar(lista) {
  const m = new Map();
  for (const id of lista) m.set(id, (m.get(id) || 0) + 1);
  return [...m].map(([id, qtd]) => ({ id, qtd }));
}

// ---------------------------------------------------------------- CA

export function calcularCA(p, mods, inv) {
  const cls = CLASSES[p.classe.id];
  const treino = armadurasTreinadas(p);
  const opcoes = [];
  const usaEscudo = inv.escudo && treino.has('escudo');
  const defesaEstilo = p.classe.estilo === 'defesa' ? 1 : 0;
  const des = mods.des ?? 0;

  for (const id of inv.armaduras) {
    const a = ARMADURAS[id];
    if (!a || !treino.has(a.cat)) continue;
    const desAplicada = a.maxDes === 0 ? 0 : a.maxDes == null ? des : Math.min(des, a.maxDes);
    const ca = a.base + desAplicada + (usaEscudo ? ESCUDO.bonus : 0) + defesaEstilo;
    opcoes.push({ ca, como: `${a.nome} (${a.base}${a.maxDes === 0 ? '' : ` + DES${a.maxDes ? ' máx. 2' : ''}`})${usaEscudo ? ' + escudo' : ''}${defesaEstilo ? ' + Defesa' : ''}`, armadura: id });
  }
  const semArmadura = 10 + des;
  if (cls?.defesaSemArmadura === 'con') {
    opcoes.push({ ca: semArmadura + (mods.con ?? 0) + (usaEscudo ? ESCUDO.bonus : 0), como: `Defesa sem Armadura (10 + DES + CON)${usaEscudo ? ' + escudo' : ''}` });
  } else if (cls?.defesaSemArmadura === 'sab') {
    opcoes.push({ ca: semArmadura + (mods.sab ?? 0), como: 'Defesa sem Armadura (10 + DES + SAB)' });
  } else {
    opcoes.push({ ca: semArmadura + (usaEscudo ? ESCUDO.bonus : 0), como: `Sem armadura (10 + DES)${usaEscudo ? ' + escudo' : ''}` });
  }
  opcoes.sort((a, b) => b.ca - a.ca);
  return opcoes[0];
}

// ---------------------------------------------------------------- Magia

export function infoMagia(p) {
  const cls = CLASSES[p.classe.id];
  if (!cls?.magia) return null;
  const m = cls.magia;
  const op = cls.opcao?.itens[p.classe.opcao];
  return { ...m, truques: m.truques + (op?.truquesExtra || 0) };
}

// Truques que vêm de espécie (não contam no limite da classe).
export function truquesEspecie(p) {
  const esp = ESPECIES[p.especie.id];
  return esp?.truques ? esp.truques(p.especie.opcoes) : [];
}

// ---------------------------------------------------------------- Tudo junto

export function calcular(p) {
  const cls = CLASSES[p.classe.id] || null;
  const ant = ANTECEDENTES[p.antecedente.id] || null;
  const esp = ESPECIES[p.especie.id] || null;
  const opcaoClasse = cls?.opcao?.itens[p.classe.opcao] || null;
  const pb = BONUS_PROF;

  const atr = atributosFinais(p);
  const mods = {};
  for (const a of ATRIBUTOS) mods[a.id] = atr[a.id] == null ? null : modificador(atr[a.id]);
  const m = (id) => mods[id] ?? 0;

  // Salvaguardas
  const salvaguardas = ATRIBUTOS.map((a) => {
    const prof = !!cls?.salvaguardas.includes(a.id);
    return { id: a.id, nome: a.nome, prof, bonus: m(a.id) + (prof ? pb : 0) };
  });

  // Perícias
  const prof = periciasProficientes(p);
  const especialista = new Set(p.pericias.especialista.filter((id) => prof.has(id)));
  const bonusOrdem = opcaoClasse?.bonusPericias || [];
  const pericias = PERICIAS.map((s) => {
    const ehProf = prof.has(s.id);
    const ehEsp = especialista.has(s.id);
    let bonus = m(s.atr) + (ehProf ? pb * (ehEsp ? 2 : 1) : 0);
    if (bonusOrdem.includes(s.id)) bonus += Math.max(1, m('sab'));
    return { ...s, prof: ehProf, especialista: ehEsp, bonus };
  });
  const percepcao = pericias.find((s) => s.id === 'percepcao');

  // Talentos
  const fontes = fontesTalento(p);
  const temAlerta = fontes.some((f) => f.id === 'alerta');

  // Inventário e combate
  const inv = inventario(p);
  const ca = calcularCA(p, mods, inv);
  const dado = cls?.dado || null;
  const pvMax = dado ? dado + m('con') + (esp?.pvPorNivel || 0) * NIVEL : null;
  const iniciativa = m('des') + (temAlerta ? pb : 0);

  const catsArmas = categoriasArmas(cls, opcaoClasse);
  const ataques = agrupar(inv.armas).map(({ id, qtd }) => {
    const a = ARMAS[id];
    const usaDes = a.tipo === 'dist' || (a.props.includes('acuidade') && m('des') > m('for'));
    const atrId = a.tipo === 'dist' ? 'des' : a.props.includes('acuidade') ? (m('des') >= m('for') ? 'des' : 'for') : 'for';
    const profArma = proficienteComArma(id, catsArmas);
    const arquearia = p.classe.estilo === 'arquearia' && a.tipo === 'dist' ? 2 : 0;
    const bonus = m(atrId) + (profArma ? pb : 0) + arquearia;
    const danoMod = m(atrId);
    const props = a.props.map((x) => (x === 'versatil' ? `Versátil (${a.versatil})` : x === 'arremesso' || x === 'municao' ? `${x === 'arremesso' ? 'Arremesso' : 'Munição'} ${a.alcance}` : {
      acuidade: 'Acuidade', leve: 'Leve', pesada: 'Pesada', 'duas-maos': 'Duas Mãos', alcance: 'Alcance', recarga: 'Recarga',
    }[x]));
    const temMaestria = p.classe.maestria.includes(id);
    return {
      id, qtd, nome: a.nome, bonus, prof: profArma, atr: atrId, usaDes,
      dano: `${a.dano}${danoMod ? ` ${sinal(danoMod)}` : ''} ${a.tipoDano}`,
      props: props.join(', '), maestria: temMaestria ? a.maestria : null,
    };
  });
  // Golpe desarmado (sempre existe)
  if (cls?.artesMarciais) {
    const atrId = m('des') >= m('for') ? 'des' : 'for';
    ataques.push({ id: 'desarmado', qtd: 1, nome: 'Golpe Desarmado', bonus: m(atrId) + pb, prof: true, atr: atrId, dano: `${cls.artesMarciais} ${sinal(m(atrId))} concussão`, props: 'Artes Marciais' });
  } else {
    ataques.push({ id: 'desarmado', qtd: 1, nome: 'Golpe Desarmado', bonus: m('for') + pb, prof: true, atr: 'for', dano: `${Math.max(0, 1 + m('for'))} concussão`, props: '' });
  }

  // Magia
  const im = infoMagia(p);
  let magia = null;
  const magiasExtras = []; // de espécie e talentos
  for (const t of truquesEspecie(p)) magiasExtras.push({ id: t, origem: esp.nome, atr: p.especie.opcoes.atributoMagia || null });
  for (const f of fontes) {
    if (f.id !== 'iniciado') continue;
    const c = configTalento(p, f.chave);
    for (const t of c.truques) magiasExtras.push({ id: t, origem: 'Iniciado em Magia', atr: c.atributo });
    if (c.magia) magiasExtras.push({ id: c.magia, origem: 'Iniciado em Magia (1×/descanso longo sem espaço)', atr: c.atributo });
  }
  if (im) {
    const mod = m(im.atr);
    magia = {
      atr: im.atr, cd: 8 + pb + mod, ataque: pb + mod, espacos: im.espacos, pacto: !!im.pacto,
      truques: p.magias.truques, preparadas: p.magias.preparadas, sempre: im.sempre || [],
      limiteTruques: im.truques, limitePreparadas: im.preparadas, grimorio: im.grimorio || 0,
    };
  }

  // Características
  const caracteristicas = [];
  if (cls) {
    for (const c of cls.caracteristicas) caracteristicas.push({ ...c, origem: cls.nome });
    if (opcaoClasse) caracteristicas.push({ nome: `${cls.opcao.titulo}: ${opcaoClasse.nome}`, desc: opcaoClasse.desc, origem: cls.nome });
    if (p.classe.estilo && ESTILOS_LUTA[p.classe.estilo]) caracteristicas.push({ nome: `Estilo de Luta: ${ESTILOS_LUTA[p.classe.estilo].nome}`, desc: ESTILOS_LUTA[p.classe.estilo].desc, origem: cls.nome });
    if (p.classe.invocacao && INVOCACOES[p.classe.invocacao]) caracteristicas.push({ nome: `Invocação: ${INVOCACOES[p.classe.invocacao].nome}`, desc: INVOCACOES[p.classe.invocacao].desc, origem: cls.nome });
  }
  if (esp) for (const t of esp.tracos(p.especie.opcoes)) caracteristicas.push({ ...t, origem: esp.nome });
  for (const f of fontes) {
    const t = TALENTOS[f.id];
    let desc = t.desc;
    if (f.id === 'iniciado') {
      const c = configTalento(p, f.chave);
      const lista = f.listaFixa || c.lista;
      desc = `Lista de ${LISTAS_INICIADO[lista] || '?'}; atributo: ${ATRIBUTOS.find((a) => a.id === c.atributo)?.nome || '?'}.`;
    }
    caracteristicas.push({ nome: `Talento: ${t.nome}`, desc, origem: f.origem });
  }

  // Proficiências e idiomas
  const nomesArmas = { simples: 'armas simples', marcial: 'armas marciais', 'marcial-leve': 'armas marciais Leves', 'marcial-acuidade-leve': 'armas marciais de Acuidade ou Leves' };
  const nomesArmaduras = { leve: 'leve', media: 'média', pesada: 'pesada', escudo: 'escudos' };
  const treino = armadurasTreinadas(p);
  const ferramentas = [];
  if (cls?.ferramentasFixas) ferramentas.push(...cls.ferramentasFixas);
  if (cls?.ferramentas && p.ferramentas.classe) ferramentas.push(p.ferramentas.classe);
  if (ant) {
    if (ant.personalizado) { if (p.antecedente.personalizado.ferramenta) ferramentas.push(p.antecedente.personalizado.ferramenta); }
    else if (ant.ferramenta) ferramentas.push(ant.ferramenta);
    else if (p.antecedente.ferramenta) ferramentas.push(p.antecedente.ferramenta);
  }
  for (const f of fontes) if (f.id === 'habilidoso' && configTalento(p, f.chave).ferramentas) ferramentas.push(configTalento(p, f.chave).ferramentas);

  const idiomas = ['Comum', ...p.idiomas.map((id) => IDIOMAS_PADRAO.find((i) => i.id === id)?.nome).filter(Boolean)];
  if (cls?.idiomasFixos) idiomas.push(...cls.idiomasFixos);
  if (cls?.idiomaExtra && p.idiomaExtra) idiomas.push(p.idiomaExtra);

  const proficiencias = {
    armas: [...catsArmas].map((c) => nomesArmas[c]).join(', '),
    armaduras: treino.size ? [...treino].map((c) => nomesArmaduras[c]).join(', ') : 'nenhuma',
    ferramentas: [...new Set(ferramentas)],
    idiomas: [...new Set(idiomas)],
  };

  // Deslocamento e tamanho
  const deslocamento = esp ? (esp.deslocamentoPor ? esp.deslocamentoPor(p.especie.opcoes) : esp.deslocamento) : null;
  const tamanho = esp ? (esp.escolhas?.some((e) => e.id === 'tamanho') ? p.especie.opcoes.tamanho || esp.tamanho : esp.tamanho) : null;
  const visao = esp ? (esp.visaoPor ? esp.visaoPor(p.especie.opcoes) : esp.visaoEscuro || 0) : 0;

  // Avisos de regra (não bloqueiam, ajudam o Mestre)
  const avisos = [];
  for (const id of inv.armaduras) {
    const a = ARMADURAS[id];
    if (!treino.has(a.cat)) avisos.push(`Sem treino com armadura ${nomesArmaduras[a.cat]}: ${a.nome} não conta na CA.`);
    else if (a.forMin && (atr.for ?? 0) < a.forMin) avisos.push(`${a.nome} pede Força ${a.forMin}: sem isso, Deslocamento −3 m.`);
  }
  if (inv.escudo && !treino.has('escudo')) avisos.push('Sem treino com escudo: ele não soma na CA.');
  if (inv.pc < 0) avisos.push('As compras passaram do ouro disponível.');

  return {
    cls, ant, esp, pb, nivel: NIVEL, atr, mods, salvaguardas, pericias,
    percepcaoPassiva: 10 + percepcao.bonus,
    pvMax, dadoVida: dado ? `1d${dado}` : null, ca, iniciativa, deslocamento, tamanho, visao,
    ataques, magia, magiasExtras, caracteristicas, proficiencias, inventario: inv, moedas: moedas(inv.pc), avisos,
  };
}

// ---------------------------------------------------------------- Pendências por passo

export function pendencias(p) {
  const out = {};
  const add = (passo, msg) => (out[passo] ||= []).push(msg);
  const cls = CLASSES[p.classe.id];
  const ant = ANTECEDENTES[p.antecedente.id];
  const esp = ESPECIES[p.especie.id];

  if (!p.conceito.nome.trim()) add(0, 'Dê um nome ao personagem (pode ser provisório).');
  if (!cls) add(1, 'Escolha uma classe.');
  else {
    if (cls.opcao && !p.classe.opcao) add(1, `Escolha a ${cls.opcao.titulo}.`);
    if (cls.estiloLuta && !p.classe.estilo) add(1, 'Escolha o Estilo de Luta.');
    if (cls.invocacoes && !p.classe.invocacao) add(1, 'Escolha a Invocação Mística.');
  }
  if (!ant) add(2, 'Escolha um antecedente.');
  else if (ant.personalizado) {
    const c = p.antecedente.personalizado;
    if (c.atributos.length !== 3) add(2, 'Marque 3 atributos do antecedente.');
    if (c.pericias.length !== 2) add(2, 'Marque 2 perícias do antecedente.');
    if (!c.talento) add(2, 'Escolha o talento de origem.');
  } else if (ant.ferramentaEscolha && !p.antecedente.ferramenta) add(2, 'Escolha o tipo de jogo do Soldado.');
  if (!esp) add(3, 'Escolha uma espécie.');
  else for (const e of esp.escolhas || []) if (!p.especie.opcoes[e.id]) add(3, `Escolha: ${e.titulo}.`);

  const at = p.atributos;
  if (!at.metodo) add(4, 'Escolha o método de atributos.');
  else if (ATRIBUTOS.some((a) => at.base[a.id] == null)) add(4, 'Distribua os 6 valores de atributo.');
  if (at.metodo === 'compra' && custoCompra(at.base).resta < 0) add(4, 'A compra de pontos passou de 27.');
  if (ant && at.bonus.modo === '2-1' && (!at.bonus.mais2 || !at.bonus.mais1 || at.bonus.mais2 === at.bonus.mais1)) add(4, 'Escolha onde vão o +2 e o +1 do antecedente.');

  if (cls) {
    if (p.pericias.classe.length !== cls.pericias.n) add(5, `Escolha ${cls.pericias.n} perícias da classe.`);
    if (cls.especialista && p.pericias.especialista.length !== cls.especialista) add(5, `Escolha ${cls.especialista} perícias para Especialização.`);
    if (cls.ferramentas && !p.ferramentas.classe.trim()) add(5, `Anote ${cls.ferramentas.desc}.`);
    if (cls.maestria && p.classe.maestria.length !== cls.maestria) add(5, `Escolha ${cls.maestria} armas para Maestria.`);
    if (cls.idiomaExtra && !p.idiomaExtra) add(5, 'Escolha o idioma extra do Ladino.');
    const im = infoMagia(p);
    if (im) {
      if (p.magias.truques.length !== im.truques) add(5, `Escolha ${im.truques} truques.`);
      if (p.magias.preparadas.length !== im.preparadas) add(5, `Escolha ${im.preparadas} magias preparadas.`);
    }
  }
  if (p.idiomas.length !== 2) add(5, 'Escolha 2 idiomas além do Comum.');
  for (const f of fontesTalento(p)) {
    const c = configTalento(p, f.chave);
    if (f.id === 'iniciado') {
      if (!(f.listaFixa || c.lista)) add(5, `${f.origem}: escolha a lista do Iniciado em Magia.`);
      if (!c.atributo) add(5, `${f.origem}: escolha o atributo do Iniciado em Magia.`);
      if (c.truques.length !== 2 || !c.magia) add(5, `${f.origem}: escolha 2 truques e 1 magia do Iniciado em Magia.`);
    }
    if (f.id === 'habilidoso') {
      const nFerr = c.ferramentas ? c.ferramentas.split(',').filter((s) => s.trim()).length : 0;
      if (c.pericias.length + nFerr !== 3) add(5, `${f.origem}: Habilidoso pede 3 perícias ou ferramentas.`);
    }
  }
  const iniciados = fontesTalento(p).filter((f) => f.id === 'iniciado').map((f) => f.listaFixa || configTalento(p, f.chave).lista).filter(Boolean);
  if (new Set(iniciados).size !== iniciados.length) add(5, 'Iniciado em Magia repetido precisa de listas diferentes.');
  if (inventario(p).pc < 0) add(5, 'As compras passaram do ouro disponível.');

  if (!p.detalhes.tendencia) add(7, 'Escolha a tendência.');
  return out;
}
