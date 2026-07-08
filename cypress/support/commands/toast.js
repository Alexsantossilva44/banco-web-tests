// Padrão: assertions mais expressivas — validam texto E o tipo (cor) do toast
Cypress.Commands.add('verificarToastDeSucesso', msg => {
    cy.get('.toast.green').should('have.text', msg)
})

Cypress.Commands.add('verificarToastDeErro', msg => {
    cy.get('.toast.red').should('have.text', msg)
})
