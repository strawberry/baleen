import Product from '../../src/Product';
import VendorFilter from '../../src/filters/VendorFilter';
import liquidProducts from './fixtures/LiquidProducts';
import jsonProducts from './fixtures/JSONProducts';

const jsonDummyProduct = jsonProducts[0];
const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new VendorFilter({
        name: 'vendor',
        sourceName: 'vendor',
        sourceType: 'vendor',
        filterType: 'singular',
        ...filterRule,
    });

describe(VendorFilter, () => {
    it.each`
        appliedValue | expectedResult
        ${'Kanto'}   | ${true}
        ${'Johto'}   | ${false}
    `(
        `returns $expectedResult when {vendor: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { vendor: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );

    it.each`
        appliedValue | expectedResult
        ${'Kanto'}   | ${true}
        ${'Johto'}   | ${false}
    `(
        `returns $expectedResult when {vendor: "$appliedValue"} is applied to ${jsonDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(jsonDummyProduct), {
                    query: { vendor: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
