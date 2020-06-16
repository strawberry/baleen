<template>
    <div>
        <slot
            :applied-filters="appliedFilters"
            :applied-sort-method="appliedSortMethod"
            :available-filters="availableFilters"
            :change-sort-method="changeSortMethod"
            :filters="filters"
            :filtered-and-sorted-products="filteredAndSortedProducts"
            :paginated-products="paginatedProducts"
            :products="products"
            :sort-methods="sortMethods"
        />
    </div>
</template>

<script>
import axios from 'axios';
import FilterList from './filters/FilterList';
import Product from './Product';

/** @typedef {import('vue-router').RawLocation} RawLocation */
/** @typedef {import('../types/Filters').FilterRule} FilterRule */
/** @typedef {import('../types/Shopify')} */

export default {
    props: {
        buildSortMethods: {
            default: sortMethods => sortMethods,
            type: Function,
        },

        /** @type {Vue.PropOptions<{}>} */
        collection: {
            required: true,
            type: Object,
        },

        /** @type {Vue.PropOptions<FilterRule[]>} */
        filterRules: {
            default: () => [],
            type: Array,
        },

        /** @type {Vue.PropOptions<Shopify.Product[]>} */
        initialProducts: {
            default: () => [],
            type: Array,
        },

        itemsPerPage: {
            default: Infinity,
            type: Number,
        },

        productCount: {
            required: true,
            type: Number,
        },

        productFetchLimit: {
            default: 250,
            type: Number,
        },
    },

    data() {
        return {
            appliedSortMethod: this.$route.query.sort || 'recommended',
            currentPage: Number(this.$route.query.page) || 1,
            filters: new FilterList(this.filterRules),
            products: this.initialProducts.map(
                (product, index) => new Product(product, index)
            ),
            sortMethods: this.buildSortMethods([
                {
                    label: 'Recommended',
                    id: 'recommended',
                },
                {
                    label: 'Price (High to Low)',
                    id: 'price-high-low',
                    method: (a, b) => b.minimumPrice - a.minimumPrice,
                },
                {
                    label: 'Price (Low to High)',
                    id: 'price-low-high',
                    method: (a, b) => a.minimumPrice - b.minimumPrice,
                },
            ]),
        };
    },

    computed: {
        appliedFilters() {
            return this.filters.appliedValues;
        },

        availableFilters() {
            return this.filters
                .availableFilters(this.products)
                .filter(filter => filter.id !== 'category');
        },

        /** @returns {Product[]} */
        filteredAndSortedProducts() {
            let products = this.products.filter(product =>
                this.filters.apply(product, this.$route)
            );

            if (
                this.appliedSortMethod &&
                this.isValidSortMethod(this.appliedSortMethod)
            ) {
                const sortMethod = this.sortMethods.find(
                    method => method.id === this.appliedSortMethod
                );
                if (sortMethod.method) {
                    products = products.sort(sortMethod.method);
                }
            }

            return products;
        },

        hasAllCollectionProducts() {
            return this.products
                ? this.products.length === this.productCount
                : false;
        },

        /** @returns {Product[]} */
        paginatedProducts() {
            if (this.itemsPerPage === Infinity) {
                return this.filteredAndSortedProducts;
            }

            const offset = (this.currentPage - 1) * this.itemsPerPage;

            return this.filteredAndSortedProducts.slice(
                offset,
                offset + this.itemsPerPage
            );
        },

        /** @returns {string[]} */
        protectedURLParameters() {
            return ['page', 'sort', ...this.filters.ids];
        },
    },

    mounted() {
        this.filters.applyFiltersFromObject(this.getAppliedFiltersFromRoute());

        if (this.hasAllCollectionProducts) {
            return;
        }

        this.fetchProducts();
    },

    methods: {
        changeSortMethod(event) {
            this.appliedSortMethod = event.target.value;
        },

        /** @param {number=1} page */
        changePage(page = 1) {
            this.currentPage = page;

            const { q, ...unrelatedParameters } = Object.fromEntries(
                Object.entries(this.$route.query).filter(
                    ([key]) => !this.protectedURLParameters.includes(key)
                )
            );

            const query = {
                q,
                page: this.currentPage,
                sort: this.appliedSortMethod,
                ...this.appliedFilters,
                ...unrelatedParameters,
            };

            this.handleRouteUpdate(
                { query },
                () => null,
                () => null
            );
        },

        fetchProducts() {
            const totalPages = Math.ceil(
                this.productCount / this.productFetchLimit
            );

            const pageRequests = new Array(totalPages)
                .fill(null)
                .map((page, index) =>
                    this.fetchProductsForPage(index + 1, totalPages)
                );

            Promise.all(pageRequests)
                .then(results =>
                    results.flatMap(result => result.data.products)
                )
                .then(products => {
                    this.products = products.map(
                        product => new Product(product)
                    );
                });
        },

        /** @param {number} page */
        fetchProductsForPage(page) {
            const url =
                this.collection.id === 0
                    ? `/products.json`
                    : `/collections/${this.collection.handle}/products.json`;
            const params = { limit: this.productFetchLimit, page };

            return axios.get(url, { params });
        },

        /** @returns {{[key: string]: (string | string[])}} */
        getAppliedFiltersFromRoute() {
            return Object.fromEntries(
                Object.entries(this.$route.query).filter(([key]) =>
                    this.filters.ids.includes(key)
                )
            );
        },

        /**
         * @param {RawLocation} location
         * @param {function} successCallback
         * @param {function} errorCallback
         */
        handleRouteUpdate(location, successCallback, errorCallback) {
            this.$router.push(location, successCallback, errorCallback);
        },

        /**
         * @param {string} methodId
         * @returns {boolean}
         */
        isValidSortMethod(methodId) {
            return this.sortMethods.some(method => method.id === methodId);
        },

        resetProducts() {
            this.products = this.initialProducts.map(
                product => new Product(product)
            );
        },
    },

    watch: {
        appliedFilters() {
            this.changePage();
        },

        appliedSortMethod() {
            this.changePage();
        },
    },
};
</script>
