// Dados de regras do SRD 5.2 (D&D 2024), resumidos em português para a criação de ficha de nível 1.
// Fonte das regras: regras/SRD_CC_v5.2.pdf (CC-BY-4.0). Termos em português: Livro do Jogador 2024
// (tradução da comunidade, regras/dampd-5e---livro-do-jogador-2024.pdf). O nome em inglês fica em `en`.

export const ATRIBUTOS = [
  { id: 'for', nome: 'Força', curto: 'FOR' },
  { id: 'des', nome: 'Destreza', curto: 'DES' },
  { id: 'con', nome: 'Constituição', curto: 'CON' },
  { id: 'int', nome: 'Inteligência', curto: 'INT' },
  { id: 'sab', nome: 'Sabedoria', curto: 'SAB' },
  { id: 'car', nome: 'Carisma', curto: 'CAR' },
];

export const PERICIAS = [
  { id: 'acrobacia', nome: 'Acrobacia', atr: 'des', en: 'Acrobatics' },
  { id: 'arcanismo', nome: 'Arcanismo', atr: 'int', en: 'Arcana' },
  { id: 'atletismo', nome: 'Atletismo', atr: 'for', en: 'Athletics' },
  { id: 'atuacao', nome: 'Atuação', atr: 'car', en: 'Performance' },
  { id: 'enganacao', nome: 'Enganação', atr: 'car', en: 'Deception' },
  { id: 'furtividade', nome: 'Furtividade', atr: 'des', en: 'Stealth' },
  { id: 'historia', nome: 'História', atr: 'int', en: 'History' },
  { id: 'intimidacao', nome: 'Intimidação', atr: 'car', en: 'Intimidation' },
  { id: 'intuicao', nome: 'Intuição', atr: 'sab', en: 'Insight' },
  { id: 'investigacao', nome: 'Investigação', atr: 'int', en: 'Investigation' },
  { id: 'adestrar', nome: 'Lidar com Animais', atr: 'sab', en: 'Animal Handling' },
  { id: 'medicina', nome: 'Medicina', atr: 'sab', en: 'Medicine' },
  { id: 'natureza', nome: 'Natureza', atr: 'int', en: 'Nature' },
  { id: 'percepcao', nome: 'Percepção', atr: 'sab', en: 'Perception' },
  { id: 'persuasao', nome: 'Persuasão', atr: 'car', en: 'Persuasion' },
  { id: 'prestidigitacao', nome: 'Prestidigitação', atr: 'des', en: 'Sleight of Hand' },
  { id: 'religiao', nome: 'Religião', atr: 'int', en: 'Religion' },
  { id: 'sobrevivencia', nome: 'Sobrevivência', atr: 'sab', en: 'Survival' },
];

export const ARRAY_PADRAO = [15, 14, 13, 12, 10, 8];
export const CUSTO_PONTOS = { 8: 0, 9: 1, 10: 2, 11: 3, 12: 4, 13: 5, 14: 7, 15: 9 };
export const PONTOS_TOTAL = 27;

export const IDIOMAS_PADRAO = [
  { id: 'sinais', nome: 'Língua de Sinais Comum', d12: '1' },
  { id: 'draconico', nome: 'Dracônico', d12: '2' },
  { id: 'anao', nome: 'Anão', d12: '3–4' },
  { id: 'elfico', nome: 'Élfico', d12: '5–6' },
  { id: 'gigante', nome: 'Gigante', d12: '7' },
  { id: 'gnomico', nome: 'Gnômico', d12: '8' },
  { id: 'goblin', nome: 'Goblin', d12: '9' },
  { id: 'halfling', nome: 'Pequenino', d12: '10–11' },
  { id: 'orc', nome: 'Orc', d12: '12' },
];
// Resultado do d12 → idioma (tabela Standard Languages).
export const IDIOMA_POR_D12 = ['sinais', 'draconico', 'anao', 'anao', 'elfico', 'elfico', 'gigante', 'gnomico', 'goblin', 'halfling', 'halfling', 'orc'];
export const IDIOMAS_RAROS = ['Abissal', 'Celestial', 'Dialeto Obscuro', 'Druídico', 'Gíria dos Ladrões', 'Infernal', 'Primordial', 'Silvestre', 'Subcomum'];

// Alinhamento (o estado guarda em detalhes.tendencia, nome da 0.1.0).
export const TENDENCIAS = [
  'Ordeiro e Bom', 'Neutro e Bom', 'Caótico e Bom',
  'Ordeiro e Neutro', 'Neutro', 'Caótico e Neutro',
  'Ordeiro e Mau', 'Neutro e Mau', 'Caótico e Mau',
];

// ---------------------------------------------------------------- Equipamento

// Maestria (Weapon Mastery, 2024).
export const MAESTRIAS = {
  trespassar: { nome: 'Trespassar', en: 'Cleave', desc: 'Ao acertar, pode fazer um ataque extra contra outra criatura a até 1,5 m do alvo (1×/turno), sem somar o modificador ao dano.' },
  raspao: { nome: 'Garantido', en: 'Graze', desc: 'Ao errar, o alvo ainda sofre dano igual ao seu modificador de atributo do ataque.' },
  agil: { nome: 'Ágil', en: 'Nick', desc: 'O ataque extra da propriedade Leve faz parte da ação de Ataque, não gasta a Ação Bônus.' },
  empurrao: { nome: 'Empurrar', en: 'Push', desc: 'Ao acertar, empurra a criatura (Grande ou menor) até 3 m para longe.' },
  drenar: { nome: 'Drenar', en: 'Sap', desc: 'Ao acertar, o alvo tem Desvantagem no próximo ataque antes do seu próximo turno.' },
  lentidao: { nome: 'Lentidão', en: 'Slow', desc: 'Ao acertar e causar dano, reduz o Deslocamento do alvo em 3 m até o seu próximo turno.' },
  derrubar: { nome: 'Derrubar', en: 'Topple', desc: 'Ao acertar, o alvo faz salvaguarda de Constituição (CD 8 + mod + Bônus de Proficiência) ou fica Caído.' },
  atormentar: { nome: 'Afligir', en: 'Vex', desc: 'Ao acertar e causar dano, você tem Vantagem no próximo ataque contra essa criatura.' },
};

