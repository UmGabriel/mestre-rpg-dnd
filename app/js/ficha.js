// Desenha a ficha (pergaminho) a partir do estado e dos valores calculados.
import { ATRIBUTOS, MAGIAS, MAESTRIAS, ARMADURAS, ESCUDO } from './dados.js';
import { sinal, metros, agrupar } from './regras.js';

export const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const ICONES = {
  pv: '<svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.2 3 4.5 6.6 4.5c2.1 0 3.6 1.2 4.4 2.6.8-1.4 2.3-2.6 4.4-2.6 3.6 0 5.7 3.7 4.2 7.2C19.5 16.4 12 21 12 21z" fill="#9b2c22" stroke="#4a1a12" stroke-width="1"/></svg>',
  ca: '<svg viewBox="0 0 24 24"><path d="M12 2 4 5v6c0 5 3.4 9.4 8 11 4.6-1.6 8-6 8-11V5z" fill="#5d7a4a" stroke="#2e3b23" stroke-width="1.2"/><path d="M12 5v14M7 8h10" stroke="#e8dcc0" stroke-width="1.2"/></svg>',
  ini: '<svg viewBox="0 0 24 24"><path d="M13 2 4 14h7l-1 8 9-12h-7z" fill="#d4a017" stroke="#6b4e08" stroke-width="1"/></svg>',
  desl: '<svg viewBox="0 0 24 24"><path d="M4 18c4-1 6-4 8-8 1.5-3 4-5 8-6-1 4-3 6.5-6 8-4 2-7 4-8 8z" fill="#6b4fa0" stroke="#33234f" stroke-width="1"/></svg>',
  prof: '<svg viewBox="0 0 24 24"><path d="m12 2 2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17l-6.1 3.4 1.5-6.8L2.2 9l6.9-.7z" fill="#b5893a" stroke="#5a4218" stroke-width="1"/></svg>',
  olho: '<svg viewBox="0 0 24 24"><path d="M2 12s3.6-6 10-6 10 6 10 6-3.6 6-10 6S2 12 2 12z" fill="#e8dcc0" stroke="#3b2a1a" stroke-width="1.3"/><circle cx="12" cy="12" r="3.2" fill="#3b6b8a"/></svg>',
};

function circulo(icone, rotulo, valor, extra = '') {
  return `<div class="marca"><span class="marca-rotulo">${rotulo}</span><span class="marca-icone">${ICONES[icone]}</span>
    <span class="marca-circulo">${valor ?? '—'}</span>${extra ? `<span class="marca-extra">${extra}</span>` : ''}</div>`;
}

const linha = (rotulo, valor) => `<div class="campo-linha"><span>${rotulo}:</span><b>${esc(valor) || '&nbsp;'}</b></div>`;

