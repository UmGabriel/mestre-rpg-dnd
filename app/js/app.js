// Criação de ficha passo a passo: o "Mestre" conduz à esquerda, a ficha se monta à direita.
import {
  ATRIBUTOS, PERICIAS, CLASSES, ANTECEDENTES, ESPECIES, TALENTOS, ARMAS, ARMADURAS, ESCUDO, PACOTES,
  MAGIAS, LISTAS_MAGIA, ESTILOS_LUTA, INVOCACOES, IDIOMAS_PADRAO, IDIOMA_POR_D12, IDIOMAS_RAROS,
  ARRAY_PADRAO, CUSTO_PONTOS, PONTOS_TOTAL, TENDENCIAS, ARQUETIPOS, MAESTRIAS, ANCESTRAIS_DRACONICOS,
  LISTAS_INICIADO,
} from './dados.js';
import {
  personagemNovo, abrirFicha, calcular, pendencias, sinal, metros, custoCompra, valoresDisponiveis, rolar4d6,
  atributosDoAntecedente, bonusAntecedente, periciasFixas, periciasProficientes, fontesTalento, configTalento,
  infoMagia, truquesEspecie, proficienteComArma, moedas,
} from './regras.js';
import { renderFicha, esc } from './ficha.js';
import { exportarMarkdown, exportarJSON, exportarPDF, baixar } from './exportar.js';

const CHAVE = 'mestre-rpg.ficha';
const PASSOS = ['Conceito', 'Classe', 'Antecedente', 'Espécie', 'Atributos', 'Perícias, equipamento e magias', 'PV, CA e iniciativa', 'Detalhes', 'Ficha completa'];

let p = carregar();

function carregar() {
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo?.v === 1) return abrirFicha(salvo);
  } catch { /* ficha corrompida: começa do zero */ }
  return personagemNovo();
}
const salvar = () => localStorage.setItem(CHAVE, JSON.stringify(p));

// ---------------------------------------------------------------- utilidades

export function rolarDado(lados) {
  const buf = new Uint32Array(1);
  crypto.getRandomValues(buf);
  return (buf[0] % lados) + 1;
}

function caminho(obj, path) {
  const partes = path.split('.');
  const ultima = partes.pop();
  const alvo = partes.reduce((o, k) => (o[k] ??= {}), obj);
  return [alvo, ultima];
}
const ler = (path) => { const [o, k] = caminho(p, path); return o[k]; };
const gravar = (path, v) => { const [o, k] = caminho(p, path); o[k] = v; };

function toast(msg, ms = 3500) {
  const t = document.getElementById('toast');
  t.innerHTML = msg;
  t.classList.add('on');
  clearTimeout(toast.t);
  toast.t = setTimeout(() => t.classList.remove('on'), ms);
}

const mestre = (html) => `<div class="fala"><span class="fala-quem">O Mestre diz</span>${html}</div>`;
const opcoesSelect = (pares, atual, vazio = 'Escolha…') =>
  `<option value="">${vazio}</option>` + pares.map(([v, t, dis]) => `<option value="${esc(v)}" ${String(atual) === String(v) ? 'selected' : ''} ${dis ? 'disabled' : ''}>${esc(t)}</option>`).join('');
// Plural dos nomes de arma ("Adaga" → "Adagas", "Machado de Batalha" → "Machados de Batalha").
const plural = (nome) => {
  let parar = false;
  return nome.split(' ').map((w) => {
    if (parar || /^(de|da|do)$/.test(w)) { parar = true; return w; }
    return /[aeiou]$/i.test(w) ? `${w}s` : w;
  }).join(' ');
};
const nomeAtr = (id) => ATRIBUTOS.find((a) => a.id === id)?.nome || id;
const nomePericia = (id) => PERICIAS.find((s) => s.id === id)?.nome || id;

function checkLista(path, itens, { max, fixos = new Map(), desabilitados = new Set(), descricao, atual: atualFixo } = {}) {
  const atual = atualFixo ?? ler(path) ?? [];
  const cheio = max != null && atual.length >= max;
  return `<div class="checks">${itens.map(([id, nome, extra]) => {
    const fixo = fixos.has(id);
    const marcado = fixo || atual.includes(id);
    const dis = fixo || desabilitados.has(id) || (!marcado && cheio);
    return `<label class="check ${marcado ? 'on' : ''} ${dis && !marcado ? 'off' : ''}" ${descricao?.(id) ? `title="${esc(descricao(id))}"` : ''}>
      <input type="checkbox" data-lista="${path}" ${max != null ? `data-max="${max}"` : ''} value="${esc(id)}" ${marcado ? 'checked' : ''} ${dis ? 'disabled' : ''}>
      <span>${esc(nome)}${fixo ? ` <small>· ${esc(fixos.get(id))}</small>` : ''}${extra ? ` <small>${extra}</small>` : ''}</span></label>`;
  }).join('')}</div>${max != null ? `<p class="contador">${atual.length} de ${max}</p>` : ''}`;
}

function cartoes(acao, itens, atual, recomendados = []) {
  return `<div class="cartoes">${itens.map(([id, titulo, corpo, selo]) => `
    <button class="cartao ${atual === id ? 'on' : ''} ${recomendados.includes(id) ? 'rec' : ''}" data-acao="${acao}" data-valor="${id}">
      <span class="cartao-titulo">${esc(titulo)}${recomendados.includes(id) ? ' <em>recomendado</em>' : ''}</span>
      ${selo ? `<span class="cartao-selo">${selo}</span>` : ''}
      <span class="cartao-corpo">${corpo}</span>
    </button>`).join('')}</div>`;
}

// ---------------------------------------------------------------- passos

function passoConceito() {
  const c = p.conceito;
  return `${mestre(`<p>Bem-vindo à mesa! Antes de números e regras, vamos pensar em <b>quem</b> é o seu personagem.</p>
    <p>Pense em uma frase: de onde vem, o que quer, por que vai se arriscar em aventuras. Marque também o estilo de jogo que te atrai;
    vou usar isso para recomendar classes no próximo passo.</p>`)}
    <div class="form">
      <label>Nome do personagem <input data-campo="conceito.nome" value="${esc(c.nome)}" placeholder="Pode ser provisório"></label>
      <label>Nome do jogador <input data-campo="conceito.jogador" value="${esc(c.jogador)}"></label>
      <label class="larga">Conceito em uma frase
        <textarea data-campo="conceito.ideia" rows="3" placeholder="Ex.: uma ex-soldada que desertou depois de ver o que o próprio exército fez e agora busca redenção">${esc(c.ideia)}</textarea></label>
    </div>
    <h4>Que tipo de herói você quer jogar?</h4>
    ${checkLista('conceito.arquetipos', ARQUETIPOS.map((a) => [a.id, a.nome]))}`;
}

function recomendadas() {
  const set = new Set();
  for (const id of p.conceito.arquetipos) ARQUETIPOS.find((a) => a.id === id)?.classes.forEach((c) => set.add(c));
  return [...set];
}

