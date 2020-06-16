const selectors = {
    filterItem: '[data-cy="filter-item"]',
    filterItemValue: (filter, value) => `[data-cy-value="${filter}-${value}"]`,
    nextPage: '[data-cy="next-page"]',
    previousPage: '[data-cy="previous-page"]',
    productItem: '[data-cy="product-item"]',
    sortSelect: '[data-cy="sort-select"]',
};

describe('Collection Component', () => {
    it('Initially lists 50 products', () => {
        /** API requests must be delayed so that the assertion(s) can run before they respond */
        cy.server();
        cy.route({ url: '/products.json*', delay: 5000 });
        cy.goTo('/collections/all');
        cy.get(selectors.productItem).should('have.length', 50);
    });

    it('Loads all products after component mounts', () => {
        cy.goTo('/collections/all');
        cy.get(selectors.productItem).should('have.length', 151);
    });

    it('Applies filters from the URL on page load', () => {
        cy.goTo('/collections/all?color=pink');
        cy.get(selectors.productItem).should('have.length', 12);
    });

    [
        ['color', ['red'], 16],
        ['color', ['blue'], 25],
        ['color', ['yellow'], 19],
        ['type', ['Grass'], 1],
        ['type', ['Grass', 'Fire'], 11],
        ['type', ['Grass', 'Fire', 'Water'], 29],
        ['egg-group', ['water1'], 22],
        ['egg-group', ['water1', 'dragon'], 5],
        ['egg-group', ['water1', 'water3', 'dragon'], 0],
    ].forEach(([filter, values, expectedLength]) => {
        it(`Correctly applies the ${filter} filter when the [${values}] inputs are activated`, () => {
            const selector = values
                .map(value => selectors.filterItemValue(filter, value))
                .join(', ');
            const urlQuery = values
                .map(value => `${filter}=${value}`)
                .join('&');

            cy.goTo('/collections/all');
            cy.wait(500); // Wait for products to be fetched

            cy.get(selectors.filterItem)
                .get(selector)
                .click({ multiple: true });
            cy.location().should('be', `/collections/all?${urlQuery}`);
            cy.get(selectors.productItem).should('have.length', expectedLength);
        });
    });

    it('Has recommended sort method by default', () => {
        cy.goTo('/collections/all');
        cy.get(selectors.sortSelect).should('have.value', 'recommended');
    });

    it('Correctly applies sort methods', () => {
        cy.goTo('/collections/electric');

        cy.get(selectors.productItem)
            .then(elements => [...elements].map(element => element.innerText))
            .then(defaultOrder => {
                [
                    [
                        'price-high-low',
                        [
                            'Zapdos',
                            'Jolteon',
                            'Electabuzz',
                            'Electrode',
                            'Raichu',
                            'Magneton',
                            'Voltorb',
                            'Magnemite',
                            'Pikachu',
                        ],
                    ],
                    [
                        'price-low-high',
                        [
                            'Pikachu',
                            'Magnemite',
                            'Voltorb',
                            'Magneton',
                            'Raichu',
                            'Electabuzz',
                            'Electrode',
                            'Jolteon',
                            'Zapdos',
                        ],
                    ],
                    ['recommended', defaultOrder],
                ].forEach(([sortMethod, expectedResult]) => {
                    cy.get(selectors.sortSelect).select(sortMethod);
                    cy.location().should(
                        'be',
                        `/collections/all?sort=${sortMethod}`
                    );
                    cy.get(selectors.productItem).then(elements => {
                        const productTitles = [...elements].map(
                            element => element.innerText
                        );
                        cy.wrap(productTitles).should(
                            'deep.equal',
                            expectedResult
                        );
                    });
                });
            });
    });

    it('Supports custom sort methods', () => {
        cy.goTo('/collections/electric');

        cy.get(selectors.sortSelect).select('id');
        cy.location().should('be', `/collections/all?sort=id`);
        cy.get(selectors.productItem).then(elements => {
            const productTitles = [...elements].map(
                element => element.innerText
            );
            cy.wrap(productTitles).should('deep.equal', [
                'Pikachu',
                'Raichu',
                'Magnemite',
                'Magneton',
                'Voltorb',
                'Electrode',
                'Electabuzz',
                'Jolteon',
                'Zapdos',
            ]);
        });
    });

    it('Responds to page changes', () => {
        cy.goTo('/collections/water');

        cy.get(selectors.productItem).should('have.length', 3);
        cy.get(selectors.nextPage).click();
        cy.location().should('be', '/collections/water?page=2');

        cy.get(selectors.previousPage).click();
        cy.location().should('be', '/collections/water?page=1');
    });
});
