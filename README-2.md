# Banco Web Tests — Mentoria 2.0

## 📋 Objetivo

Este projeto demonstra **como automatizar testes E2E (End-to-End) com Cypress** para alunos da **Mentoria 2.0**.

A proposta é ensinar:

- ✅ Configuração e uso do Cypress
- ✅ Organização de testes com padrão **AAA (Arrange, Act, Assert)**
- ✅ Criação de **Custom Commands** para reduzir duplicação de código
- ✅ Uso de **fixtures** para dados de teste
- ✅ Geração de **relatórios em HTML** com cypress-mochawesome-reporter
- ✅ Boas práticas em automação de testes

---

## 🏗️ Componentes do Projeto

```
banco-web-tests/
├── cypress/
│   ├── e2e/                    # Testes E2E (casos de teste)
│   │   ├── login.cy.js         # Testes de login
│   │   └── transferencia.cy.js # Testes de transferência
│   │
│   ├── fixtures/               # Dados para testes
│   │   └── credenciais.json    # Credenciais válidas e inválidas
│   │
│   ├── reports/                # Relatórios gerados (HTML)
│   │   └── html/               # Saída do cypress-mochawesome-reporter
│   │
│   ├── screenshots/            # Screenshots capturados
│   ├── videos/                 # Vídeos dos testes
│   │
│   └── support/                # Código reutilizável
│       ├── e2e.js              # Configuração inicial dos testes
│       ├── commands.js         # Carrega todos os custom commands
│       └── commands/           # Custom Commands organizados por domínio
│           ├── login.js        # Comandos de autenticação
│           ├── transferencia.js# Comandos de transferência
│           ├── toast.js        # Validação de notificações (toast)
│           ├── session.js      # Gerenciamento de sessão
│           ├── query.js        # Consultas customizadas
│           ├── combobox.js     # Seleção em dropdowns
│           └── overwrite.js    # Sobrescrita de comandos nativos
│
├── susporte-2/                 # Código original arquivado (referência)
├── cypress.config.js           # Configuração do Cypress
├── package.json                # Dependências e scripts
└── README-2.md                 # Este arquivo
```

---

## 🚀 Instalação e Execução

### 1️⃣ Pré-requisitos

