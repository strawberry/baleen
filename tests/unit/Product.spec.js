import Product from '../../src/Product';
import jsonDummyProducts from './fixtures/JSONProducts';
import liquidDummyProducts from './fixtures/LiquidProducts';

const jsonDummyProduct = jsonDummyProducts[0];
const liquidDummyProduct = liquidDummyProducts[0];

const jsonProduct = new Product(jsonDummyProduct);
const liquidProduct = new Product(liquidDummyProduct);

describe(Product, () => {
    it('creates instance of Product', () => {
        expect(liquidProduct).toBeInstanceOf(Product);
        expect(jsonProduct).toBeInstanceOf(Product);
    });

    describe('getters', () => {
        it('has the correct handle', () => {
            expect(jsonProduct.handle).toBe(jsonDummyProduct.handle);

            expect(liquidProduct.handle).toBe(liquidDummyProduct.handle);
        });

        it('has the correct title', () => {
            expect(jsonProduct.title).toBe(jsonDummyProduct.title);

            expect(liquidProduct.title).toBe(liquidDummyProduct.title);
        });

        it('has the correct id', () => {
            expect(jsonProduct.id).toBe(jsonDummyProduct.id);

            expect(liquidProduct.id).toBe(liquidDummyProduct.id);
        });

        it('has the correct tags', () => {
            expect(jsonProduct.tags).toStrictEqual(jsonDummyProduct.tags);

            expect(liquidProduct.tags).toStrictEqual(liquidDummyProduct.tags);
        });

        it('has the correct url', () => {
            expect(jsonProduct.url).toBe(`/products/${jsonProduct.handle}`);

            expect(liquidProduct.url).toBe(`/products/${liquidProduct.handle}`);
        });

        it('has the correct images', () => {
            expect(jsonProduct.images).toStrictEqual(jsonDummyProduct.images);

            expect(liquidProduct.images).toStrictEqual(
                liquidDummyProduct.images.map(src => ({ src }))
            );
        });

        test.todo('has the correct featured image');

        it('has the correct variants', () => {
            expect(jsonProduct.variants).toStrictEqual(
                jsonDummyProduct.variants
            );

            expect(liquidProduct.variants).toStrictEqual(
                liquidDummyProduct.variants
            );
        });

        it('has the correct options', () => {
            expect(jsonProduct.options).toStrictEqual(jsonDummyProduct.options);

            expect(liquidProduct.options).toStrictEqual([
                {
                    name: 'Gender',
                    position: 1,
                    values: ['Male', 'Female'],
                },
                {
                    name: 'Shiny',
                    position: 2,
                    values: ['Normal', 'Shiny'],
                },
            ]);
        });

        it('has an array of all variant prices', () => {
            expect(jsonProduct.prices).toStrictEqual([10000, 17500]);

            expect(liquidProduct.prices).toStrictEqual([
                5167,
                9042,
                5167,
                9042,
            ]);
        });

        it('returns the lowest price', () => {
            expect(jsonProduct.minimumPrice).toBe(10000);

            expect(liquidProduct.minimumPrice).toBe(5167);
        });

        it('returns the lowest variant price', () => {
            expect(jsonProduct.price).toBe(10000);

            expect(liquidProduct.price).toBe(5167);
        });

        it('returns the lowest variant compare at price', () => {
            expect(jsonProduct.compareAtPrice).toBe(12000);

            expect(liquidProduct.compareAtPrice).toBe(6200);
        });
    });

    describe('methods', () => {
        it('prepends a collection route to the url', () => {
            expect(jsonProduct.getUrlWithinCollection('collection')).toBe(
                `/collections/collection/products/${jsonProduct.handle}`
            );

            expect(liquidProduct.getUrlWithinCollection('collection')).toBe(
                `/collections/collection/products/${liquidProduct.handle}`
            );
        });

        it('returns product.url if no collection is passed', () => {
            expect(jsonProduct.getUrlWithinCollection()).toBe(jsonProduct.url);

            expect(liquidProduct.getUrlWithinCollection()).toBe(
                liquidProduct.url
            );
        });
    });
});