// cat: simples/marcial · tipo: cc (corpo a corpo) / dist (distância) · custo em PC (1 PO = 100 PC).
// props: acuidade, leve, pesada, duas-maos, alcance (= Extensão), arremesso, municao, recarga, versatil.
export const ARMAS = {
  clava: { nome: 'Clava', en: 'Club', cat: 'simples', tipo: 'cc', dano: '1d4', tipoDano: 'contundente', props: ['leve'], maestria: 'lentidao', custo: 10 },
  adaga: { nome: 'Adaga', en: 'Dagger', cat: 'simples', tipo: 'cc', dano: '1d4', tipoDano: 'perfurante', props: ['acuidade', 'leve', 'arremesso'], alcance: '6/18 m', maestria: 'agil', custo: 200 },
  'clava-grande': { nome: 'Clava Grande', en: 'Greatclub', cat: 'simples', tipo: 'cc', dano: '1d8', tipoDano: 'contundente', props: ['duas-maos'], maestria: 'empurrao', custo: 20 },
  machadinha: { nome: 'Machadinha', en: 'Handaxe', cat: 'simples', tipo: 'cc', dano: '1d6', tipoDano: 'cortante', props: ['leve', 'arremesso'], alcance: '6/18 m', maestria: 'atormentar', custo: 500 },
  azagaia: { nome: 'Azagaia', en: 'Javelin', cat: 'simples', tipo: 'cc', dano: '1d6', tipoDano: 'perfurante', props: ['arremesso'], alcance: '9/36 m', maestria: 'lentidao', custo: 50 },
  'martelo-leve': { nome: 'Martelo Leve', en: 'Light Hammer', cat: 'simples', tipo: 'cc', dano: '1d4', tipoDano: 'contundente', props: ['leve', 'arremesso'], alcance: '6/18 m', maestria: 'agil', custo: 200 },
  maca: { nome: 'Maça', en: 'Mace', cat: 'simples', tipo: 'cc', dano: '1d6', tipoDano: 'contundente', props: [], maestria: 'drenar', custo: 500 },
  bordao: { nome: 'Cajado', en: 'Quarterstaff', cat: 'simples', tipo: 'cc', dano: '1d6', tipoDano: 'contundente', props: ['versatil'], versatil: '1d8', maestria: 'derrubar', custo: 20 },
  'foice-curta': { nome: 'Foice', en: 'Sickle', cat: 'simples', tipo: 'cc', dano: '1d4', tipoDano: 'cortante', props: ['leve'], maestria: 'agil', custo: 100 },
  lanca: { nome: 'Lança', en: 'Spear', cat: 'simples', tipo: 'cc', dano: '1d6', tipoDano: 'perfurante', props: ['arremesso', 'versatil'], alcance: '6/18 m', versatil: '1d8', maestria: 'drenar', custo: 100 },
  dardo: { nome: 'Dardo', en: 'Dart', cat: 'simples', tipo: 'dist', dano: '1d4', tipoDano: 'perfurante', props: ['acuidade', 'arremesso'], alcance: '6/18 m', maestria: 'atormentar', custo: 5 },
  'besta-leve': { nome: 'Besta Leve', en: 'Light Crossbow', cat: 'simples', tipo: 'dist', dano: '1d8', tipoDano: 'perfurante', props: ['municao', 'recarga', 'duas-maos'], alcance: '24/96 m', maestria: 'lentidao', custo: 2500 },
  'arco-curto': { nome: 'Arco Curto', en: 'Shortbow', cat: 'simples', tipo: 'dist', dano: '1d6', tipoDano: 'perfurante', props: ['municao', 'duas-maos'], alcance: '24/96 m', maestria: 'atormentar', custo: 2500 },
  funda: { nome: 'Funda', en: 'Sling', cat: 'simples', tipo: 'dist', dano: '1d4', tipoDano: 'contundente', props: ['municao'], alcance: '9/36 m', maestria: 'lentidao', custo: 10 },
  'machado-batalha': { nome: 'Machado de Batalha', en: 'Battleaxe', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'cortante', props: ['versatil'], versatil: '1d10', maestria: 'derrubar', custo: 1000 },
  mangual: { nome: 'Mangual', en: 'Flail', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'contundente', props: [], maestria: 'drenar', custo: 1000 },
  glaive: { nome: 'Glaive', en: 'Glaive', cat: 'marcial', tipo: 'cc', dano: '1d10', tipoDano: 'cortante', props: ['pesada', 'alcance', 'duas-maos'], maestria: 'raspao', custo: 2000 },
  'machado-grande': { nome: 'Machado Grande', en: 'Greataxe', cat: 'marcial', tipo: 'cc', dano: '1d12', tipoDano: 'cortante', props: ['pesada', 'duas-maos'], maestria: 'trespassar', custo: 3000 },
  'espada-grande': { nome: 'Espada Grande', en: 'Greatsword', cat: 'marcial', tipo: 'cc', dano: '2d6', tipoDano: 'cortante', props: ['pesada', 'duas-maos'], maestria: 'raspao', custo: 5000 },
  alabarda: { nome: 'Alabarda', en: 'Halberd', cat: 'marcial', tipo: 'cc', dano: '1d10', tipoDano: 'cortante', props: ['pesada', 'alcance', 'duas-maos'], maestria: 'trespassar', custo: 2000 },
  'lanca-montaria': { nome: 'Lança de Montaria', en: 'Lance', cat: 'marcial', tipo: 'cc', dano: '1d10', tipoDano: 'perfurante', props: ['pesada', 'alcance', 'duas-maos'], maestria: 'derrubar', custo: 1000 },
  'espada-longa': { nome: 'Espada Longa', en: 'Longsword', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'cortante', props: ['versatil'], versatil: '1d10', maestria: 'drenar', custo: 1500 },
  malho: { nome: 'Malho', en: 'Maul', cat: 'marcial', tipo: 'cc', dano: '2d6', tipoDano: 'contundente', props: ['pesada', 'duas-maos'], maestria: 'derrubar', custo: 1000 },
  'maca-estrela': { nome: 'Maça Estrela', en: 'Morningstar', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'perfurante', props: [], maestria: 'drenar', custo: 1500 },
  pique: { nome: 'Lança Longa', en: 'Pike', cat: 'marcial', tipo: 'cc', dano: '1d10', tipoDano: 'perfurante', props: ['pesada', 'alcance', 'duas-maos'], maestria: 'empurrao', custo: 500 },
  rapieira: { nome: 'Rapieira', en: 'Rapier', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'perfurante', props: ['acuidade'], maestria: 'atormentar', custo: 2500 },
  cimitarra: { nome: 'Cimitarra', en: 'Scimitar', cat: 'marcial', tipo: 'cc', dano: '1d6', tipoDano: 'cortante', props: ['acuidade', 'leve'], maestria: 'agil', custo: 2500 },
  'espada-curta': { nome: 'Espada Curta', en: 'Shortsword', cat: 'marcial', tipo: 'cc', dano: '1d6', tipoDano: 'perfurante', props: ['acuidade', 'leve'], maestria: 'atormentar', custo: 1000 },
  tridente: { nome: 'Tridente', en: 'Trident', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'perfurante', props: ['arremesso', 'versatil'], alcance: '6/18 m', versatil: '1d10', maestria: 'derrubar', custo: 500 },
  'martelo-guerra': { nome: 'Martelo de Guerra', en: 'Warhammer', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'contundente', props: ['versatil'], versatil: '1d10', maestria: 'empurrao', custo: 1500 },
  'picareta-guerra': { nome: 'Picareta de Guerra', en: 'War Pick', cat: 'marcial', tipo: 'cc', dano: '1d8', tipoDano: 'perfurante', props: ['versatil'], versatil: '1d10', maestria: 'drenar', custo: 500 },
  chicote: { nome: 'Chicote', en: 'Whip', cat: 'marcial', tipo: 'cc', dano: '1d4', tipoDano: 'cortante', props: ['acuidade', 'alcance'], maestria: 'lentidao', custo: 200 },
  zarabatana: { nome: 'Zarabatana', en: 'Blowgun', cat: 'marcial', tipo: 'dist', dano: '1', tipoDano: 'perfurante', props: ['municao', 'recarga'], alcance: '7,5/30 m', maestria: 'atormentar', custo: 1000 },
  'besta-mao': { nome: 'Besta de Mão', en: 'Hand Crossbow', cat: 'marcial', tipo: 'dist', dano: '1d6', tipoDano: 'perfurante', props: ['municao', 'leve', 'recarga'], alcance: '9/36 m', maestria: 'atormentar', custo: 7500 },
  'besta-pesada': { nome: 'Besta Pesada', en: 'Heavy Crossbow', cat: 'marcial', tipo: 'dist', dano: '1d10', tipoDano: 'perfurante', props: ['municao', 'pesada', 'recarga', 'duas-maos'], alcance: '30/120 m', maestria: 'empurrao', custo: 5000 },
  'arco-longo': { nome: 'Arco Longo', en: 'Longbow', cat: 'marcial', tipo: 'dist', dano: '1d8', tipoDano: 'perfurante', props: ['municao', 'pesada', 'duas-maos'], alcance: '45/180 m', maestria: 'lentidao', custo: 5000 },
  mosquete: { nome: 'Mosquete', en: 'Musket', cat: 'marcial', tipo: 'dist', dano: '1d12', tipoDano: 'perfurante', props: ['municao', 'recarga', 'duas-maos'], alcance: '12/36 m', maestria: 'lentidao', custo: 50000 },
  pistola: { nome: 'Pistola', en: 'Pistol', cat: 'marcial', tipo: 'dist', dano: '1d10', tipoDano: 'perfurante', props: ['municao', 'recarga'], alcance: '9/27 m', maestria: 'atormentar', custo: 25000 },
};

export const PROPRIEDADES = {
  acuidade: 'Acuidade', leve: 'Leve', pesada: 'Pesada', 'duas-maos': 'Duas Mãos', alcance: 'Extensão',
  arremesso: 'Arremesso', municao: 'Munição', recarga: 'Recarga', versatil: 'Versátil',
};

// base: CA base · maxDes: limite do bônus de Destreza (null = sem limite, 0 = não soma) · forMin: Força mínima.
export const ARMADURAS = {
  acolchoada: { nome: 'Armadura Acolchoada', en: 'Padded Armor', cat: 'leve', base: 11, maxDes: null, furtDesv: true, custo: 500 },
  couro: { nome: 'Armadura de Couro', en: 'Leather Armor', cat: 'leve', base: 11, maxDes: null, custo: 1000 },
  'couro-batido': { nome: 'Armadura de Couro Batido', en: 'Studded Leather Armor', cat: 'leve', base: 12, maxDes: null, custo: 4500 },
  peles: { nome: 'Gibão de Peles', en: 'Hide Armor', cat: 'media', base: 12, maxDes: 2, custo: 1000 },
  'camisao-malha': { nome: 'Cota de Malha Parcial', en: 'Chain Shirt', cat: 'media', base: 13, maxDes: 2, custo: 5000 },
  brunea: { nome: 'Loriga de Escamas', en: 'Scale Mail', cat: 'media', base: 14, maxDes: 2, furtDesv: true, custo: 5000 },
  peitoral: { nome: 'Couraça Peitoral', en: 'Breastplate', cat: 'media', base: 14, maxDes: 2, custo: 40000 },
  'meia-armadura': { nome: 'Armadura de Placas Parcial', en: 'Half Plate Armor', cat: 'media', base: 15, maxDes: 2, furtDesv: true, custo: 75000 },
  'cota-aneis': { nome: 'Cota de Anéis', en: 'Ring Mail', cat: 'pesada', base: 14, maxDes: 0, furtDesv: true, custo: 3000 },
  'cota-malha': { nome: 'Cota de Malha', en: 'Chain Mail', cat: 'pesada', base: 16, maxDes: 0, forMin: 13, furtDesv: true, custo: 7500 },
  'cota-talas': { nome: 'Armadura de Talas', en: 'Splint Armor', cat: 'pesada', base: 17, maxDes: 0, forMin: 15, furtDesv: true, custo: 20000 },
  placas: { nome: 'Armadura de Placas', en: 'Plate Armor', cat: 'pesada', base: 18, maxDes: 0, forMin: 15, furtDesv: true, custo: 150000 },
};
export const ESCUDO = { nome: 'Escudo', en: 'Shield', bonus: 2, custo: 1000 };

export const PACOTES = {
  assaltante: { nome: 'Kit de Assaltante', en: "Burglar's Pack", custo: 1600 },
  diplomata: { nome: 'Kit de Diplomata', en: "Diplomat's Pack", custo: 3900 },
  masmorras: { nome: 'Kit de Explorador de Masmorras', en: "Dungeoneer's Pack", custo: 1200 },
  artista: { nome: 'Kit de Artista', en: "Entertainer's Pack", custo: 4000 },
  explorador: { nome: 'Kit de Aventureiro', en: "Explorer's Pack", custo: 1000 },
  sacerdote: { nome: 'Kit de Sacerdote', en: "Priest's Pack", custo: 3300 },
  estudioso: { nome: 'Kit de Erudito', en: "Scholar's Pack", custo: 4000 },
};

// ---------------------------------------------------------------- Magias

