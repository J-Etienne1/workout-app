// Loaded before every E2E spec. Add custom commands or global hooks here.
// Start each test from a clean slate so saved state never leaks between specs.
beforeEach(() => {
  cy.clearLocalStorage();
});
