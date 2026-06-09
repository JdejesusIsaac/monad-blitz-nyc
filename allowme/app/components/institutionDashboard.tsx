"use client";

import Link from "next/link";
import { useState } from "react";

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
<path
d="M9 5.5v7M6.5 7.5C6.5 6.4 7.6 5.5 9 5.5s2.5.9 2.5 2c0 2-5 2-5 4 0 1.1 1.1 2 2.5 2s2.5-.9 2.5-2"
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
/>
</svg>
),
},
{
label: "Settings",
icon: (
<svg width="18" height="18" viewBox="0 0 18 18" fill="none">
<circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
<path
d="M9 1.5v2M9 14.5v2M1.5 9h2M14.5 9h2M3.4 3.4l1.4 1.4M13.2 13.2l1.4 1.4M3.4 14.6l1.4-1.4M13.2 4.8l1.4-1.4"
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
/>
</svg>
),
},
];

const STATS = [
{ label: "Total Completions", value: "1,284", delta: "+38 this week", up: true },
{ label: "Rewards Sent", value: "$1,284 USDC", delta: "+$38 today", up: true },
{ label: "Treasury Balance", value: "1,000 USDC", delta: "Funded", up: true },
{ label: "Daily Cap Remaining", value: "$500 USDC", delta: "Resets in 14h", up: null },
];

const PAYOUTS = [
{
address: "0xA1b2...C3d4",
course: "AI Ethics 101",
amount: "$1 USDC",
hash: "0xabc123def456",
hashShort: "0xabc1...3def",
timestamp: "2025-06-09 14:22 UTC",
},
{
address: "0xE5f6...G7h8",
course: "AI Ethics 101",
amount: "$1 USDC",
hash: "0x789abc012def",
hashShort: "0x789a...2def",
timestamp: "2025-06-09 13:58 UTC",
},
{
address: "0xI9j0...K1l2",
course: "AI Ethics 101",
amount: "$1 USDC",
hash: "0xfed321cba987",
hashShort: "0xfed3...a987",
timestamp: "2025-06-09 13:41 UTC",
},
];

