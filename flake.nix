{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    fenix = {
      url = "github:nix-community/fenix";
      inputs = { nixpkgs.follows = "nixpkgs"; };
    };
    environments.url = "github:insipx/environments";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { nixpkgs, flake-utils, fenix, environments, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = import nixpkgs { inherit system; };
        inherit (pkgs.stdenv) isDarwin;
        inherit (pkgs.darwin.apple_sdk) frameworks;
        fenixPkgs = fenix.packages.${system};
        # probably don't need all these linters
        linters = import "${environments}/linters.nix" { inherit pkgs; };
        rust-toolchain = fenixPkgs.fromToolchainFile {
          file = ./rust-toolchain;
          sha256 = "sha256-s1RPtyvDGJaX/BisLT+ifVfuhDT1nZkZ1NcK8sbwELM=";
        };
        nativeBuildInputs = with pkgs; [ pkg-config ];
        buildInputs = with pkgs;
          [
            rust-toolchain
            rust-analyzer
            llvmPackages_16.libcxxClang
            mktemp
            markdownlint-cli
            shellcheck
            buf
            curl
            wasm-pack
            twiggy
            wasm-bindgen-cli
            binaryen
            linters
            cargo-nextest
            cargo-udeps
            cargo-sweep
            cargo-cache
            cargo-machete
            cargo-features-manager
            cargo-bloat
            cargo-mutants
            cargo-deny
            cargo-audit
            chromedriver
            geckodriver

            nodejs
            yarn-berry
          ] ++ lib.optionals isDarwin [
            libiconv
            frameworks.CoreServices
            frameworks.Carbon
            frameworks.ApplicationServices
            frameworks.AppKit
            darwin.cctools
          ];
      in
      with pkgs; {
        devShells.default = mkShell { inherit buildInputs nativeBuildInputs; };
      });
}
