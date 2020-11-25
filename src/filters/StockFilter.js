import Filter from './Filter';

class StockFilter extends Filter {
    constructor(rule) {
        super(rule);
        this.rule.sourceName = 'stock';
    }

    /** @param {Product} product */
    // eslint-disable-next-line class-methods-use-this
    getPossibleValuesFromProduct(product) {
        if (product.available === true) {
            return ['true'];
        }
        return ['false'];
    }
}

export default StockFilter;
