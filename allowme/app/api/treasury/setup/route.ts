import { NextResponse } from "next/server";

import { runMigrations } from "@/lib/db";
import { setupTreasury } from "@/lib/ows/treasury";
import { getAgentTokenFilePath } from "@/lib/ows/config";

runMigrations();

export async function POST() {
  try {
    const result = await setupTreasury();

    return NextResponse.json({
      walletName: result.walletName,
      address: result.address,
      agentKeyId: result.agentKeyId,
      agentKeyName: result.agentKeyName,
      credentials: result.credentials,
      tokenFile: getAgentTokenFilePath(),
      message:
        "Treasury wallet, Monad testnet policy, and agent credentials provisioned via local OWS fork.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
