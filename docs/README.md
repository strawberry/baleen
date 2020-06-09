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
### JS
```js
import Vue from 'vue'
import VueRouter from 'vue-router'
import Baleen from '@strawberrydigital/baleen'

Vue.use(VueRouter)

new Vue({
    el: '[data-collection]',
    components: { Baleen },
    delimiters: ['${', '}'],
    router: new VueRouter()
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

<Baleen
    :collection="{{ collection_json }}"
    :filter-rules="{{ filter_rules | escape }}"
    :initial-products="{{ collection.products | json | escape }}"
    :product-count="{{ collection.products_count }}"
    v-slot="{
        appliedSortMethod,
        availableFilters,
        changeSortMethod,
        filters,
        paginatedProducts,
        products,
        sortMethods
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
</Baleen>
```
