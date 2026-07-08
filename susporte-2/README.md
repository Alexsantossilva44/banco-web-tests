# susporte-2 — código original (arquivado)

Esta pasta guarda a versão **original** dos comandos customizados, anterior à
promoção dos padrões abaixo para `cypress/support/commands/` (código principal
da suíte agora).

| Arquivo | Comando(s) |
|---|---|
| `commands/common.js` | `verificarMensagemNoToast`, `selecionarOpcaoNaComboBox` |
| `commands/login.js` | `fazerLoginComCredenciaisValidas`, `fazerLoginComCredenciaisInvalidas` |
| `commands/transferencia.js` | `realizarTransferencia` (sem suporte a token) |

Não é importada pela suíte real (`cypress/support/e2e.js`) — mantida só como
histórico de referência.

## O que mudou na promoção

| Original (aqui) | Novo (`cypress/support/commands/`) | Padrão |
|---|---|---|
| `fazerLoginComCredenciaisValidas` / `Invalidas` | `fazerLogin(usuario, senha)` | Comando parametrizado |
| `realizarTransferencia(origem, destino, valor)` | `realizarTransferencia(origem, destino, valor, { token })` | Objeto de opções |
| `verificarMensagemNoToast(msg)` | `verificarToastDeSucesso(msg)` / `verificarToastDeErro(msg)` | Assertions expressivas |
| `selecionarOpcaoNaComboBox(label, opcao)` | `selecionarOpcaoNoCombo(opcao)` (child command) | `prevSubject: 'element'` |
| — | `loginComSessao(usuario, senha)` | `cy.session()` — **não funciona neste app**: ele não persiste login em cookies/localStorage, só em memória do JS |
| — | `getContaPorNome(nome)` | Query command (`addQuery`) |
| — | `Cypress.Commands.overwrite('visit', ...)` | `failOnStatusCode: false` em toda a suíte |

Todos os 7 comandos novos foram validados rodando de verdade contra o app
(exceto `loginComSessao`, que falha pelo motivo descrito acima).

## Ordem de execução (`cypress/support/commands/`)

Pela ordem real de uso em um teste (ex: `transferencia.cy.js`):

**Início**
1. `overwrite.js` — sobrescreve `cy.visit`, já atua na primeira linha do teste
2. `login.js` — `fazerLogin(usuario, senha)`, chamado logo após o visit

**Meio**
3. `combobox.js` — `selecionarOpcaoNoCombo`, usado internamente para escolher conta origem/destino
4. `transferencia.js` — `realizarTransferencia(...)`, orquestra o passo 3 + preenche valor/token + clica em "Transferir"

**Fim**
5. `toast.js` — `verificarToastDeSucesso` / `verificarToastDeErro`, valida o resultado final da ação

**Fora do fluxo principal** (existem, mas não usados pelos specs atuais)
6. `session.js` — seria uma forma alternativa de "início" (login cacheado), mas falha neste app
7. `query.js` — comando auxiliar de consulta, não encadeado em nenhum fluxo hoje
