#[cfg(any(feature = "test-utils", test))]
pub use test::*;

#[cfg(any(feature = "test-utils", test))]
mod test {
    use tokio::sync::OnceCell;
    static INIT: OnceCell<()> = OnceCell::const_new();

    pub async fn init() {
        INIT.get_or_init(|| async {
            web_sys::console::log_1(&"INIT".into());
            let config = tracing_wasm::WASMLayerConfigBuilder::default()
                .set_console_config(tracing_wasm::ConsoleConfig::ReportWithoutConsoleColor)
                .build();
            tracing_wasm::set_as_global_default_with_config(config);
            console_error_panic_hook::set_once();
                })
        .await;
    }
}
