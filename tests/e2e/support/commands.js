// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This is will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add('goTo', location => {
    cy.visit(location);
    cy.location('pathname').then(pathname => {
        if (pathname === '/password') {
            cy.get('[data-cy="modal-toggle"]').click();
            cy.get('[data-cy="store-password-input"]').type(
                Cypress.env('STORE_PASSWORD')
            );
            cy.get('[data-cy="login-form"]').submit();

            cy.visit(location);
        }
    });
});
