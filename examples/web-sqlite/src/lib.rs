/// An example using sqlite-web on the web
/// Some worker code taken from https://github.com/rustwasm/wasm-bindgen/blob/main/examples/wasm-in-web-worker/src/lib.rs
/// newer init method used, https://rustwasm.github.io/docs/wasm-bindgen/examples/without-a-bundler.html#using-the-older---target-no-modules
use posts::StoredPost;
use std::cell::RefCell;
use std::rc::Rc;
use wasm_bindgen::prelude::*;
use web_sys::{console, HtmlElement, HtmlInputElement, HtmlTextAreaElement, MessageEvent, Worker, Document, WorkerType, WorkerOptions};
use serde::{Serialize, Deserialize};
use anyhow::Error;

mod posts;
mod schema;

pub fn logger() {
    use tracing_subscriber::layer::SubscriberExt;
    use tracing_subscriber::util::SubscriberInitExt;
    use tracing_subscriber::EnvFilter;
       let filter = EnvFilter::builder()
        .with_default_directive(tracing::metadata::LevelFilter::DEBUG.into())
        .from_env_lossy();

    let _ = tracing_subscriber::registry()
        .with(tracing_wasm::WASMLayer::default())
        .with(filter)
        .try_init();
}

/// Run entry point for the main thread.
#[wasm_bindgen]
pub fn startup() {
    console_error_panic_hook::set_once();
    logger();
    // Here, we create our worker. In a larger app, multiple callbacks should be
    // able to interact with the code in the worker. Therefore, we wrap it in
    // `Rc<RefCell>` following the interior mutability pattern. Here, it would
    // not be needed but we include the wrapping anyway as example.
    let options = WorkerOptions::new();
    options.set_type(WorkerType::Module);
    let worker_handle = Rc::new(RefCell::new(Worker::new_with_options(
        &wasm_bindgen::link_to!(module = "/src/worker.js"),
        &options
    ).unwrap()));
    console::log_1(&"Created a new worker from within Wasm".into());
    // Pass the worker to the function which sets up the `oninput` callback.
    setup_input_oninput_callback(worker_handle);
}

#[derive(Serialize, Deserialize)]
enum WorkerMessage {
    Create {
        title: String,
        body: String,
        published: bool
    },
    Delete(i32),
    List,
    Clear
}

