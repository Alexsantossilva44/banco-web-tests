const { defineConfig } = require("cypress")

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    video: false,
    baseUrl: "http://localhost:4000",
    reporter: "cypress-mochawesome-reporter",
    setupNodeEvents(on, config) {
      // implement node event listeners here
      require("cypress-mochawesome-reporter/plugin")(on)
    },
  },
})
