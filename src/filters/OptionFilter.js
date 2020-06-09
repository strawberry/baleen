import Filter from './Filter';

/** @typedef {import('../Product').default} Product */

class OptionFilter extends Filter {
    /** @param {Product} product */
    getPossibleValuesFromProduct(product) {
        const variantOption = product.options.find(
            option => option.name.toLowerCase() === this.id.toLowerCase()
        );

        if (variantOption) {
            return variantOption.values;
        }

        return [];
    }
}

export default OptionFilter;
