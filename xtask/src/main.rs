mod build;
mod test;

use color_eyre::eyre;
use color_eyre::eyre::Result;
use std::env;
use tracing_subscriber::{fmt, prelude::*, EnvFilter};

pub const RUSTFLAGS: &str = "-Ctarget-feature=+bulk-memory,+mutable-globals";
pub const CRATE_NAME: &str = "diesel-wasm-sqlite";

#[macro_use]
extern crate tracing;

pub mod tasks {
    use super::*;
    use crate::build;

    pub fn build() -> Result<()> {
        let extra_args: Vec<String> = env::args().skip_while(|x| x != "--").skip(1).collect();
        build::build(&extra_args)
    }

    pub fn test() -> Result<()> {
        let extra_args: Vec<String> = env::args().skip_while(|x| x != "--").skip(1).collect();
        test::test(&extra_args)
    }

    pub fn print_help() {
        println!(
            "
Usage: Run with `cargo xtask <task>`, eg. `cargo xtask build`.
    Pass extra arguments to the cargo command after `--`
    For example, `cargo xtask build -- --tests` results in `cargo build --tests`
    or `cargo xtask test -- --release` runs tests in `release` mode.

    Tasks:
        build: Build the WebAssembly Package
        test: Run WebAssembly tests
    Options:
        --target-dir: Specify a target directory
"
        );
    }
}

fn main() -> Result<()> {
    tracing_subscriber::registry()
        .with(fmt::layer())
        .with(EnvFilter::from_default_env())
        .init();

    color_eyre::install()?;
    let task = env::args().nth(1);
    match task.as_deref() {
        None => tasks::print_help(),
        Some("build") => tasks::build()?,
        Some("test") => tasks::test()?,
        Some("help") | Some("--help") | Some("-h") => tasks::print_help(),
        invalid => eyre::bail!("Invalid task name `{}`", invalid.unwrap()),
    };
    Ok(())
}
