import Product from '../../src/Product';
import StockFilter from '../../src/filters/StockFilter';
import liquidProducts from './fixtures/LiquidProducts';

const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new StockFilter({
        name: 'Stock',
        sourceName: 'stock',
        sourceType: 'stock',
        filterType: 'singular',
        ...filterRule,
    });

describe(StockFilter, () => {
    it.each`
        appliedValue | expectedResult
        ${'true'}    | ${true}
        ${'false'}   | ${false}
    `(
        `returns $expectedResult when {stock: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { stock: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
