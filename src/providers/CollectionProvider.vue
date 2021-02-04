<template>
    <div>
        <slot :products="products"></slot>
    </div>
</template>

<script>
import axios from 'axios';
import Product from '../Product';

export default {
    name: 'CollectionProvider',
    props: {
        /** @type {Vue.PropOptions<{}>} */
        collection: {
            required: true,
            type: Object,
        },
        productFetchLimit: {
            default: 250,
            type: Number,
        },
        productCount: {
            required: true,
            type: Number,
        },
    },
    data() {
        return {
            loading: true,
            products: [],
        };
    },
    methods: {
        /** @param {number} page */
        fetchProductsForPage(page) {
            const url =
                this.collection.id === 0
                    ? `/products.json`
                    : `/collections/${this.collection.handle}/products.json`;
            const params = { limit: this.productFetchLimit, page };

            return axios.get(url, { params });
        },

        fetchInitialProducts() {
            this.fetchProductsForPage(1).then(results => {
                const { products } = results.data;
                this.products = products.map(product => new Product(product));
                this.loading = false;
                this.fetchAllProducts();
            });
        },

        fetchAllProducts() {
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
    },
    mounted() {
        this.fetchInitialProducts();
    },
};
</script>
