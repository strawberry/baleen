import Filter from './Filter';

class AvailabilityFilter extends Filter {
    constructor(rule) {
        super(rule);
        this.rule.sourceName = 'availability';
    }

    /** @param {Product} product */
    // eslint-disable-next-line class-methods-use-this
    getPossibleValuesFromProduct(product) {
        return [product.variants.some(variant => variant.available).toString()];
    }
}

export default AvailabilityFilter;