function passoClasse() {
  const cls = CLASSES[p.classe.id];
  const rec = recomendadas();
  const itens = Object.entries(CLASSES).map(([id, c]) => [id, c.nome,
    `${esc(c.resumo)}<br><small>Interesse: ${c.gosta} · Atributo: ${c.primario.map(nomeAtr).join(' e ')} · Complexidade: ${c.complexidade} · d${c.dado}</small>`]);
  let detalhe = '';
  if (cls) {
    const op = cls.opcao;
    detalhe = `<div class="detalhe">
      <h4>${cls.nome} <small>(${cls.en})</small></h4>
      <ul class="lista-pequena">
        <li><b>Dado de Ponto de Vida:</b> d${cls.dado} · <b>Salvaguardas:</b> ${cls.salvaguardas.map(nomeAtr).join(' e ')}</li>
        <li><b>Armaduras:</b> ${cls.armaduras.length ? cls.armaduras.join(', ').replace('media', 'média').replace('escudo', 'escudos') : 'nenhuma'}</li>
        <li><b>Perícias:</b> escolha ${cls.pericias.n} ${cls.pericias.de === 'todas' ? 'quaisquer' : `entre ${cls.pericias.de.map(nomePericia).join(', ')}`}</li>
        ${cls.caracteristicas.map((c) => `<li><b>${esc(c.nome)}:</b> ${esc(c.desc)}</li>`).join('')}
      </ul>
      ${op ? `<h4>${op.titulo} <small>(${op.en})</small></h4>${cartoes('classe-opcao', Object.entries(op.itens).map(([id, o]) => [id, o.nome, esc(o.desc)]), p.classe.opcao)}` : ''}
      ${cls.estiloLuta ? `<h4>Estilo de Luta</h4>${cartoes('classe-estilo', Object.entries(ESTILOS_LUTA).map(([id, e]) => [id, e.nome, esc(e.desc)]), p.classe.estilo)}` : ''}
      ${cls.invocacoes ? `<h4>Invocação Mística</h4>${cartoes('classe-invocacao', Object.entries(INVOCACOES).map(([id, e]) => [id, e.nome, esc(e.desc)]), p.classe.invocacao)}` : ''}
    </div>`;
  }
  return `${mestre(`<p>A <b>classe</b> é a vocação do personagem: como ele luta, que magia usa e o que faz melhor que ninguém.</p>
    ${rec.length ? `<p>Pelo que você marcou no conceito, eu olharia primeiro para: <b>${rec.map((id) => CLASSES[id].nome).join(', ')}</b>.</p>` : ''}
    <p>Para a primeira campanha, classes de complexidade <b>Baixa</b> (Guerreiro, Ladino) são as mais tranquilas.</p>`)}
    ${cartoes('classe', itens, p.classe.id, rec)}${detalhe}`;
}

function passoAntecedente() {
  const ant = ANTECEDENTES[p.antecedente.id];
  const cls = CLASSES[p.classe.id];
  const itens = Object.entries(ANTECEDENTES).map(([id, a]) => [id, a.nome,
    a.personalizado ? esc(a.resumo) : `${esc(a.resumo)}<br><small>Atributos: ${a.atributos.map(nomeAtr).join(', ')} · Talento: ${TALENTOS[a.talento].nome}${a.listaIniciado ? ` (${LISTAS_INICIADO[a.listaIniciado]})` : ''} · Perícias: ${a.pericias.map(nomePericia).join(', ')}</small>`]);
  const rec = cls ? Object.entries(ANTECEDENTES).filter(([, a]) => a.atributos?.some((x) => cls.primario.includes(x))).map(([id]) => id) : [];
  let detalhe = '';
  if (ant?.personalizado) {
    const c = p.antecedente.personalizado;
    detalhe = `<div class="detalhe"><h4>Monte o seu antecedente</h4>
      <p>3 atributos (que vão receber o bônus no passo 5):</p>${checkLista('antecedente.personalizado.atributos', ATRIBUTOS.map((a) => [a.id, a.nome]), { max: 3 })}
      <p>2 perícias:</p>${checkLista('antecedente.personalizado.pericias', PERICIAS.map((s) => [s.id, s.nome]), { max: 2 })}
      <div class="form">
        <label>1 ferramenta <input data-campo="antecedente.personalizado.ferramenta" value="${esc(c.ferramenta)}" placeholder="Ex.: Ferramentas de Ferreiro"></label>
        <label>Talento de origem <select data-campo="antecedente.personalizado.talento">${opcoesSelect(Object.entries(TALENTOS).map(([id, t]) => [id, t.nome]), c.talento)}</select></label>
      </div></div>`;
  } else if (ant) {
    detalhe = `<div class="detalhe"><h4>${ant.nome} <small>(${ant.en})</small></h4>
      <ul class="lista-pequena">
        <li><b>Atributos:</b> ${ant.atributos.map(nomeAtr).join(', ')} (você distribui +2/+1 ou +1/+1/+1 no passo 5)</li>
        <li><b>Talento de origem:</b> ${TALENTOS[ant.talento].nome}: ${esc(TALENTOS[ant.talento].desc)}</li>
        <li><b>Perícias:</b> ${ant.pericias.map(nomePericia).join(' e ')}</li>
        <li><b>Ferramenta:</b> ${ant.ferramenta || ant.ferramentaEscolha}</li>
      </ul>
      ${ant.ferramentaEscolha ? `<div class="form"><label>Qual jogo? <input data-campo="antecedente.ferramenta" value="${esc(p.antecedente.ferramenta)}" placeholder="Dados, cartas, xadrez de dragão…"></label></div>` : ''}
    </div>`;
  }
  return `${mestre(`<p>O <b>antecedente</b> é o que o personagem fazia antes de virar aventureiro. Ele dá <b>2 perícias</b>, <b>1 ferramenta</b>,
    <b>1 talento de origem</b> e decide <b>quais atributos</b> você pode aumentar.</p>
    ${cls ? `<p>Dica: para ${cls.nome}, prefira um antecedente que aumente ${cls.primario.map(nomeAtr).join(' ou ')}. Destaquei os que fazem isso.</p>` : ''}
    <p>Em dúvida? Pense no conceito: um ex-soldado é Soldado; quem cresceu num templo, Acólito. Se nenhum servir, use o <b>Personalizado</b>, eu aprovo.</p>`)}
    ${cartoes('antecedente', itens, p.antecedente.id, rec)}${detalhe}`;
}

function opcoesEscolha(e) {
  if (e.opcoes === 'ANCESTRAIS_DRACONICOS') return Object.entries(ANCESTRAIS_DRACONICOS).map(([id, a]) => [id, `${a.nome} (${a.dano})`]);
  if (e.opcoes === 'PERICIAS') return PERICIAS.map((s) => [s.id, s.nome]);
  if (e.opcoes === 'TALENTOS') return Object.entries(TALENTOS).map(([id, t]) => [id, t.nome]);
  return Object.entries(e.opcoes);
}

