/// <reference types="cypress" />

import "cypress-axe";

declare global {
  namespace Cypress {
    interface Chainable {
      checkA11yPage(): Chainable<void>;
    }
  }
}

Cypress.Commands.add("checkA11yPage", () => {
  cy.injectAxe();
  cy.checkA11y();
});

export {};
