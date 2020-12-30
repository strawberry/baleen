<template>
    <div>
        <slot
            :applied-filters="appliedFilters"
            :applied-sort-method="appliedSortMethod"
            :available-filters="availableFilters"
            :change-page="changePage"
            :change-sort-method="changeSortMethod"
            :current-page="currentPage"
            :filters="filters"
            :filtered-and-sorted-products="filteredAndSortedProducts"
            :paginated-products="paginatedProducts"
            :products="products"
            :sort-methods="sortMethods"
        />
    </div>
</template>

<script>
import FilterList from './filters/FilterList';

/** @typedef {import('vue-router').RawLocation} RawLocation */
/** @typedef {import('../types/Filters').FilterRule} FilterRule */
/** @typedef {import('../types/Shopify')} */

export default {
    props: {
        buildSortMethods: {
            default: sortMethods => sortMethods,
            type: Function,
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

        products: {
            required: true,
            type: Array,
        },
    },

    data() {
        return {
            appliedSortMethod: this.$route.query.sort || 'recommended',
            currentPage: Number(this.$route.query.page) || 1,
            filters: new FilterList(this.filterRules),
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
    },

    methods: {
        /** @param {string} sortId */
        changeSortMethod(sortId) {
            this.appliedSortMethod = sortId;
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
