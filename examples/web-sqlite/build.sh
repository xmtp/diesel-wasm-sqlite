#!/bin/sh

set -ex

# This example requires to *not* create ES modules, therefore we pass the flag
# `--target no-modules`

RUSTFLAGS="-Ctarget-feature=+bulk-memory,+mutable-globals,+reference-types" cargo build \
  --release --target wasm32-unknown-unknown

wasm-bindgen ./target/wasm32-unknown-unknown/release/example_sqlite_web.wasm \
  --out-dir ./pkg --split-linked-modules --target web
rm pkg/package.json
yarn wasm-opt ./pkg/example_sqlite_web_bg.wasm -o ./pkg/example_sqlite_web_bg.wasm-opt.wasm -Oz

if [[ $? -eq 0 ]]; then
  mv ./pkg/example_sqlite_web_bg.wasm-opt.wasm ./pkg/example_sqlite_web_bg.wasm
else
    echo "wasm-opt failed"
fi
 RUST_LOG=info RUSTFLAGS="-Ctarget-feature=+bulk-memory,+mutable-globals" wasm-pack build
 --release --reference-types --no-opt --no-typescript --target web --no-pack