- **Node.js** v16+ instalado
- **Git** instalado
- **API do Banco** em execução (porta 3000)
  - [github.com/Alexsantossilva44/banco-api-tests](https://github.com/Alexsantossilva44/banco-api-tests)
- **Aplicação Web** em execução (porta 4000)
  - [github.com/Alexsantossilva44/banco-web-tests](https://github.com/Alexsantossilva44/banco-web-tests)

### 2️⃣ Clone e Instale

```bash
# Clone este repositório
git clone https://github.com/Alexsantossilva44/banco-web-tests.git
cd banco-web-tests

# Instale as dependências
npm install
```

### 3️⃣ Configure as Credenciais

Edite [cypress/fixtures/credenciais.json](cypress/fixtures/credenciais.json):

```json
{
  "valida": {
    "usuario": "seu-usuario",
    "senha": "sua-senha"
  },
  "invalida": {
    "usuario": "usuario-invalido",
    "senha": "senha-invalida"
  }
}
```

### 4️⃣ Inicie API e Aplicação Web

```bash
# Terminal 1 — API (porta 3000)
cd ../banco-api-tests
npm install && npm start

# Terminal 2 — Aplicação Web (porta 4000)
cd ../banco-web-tests
npm start
```

### 5️⃣ Execute os Testes

```bash
# Modo headless (sem interface)
npm test

# Modo headed (com browser)
npm run cy:headed

# Abre o Cypress Test Runner interativo
npm run cy:open
```

### 📊 Visualize o Relatório

Após executar os testes, abra:

```
cypress/reports/html/index.html
```

---

## 🧪 Testes E2E

### Login (`cypress/e2e/login.cy.js`)

| Teste                         | Objetivo                                           | Precondição              | Validação                                                        |
| ----------------------------- | -------------------------------------------------- | ------------------------ | ---------------------------------------------------------------- |
| **Login com dados válidos**   | Autenticar usuário com credenciais corretas        | Estar na página de login | Redireciona para dashboard (h4 "Realizar Transferência" visível) |
| **Login com dados inválidos** | Verificar comportamento com credenciais incorretas | Estar na página de login | Toast de erro: "Erro no login. Tente novamente."                 |

#### Exemplo de Teste

```javascript
describe('Login', () => {
  beforeEach(() => {
    cy.visit('/'); // Arrange
    cy.screenshot('após-visitar-a-página');
  });

  it('Login com dados válidos deve permitir entrada no sistema', () => {
    // Act
    cy.fixture('credenciais').then((cred) =>
      cy.fazerLogin(cred.valida.usuario, cred.valida.senha),
    );

    // Assert
    cy.contains('h4', 'Realizar Transferência').should('be.visible');
  });
});
```

---

### Transferência (`cypress/e2e/transferencia.cy.js`)

| Teste                                | Objetivo                                       | Precondição                                  | Validação                                                                         |
| ------------------------------------ | ---------------------------------------------- | -------------------------------------------- | --------------------------------------------------------------------------------- |
| **Transferir com valores válidos**   | Realizar transferência bancária com sucesso    | Estar autenticado e na tela de transferência | Toast de sucesso: "Transferência realizada!"                                      |
| **Transferência > R$5mil sem token** | Validar limite de segurança para valores altos | Estar autenticado e sem token informado      | Toast de erro: "Autenticação necessária para transferências acima de R$5.000,00." |

#### Exemplo de Teste

```javascript
describe('Transferencia', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.fixture('credenciais').then((cred) =>
      cy.fazerLogin(cred.valida.usuario, cred.valida.senha),
    );
  });

  it('Deve transferir quando informo dados válidos', () => {
    cy.realizarTransferencia('Maria', 'João', '11');
    cy.verificarToastDeSucesso('Transferência realizada!');
  });

  it('Deve apresentar erro quando tentar transferir mais que 5 mil sem token', () => {
    cy.realizarTransferencia('Maria', 'João', '5001');
    cy.verificarToastDeErro('Autenticação necessária...');
  });
});
```

---

## 🛠️ Custom Commands

Os Custom Commands **reduzem a duplicação de código** e tornam os testes mais legíveis.

### Login Commands (`cypress/support/commands/login.js`)

#### `cy.fazerLogin(usuario, senha)`

Realiza login na aplicação preenchendo usuário, senha e clicando em "Entrar".

**Parâmetros:**

- `usuario` (string): Usuário/email
- `senha` (string): Senha

**Exemplo:**

```javascript
cy.fixture('credenciais').then((cred) =>
  cy.fazerLogin(cred.valida.usuario, cred.valida.senha),
);
```

---

### Transferência Commands (`cypress/support/commands/transferencia.js`)

#### `cy.realizarTransferencia(contaOrigem, contaDestino, valor, [opcoes])`

Realiza uma transferência bancária entre contas.

**Parâmetros:**

- `contaOrigem` (string): Nome da conta origem (ex: "Maria")
- `contaDestino` (string): Nome da conta destino (ex: "João")
- `valor` (string|number): Valor a transferir (ex: "100" ou "5001")
- `opcoes` (object, opcional): Objeto com opções adicionais
  - `token` (string): Token para autenticar transferências > R$5.000

**Exemplos:**

```javascript
// Transferência simples
cy.realizarTransferencia('Maria', 'João', '100');

// Transferência com token
cy.realizarTransferencia('Maria', 'João', '5001', { token: '12345' });
```

---

### Toast Commands (`cypress/support/commands/toast.js`)

#### `cy.verificarToastDeSucesso(mensagem)`

Valida que um toast de sucesso (verde) foi exibido com a mensagem esperada.

**Parâmetros:**

- `mensagem` (string): Mensagem esperada no toast

**Exemplo:**

```javascript
cy.verificarToastDeSucesso('Transferência realizada!');
```

---

#### `cy.verificarToastDeErro(mensagem)`

Valida que um toast de erro (vermelho) foi exibido com a mensagem esperada.

**Parâmetros:**

- `mensagem` (string): Mensagem esperada no toast

**Exemplo:**

```javascript
cy.verificarToastDeErro('Erro no login. Tente novamente.');
```

---

### Combobox Commands (`cypress/support/commands/combobox.js`)

#### `cy.selecionarOpcaoNoCombo(opcao)`

Seleciona uma opção em um dropdown/combobox. **Comando child** (deve ser encadeado a um elemento).

**Parâmetros:**

- `opcao` (string): Texto da opção a selecionar

**Exemplo:**

```javascript
cy.get('label[for="conta-origem"]').parent().selecionarOpcaoNoCombo('Maria');
```

---

## 📝 Padrões de Código

### 1. Testes com AAA (Arrange, Act, Assert)

```javascript
it('Deve fazer algo esperado', () => {
  // Arrange — preparar o estado
  cy.visit('/');

  // Act — executar a ação
  cy.fazerLogin('usuario', 'senha');

  // Assert — validar o resultado
  cy.contains('h4', 'Realizar Transferência').should('be.visible');
});
```

### 2. Custom Commands Parametrizados

Em vez de criar um comando por cenário:

```javascript
// ❌ Evite
Cypress.Commands.add('loginComCredenciaisValidas', ...)
Cypress.Commands.add('loginComCredenciaisInvalidas', ...)

// ✅ Prefira
Cypress.Commands.add('fazerLogin', (usuario, senha) => { ... })
```

### 3. Objetos de Opções para Variações

```javascript
// ❌ Evite múltiplos comandos
Cypress.Commands.add('transferirComToken', ...)
Cypress.Commands.add('transferirSemToken', ...)

// ✅ Prefira opções
Cypress.Commands.add('realizarTransferencia', (origem, destino, valor, opcoes = {}) => {
  // ... código comum ...
  if (opcoes.token) {
    // ... lógica do token ...
  }
})
```

### 4. Assertions Expressivas

```javascript
// ❌ Validação genérica
cy.get('.toast').should('contain', 'Transferência realizada!');

// ✅ Validação específica (verifica cor + texto)
cy.verificarToastDeSucesso('Transferência realizada!');
```

---

## 🔧 Configuração Cypress (`cypress.config.js`)

```javascript
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    video: false, // Desabilita vídeos
    baseUrl: 'http://localhost:4000', // URL base da aplicação
    reporter: 'cypress-mochawesome-reporter', // Formato do relatório
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
    },
  },
});
```

---

## 📚 Estrutura de Fixtures

### `cypress/fixtures/credenciais.json`

```json
{
  "valida": {
    "usuario": "usuario@email.com",
    "senha": "senha123"
  },
  "invalida": {
    "usuario": "invalido@email.com",
    "senha": "senhaerrada"
  }
}
```

**Uso nos testes:**

```javascript
cy.fixture('credenciais').then((cred) => {
  cy.fazerLogin(cred.valida.usuario, cred.valida.senha);
});
```

---

## 📊 Relatórios

Após executar `npm test`, um relatório HTML é gerado em:

```
cypress/reports/html/index.html
```

**O relatório inclui:**

- ✅ Resumo de testes (passados, falhados, pendentes)
- ✅ Duração de execução
- ✅ Screenshots de cada teste
- ✅ Vídeos (se habilitado)
- ✅ Stack trace de falhas

---

## 🎓 Aprendizados Principais

### Por que Custom Commands?

| Sem Custom Commands                      | Com Custom Commands                   |
| ---------------------------------------- | ------------------------------------- |
| `cy.get('#username').type('usuario')`    | `cy.fazerLogin('usuario', 'senha')`   |
| Código duplicado em vários testes        | Código centralizado e reutilizável    |
| Difícil manutenção (mudança em N testes) | Fácil manutenção (mudança em 1 lugar) |
| Testes menos legíveis                    | Testes em linguagem do negócio        |

### Por que Fixtures?

- 📝 **Dados centralizados** — não hardcoded nos testes
- 🔄 **Reutilizáveis** — múltiplos testes usam as mesmas credenciais
- ✏️ **Fáceis de manter** — alterar dados é trivial
- 🔐 **Segurança** — podem ser excluídos do Git em produção

---

## 🚨 Dicas de Troubleshooting

| Problema                                | Solução                                                           |
| --------------------------------------- | ----------------------------------------------------------------- |
| Testes falham com "Cannot find element" | Aguarde com `cy.get(...).should('be.visible')` antes de interagir |
| "API não está respondendo"              | Verifique se `npm start` foi executado em `banco-api-tests`       |
| Relatório não é gerado                  | Instale: `npm install --save-dev cypress-mochawesome-reporter`    |
| Toast não aparece                       | Verifique se a API respondeu corretamente com status 200          |

---

## 📖 Referências

- [Cypress Official Docs](https://docs.cypress.io)
- [Cypress Best Practices](https://docs.cypress.io/guides/references/best-practices)
- [Custom Commands](https://docs.cypress.io/api/cypress-api/custom-commands)
- [Fixtures](https://docs.cypress.io/api/commands/fixture)

---

## 📄 Licença

ISC

---

## 👤 Autor

Developed for Mentoria 2.0

Repositories:

- [banco-api-tests](https://github.com/Alexsantossilva44/banco-api-tests)
- [banco-web-tests](https://github.com/Alexsantossilva44/banco-web-tests)
