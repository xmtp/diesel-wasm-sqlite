use crate::CRATE_NAME;
use color_eyre::eyre::Result;
use xshell::{cmd, Shell};

pub fn test(extra_args: &[String]) -> Result<()> {
    let sh = Shell::new()?;
    sh.change_dir(std::env!("CARGO_MANIFEST_DIR"));
    let _env = sh.push_env("RUSTFLAGS", crate::RUSTFLAGS);
    let cmd = cmd!(
        sh,
        "cargo test -p {CRATE_NAME} --target wasm32-unknown-unknown {extra_args...}"
    );
    info!("Running {}", cmd);
    cmd.run()?;

    Ok(())
}