// Truques (círculo 0) e magias de 1º círculo das listas de classe do SRD. conc = concentração.
export const MAGIAS = {
  'acid-splash': { nome: 'Bolha Ácida', en: 'Acid Splash', nivel: 0, desc: 'Esfera de ácido em até 2 criaturas próximas; salvaguarda de DES ou 1d6 de dano Ácido.' },
  'chill-touch': { nome: 'Toque Necrótico', en: 'Chill Touch', nivel: 0, desc: 'Ataque corpo a corpo mágico: 1d10 de dano Necrótico e o alvo não recupera PV até seu próximo turno.' },
  'dancing-lights': { nome: 'Luzes Dançantes', en: 'Dancing Lights', nivel: 0, conc: true, desc: 'Até quatro luzes flutuantes que você move pelo ar.' },
  druidcraft: { nome: 'Arte Druídica', en: 'Druidcraft', nivel: 0, desc: 'Pequenos efeitos da natureza: prever o tempo, fazer brotar uma flor, acender ou apagar.' },
  'eldritch-blast': { nome: 'Raio Místico', en: 'Eldritch Blast', nivel: 0, desc: 'Raio de energia à distância: 1d10 de dano Energético. O truque marcante do Bruxo.' },
  elementalism: { nome: 'Elementalismo', en: 'Elementalism', nivel: 0, desc: 'Controle menor de ar, terra, fogo ou água (brisa, poeira, faísca, névoa).' },
  'fire-bolt': { nome: 'Raio de Fogo', en: 'Fire Bolt', nivel: 0, desc: 'Ataque mágico à distância (36 m): 1d10 de dano Ígneo.' },
  guidance: { nome: 'Orientação', en: 'Guidance', nivel: 0, conc: true, desc: 'Um aliado soma 1d4 a um teste de perícia à escolha.' },
  light: { nome: 'Luz', en: 'Light', nivel: 0, desc: 'Um objeto emite luz como uma tocha por 1 hora.' },
  'mage-hand': { nome: 'Mãos Mágicas', en: 'Mage Hand', nivel: 0, desc: 'Uma mão espectral manipula objetos leves à distância.' },
  mending: { nome: 'Reparar', en: 'Mending', nivel: 0, desc: 'Conserta um rasgo ou quebra pequena num objeto.' },
  message: { nome: 'Mensagem', en: 'Message', nivel: 0, desc: 'Sussurra uma mensagem a uma criatura distante, que pode responder.' },
  'minor-illusion': { nome: 'Ilusão Menor', en: 'Minor Illusion', nivel: 0, desc: 'Cria um som ou uma imagem de um objeto parado.' },
  'poison-spray': { nome: 'Rajada de Veneno', en: 'Poison Spray', nivel: 0, desc: 'Ataque mágico à distância (9 m): 1d12 de dano Venenoso.' },
  prestidigitation: { nome: 'Prestidigitação Arcana', en: 'Prestidigitation', nivel: 0, desc: 'Pequenos truques mágicos: limpar, aquecer, marcar, efeitos sensoriais.' },
  'produce-flame': { nome: 'Criar Chamas', en: 'Produce Flame', nivel: 0, desc: 'Uma chama na mão ilumina e pode ser arremessada: 1d8 de dano Ígneo.' },
  'ray-of-frost': { nome: 'Raio de Gelo', en: 'Ray of Frost', nivel: 0, desc: 'Ataque mágico à distância: 1d8 de dano Gélido e −3 m no Deslocamento do alvo.' },
  resistance: { nome: 'Resistência', en: 'Resistance', nivel: 0, conc: true, desc: 'Um aliado reduz em 1d4 o dano de um tipo escolhido.' },
  'sacred-flame': { nome: 'Chama Sagrada', en: 'Sacred Flame', nivel: 0, desc: 'Chama radiante desce sobre o alvo; salvaguarda de DES ou 1d8 de dano Radiante.' },
  shillelagh: { nome: 'Bordão Místico', en: 'Shillelagh', nivel: 0, desc: 'Seu cajado ou clava usa o atributo de magia e causa dano maior.' },
  'shocking-grasp': { nome: 'Toque Chocante', en: 'Shocking Grasp', nivel: 0, desc: 'Ataque corpo a corpo mágico: 1d8 de dano Elétrico e o alvo não faz Ataques de Oportunidade.' },
  'sorcerous-burst': { nome: 'Explosão Elemental', en: 'Sorcerous Burst', nivel: 0, desc: 'Ataque mágico à distância: 1d8 do tipo escolhido; dados 8 explodem em mais dano.' },
  'spare-the-dying': { nome: 'Acudir os Moribundos', en: 'Spare the Dying', nivel: 0, desc: 'Estabiliza uma criatura com 0 PV.' },
  'starry-wisp': { nome: 'Fagulha Estelar', en: 'Starry Wisp', nivel: 0, desc: 'Ataque mágico à distância: 1d8 de dano Radiante e o alvo não fica invisível.' },
  thaumaturgy: { nome: 'Taumaturgia', en: 'Thaumaturgy', nivel: 0, desc: 'Sinais de poder: voz trovejante, chamas que tremulam, tremores leves.' },
  'true-strike': { nome: 'Golpe Certeiro', en: 'True Strike', nivel: 0, desc: 'Ataque com arma usando seu atributo de magia; dano Radiante extra em níveis maiores.' },
  'vicious-mockery': { nome: 'Zombaria Perversa', en: 'Vicious Mockery', nivel: 0, desc: 'Insulto mágico; salvaguarda de SAB ou 1d6 de dano Psíquico e Desvantagem no próximo ataque.' },

  alarm: { nome: 'Alarme', en: 'Alarm', nivel: 1, ritual: true, desc: 'Protege uma área: avisa quando alguém entra.' },
  'animal-friendship': { nome: 'Amizade Animal', en: 'Animal Friendship', nivel: 1, desc: 'Encanta uma Fera, que não fica hostil a você.' },
  bane: { nome: 'Perdição', en: 'Bane', nivel: 1, conc: true, desc: 'Até três criaturas subtraem 1d4 de ataques e salvaguardas.' },
  bless: { nome: 'Bênção', en: 'Bless', nivel: 1, conc: true, desc: 'Até três aliados somam 1d4 a ataques e salvaguardas.' },
  'burning-hands': { nome: 'Mãos Flamejantes', en: 'Burning Hands', nivel: 1, desc: 'Cone de fogo de 4,5 m: 3d6 de dano Ígneo (metade se passar na salvaguarda).' },
  'charm-person': { nome: 'Enfeitiçar Pessoa', en: 'Charm Person', nivel: 1, desc: 'Um humanoide fica Enfeitiçado e amistoso com você.' },
  'chromatic-orb': { nome: 'Orbe Cromático', en: 'Chromatic Orb', nivel: 1, desc: 'Esfera de energia do tipo escolhido: 3d8 de dano, pode saltar para outro alvo.' },
  'color-spray': { nome: 'Leque Cromático', en: 'Color Spray', nivel: 1, desc: 'Cone de luzes que deixa criaturas com a condição Cego até o fim do seu próximo turno.' },
  command: { nome: 'Comando', en: 'Command', nivel: 1, desc: 'Uma palavra de ordem (fuja, caia, pare...) que o alvo obedece se falhar.' },
  'comprehend-languages': { nome: 'Compreender Idiomas', en: 'Comprehend Languages', nivel: 1, ritual: true, desc: 'Entende qualquer idioma falado ou escrito por 1 hora.' },
  'create-or-destroy-water': { nome: 'Criar ou Destruir Água', en: 'Create or Destroy Water', nivel: 1, desc: 'Cria ou destrói água (ou névoa) numa área.' },
  'cure-wounds': { nome: 'Curar Ferimentos', en: 'Cure Wounds', nivel: 1, desc: 'Toque que cura 2d8 + seu modificador de magia.' },
  'detect-evil-and-good': { nome: 'Detectar o Bem e o Mal', en: 'Detect Evil and Good', nivel: 1, conc: true, desc: 'Sente aberrações, celestiais, corruptores, fadas e mortos-vivos próximos.' },
  'detect-magic': { nome: 'Detectar Magia', en: 'Detect Magic', nivel: 1, conc: true, ritual: true, desc: 'Sente magia a até 9 m e vê a aura de objetos mágicos.' },
  'detect-poison-and-disease': { nome: 'Detectar Veneno e Doença', en: 'Detect Poison and Disease', nivel: 1, conc: true, ritual: true, desc: 'Sente venenos, criaturas venenosas e doenças próximas.' },
  'disguise-self': { nome: 'Disfarçar-se', en: 'Disguise Self', nivel: 1, desc: 'Muda a sua aparência por 1 hora.' },
  'dissonant-whispers': { nome: 'Sussurros Dissonantes', en: 'Dissonant Whispers', nivel: 1, desc: 'Melodia que só o alvo ouve: 3d6 de dano Psíquico e ele foge de você.' },
  'divine-favor': { nome: 'Favor Divino', en: 'Divine Favor', nivel: 1, desc: 'Seus ataques com arma causam 1d4 de dano Radiante extra por 1 minuto.' },
  'divine-smite': { nome: 'Destruição Divina', en: 'Divine Smite', nivel: 1, desc: 'Ao acertar com arma: 2d8 de dano Radiante extra (mais contra corruptores e mortos-vivos).' },
  'ensnaring-strike': { nome: 'Golpe Constritor', en: 'Ensnaring Strike', nivel: 1, conc: true, desc: 'Ao acertar, vinhas prendem o alvo (Contido) e causam dano.' },
  entangle: { nome: 'Emaranhar', en: 'Entangle', nivel: 1, conc: true, desc: 'Plantas agarram criaturas numa área de 6 m (Contidas).' },
  'expeditious-retreat': { nome: 'Retirada Acelerada', en: 'Expeditious Retreat', nivel: 1, conc: true, desc: 'Pode executar a ação Correr como Ação Bônus a cada turno.' },
  'faerie-fire': { nome: 'Fogo das Fadas', en: 'Faerie Fire', nivel: 1, conc: true, desc: 'Contorna criaturas com luz: ataques contra elas têm Vantagem.' },
  'false-life': { nome: 'Vitalidade Vazia', en: 'False Life', nivel: 1, desc: 'Ganha 2d4 + 4 PV temporários.' },
  'feather-fall': { nome: 'Queda Suave', en: 'Feather Fall', nivel: 1, desc: 'Reação: até cinco criaturas caem devagar, sem dano.' },
  'find-familiar': { nome: 'Convocar Familiar', en: 'Find Familiar', nivel: 1, ritual: true, desc: 'Um espírito em forma de animal pequeno serve você.' },
  'floating-disk': { nome: 'Disco Flutuante', en: 'Floating Disk', nivel: 1, ritual: true, desc: 'Disco de força que carrega até 250 kg atrás de você.' },
  'fog-cloud': { nome: 'Névoa Obscurecente', en: 'Fog Cloud', nivel: 1, conc: true, desc: 'Esfera de névoa densa de 6 m de raio.' },
  goodberry: { nome: 'Bom Fruto', en: 'Goodberry', nivel: 1, desc: 'Dez frutinhas mágicas: cada uma cura 1 PV e alimenta por um dia.' },
  grease: { nome: 'Graxa', en: 'Grease', nivel: 1, desc: 'Graxa num quadrado de 3 m: quem passa pode cair.' },
  'guiding-bolt': { nome: 'Raio Guia', en: 'Guiding Bolt', nivel: 1, desc: 'Ataque mágico: 4d6 de dano Radiante e o próximo ataque contra o alvo tem Vantagem.' },
  'healing-word': { nome: 'Palavra Curativa', en: 'Healing Word', nivel: 1, desc: 'Ação Bônus, à distância: cura 2d4 + seu modificador de magia.' },
  'hellish-rebuke': { nome: 'Repreensão Diabólica', en: 'Hellish Rebuke', nivel: 1, desc: 'Reação ao sofrer dano: chamas causam 2d10 de dano Ígneo no agressor.' },
  heroism: { nome: 'Heroísmo', en: 'Heroism', nivel: 1, conc: true, desc: 'Aliado imune a Amedrontado e com PV temporários a cada turno.' },
  hex: { nome: 'Danação', en: 'Hex', nivel: 1, conc: true, desc: 'Amaldiçoa um alvo: 1d6 de dano Necrótico extra a cada acerto seu.' },
  'hideous-laughter': { nome: 'Gargalhada Nefasta', en: 'Hideous Laughter', nivel: 1, conc: true, desc: 'O alvo cai de tanto rir (Caído e Incapacitado).' },
  'hunters-mark': { nome: 'Marca do Predador', en: "Hunter's Mark", nivel: 1, conc: true, desc: 'Marca um alvo: 1d6 de dano Energético extra a cada acerto e facilita rastreá-lo.' },
  'ice-knife': { nome: 'Faca de Gelo', en: 'Ice Knife', nivel: 1, desc: 'Lasca de gelo: 1d10 de dano Perfurante e explode em 2d6 de dano Gélido ao redor.' },
  identify: { nome: 'Identificar', en: 'Identify', nivel: 1, ritual: true, desc: 'Descobre as propriedades de um objeto mágico.' },
  'illusory-script': { nome: 'Escrita Ilusória', en: 'Illusory Script', nivel: 1, ritual: true, desc: 'Texto que só quem você escolher consegue ler.' },
  'inflict-wounds': { nome: 'Infligir Ferimentos', en: 'Inflict Wounds', nivel: 1, desc: 'Toque sombrio: 2d10 de dano Necrótico (metade se passar na salvaguarda de CON).' },
  jump: { nome: 'Salto', en: 'Jump', nivel: 1, desc: 'Uma criatura salta muito mais longe por 1 minuto.' },
  longstrider: { nome: 'Passos Largos', en: 'Longstrider', nivel: 1, desc: '+3 m de Deslocamento por 1 hora.' },
  'mage-armor': { nome: 'Armadura Arcana', en: 'Mage Armor', nivel: 1, desc: 'Sem armadura, sua CA vira 13 + DES por 8 horas.' },
  'magic-missile': { nome: 'Mísseis Mágicos', en: 'Magic Missile', nivel: 1, desc: 'Três dardos que nunca erram: 1d4 + 1 de dano Energético cada.' },
  'protection-from-evil-and-good': { nome: 'Proteção Contra o Bem e o Mal', en: 'Protection from Evil and Good', nivel: 1, conc: true, desc: 'Protege um aliado contra aberrações, corruptores, mortos-vivos e afins.' },
  'purify-food-and-drink': { nome: 'Purificar Alimentos e Bebidas', en: 'Purify Food and Drink', nivel: 1, ritual: true, desc: 'Remove veneno e podridão de comida e bebida.' },
  'ray-of-sickness': { nome: 'Raio Nauseante', en: 'Ray of Sickness', nivel: 1, desc: 'Ataque mágico: 2d8 de dano Venenoso e pode deixar Envenenado.' },
  sanctuary: { nome: 'Santuário', en: 'Sanctuary', nivel: 1, desc: 'Quem quiser atacar o protegido precisa passar numa salvaguarda de SAB.' },
  'searing-smite': { nome: 'Destruição Cauterizante', en: 'Searing Smite', nivel: 1, desc: 'Ao acertar com arma: dano Ígneo extra que continua queimando o alvo.' },
  shield: { nome: 'Escudo Arcano', en: 'Shield', nivel: 1, desc: 'Reação: +5 na CA até o seu próximo turno.' },
  'shield-of-faith': { nome: 'Escudo da Fé', en: 'Shield of Faith', nivel: 1, conc: true, desc: '+2 na CA de uma criatura por 10 minutos.' },
  'silent-image': { nome: 'Imagem Silenciosa', en: 'Silent Image', nivel: 1, conc: true, desc: 'Ilusão visual de até 4,5 m que você move.' },
  sleep: { nome: 'Sono', en: 'Sleep', nivel: 1, conc: true, desc: 'Criaturas numa área ficam Incapacitadas e podem adormecer.' },
  'speak-with-animals': { nome: 'Falar com Animais', en: 'Speak with Animals', nivel: 1, ritual: true, desc: 'Conversa com feras por 10 minutos.' },
  thunderwave: { nome: 'Onda Trovejante', en: 'Thunderwave', nivel: 1, desc: 'Cubo de 4,5 m: 2d8 de dano Trovejante e empurra 3 m.' },
  'unseen-servant': { nome: 'Servo Invisível', en: 'Unseen Servant', nivel: 1, ritual: true, desc: 'Uma força invisível faz tarefas simples por 1 hora.' },
};

