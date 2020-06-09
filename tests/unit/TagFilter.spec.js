import Product from '../../src/Product';
import TagFilter from '../../src/filters/TagFilter';
import liquidProducts from './fixtures/LiquidProducts';
import jsonProducts from './fixtures/JSONProducts';

const jsonDummyProduct = jsonProducts[0];
const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new TagFilter({
        name: 'Color',
        sourceName: 'color',
        sourceType: 'tag',
        filterType: 'singular',
        ...filterRule,
    });

describe(TagFilter, () => {
    it(`uses ':' as a delimiter by default`, () => {
        expect(createFilter().delimiter).toBe(':');
    });

    it('applies the delimiter passed via the filterRule', () => {
        const filter = createFilter({ delimiter: '-' });
        expect(filter.delimiter).toBe('-');

        expect(
            filter.apply(new Product({ tags: ['color-pink'] }), {
                query: { color: 'pink' },
            })
        ).toBe(true);

        expect(
            filter.apply(new Product({ tags: ['color-pink'] }), {
                query: { color: 'yellow' },
            })
        ).toBe(false);
    });

    it.each`
        appliedValue | expectedResult
        ${'pink'}    | ${false}
        ${'brown'}   | ${true}
    `(
        `returns $expectedResult when {color: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { color: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );

    it.each`
        appliedValue | expectedResult
        ${'pink'}    | ${true}
        ${'brown'}   | ${false}
    `(
        `returns $expectedResult when {color: "$appliedValue"} is applied to ${jsonDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(jsonDummyProduct), {
                    query: { color: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
