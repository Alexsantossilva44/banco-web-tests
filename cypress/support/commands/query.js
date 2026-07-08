// Padrão: query command (Cypress.Commands.addQuery) — comando "de consulta",
// retry-ável e síncrono, sem efeitos colaterais (não clica, só localiza)
Cypress.Commands.addQuery('getContaPorNome', function (nome) {
    return subject => Cypress.$(subject).find(`li:contains("${nome}")`)
})