export const LISTAS_MAGIA = {
  bardo: ['dancing-lights', 'light', 'mage-hand', 'mending', 'message', 'minor-illusion', 'prestidigitation', 'starry-wisp', 'true-strike', 'vicious-mockery',
    'animal-friendship', 'bane', 'charm-person', 'color-spray', 'command', 'comprehend-languages', 'cure-wounds', 'detect-magic', 'disguise-self', 'dissonant-whispers', 'faerie-fire', 'feather-fall', 'healing-word', 'heroism', 'hideous-laughter', 'identify', 'illusory-script', 'longstrider', 'silent-image', 'sleep', 'speak-with-animals', 'thunderwave', 'unseen-servant'],
  clerigo: ['guidance', 'light', 'mending', 'resistance', 'sacred-flame', 'spare-the-dying', 'thaumaturgy',
    'bane', 'bless', 'command', 'create-or-destroy-water', 'cure-wounds', 'detect-evil-and-good', 'detect-magic', 'detect-poison-and-disease', 'guiding-bolt', 'healing-word', 'inflict-wounds', 'protection-from-evil-and-good', 'purify-food-and-drink', 'sanctuary', 'shield-of-faith'],
  druida: ['druidcraft', 'elementalism', 'guidance', 'mending', 'message', 'poison-spray', 'produce-flame', 'resistance', 'shillelagh', 'spare-the-dying', 'starry-wisp',
    'animal-friendship', 'charm-person', 'create-or-destroy-water', 'cure-wounds', 'detect-magic', 'detect-poison-and-disease', 'entangle', 'faerie-fire', 'fog-cloud', 'goodberry', 'healing-word', 'ice-knife', 'jump', 'longstrider', 'protection-from-evil-and-good', 'purify-food-and-drink', 'speak-with-animals', 'thunderwave'],
  paladino: ['bless', 'command', 'cure-wounds', 'detect-evil-and-good', 'detect-magic', 'detect-poison-and-disease', 'divine-favor', 'divine-smite', 'heroism', 'protection-from-evil-and-good', 'purify-food-and-drink', 'searing-smite', 'shield-of-faith'],
  patrulheiro: ['alarm', 'animal-friendship', 'cure-wounds', 'detect-magic', 'detect-poison-and-disease', 'ensnaring-strike', 'entangle', 'fog-cloud', 'goodberry', 'hunters-mark', 'jump', 'longstrider', 'speak-with-animals'],
  feiticeiro: ['acid-splash', 'chill-touch', 'dancing-lights', 'elementalism', 'fire-bolt', 'light', 'mage-hand', 'mending', 'message', 'minor-illusion', 'poison-spray', 'prestidigitation', 'ray-of-frost', 'shocking-grasp', 'sorcerous-burst', 'true-strike',
    'burning-hands', 'charm-person', 'chromatic-orb', 'color-spray', 'comprehend-languages', 'detect-magic', 'disguise-self', 'expeditious-retreat', 'false-life', 'feather-fall', 'fog-cloud', 'grease', 'ice-knife', 'jump', 'mage-armor', 'magic-missile', 'ray-of-sickness', 'shield', 'silent-image', 'sleep', 'thunderwave'],
  bruxo: ['chill-touch', 'eldritch-blast', 'mage-hand', 'minor-illusion', 'poison-spray', 'prestidigitation', 'true-strike',
    'bane', 'charm-person', 'comprehend-languages', 'detect-magic', 'expeditious-retreat', 'hellish-rebuke', 'hex', 'hideous-laughter', 'illusory-script', 'protection-from-evil-and-good', 'speak-with-animals', 'unseen-servant'],
  mago: ['acid-splash', 'chill-touch', 'dancing-lights', 'elementalism', 'fire-bolt', 'light', 'mage-hand', 'mending', 'message', 'minor-illusion', 'poison-spray', 'prestidigitation', 'ray-of-frost', 'shocking-grasp', 'true-strike',
    'alarm', 'burning-hands', 'charm-person', 'chromatic-orb', 'color-spray', 'comprehend-languages', 'detect-magic', 'disguise-self', 'expeditious-retreat', 'false-life', 'feather-fall', 'find-familiar', 'floating-disk', 'fog-cloud', 'grease', 'hideous-laughter', 'ice-knife', 'identify', 'illusory-script', 'jump', 'longstrider', 'mage-armor', 'magic-missile', 'protection-from-evil-and-good', 'ray-of-sickness', 'shield', 'silent-image', 'sleep', 'thunderwave', 'unseen-servant'],
};

