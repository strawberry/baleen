/** @typedef {import('../types/Filters').FilterRule} FilterRule */
/** @typedef {import('../types/shopify')} */

/** @param {number | string} price */
function convertToShopifyPrice(price) {
    if (typeof price === 'string') {
        if (price.includes('.')) {
            return Number(price) * 100;
        }

        return Number(price);
    }

    return price;
}

class Product {
    /** @param {Shopify.Product} product */
    constructor(product) {
        this.data = product;
    }

    /** @returns {Shopify.Image} */
    get featuredImage() {
        return this.data.featured_image
            ? { src: this.data.featured_image }
            : this.images[0];
    }

    get handle() {
        return this.data.handle;
    }

    get id() {
        return this.data.id;
    }

    /** @returns {(Shopify.Image | { src: string; })[]} */
    get images() {
        if (
            this.data.images.length &&
            typeof this.data.images[0] === 'string'
        ) {
            return this.data.images.map(src => ({ src }));
        }

        return this.data.images;
    }

    get minimumPrice() {
        return Math.min(...this.prices);
    }

    get compareAtPrice() {
        const prices = this.variants.filter(
            variant => variant.compare_at_price
        );

        if (prices.length === 0) {
            return null;
        }

        return Math.min(
            ...prices.map(variant =>
                convertToShopifyPrice(variant.compare_at_price)
            )
        );
    }

    get price() {
        const prices = this.variants.filter(variant => variant.price);

        if (prices.length === 0) {
            return null;
        }

        return Math.min(
            ...prices.map(variant => convertToShopifyPrice(variant.price))
        );
    }

    /** @returns {Shopify.Option[]} */
    get options() {
        const { options } = this.data;

        if (typeof options[0] === 'string') {
            return options.map((option, index) => {
                const position = index + 1;

                const values = [
                    ...new Set(
                        this.variants.map(
                            variant => variant[`option${position}`]
                        )
                    ),
                ];

                return {
                    name: option,
                    position,
                    values,
                };
            });
        }

        return options;
    }

    /** @returns {number[]} */
    get prices() {
        return this.variants.map(variant => {
            const price = variant.price || variant.compareAtPrice;
            if (typeof price === 'string') {
                return convertToShopifyPrice(price);
            }

            return price;
        });
    }

    get tags() {
        return this.data.tags;
    }

    get title() {
        return this.data.title;
    }

    get type() {
        return this.data.type || this.data.product_type;
    }

    get url() {
        return `/products/${this.handle}`;
    }

    get variants() {
        return this.data.variants;
    }

    get vendor() {
        return this.data.vendor;
    }

    /**
     * Returns url in /collections/:collection/products/:product format
     *
     * @param {string} [collectionHandle]
     * @returns {string}
     */
    getUrlWithinCollection(collectionHandle) {
        const route = this.url;

        if (collectionHandle) {
            return `/collections/${collectionHandle}${route}`;
        }

        return route;
    }
}

export default Product;
