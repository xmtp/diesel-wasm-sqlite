# Diesel Backend for SQLite and WASM

Use SQLite with Diesel ORM in your web apps!

## Quickstart

Add `diesel-wasm-sqlite` to your project. SQLite is automatically bundled with
the library.

```toml
[dependencies]
diesel = { version = "2.2" }
diesel-wasm-sqlite = { git = "https://github.com/xmtp/libxmtp", branch = "wasm-backend" }
wasm-bindgen = "0.2"
```

```rust
use diesel_wasm_sqlite::{connection::WasmSqliteConnection, WasmSqlite};
use wasm_bindgen::prelude::*;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./tests/web/migrations/");

mod schema {
    diesel::table! {
        books {
            id -> Integer,
            title -> Text,
            author -> Nullable<Text>,
        }
    }
}


#[derive(Deserialize, Insertable, Debug, PartialEq, Clone)]
#[diesel(table_name = books)]
pub struct BookForm {
    title: String,
    author: Option<String>,
}

// SQLite must be instantiated in a web-worker
// to take advantage of OPFS
#[wasm_bindgen]
async fn code_in_web_worker() -> Result<i32, diesel::QueryResult<usize>> {
    use schema::books::dsl::*;
    // `init_sqlite` sets up OPFS and SQLite. It must be ran before anything else, 
    // or we crash once we start trying to do queries.
    diesel_wasm_sqlite::init_sqlite().await;

    // create a new persistent SQLite database with OPFS
    let result = WasmSqliteConnection::establish(&format!("test-{}", rng));
    let query = insert_into(books).values(vec![
        BookForm {
                title: "Game of Thrones".into(),
                author: Some("George R.R".into()),
            },
            BookForm {
                title: "The Hobbit".into(),
                author: Some("J.R.R. Tolkien".into()),
            },
    ]);
    Ok(query.execute(conn)?)
}
```

Look in `tests/test/web.rs` for a working example!

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
