#!/bin/bash

set -ex

# This example requires to *not* create ES modules, therefore we pass the flag
# `--target no-modules`
cd ../../
yarn
cd examples/web-sqlite

curl -L --proto '=https' --tlsv1.2 -sSf https://raw.githubusercontent.com/cargo-bins/cargo-binstall/main/install-from-binstall-release.sh | bash
cargo binstall wasm-bindgen-cli

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