function passoEspecie() {
  const esp = ESPECIES[p.especie.id];
  const itens = Object.entries(ESPECIES).map(([id, e]) => [id, e.nome,
    `${esc(e.resumo)}<br><small>${e.tamanho} · ${metros(e.deslocamento)}${e.visaoEscuro ? ` · Visão no escuro ${e.visaoEscuro} m` : ''}</small>`]);
  let detalhe = '';
  if (esp) {
    detalhe = `<div class="detalhe"><h4>${esp.nome} <small>(${esp.en})</small></h4>
      ${esp.escolhas ? `<div class="form">${esp.escolhas.map((e) => `<label>${e.titulo}<select data-campo="especie.opcoes.${e.id}">${opcoesSelect(opcoesEscolha(e), p.especie.opcoes[e.id])}</select></label>`).join('')}</div>` : ''}
      <ul class="lista-pequena">${esp.tracos(p.especie.opcoes).map((t) => `<li><b>${esc(t.nome)}:</b> ${esc(t.desc)}</li>`).join('')}</ul>
      ${p.especie.id === 'humano' && p.especie.opcoes.talento === 'habilidoso' ? '<p><small>Habilidoso é o talento recomendado para Humanos. As 3 perícias você marca no passo 6.</small></p>' : ''}
    </div>`;
  }
  return `${mestre(`<p>A <b>espécie</b> define o corpo do personagem: tamanho, deslocamento e traços especiais como visão no escuro ou um sopro de dragão.</p>
    <p>Nas regras de 2024 a espécie <b>não muda atributos</b> (isso agora vem do antecedente), então escolha pelo que combina com a história.</p>`)}
    ${cartoes('especie', itens, p.especie.id)}${detalhe}`;
}

function passoAtributos() {
  const at = p.atributos;
  const cls = CLASSES[p.classe.id];
  const metodos = [
    ['padrao', 'Array padrão', 'Os valores 15, 14, 13, 12, 10 e 8. Equilibrado e rápido.'],
    ['compra', 'Compra de pontos', '27 pontos para gastar, valores de 8 a 15. Você controla tudo.'],
    ['rolagem', 'Rolagem 4d6', 'Rola 4d6 e descarta o menor, seis vezes. Pode ser aqui ou na mesa, com seus dados.'],
  ];
  let corpo = '';
  if (at.metodo === 'padrao' || at.metodo === 'rolagem') {
    let topo = '';
    if (at.metodo === 'rolagem') {
      topo = `<div class="rolagem-modo">
        <label class="radio"><input type="radio" name="rolagem-modo" data-acao="rolagem-manual" value="0" ${!at.manual ? 'checked' : ''}> Rolar aqui na tela</label>
        <label class="radio"><input type="radio" name="rolagem-modo" data-acao="rolagem-manual" value="1" ${at.manual ? 'checked' : ''}> Rolei na mesa, vou digitar</label>
      </div>
      <div class="rolagens">${Array.from({ length: 6 }, (_, i) => {
        const r = at.rolagens[i];
        if (at.manual) return `<label class="rolagem">Total ${i + 1}<input type="number" min="3" max="18" data-acao="rolagem-total" data-indice="${i}" value="${r?.total ?? ''}"></label>`;
        const dados = r?.dados ? r.dados.map((d, j) => `<span class="dado ${j === r.descartado ? 'fora' : ''}">${d}</span>`).join('') : '<span class="dado vazio">?</span>'.repeat(4);
        return `<div class="rolagem" id="rolagem-${i}"><div class="dados">${dados}</div><b>${r?.total ?? '—'}</b>
          ${r ? '' : `<button class="btn-pequeno" data-acao="rolar" data-indice="${i}">Rolar</button>`}</div>`;
      }).join('')}</div>
      ${!at.manual && at.rolagens.filter(Boolean).length < 6 ? '<button class="btn" data-acao="rolar-todos">Rolar todos</button>' : ''}
      ${!at.manual && at.rolagens.length ? '<button class="btn-link" data-acao="rolar-limpar">Rolar de novo do zero</button>' : ''}`;
    }
    const valores = valoresDisponiveis(at) || [];
    const atrib = at.atribuicao || {};
    const usados = new Set(Object.values(atrib).filter((x) => x != null && x !== '').map(Number));
    corpo = `${topo}
      ${cls && at.metodo === 'padrao' ? `<button class="btn-pequeno" data-acao="array-sugestao">Usar a sugestão do SRD para ${cls.nome}</button>` : ''}
      ${valores.length === 6 ? `<div class="atrib-grade">${ATRIBUTOS.map((a) => `<label>${a.nome}
        <select data-acao="atribuir" data-atr="${a.id}">${opcoesSelect(valores.map((v, i) => [i, String(v), usados.has(i) && Number(atrib[a.id]) !== i]), atrib[a.id] ?? '', '—')}</select></label>`).join('')}</div>` : ''}`;
  } else if (at.metodo === 'compra') {
    const { resta } = custoCompra(at.base);
    corpo = `<p class="pontos ${resta < 0 ? 'erro' : ''}">Pontos restantes: <b>${resta}</b> de ${PONTOS_TOTAL}</p>
      <div class="compra">${ATRIBUTOS.map((a) => {
        const v = at.base[a.id] ?? 8;
        const proximo = CUSTO_PONTOS[v + 1];
        const podeSubir = v < 15 && proximo - CUSTO_PONTOS[v] <= resta;
        return `<div class="compra-linha"><span>${a.nome}</span>
          <button class="btn-redondo" data-acao="compra" data-atr="${a.id}" data-delta="-1" ${v <= 8 ? 'disabled' : ''}>−</button>
          <b>${v}</b>
          <button class="btn-redondo" data-acao="compra" data-atr="${a.id}" data-delta="1" ${podeSubir ? '' : 'disabled'}>+</button>
          <small>custo ${CUSTO_PONTOS[v]}</small></div>`;
      }).join('')}</div>
      <p><small>Custos: 8=0 · 9=1 · 10=2 · 11=3 · 12=4 · 13=5 · 14=7 · 15=9</small></p>`;
  }

  const opcoesAnt = atributosDoAntecedente(p);
  let bonus = '';
  if (opcoesAnt) {
    const b = at.bonus;
    const pares = opcoesAnt.map((id) => [id, nomeAtr(id)]);
    bonus = `<h4>Bônus do antecedente (${ANTECEDENTES[p.antecedente.id].nome})</h4>
      <div class="rolagem-modo">
        <label class="radio"><input type="radio" name="bonus-modo" data-campo="atributos.bonus.modo" value="2-1" ${b.modo !== '1-1-1' ? 'checked' : ''}> +2 em um e +1 em outro</label>
        <label class="radio"><input type="radio" name="bonus-modo" data-campo="atributos.bonus.modo" value="1-1-1" ${b.modo === '1-1-1' ? 'checked' : ''}> +1 em ${opcoesAnt.map(nomeAtr).join(', ')}</label>
      </div>
      ${b.modo !== '1-1-1' ? `<div class="form">
        <label>+2 em <select data-campo="atributos.bonus.mais2">${opcoesSelect(pares, b.mais2)}</select></label>
        <label>+1 em <select data-campo="atributos.bonus.mais1">${opcoesSelect(pares.map(([v, t]) => [v, t, v === b.mais2]), b.mais1)}</select></label>
      </div>` : ''}`;
  }
  const bon = bonusAntecedente(p);
  const d = calcular(p);
  const tabela = `<table class="tabela tabela-atr"><thead><tr><th></th>${ATRIBUTOS.map((a) => `<th>${a.curto}</th>`).join('')}</tr></thead><tbody>
    <tr><td>Base</td>${ATRIBUTOS.map((a) => `<td>${at.base[a.id] ?? '—'}</td>`).join('')}</tr>
    <tr><td>Antecedente</td>${ATRIBUTOS.map((a) => `<td>${bon[a.id] ? '+' + bon[a.id] : ''}</td>`).join('')}</tr>
    <tr class="forte"><td>Final</td>${ATRIBUTOS.map((a) => `<td>${d.atr[a.id] ?? '—'}</td>`).join('')}</tr>
    <tr><td>Mod.</td>${ATRIBUTOS.map((a) => `<td>${d.atr[a.id] == null ? '' : sinal(d.mods[a.id])}</td>`).join('')}</tr></tbody></table>`;

  return `${mestre(`<p>Agora os <b>atributos</b>: Força, Destreza, Constituição, Inteligência, Sabedoria e Carisma. Como você quer gerar os valores?</p>
    ${cls ? `<p>Para ${cls.nome}, coloque o maior valor em <b>${cls.primario.map(nomeAtr).join(' e ')}</b>. Constituição alta sempre ajuda (mais PV).</p>` : ''}`)}
    <div class="cartoes cartoes-3">${metodos.map(([id, t, c]) => `<button class="cartao ${at.metodo === id ? 'on' : ''}" data-acao="metodo" data-valor="${id}"><span class="cartao-titulo">${t}</span><span class="cartao-corpo">${c}</span></button>`).join('')}</div>
    ${corpo}${bonus}${at.metodo ? tabela : ''}`;
}

