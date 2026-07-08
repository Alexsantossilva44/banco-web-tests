describe('Transferencia', () => {
    beforeEach(() => {
        cy.visit('/')
        cy.fixture('credenciais').then(cred => cy.fazerLogin(cred.valida.usuario, cred.valida.senha))
    })

    it('Deve transferir quando informo dados válidos', () => {
        cy.realizarTransferencia('Maria', 'João', '11')
        cy.verificarToastDeSucesso('Transferência realizada!')
    })

    it('Deve apresentar erro quando tentar transferir mais que 5 mil sem o token', () => {
        cy.realizarTransferencia('Maria', 'João', '5001')
        cy.verificarToastDeErro('Autenticação necessária para transferências acima de R$5.000,00.')
    })
})
