"use client";

import Link from "next/link";
import { useState } from "react";

// ─── Wagmi stub ───────────────────────────────────────────────────────────────
// In Next.js replace these three lines with real wagmi imports:
// import { useAccount, useConnect, useDisconnect } from "wagmi"
// import { injected } from "wagmi/connectors"
// Then swap useWalletStub() calls for useAccount() / useConnect() / useDisconnect()
function useWalletStub() {
const [address, setAddress] = useState<string | null>(null);
const connect = () => setAddress("0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0");
const disconnect = () => setAddress(null);
return { address, isConnected: !!address, connect, disconnect };
}

function truncate(addr: string) {
return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ─── Static data ──────────────────────────────────────────────────────────────
const AVAILABLE_COURSES = [
{
id: "ai-ethics-101",
title: "AI Ethics 101",
description: "Explore the foundations of responsible AI — bias, fairness, transparency, and societal impact.",
sections: 5,
questions: 17,
reward: "0.01 MON",
difficulty: "Beginner",
duration: "~25 min",
},
];

const COMPLETED_COURSES = [
{
id: "web3-basics",
title: "Web3 Fundamentals",
sections: 4,
questions: 12,
reward: "0.01 MON",
score: 94,
hash: "0xabc123def456789abc123def456789ab",
hashShort: "0xabc1...9ab",
completedAt: "2025-06-08",
},
{
id: "crypto-intro",
title: "Intro to Cryptography",
sections: 3,
questions: 10,
reward: "0.01 MON",
score: 88,
hash: "0xfed987cba654321fed987cba654321fe",
hashShort: "0xfed9...1fe",
completedAt: "2025-06-06",
},
];

const PAYOUTS = [
{ course: "Web3 Fundamentals", amount: "0.01 MON", hash: "0xabc123def456789abc123def456789ab", hashShort: "0xabc1...9ab", date: "2025-06-08" },
{ course: "Intro to Cryptography", amount: "0.01 MON", hash: "0xfed987cba654321fed987cba654321fe", hashShort: "0xfed9...1fe", date: "2025-06-06" },
];

const NAV_ITEMS = [
{
label: "Dashboard",
icon: (
<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
<rect x="1" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
<rect x="10.5" y="1" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
<rect x="1" y="10.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
<rect x="10.5" y="10.5" width="5.5" height="5.5" rx="1.5" stroke="currentColor" strokeWidth="1.4" />
</svg>
),
},
{
label: "My Courses",
icon: (
<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
<path d="M2 5h13M2 9h13M2 13h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
</svg>
),
},
{
label: "Earnings",
icon: (
<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
<circle cx="8.5" cy="8.5" r="6.5" stroke="currentColor" strokeWidth="1.4" />
<path d="M8.5 5v7M6 6.8C6 5.8 7.1 5 8.5 5s2.5.8 2.5 1.8c0 1.9-5 1.9-5 3.7 0 1 1.1 1.8 2.5 1.8s2.5-.8 2.5-1.8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
</svg>
),
},
{
label: "Profile",
icon: (
<svg width="17" height="17" viewBox="0 0 17 17" fill="none">
<circle cx="8.5" cy="6" r="3" stroke="currentColor" strokeWidth="1.4" />
<path d="M2 15c0-3.3 2.9-6 6.5-6s6.5 2.7 6.5 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
</svg>
),
},
];

// ─── Connect Wallet button ────────────────────────────────────────────────────
function ConnectWalletButton({
address,
isConnected,
connect,
disconnect,
}: {
address: string | null;
isConnected: boolean;
connect: () => void;
disconnect: () => void;
}) {
const [open, setOpen] = useState(false);

if (isConnected && address) {
return (
<div className="relative">
<button
onClick={() => setOpen((v) => !v)}
className="flex items-center gap-2 rounded-lg px-4 py-2 transition-colors hover:bg-gray-100"
style={{ background: "#f3f4f6", border: "1px solid #e5e7eb", fontWeight: 600, fontSize: "0.82rem", color: "#374151", cursor: "pointer" }}
>
<span
className="w-2 h-2 rounded-full shrink-0"
style={{ background: "#4ade80", boxShadow: "0 0 5px 1px rgba(74,222,128,0.55)" }}
/>
<span style={{ fontFamily: "monospace" }}>{truncate(address)}</span>
<svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: "#9ca3af" }}>
<path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</button>

{open && (
<div
className="absolute right-0 mt-1 rounded-xl py-1 z-20"
style={{ background: "#fff", border: "1px solid #e5e7eb", boxShadow: "0 8px 24px rgba(0,0,0,0.1)", minWidth: "190px" }}
>
<div className="px-4 py-2.5" style={{ borderBottom: "1px solid #f3f4f6" }}>
<div style={{ fontSize: "0.68rem", color: "#9ca3af", fontWeight: 600, letterSpacing: "0.07em" }}>CONNECTED</div>
<div style={{ fontSize: "0.78rem", color: "#374151", fontWeight: 500, fontFamily: "monospace", marginTop: "2px" }}>
{truncate(address)}
</div>
</div>
<button
onClick={() => { disconnect(); setOpen(false); }}
className="w-full text-left px-4 py-2 transition-colors hover:bg-red-50"
style={{ fontSize: "0.82rem", color: "#dc2626", fontWeight: 500, border: "none", background: "transparent", cursor: "pointer" }}
>
Disconnect
</button>
</div>
)}
</div>
);
}

