// The worker has its own scope and no direct access to functions/objects of the
// global scope. We import the generated JS file to make `wasm_bindgen`
// available which we need to initialize our Wasm code.
console.log("Initializing worker");
import { default as init, Posts } from "/pkg/example_sqlite_web.js";

// import init from ("/pkg/example_sqlite_web.js");
// importScripts("/pkgs/example_sqlite_web.js");

// In the worker, we have a different struct that we want to use as in
// `index.js`.

const port = self;

async function init_wasm_in_worker() {
  // Create a new object of the `NumberEval` struct.
  // await posts.init();
  const wasm = await init("/pkg/example_sqlite_web_bg.wasm");
  await Posts.init_sqlite();

  // Set callback to handle messages passed to the worker.
  port.onmessage = async (event) => {
    // Load the Wasm file by awaiting the Promise returned by `wasm_bindgen`.
    // await posts.initSqlite();
    var posts = Posts.new();

    let msg = event.data;

    let worker_result = { result: "test" };

    if (msg.hasOwnProperty("Create")) {
      var args = msg["Create"];
      posts.create_post(args.title, args.body, args.published);
    } else if (msg.hasOwnProperty("Delete")) {
      var id = msg["Delete"];
      posts.delete_post(id);
    } else if (msg == "Clear") {
      posts.clear();
      self.postMessage(new Array());
    } else if (msg == "List") {
      var posts = posts.list_posts();
      self.postMessage(posts);
    } else {
      console.log("unknown msg");
    }
  };
}

await init_wasm_in_worker();
