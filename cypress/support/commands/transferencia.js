// Padrão: parâmetro opcional (objeto de opções) para cobrir variações do mesmo fluxo
Cypress.Commands.add('realizarTransferencia', (contaOrigem, contaDestino, valor, opcoes = {}) => {
    cy.get('label[for="conta-origem"]').parent().selecionarOpcaoNoCombo(contaOrigem)
    cy.get('label[for="conta-destino"]').parent().selecionarOpcaoNoCombo(contaDestino)
    cy.get('#valor').click().type(valor)

    if (opcoes.token) {
        cy.get('#token').click().type(opcoes.token)
    }

    cy.contains('button', 'Transferir').click()
})
