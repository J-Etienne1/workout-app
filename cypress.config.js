import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    // The app is served under Vite's base path, so target it directly.
    baseUrl: "http://localhost:5173/workout-app",
    supportFile: "cypress/support/e2e.js",
    specPattern: "cypress/e2e/**/*.cy.js",
    video: false,
  },
});
