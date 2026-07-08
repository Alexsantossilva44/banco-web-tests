// Padrão: child command (prevSubject) — encadeia a partir de um elemento já obtido
// em vez de sempre buscar pelo label internamente
Cypress.Commands.add('selecionarOpcaoNoCombo', { prevSubject: 'element' }, (campo, opcao) => {
    cy.wrap(campo).click()
    cy.wrap(campo).contains(opcao).click()
})
