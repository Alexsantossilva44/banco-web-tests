describe('Login', () => {
  beforeEach(() => {
    // Arrange
    cy.visit('/')
    cy.screenshot('após-visitar-a-página')
  })

  it('Login com dados válidos deve permitir entrada no sistema', () => {
    // Act
    cy.fixture('credenciais').then(cred => cy.fazerLogin(cred.valida.usuario, cred.valida.senha))
    // Assert
    cy.contains('h4', 'Realizar Transferência').should('be.visible')
  })

  it('Login com dados inválidos deve exibir mensagem de erro', () => {
    // Act
    cy.fixture('credenciais').then(cred => cy.fazerLogin(cred.invalida.usuario, cred.invalida.senha))
    // Assert
    cy.verificarToastDeErro('Erro no login. Tente novamente.')
  })
})
