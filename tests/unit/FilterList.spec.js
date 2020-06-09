import FilterList from '../../src/filters/FilterList';
import OptionFilter from '../../src/filters/OptionFilter';
import Product from '../../src/Product';
import TagFilter from '../../src/filters/TagFilter';
import jsonDummyProducts from './fixtures/JSONProducts';

const constructors = {
    option: OptionFilter,
    tag: TagFilter,
};
const filterRules = [
    {
        name: 'Color',
        sourceName: 'color',
        sourceType: 'tag',
        filterType: 'singular',
    },
    {
        name: 'Type',
        sourceName: 'type',
        sourceType: 'tag',
        filterType: 'AND',
    },
    {
        name: 'Ability',
        sourceName: 'ability',
        sourceType: 'tag',
        filterType: 'OR',
    },
    {
        name: 'Gender',
        sourceName: 'gender',
        sourceType: 'option',
        filterType: 'OR',
    },
];
const products = jsonDummyProducts.map(product => new Product(product));

const createFilterList = (extraFilterRules = []) =>
    new FilterList([...filterRules, ...extraFilterRules]);

describe(FilterList, () => {
    it('has a list of all filters', () => {
        const filterList = createFilterList();

        expect(filterList.filters.length).toBe(4);
        filterList.filters.forEach((filter, index) => {
            const filterRule = filterRules[index];
            expect(filter).toStrictEqual(
                new constructors[filterRule.sourceType](filterRule)
            );
        });
    });

    it('has a list of active filters in a given route', () => {
        const filterList = createFilterList();
        const cases = [
            [{ color: 'pink' }, ['color']],
            [{ color: ['pink', 'yellow'] }, ['color']],
            [
                {
                    color: ['pink', 'yellow'],
                    type: ['water', 'grass'],
                    gender: 'female',
                },
                ['color', 'type', 'gender'],
            ],
        ];

        cases.forEach(([query, expectedResults]) => {
            expect(filterList.active({ query })).toStrictEqual(
                expectedResults.map(result => {
                    const filterRule = filterRules.find(
                        rule => rule.sourceName === result
                    );

                    return new constructors[filterRule.sourceType](filterRule);
                })
            );
        });
    });

    it('returns a map of applied filter values in a given route', () => {
        const filterList = createFilterList();
        const cases = [
            [{ color: 'pink' }, { color: ['pink'] }],
            [{ color: ['pink', 'yellow'] }, { color: ['pink'] }],
            [
                {
                    color: ['pink', 'yellow'],
                    type: ['water', 'grass'],
                    gender: 'female',
                },
                {
                    color: ['pink'],
                    type: ['water', 'grass'],
                    gender: ['female'],
                },
            ],
        ];

        cases.forEach(([query, expectedResult]) => {
            filterList.applyFiltersFromObject(query);
            expect(filterList.appliedValues).toStrictEqual(expectedResult);
        });
    });

    it('correctly applies filters to a given list of products', () => {
        function matchProductAgainstQuery(product, query) {
            return Object.entries(query).every(([key, value]) => {
                const filterRule = filterRules.find(
                    rule => rule.sourceName === key
                );
                let matcher;
                const arrayMethod = {
                    AND: 'every',
                    OR: 'some',
                    singular: 'every',
                }[filterRule.filterType];

                let values = [value].flat();
                if (filterRule.filterType === 'singular') {
                    values = [values[0]];
                }

                if (filterRule.sourceType === 'tag') {
                    matcher = tag => product.tags.includes(`${key}:${tag}`);
                } else if (filterRule.sourceType === 'option') {
                    const optionPosition = product.options.find(
                        option => option.name === key
                    ).position;
                    matcher = option =>
                        product.variants.some(variant =>
                            variant[`option${optionPosition}`].values.includes(
                                option
                            )
                        );
                }

                return values[arrayMethod](matcher);
            });
        }

        const cases = [
            { color: 'pink' },
            { color: ['pink', 'yellow'] },
            {
                color: ['pink', 'yellow'],
                type: ['water', 'grass'],
                gender: 'female',
            },
        ];
        const filterList = createFilterList();

        cases.forEach(query => {
            /** @type {Product[]} */ const filteredProducts = products.filter(
                product => filterList.apply(product, { query })
            );
            expect(
                filteredProducts.every(product =>
                    matchProductAgainstQuery(product, query)
                )
            ).toBe(true);
        });
    });

    it('correctly removes all applied filters', () => {
        const query = {
            color: ['pink', 'yellow'],
            type: ['water', 'grass'],
            gender: 'female',
        };

        const filterList = createFilterList();
        filterList.applyFiltersFromObject(query);
        filterList.removeAllFilters();

        expect(filterList.appliedValues).toStrictEqual({});
    });

    it('correctly removes all applied filters except those that ignore global reset', () => {
        const query = {
            color: ['pink', 'yellow'],
            type: ['water', 'grass'],
            gender: 'female',
            shiny: 'Shiny',
        };

        const filterList = createFilterList([
            {
                name: 'Shiny',
                sourceName: 'shiny',
                sourceType: 'option',
                filterType: 'OR',
                ignoresGlobalReset: true,
            },
        ]);
        filterList.applyFiltersFromObject(query);
        filterList.removeAllFilters();

        expect(filterList.appliedValues).toStrictEqual({ shiny: ['Shiny'] });
    });

    it('lists only filters for which values are available', () => {
        const filterList = createFilterList([
            {
                name: 'Size',
                sourceName: 'size',
                sourceType: 'option',
                filterType: 'OR',
                ignoresGlobalReset: true,
            },
        ]);
        const expectedResults = {
            color: true,
            type: true,
            ability: true,
            gender: true,
            size: false,
        };

        const availableFilters = filterList.availableFilters(products);
        Object.entries(expectedResults).forEach(([key, expectedResult]) => {
            expect(availableFilters.some(filter => filter.id === key)).toBe(
                expectedResult
            );
        });
    });
});
