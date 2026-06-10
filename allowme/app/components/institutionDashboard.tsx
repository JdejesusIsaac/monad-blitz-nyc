"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <rect x="1" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="1" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
        <rect x="11" y="11" width="6" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    label: "Programs",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path d="M2 4.5h14M2 9h14M2 13.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Treasury",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 5.5v7M6.5 7.5C6.5 6.4 7.6 5.5 9 5.5s2.5.9 2.5 2c0 2-5 2-5 4 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
];

function truncate(addr: string) {
  return addr.slice(0, 6) + "..." + addr.slice(-4);
}

function formatMon(weiStr: string | null | undefined): string {
  if (!weiStr || weiStr === "0") return "0 MON";
  const n = Number(BigInt(weiStr)) / 1e18;
  if (n === 0) return "0 MON";
  if (n >= 1) return `${n.toFixed(2)} MON`;
  return `${n.toFixed(4)} MON`;
}

type Program = {
  id: string;
  name: string;
  courseSlug: string;
  rewardAmountUsdc: string;
  dailyCapUsdc: string;
  completions: number;
  totalRewardedUsdc: string;
};

type Payout = {
  id: string;
  programId: string;
  learnerId: string;
  learnerWallet: string;
  amountUsdc: string;
  txHash: string | null;
  status: string;
  createdAt: string;
  explorerLink: string | null;
};

type DashboardData = {
  treasury: { address: string | null; balanceUsdc: string };
  programs: Program[];
  recentPayouts: Payout[];
};