export function renderFicha(p, d, { completa = false } = {}) {
  const nomeMagia = (id) => (MAGIAS[id] ? MAGIAS[id].nome : id);
  const classeNivel = d.cls ? `${d.cls.nome} ${d.nivel}` : '';
  const foto = p.detalhes.foto
    ? `<img src="${p.detalhes.foto}" alt="Retrato do personagem">`
    : '<div class="silhueta" aria-hidden="true"></div>';

  const atributos = ATRIBUTOS.map((a) => {
    const v = d.atr[a.id];
    const s = d.salvaguardas.find((x) => x.id === a.id);
    return `<div class="atributo">
      <span class="atributo-nome">${a.nome}</span>
      <span class="atributo-mod">${v == null ? '—' : sinal(d.mods[a.id])}</span>
      <span class="atributo-valor">${v ?? ''}</span>
      <span class="atributo-salv ${s.prof ? 'on' : ''}" title="Salvaguarda">${s.prof ? '●' : '○'} Salv. ${v == null ? '' : sinal(s.bonus)}</span>
    </div>`;
  }).join('');

  const pericias = d.pericias.map((s) => `<li class="${s.prof ? 'on' : ''}">
      <span class="bolinha ${s.especialista ? 'dupla' : s.prof ? 'cheia' : ''}"></span>
      <span class="nome">${s.nome} <small>(${s.atr.toUpperCase()})</small></span>
      <span class="pontos"></span><b>${d.atr[s.atr] == null ? '' : sinal(s.bonus)}</b></li>`).join('');

  const ataques = d.ataques.map((a) => `<tr>
      <td>${esc(a.nome)}${a.qtd > 1 ? ` <small>×${a.qtd}</small>` : ''}${a.prof ? '' : ' <small title="Sem proficiência">(sem prof.)</small>'}</td>
      <td>${sinal(a.bonus)}</td><td>${esc(a.dano)}</td>
      <td><small>${esc(a.props)}${a.maestria ? `${a.props ? ' · ' : ''}<b>Maestria: ${MAESTRIAS[a.maestria].nome}</b>` : ''}</small></td></tr>`).join('');

  let magia = '';
  if (d.magia || d.magiasExtras.length) {
    const m = d.magia;
    const extras = d.magiasExtras.map((x) => `<li>${esc(nomeMagia(x.id))} <small>· ${esc(x.origem)}${x.atr ? ` (${x.atr.toUpperCase()})` : ''}</small></li>`).join('');
    magia = `<section class="painel painel-magia">
      <h3>✶ Magia</h3>
      ${m ? `<div class="magia-topo">
        <div><small>Atributo</small><b>${m.atr.toUpperCase()}</b></div>
        <div><small>CD</small><b>${m.cd}</b></div>
        <div><small>Ataque</small><b>${sinal(m.ataque)}</b></div>
        <div><small>Espaços 1º</small><b>${'☐'.repeat(m.espacos[0])}</b></div>
      </div>
      ${m.limiteTruques ? `<p><b>Truques:</b> ${m.truques.map(nomeMagia).map(esc).join(', ') || '—'}</p>` : ''}
      <p><b>Preparadas:</b> ${[...m.sempre.map((id) => `${nomeMagia(id)} (sempre)`), ...m.preparadas.map(nomeMagia)].map(esc).join(', ') || '—'}</p>
      ${m.pacto ? '<p><small>Magia de Pacto: espaços voltam no descanso curto.</small></p>' : ''}` : ''}
      ${extras ? `<p><b>Outras magias:</b></p><ul class="lista-pequena">${extras}</ul>` : ''}
    </section>`;
  }

  const caracteristicas = d.caracteristicas.map((c) => `<li><b>${esc(c.nome)}</b> <small>(${esc(c.origem)})</small>${completa ? `<br><span>${esc(c.desc)}</span>` : ''}</li>`).join('');

  const inv = d.inventario;
  const equipamento = [
    ...inv.armaduras.map((id) => ARMADURAS[id].nome + ' (armadura)'),
    ...(inv.escudo ? [ESCUDO.nome] : []),
    ...agrupar(inv.armas).map(({ id, qtd }) => d.ataques.find((a) => a.id === id)?.nome + (qtd > 1 ? ` ×${qtd}` : '')),
    ...inv.itens,
    ...(p.equipamento.extras ? p.equipamento.extras.split('\n').filter((s) => s.trim()) : []),
  ].map((i) => `<li>${esc(i)}</li>`).join('');
  const $ = d.moedas;

  const historia = [
    p.conceito.ideia && `<p><i>${esc(p.conceito.ideia)}</i></p>`,
    p.detalhes.historia && `<p>${esc(p.detalhes.historia)}</p>`,
    p.detalhes.tracos && `<p><b>Traços:</b> ${esc(p.detalhes.tracos)}</p>`,
    p.detalhes.ideais && `<p><b>Ideais:</b> ${esc(p.detalhes.ideais)}</p>`,
    p.detalhes.vinculos && `<p><b>Vínculos:</b> ${esc(p.detalhes.vinculos)}</p>`,
    p.detalhes.defeitos && `<p><b>Defeitos:</b> ${esc(p.detalhes.defeitos)}</p>`,
  ].filter(Boolean).join('');

  return `<article class="ficha ${completa ? 'ficha-completa' : ''}" id="ficha">
    <span class="canto c1"></span><span class="canto c2"></span><span class="canto c3"></span><span class="canto c4"></span>
    <div class="ficha-cabeca">
      <div class="ficha-ident">
        <div class="campo-grande"><span>Nome do Personagem:</span><b>${esc(p.conceito.nome) || '&nbsp;'}</b></div>
        <div class="campo-grande"><span>Nome do Jogador:</span><b>${esc(p.conceito.jogador) || '&nbsp;'}</b></div>
        <div class="ornamento">⟡</div>
        <div class="ident-grade">
          ${linha('Classe e nível', classeNivel)}
          ${linha('Antecedente', d.ant?.nome)}
          ${linha('Espécie', d.esp?.nome)}
          ${linha('Tendência', p.detalhes.tendencia)}
          ${linha('Tamanho', d.tamanho)}
          ${linha('XP', '0')}
        </div>
      </div>
      <div class="retrato" data-acao="foto" title="Clique para escolher um retrato">${foto}<span class="retrato-placa">Retrato do personagem</span></div>
    </div>

    <section class="painel painel-principal">
      <h3>Características principais</h3>
      <div class="marcas">
        ${circulo('pv', 'Pontos de Vida', d.pvMax, d.dadoVida ? `Dado de vida ${d.dadoVida}` : '')}
        ${circulo('ca', 'Classe de Armadura', d.ca?.ca)}
        ${circulo('ini', 'Iniciativa', sinal(d.iniciativa))}
        ${circulo('desl', 'Deslocamento', d.deslocamento ? metros(d.deslocamento) : null)}
        ${circulo('prof', 'Proficiência', sinal(d.pb))}
        ${circulo('olho', 'Percepção passiva', d.percepcaoPassiva, d.visao ? `Visão no escuro ${d.visao} m` : '')}
      </div>
    </section>

    <section class="painel painel-atributos"><h3>Atributos</h3><div class="atributos">${atributos}</div></section>

    <div class="ficha-meio">
      <section class="painel painel-pericias"><h3>⚔ Perícias</h3><ul class="pericias">${pericias}</ul></section>
      <div class="ficha-meio-dir">
        <section class="painel painel-ataques">
          <h3>⚔ Ataques</h3>
          <table class="tabela"><thead><tr><th>Nome</th><th>Bônus</th><th>Dano</th><th>Notas</th></tr></thead><tbody>${ataques}</tbody></table>
        </section>
        ${magia}
        <section class="painel">
          <h3>✧ Características e traços</h3>
          <ul class="lista-pequena">${caracteristicas || '<li>—</li>'}</ul>
        </section>
        <section class="painel">
          <h3>⚜ Proficiências e idiomas</h3>
          <p><b>Armas:</b> ${esc(d.proficiencias.armas) || '—'}</p>
          <p><b>Armaduras:</b> ${esc(d.proficiencias.armaduras)}</p>
          <p><b>Ferramentas:</b> ${esc(d.proficiencias.ferramentas.join(', ')) || '—'}</p>
          <p><b>Idiomas:</b> ${esc(d.proficiencias.idiomas.join(', '))}</p>
        </section>
      </div>
    </div>

    <div class="ficha-base">
      <section class="painel"><h3>História / Background</h3>${historia || '<p class="vazio">A história aparece aqui.</p>'}</section>
      <section class="painel">
        <h3>Equipamentos e itens</h3>
        <ul class="lista-pequena">${equipamento || '<li>—</li>'}</ul>
        <p class="moedas"><b>${$.po}</b> PO · <b>${$.pp}</b> PP · <b>${$.pc}</b> PC</p>
      </section>
    </div>
  </article>`;
}
