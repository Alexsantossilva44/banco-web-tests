Cypress.Commands.add('fazerLoginComCredenciaisValidas', () => {
    cy.fixture('credenciais').then(cred => {
        cy.get('#username').click().type(cred.valida.usuario)
        cy.get('#senha').click().type(cred.valida.senha)
    })
    cy.contains('button', 'Entrar').click()
})

Cypress.Commands.add('fazerLoginComCredenciaisInvalidas', () => {
    cy.fixture('credenciais').then(cred => {
        cy.get('#username').click().type(cred.invalida.usuario)
        cy.get('#senha').click().type(cred.invalida.senha)
    })
    cy.contains('button', 'Entrar').click()
})