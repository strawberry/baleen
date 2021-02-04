import { createLocalVue } from '@vue/test-utils';
import mockAxios from 'jest-mock-axios';
import VueRouter from 'vue-router';
import { shallowMount } from './utils/mount';
import CollectionProvider from '../../src/providers/CollectionProvider';

function createCollectionProviderWrapper(propsData = {}, otherData = {}) {
    const localVue = createLocalVue();
    localVue.use(VueRouter);
    const router = new VueRouter();

    return shallowMount(
        CollectionProvider,
        {
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

it(`Makes API requests if all products are not provided to the component on mount`, () => {
    createCollectionProviderWrapper({ productCount: 50 });

    expect(mockAxios.get).toHaveBeenCalledWith('/products.json', {
        params: { limit: 250, page: 1 },
    });
});