return (
<button
onClick={connect}
className="flex items-center gap-2 rounded-lg px-4 py-2 transition-all hover:scale-[1.02]"
style={{
background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)",
color: "#fff",
fontWeight: 600,
fontSize: "0.82rem",
border: "none",
cursor: "pointer",
boxShadow: "0 2px 12px rgba(79,70,229,0.3)",
}}
>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<rect x="1" y="4" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.3" />
<path d="M10 8a1 1 0 110-2 1 1 0 010 2z" fill="currentColor" />
<path d="M4 4V3a3 3 0 016 0v1" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
</svg>
Connect Wallet
</button>
);
}

// ─── Main component ───────────────────────────────────────────────────────────
export function LearnerDashboard() {
const [activeNav, setActiveNav] = useState("Dashboard");
const { address, isConnected, connect, disconnect } = useWalletStub();

return (
<div className="flex size-full min-h-screen" style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}>

{/* ── Sidebar ───────────────────────────────────────────────────── */}
<aside className="flex flex-col w-52 shrink-0 min-h-screen" style={{ background: "#fff", borderRight: "1px solid #e5e7eb" }}>
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

{/* Wallet status in sidebar */}
<div className="px-4 pb-5">
<div className="rounded-xl p-3" style={{ background: "#f3f4f6" }}>
<div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "4px" }}>
LEARNER
</div>
{isConnected && address ? (
<>
<div style={{ fontSize: "0.78rem", fontWeight: 600, color: "#374151", fontFamily: "monospace" }}>
{truncate(address)}
</div>
<div style={{ fontSize: "0.72rem", color: "#16a34a", marginTop: "2px", fontWeight: 500 }}>
Wallet connected ✓
</div>
</>
) : (
<div style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 500 }}>Not connected</div>
)}
</div>
</div>
</aside>

{/* ── Main ──────────────────────────────────────────────────────── */}
<main className="flex-1 flex flex-col overflow-auto">

{/* Header */}
<header className="flex items-center justify-between px-8 py-4 bg-white" style={{ borderBottom: "1px solid #e5e7eb" }}>
<div>
<h1 style={{ fontWeight: 800, fontSize: "1.15rem", color: "#111827", letterSpacing: "-0.02em" }}>
Learner Dashboard
</h1>
<p style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 400, marginTop: "1px" }}>
Complete courses. Get verified. Receive MON.
</p>
</div>
<ConnectWalletButton
address={address}
isConnected={isConnected}
connect={connect}
disconnect={disconnect}
/>
</header>

<div className="flex-1 px-8 py-7 flex flex-col gap-7">

{/* Payout address banner — only shown when wallet connected */}
{isConnected && address && (
<div
className="flex items-center gap-2 rounded-xl px-4 py-3"
style={{ background: "#f0fdf4", border: "1px solid #bbf7d0" }}
>
<svg width="15" height="15" viewBox="0 0 15 15" fill="none">
<circle cx="7.5" cy="7.5" r="6.5" stroke="#16a34a" strokeWidth="1.3" />
<path d="M5 7.5l2 2 3-3" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
</svg>
<span style={{ fontSize: "0.8rem", color: "#15803d", fontWeight: 500 }}>
MON payouts will be sent to{" "}
<span style={{ fontFamily: "monospace", fontWeight: 700 }}>{truncate(address)}</span>
</span>
</div>
)}

