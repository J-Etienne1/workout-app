describe("Workout app", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("loads Day 1 and switches between days", () => {
    // Day 1 (upper) is shown first.
    cy.contains(".day-tab", "Day 1").should("have.class", "is-active");
    cy.contains(".card__name", "Incline Dumbbell Press").should("be.visible");

    // Switching to Day 2 (lower) swaps the exercise list.
    cy.contains(".day-tab", "Day 2").click();
    cy.contains(".day-tab", "Day 2").should("have.class", "is-active");
    cy.contains(".card__name", "Goblet Squats").should("be.visible");
    cy.contains(".card__name", "Incline Dumbbell Press").should("not.exist");
  });

  it("edits a weight and persists it across a reload", () => {
    cy.get(".card")
      .first()
      .within(() => {
        cy.get(".editor__value").first().should("contain", "7.5");
        cy.get('[aria-label="Increase weight by 2.5 kg"]').click();
        cy.get(".editor__value").first().should("contain", "10");
      });

    // The value is saved to localStorage (debounced) and survives a full reload.
    // Wait briefly to allow the app's debounced write to complete before reload.
    cy.wait(300);
    cy.reload();
    cy.get(".card").first().find(".editor__value").first().should("contain", "10");
  });

  it("completing a set starts the rest timer, and presets work", () => {
    cy.get(".rest-timer").should("not.exist");

    cy.get(".card")
      .first()
      .within(() => {
        cy.get('[aria-label="Set 1 not done"]').click();
        cy.get('[aria-label="Set 1 done"]').should("exist");
      });

    // Rest timer appears.
    cy.get(".rest-timer").should("be.visible").and("contain", "Rest");

    // Choosing a preset highlights it and restarts the countdown there (90s,
    // so the countdown reads 9x for the first several seconds).
    cy.contains(".rest-timer__preset", "90s").click().should("have.class", "is-active");
    cy.get(".rest-timer__time").invoke("text").should("match", /^9/);

    // Skip closes the timer.
    cy.get('[aria-label="Skip rest"]').click();
    cy.get(".rest-timer").should("not.exist");
  });

  it("keeps set progress after a reload, then resets to defaults", () => {
    cy.get(".card")
      .first()
      .within(() => {
        cy.get('[aria-label="Set 1 not done"]').click();
        cy.get('[aria-label="Increase weight by 2.5 kg"]').click();
      });

    // Allow the debounced save to complete before reloading the page.
    cy.wait(300);
    cy.reload();

    cy.get(".card")
      .first()
      .within(() => {
        // Set tick and weight both persisted.
        cy.get('[aria-label="Set 1 done"]').should("exist");
        cy.get(".editor__value").first().should("contain", "10");

        // Reset restores defaults and clears the set.
        cy.contains("button", "Reset to defaults").click();
        cy.get(".editor__value").first().should("contain", "7.5");
        cy.get('[aria-label="Set 1 not done"]').should("exist");
      });
  });

  it("opens and closes the program info panel", () => {
    cy.get('[aria-label="Program info"]').click();
    cy.get(".info").should("be.visible");

    cy.contains(".info__tab", "Nutrition").click();
    cy.contains("Protein").should("be.visible");

    cy.get('[aria-label="Close info"]').click();
    cy.get(".info").should("not.exist");
  });
});