// ---------------------------------------------------------------- Classes

const kit = (letra, o) => ({ letra, armas: [], itens: [], po: 0, ...o });

export const CLASSES = {
  barbaro: {
    nome: 'Bárbaro', en: 'Barbarian', gosta: 'Batalha', primario: ['for'], complexidade: 'Média', dado: 12,
    resumo: 'Guerreiro movido por fúria primal: aguenta muito dano e bate forte.',
    salvaguardas: ['for', 'con'],
    pericias: { n: 2, de: ['adestrar', 'atletismo', 'intimidacao', 'natureza', 'percepcao', 'sobrevivencia'] },
    armas: ['simples', 'marcial'], armaduras: ['leve', 'media', 'escudo'],
    arrayPadrao: { for: 15, des: 13, con: 14, int: 10, sab: 12, car: 8 },
    maestria: 2, defesaSemArmadura: 'con',
    kits: [
      kit('A', { armas: ['machado-grande', 'machadinha', 'machadinha', 'machadinha', 'machadinha'], itens: ['Kit de Aventureiro'], po: 15 }),
      kit('B', { po: 75 }),
    ],
    caracteristicas: [
      { nome: 'Fúria (2 usos)', desc: 'Ação Bônus, sem armadura pesada: Resistência a dano Contundente, Cortante e Perfurante, +2 de dano com ataques de Força e Vantagem em testes e salvaguardas de Força. Recupera 1 uso no Descanso Curto e todos no longo.' },
      { nome: 'Defesa sem Armadura', desc: 'Sem armadura, CA = 10 + DES + CON (pode usar escudo).' },
      { nome: 'Maestria em Arma (2)', desc: 'Usa a propriedade de maestria de 2 tipos de arma à escolha.' },
    ],
  },
  bardo: {
    nome: 'Bardo', en: 'Bard', gosta: 'Atuação', primario: ['car'], complexidade: 'Alta', dado: 8,
    resumo: 'Artista mágico que inspira aliados, cura e engana com palavras e música.',
    salvaguardas: ['des', 'car'],
    pericias: { n: 3, de: 'todas' },
    ferramentas: { n: 3, desc: '3 instrumentos musicais' },
    armas: ['simples'], armaduras: ['leve'],
    arrayPadrao: { for: 8, des: 14, con: 12, int: 13, sab: 10, car: 15 },
    magia: { atr: 'car', truques: 2, preparadas: 4, espacos: [2], lista: 'bardo' },
    kits: [
      kit('A', { armadura: 'couro', armas: ['adaga', 'adaga'], itens: ['Instrumento Musical (à escolha)', 'Kit de Artista'], po: 19 }),
      kit('B', { po: 90 }),
    ],
    caracteristicas: [
      { nome: 'Inspiração de Bardo (d6)', desc: 'Ação Bônus: um aliado a até 18 m ganha um d6 para somar a um teste de d20 na próxima hora. Usos = modificador de CAR (mínimo 1); recupera no Descanso Longo.' },
      { nome: 'Conjuração', desc: 'Magias de Bardo usando Carisma; o instrumento musical serve de foco.' },
    ],
  },
  clerigo: {
    nome: 'Clérigo', en: 'Cleric', gosta: 'Deuses', primario: ['sab'], complexidade: 'Média', dado: 8,
    resumo: 'Sacerdote com poder divino: cura, protege e castiga em nome da fé.',
    salvaguardas: ['sab', 'car'],
    pericias: { n: 2, de: ['historia', 'intuicao', 'medicina', 'persuasao', 'religiao'] },
    armas: ['simples'], armaduras: ['leve', 'media', 'escudo'],
    arrayPadrao: { for: 14, des: 8, con: 13, int: 10, sab: 15, car: 12 },
    magia: { atr: 'sab', truques: 3, preparadas: 4, espacos: [2], lista: 'clerigo' },
    opcao: {
      titulo: 'Ordem Divina', en: 'Divine Order',
      itens: {
        protetor: { nome: 'Protetor', desc: 'Treinado para a batalha: proficiência com armas marciais e treino com armadura pesada.', armas: ['marcial'], armaduras: ['pesada'] },
        taumaturgo: { nome: 'Taumaturgo', desc: 'Um truque de Clérigo a mais e bônus igual à SAB (mín. +1) em testes de INT (Arcanismo ou Religião).', truquesExtra: 1, bonusPericias: ['arcanismo', 'religiao'] },
      },
    },
    kits: [
      kit('A', { armadura: 'camisao-malha', escudo: true, armas: ['maca'], itens: ['Símbolo Sagrado', 'Kit de Sacerdote'], po: 7 }),
      kit('B', { po: 110 }),
    ],
    caracteristicas: [
      { nome: 'Conjuração', desc: 'Magias de Clérigo usando Sabedoria; o símbolo sagrado serve de foco.' },
    ],
  },
  druida: {
    nome: 'Druida', en: 'Druid', gosta: 'Natureza', primario: ['sab'], complexidade: 'Alta', dado: 8,
    resumo: 'Guardião da natureza que molda os elementos e, mais tarde, assume formas de animais.',
    salvaguardas: ['int', 'sab'],
    pericias: { n: 2, de: ['adestrar', 'arcanismo', 'intuicao', 'medicina', 'natureza', 'percepcao', 'religiao', 'sobrevivencia'] },
    ferramentasFixas: ['Kit de Herbalismo'],
    armas: ['simples'], armaduras: ['leve', 'escudo'],
    idiomasFixos: ['Druídico'],
    arrayPadrao: { for: 8, des: 12, con: 14, int: 13, sab: 15, car: 10 },
    magia: { atr: 'sab', truques: 2, preparadas: 4, espacos: [2], lista: 'druida' },
    opcao: {
      titulo: 'Ordem Primal', en: 'Primal Order',
      itens: {
        mago: { nome: 'Xamã', desc: 'Um truque de Druida a mais e bônus igual à SAB (mín. +1) em testes de INT (Arcanismo ou Natureza).', truquesExtra: 1, bonusPericias: ['arcanismo', 'natureza'] },
        guardiao: { nome: 'Protetor', desc: 'Treinado para a batalha: proficiência com armas marciais e treino com armadura média.', armas: ['marcial'], armaduras: ['media'] },
      },
    },
    kits: [
      kit('A', { armadura: 'couro', escudo: true, armas: ['foice-curta', 'bordao'], itens: ['Foco Druídico (o próprio Cajado)', 'Kit de Aventureiro', 'Kit de Herbalismo'], po: 9 }),
      kit('B', { po: 50 }),
    ],
    caracteristicas: [
      { nome: 'Idioma Druídico', desc: 'Você conhece o Druídico, a língua secreta dos druidas, e sempre tem Falar com Animais preparada.' },
      { nome: 'Conjuração', desc: 'Magias de Druida usando Sabedoria; um foco druídico serve de foco.' },
    ],
  },
  guerreiro: {
    nome: 'Guerreiro', en: 'Fighter', gosta: 'Armas', primario: ['for', 'des'], complexidade: 'Baixa', dado: 10,
    resumo: 'Mestre das armas e armaduras. Simples de jogar e sempre útil.',
    salvaguardas: ['for', 'con'],
    pericias: { n: 2, de: ['acrobacia', 'adestrar', 'atletismo', 'historia', 'intuicao', 'intimidacao', 'persuasao', 'percepcao', 'sobrevivencia'] },
    armas: ['simples', 'marcial'], armaduras: ['leve', 'media', 'pesada', 'escudo'],
    arrayPadrao: { for: 15, des: 14, con: 13, int: 8, sab: 10, car: 12 },
    maestria: 3,
    estiloLuta: true,
    kits: [
      kit('A', { armadura: 'cota-malha', armas: ['espada-grande', 'mangual', ...Array(8).fill('azagaia')], itens: ['Kit de Explorador de Masmorras'], po: 4 }),
      kit('B', { armadura: 'couro-batido', armas: ['cimitarra', 'espada-curta', 'arco-longo'], itens: ['20 Flechas', 'Aljava', 'Kit de Explorador de Masmorras'], po: 11 }),
      kit('C', { po: 155 }),
    ],
    caracteristicas: [
      { nome: 'Estilo de Luta', desc: 'Um talento de Estilo de Luta à escolha.' },
      { nome: 'Recuperar Fôlego (2 usos)', desc: 'Ação Bônus: recupera 1d10 + nível de Guerreiro em PV. Recupera 1 uso no Descanso Curto e todos no longo.' },
      { nome: 'Maestria em Arma (3)', desc: 'Usa a propriedade de maestria de 3 tipos de arma à escolha.' },
    ],
  },
  monge: {
    nome: 'Monge', en: 'Monk', gosta: 'Combate desarmado', primario: ['des', 'sab'], complexidade: 'Alta', dado: 8,
    resumo: 'Artista marcial veloz que luta com as mãos nuas e a disciplina do corpo.',
    salvaguardas: ['for', 'des'],
    pericias: { n: 2, de: ['acrobacia', 'atletismo', 'historia', 'intuicao', 'religiao', 'furtividade'] },
    ferramentas: { n: 1, desc: '1 ferramenta de artesão ou instrumento musical' },
    armas: ['simples', 'marcial-leve'], armaduras: [],
    arrayPadrao: { for: 12, des: 15, con: 13, int: 10, sab: 14, car: 8 },
    defesaSemArmadura: 'sab', artesMarciais: '1d6',
    kits: [
      kit('A', { armas: ['lanca', ...Array(5).fill('adaga')], itens: ['Ferramenta ou instrumento (o da proficiência)', 'Kit de Aventureiro'], po: 11 }),
      kit('B', { po: 50 }),
    ],
    caracteristicas: [
      { nome: 'Artes Marciais (1d6)', desc: 'Desarmado e sem armadura/escudo: Ataques Desarmados e armas de Monge usam DES ou FOR, causam 1d6 e você pode fazer um Ataque Desarmado como Ação Bônus.' },
      { nome: 'Defesa sem Armadura', desc: 'Sem armadura nem escudo, CA = 10 + DES + SAB.' },
    ],
  },
  paladino: {
    nome: 'Paladino', en: 'Paladin', gosta: 'Proteção', primario: ['for', 'car'], complexidade: 'Média', dado: 10,
    resumo: 'Cavaleiro sagrado ligado a um juramento: armadura pesada, cura e golpes divinos.',
    salvaguardas: ['sab', 'car'],
    pericias: { n: 2, de: ['atletismo', 'intuicao', 'intimidacao', 'medicina', 'persuasao', 'religiao'] },
    armas: ['simples', 'marcial'], armaduras: ['leve', 'media', 'pesada', 'escudo'],
    arrayPadrao: { for: 15, des: 10, con: 13, int: 8, sab: 12, car: 14 },
    magia: { atr: 'car', truques: 0, preparadas: 2, espacos: [2], lista: 'paladino' },
    maestria: 2,
    kits: [
      kit('A', { armadura: 'cota-malha', escudo: true, armas: ['espada-longa', ...Array(6).fill('azagaia')], itens: ['Símbolo Sagrado', 'Kit de Sacerdote'], po: 9 }),
      kit('B', { po: 150 }),
    ],
    caracteristicas: [
      { nome: 'Mãos Consagradas (5 PV)', desc: 'Ação Bônus: toque que cura PV de uma reserva de 5 × nível de Paladino (ou gasta 5 para curar Envenenado). Recupera no Descanso Longo.' },
      { nome: 'Conjuração', desc: 'Magias de Paladino usando Carisma; o símbolo sagrado serve de foco.' },
      { nome: 'Maestria em Arma (2)', desc: 'Usa a propriedade de maestria de 2 tipos de arma à escolha.' },
    ],
  },
  // Guardião (Ranger). O id 'patrulheiro' vem da 0.1.0 e fica para não quebrar fichas salvas.
  patrulheiro: {
    nome: 'Guardião', en: 'Ranger', gosta: 'Sobrevivência', primario: ['des', 'sab'], complexidade: 'Média', dado: 10,
    resumo: 'Caçador das terras selvagens que combina armas, rastreio e magia da natureza.',
    salvaguardas: ['for', 'des'],
    pericias: { n: 3, de: ['adestrar', 'atletismo', 'intuicao', 'investigacao', 'natureza', 'percepcao', 'furtividade', 'sobrevivencia'] },
    armas: ['simples', 'marcial'], armaduras: ['leve', 'media', 'escudo'],
    arrayPadrao: { for: 12, des: 15, con: 13, int: 8, sab: 14, car: 10 },
    magia: { atr: 'sab', truques: 0, preparadas: 2, espacos: [2], lista: 'patrulheiro', sempre: ['hunters-mark'] },
    maestria: 2,
    kits: [
      kit('A', { armadura: 'couro-batido', armas: ['cimitarra', 'espada-curta', 'arco-longo'], itens: ['20 Flechas', 'Aljava', 'Foco Druídico (ramo de visco)', 'Kit de Aventureiro'], po: 7 }),
      kit('B', { po: 150 }),
    ],
    caracteristicas: [
      { nome: 'Conjuração', desc: 'Magias de Guardião usando Sabedoria; um foco druídico serve de foco.' },
      { nome: 'Inimigo Favorito', desc: 'Marca do Predador sempre preparada; pode conjurá-la 2 vezes sem gastar espaço (recupera no Descanso Longo).' },
      { nome: 'Maestria em Arma (2)', desc: 'Usa a propriedade de maestria de 2 tipos de arma à escolha.' },
    ],
  },
  ladino: {
    nome: 'Ladino', en: 'Rogue', gosta: 'Furtividade', primario: ['des'], complexidade: 'Baixa', dado: 8,
    resumo: 'Especialista em furtividade e perícias: acha armadilhas, abre fechaduras e acerta pontos fracos.',
    salvaguardas: ['des', 'int'],
    pericias: { n: 4, de: ['acrobacia', 'atletismo', 'enganacao', 'intuicao', 'intimidacao', 'investigacao', 'percepcao', 'persuasao', 'prestidigitacao', 'furtividade'] },
    ferramentasFixas: ['Ferramentas de Ladrão'],
    armas: ['simples', 'marcial-acuidade-leve'], armaduras: ['leve'],
    idiomasFixos: ['Gíria dos Ladrões'], idiomaExtra: 1,
    arrayPadrao: { for: 12, des: 15, con: 13, int: 14, sab: 10, car: 8 },
    maestria: 2, especialista: 2,
    kits: [
      kit('A', { armadura: 'couro', armas: ['adaga', 'adaga', 'espada-curta', 'arco-curto'], itens: ['20 Flechas', 'Aljava', 'Ferramentas de Ladrão', 'Kit de Assaltante'], po: 8 }),
      kit('B', { po: 100 }),
    ],
    caracteristicas: [
      { nome: 'Especialista', desc: 'Especialização: dobra o Bônus de Proficiência em 2 perícias em que você é proficiente.' },
      { nome: 'Ataque Furtivo (1d6)', desc: '1×/turno, +1d6 de dano com arma de acuidade ou à distância se tiver Vantagem ou um aliado ao lado do alvo.' },
      { nome: 'Gíria do Ladrão', desc: 'A língua secreta dos ladinos, mais um idioma à escolha.' },
      { nome: 'Maestria em Arma (2)', desc: 'Usa a propriedade de maestria de 2 tipos de arma à escolha.' },
    ],
  },
  feiticeiro: {
    nome: 'Feiticeiro', en: 'Sorcerer', gosta: 'Poder', primario: ['car'], complexidade: 'Alta', dado: 6,
    resumo: 'A magia está no seu sangue: poucas magias, mas moldadas com força bruta.',
    salvaguardas: ['con', 'car'],
    pericias: { n: 2, de: ['arcanismo', 'enganacao', 'intuicao', 'intimidacao', 'persuasao', 'religiao'] },
    armas: ['simples'], armaduras: [],
    arrayPadrao: { for: 10, des: 13, con: 14, int: 8, sab: 12, car: 15 },
    magia: { atr: 'car', truques: 4, preparadas: 2, espacos: [2], lista: 'feiticeiro' },
    kits: [
      kit('A', { armas: ['lanca', 'adaga', 'adaga'], itens: ['Foco Arcano (cristal)', 'Kit de Explorador de Masmorras'], po: 28 }),
      kit('B', { po: 50 }),
    ],
    caracteristicas: [
      { nome: 'Conjuração', desc: 'Magias de Feiticeiro usando Carisma; um foco arcano serve de foco.' },
      { nome: 'Feitiçaria Inata', desc: 'Ação Bônus, 2×/Descanso Longo, por 1 minuto: +1 na CD das suas magias e Vantagem nos ataques mágicos.' },
    ],
  },
  bruxo: {
    nome: 'Bruxo', en: 'Warlock', gosta: 'Conhecimento obscuro', primario: ['car'], complexidade: 'Alta', dado: 8,
    resumo: 'Fez um pacto com uma entidade poderosa em troca de magia e invocações sobrenaturais.',
    salvaguardas: ['sab', 'car'],
    pericias: { n: 2, de: ['arcanismo', 'enganacao', 'historia', 'intimidacao', 'investigacao', 'natureza', 'religiao'] },
    armas: ['simples'], armaduras: ['leve'],
    arrayPadrao: { for: 8, des: 14, con: 13, int: 12, sab: 10, car: 15 },
    magia: { atr: 'car', truques: 2, preparadas: 2, espacos: [1], lista: 'bruxo', pacto: true },
    invocacoes: 1,
    kits: [
      kit('A', { armadura: 'couro', armas: ['foice-curta', 'adaga', 'adaga'], itens: ['Foco Arcano (orbe)', 'Livro (conhecimento oculto)', 'Kit de Erudito'], po: 15 }),
      kit('B', { po: 100 }),
    ],
    caracteristicas: [
      { nome: 'Invocações Místicas (1)', desc: 'Um dom sobrenatural do seu patrono.' },
      { nome: 'Magia de Pacto', desc: 'Magias de Bruxo usando Carisma. Espaços de magia voltam no Descanso Curto.' },
    ],
  },
  mago: {
    nome: 'Mago', en: 'Wizard', gosta: 'Livros de magia', primario: ['int'], complexidade: 'Média', dado: 6,
    resumo: 'Estudioso das artes arcanas com o maior repertório de magias do jogo.',
    salvaguardas: ['int', 'sab'],
    pericias: { n: 2, de: ['arcanismo', 'historia', 'intuicao', 'investigacao', 'medicina', 'natureza', 'religiao'] },
    armas: ['simples'], armaduras: [],
    arrayPadrao: { for: 8, des: 12, con: 13, int: 15, sab: 14, car: 10 },
    magia: { atr: 'int', truques: 3, preparadas: 4, espacos: [2], lista: 'mago', grimorio: 6 },
    kits: [
      kit('A', { armas: ['adaga', 'adaga', 'bordao'], itens: ['Foco Arcano (o próprio Cajado)', 'Túnica', 'Livro de Magias', 'Kit de Erudito'], po: 5 }),
      kit('B', { po: 55 }),
    ],
    caracteristicas: [
      { nome: 'Conjuração', desc: 'Magias de Mago usando Inteligência. O Livro de Magias começa com 6 magias de 1º círculo; você prepara 4 delas.' },
      { nome: 'Adepto de Ritual', desc: 'Conjura como Ritual qualquer magia de ritual do Livro de Magias, mesmo sem prepará-la.' },
      { nome: 'Recuperação Arcana', desc: '1×/dia, num Descanso Curto, recupera espaços de magia somando até metade do nível de Mago (arredondado para cima).' },
    ],
  },
};

