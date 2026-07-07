Cypress.Commands.add('realizarTransferencia', (contaOrigem, contaDestino, valor) => {
    cy.selecionarOpcaoNaComboBox('conta-origem', contaOrigem)
    cy.selecionarOpcaoNaComboBox('conta-destino', contaDestino)
    cy.get('#valor').click().type(valor)
    cy.contains('button', 'Transferir').click()
})