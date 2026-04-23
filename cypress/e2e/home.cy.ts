describe("Countries App", () => {
  beforeEach(() => {
    // Stub BOTH APIs (primary + fallback safety)
    cy.intercept("GET", "**/v3.1/all*", {
      fixture: "countries.json",
    }).as("getCountries");

    cy.intercept("GET", "**/countries.json", {
      fixture: "countries.json",
    });

    cy.visit("/");
    cy.wait("@getCountries");
  });

  it("loads and displays countries", () => {
    cy.contains("Country 0").should("exist");
    cy.contains("Country 1").should("exist");
  });

  it("searches for a country", () => {
    cy.get("input[placeholder='Search for a country...']").type("Country 1");

    cy.contains("Country 1").should("exist");
    cy.contains("Country 0").should("not.exist");
  });

  it("filters by region", () => {
    cy.get("select").select("Asia");

    cy.contains("Country 0").should("exist");
    cy.contains("Country 1").should("not.exist");
  });

  it("loads more countries", () => {
    cy.contains("Country 0");

    cy.contains("button", "Load More").click();

    cy.contains("Country 6").should("exist");
  });

  it("toggles theme", () => {
    cy.get("button[aria-label*='mode']").click();

    cy.get("button[aria-pressed]").should("have.attr", "aria-pressed");
  });

  it("handles fallback API when primary fails", () => {
    cy.intercept("GET", "**/v3.1/all*", {
      statusCode: 500,
    });

    cy.intercept("GET", "**/countries.json", {
      fixture: "countries.json",
    });

    cy.visit("/");

    cy.contains("Country 0").should("exist");
  });

  it("shows error when both APIs fail", () => {
    cy.intercept("GET", "**/v3.1/all*", {
      statusCode: 500,
    });

    cy.intercept("GET", "**/countries.json", {
      statusCode: 500,
    });

    cy.visit("/");

    cy.contains(/error/i).should("exist");
  });

  // Accessibility test (cypress-axe)
  it("has no accessibility violations", () => {
    cy.contains("Country 0");

    cy.checkA11yPage();
  });
});
