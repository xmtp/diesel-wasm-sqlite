//! Common utilities/imports amongst WebAssembly tests
use prelude::*;

pub async fn connection() -> WasmSqliteConnection {
    diesel_wasm_sqlite::init_sqlite().await;
    WasmSqliteConnection::establish(":memory:").unwrap()
}

// re-exports used in tests
#[allow(unused)]
pub mod prelude {
    pub(crate) use diesel::{
        connection::{Connection, LoadConnection},
        debug_query,
        deserialize::{self, FromSql, FromSqlRow},
        insert_into,
        prelude::*,
        sql_types::{Integer, Nullable, Text},
    };
    pub(crate) use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
    #[cfg(any(feature = "test-utils"))]
    pub(crate) use diesel_wasm_sqlite::utils::init;
    #[cfg(feature = "unsafe-debug-query")]
    pub(crate) use diesel_wasm_sqlite::DebugQueryWrapper;
    pub(crate) use diesel_wasm_sqlite::{connection::WasmSqliteConnection, WasmSqlite};
    pub(crate) use serde::Deserialize;
    pub(crate) use wasm_bindgen_test::*;
    pub(crate) use web_sys::console;
}
