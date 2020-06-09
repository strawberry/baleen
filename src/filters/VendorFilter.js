import Filter from './Filter';

class TypeFilter extends Filter {
    constructor(rule) {
        super(rule);
        this.rule.sourceName = 'vendor';
    }

    /** @param {Product} product */
    getPossibleValuesFromProduct(product) {
        return [product[this.id]];
    }
}

export default TypeFilter;
