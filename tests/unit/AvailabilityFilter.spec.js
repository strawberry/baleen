import Product from '../../src/Product';
import AvailabilityFilter from '../../src/filters/AvailabilityFilter';
import liquidProducts from './fixtures/LiquidProducts';

const liquidDummyProduct = liquidProducts[0];

const createFilter = (filterRule = {}) =>
    new AvailabilityFilter({
        name: 'Availability',
        sourceName: 'availability',
        sourceType: 'availability',
        filterType: 'OR',
        ...filterRule,
    });

describe(AvailabilityFilter, () => {
    it.each`
        appliedValue | expectedResult
        ${'true'}    | ${true}
        ${'false'}   | ${false}
    `(
        `returns $expectedResult when {availability: "$appliedValue"} is applied to ${liquidDummyProduct.title}`,
        ({ appliedValue, expectedResult }) => {
            const filter = createFilter();

            expect(
                filter.apply(new Product(liquidDummyProduct), {
                    query: { availability: appliedValue },
                })
            ).toBe(expectedResult);
        }
    );
});
