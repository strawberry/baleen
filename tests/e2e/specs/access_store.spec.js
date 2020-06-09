// https://docs.cypress.io/api/introduction/api.html

describe('Shopify Store', () => {
    it('Can access the homepage', () => {
        cy.goTo('/');
        cy.url().should('contain', Cypress.config().baseUrl);
    });

    it('Can access /collections/all', () => {
        cy.goTo('/collections/all');
        cy.url().should('contain', '/collections/all');
    });
});
