import Product from '../../src/Product';
import OptionFilter from '../../src/filters/OptionFilter';
import liquidProducts from './fixtures/LiquidProducts';
import jsonProducts from './fixtures/JSONProducts';

const jsonDummyProduct = jsonProducts[0];
const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new OptionFilter({
        name: 'Gender',
        sourceName: 'gender',
        sourceType: 'option',
        filterType: 'singular',
        ...filterRule,
    });

describe(OptionFilter, () => {
    it.each`
        appliedValue | expectedResult
        ${'Male'}    | ${true}
        ${'Female'}  | ${true}
        ${'Default'} | ${false}
    `(
        `returns $expectedResult when {gender: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { gender: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );

    it.each`
        appliedValue | expectedResult
        ${'Male'}    | ${false}
        ${'Female'}  | ${false}
        ${'Default'} | ${true}
    `(
        `returns $expectedResult when {gender: "$appliedValue"} is applied to ${jsonDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(jsonDummyProduct), {
                    query: { gender: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
