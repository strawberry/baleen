module.exports = {
    extends: ['@strawberrydigital'],
    plugins: ['cypress'],
    env: {
        'cypress/globals': true,
    },
    rules: {
        'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    },
};