{/* ── Stats row ─────────────────────────────────────────────── */}
<div className="grid grid-cols-4 gap-4">
{/* Total earned — accent */}
<div
className="rounded-2xl p-5 flex flex-col justify-between"
style={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", color: "#fff" }}
>
<div style={{ fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.09em", opacity: 0.7 }}>
TOTAL EARNED
</div>
<div>
<div style={{ fontWeight: 800, fontSize: "2rem", letterSpacing: "-0.03em", lineHeight: 1 }}>
2.00
</div>
<div style={{ fontSize: "0.8rem", fontWeight: 600, opacity: 0.75, marginTop: "2px" }}>MON</div>
</div>
<div style={{ fontSize: "0.72rem", opacity: 0.6, fontWeight: 500 }}>2 courses completed</div>
</div>

{[
{ label: "Courses Completed", value: "2", sub: "of 3 available" },
{ label: "Avg Score", value: "91%", sub: "across all quizzes" },
{ label: "On-chain Txns", value: "2", sub: "all confirmed on Monad" },
].map((s) => (
<div key={s.label} className="rounded-2xl bg-white p-5" style={{ border: "1px solid #e5e7eb" }}>
<div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "10px", textTransform: "uppercase" }}>
{s.label}
</div>
<div style={{ fontWeight: 800, fontSize: "1.45rem", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
{s.value}
</div>
<div style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500, marginTop: "6px" }}>{s.sub}</div>
</div>
))}
</div>

{/* ── Courses row ───────────────────────────────────────────── */}
<div className="flex gap-6 items-start">

{/* Available courses */}
<div className="flex flex-col gap-3 shrink-0" style={{ width: "320px" }}>
<div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>Available Courses</div>
{AVAILABLE_COURSES.map((course) => (
<div
key={course.id}
className="rounded-2xl bg-white p-5 flex flex-col gap-4"
style={{ border: "1px solid #e5e7eb" }}
>
<div className="flex items-start justify-between gap-2">
<div>
<div style={{ fontWeight: 700, fontSize: "0.92rem", color: "#111827" }}>{course.title}</div>
<div style={{ fontSize: "0.74rem", color: "#9ca3af", marginTop: "3px", lineHeight: 1.55 }}>
{course.description}
</div>
</div>
<span
className="rounded-full px-2.5 py-0.5 shrink-0"
style={{ background: "#f0fdf4", color: "#15803d", fontSize: "0.68rem", fontWeight: 700, border: "1px solid #bbf7d0" }}
>
{course.difficulty}
</span>
</div>

{/* Meta chips */}
<div className="flex items-center gap-3 flex-wrap">
{[
{ icon: "📚", text: `${course.sections} sections` },
{ icon: "❓", text: `${course.questions} questions` },
{ icon: "⏱", text: course.duration },
].map((m) => (
<span key={m.text} className="flex items-center gap-1" style={{ fontSize: "0.74rem", color: "#6b7280", fontWeight: 500 }}>
<span style={{ fontSize: "0.7rem" }}>{m.icon}</span>
{m.text}
</span>
))}
</div>

<div
className="flex items-center justify-between pt-3"
style={{ borderTop: "1px solid #f3f4f6" }}
>
<span
className="rounded-full px-3 py-1"
style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "0.78rem", fontWeight: 700, border: "1px solid #bbf7d0" }}
>
{course.reward} on completion
</span>
<Link
href="/learner/quiz"
className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2 transition-all hover:scale-[1.03]"
style={{
background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
color: "#fff",
fontWeight: 600,
fontSize: "0.8rem",
textDecoration: "none",
boxShadow: "0 2px 10px rgba(79,70,229,0.3)",
}}
>
Start Quiz
<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
<path d="M2.5 6.5h8M7 3l3.5 3.5L7 10" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</Link>
</div>
</div>
))}
</div>

{/* Completed courses */}
<div className="flex flex-col gap-3 flex-1">
<div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>Completed Courses</div>
{COMPLETED_COURSES.map((course) => (
<div
key={course.id}
className="rounded-2xl bg-white p-5 flex flex-col gap-3"
style={{ border: "1px solid #e5e7eb" }}
>
<div className="flex items-start justify-between gap-3">
<div className="flex items-center gap-3">
<div
className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
style={{ background: "#dcfce7" }}
>
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
<path d="M3.5 8.5l3 3L12.5 5" stroke="#16a34a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</div>
<div>
<div style={{ fontWeight: 700, fontSize: "0.88rem", color: "#111827" }}>{course.title}</div>
<div style={{ fontSize: "0.73rem", color: "#9ca3af", marginTop: "1px" }}>
{course.sections} sections · {course.questions} questions
</div>
</div>
</div>
<div className="flex items-center gap-2 shrink-0">
<span
className="rounded-full px-2.5 py-0.5"
style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.72rem", fontWeight: 700 }}
>
{course.score}% score
</span>
<span
className="rounded-full px-2.5 py-0.5"
style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "0.72rem", fontWeight: 600, border: "1px solid #bbf7d0" }}
>
{course.reward} paid
</span>
</div>
</div>

<div
className="flex items-center justify-between pt-2"
style={{ borderTop: "1px solid #f3f4f6" }}
>
<span style={{ fontSize: "0.73rem", color: "#9ca3af" }}>Completed {course.completedAt}</span>
<a
href={`https://testnet.monadvision.com/tx/${course.hash}`}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center gap-1 transition-opacity hover:opacity-60"
style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}
>
{course.hashShort}
<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
<path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</a>
</div>
</div>
))}
</div>
</div>

