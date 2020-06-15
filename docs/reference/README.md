# Reference

[[toc]]

## Props
The following props are accepted by the component:

| Prop              | Type                    | Required | Default  |
| ----------------- | ----------------------- | -------- | -------- |
| collection        | CollectionDrop (Liquid) | True     |          |
| filterRules       | FilterRule[]            | False    | []       |
| initialProducts   | ProductDrop[] (Liquid)  | False    | []       |
| itemsPerPage      | Number                  | False    | Infinity |
| productCount      | Number                  | True     |          |
| productFetchLimit | Number                  | False    | 250      |

### collection
Describes the collection to be fetched. At a minimum should contain the following keys:
id, handle. If `collection.id` is 0, products will be requested from `/products.json`.

### filterRules
These determine which filters will be used by the component. They must contain the following keys: id, sourceName, sourceType and filterType.

* `id` determines the key used by the URL parameters. For example `id: color` would apply the `blue` value to the URL like so `?color=blue`.
* `sourceName` determines the name of either the variant option or the tag prefix used for the filter. For example `sourceName: Size` could apply values against variant options named "Size", or product tags beginning with `Size`.
* `sourceType` supports the values: `option` and `tag`. This determines whether the filter should apply values against variant options or product tags.
* `filterType` can have values `singular`, `AND` or `OR`. A `singular` filter will only apply the first value given by the URL parameters. An `AND` filter will only pass products who match all values passed to the filter, and an `OR` filter will pass products who match any values passed to the filter.

### initialProducts
This will provides the component with a list of products to display before any API requests are made for all of the pages. This allows users to see some products straight away. It is not required, however it is recommended to be used and you would typically use it like so, if creating the component within a liquid file:
```vue
<collection
    :initial-products="{{ collection.products | json }}"
>
</collection>
```

### itemsPerPage
The number of products to display per page. This is `Infinity` by default for "infinite scrolling", although for large collections this can make image lazy-loading a necessity.

### productCount
The number of products in the collection. The total number of products to be fetched. When the component mounts if `initialProducts` has the same length as `productCount`, it will not make any API requests. Otherwise `productCount` will be used to determine the number of pages to be fetched.

### productFetchLimit
The number of products requested per page when fetching products from the API. Defaults to 250.


## Slot Scope

| Slot                      | Type                      |
| ------------------------- | ------------------------- |
| appliedFilters            | {[key: String]: String[]} |
| appliedSortMethod         | String                    |
| availableFilters          | Filter[]                  |
| changeSortMethod          | Function                  |
| filters                   | FilterList                |
| filteredAndSortedProducts | Product[]                 |
| paginatedProducts         | Product[]                 |
| products                  | Product[]                 |
| sortMethods               | SortMethod[]              |

Example using all slot props:
```vue
<collection
    v-slot="{
        appliedFilters
        appliedSortMethod,
        availableFilters,
        changeSortMethod,
        filters,
        filteredAndSortedProducts,
        paginatedProducts,
        products,
        sortMethods
    }"
>
</collection>
```

### appliedFilters
The filters and associated values being applied. An object for which the keys are filter ids and the values are arrays of all applied values for the filter. For
example, if you have filter rules for size and color, and the following URL parameters `?size=l&color=red&color=blue`, `appliedFilters` would be `{ size: ['l'], color: ['red', 'blue'] }`.

### appliedSortMethod
This is the id of the sort method as shown by the `sort` URL parameter. `?sort=recommended`, means `appliedSortMethod` has the value: `recommended`.

### availableFilters
An array of filters for which there are values to be applied. If a filter exists for tags prefixed with `size`, but no such tags exist, for example, the filter will not be passed to this array.

### changeSortMethod
A method required for updating the `appliedSortMethod`. Attach this to a `select` element like so:
```vue
<select @input="changeSortMethod">
    <option v-for="method in sortMethods" :key="method.id">
        {{ method.label }}
    </option>
</select>
```

### filters
The `filterList` containing all provided filters.

### filteredAndSortedProducts
The products list after having filters applied and being sorted, this can be used to get all possible values from filters if you wish the hide values that are no longer available as more filters are applied.

### paginatedProducts
The `filteredAndSortedProducts` array after pagination. This should be used to list products on the page.

### products
The products list after having filters applied and being sorted, this can be used to get all possible values from filters.

### sortMethods
An array of methods by which the collection can be sorted. See [changeSortMethod](#changesortmethod) for how they might be used within a component.
