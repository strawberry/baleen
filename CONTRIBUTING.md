# Contributing Guide

## Development Setup
After cloning the repo, install dependencies by running:
```shell
$ yarn
```

## Running Tests
This project uses Jest for unit testing and Cypress for E2E testing on a development store.

### Unit Testing
```shell
$ yarn test:unit --watch
```

_The `--watch` flag is optional, but recommended if you wish to have the tests run automatically every time you change a file._

### E2E Testing
#### 1. Create a development store
If you don't already have a development store to run tests on, create one through [partners.shopify.com](https://partners.shopify.com).

#### 2. Import test products into your store
Import [tests/fixtures/products.csv](/tests/fixtures/products.csv) to your store via `<store-name>.myshopify.com/admin/products`.

#### 3. Create test collections
Create 2 new collections, they should have the following titles: `Electric` and `Water`.
They should also be smart collections where products must match the following conditions:

Electric:
> Product tag is equal to type:electric

Water:
> Product tag is equal to type:water

#### 4. Configure Cypress to use your store
Create a Cypress env file (`cypress.env.json`) in the project root like so, setting `BASE_URL` to the `.myshopify.com` url and `STORE_PASSWORD` to the password required to access the store, if it is password protected:
```json
{
    "BASE_URL": "",
    "STORE_PASSWORD": ""
}
```

#### 5. Configure Themekit to use your development store
Also make a copy of `tests/e2e/sample.config.yml`, naming it `config.yml`. Populate the file as per [these instructions](https://shopify.github.io/themekit/configuration).

#### 6. Watch the base files
Watch the theme files by running:
```shell
$ yarn dev:themekit
```

And run webpack in watch mode by running:
```shell
$ yarn dev:webpack
```

_You will need to upload each of the test files to your test store. The easiest way to do this is to save every file in `tests/e2e/fixtures/theme/(layout|scripts|templates)` whilst the two scripts above are running._

#### 7. Run Tests
Once all products have been imported to the store, run Cypress with:
```shell
$ yarn test:e2e
```

## Submitting Code for Review
Once you're satisfied with your changes, and they're passing unit tests and E2E tests, open a PR to have your code reviewed. See [Github's official documentation](https://help.github.com/articles/creating-a-pull-request-from-a-fork/) for more details.