function passoPericias() {
  const cls = CLASSES[p.classe.id];
  if (!cls) return mestre('<p>Escolha uma classe primeiro (passo 2).</p>');
  const fixas = periciasFixas(p);
  const prof = periciasProficientes(p);
  const blocos = [];

  const deClasse = cls.pericias.de === 'todas' ? PERICIAS.map((s) => s.id) : cls.pericias.de;
  blocos.push(`<h4>Perícias da classe <small>(escolha ${cls.pericias.n})</small></h4>
    ${checkLista('pericias.classe', deClasse.map((id) => [id, nomePericia(id)]), { max: cls.pericias.n, fixos: new Map([...fixas].filter(([id]) => deClasse.includes(id))) })}
    ${fixas.size ? `<p><small>Já vêm de outras fontes: ${[...fixas].map(([id, o]) => `${nomePericia(id)} (${o})`).join(', ')}.</small></p>` : ''}`);

  if (cls.especialista) {
    blocos.push(`<h4>Especialização <small>(${cls.especialista} perícias com o dobro da proficiência)</small></h4>
      ${prof.size ? checkLista('pericias.especialista', [...prof].map((id) => [id, nomePericia(id)]), { max: cls.especialista }) : '<p>Escolha as perícias primeiro.</p>'}`);
  }
  if (cls.ferramentas) {
    blocos.push(`<h4>Ferramentas da classe</h4><div class="form"><label class="larga">${cls.ferramentas.desc}
      <input data-campo="ferramentas.classe" value="${esc(p.ferramentas.classe)}" placeholder="${cls.ferramentas.n > 1 ? 'Ex.: Alaúde, Flauta, Tambor' : 'Ex.: Ferramentas de Carpinteiro'}"></label></div>`);
  }

  // Talentos de origem que pedem escolhas
  for (const f of fontesTalento(p)) {
    const c = configTalento(p, f.chave);
    const base = `talentos.${f.chave}`;
    if (!p.talentos[f.chave]) p.talentos[f.chave] = c;
    if (f.id === 'iniciado') {
      const lista = f.listaFixa || c.lista;
      const magias = lista ? LISTAS_MAGIA[lista] : [];
      blocos.push(`<h4>Iniciado em Magia <small>· ${esc(f.origem)}</small></h4>
        <div class="form">
          ${f.listaFixa ? `<p>Lista: <b>${LISTAS_INICIADO[f.listaFixa]}</b></p>` : `<label>Lista <select data-campo="${base}.lista">${opcoesSelect(Object.entries(LISTAS_INICIADO), c.lista)}</select></label>`}
          <label>Atributo de conjuração <select data-campo="${base}.atributo">${opcoesSelect([['int', 'Inteligência'], ['sab', 'Sabedoria'], ['car', 'Carisma']], c.atributo)}</select></label>
        </div>
        ${lista ? `<p>2 truques:</p>${checkLista(`${base}.truques`, magias.filter((id) => MAGIAS[id].nivel === 0).map((id) => [id, MAGIAS[id].nome]), { max: 2, descricao: (id) => MAGIAS[id].desc })}
        <p>1 magia de 1º círculo:</p>${checkLista(`${base}.magiaLista`, magias.filter((id) => MAGIAS[id].nivel === 1).map((id) => [id, MAGIAS[id].nome]), { max: 1, atual: c.magia ? [c.magia] : [], descricao: (id) => MAGIAS[id].desc })}` : ''}`);
    }
    if (f.id === 'habilidoso') {
      const outras = new Set([...prof].filter((id) => !c.pericias.includes(id)));
      blocos.push(`<h4>Habilidoso <small>· ${esc(f.origem)} · 3 perícias ou ferramentas</small></h4>
        ${checkLista(`${base}.pericias`, PERICIAS.map((s) => [s.id, s.nome]), { desabilitados: outras })}
        <div class="form"><label class="larga">Ferramentas (separe por vírgula) <input data-campo="${base}.ferramentas" value="${esc(c.ferramentas)}"></label></div>`);
    }
  }

  // Idiomas
  const extraOpcoes = [...IDIOMAS_PADRAO.map((i) => i.nome), ...IDIOMAS_RAROS].filter((n) => !p.idiomas.some((id) => IDIOMAS_PADRAO.find((i) => i.id === id)?.nome === n) && !(cls.idiomasFixos || []).includes(n));
  blocos.push(`<h4>Idiomas <small>(Comum + 2)</small></h4>
    ${checkLista('idiomas', IDIOMAS_PADRAO.map((i) => [i.id, i.nome, `d12: ${i.d12}`]), { max: 2 })}
    <button class="btn-pequeno" data-acao="rolar-idioma">Rolar 1d12 para um idioma</button>
    ${cls.idiomasFixos ? `<p><small>A classe já dá: ${cls.idiomasFixos.join(', ')}.</small></p>` : ''}
    ${cls.idiomaExtra ? `<div class="form"><label>Idioma extra do Ladino <select data-campo="idiomaExtra">${opcoesSelect(extraOpcoes.map((n) => [n, n]), p.idiomaExtra)}</select></label></div>` : ''}`);

  // Maestria
  if (cls.maestria) {
    const cats = new Set(cls.armas);
    const op = cls.opcao?.itens[p.classe.opcao];
    if (op?.armas) op.armas.forEach((x) => cats.add(x));
    const armas = Object.entries(ARMAS).filter(([id]) => proficienteComArma(id, cats));
    blocos.push(`<h4>Maestria em Armas <small>(${cls.maestria} tipos de arma)</small></h4>
      ${checkLista('classe.maestria', armas.map(([id, a]) => [id, a.nome, `· ${MAESTRIAS[a.maestria].nome}`]), { max: cls.maestria, descricao: (id) => MAESTRIAS[ARMAS[id].maestria].desc })}`);
  }

  // Equipamento
  const ant = ANTECEDENTES[p.antecedente.id];
  const descKit = (k) => {
    const partes = [];
    if (k.armadura) partes.push(ARMADURAS[k.armadura].nome);
    if (k.escudo) partes.push('Escudo');
    const armas = {};
    k.armas.forEach((a) => (armas[a] = (armas[a] || 0) + 1));
    Object.entries(armas).forEach(([a, n]) => partes.push(n > 1 ? `${n} ${plural(ARMAS[a].nome)}` : ARMAS[a].nome));
    partes.push(...k.itens);
    partes.push(`${k.po} PO`);
    return partes.join(', ');
  };
  const radiosKit = (campo, kits, atual) => kits.map((k) => `<label class="radio bloco"><input type="radio" name="${campo}" data-campo="equipamento.${campo}" value="${k.letra}" ${atual === k.letra ? 'checked' : ''}>
    <span><b>Opção ${k.letra}:</b> ${esc(descKit(k))}</span></label>`).join('');
  const inv = calcular(p).inventario;
  const $ = moedas(inv.pc);
  // Preço na maior moeda exata, como no livro (5 PC, 2 PP, 15 PO).
  const preco = (pc) => (pc % 100 === 0 ? `${pc / 100} PO` : pc % 10 === 0 ? `${pc / 10} PP` : `${pc} PC`);
  const grupo = (rotulo, itens) => `<optgroup label="${rotulo}">${itens.map(([v, t]) => `<option value="${v}">${esc(t)}</option>`).join('')}</optgroup>`;
  const loja = `<option value="">Comprar com o ouro…</option>`
    + grupo('Armas', Object.entries(ARMAS).map(([id, a]) => [`arma:${id}`, `${a.nome} (${preco(a.custo)})`]))
    + grupo('Armaduras e escudo', [...Object.entries(ARMADURAS).map(([id, a]) => [`armadura:${id}`, `${a.nome} (${preco(a.custo)})`]), ['escudo:escudo', `Escudo (${preco(ESCUDO.custo)})`]])
    + grupo('Kits de equipamento', Object.entries(PACOTES).map(([id, a]) => [`pacote:${id}`, `${a.nome} (${preco(a.custo)})`]));
  const nomeCompra = (c) => (c.tipo === 'arma' ? ARMAS[c.id].nome : c.tipo === 'armadura' ? ARMADURAS[c.id].nome : c.tipo === 'escudo' ? 'Escudo' : PACOTES[c.id].nome);
  blocos.push(`<h4>Equipamento inicial</h4>
    <p><b>${cls.nome}:</b></p>${radiosKit('kitClasse', cls.kits, p.equipamento.kitClasse)}
    ${ant ? `<p><b>${ant.nome}:</b></p>${radiosKit('kitAntecedente', ant.kits, ant.personalizado ? 'B' : p.equipamento.kitAntecedente)}` : ''}
    <p class="ouro ${inv.pc < 0 ? 'erro' : ''}">Ouro disponível: <b>${$.negativo ? '−' : ''}${Math.abs($.po)} PO${$.pp ? ` ${$.pp} PP` : ''}${$.pc ? ` ${$.pc} PC` : ''}</b></p>
    <div class="loja"><select id="loja-item">${loja}</select><button class="btn-pequeno" data-acao="comprar">Comprar</button></div>
    ${p.equipamento.compras.length ? `<ul class="compras">${p.equipamento.compras.map((c, i) => `<li>${esc(nomeCompra(c))} <button class="btn-x" data-acao="devolver" data-indice="${i}" title="Devolver">×</button></li>`).join('')}</ul>` : ''}
    <div class="form"><label class="larga">Outros itens (um por linha) <textarea data-campo="equipamento.extras" rows="2">${esc(p.equipamento.extras)}</textarea></label></div>`);

  // Magias
  const im = infoMagia(p);
  if (im) {
    const lista = LISTAS_MAGIA[im.lista];
    const deEspecie = new Set(truquesEspecie(p));
    const truques = lista.filter((id) => MAGIAS[id].nivel === 0);
    const nivel1 = lista.filter((id) => MAGIAS[id].nivel === 1 && !(im.sempre || []).includes(id));
    const tag = (id) => [MAGIAS[id].conc && 'C', MAGIAS[id].ritual && 'R'].filter(Boolean).join(', ');
    blocos.push(`<h4>Magias de ${cls.nome} <small>· atributo ${nomeAtr(im.atr)}</small></h4>
      ${im.truques ? `<p>Truques <small>(escolha ${im.truques}; passe o mouse para ver o que fazem)</small>:</p>
        ${checkLista('magias.truques', truques.map((id) => [id, MAGIAS[id].nome]), { max: im.truques, desabilitados: deEspecie, descricao: (id) => MAGIAS[id].desc })}` : ''}
      <p>Magias de 1º círculo preparadas <small>(escolha ${im.preparadas}; C = concentração, R = ritual)</small>:</p>
      ${checkLista('magias.preparadas', nivel1.map((id) => [id, MAGIAS[id].nome, tag(id) ? `(${tag(id)})` : '']), { max: im.preparadas, descricao: (id) => MAGIAS[id].desc })}
      ${im.sempre ? `<p><small>Sempre preparada: ${im.sempre.map((id) => MAGIAS[id].nome).join(', ')}.</small></p>` : ''}
      ${im.grimorio ? `<p><small>O Livro de Magias começa com ${im.grimorio} magias de 1º círculo: as ${im.preparadas} preparadas e mais ${im.grimorio - im.preparadas}. Anote as outras em "Outros itens".</small></p>` : ''}`);
  }

  return `${mestre(`<p>Hora dos detalhes do treinamento: <b>perícias</b>, <b>idiomas</b>, <b>equipamento</b>${im ? ' e <b>magias</b>' : ''}.</p>
    <p>Equipamento: a opção A já vem montada; a opção de ouro deixa você comprar item por item.</p>`)}${blocos.join('')}`;
}

