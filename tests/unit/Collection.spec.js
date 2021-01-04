import { createLocalVue } from '@vue/test-utils';
import mockAxios from 'jest-mock-axios';
import VueRouter from 'vue-router';
import { shallowMount } from './utils/mount';
import Collection from '../../src/ProductList';
import LiquidProducts from './fixtures/LiquidProducts';
import Product from '../../src/Product';

function createCollectionWrapper(propsData = {}, otherData = {}) {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();

    return shallowMount(
        Collection,
        {
            products: LiquidProducts,
            productCount: 50,
            collection: {
                id: 0,
                handle: 'all',
                title: 'Products',
            },
            ...propsData,
        },
        {
            localVue,
            router,
            ...otherData,
        }
    );
}

afterEach(() => {
    mockAxios.reset();
});

describe('Collection', () => {
    // it('Receives products from initialProducts prop', () => {
    //     const wrapper = createCollectionWrapper();

    //     expect(wrapper.vm.initialProducts.length).toBe(50);
    //     expect(wrapper.vm.initialProducts).toBe(LiquidProducts);
    // });

    // it('Converts initialProducts into products', () => {
    //     const wrapper = createCollectionWrapper();

    //     expect(wrapper.vm.products.length).toBe(50);
    //     LiquidProducts.forEach((product, index) => {
    //         expect(wrapper.vm.products[index]).toStrictEqual(
    //             new Product(product)
    //         );
    //     });
    // });

    it(`Doesn't make API requests if all products are provided to the component on mount`, () => {
        createCollectionWrapper();

        expect(mockAxios.get).not.toHaveBeenCalled();
    });

    it(`Makes API requests if all products are not provided to the component on mount`, () => {
        createCollectionWrapper({ productCount: 500 });

        expect(mockAxios.get).toHaveBeenCalledWith('/products.json', {
            params: { limit: 250, page: 1 },
        });
        expect(mockAxios.get).toHaveBeenCalledWith('/products.json', {
            params: { limit: 250, page: 2 },
        });
    });

    // it('Applies filters from route on mount', () => {
    //     const router = new VueRouter();
    //     router.push({ query: { color: 'pink' } });
    //     const wrapper = createCollectionWrapper(
    //         {
    //             filterRules: [
    //                 {
    //                     name: 'Color',
    //                     sourceName: 'color',
    //                     sourceType: 'tag',
    //                     filterType: 'singular',
    //                 },
    //             ],
    //         },
    //         { router }
    //     );

    //     expect(wrapper.vm.appliedFilters).toStrictEqual({ color: ['pink'] });
    // });

    // it('Lists the correct products when page loads', () => {
    //     const itemsPerPage = 20;
    //     const wrapper = createCollectionWrapper({ itemsPerPage });
    //     expect(wrapper.vm.paginatedProducts).toStrictEqual(
    //         [...LiquidProducts]
    //             .slice(0, itemsPerPage)
    //             .map(product => new Product(product))
    //     );
    // });

    // it('Lists the correct products when page changes', () => {
    //     const itemsPerPage = 20;
    //     const wrapper = createCollectionWrapper({ itemsPerPage });
    //     wrapper.vm.changePage(2);
    //     expect(wrapper.vm.paginatedProducts).toStrictEqual(
    //         [...LiquidProducts]
    //             .slice(20, itemsPerPage + 20)
    //             .map(product => new Product(product))
    //     );
    // });

    // it('Lists the correct products when a filter is applied', () => {
    //     const wrapper = createCollectionWrapper({
    //         filterRules: [
    //             {
    //                 name: 'Color',
    //                 sourceName: 'color',
    //                 sourceType: 'tag',
    //                 filterType: 'singular',
    //             },
    //         ],
    //     });
    //     wrapper.vm.filters.getFilterById('color').selectValues('pink');
    //     const { filteredAndSortedProducts } = wrapper.vm;
    //     expect(filteredAndSortedProducts).toHaveLength(4);
    //     expect(filteredAndSortedProducts).toStrictEqual(
    //         LiquidProducts.filter(product =>
    //             product.tags.includes('color:pink')
    //         ).map(product => new Product(product))
    //     );
    // });

    // it('Applies "recommended" sort method by default', () => {
    //     const wrapper = createCollectionWrapper();
    //     expect(wrapper.vm.appliedSortMethod).toBe('recommended');
    // });

    // it('Updates the route when the sort method changes', async () => {
    //     const wrapper = createCollectionWrapper();
    //     await wrapper.setData({ appliedSortMethod: 'test-method' });

    //     expect(wrapper.vm.$route.query.sort).toBe('test-method');
    // });

    // it('Lists products in the correct order when a sort method is applied', async () => {
    //     const wrapper = createCollectionWrapper();
    //     await wrapper.setData({ appliedSortMethod: 'price-low-high' });

    //     expect(wrapper.vm.appliedSortMethod).toBe('price-low-high');
    //     expect(wrapper.vm.filteredAndSortedProducts).toStrictEqual(
    //         [...LiquidProducts]
    //             .sort((a, b) => a.price_min - b.price_min)
    //             .map(product => new Product(product))
    //     );
    // });

    // it('Supports custom sort methods', async () => {
    //     const wrapper = createCollectionWrapper({
    //         buildSortMethods: defaultSortMethods => [
    //             ...defaultSortMethods,
    //             {
    //                 id: 'id',
    //             },
    //         ],
    //     });

    //     expect(wrapper.vm.sortMethods.map(method => method.id)).toStrictEqual([
    //         'recommended',
    //         'price-high-low',
    //         'price-low-high',
    //         'id',
    //     ]);

    //     await wrapper.setData({ appliedSortMethod: 'id' });

    //     expect(wrapper.vm.appliedSortMethod).toBe('id');
    // });
});
