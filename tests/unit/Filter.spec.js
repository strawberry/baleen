import Filter from '../../src/filters/Filter';
import OptionFilter from '../../src/filters/OptionFilter';
import Product from '../../src/Product';
import TagFilter from '../../src/filters/TagFilter';
import jsonDummyProducts from './fixtures/JSONProducts';

const constructors = {
    option: OptionFilter,
    tag: TagFilter,
};

const filterRule = {
    name: 'Color',
    sourceName: 'color',
    /** @type {'tag'|'option'} */ sourceType: 'tag',
    filterType: 'OR',
};
const queries = [
    { color: ['yellow', 'pink'] },
    { color: ['pink', 'yellow'] },
    { color: 'pink' },
    { color: 'yellow' },
    {},
].map(query => ({ query }));

const createFilter = (options = {}) =>
    new constructors[filterRule.sourceType]({ ...filterRule, ...options });

const filter = new Filter(filterRule);
const products = jsonDummyProducts.map(product => new Product(product));

describe(Filter, () => {
    it('has the correct ignoresGlobalReset value', () => {
        expect(filter.ignoresGlobalReset).toBe(false);

        expect(
            new Filter({ ...filterRule, ignoresGlobalReset: false })
                .ignoresGlobalReset
        ).toBe(false);

        expect(
            new Filter({ ...filterRule, ignoresGlobalReset: true })
                .ignoresGlobalReset
        ).toBe(true);
    });

    it('has the correct id', () => {
        expect(filter.id).toBe(filterRule.sourceName);
    });

    it('has the correct name', () => {
        expect(filter.name).toBe(filterRule.name);
    });

    it('has the correct type', () => {
        expect(filter.type).toBe(filterRule.filterType);
    });

    it('should throw an error', () => {
        expect(() =>
            new Filter(filterRule).applyValueToProduct(products[0], 'green')
        ).toThrow(
            `${filterRule.name} filter is missing an "getPossibleValuesFromProduct" method`
        );
    });

    it('correctly reports if it is active', () => {
        const expectedResults = [true, true, true, true, false];
        queries.forEach((query, index) => {
            expect(filter.isActive(query)).toBe(expectedResults[index]);
        });
    });

    it('returns all available values and the number of times they occur', () => {
        expect(createFilter().getAvailableValues(products)).toStrictEqual([
            {
                id: 'pink',
                count: 6,
            },
            {
                id: 'purple',
                count: 6,
            },
            {
                id: 'brown',
                count: 12,
            },
            {
                id: 'blue',
                count: 11,
            },
            {
                id: 'yellow',
                count: 5,
            },
            {
                id: 'black',
                count: 1,
            },
            {
                id: 'red',
                count: 6,
            },
            {
                id: 'green',
                count: 1,
            },
            {
                id: 'gray',
                count: 2,
            },
        ]);
    });

    it("passes a product if the query doesn't contain any values to apply", () => {
        expect(createFilter().apply(jsonDummyProducts[0], { query: {} })).toBe(
            true
        );
    });

    describe('singular filters', () => {
        it('pass the correct products', () => {
            expect(
                createFilter({ filterType: 'singular' }).apply(
                    products[0],
                    queries[0]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'singular' }).apply(
                    products[0],
                    queries[1]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'singular' }).apply(
                    products[0],
                    queries[2]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'singular' }).apply(
                    products[0],
                    queries[3]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'singular' }).apply(
                    products[0],
                    queries[4]
                )
            ).toBe(true);
        });

        it('lists all applied values', () => {
            const expectedResults = ['yellow', 'pink', 'pink', 'yellow'];
            queries.forEach(({ query }, index) => {
                const appliableFilter = createFilter({
                    filterType: 'singular',
                });
                // Check no filters are applied at the start
                expect(appliableFilter.selectedValues).toStrictEqual([]);

                appliableFilter.selectValues(query.color);
                expect(appliableFilter.selectedValues).toStrictEqual([
                    expectedResults[index],
                ]);
            });
        });

        it('removes values correctly', () => {
            const cases = [
                ['yellow', 'yellow', []],
                ['pink', 'pink', []],
            ];
            cases.forEach(([valuesToApply, valueToRemove, expectedResult]) => {
                const appliableFilter = createFilter({
                    filterType: 'singular',
                });
                appliableFilter.selectValues(valuesToApply);
                appliableFilter.removeValue(valueToRemove);
                expect(appliableFilter.selectedValues).toStrictEqual(
                    expectedResult
                );
            });
        });
    });

    describe('OR filters', () => {
        it('pass the correct products', () => {
            expect(
                createFilter({ filterType: 'OR' }).apply(
                    products[0],
                    queries[0]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'OR' }).apply(
                    products[0],
                    queries[1]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'OR' }).apply(
                    products[0],
                    queries[2]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'OR' }).apply(
                    products[0],
                    queries[3]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'OR' }).apply(
                    products[0],
                    queries[4]
                )
            ).toBe(true);
        });

        it('lists all applied values', () => {
            const expectedResults = [
                ['yellow', 'pink'],
                ['pink', 'yellow'],
                'pink',
                'yellow',
            ];
            queries.forEach(({ query }, index) => {
                const appliableFilter = createFilter({ filterType: 'OR' });
                // Check no filters are applied at the start
                expect(appliableFilter.selectedValues).toStrictEqual([]);

                appliableFilter.selectValues(query.color);
                expect(appliableFilter.selectedValues).toStrictEqual(
                    [expectedResults[index]].flat()
                );
            });
        });

        it('removes values correctly', () => {
            const cases = [
                ['yellow', 'yellow', []],
                ['pink', 'pink', []],
                [['yellow', 'pink'], 'yellow', ['pink']],
                [['pink', 'yellow'], 'yellow', ['pink']],
            ];

            cases.forEach(([valuesToApply, valuesToRemove, expectedResult]) => {
                const appliableFilter = createFilter({ filterType: 'OR' });
                appliableFilter.selectValues(valuesToApply);

                appliableFilter.removeValue(valuesToRemove);
                expect(appliableFilter.selectedValues).toStrictEqual(
                    expectedResult
                );
            });
        });
    });

    describe('AND filters', () => {
        it('pass the correct products', () => {
            expect(
                createFilter({ filterType: 'AND' }).apply(
                    products[0],
                    queries[0]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'AND' }).apply(
                    products[0],
                    queries[1]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'AND' }).apply(
                    products[0],
                    queries[2]
                )
            ).toBe(true);
            expect(
                createFilter({ filterType: 'AND' }).apply(
                    products[0],
                    queries[3]
                )
            ).toBe(false);
            expect(
                createFilter({ filterType: 'AND' }).apply(
                    products[0],
                    queries[4]
                )
            ).toBe(true);
        });

        it('lists all applied values', () => {
            const expectedResults = [
                ['yellow', 'pink'],
                ['pink', 'yellow'],
                'pink',
                'yellow',
            ];
            queries.forEach(({ query }, index) => {
                const appliableFilter = createFilter({ filterType: 'AND' });
                // Check no filters are applied at the start
                expect(appliableFilter.selectedValues).toStrictEqual([]);

                appliableFilter.selectValues(query.color);
                expect(appliableFilter.selectedValues).toStrictEqual(
                    [expectedResults[index]].flat()
                );
            });
        });

        it('removes values correctly', () => {
            const cases = [
                ['yellow', 'yellow', []],
                ['pink', 'pink', []],
                [['yellow', 'pink'], 'yellow', ['pink']],
                [['pink', 'yellow'], 'yellow', ['pink']],
            ];

            cases.forEach(([valuesToApply, valuesToRemove, expectedResult]) => {
                const appliableFilter = createFilter({ filterType: 'AND' });
                appliableFilter.selectValues(valuesToApply);

                appliableFilter.removeValue(valuesToRemove);
                expect(appliableFilter.selectedValues).toStrictEqual(
                    expectedResult
                );
            });
        });
    });
});
