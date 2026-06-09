import "server-only";

import { join } from "node:path";

import type { OwsCoreModule } from "./types";

declare const __non_webpack_require__: NodeRequire;

let cached: OwsCoreModule | null = null;

/** Runtime path to monad-blitz-nyc/ows-monad/ows (local fork only). */
export function getLocalOwsCorePath(): string {
  return join(process.cwd(), "../ows-monad/ows/bindings/node/index.js");
}

function runtimeRequire(): NodeRequire {
  if (typeof __non_webpack_require__ === "function") {
    return __non_webpack_require__;
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require;
}

export function getOwsCore(): OwsCoreModule {
  if (cached) return cached;

  const corePath = getLocalOwsCorePath();
  cached = runtimeRequire()(corePath) as OwsCoreModule;
  return cached;
}

export function createWallet(...args: Parameters<OwsCoreModule["createWallet"]>) {
  return getOwsCore().createWallet(...args);
}

export function getWallet(...args: Parameters<OwsCoreModule["getWallet"]>) {
  return getOwsCore().getWallet(...args);
}

export function createPolicy(...args: Parameters<OwsCoreModule["createPolicy"]>) {
  return getOwsCore().createPolicy(...args);
}

export function createApiKey(...args: Parameters<OwsCoreModule["createApiKey"]>) {
  return getOwsCore().createApiKey(...args);
}

export function listApiKeys(...args: Parameters<OwsCoreModule["listApiKeys"]>) {
  return getOwsCore().listApiKeys(...args);
}

export function signAndSend(...args: Parameters<OwsCoreModule["signAndSend"]>) {
  return getOwsCore().signAndSend(...args);
}

export function signMessage(...args: Parameters<OwsCoreModule["signMessage"]>) {
  return getOwsCore().signMessage(...args);
}

export function signTransaction(...args: Parameters<OwsCoreModule["signTransaction"]>) {
  return getOwsCore().signTransaction(...args);
}

export function signTypedData(...args: Parameters<OwsCoreModule["signTypedData"]>) {
  return getOwsCore().signTypedData(...args);
}

export type {
  OwsAccountInfo,
  OwsWalletInfo,
  OwsApiKeyResult,
  OwsCoreModule,
} from "./types";

/** @internal Test hook */
export function __resetOwsCoreForTests(): void {
  cached = null;
}