function passoCombate() {
  const d = calcular(p);
  const m = (id) => (d.mods[id] == null ? '?' : sinal(d.mods[id]));
  const temAlerta = fontesTalento(p).some((f) => f.id === 'alerta');
  const linhas = [
    ['Pontos de Vida', d.pvMax ?? '—', d.cls ? `d${d.cls.dado} no máximo (${d.cls.dado}) + CON (${m('con')})${d.esp?.pvPorNivel ? ' + 1 (Robustez Anã)' : ''}` : 'Escolha a classe.'],
    ['Classe de Armadura', d.ca.ca, d.ca.como],
    ['Iniciativa', sinal(d.iniciativa), `DES (${m('des')})${temAlerta ? ` + proficiência (${sinal(d.pb)}, talento Alerta)` : ''}`],
    ['Bônus de Proficiência', sinal(d.pb), 'Nível 1'],
    ['Percepção passiva', d.percepcaoPassiva, '10 + bônus de Percepção'],
    ['Deslocamento', d.deslocamento ? metros(d.deslocamento) : '—', d.esp ? d.esp.nome : ''],
  ];
  if (d.magia) {
    linhas.push(['CD de magia', d.magia.cd, `8 + proficiência + ${nomeAtr(d.magia.atr)}`]);
    linhas.push(['Ataque mágico', sinal(d.magia.ataque), `proficiência + ${nomeAtr(d.magia.atr)}`]);
  }
  return `${mestre(`<p>Com tudo escolhido, os números de combate saem sozinhos. Confira as contas abaixo, elas seguem o SRD.</p>
    <p>No nível 1 o PV é sempre o máximo do Dado de Ponto de Vida. Quer testar? Role uma iniciativa.</p>`)}
    <table class="tabela contas"><tbody>${linhas.map(([a, b, c]) => `<tr><td>${a}</td><td class="num">${b}</td><td><small>${esc(c)}</small></td></tr>`).join('')}</tbody></table>
    <button class="btn" data-acao="rolar-teste" data-bonus="${d.iniciativa}" data-rotulo="Iniciativa">Rolar iniciativa (d20${sinal(d.iniciativa)})</button>
    <h4>Ataques</h4>
    <table class="tabela"><thead><tr><th>Arma</th><th>Bônus</th><th>Dano</th><th></th></tr></thead><tbody>
    ${d.ataques.map((a) => `<tr><td>${esc(a.nome)}</td><td>${sinal(a.bonus)}</td><td>${esc(a.dano)}</td>
      <td><button class="btn-pequeno" data-acao="rolar-teste" data-bonus="${a.bonus}" data-rotulo="Ataque com ${esc(a.nome)}">Rolar</button></td></tr>`).join('')}</tbody></table>
    ${d.avisos.length ? `<div class="avisos"><b>Atenção:</b><ul>${d.avisos.map((a) => `<li>${esc(a)}</li>`).join('')}</ul></div>` : ''}`;
}

