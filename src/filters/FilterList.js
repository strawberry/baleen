import Filter from './Filter';
import OptionFilter from './OptionFilter';
import TagFilter from './TagFilter';
import TypeFilter from './TypeFilter';
import VendorFilter from './VendorFilter';

/** @typedef {import('vue-router').Route} Route */
/** @typedef {import('../../types/Shopify')} */
/** @typedef {import('../../types/Filters').FilterRule} FilterRule */

class FilterList {
    /** @param {FilterRule[]} rules */
    constructor(rules, filterTypes) {
        this.filterTypes = {
            option: OptionFilter,
            tag: TagFilter,
            type: TypeFilter,
            vendor: VendorFilter,
            ...filterTypes,
        };

        /** @type {(Filter[])} */
        this.filters = rules.map(rule => {
            const Constructor = this.filterTypes[rule.sourceType] || Filter;
            return new Constructor(rule);
        });
    }

    get ids() {
        return this.filters.map(filter => filter.id);
    }

    /**
     * Return all active filters.
     *
     * @param  {Route} route - The route instance
     * @returns {Filter[]}
     */
    active(route) {
        return this.filters.filter(filter => filter.isActive(route));
    }

    /**
     * Apply the filters to the given route, returning a boolean representing whether
     * the product passes through the filters.
     *
     * @param  {Product} product - The product to apply the filters to
     * @param  {Route} route - The route instance
     * @returns {boolean}
     */
    apply(product, route) {
        return !this.active(route).some(
            filter => !filter.apply(product, route)
        );
    }

    /**
     * @param {{[key: string]: (string | string[])}} filters
     */
    applyFiltersFromObject(filters) {
        Object.entries(filters).forEach(([id, values]) =>
            this.getFilterById(id).selectValues(values)
        );
    }

    /** @param {string} id */
    getFilterById(id) {
        return this.filters.find(filter => filter.id === id);
    }

    get appliedValues() {
        return this.filters
            .map(filter => ({
                id: filter.id,
                values: filter.selectedValues,
            }))
            .filter(filter => filter.values.length)
            .reduce(
                (accumulator, filter) => ({
                    [filter.id]: filter.values,
                    ...accumulator,
                }),
                {}
            );
    }

    /**
     * @param {Product[]} products
     */
    availableFilters(products) {
        return this.filters.filter(
            filter => filter.getAvailableValues(products).length
        );
    }

    removeAllFilters() {
        this.filters.forEach(filter => {
            if (filter.ignoresGlobalReset) return;

            // eslint-disable-next-line no-param-reassign
            filter.selectedValues = [];
        });
    }
}

export default FilterList;
