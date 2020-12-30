<template>
    <CollectionProvider
        :collection="collection"
        :product-fetch-limit="productFetchLimit"
        :product-count="productCount"
    >
        <template v-slot="{ products }">
            <ProductList
                :build-sort-methods="buildSortMethods"
                :filter-rules="filterRules"
                :products="products"
                v-slot="{
                    appliedSortMethod,
                    availableFilters,
                    changePage,
                    changeSortMethod,
                    currentPage,
                    filteredAndSortedProducts,
                    filters,
                    paginatedProducts,
                    sortMethods,
                }"
            >
                <button
                    v-if="
                        currentPage <
                        Math.ceil(filteredAndSortedProducts.length / 3)
                    "
                    @click="changePage(currentPage + 1)"
                    data-cy="next-page"
                >
                    Next Page
                </button>
                <button
                    v-if="currentPage > 1"
                    @click="changePage(currentPage - 1)"
                    data-cy="previous-page"
                >
                    Previous Page
                </button>

                <label for="sort">
                    Sort
                </label>
                <select
                    @input="event => changeSortMethod(event.target.value)"
                    name="sort"
                    id="sort"
                    data-cy="sort-select"
                >
                    <option
                        v-for="method in sortMethods"
                        :key="method.id"
                        :value="method.id"
                    >
                        {{ method.label }}
                    </option>
                </select>

                <ul
                    style="
                        display: flex;
                        list-style-type: none;
                        margin: 0 -30px;
                        padding: 0 30px;
                    "
                >
                    <li
                        v-for="filter in availableFilters"
                        :key="filter.id"
                        style="padding: 0 15px;"
                    >
                        <strong>{{ filter.name }}</strong>
                        <ul style="padding: 0;">
                            <li
                                v-for="value in filter.getAvailableValues(
                                    products
                                )"
                                :key="value.id"
                                style="display: flex;"
                            >
                                <label
                                    :for="`filter-${filter.id}`"
                                    style="flex-grow: 1;"
                                >
                                    {{ value.id }}
                                </label>
                                <input
                                    v-model="filter.selectedValues"
                                    :name="`filter-${filter.id}`"
                                    :id="`filter-${filter.id}`"
                                    :value="value.id"
                                    type="checkbox"
                                    data-cy="filter-item"
                                    :data-cy-value="`${filter.id}-${value.id}`"
                                />
                            </li>
                        </ul>
                    </li>
                </ul>

                <ol style="padding-left: 30px;">
                    <li
                        v-for="product in paginatedProducts"
                        :key="product.id"
                        data-cy="product-item"
                    >
                        {{ product.title }}
                    </li>
                </ol>
            </ProductList>
        </template>
    </CollectionProvider>
</template>

<script>
import CollectionProvider from '../../../../../src/providers/CollectionProvider';
import ProductList from '../../../../../src/ProductList';

export default {
    components: { CollectionProvider, ProductList },
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
        productFetchLimit: {
            default: 50,
            type: Number,
        },
        productCount: {
            required: true,
            type: Number,
        },
        /** @type {Vue.PropOptions<FilterRule[]>} */
        filterRules: {
            default: () => [],
            type: Array,
        },
    },
};
</script>

<style></style>