export const ESTILOS_LUTA = {
  arquearia: { nome: 'Arquearia', en: 'Archery', desc: '+2 nos ataques com armas à distância.' },
  defesa: { nome: 'Defensivo', en: 'Defense', desc: '+1 na CA usando armadura leve, média ou pesada.' },
  'arma-grande': { nome: 'Combate com Armas Grandes', en: 'Great Weapon Fighting', desc: 'Com arma de duas mãos ou versátil empunhada com as duas, trata 1 e 2 no dado de dano como 3.' },
  'duas-armas': { nome: 'Combate com Duas Armas', en: 'Two-Weapon Fighting', desc: 'Soma o modificador de atributo ao dano do ataque extra com arma Leve.' },
};

// Invocações sem pré-requisito (as únicas disponíveis no nível 1).
export const INVOCACOES = {
  'armadura-sombras': { nome: 'Armadura de Sombras', en: 'Armor of Shadows', desc: 'Conjura Armadura Arcana em si mesmo sem gastar espaço de magia.' },
  'mente-mistica': { nome: 'Mente Mística', en: 'Eldritch Mind', desc: 'Vantagem nas salvaguardas de Constituição para manter Concentração.' },
  'pacto-lamina': { nome: 'Pacto da Lâmina', en: 'Pact of the Blade', desc: 'Conjura uma arma de pacto; ataca com ela usando Carisma.' },
  'pacto-corrente': { nome: 'Pacto da Corrente', en: 'Pact of the Chain', desc: 'Aprende Convocar Familiar e pode ter um familiar especial (diabrete, pseudodragão...).' },
  'pacto-tomo': { nome: 'Pacto do Tomo', en: 'Pact of the Tome', desc: 'Um Livro das Sombras com 3 truques e 2 rituais de 1º círculo de qualquer lista.' },
};