function passoDetalhes() {
  const dt = p.detalhes;
  const campo = (id, rotulo, ph = '') => `<label>${rotulo}<input data-campo="detalhes.${id}" value="${esc(dt[id])}" placeholder="${ph}"></label>`;
  const area = (id, rotulo, ph = '', rows = 3) => `<label class="larga">${rotulo}<textarea data-campo="detalhes.${id}" rows="${rows}" placeholder="${ph}">${esc(dt[id])}</textarea></label>`;
  return `${mestre(`<p>Últimos toques: o <b>alinhamento</b>, a aparência e a personalidade. Essa parte é a que mais me ajuda a criar ganchos para a história.</p>
    <p>Algumas perguntas do SRD para inspirar: quem te criou? Qual era seu melhor amigo de infância? Você já se apaixonou? O que te faz partir em aventuras agora?</p>`)}
    <div class="form">
      <label>Alinhamento <select data-campo="detalhes.tendencia">${opcoesSelect(TENDENCIAS.map((t) => [t, t]), dt.tendencia)}</select></label>
      ${campo('idade', 'Idade')}${campo('altura', 'Altura')}${campo('peso', 'Peso')}
      ${campo('olhos', 'Olhos')}${campo('pele', 'Pele')}${campo('cabelo', 'Cabelo')}
      ${area('aparencia', 'Aparência', 'Como os outros te veem à primeira vista')}
      ${area('tracos', 'Traços de personalidade', 'Ex.: falo pouco, mas observo tudo', 2)}
      ${area('ideais', 'Ideais', 'Ex.: a liberdade vale mais que a lei', 2)}
      ${area('vinculos', 'Vínculos', 'Ex.: devo a vida ao velho ferreiro de Pedravale', 2)}
      ${area('defeitos', 'Defeitos', 'Ex.: não resisto a uma aposta', 2)}
      ${area('historia', 'História', '', 5)}
      ${area('aliados', 'Aliados e organizações', '', 2)}
    </div>
    <button class="btn" data-acao="foto">${dt.foto ? 'Trocar o retrato' : 'Escolher um retrato'}</button>
    ${dt.foto ? '<button class="btn-link" data-acao="foto-remover">Remover retrato</button>' : ''}`;
}

function passoFinal() {
  const pend = pendencias(p);
  const lista = Object.entries(pend).flatMap(([i, msgs]) => msgs.map((m) => `<li><a href="#" data-acao="ir" data-valor="${i}">${PASSOS[i]}</a>: ${esc(m)}</li>`));
  return `${mestre(`<p>${lista.length ? 'A ficha está quase pronta. Ainda falta:' : `<b>${esc(p.conceito.nome) || 'Seu personagem'}</b> está pronto para a aventura!`}</p>
    ${lista.length ? `<ul class="pendencias">${lista.join('')}</ul>` : ''}
    <p>Baixe a ficha nos formatos abaixo. O <b>Markdown</b> é o que vai para a pasta <code>personagens/</code> e para o Projeto do Claude, onde eu conduzo a campanha.</p>`)}
    <div class="exportar">
      <button class="btn" data-acao="exportar-pdf">Baixar PDF (ficha oficial)</button>
      <button class="btn" data-acao="exportar-md">Baixar Markdown</button>
      <button class="btn" data-acao="exportar-json">Salvar ficha (.json)</button>
      <button class="btn" data-acao="imprimir">Imprimir</button>
    </div>`;
}

const RENDER_PASSO = [passoConceito, passoClasse, passoAntecedente, passoEspecie, passoAtributos, passoPericias, passoCombate, passoDetalhes, passoFinal];

// ---------------------------------------------------------------- render

function renderPassos() {
  const pend = pendencias(p);
  // PV/CA e a ficha completa não têm escolhas próprias: ficam "feitos" quando os passos anteriores estão.
  const feito = (i) => (i === 6 || i === 8 ? Object.keys(pend).every((k) => Number(k) >= i) : !pend[i]);
  document.getElementById('passos').innerHTML = PASSOS.map((nome, i) => `<button class="passo ${i === p.passo ? 'on' : ''} ${feito(i) ? 'ok' : ''}" data-acao="ir" data-valor="${i}">
    <span class="passo-num">${i + 1}</span><span class="passo-nome">${nome}</span></button>`).join('');
}

