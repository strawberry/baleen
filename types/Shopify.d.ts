declare namespace Shopify {
    type Image = ShopifyJSON.Image;
    type Option = ShopifyJSON.Option;
    type Product = LiquidDrop.Product | ShopifyJSON.Product;
}

declare namespace LiquidDrop {
    type Product = {
        id: string;
        title: string;
        handle: string;
        description: string;
        published_at: string;
        created_at: string;
        vendor: string;
        type: string;
        tags: string[];
        price: number;
        price_min: number;
        price_max: number;
        available: boolean;
        price_varies: boolean;
        compare_at_price: number;
        compare_at_price_min: number;
        compare_at_price_max: number;
        compare_at_price_varies: boolean;
        variants: LiquidDrop.Variant[];
        images: string[];
        featured_image: string | null;
        options: string[];
        content: string;
    }

    type Variant = {
        id: number;
        title: string;
        option1: string;
        option2: string | null;
        option3: string | null;
        sku: string | null;
        requires_shipping: boolean;
        taxable: boolean;
        featured_image: Shopify.ProductImage | null;
        available: boolean;
        name: string;
        public_title: string;
        options: string[];
        price: number;
        weight: number;
        compare_at_price: number | null;
        inventory_management: string | null;
        barcode: string | null;
    }
}

declare namespace ShopifyJSON {
    type Image = {
        id: number;
        created_at: string;
        position: number;
        updated_at: string;
        product_id: number;
        variant_ids: number[];
        src: string;
        alt: number;
        width: number;
        height: number;
    }

    type Option = {
        name: string;
        position: 1 | 2 | 3;
        values: string[];
    }

    type Product = {
        id: string;
        title: string;
        handle: string;
        body_html: string;
        published_at: string;
        created_at: string;
        updated_at: string;
        vendor: string;
        product_type: string;
        tags: string[];
        variants: ShopifyJSON.Variant[];
        images: ShopifyJSON.Image[];
        options: ShopifyJSON.Option[];
    }

    type Variant = {
        id: number;
        title: string;
        option1: string;
        option2: string | null;
        option3: string | null;
        sku: string | null;
        requires_shipping: boolean;
        taxable: boolean;
        featured_image: Shopify.ProductImage | null;
        available: boolean;
        price: string;
        grams: number;
        compare_at_price: string | null;
        position: number;
        product_id: number;
        created_at: string;
        updated_at: string;
    }
}