// ---------------------------------------------------------------- Talentos de origem

export const TALENTOS = {
  alerta: { nome: 'Alerta', en: 'Alert', desc: 'Soma o Bônus de Proficiência à Iniciativa e pode trocar sua Iniciativa com a de um aliado voluntário.' },
  iniciado: { nome: 'Iniciado em Magia', en: 'Magic Initiate', desc: '2 truques e 1 magia de 1º círculo da lista de Clérigo, Druida ou Mago. A magia de 1º círculo pode ser conjurada 1×/Descanso Longo sem espaço.' },
  selvagem: { nome: 'Atacante Selvagem', en: 'Savage Attacker', desc: '1×/turno, ao acertar com arma, rola os dados de dano duas vezes e usa o melhor.' },
  habilidoso: { nome: 'Habilidoso', en: 'Skilled', desc: 'Proficiência em 3 perícias ou ferramentas à escolha (qualquer combinação).' },
};
export const LISTAS_INICIADO = { clerigo: 'Clérigo', druida: 'Druida', mago: 'Mago' };

// ---------------------------------------------------------------- Antecedentes

export const ANTECEDENTES = {
  acolito: {
    nome: 'Acólito', en: 'Acolyte', atributos: ['int', 'sab', 'car'],
    talento: 'iniciado', listaIniciado: 'clerigo',
    pericias: ['intuicao', 'religiao'], ferramenta: 'Suprimentos de Calígrafo',
    resumo: 'Serviu num templo, copiando textos sagrados e auxiliando nos ritos.',
    kits: [
      kit('A', { itens: ['Suprimentos de Calígrafo', 'Livro (orações)', 'Símbolo Sagrado', 'Pergaminho (10 folhas)', 'Túnica'], po: 8 }),
      kit('B', { po: 50 }),
    ],
  },
  criminoso: {
    nome: 'Criminoso', en: 'Criminal', atributos: ['des', 'con', 'int'],
    talento: 'alerta',
    pericias: ['prestidigitacao', 'furtividade'], ferramenta: 'Ferramentas de Ladrão',
    resumo: 'Ganhava a vida nos becos: roubos, contrabando e olhos sempre atentos.',
    kits: [
      kit('A', { armas: ['adaga', 'adaga'], itens: ['Ferramentas de Ladrão', '2 Algibeiras', 'Pé de Cabra', 'Roupas de Viagem'], po: 16 }),
      kit('B', { po: 50 }),
    ],
  },
  sabio: {
    nome: 'Sábio', en: 'Sage', atributos: ['con', 'int', 'sab'],
    talento: 'iniciado', listaIniciado: 'mago',
    pericias: ['arcanismo', 'historia'], ferramenta: 'Suprimentos de Calígrafo',
    resumo: 'Passou anos entre bibliotecas e mestres, estudando o saber do mundo.',
    kits: [
      kit('A', { armas: ['bordao'], itens: ['Suprimentos de Calígrafo', 'Livro (história)', 'Pergaminho (8 folhas)', 'Túnica'], po: 8 }),
      kit('B', { po: 50 }),
    ],
  },
  soldado: {
    nome: 'Soldado', en: 'Soldier', atributos: ['for', 'des', 'con'],
    talento: 'selvagem',
    pericias: ['atletismo', 'intimidacao'], ferramenta: null, ferramentaEscolha: 'Um tipo de Kit de Jogos (dados, baralho, xadrez-do-dragão...)',
    resumo: 'Treinou e lutou num exército ou milícia; sabe seguir e dar ordens.',
    kits: [
      kit('A', { armas: ['lanca', 'arco-curto'], itens: ['20 Flechas', 'Kit de Curandeiro', 'Kit de Jogos (o da proficiência)', 'Aljava', 'Roupas de Viagem'], po: 14 }),
      kit('B', { po: 50 }),
    ],
  },
  personalizado: {
    nome: 'Personalizado', en: 'Custom (decisão do Mestre)', personalizado: true,
    resumo: 'O SRD traz só 4 antecedentes. Monte o seu seguindo a mesma fórmula: 3 atributos, 2 perícias, 1 ferramenta, 1 talento de origem e 50 PO.',
    kits: [kit('B', { po: 50 })],
  },
};

// ---------------------------------------------------------------- Espécies

export const ANCESTRAIS_DRACONICOS = {
  azul: { nome: 'Azul', dano: 'Elétrico' }, branco: { nome: 'Branco', dano: 'Gélido' }, bronze: { nome: 'Bronze', dano: 'Elétrico' },
  cobre: { nome: 'Cobre', dano: 'Ácido' }, latao: { nome: 'Latão', dano: 'Ígneo' }, negro: { nome: 'Negro', dano: 'Ácido' },
  ouro: { nome: 'Ouro', dano: 'Ígneo' }, prata: { nome: 'Prata', dano: 'Gélido' }, verde: { nome: 'Verde', dano: 'Venenoso' },
  vermelho: { nome: 'Vermelho', dano: 'Ígneo' },
};