function renderFichaColuna() {
  const d = calcular(p);
  document.getElementById('ficha-coluna').innerHTML = renderFicha(p, d, { completa: p.passo === PASSOS.length - 1 });
}

function render() {
  const final = p.passo === PASSOS.length - 1;
  document.getElementById('palco').classList.toggle('final', final);
  renderPassos();
  const pend = pendencias(p)[p.passo];
  document.getElementById('mestre').innerHTML = `
    <h2><span class="num">${p.passo + 1}</span> ${PASSOS[p.passo]}</h2>
    ${RENDER_PASSO[p.passo]()}
    ${!final && pend ? `<div class="pend-passo"><b>Falta neste passo:</b> ${pend.map(esc).join(' · ')}</div>` : ''}
    <div class="navegar">
      ${p.passo > 0 ? '<button class="btn-link" data-acao="voltar">← Voltar</button>' : '<span></span>'}
      ${!final ? `<button class="btn" data-acao="avancar">${p.passo === PASSOS.length - 2 ? 'Ver a ficha completa' : 'Próximo passo'} →</button>` : ''}
    </div>`;
  renderFichaColuna();
  salvar();
}

const renderLeve = () => { renderPassos(); renderFichaColuna(); salvar(); };

// ---------------------------------------------------------------- mudanças que zeram escolhas dependentes

function trocarClasse(id) {
  if (p.classe.id === id) return;
  p.classe = { id, opcao: null, estilo: null, invocacao: null, maestria: [] };
  p.pericias = { classe: [], especialista: [] };
  p.ferramentas.classe = '';
  p.magias = { truques: [], preparadas: [] };
  p.idiomaExtra = '';
  p.equipamento.kitClasse = 'A';
  if (p.atributos.metodo === 'padrao' && !Object.values(p.atributos.atribuicao || {}).some((v) => v !== '' && v != null)) aplicarSugestao();
}

function trocarAntecedente(id) {
  if (p.antecedente.id === id) return;
  p.antecedente = { ...p.antecedente, id, ferramenta: '' };
  p.atributos.bonus = { modo: '2-1', mais2: null, mais1: null };
  delete p.talentos.antecedente;
  p.equipamento.kitAntecedente = ANTECEDENTES[id].personalizado ? 'B' : 'A';
  limparPericiasInvalidas();
}

function trocarEspecie(id) {
  if (p.especie.id === id) return;
  p.especie = { id, opcoes: {} };
  delete p.talentos.humano;
  limparPericiasInvalidas();
}

function limparPericiasInvalidas() {
  const fixas = periciasFixas(p);
  p.pericias.classe = p.pericias.classe.filter((s) => !fixas.has(s));
  const prof = periciasProficientes(p);
  p.pericias.especialista = p.pericias.especialista.filter((s) => prof.has(s));
}

function aplicarSugestao() {
  const cls = CLASSES[p.classe.id];
  if (!cls) return;
  p.atributos.atribuicao = {};
  for (const a of ATRIBUTOS) {
    p.atributos.atribuicao[a.id] = String(ARRAY_PADRAO.indexOf(cls.arrayPadrao[a.id]));
  }
  recalcularBase();
}

function recalcularBase() {
  const valores = valoresDisponiveis(p.atributos) || [];
  const atrib = p.atributos.atribuicao || {};
  for (const a of ATRIBUTOS) {
    const i = atrib[a.id];
    p.atributos.base[a.id] = i === '' || i == null || valores[Number(i)] == null ? null : valores[Number(i)];
  }
}

// ---------------------------------------------------------------- dados animados

function animarRolagem(indices) {
  const caixas = indices.map((i) => document.querySelector(`#rolagem-${i} .dados`)).filter(Boolean);
  let n = 0;
  const timer = setInterval(() => {
    for (const c of caixas) c.innerHTML = Array.from({ length: 4 }, () => `<span class="dado girando">${rolarDado(6)}</span>`).join('');
    if (++n >= 10) {
      clearInterval(timer);
      for (const i of indices) p.atributos.rolagens[i] = rolar4d6(rolarDado);
      recalcularBase();
      render();
    }
  }, 60);
}

function rolarTeste(bonus, rotulo) {
  const d20 = rolarDado(20);
  const total = d20 + bonus;
  const nota = d20 === 20 ? ' · <b>20 natural!</b>' : d20 === 1 ? ' · <b>1 natural…</b>' : '';
  toast(`🎲 ${esc(rotulo)}: d20${sinal(bonus)} = <b>${d20}</b>${sinal(bonus)} = <b>${total}</b>${nota}`);
}

// ---------------------------------------------------------------- eventos

