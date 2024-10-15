use color_eyre::eyre::Result;
use std::{
    fmt, fs,
    path::{Path, PathBuf},
};
use xshell::{cmd, Shell};

pub enum BuildProfile {
    Dev,
    Release,
}

impl fmt::Display for BuildProfile {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            BuildProfile::Dev => write!(f, "debug"),
            BuildProfile::Release => write!(f, "release"),
        }
    }
}

pub fn build(extra_args: &[String]) -> Result<()> {
    let workspace_dir = workspace_dir()?;
    let manifest_dir = workspace_dir.join(crate::CRATE_NAME);

    let pkg_directory = manifest_dir.clone().join("pkg");

    let target_directory = {
        let mut has_target_dir_iter = extra_args.iter();
        has_target_dir_iter
            .find(|&it| it == "--target-dir")
            .and_then(|_| has_target_dir_iter.next())
            .map(PathBuf::from)
            .unwrap_or(workspace_dir.join("target"))
    };

    let release_or_debug = {
        let mut has_release = extra_args.iter();
        if has_release.any(|it| it == "--release") {
            BuildProfile::Release
        } else {
            BuildProfile::Dev
        }
    };

    let wasm_path = target_directory
        .join("wasm32-unknown-unknown")
        .join(release_or_debug.to_string())
        .join(crate::CRATE_NAME.replace("-", "_"))
        .with_extension("wasm");

    cargo_build(extra_args)?;
    create_pkg_dir(&pkg_directory)?;
    step_wasm_bindgen_build(&wasm_path, &pkg_directory)?;
    step_run_wasm_opt(&pkg_directory)?;
    Ok(())
}

pub fn cargo_build(extra_args: &[String]) -> Result<()> {
    let sh = Shell::new()?;
    sh.change_dir(std::env!("CARGO_MANIFEST_DIR"));
    let _env = sh.push_env("RUSTFLAGS", crate::RUSTFLAGS);
    let cmd = cmd!(
        sh,
        "cargo build -p diesel-wasm-sqlite --target wasm32-unknown-unknown {extra_args...}"
    );
    info!("Running {}", cmd);
    cmd.run()?;

    Ok(())
}

/// Construct our `pkg` directory in the crate.
pub fn create_pkg_dir(out_dir: &Path) -> Result<()> {
    let _ = fs::remove_file(out_dir.join("package.json"));
    fs::create_dir_all(out_dir)?;
    fs::write(out_dir.join(".gitignore"), "*")?;
    Ok(())
}

pub fn step_wasm_bindgen_build(wasm_path: &Path, pkg_directory: &Path) -> Result<()> {
    // TODO: Check for wasm-bindgen on `PATH`
    let sh = Shell::new()?;
    let _env = sh.push_env("RUSTFLAGS", crate::RUSTFLAGS);
    let cmd = cmd!(sh, "wasm-bindgen {wasm_path} --out-dir {pkg_directory} --typescript --target bundler --split-linked-modules");
    info!("Running {}", cmd);
    cmd.run()?;
    Ok(())
}

fn workspace_dir() -> Result<PathBuf> {
    let output = std::process::Command::new(env!("CARGO"))
        .arg("locate-project")
        .arg("--workspace")
        .arg("--message-format=plain")
        .output()?
        .stdout;
    let cargo_path = Path::new(std::str::from_utf8(&output).unwrap().trim());
    Ok(cargo_path.parent().unwrap().to_path_buf())
}

pub fn step_run_wasm_opt(out_dir: &Path) -> Result<()> {
    // TODO: Check for `wasm-opt` on `PATH`
    for file in out_dir.read_dir()? {
        let file = file?;
        let path = file.path();
        if path.extension().and_then(|s| s.to_str()) != Some("wasm") {
            continue;
        }

        let sh = Shell::new()?;
        let tmp = path.with_extension("wasm-opt.wasm");
        let cmd = cmd!(sh, "wasm-opt {path} -o {tmp} -Oz");
        info!("Running: {cmd}");
        cmd.run()?;
        std::fs::rename(&tmp, &path)?;
    }

    Ok(())
}
