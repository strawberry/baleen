import Filter from './Filter';

class AvailabilityFilter extends Filter {
    constructor(rule) {
        super(rule);
        this.rule.sourceName = 'availability';
    }

    /** @param {Product} product */
    // eslint-disable-next-line class-methods-use-this
    getPossibleValuesFromProduct(product) {
        const availability = [];
        product.variants.forEach(variant => {
            availability.push(variant.available);
        });
        if (availability.includes(true)) {
            return ['true'];
        }
        return ['false'];
    }
}

export default AvailabilityFilter;
