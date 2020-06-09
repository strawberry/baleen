/** @typedef {import('vue-router').Route} Route */
/** @typedef {import('../Product').default} Product */
/** @typedef {import('../../types/Shopify')} */
/** @typedef {import('../../types/Filters').FilterRule} FilterRule */

class Filter {
    /** @param {FilterRule} rule */
    constructor(rule) {
        this.rule = rule;
        this.selectedValues = [];
    }

    get id() {
        return this.rule.sourceName;
    }

    get ignoresGlobalReset() {
        return this.rule.ignoresGlobalReset || false;
    }

    get name() {
        return this.rule.name;
    }

    get type() {
        return this.rule.filterType;
    }

    /**
     * Determine whether the given product should be filtered or not. Returns true if
     * the product matches the filter. If the filter value is null, we don't want
     * to do any filtering.
     *
     * @param  {Product} product - The product to apply the filter to
     * @param  {Route} route - The route instance
     * @returns {boolean}
     */
    apply(product, route) {
        /** If filter is not present in the route, all products pass */
        if (!this.isActive(route)) {
            return true;
        }

        const values = this.getValuesFromQuery(route.query);
        const arrayMethod = this.type === 'AND' ? 'every' : 'some';

        return values[arrayMethod](value =>
            this.applyValueToProduct(product, value)
        );
    }

    applyValueToProduct(product, value) {
        return this.getPossibleValuesFromProduct(product).includes(value);
    }

    getPossibleValuesFromProduct() {
        throw Error(
            `${this.name} filter is missing an "getPossibleValuesFromProduct" method`
        );
    }

    /** @param {{[key: string]: string | string[]}} query */
    getValuesFromQuery(query) {
        let values = query[this.id];

        if (typeof values === 'string') {
            values = [values];
        }

        /** If filter type is singular, only apply first value given in query */
        if (this.type === 'singular') {
            values = [values[0]];
        }

        return values;
    }

    /** @param {(string | string[])} values */
    selectValues(values) {
        /** @note Is there a better way to write this? It feels clunky. */
        if (this.type === 'singular' && Array.isArray(values)) {
            this.selectedValues = [values[0]];
            return;
        }

        this.selectedValues = [values].flat();
    }

    /** @param {Product[]} products */
    getAvailableValues(products) {
        return products
            .flatMap(product => this.getPossibleValuesFromProduct(product))
            .reduce((accumulator, value) => {
                const currentValue = accumulator.find(
                    option => option.id === value
                );
                if (currentValue) {
                    currentValue.count += 1;
                } else {
                    accumulator.push({ id: value, count: 1 });
                }

                return accumulator;
            }, []);
    }

    /**
     * Determine whether this filter is active or not.
     *
     * @param  {Route} route - The route instance
     * @returns {boolean}
     */
    isActive(route) {
        return typeof route.query[this.id] !== 'undefined';
    }

    /** @param {string} value */
    removeValue(value) {
        this.selectedValues = this.selectedValues.filter(
            selectedValue => selectedValue !== value
        );
    }
}

export default Filter;
