//! Common utilities/imports amongst WebAssembly tests
use prelude::*;

use tokio::sync::OnceCell;

static INIT: OnceCell<()> = OnceCell::const_new();

pub async fn init() {
    INIT.get_or_init(|| async {
        console::log_1(&"INIT".into());
        let config = tracing_wasm::WASMLayerConfigBuilder::default()
            .set_console_config(tracing_wasm::ConsoleConfig::ReportWithoutConsoleColor)
            .build();
        tracing_wasm::set_as_global_default_with_config(config);
        console_error_panic_hook::set_once();
        sqlite_web::init_sqlite().await;
    })
    .await;
}

pub async fn connection() -> WasmSqliteConnection {
    sqlite_web::init_sqlite().await;
    WasmSqliteConnection::establish(":memory:").unwrap()
}

// re-exports used in tests
#[allow(unused)]
pub mod prelude {
    pub(crate) use super::init;
    pub(crate) use diesel::{
        connection::{Connection, LoadConnection},
        debug_query,
        deserialize::{self, FromSql, FromSqlRow},
        insert_into,
        prelude::*,
        sql_types::{Integer, Nullable, Text},
    };
    pub(crate) use diesel_migrations::{embed_migrations, EmbeddedMigrations, MigrationHarness};
    pub(crate) use sqlite_web::{
        connection::WasmSqliteConnection, WasmSqlite,
    };
    pub(crate) use serde::Deserialize;
    pub(crate) use wasm_bindgen_test::*;
    pub(crate) use web_sys::console;
    #[cfg(feature = "unsafe-debug-query")]
    pub(crate) use sqlite_web::DebugQueryWrapper;
}
