Cypress.Commands.add('verificarMensagemNoToast', msg => {
    cy.get('.toast').should('have.text', msg)
})

Cypress.Commands.add('selecionarOpcaoNaComboBox', (labelDoCampo, opcao) => {
    cy.get(`label[for="${labelDoCampo}"]`).parent().as(`campo-${labelDoCampo}`)
    cy.get(`@campo-${labelDoCampo}`).click()
    cy.get(`@campo-${labelDoCampo}`).contains(opcao).click()
})