export const ESPECIES = {
  draconato: {
    nome: 'Draconato', en: 'Dragonborn', tamanho: 'Médio', deslocamento: 9, visaoEscuro: 18,
    resumo: 'Descendentes de dragões, com sopro elemental e escamas da cor do ancestral.',
    escolhas: [{ id: 'ancestral', titulo: 'Herança dracônica', opcoes: 'ANCESTRAIS_DRACONICOS' }],
    tracos: (e) => {
      const a = ANCESTRAIS_DRACONICOS[e.ancestral];
      const dano = a ? a.dano : '(escolha a herança)';
      return [
        { nome: 'Herança Dracônica', desc: a ? `Dragão ${a.nome}: dano ${dano}.` : 'Escolha o tipo de dragão.' },
        { nome: 'Ataque de Sopro', desc: `Substitui um ataque: cone de 4,5 m ou linha de 9 m. Salvaguarda de DES (CD 8 + CON + proficiência) ou 1d10 de dano ${dano} (metade se passar). Usos = Bônus de Proficiência por Descanso Longo.` },
        { nome: 'Resistência a Dano', desc: `Resistência a dano ${dano}.` },
        { nome: 'Visão no Escuro', desc: '18 m.' },
      ];
    },
  },
  anao: {
    nome: 'Anão', en: 'Dwarf', tamanho: 'Médio', deslocamento: 9, visaoEscuro: 36, pvPorNivel: 1,
    resumo: 'Robustos e teimosos, forjados na pedra. Mais PV e Resistência a dano Venenoso.',
    tracos: () => [
      { nome: 'Visão no Escuro', desc: '36 m.' },
      { nome: 'Resistência a Toxinas', desc: 'Resistência a dano Venenoso e Vantagem em salvaguardas para evitar ou encerrar a condição Envenenado.' },
      { nome: 'Tenacidade Anã', desc: '+1 PV máximo, e +1 a cada nível.' },
      { nome: 'Conhecimento de Pedras', desc: 'Ação Bônus: Sismiconsciência de 18 m por 10 minutos tocando pedra. Usos = Bônus de Proficiência por Descanso Longo.' },
    ],
  },
  elfo: {
    nome: 'Elfo', en: 'Elf', tamanho: 'Médio', deslocamento: 9, visaoEscuro: 18,
    resumo: 'Longevos e ligados à magia feérica; não dormem, meditam.',
    escolhas: [
      { id: 'linhagem', titulo: 'Linhagem élfica', opcoes: { drow: 'Drow', alto: 'Alto Elfo', silvestre: 'Elfo Silvestre' } },
      { id: 'atributoMagia', titulo: 'Atributo das magias da linhagem', opcoes: { int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma' } },
      { id: 'pericia', titulo: 'Sentidos Aguçados (perícia)', opcoes: { intuicao: 'Intuição', percepcao: 'Percepção', sobrevivencia: 'Sobrevivência' } },
    ],
    tracos: (e) => {
      const lin = {
        drow: { nome: 'Drow', desc: 'Visão no Escuro aumenta para 36 m; truque Luzes Dançantes. Nível 3: Fogo das Fadas · nível 5: Escuridão.' },
        alto: { nome: 'Alto Elfo', desc: 'Truque Prestidigitação Arcana (pode trocar por outro truque de Mago a cada Descanso Longo). Nível 3: Detectar Magia · nível 5: Passo Nebuloso.' },
        silvestre: { nome: 'Elfo Silvestre', desc: 'Deslocamento 10,5 m; truque Arte Druídica. Nível 3: Passos Largos · nível 5: Passos Sem Rastro.' },
      }[e.linhagem];
      return [
        { nome: 'Visão no Escuro', desc: e.linhagem === 'drow' ? '36 m.' : '18 m.' },
        { nome: `Linhagem Élfica${lin ? ': ' + lin.nome : ''}`, desc: lin ? lin.desc : 'Escolha a linhagem.' },
        { nome: 'Ancestralidade Feérica', desc: 'Vantagem em salvaguardas contra Enfeitiçado.' },
        { nome: 'Sentidos Aguçados', desc: 'Proficiência em Intuição, Percepção ou Sobrevivência.' },
        { nome: 'Transe', desc: 'Não dorme; Descanso Longo em 4 horas de meditação consciente.' },
      ];
    },
    truques: (e) => ({ drow: ['dancing-lights'], alto: ['prestidigitation'], silvestre: ['druidcraft'] }[e.linhagem] || []),
    deslocamentoPor: (e) => (e.linhagem === 'silvestre' ? 10.5 : 9),
    visaoPor: (e) => (e.linhagem === 'drow' ? 36 : 18),
  },
  gnomo: {
    nome: 'Gnomo', en: 'Gnome', tamanho: 'Pequeno', deslocamento: 9, visaoEscuro: 18,
    resumo: 'Pequenos, curiosos e inventivos, com resistência mental natural.',
    escolhas: [
      { id: 'linhagem', titulo: 'Linhagem gnômica', opcoes: { floresta: 'Gnomo do Bosque', rochas: 'Gnomo das Rochas' } },
      { id: 'atributoMagia', titulo: 'Atributo das magias da linhagem', opcoes: { int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma' } },
    ],
    tracos: (e) => [
      { nome: 'Visão no Escuro', desc: '18 m.' },
      { nome: 'Astúcia de Gnomo', desc: 'Vantagem em salvaguardas de INT, SAB e CAR.' },
      e.linhagem === 'floresta'
        ? { nome: 'Linhagem Gnômica: Gnomo do Bosque', desc: 'Truque Ilusão Menor; Falar com Animais sempre preparada, sem espaço, usos = Bônus de Proficiência por Descanso Longo.' }
        : e.linhagem === 'rochas'
          ? { nome: 'Linhagem Gnômica: Gnomo das Rochas', desc: 'Truques Prestidigitação Arcana e Reparar; em 10 minutos cria pequenos dispositivos (até 3) com um efeito de Prestidigitação Arcana.' }
          : { nome: 'Linhagem Gnômica', desc: 'Escolha a linhagem.' },
    ],
    truques: (e) => ({ floresta: ['minor-illusion'], rochas: ['mending', 'prestidigitation'] }[e.linhagem] || []),
  },
  golias: {
    nome: 'Golias', en: 'Goliath', tamanho: 'Médio', deslocamento: 10.5,
    resumo: 'Gigantes entre os povos, descendentes de gigantes, com um dom do seu ancestral.',
    escolhas: [{
      id: 'ancestral', titulo: 'Ancestralidade gigante', opcoes: {
        nuvem: 'Salto da Nuvem (Gigante das Nuvens)', fogo: 'Queimadura de Fogo (Gigante de Fogo)', gelo: 'Arrepio do Gelo (Gigante do Gelo)',
        colina: 'Tombo da Colina (Gigante da Colina)', pedra: 'Resistência da Pedra (Gigante da Pedra)', tempestade: 'Trovão da Tempestade (Gigante da Tempestade)',
      },
    }],
    tracos: (e) => {
      const dons = {
        nuvem: 'Ação Bônus: teleporta-se até 9 m para um espaço que veja.',
        fogo: 'Ao acertar um ataque e causar dano: +1d10 de dano Ígneo.',
        gelo: 'Ao acertar um ataque e causar dano: +1d6 de dano Gélido e −3 m no Deslocamento do alvo.',
        colina: 'Ao acertar uma criatura Grande ou menor: impõe a condição Caído.',
        pedra: 'Reação ao sofrer dano: reduz o dano em 1d12 + CON.',
        tempestade: 'Reação ao sofrer dano de criatura a até 18 m: 1d8 de dano Trovejante nela.',
      };
      return [
        { nome: 'Ancestralidade Gigante', desc: (dons[e.ancestral] || 'Escolha o dom.') + ' Usos = Bônus de Proficiência por Descanso Longo.' },
        { nome: 'Forma Grande (nível 5)', desc: 'A partir do nível 5, fica Grande por 10 minutos 1×/Descanso Longo.' },
        { nome: 'Porte Poderoso', desc: 'Vantagem para encerrar a condição Imobilizado; conta como um tamanho maior para carga.' },
      ];
    },
  },
  // Pequenino (Halfling). O id 'halfling' fica por compatibilidade com fichas salvas.
  halfling: {
    nome: 'Pequenino', en: 'Halfling', tamanho: 'Pequeno', deslocamento: 9,
    resumo: 'Pequenos, corajosos e incrivelmente sortudos.',
    tracos: () => [
      { nome: 'Corajoso', desc: 'Vantagem em salvaguardas para evitar ou encerrar a condição Amedrontado.' },
      { nome: 'Agilidade Pequenina', desc: 'Atravessa o espaço de criaturas maiores que você.' },
      { nome: 'Sorte', desc: 'Ao tirar 1 no d20 de um Teste de D20, rola de novo e usa o novo resultado.' },
      { nome: 'Furtividade Natural', desc: 'Pode se Esconder atrás de uma criatura maior que você.' },
    ],
  },
  humano: {
    nome: 'Humano', en: 'Human', tamanho: 'Médio ou Pequeno', deslocamento: 9,
    resumo: 'Versáteis e ambiciosos: uma perícia e um talento de origem a mais.',
    escolhas: [
      { id: 'tamanho', titulo: 'Tamanho', opcoes: { 'Médio': 'Médio (1,2–2,1 m)', 'Pequeno': 'Pequeno (0,6–1,2 m)' } },
      { id: 'pericia', titulo: 'Hábil (perícia)', opcoes: 'PERICIAS' },
      { id: 'talento', titulo: 'Versátil (talento de origem)', opcoes: 'TALENTOS' },
    ],
    tracos: (e) => [
      { nome: 'Eficiente', desc: 'Ganha Inspiração Heroica ao terminar um Descanso Longo.' },
      { nome: 'Hábil', desc: 'Proficiência em uma perícia à escolha.' },
      { nome: 'Versátil', desc: `Um talento de origem à escolha${e.talento && TALENTOS[e.talento] ? ': ' + TALENTOS[e.talento].nome : ''}.` },
    ],
  },
  orc: {
    nome: 'Orc', en: 'Orc', tamanho: 'Médio', deslocamento: 9, visaoEscuro: 36,
    resumo: 'Fortes e incansáveis; se recusam a cair.',
    tracos: () => [
      { nome: 'Pico de Adrenalina', desc: 'Ação Correr como Ação Bônus e ganha PV temporários = Bônus de Proficiência. Usos = Bônus de Proficiência por Descanso Curto ou Longo.' },
      { nome: 'Visão no Escuro', desc: '36 m.' },
      { nome: 'Vigor Implacável', desc: 'Ao cair a 0 PV sem morrer, fica com 1 PV. 1×/Descanso Longo.' },
    ],
  },
  tiferino: {
    nome: 'Tiferino', en: 'Tiefling', tamanho: 'Médio ou Pequeno', deslocamento: 9, visaoEscuro: 18,
    resumo: 'Marcados por um legado dos Planos Inferiores, com magia infernal no sangue.',
    escolhas: [
      { id: 'tamanho', titulo: 'Tamanho', opcoes: { 'Médio': 'Médio (1,2–2,1 m)', 'Pequeno': 'Pequeno (0,9–1,2 m)' } },
      { id: 'legado', titulo: 'Legado ínfero', opcoes: { abissal: 'Abissal', ctonico: 'Ctônico', infernal: 'Infernal' } },
      { id: 'atributoMagia', titulo: 'Atributo das magias do legado', opcoes: { int: 'Inteligência', sab: 'Sabedoria', car: 'Carisma' } },
    ],
    tracos: (e) => {
      const leg = {
        abissal: 'Resistência a dano Venenoso; truque Rajada de Veneno. Nível 3: Raio Nauseante · nível 5: Paralisar Pessoa.',
        ctonico: 'Resistência a dano Necrótico; truque Toque Necrótico. Nível 3: Vitalidade Vazia · nível 5: Raio do Enfraquecimento.',
        infernal: 'Resistência a dano Ígneo; truque Raio de Fogo. Nível 3: Repreensão Diabólica · nível 5: Escuridão.',
      }[e.legado];
      return [
        { nome: 'Visão no Escuro', desc: '18 m.' },
        { nome: 'Legado Ínfero', desc: leg || 'Escolha o legado.' },
        { nome: 'Presença Sobrenatural', desc: 'Truque Taumaturgia, com o mesmo atributo do legado.' },
      ];
    },
    truques: (e) => ['thaumaturgy', ...({ abissal: ['poison-spray'], ctonico: ['chill-touch'], infernal: ['fire-bolt'] }[e.legado] || [])],
  },
};

// ---------------------------------------------------------------- Conceito

// Arquétipos do passo 1: ajudam a recomendar classes.
export const ARQUETIPOS = [
  { id: 'frente', nome: 'Lutar na linha de frente', classes: ['guerreiro', 'barbaro', 'paladino'] },
  { id: 'furtivo', nome: 'Ágil e furtivo', classes: ['ladino', 'patrulheiro', 'monge'] },
  { id: 'estudo', nome: 'Magia de estudo', classes: ['mago'] },
  { id: 'nascenca', nome: 'Magia de nascença ou de pacto', classes: ['feiticeiro', 'bruxo'] },
  { id: 'fe', nome: 'Fé, cura e proteção', classes: ['clerigo', 'paladino'] },
  { id: 'natureza', nome: 'Natureza e feras', classes: ['druida', 'patrulheiro'] },
  { id: 'palavras', nome: 'Carisma, música e lábia', classes: ['bardo', 'feiticeiro', 'bruxo'] },
  { id: 'marcial', nome: 'Artes marciais', classes: ['monge'] },
];
