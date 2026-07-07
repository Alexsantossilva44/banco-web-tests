describe('Login', () => {

  beforeEach(() => {

    // Arrange
    cy.visit('http://localhost:4000')
    cy.screenshot('após-visitar-a-página')

  })

  it('Login com dados válidos deve permitir entrada no sistema', () => {

    // Act
    cy.get('#username').click().type('julio.lima')
    cy.get('#senha').click().type('123456')
    cy.screenshot('após-preencher-os-dados-validos')
    cy.contains('button', 'Entrar').click()
    cy.screenshot('após-clicar-no-botão-entrar')

    // Assert
    cy.contains('h4', 'Realizar Transferência').should('be.visible')
  })

  it('Login com dados inválidos deve exibir mensagem de erro', () => {

    // Act
    cy.get('#username').click().type('julio.lima')
    cy.get('#senha').click().type('654321')
    cy.get('#login-section > .btn').click()

    // Assert
    // cy.get('.toast').should('be.visible')
    cy.get('.toast').should('have.text', 'Erro no login. Tente novamente.')
  })
})
