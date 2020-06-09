import Filter from './Filter';

/** @typedef {import('../Product').default} Product */

class TagFilter extends Filter {
    get delimiter() {
        return this.rule.delimiter || ':';
    }

    /** @param {Product} product */
    getPossibleValuesFromProduct(product) {
        const prefixRegex = `^${this.id.toLowerCase()}${this.delimiter}`;
        return product.tags
            .filter(tag => new RegExp(prefixRegex).test(tag))
            .map(tag => tag.replace(new RegExp(prefixRegex, 'g'), ''));
    }
}

export default TagFilter;
