import Product from '../../src/Product';
import TypeFilter from '../../src/filters/TypeFilter';
import liquidProducts from './fixtures/LiquidProducts';
import jsonProducts from './fixtures/JSONProducts';

const jsonDummyProduct = jsonProducts[0];
const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new TypeFilter({
        name: 'type',
        sourceName: 'type',
        sourceType: 'type',
        filterType: 'singular',
        ...filterRule,
    });

describe(TypeFilter, () => {
    it.each`
        appliedValue  | expectedResult
        ${'Psychic'}  | ${true}
        ${'Fighting'} | ${false}
    `(
        `returns $expectedResult when {type: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { type: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );

    it.each`
        appliedValue  | expectedResult
        ${'Psychic'}  | ${true}
        ${'Fighting'} | ${false}
    `(
        `returns $expectedResult when {type: "$appliedValue"} is applied to ${jsonDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(jsonDummyProduct), {
                    query: { type: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
