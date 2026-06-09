import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

describe("OWS credential config", () => {
  const originalEnv = { ...process.env };
  let tempVault: string;

  afterEach(() => {
    process.env = { ...originalEnv };
    if (tempVault) {
      rmSync(tempVault, { recursive: true, force: true });
    }
    vi.resetModules();
  });

  async function loadConfig() {
    return import("@/lib/ows/config");
  }

  it("rejects OWS_AGENT_KEY in env", async () => {
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;
    process.env.OWS_AGENT_KEY = "ows_key_should_not_be_here";
    writeFileSync(join(tempVault, "reward-agent.token"), "ows_key_filetoken\n", {
      mode: 0o600,
    });

    const { getOwsAgentKey } = await loadConfig();
    expect(() => getOwsAgentKey()).toThrow(/must not be set via .env/);
  });

  it("rejects OWS_OWNER_PASSPHRASE in env", async () => {
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;
    process.env.OWS_OWNER_PASSPHRASE = "secret";
    writeFileSync(join(tempVault, "reward-agent.token"), "ows_key_filetoken\n", {
      mode: 0o600,
    });

    const { getOwsAgentKey } = await loadConfig();
    expect(() => getOwsAgentKey()).toThrow(/must not be set via .env/);
  });

  it("reads agent token from vault file", async () => {
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;
    writeFileSync(
      join(tempVault, "reward-agent.token"),
      "ows_key_abc123\n",
      { mode: 0o600 }
    );

    const { getOwsAgentKey } = await loadConfig();
    expect(getOwsAgentKey()).toBe("ows_key_abc123");
  });

  it("throws when vault token file is missing", async () => {
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;

    const { getOwsAgentKey } = await loadConfig();
    expect(() => getOwsAgentKey()).toThrow(/Agent token file not found/);
  });

  it("throws when token has invalid prefix", async () => {
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;
    writeFileSync(join(tempVault, "reward-agent.token"), "bad-token\n", {
      mode: 0o600,
    });

    const { getOwsAgentKey } = await loadConfig();
    expect(() => getOwsAgentKey()).toThrow(/Invalid agent token/);
  });
});

describe("writeAgentTokenFile", () => {
  let tempVault: string;

  afterEach(() => {
    if (tempVault) {
      rmSync(tempVault, { recursive: true, force: true });
    }
    vi.resetModules();
  });

  it("writes token with ows_key prefix to vault", async () => {
    vi.mock("server-only", () => ({}));
    tempVault = mkdtempSync(join(tmpdir(), "ows-vault-"));
    process.env.OWS_VAULT_PATH = tempVault;

    const { writeAgentTokenFile } = await import("@/lib/ows/config");
    writeAgentTokenFile("ows_key_demo");

    const contents = readFileSync(
      join(tempVault, "reward-agent.token"),
      "utf8"
    ).trim();
    expect(contents).toBe("ows_key_demo");
  });
});
