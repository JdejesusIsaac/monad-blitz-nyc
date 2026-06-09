/**
 * Ensures the local OWS fork at ../ows-monad/ows/bindings/node has loader files
 * and a platform native binary. OWS is only consumed from this repo — not npm registry.
 */
import { execSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const allowmeRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const coreDir = join(allowmeRoot, "../ows-monad/ows/bindings/node");
const indexJs = join(coreDir, "index.js");

function hasNativeBinary(dir) {
  return readdirSync(dir).some((f) => f.endsWith(".node"));
}

function main() {
  if (!existsSync(coreDir)) {
    console.warn(`OWS fork missing at ${coreDir}`);
    return;
  }

  if (!existsSync(indexJs)) {
    console.log("Installing OWS loader (index.js) into local fork...");
    execSync("npm pack @open-wallet-standard/core@1.3.2 --silent", {
      cwd: coreDir,
      stdio: "pipe",
    });
    execSync(
      "tar -xzf open-wallet-standard-core-1.3.2.tgz && cp package/index.js package/index.d.ts . && rm -rf package open-wallet-standard-core-1.3.2.tgz",
      { cwd: coreDir, stdio: "pipe", shell: "/bin/bash" }
    );
  }

  if (!hasNativeBinary(coreDir)) {
    const { platform, arch } = process;
    let pkg = "";
    if (platform === "darwin" && arch === "arm64") {
      pkg = "@open-wallet-standard/core-darwin-arm64@1.3.2";
    } else if (platform === "darwin" && arch === "x64") {
      pkg = "@open-wallet-standard/core-darwin-x64@1.3.2";
    } else if (platform === "linux" && arch === "arm64") {
      pkg = "@open-wallet-standard/core-linux-arm64-gnu@1.3.2";
    } else if (platform === "linux" && arch === "x64") {
      pkg = "@open-wallet-standard/core-linux-x64-gnu@1.3.2";
    }

    if (pkg) {
      console.log(`Installing OWS native binary (${pkg}) for local fork...`);
      execSync(`npm install ${pkg} --no-save`, {
        cwd: coreDir,
        stdio: "inherit",
      });
    } else {
      console.warn(
        "No prebuilt OWS binary for this platform. Run: npm run ows:build (requires Rust)"
      );
    }
  }
}

try {
  main();
} catch (error) {
  console.warn("ensure-ows-bindings:", error);
}
