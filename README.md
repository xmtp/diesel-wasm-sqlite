# Diesel Backend for SQLite and WASM

Use SQLite with Diesel ORM in your web apps!

## Quickstart

Add `sqlite-web` to your project. SQLite is automatically bundled with the
library.

```toml
[dependencies]
diesel = { version = "2.2" }
sqlite-web = { git = "https://github.com/xmtp/sqlite-web-rs", branch = "main" }
wasm-bindgen = "0.2"
```

## Try It Out!

Try out SQLite on the web with rust at this
[example app](https://sqlite-web-example.netlify.app/)

## Running the Example

Look in `examples/web-sqlite` for a working example!

- run `yarn` in the root of the repo
- navigate to `examples/web-sqlite`
- make sure the [`miniserve`](https://github.com/svenstaro/miniserve) crate is
  installed locally
- run `./build.sh && ./run.sh`
- navigate to `localhost:8080`

## Contributing

### Building

#### Install yarn dependencies

`yarn`

#### Build the SQLite/OPFS JavaScript Bundle

`yarn build`

#### Build the rust code

`cargo build --target wasm32-unknown-unknown`

#### Run tests (browser)

- `yarn test:chrome`
- `yarn test:firefox`
- `yarn test:safari`

Navigate to `http://localhost:8000` to observe test output.

#### Run tests (headless)

- `yarn test:chrome:headless`
- `yarn test:firefox:headless`
- `yarn test:safari:headless`

### Opening a Pull Request

PR Title should follow
[conventional commits format](https://www.conventionalcommits.org/en/v1.0.0/)

In short, if should be one of:

- `fix:` represents bug fixes, and results in a SemVer patch bump.
- `feat:` represents a new feature, and results in a SemVer minor bump.
- `<prefix>!:` (e.g. feat!:): represents a **breaking change** (indicated by the
  !) and results in a SemVer major bump.
- `doc:` documentation changes
- `perf:` changes related to performance
- `refactor:` a refactor
- `style:`
- `test:`

You can add extra context to conventional commits by using parantheses, for
instance if a PR touched only database-related code, a PR title may be:

- `feat(db): Add SQLCipher plaintext_header support to database connection`