export function InstitutionDashboard() {
  const [activeNav, setActiveNav] = useState("Dashboard");
  const [data, setData] = useState<DashboardData | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetch("/api/dashboard/institution")
      .then((r) => r.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const treasury = data?.treasury;
  const program = data?.programs[0];
  const recentPayouts = data?.recentPayouts ?? [];

  const totalCompletions = data?.programs.reduce((s, p) => s + p.completions, 0) ?? 0;
  const totalRewarded = data?.programs.reduce(
    (s, p) => s + BigInt(p.totalRewardedUsdc ?? "0"),
    0n
  ) ?? 0n;
  const treasuryBalance = BigInt(treasury?.balanceUsdc ?? "0");
  const treasuryFunded = treasuryBalance > 0n;

  const copyAddress = () => {
    if (!treasury?.address) return;
    navigator.clipboard.writeText(treasury.address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const STATS = [
    {
      label: "Total Completions",
      value: data ? totalCompletions.toLocaleString() : "—",
      delta: data ? `+${totalCompletions} total` : "Loading…",
      up: true,
    },
    {
      label: "Rewards Sent",
      value: data ? formatMon(totalRewarded.toString()) : "—",
      delta: data ? `${recentPayouts.length} payouts` : "Loading…",
      up: true,
    },
    {
      label: "Treasury Balance",
      value: data ? formatMon(treasury?.balanceUsdc) : "—",
      delta: data ? (treasuryFunded ? "Funded ✓" : "Needs funding") : "Loading…",
      up: treasuryFunded,
    },
    {
      label: "Reward Per Course",
      value: program ? formatMon(program.rewardAmountUsdc) : "—",
      delta: "AI Ethics 101",
      up: null,
    },
  ];

  return (
    <div className="flex size-full min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}>
      {/* ── Sidebar ─────────────────────────────────────────────────────── */}
      <aside className="flex flex-col w-56 shrink-0 min-h-screen" style={{ background: "#fff", borderRight: "1px solid #e5e7eb" }}>
        <Link href="/" className="flex items-center gap-2 px-5 py-5" style={{ borderBottom: "1px solid #f3f4f6" }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5v5L7 13 1 9.5v-5L7 1z" fill="white" fillOpacity="0.9" />
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", letterSpacing: "-0.01em" }}>AllowMe</span>
        </Link>

        <nav className="flex flex-col gap-1 px-3 pt-4 flex-1">
          {NAV_ITEMS.map((item) => {
            const active = activeNav === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveNav(item.label)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full text-left transition-colors duration-150"
                style={{
                  background: active ? "#ede9fe" : "transparent",
                  color: active ? "#5b21b6" : "#6b7280",
                  fontWeight: active ? 600 : 500,
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                <span style={{ color: active ? "#7c3aed" : "#9ca3af" }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="px-4 pb-5">
          <div className="rounded-xl p-3" style={{ background: "#f3f4f6" }}>
            <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "4px" }}>INSTITUTION</div>
            <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>NYPL AI Training</div>
            <div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>Verified ✓</div>
          </div>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-auto">
        {/* Top bar */}
        <header className="flex items-center justify-between px-8 py-4 bg-white" style={{ borderBottom: "1px solid #e5e7eb" }}>
          <div>
            <h1 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#111827", letterSpacing: "-0.02em" }}>
              NYPL AI Training Program
            </h1>
            <div className="flex items-center gap-3 mt-1.5">
              <span
                className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
                style={{ background: "#f3f4f6", fontSize: "0.75rem", fontWeight: 500, color: "#6b7280", fontFamily: "monospace", cursor: treasury?.address ? "pointer" : "default" }}
                onClick={copyAddress}
                title={treasury?.address ?? "Treasury not set up"}
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <rect x="1" y="3.5" width="10" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
                  <path d="M4 3.5V3a2 2 0 014 0v.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                {treasury?.address ? truncate(treasury.address) : "Not set up"}
              </span>

              <span className="inline-flex items-center gap-1.5" style={{ fontSize: "0.75rem", fontWeight: 600, color: treasuryFunded ? "#16a34a" : "#dc2626" }}>
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: treasuryFunded ? "#4ade80" : "#f87171",
                    boxShadow: treasuryFunded ? "0 0 4px 2px rgba(74,222,128,0.5)" : "none",
                    flexShrink: 0,
                  }}
                />
                {data ? (treasuryFunded ? `${formatMon(treasury?.balanceUsdc)} Funded` : "Needs MON") : "Loading…"}
              </span>
            </div>
          </div>

          <button
            onClick={copyAddress}
            className="rounded-lg px-4 py-2 transition-all hover:scale-[1.02]"
            style={{
              background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.825rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 2px 12px rgba(79,70,229,0.3)",
            }}
          >
            {copied ? "✓ Copied!" : "+ Fund Treasury"}
          </button>
        </header>

        <div className="flex-1 px-8 py-7 flex flex-col gap-7">
          {/* Treasury address hint when unfunded */}
          {data && !treasuryFunded && treasury?.address && (
            <div className="rounded-xl px-5 py-3.5 flex items-center justify-between gap-4" style={{ background: "#fff7ed", border: "1px solid #fed7aa" }}>
              <div>
                <span style={{ fontSize: "0.82rem", fontWeight: 600, color: "#c2410c" }}>Treasury needs MON to pay rewards. </span>
                <span style={{ fontSize: "0.82rem", color: "#9a3412" }}>Send testnet MON to: </span>
                <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "#92400e", fontWeight: 600 }}>{treasury.address}</span>
              </div>
              <button
                onClick={copyAddress}
                style={{ fontSize: "0.78rem", color: "#c2410c", fontWeight: 600, background: "none", border: "none", cursor: "pointer", whiteSpace: "nowrap" }}
              >
                {copied ? "Copied!" : "Copy address"}
              </button>
            </div>
          )}

          {/* ── Stats row ─────────────────────────────────────────────── */}
          <div className="grid grid-cols-4 gap-4">
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white p-5" style={{ border: "1px solid #e5e7eb" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "10px", textTransform: "uppercase" }}>
                  {s.label}
                </div>
                <div style={{ fontWeight: 800, fontSize: "1.4rem", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
                  {s.value}
                </div>
                <div
                  className="flex items-center gap-1 mt-2"
                  style={{ fontSize: "0.75rem", fontWeight: 500, color: s.up === true ? "#16a34a" : s.up === false ? "#dc2626" : "#9ca3af" }}
                >
                  {s.up === true && (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M6 9.5V2.5M3 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                  {s.delta}
                </div>
              </div>
            ))}
          </div>

          {/* ── Program card + Payout table ───────────────────────────── */}
          <div className="flex gap-5 items-start">
            {/* Program card */}
            <div className="rounded-2xl bg-white p-6 flex flex-col gap-5 shrink-0" style={{ border: "1px solid #e5e7eb", width: "300px" }}>
              <div className="flex items-center justify-between">
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Active Programs</span>
                <span className="rounded-full px-2.5 py-0.5" style={{ background: "#ede9fe", color: "#6d28d9", fontSize: "0.72rem", fontWeight: 600 }}>
                  {data ? `${data.programs.length} Active` : "—"}
                </span>
              </div>

              {program ? (
                <div className="rounded-xl p-4 flex flex-col gap-3" style={{ background: "#fafafa", border: "1px solid #f3f4f6" }}>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>AI Ethics 101</div>
                      <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>17 questions · 5 sections</div>
                    </div>
                    <span className="rounded-full px-2.5 py-0.5 shrink-0" style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.7rem", fontWeight: 700 }}>
                      Active
                    </span>
                  </div>

                  <span className="self-start rounded-full px-2.5 py-0.5" style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "0.75rem", fontWeight: 600, border: "1px solid #bbf7d0" }}>
                    {formatMon(program.rewardAmountUsdc)} reward
                  </span>

                  <div>
                    <div className="flex justify-between mb-1.5" style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500 }}>
                      <span>Completions</span>
                      <span style={{ color: "#374151", fontWeight: 600 }}>{program.completions.toLocaleString()}</span>
                    </div>
                    <div className="w-full rounded-full h-1.5" style={{ background: "#f3f4f6" }}>
                      <div
                        className="h-1.5 rounded-full"
                        style={{ width: `${Math.min(100, Math.max(2, (program.completions / 100) * 100))}%`, background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }}
                      />
                    </div>
                  </div>

                  <button
                    className="w-full rounded-lg py-2 transition-colors hover:bg-gray-100"
                    style={{ background: "#f3f4f6", color: "#374151", fontWeight: 600, fontSize: "0.8rem", border: "none", cursor: "pointer" }}
                  >
                    View Policy
                  </button>
                </div>
              ) : (
                <div className="rounded-xl p-4 flex items-center justify-center" style={{ background: "#fafafa", border: "1px solid #f3f4f6", height: "120px" }}>
                  <span style={{ fontSize: "0.82rem", color: "#9ca3af" }}>{data ? "No programs yet" : "Loading…"}</span>
                </div>
              )}

              <button
                className="w-full rounded-xl py-2.5 transition-colors hover:bg-violet-50"
                style={{ background: "transparent", color: "#7c3aed", fontWeight: 600, fontSize: "0.82rem", border: "1.5px dashed #ddd6fe", cursor: "pointer" }}
              >
                + Add Program
              </button>
            </div>

            {/* ── Payout history table ─────────────────────────────────── */}
            <div className="flex-1 rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: "1px solid #f3f4f6" }}>
                <span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Payout History</span>
                <span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>Monad Testnet</span>
              </div>

              {recentPayouts.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 gap-2">
                  <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                    <circle cx="16" cy="16" r="14" stroke="#e5e7eb" strokeWidth="2" />
                    <path d="M16 10v6M16 20v2" stroke="#d1d5db" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span style={{ fontSize: "0.85rem", color: "#9ca3af", fontWeight: 500 }}>
                    {data ? "No payouts yet — fund the treasury and learners can claim MON" : "Loading…"}
                  </span>
                </div>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr style={{ background: "#fafafa" }}>
                      {["Learner Address", "Course", "Amount", "Tx Hash", "Date"].map((col) => (
                        <th key={col} className="text-left px-6 py-3" style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em" }}>
                          {col.toUpperCase()}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {recentPayouts.map((row) => (
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors" style={{ borderTop: "1px solid #f3f4f6" }}>
                        <td className="px-6 py-4" style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}>
                          {truncate(row.learnerWallet)}
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500 }}>
                          AI Ethics 101
                        </td>
                        <td className="px-6 py-4">
                          <span className="rounded-full px-2.5 py-0.5" style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 }}>
                            {formatMon(row.amountUsdc)}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          {row.txHash ? (
                            <a
                              href={row.explorerLink ?? `https://testnet.monadvision.com/tx/${row.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 transition-opacity hover:opacity-60"
                              style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}
                            >
                              {truncate(row.txHash)}
                              <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                <path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
                              </svg>
                            </a>
                          ) : (
                            <span style={{ fontSize: "0.78rem", color: "#9ca3af" }}>—</span>
                          )}
                        </td>
                        <td className="px-6 py-4" style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
                          {new Date(row.createdAt).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
