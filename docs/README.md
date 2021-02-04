# Baleen

## Installation
Assuming you're already using Vue, install this project and its dependencies:

Using Yarn, run:
```shell
$ yarn add @strawberrydigital/baleen vue-router axios
```

Or, using NPM:
```shell
$ npm install @strawberrydigital/baleen vue-router axios
```

**Note:** `vue-router` and `axios` are both peer dependencies of this project. You must install them yourself to avoid the risk of bundling multiple copies in your project.

## Getting Started

Baleen uses the Provider / Consumer pattern which allows you to create custom data providers. We have included a collection provider which uses the Shopify Storefront `/products.json` endpoint to retrieve the collection data.

### JS
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import CollectionProvider from '@strawberrydigital/baleen/src/providers/CollectionProvider';
import Baleen from '@strawberrydigital/baleen/src/ProductList'

Vue.use(VueRouter)

new Vue({
    el: '[data-collection]',
    components: { Baleen },
    delimiters: ['${', '}'],
    router: new VueRouter({ mode: 'history' })
})
```
### Liquid (templates/collection.liquid)
```html
{%- capture default_collection -%}
    {
        "id": 0,
        "handle": "all",
        "title": {{ collection.title | json }}
    }
{%- endcapture -%}

{%-
    liquid
    if collection.id
        assign collection_json = collection | json
    else
        assign collection_json = default_collection
    endif
    assign collection_json = collection_json | escape
-%}

{%- capture filter_rules -%}
    [
        {
            "name": "Color",
            "sourceName": "color",
            "sourceType": "tag",
            "filterType": "singular"
        }
    ]
{%- endcapture -%}


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
            {%- raw -%}
                <ul>
                    <li v-for="product in paginatedProducts" :key="product.id">
                        <a :href="product.url">
                            {{- product.title -}}
                        </a>
                    </li>
                </ul>
            {%- endraw -%}
        </ProductList>
    </template>
</CollectionProvider>
```
