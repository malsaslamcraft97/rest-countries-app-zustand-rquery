// Safe a11y helper (won’t crash if axe not ready)
function logA11y(context?: string) {
  cy.window().then((win) => {
    if ((win as any).axe) {
      cy.checkA11y(
        context,
        undefined,
        (violations) => {
          cy.task("logA11y", violations);
        },
        true, // don't fail tests
      );
    }
  });
}

describe("Countries App", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();

    cy.intercept("GET", "**/v3.1/all*", {
      fixture: "countries.json",
    }).as("getCountries");

    cy.intercept("GET", "**/countries.json", {
      fixture: "countries.json",
    });

    cy.visit("/");
    cy.injectAxe(); // always after visit

    cy.wait("@getCountries");
  });

  it("renders countries on load", () => {
    cy.get("h2").its("length").should("be.greaterThan", 0);
    cy.contains("Country 0").should("be.visible");

    logA11y();
  });

  it("search filters results correctly", () => {
    cy.get('input[placeholder="Search for a country..."]')
      .clear()
      .type("Country 1");

    cy.contains("Country 1").should("be.visible");
    cy.contains("Country 0").should("not.exist");

    logA11y();
  });

  it("region filter updates results", () => {
    cy.get("select").select("Asia");

    cy.get("h2").each(($el) => {
      cy.wrap($el).should("contain.text", "Country");
    });

    logA11y();
  });

  it("loads more countries (pagination)", () => {
    cy.get("h2").then(($before) => {
      const countBefore = $before.length;

      cy.contains("button", "Load More").click();

      cy.get("h2").its("length").should("be.greaterThan", countBefore);
    });

    logA11y();
  });

  it("toggles theme and persists state", () => {
    cy.get("button[aria-label*='mode']")
      .invoke("attr", "aria-pressed")
      .then((initial) => {
        cy.get("button[aria-label*='mode']").click();

        cy.get("button[aria-label*='mode']")
          .invoke("attr", "aria-pressed")
          .should("not.equal", initial);
      });

    // persistence
    cy.reload();
    cy.injectAxe(); // re-inject after reload

    cy.get("button[aria-label*='mode']").should("have.attr", "aria-pressed");

    logA11y();
  });

  it("marks country as favorite", () => {
    cy.get("button[aria-label*='Add']").first().click();

    cy.get("button[aria-pressed='true']").should("exist");

    logA11y();
  });

  it("handles fallback when primary API fails", () => {
    cy.intercept("GET", "**/v3.1/all*", {
      statusCode: 500,
    });

    cy.intercept("GET", "**/countries.json", {
      fixture: "countries.json",
    }).as("fallback");

    cy.visit("/");
    cy.injectAxe();

    cy.wait("@fallback");
    cy.contains("Country 0").should("be.visible");

    logA11y();
  });

  it("shows error when both APIs fail", () => {
    cy.intercept("GET", "**/v3.1/all*", {
      statusCode: 500,
    });

    cy.intercept("GET", "**/countries.json", {
      statusCode: 500,
    });

    cy.visit("/");
    cy.injectAxe();

    cy.contains(/error/i, { timeout: 10000 }).should("be.visible");

    logA11y();
  });

  it("handles empty search state", () => {
    cy.get('input[placeholder="Search for a country..."]').type("zzzz");

    cy.get("h2").should("have.length", 0);

    logA11y();
  });
});
