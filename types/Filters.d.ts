export type FilterRule = {
    filterType: ('singular' | 'AND' | 'OR');
    name: string;
    sourceName: string;

    /**
     * @note Supported dy default are:
     * - option
     * - tag
     * - type
     * - vendor
     */
    sourceType: string;
}
