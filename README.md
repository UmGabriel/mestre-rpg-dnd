# Mestre RPG D&D

Repositório de apoio ao Projeto **"Mestre RPG D&D"** no Claude: o Claude atua como Mestre,
ajuda a criar fichas passo a passo e conduz uma história seguindo as regras do D&D 5e (2024 / SRD 5.2).

## App: criação de ficha (v0.1.0)

Interface no navegador que conduz a criação do personagem passo a passo, com a ficha (visual de
pergaminho, ver `design/`) se montando ao lado a cada escolha. Regras de nível 1 do SRD 5.2.

```
npm run serve        # ou: python -m http.server 8123
```
Abra **http://localhost:8123/app/**. A ficha fica salva no navegador; "Salvar ficha (.json)" guarda
uma cópia. Ao final: **PDF** (preenche `regras/ficha/FICHA_MODEL.pdf`), **Markdown** (formato de
`personagens/_modelo-ficha.md`, para o Projeto do Claude) e **Imprimir**.

Passos: 1 Conceito · 2 Classe · 3 Antecedente · 4 Espécie · 5 Atributos (array padrão, compra de
pontos ou 4d6, rolando na tela ou digitando os dados da mesa) · 6 Perícias, equipamento e magias ·
7 PV, CA e iniciativa · 8 Detalhes · 9 Ficha completa.

Testes das regras: `npm test` (Node 20+, sem dependências).

| Arquivo | O que faz |
|---|---|
| `app/js/dados.js` | Dados do SRD em português (classes, antecedentes, espécies, talentos, armas, armaduras, magias) |
| `app/js/regras.js` | Cálculos puros: atributos, perícias, PV, CA, ataques, magia, pendências |
| `app/js/app.js` | Passo a passo, eventos, rolagens de dados |
| `app/js/ficha.js` | Desenho da ficha pergaminho |
| `app/js/exportar.js` | PDF, Markdown e JSON |
| `app/vendor/pdf-lib.min.js` | pdf-lib 1.17.1 (MIT) para preencher o PDF |

## Estrutura

| Pasta / arquivo | Para que serve | Vai para o Projeto? |
|---|---|---|
| `instrucoes-projeto.md` | Texto para colar em **Instruções do projeto** | Colar nas instruções |
| `regras/` | SRD 5.2 (regras oficiais abertas) | Sim, como arquivo de conhecimento |
| `campanha/campanha.md` | Cenário, NPCs, locais, fios soltos — a "memória" da campanha | Sim (atualize sempre) |
| `personagens/` | Uma ficha por personagem (`_modelo-ficha.md` é o modelo) | Sim, a ficha atual |
| `sessoes/` | Resumo de cada sessão (`AAAA-MM-DD-titulo.md`) | Opcional (só os recentes) |
| `prompts/` | Mensagens prontas para iniciar cada tipo de conversa | Não, só copiar e colar |
| `app/` | Criador de fichas no navegador | Não (gera a ficha que vai) |
| `design/` | Referência visual da ficha | Não |

## Fluxo de uso

1. **Configurar (uma vez):** cole `instrucoes-projeto.md` nas instruções do Projeto e suba o SRD
   (veja `regras/README.md`) e `campanha/campanha.md` como arquivos de conhecimento.
2. **Criar personagem:** pelo app (`app/`), baixe o Markdown e salve em `personagens/<nome>.md`.
   Ou, sem o app, numa conversa com `prompts/criar-personagem.md`. Suba a ficha no Projeto.
3. **Jogar:** uma conversa por sessão, começando com `prompts/iniciar-sessao.md`.
4. **Encerrar:** use `prompts/encerrar-sessao.md`. O Claude gera o resumo, a ficha atualizada e as
   mudanças da campanha. Salve em `sessoes/`, atualize `personagens/` e `campanha/` e faça commit.
5. Reenvie para o Projeto os arquivos que mudaram (ficha e campanha).

> Cada conversa começa do zero; a continuidade da história vem destes arquivos.
> O git guarda o histórico — dá para ver como o personagem evoluiu sessão a sessão.
