use diesel::prelude::*;
use sqlite_web::{connection::WasmSqliteConnection, dsl::RunQueryDsl};
use diesel_migrations::MigrationHarness;
use wasm_bindgen::prelude::*;
use serde::{Serialize, Deserialize};
use std::cell::RefCell;
use std::rc::Rc;

use diesel_migrations::{embed_migrations, EmbeddedMigrations};

use crate::schema::*;

pub const MIGRATIONS: EmbeddedMigrations = embed_migrations!("./migrations");

#[derive(Debug, Queryable, Selectable, Serialize, Deserialize)]
#[diesel(table_name = crate::schema::posts)]
#[diesel(check_for_backend(sqlite_web::WasmSqlite))]
pub struct StoredPost {
    pub id: i32,
    pub title: String,
    pub body: String,
    pub published: bool,
}

#[derive(Deserialize, Insertable, Debug, PartialEq, Clone)]
#[diesel(table_name = posts)]
pub struct NewPost {
    title: String,
    body: String,
    published: bool
}


#[wasm_bindgen]
pub struct Posts {
    connection: Rc<RefCell<WasmSqliteConnection>>,
}

#[wasm_bindgen]
impl Posts {
    pub fn new() -> Self {
        let mut connection = WasmSqliteConnection::establish(&format!("web-sqlite-rs-test-db.db3")).expect("CONN");
        connection.run_pending_migrations(MIGRATIONS).expect("MIGRATIONS");
        Self { connection: Rc::new(RefCell::new(connection)) }
    }

    pub async fn init_sqlite() {
        crate::logger();
        tracing::debug!("init sqlite");
        sqlite_web::init_sqlite().await;
    }

    pub fn create_post(&self, title: String, body: String, published: bool) -> usize {
        use crate::schema::posts;
        let post = NewPost {
            title, body, published
        };
        let conn = &mut *self.connection.borrow_mut();
        let rows = diesel::insert_into(posts::table).values(&post).execute(conn).unwrap();
        rows
    }

    pub fn delete_post(&self, id: i32) -> usize {
        use crate::schema::posts::dsl;
        let conn = &mut *self.connection.borrow_mut();
        let rows = diesel::delete(dsl::posts.filter(dsl::id.eq(&id))).execute(conn).unwrap();
        rows
    }

    pub fn clear(&self) -> usize {
        use crate::schema::posts::dsl;
        let conn = &mut *self.connection.borrow_mut();
        let rows = diesel::delete(dsl::posts).execute(conn).unwrap();
        rows
    }

    pub fn list_posts(&self) -> Vec<JsValue> {
        use crate::schema::posts::dsl;
        let conn = &mut *self.connection.borrow_mut();
        let posts = dsl::posts.select(StoredPost::as_select())
            .load(conn);
        posts.unwrap().into_iter().map(|v| serde_wasm_bindgen::to_value(&v).unwrap()).collect()
    }
}