const ACOES = {
  ir: (el) => { p.passo = Number(el.dataset.valor); render(); window.scrollTo({ top: 0, behavior: 'smooth' }); },
  avancar: () => ACOES.ir({ dataset: { valor: Math.min(p.passo + 1, PASSOS.length - 1) } }),
  voltar: () => ACOES.ir({ dataset: { valor: Math.max(p.passo - 1, 0) } }),
  classe: (el) => { trocarClasse(el.dataset.valor); render(); },
  'classe-opcao': (el) => { p.classe.opcao = el.dataset.valor; p.magias.truques = []; render(); },
  'classe-estilo': (el) => { p.classe.estilo = el.dataset.valor; render(); },
  'classe-invocacao': (el) => { p.classe.invocacao = el.dataset.valor; render(); },
  antecedente: (el) => { trocarAntecedente(el.dataset.valor); render(); },
  especie: (el) => { trocarEspecie(el.dataset.valor); render(); },
  metodo: (el) => {
    const at = p.atributos;
    if (at.metodo === el.dataset.valor) return;
    at.metodo = el.dataset.valor;
    at.atribuicao = {};
    at.base = { for: null, des: null, con: null, int: null, sab: null, car: null };
    if (at.metodo === 'compra') for (const a of ATRIBUTOS) at.base[a.id] = 8;
    if (at.metodo === 'padrao') aplicarSugestao();
    render();
  },
  'array-sugestao': () => { aplicarSugestao(); render(); },
  compra: (el) => {
    const v = (p.atributos.base[el.dataset.atr] ?? 8) + Number(el.dataset.delta);
    if (v < 8 || v > 15) return;
    p.atributos.base[el.dataset.atr] = v;
    render();
  },
  rolar: (el) => animarRolagem([Number(el.dataset.indice)]),
  'rolar-todos': () => animarRolagem([0, 1, 2, 3, 4, 5].filter((i) => !p.atributos.rolagens[i])),
  'rolar-limpar': () => { p.atributos.rolagens = []; p.atributos.atribuicao = {}; recalcularBase(); render(); },
  'rolar-idioma': () => {
    const r = rolarDado(12);
    const id = IDIOMA_POR_D12[r - 1];
    const nome = IDIOMAS_PADRAO.find((i) => i.id === id).nome;
    if (p.idiomas.includes(id)) toast(`🎲 d12 = <b>${r}</b>: ${nome}, que você já tem. Role de novo.`);
    else if (p.idiomas.length >= 2) toast(`🎲 d12 = <b>${r}</b>: ${nome}. Você já tem 2 idiomas; desmarque um para trocar.`);
    else { p.idiomas.push(id); toast(`🎲 d12 = <b>${r}</b>: ${nome}!`); render(); }
  },
  comprar: () => {
    const v = document.getElementById('loja-item').value;
    if (!v) return;
    const [tipo, id] = v.split(':');
    p.equipamento.compras.push({ tipo, id });
    render();
  },
  devolver: (el) => { p.equipamento.compras.splice(Number(el.dataset.indice), 1); render(); },
  'rolar-teste': (el) => rolarTeste(Number(el.dataset.bonus), el.dataset.rotulo),
  foto: () => document.getElementById('arquivo-foto').click(),
  'foto-remover': () => { p.detalhes.foto = ''; render(); },
  'exportar-md': () => baixar(`${nomeArquivo()}.md`, exportarMarkdown(p, calcular(p)), 'text/markdown'),
  'exportar-json': () => baixar(`${nomeArquivo()}.json`, exportarJSON(p), 'application/json'),
  'exportar-pdf': async () => {
    try {
      toast('Montando o PDF…');
      const bytes = await exportarPDF(p, calcular(p), () => escolherPDF());
      baixar(`${nomeArquivo()}.pdf`, bytes, 'application/pdf');
      toast('PDF pronto!');
    } catch (e) {
      console.error(e);
      toast(`Não consegui gerar o PDF: ${esc(e.message)}`, 6000);
    }
  },
  imprimir: () => window.print(),
  'carregar-json': () => document.getElementById('arquivo-json').click(),
  novo: () => {
    if (!confirm('Começar um personagem novo? A ficha atual será apagada deste navegador (salve o .json antes, se quiser guardar).')) return;
    p = personagemNovo();
    render();
  },
};

const nomeArquivo = () => (p.conceito.nome.trim() || 'personagem').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Se a ficha modelo não puder ser lida pelo servidor, pede o arquivo ao usuário.
function escolherPDF() {
  return new Promise((resolve, reject) => {
    const input = document.getElementById('arquivo-pdf');
    toast('Não achei regras/ficha/FICHA_MODEL.pdf. Escolha o arquivo da ficha modelo.', 6000);
    input.onchange = async () => {
      const f = input.files[0];
      input.value = '';
      if (!f) return reject(new Error('nenhum arquivo escolhido'));
      resolve(new Uint8Array(await f.arrayBuffer()));
    };
    input.click();
  });
}

document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-acao]');
  if (!el || el.tagName === 'INPUT' || el.tagName === 'SELECT') return;
  ev.preventDefault();
  ACOES[el.dataset.acao]?.(el);
});

document.addEventListener('input', (ev) => {
  const el = ev.target;
  if (el.dataset.campo && (el.tagName === 'TEXTAREA' || (el.tagName === 'INPUT' && !['radio', 'checkbox'].includes(el.type)))) {
    gravar(el.dataset.campo, el.value);
    renderLeve();
  }
  if (el.dataset.acao === 'rolagem-total') {
    const n = Number(el.value);
    p.atributos.rolagens[Number(el.dataset.indice)] = { total: n >= 3 && n <= 18 ? n : null };
    recalcularBase();
    renderLeve();
  }
});

document.addEventListener('change', (ev) => {
  const el = ev.target;
  if (el.dataset.lista) {
    const path = el.dataset.lista;
    if (path.endsWith('.magiaLista')) {
      // magia única do Iniciado em Magia: guardada como string
      const base = path.replace('.magiaLista', '');
      gravar(`${base}.magia`, el.checked ? el.value : null);
    } else {
      const lista = [...(ler(path) || [])];
      const i = lista.indexOf(el.value);
      if (el.checked && i < 0) lista.push(el.value);
      if (!el.checked && i >= 0) lista.splice(i, 1);
      gravar(path, lista);
    }
    if (path === 'antecedente.personalizado.atributos') p.atributos.bonus = { modo: p.atributos.bonus.modo, mais2: null, mais1: null };
    limparPericiasInvalidas();
    render();
    return;
  }
  if (el.dataset.campo && (el.tagName === 'SELECT' || el.type === 'radio')) {
    gravar(el.dataset.campo, el.value || null);
    if (el.dataset.campo === 'especie.opcoes.talento') delete p.talentos.humano;
    if (el.dataset.campo === 'especie.opcoes.pericia') limparPericiasInvalidas();
    if (el.dataset.campo.endsWith('.lista')) { const base = el.dataset.campo.replace('.lista', ''); gravar(`${base}.truques`, []); gravar(`${base}.magia`, null); }
    if (el.dataset.campo === 'atributos.bonus.mais2' && p.atributos.bonus.mais1 === el.value) p.atributos.bonus.mais1 = null;
    render();
    return;
  }
  if (el.dataset.acao === 'atribuir') {
    p.atributos.atribuicao ||= {};
    p.atributos.atribuicao[el.dataset.atr] = el.value;
    recalcularBase();
    render();
    return;
  }
  if (el.dataset.acao === 'rolagem-manual') {
    p.atributos.manual = el.value === '1';
    p.atributos.rolagens = [];
    p.atributos.atribuicao = {};
    recalcularBase();
    render();
    return;
  }
  if (el.dataset.acao === 'rolagem-total') render();
});

document.getElementById('arquivo-json').addEventListener('change', async (ev) => {
  const f = ev.target.files[0];
  ev.target.value = '';
  if (!f) return;
  try {
    const dados = JSON.parse(await f.text());
    if (dados?.v !== 1) throw new Error('arquivo não é uma ficha deste app');
    p = abrirFicha(dados);
    render();
    toast(`Ficha de <b>${esc(p.conceito.nome || 'personagem')}</b> carregada.`);
  } catch (e) {
    toast(`Não consegui abrir: ${esc(e.message)}`, 6000);
  }
});

document.getElementById('arquivo-foto').addEventListener('change', (ev) => {
  const f = ev.target.files[0];
  ev.target.value = '';
  if (!f) return;
  // Reduz a imagem para caber no localStorage (máx. 480 px de altura).
  const img = new Image();
  img.onload = () => {
    const escala = Math.min(1, 480 / img.height);
    const c = document.createElement('canvas');
    c.width = Math.round(img.width * escala);
    c.height = Math.round(img.height * escala);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    p.detalhes.foto = c.toDataURL('image/jpeg', 0.85);
    URL.revokeObjectURL(img.src);
    render();
  };
  img.src = URL.createObjectURL(f);
});

render();
