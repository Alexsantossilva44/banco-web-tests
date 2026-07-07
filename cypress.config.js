const { defineConfig } = require("cypress")

module.exports = defineConfig({
  allowCypressEnv: false,

  e2e: {
    video: false,
    expose: {
      URL: "http://localhost:4000",
    },
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