fn setup_input_oninput_callback(worker: Rc<RefCell<web_sys::Worker>>) {
    let document = web_sys::window().unwrap().document().unwrap();

    // If our `onmessage` callback should stay valid after exiting from the
    // `oninput` closure scope, we need to either forget it (so it is not
    // destroyed) or store it somewhere. To avoid leaking memory every time we
    // want to receive a response from the worker, we move a handle into the
    // `oninput` closure to which we will always attach the last `onmessage`
    // callback. The initial value will not be used and we silence the warning.
    #[allow(unused_assignments)]
    let mut persistent_callback_handle = get_on_msg_callback();

    let create_post: Closure<dyn FnMut()> = {
        let worker = worker.clone();
        Closure::new(move || {
            let document = web_sys::window().unwrap().document().unwrap();

               // If the value in the field can be parsed to a `i32`, send it to the
            // worker. Otherwise clear the result field.
            let worker_handle = &*worker.borrow();
            if parse_create(&document, worker_handle).is_ok() {
                reset_input(&document, "title");
                reset_input(&document, "body");
                reset_input(&document, "published");
            }
        })
    };

    let delete_post: Closure<dyn FnMut()> = {
        let worker = worker.clone();
        Closure::new(move || {
            let document = web_sys::window().unwrap().document().unwrap();
            let id = get_input(&document, "post-id");
            let worker_handle = &*worker.borrow();
            if let Ok(id) = id.value().parse::<i32>() {
                let msg = WorkerMessage::Delete(id);
                worker_handle.post_message(&serde_wasm_bindgen::to_value(&msg).unwrap()).unwrap();
            } else {
                reset_input(&document, "post-id")
            }

        })
    };

    let clear: Closure<dyn FnMut()> = {
        let worker = worker.clone();
        Closure::new(move || {
            let worker_handle = &*worker.borrow();
            let msg = WorkerMessage::Clear;
            worker_handle.post_message(&serde_wasm_bindgen::to_value(&msg).unwrap()).unwrap();
        })
    };


    let list_post: Closure<dyn FnMut()> = {
        let worker = worker.clone();
        Closure::new(move || {
            let worker_handle = &*worker.borrow();
            let msg = WorkerMessage::List;
            worker_handle.post_message(&serde_wasm_bindgen::to_value(&msg).unwrap()).unwrap();
            persistent_callback_handle = get_on_msg_callback();
            worker_handle
                .set_onmessage(Some(persistent_callback_handle.as_ref().unchecked_ref()));
        })
    };

    document
        .get_element_by_id("create-post-btn")
        .expect("#create-post-btn should exist")
        .dyn_ref::<HtmlElement>()
        .expect("#create-post-btn should be a HtmlElement")
        .set_onclick(Some(create_post.as_ref().unchecked_ref()));
    document
        .get_element_by_id("delete-post-btn")
        .expect("#delete-post-form should exist")
        .dyn_ref::<HtmlElement>()
        .expect("#delete-post-form should be a HtmlElement")
        .set_onclick(Some(delete_post.as_ref().unchecked_ref()));
    document
        .get_element_by_id("list-posts-btn")
        .expect("#list-posts-btn should exist")
        .dyn_ref::<HtmlElement>()
        .expect("#list-posts-button should be an HtmlElement")
        .set_onclick(Some(list_post.as_ref().unchecked_ref()));
    document
        .get_element_by_id("clear-posts-btn")
        .expect("#clear-posts-btn should exist")
        .dyn_ref::<HtmlElement>()
        .expect("#clear-posts-button should be an HtmlElement")
        .set_onclick(Some(clear.as_ref().unchecked_ref()));

    // Leaks memory.
    create_post.forget();
    delete_post.forget();
    list_post.forget();
    clear.forget();
}

fn get_input(document: &Document, id: &str) -> HtmlInputElement {
    let title_input = document.get_element_by_id(id).expect("#{id} should exist");
    title_input
        .dyn_into::<HtmlInputElement>()
        .expect(&format!("#{id} should be a HtmlInputElement"))
}

fn reset_input(document: &Document, id: &str) {
    document
        .get_element_by_id(id)
        .expect("#{id} should exist")
        .dyn_ref::<HtmlElement>()
        .expect("#{id} should be a HtmlInputElement")
        .set_inner_text("");
}

fn parse_create(document: &Document, worker: &web_sys::Worker) -> Result<(), Error> {
    let title = get_input(&document, "title").value().parse::<String>()?;
    let body = document.get_element_by_id("body").expect("body should exist");
    let body = body.dyn_ref::<HtmlTextAreaElement>().expect("Body should be a textarea");
    let published = get_input(&document, "published");
    let msg = WorkerMessage::Create { title, body: body.value(), published: published.checked() };
    worker.post_message(&serde_wasm_bindgen::to_value(&msg).unwrap()).unwrap();
    Ok(())
}

/// Create a closure to act on the message returned by the worker
fn get_on_msg_callback() -> Closure<dyn FnMut(MessageEvent)> {
    Closure::new(move |event: MessageEvent| {
        console::log_2(&"Received response: ".into(), &event.data());

        let posts: Vec<StoredPost> = serde_wasm_bindgen::from_value(event.data()).unwrap();
        let mut html = String::new();
        for post in posts {
            let StoredPost { id, title, body, published } = post;
            let part = format!("
            <div>
                <H3>Title: {title}</H3>
                <h5>ID: {id}</h5>
                <h5>Published: {published}</h5>
                <p>{body}</p>
            </div>
            <hr>
            ");
            html.push_str(&part);
        }
        let document = web_sys::window().unwrap().document().unwrap();
        document
            .get_element_by_id("posts-container")
            .expect("#posts-container should exist")
            .dyn_ref::<HtmlElement>()
            .expect("#resultField should be a HtmlInputElement")
            .set_inner_html(&html);
    })
}
