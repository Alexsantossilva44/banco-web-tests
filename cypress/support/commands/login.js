// Padrão: comando unificado e parametrizado, em vez de um comando por cenário
Cypress.Commands.add('fazerLogin', (usuario, senha) => {
    cy.get('#username').click().type(usuario)
    cy.get('#senha').click().type(senha)
    cy.contains('button', 'Entrar').click()
})