export function InstitutionDashboard() {
const [activeNav, setActiveNav] = useState("Dashboard");

return (
<div
className="flex size-full min-h-screen"
style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}
>
{/* ── Sidebar ─────────────────────────────────────────────────────── */}
<aside
className="flex flex-col w-56 shrink-0 min-h-screen"
style={{ background: "#fff", borderRight: "1px solid #e5e7eb" }}
>
{/* Logo */}
<Link
href="/"
className="flex items-center gap-2 px-5 py-5"
style={{ borderBottom: "1px solid #f3f4f6" }}
>
<div
className="w-7 h-7 rounded-lg flex items-center justify-center"
style={{ background: "linear-gradient(135deg, #4f46e5, #7c3aed)" }}
>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M7 1L13 4.5v5L7 13 1 9.5v-5L7 1z" fill="white" fillOpacity="0.9" />
</svg>
</div>
<span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827", letterSpacing: "-0.01em" }}>
AllowMe
</span>
</Link>

{/* Nav items */}
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

{/* Institution badge */}
<div className="px-4 pb-5">
<div className="rounded-xl p-3" style={{ background: "#f3f4f6" }}>
<div style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em", marginBottom: "4px" }}>
INSTITUTION
</div>
<div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#374151" }}>NYPL AI Training</div>
<div style={{ fontSize: "0.72rem", color: "#9ca3af", marginTop: "2px" }}>Verified ✓</div>
</div>
</div>
</aside>

{/* ── Main ────────────────────────────────────────────────────────── */}
<main className="flex-1 flex flex-col overflow-auto">
{/* Top bar */}
<header
className="flex items-center justify-between px-8 py-4 bg-white"
style={{ borderBottom: "1px solid #e5e7eb" }}
>
<div>
<h1 style={{ fontWeight: 800, fontSize: "1.2rem", color: "#111827", letterSpacing: "-0.02em" }}>
NYPL AI Training Program
</h1>
<div className="flex items-center gap-3 mt-1.5">
{/* Treasury address */}
<span
className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1"
style={{
background: "#f3f4f6",
fontSize: "0.75rem",
fontWeight: 500,
color: "#6b7280",
fontFamily: "monospace",
}}
>
<svg width="12" height="12" viewBox="0 0 12 12" fill="none">
<rect x="1" y="3.5" width="10" height="7" rx="1.5" stroke="#9ca3af" strokeWidth="1.2" />
<path d="M4 3.5V3a2 2 0 014 0v.5" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
</svg>
0xd040...A7eD
</span>

{/* Funded balance */}
<span className="inline-flex items-center gap-1.5" style={{ fontSize: "0.75rem", fontWeight: 600, color: "#16a34a" }}>
<span
className="w-1.5 h-1.5 rounded-full"
style={{ background: "#4ade80", boxShadow: "0 0 4px 2px rgba(74,222,128,0.5)", flexShrink: 0 }}
/>
1,000 USDC Funded
</span>
</div>
</div>

<button
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
+ Fund Treasury
</button>
</header>

<div className="flex-1 px-8 py-7 flex flex-col gap-7">
{/* ── Stats row ─────────────────────────────────────────────── */}
<div className="grid grid-cols-4 gap-4">
{STATS.map((s) => (
<div
key={s.label}
className="rounded-2xl bg-white p-5"
style={{ border: "1px solid #e5e7eb" }}
>
<div
style={{
fontSize: "0.7rem",
fontWeight: 600,
color: "#9ca3af",
letterSpacing: "0.06em",
marginBottom: "10px",
textTransform: "uppercase",
}}
>
{s.label}
</div>
<div style={{ fontWeight: 800, fontSize: "1.4rem", color: "#111827", letterSpacing: "-0.02em", lineHeight: 1 }}>
{s.value}
</div>
<div
className="flex items-center gap-1 mt-2"
style={{
fontSize: "0.75rem",
fontWeight: 500,
color: s.up === true ? "#16a34a" : s.up === false ? "#dc2626" : "#9ca3af",
}}
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
<div
className="rounded-2xl bg-white p-6 flex flex-col gap-5 shrink-0"
style={{ border: "1px solid #e5e7eb", width: "300px" }}
>
<div className="flex items-center justify-between">
<span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Active Programs</span>
<span
className="rounded-full px-2.5 py-0.5"
style={{ background: "#ede9fe", color: "#6d28d9", fontSize: "0.72rem", fontWeight: 600 }}
>
1 Active
</span>
</div>

{/* Program item */}
<div
className="rounded-xl p-4 flex flex-col gap-3"
style={{ background: "#fafafa", border: "1px solid #f3f4f6" }}
>
<div className="flex items-start justify-between gap-2">
<div>
<div style={{ fontWeight: 700, fontSize: "0.9rem", color: "#111827" }}>AI Ethics 101</div>
<div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "2px" }}>Module · 4 lessons</div>
</div>
<span
className="rounded-full px-2.5 py-0.5 shrink-0"
style={{ background: "#dcfce7", color: "#15803d", fontSize: "0.7rem", fontWeight: 700 }}
>
Active
</span>
</div>

{/* Reward badge */}
<span
className="self-start rounded-full px-2.5 py-0.5"
style={{
background: "#f0fdf4",
color: "#16a34a",
fontSize: "0.75rem",
fontWeight: 600,
border: "1px solid #bbf7d0",
}}
>
$1 USDC reward
</span>

{/* Progress bar */}
<div>
<div
className="flex justify-between mb-1.5"
style={{ fontSize: "0.72rem", color: "#9ca3af", fontWeight: 500 }}
>
<span>Completions</span>
<span style={{ color: "#374151", fontWeight: 600 }}>1,284</span>
</div>
<div className="w-full rounded-full h-1.5" style={{ background: "#f3f4f6" }}>
<div
className="h-1.5 rounded-full"
style={{ width: "64%", background: "linear-gradient(90deg, #4f46e5, #7c3aed)" }}
/>
</div>
</div>

<button
className="w-full rounded-lg py-2 transition-colors hover:bg-gray-100"
style={{
background: "#f3f4f6",
color: "#374151",
fontWeight: 600,
fontSize: "0.8rem",
border: "none",
cursor: "pointer",
}}
>
View Policy
</button>
</div>

<button
className="w-full rounded-xl py-2.5 transition-colors hover:bg-violet-50"
style={{
background: "transparent",
color: "#7c3aed",
fontWeight: 600,
fontSize: "0.82rem",
border: "1.5px dashed #ddd6fe",
cursor: "pointer",
}}
>
+ Add Program
</button>
</div>

{/* ── Payout history table ─────────────────────────────────── */}
<div
className="flex-1 rounded-2xl bg-white overflow-hidden"
style={{ border: "1px solid #e5e7eb" }}
>
<div
className="flex items-center justify-between px-6 py-4"
style={{ borderBottom: "1px solid #f3f4f6" }}
>
<span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>Payout History</span>
<span style={{ fontSize: "0.75rem", color: "#9ca3af", fontWeight: 500 }}>Last 24 hours</span>
</div>

<table className="w-full">
<thead>
<tr style={{ background: "#fafafa" }}>
{["Learner Address", "Course", "Amount", "Tx Hash", "Timestamp"].map((col) => (
<th
key={col}
className="text-left px-6 py-3"
style={{ fontSize: "0.7rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.07em" }}
>
{col.toUpperCase()}
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
<td
className="px-6 py-4"
style={{ fontFamily: "monospace", fontSize: "0.8rem", color: "#374151", fontWeight: 500 }}
>
{row.address}
</td>
<td className="px-6 py-4" style={{ fontSize: "0.82rem", color: "#374151", fontWeight: 500 }}>
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
href={`https://testnet.monadexplorer.com/tx/${row.hash}`}
target="_blank"
rel="noopener noreferrer"
className="inline-flex items-center gap-1 transition-opacity hover:opacity-60"
style={{
fontFamily: "monospace",
fontSize: "0.78rem",
color: "#4f46e5",
fontWeight: 500,
textDecoration: "none",
}}
>
{row.hashShort}
<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
<path d="M2 9L9 2M9 2H5M9 2v4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</a>
</td>
<td className="px-6 py-4" style={{ fontSize: "0.78rem", color: "#9ca3af", fontWeight: 400 }}>
{row.timestamp}
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
</div>
</main>
</div>
);
}