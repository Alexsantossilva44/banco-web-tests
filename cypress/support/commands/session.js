// Padrão: cy.session() — cacheia a sessão autenticada entre testes,
// evitando repetir o fluxo de login em cada beforeEach
//
// Validado contra o app real: falha aqui porque este app não persiste o
// login em cookies/localStorage/sessionStorage (só em estado de memória do
// JS), então não há nada para o cy.session() restaurar. O padrão é válido
// para apps que persistem sessão via storage/cookies — não é o caso deste.
Cypress.Commands.add('loginComSessao', (usuario, senha) => {
    cy.session([usuario, senha], () => {
        cy.visit('/')
        cy.fazerLogin(usuario, senha)
    })
    cy.visit('/')
})
