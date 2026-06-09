"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { formatMon } from "@/lib/monad/config";

const G = {
  primary: "#16a34a",
  dark: "#15803d",
  bg: "#f0fdf4",
  border: "#bbf7d0",
  btnGrad: "linear-gradient(135deg, #16a34a, #15803d)",
};

function getBadge(pct: number) {
  if (pct === 100)
    return { label: "AI Master", emoji: "🏆", color: "#854d0e", bg: "#fef9c3", border: "#fde047" };
  if (pct >= 88)
    return { label: "AI Pro", emoji: "⭐", color: G.dark, bg: G.bg, border: G.border };
  if (pct >= 70)
    return { label: "AI Explorer", emoji: "🔍", color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4" };
  return { label: "AI Learner", emoji: "📘", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" };
}

export function SuccessPage() {
  const searchParams = useSearchParams();
  const score = Number(searchParams.get("score") ?? "0");
  const txHash = searchParams.get("tx") ?? "";
  const explorerLink =
    searchParams.get("explorer") ??
    (txHash ? `https://testnet.monadvision.com/tx/${txHash}` : "");
  const amount = searchParams.get("amount") ?? "1000000";
  const amountDisplay =
    searchParams.get("amountDisplay") ??
    formatMon(BigInt(amount));

  const badge = getBadge(score);

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}
    >
      <div
        className="flex w-full max-w-lg flex-col items-center gap-6 rounded-2xl bg-white p-10"
        style={{ border: "1px solid #e5e7eb", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}
      >
        <div
          className="flex h-28 w-28 flex-col items-center justify-center rounded-full"
          style={{ background: G.btnGrad }}
        >
          <div style={{ fontWeight: 800, fontSize: "2rem", color: "#fff", lineHeight: 1 }}>
            {score}%
          </div>
          <div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>
            passed
          </div>
        </div>

        <div
          className="flex items-center gap-2 rounded-full px-5 py-2"
          style={{ background: badge.bg, border: `1px solid ${badge.border}` }}
        >
          <span style={{ fontSize: "1.1rem" }}>{badge.emoji}</span>
          <span style={{ fontWeight: 700, fontSize: "0.9rem", color: badge.color }}>
            {badge.label}
          </span>
        </div>

        <div className="text-center">
          <div
            style={{
              fontWeight: 800,
              fontSize: "1.35rem",
              color: "#111827",
              letterSpacing: "-0.02em",
            }}
          >
            Reward Sent!
          </div>
          <div
            style={{
              fontSize: "0.85rem",
              color: "#6b7280",
              marginTop: "6px",
              lineHeight: 1.6,
            }}
          >
            You earned {amountDisplay} for completing AI Ethics 101. Your payout is
            confirmed on Monad testnet.
          </div>
        </div>

        {txHash ? (
          <a
            href={explorerLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center justify-between rounded-xl px-4 py-3 transition-opacity hover:opacity-80"
            style={{ background: G.bg, border: `1px solid ${G.border}`, textDecoration: "none" }}
          >
            <span style={{ fontSize: "0.75rem", color: G.dark, fontWeight: 600 }}>
              View transaction
            </span>
            <span
              style={{
                fontFamily: "monospace",
                fontSize: "0.78rem",
                color: "#374151",
                fontWeight: 600,
              }}
            >
              {txHash.slice(0, 10)}…{txHash.slice(-8)}
            </span>
          </a>
        ) : null}

        <div className="flex w-full flex-col gap-3">
          <Link
            href="/learner"
            className="w-full rounded-xl py-3.5 text-center transition-all hover:scale-[1.02]"
            style={{
              background: G.btnGrad,
              color: "#fff",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              boxShadow: "0 4px 16px rgba(22,163,74,0.25)",
            }}
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
            style={{
              fontSize: "0.8rem",
              color: "#9ca3af",
              fontWeight: 500,
              textDecoration: "none",
              textAlign: "center",
            }}
            className="transition-colors hover:text-gray-600"
          >
            ← Home
          </Link>
        </div>
      </div>
    </div>
  );
}
