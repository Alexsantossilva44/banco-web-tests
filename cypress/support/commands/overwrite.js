// Padrão: Cypress.Commands.overwrite — altera o comportamento padrão de um comando nativo
Cypress.Commands.overwrite('visit', (originalFn, url, options) => {
    return originalFn(url, { ...options, failOnStatusCode: false })
})
