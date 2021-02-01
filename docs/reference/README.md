# Reference

[[toc]]

## Provider Component

### Props

The following props are accepted by the component:

| Prop              | Type                    | Required | Default  |
| ----------------- | ----------------------- | -------- | -------- |
| collection        | CollectionDrop (Liquid) | True     |          |
| productCount      | Number                  | True     |          |
| productFetchLimit | Number                  | False    | 250      |

#### collection
Describes the collection to be fetched. At a minimum should contain the following keys:
id, handle. If `collection.id` is 0, products will be requested from `/products.json`.

#### productCount
Sets maximum number of products on a page. If the `productCount` is less than the `productFetchLimit` the product list data will be paginated.

#### productFetchLimit
The number of products requested per page when fetching products from the API. Defaults to 250.

## Consumer Component

### Props
The following props are accepted by the component:

| Prop              | Type                    | Required | Default  |
| ----------------- | ----------------------- | -------- | -------- |
| filterRules       | FilterRule[]            | False    | []       |
| itemsPerPage      | Number                  | False    | Infinity |
| products          | Product[]               | True     | []       |


#### filterRules
These determine which filters will be used by the component. They must contain the following keys: id, sourceName, sourceType and filterType.

* `id` determines the key used by the URL parameters. For example `id: color` would apply the `blue` value to the URL like so `?color=blue`.
* `sourceName` determines the name of either the variant option or the tag prefix used for the filter. For example `sourceName: Size` could apply values against variant options named "Size", or product tags beginning with `Size`.
* `sourceType` supports the values: `option` and `tag`. This determines whether the filter should apply values against variant options or product tags.
* `filterType` can have values `singular`, `AND` or `OR`. A `singular` filter will only apply the first value given by the URL parameters. An `AND` filter will only pass products who match all values passed to the filter, and an `OR` filter will pass products who match any values passed to the filter.


#### itemsPerPage
The number of products to display per page. This is `Infinity` by default for "infinite scrolling", although for large collections this can make image lazy-loading a necessity.

#### products
The data which is consumed by the component which was passed from the provider component. 


### Slot Scope

| Slot                      | Type                      |
| ------------------------- | ------------------------- |
| appliedFilters            | {[key: String]: String[]} |
| appliedSortMethod         | String                    |
| availableFilters          | Filter[]                  |
| changePage                | Function                  |
| changeSortMethod          | Function                  |
| currentPage               | Number                    |
| filters                   | FilterList                |
| filteredAndSortedProducts | Product[]                 |
| paginatedProducts         | Product[]                 |
| sortMethods               | SortMethod[]              |

Example using all slot props:
```vue
<ProductList
    v-slot="{
        appliedFilters,
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
</ProductList>
```

### appliedFilters
The filters and associated values being applied. An object for which the keys are filter ids and the values are arrays of all applied values for the filter. For
example, if you have filter rules for size and color, and the following URL parameters `?size=l&color=red&color=blue`, `appliedFilters` would be `{ size: ['l'], color: ['red', 'blue'] }`.

### appliedSortMethod
This is the id of the sort method as shown by the `sort` URL parameter. `?sort=recommended`, means `appliedSortMethod` has the value: `recommended`.

### availableFilters
An array of filters for which there are values to be applied. If a filter exists for tags prefixed with `size`, but no such tags exist, for example, the filter will not be passed to this array.

### changePage
Used to update the page, like so:
```js
changePage(2)
```

### changeSortMethod
A method required for updating the `appliedSortMethod`. It accepts a sort method ID as an argument. Attach this to a `select` element like so:
```vue
<select @input="event => changeSortMethod(event.target.value)">
    <option v-for="method in sortMethods" :key="method.id">
        {{ method.label }}
    </option>
</select>
```

### currentPage
The current page.

### filters
The `filterList` containing all provided filters.

### filteredAndSortedProducts
The products list after having filters applied and being sorted, this can be used to get all possible values from filters if you wish the hide values that are no longer available as more filters are applied.

### paginatedProducts
The `filteredAndSortedProducts` array after pagination. This should be used to list products on the page.

### sortMethods
An array of methods by which the collection can be sorted. See [changeSortMethod](#changesortmethod) for how they might be used within a component.