{/* ── Coming Soon modules ───────────────────────────────────── */}
<div className="flex flex-col gap-4">
<div className="flex items-center justify-between">
<div>
<div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>Upcoming Modules</div>
<div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>New courses dropping weekly — stay tuned</div>
</div>
<button
className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 transition-all hover:scale-[1.02]"
style={{
background: "linear-gradient(135deg, #4f46e5, #7c3aed)",
color: "#fff",
fontWeight: 600,
fontSize: "0.8rem",
border: "none",
cursor: "pointer",
boxShadow: "0 2px 10px rgba(79,70,229,0.3)",
}}
>
<svg width="13" height="13" viewBox="0 0 13 13" fill="none">
<path d="M6.5 1v11M1 6.5h11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
</svg>
Build Custom Module
</button>
</div>
<div className="grid grid-cols-4 gap-4">
{[
{ week: "Week 1", title: "Explorer", icon: "🔭", desc: "Navigate the AI landscape and discover how models learn from data." },
{ week: "Week 2", title: "Creativity", icon: "🎨", desc: "Use AI as a creative partner — art, writing, music, and design." },
{ week: "Week 3", title: "Future Leader Skills", icon: "🚀", desc: "Lead AI-powered teams and make ethical technology decisions." },
{ week: "Week 4", title: "Builder", icon: "🛠️", desc: "Build your first AI-powered tool with no prior coding required." },
].map((module) => (
<div
key={module.week}
className="rounded-2xl p-5 flex flex-col gap-3 relative overflow-hidden"
style={{ background: "#fff", border: "1px solid #e5e7eb", opacity: 0.85 }}
>
<div className="absolute top-3 right-3 rounded-full px-2.5 py-0.5" style={{ background: "#f3f4f6", color: "#9ca3af", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em" }}>
COMING SOON
</div>
<div style={{ fontSize: "1.6rem", lineHeight: 1 }}>{module.icon}</div>
<div>
<div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "3px" }}>
{module.week.toUpperCase()}
</div>
<div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#374151" }}>{module.title}</div>
</div>
<div style={{ fontSize: "0.75rem", color: "#9ca3af", lineHeight: 1.55 }}>{module.desc}</div>
<div className="mt-auto rounded-lg py-2 text-center" style={{ background: "#f9fafb", color: "#d1d5db", fontSize: "0.78rem", fontWeight: 600, border: "1px solid #f3f4f6" }}>
Notify Me
</div>
</div>
))}
</div>
</div>

{/* ── Recent payouts table ──────────────────────────────────── */}
<div className="rounded-2xl bg-white overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
<div
className="flex items-center justify-between px-6 py-4"
style={{ borderBottom: "1px solid #f3f4f6" }}
>
<span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Recent Payouts</span>
<span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>Monad Testnet</span>
</div>
<table className="w-full">
<thead>
<tr style={{ background: "#fafafa" }}>
{["Course", "Amount", "Tx Hash", "Date"].map((col) => (
<th
key={col}
className="text-left px-6 py-3"
style={{ fontSize: "0.68rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase" }}
>
{col}
</th>
))}
</tr>
</thead>
<tbody>
{PAYOUTS.map((row, i) => (
<tr
key={i}
className="hover:bg-gray-50 transition-colors"
style={{ borderTop: "1px solid #f3f4f6" }}
>
<td className="px-6 py-4" style={{ fontSize: "0.83rem", color: "#374151", fontWeight: 500 }}>
{row.course}
</td>
<td className="px-6 py-4">
<span
className="rounded-full px-2.5 py-0.5"
style={{ background: "#f0fdf4", color: "#16a34a", fontSize: "0.75rem", fontWeight: 600 }}
>
{row.amount}
</span>
</td>
<td className="px-6 py-4">
<a
href={`https://testnet.monadvision.com/tx/${row.hash}`}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center gap-1 transition-opacity hover:opacity-60"
style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#4f46e5", fontWeight: 500, textDecoration: "none" }}
>
{row.hashShort}
<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
<path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</a>
</td>
<td className="px-6 py-4" style={{ fontSize: "0.78rem", color: "#9ca3af" }}>
{row.date}
</td>
</tr>
))}
</tbody>
</table>
</div>

</div>
</main>
</div>
);
}
