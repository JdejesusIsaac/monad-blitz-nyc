import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

function ArrowIcon() {
return (
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
<path
d="M3 8h10M9 4l4 4-4 4"
stroke="currentColor"
strokeWidth="1.5"
strokeLinecap="round"
strokeLinejoin="round"
/>
</svg>
);
}

export default function Home() {
return (
<main className={`${inter.className} min-h-screen overflow-hidden`}>
<nav className="absolute left-0 top-0 z-30 flex w-full items-center justify-between px-6 py-6 md:px-10">
<Link
href="/"
className="text-white"
style={{ fontWeight: 800, letterSpacing: "-0.04em", fontSize: 24 }}
>
AllowMe
</Link>

<div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/30 px-4 py-2 text-white backdrop-blur-md">
<span className="h-2 w-2 rounded-full bg-green-400 shadow-[0_0_14px_rgba(74,222,128,0.9)]" />
<span style={{ fontSize: 13, fontWeight: 600 }}>
Powered by Monad
</span>
</div>
</nav>

<section className="relative flex min-h-screen flex-col md:flex-row">
<div className="relative flex min-h-screen flex-1 items-center overflow-hidden bg-[linear-gradient(135deg,#080f09_0%,#0b1a0e_52%,#0d2010_100%)] px-6 py-28 md:px-12 lg:px-20">
<div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(rgba(74,222,128,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(74,222,128,0.7)_1px,transparent_1px)] [background-size:36px_36px]" />
<div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-green-400 opacity-[0.12] blur-3xl" />

<div className="relative z-10 max-w-xl">
<div className="mb-6 inline-flex rounded-full border border-green-400/25 bg-green-400/10 px-4 py-2 text-green-400">
<span style={{ fontSize: 12, fontWeight: 600 }}>
FOR INSTITUTIONS
</span>
</div>

<h1
className="text-white"
style={{
fontSize: "clamp(2rem, 4vw, 3rem)",
lineHeight: 1.1,
letterSpacing: "-0.03em",
fontWeight: 800,
}}
>
Power Learning
<br />
<span className="bg-gradient-to-r from-[#4ade80] to-[#22c55e] bg-clip-text text-transparent">
Economies
</span>
</h1>

<p
className="mt-6 max-w-md text-white/55"
style={{ fontSize: 18, lineHeight: 1.65, fontWeight: 500 }}
>
Create a treasury. Define rewards. Let verified learning trigger
automatic USDC payouts on Monad.
</p>

<Link
href="/institution"
className="mt-9 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#16a34a] to-[#15803d] px-7 py-4 text-white shadow-[0_0_32px_rgba(34,197,94,0.35)] transition hover:scale-[1.03] active:scale-[0.98]"
style={{ fontWeight: 600 }}
>
Launch Institution Dashboard
<ArrowIcon />
</Link>

<div className="mt-14 grid grid-cols-3 gap-5 border-t border-white/10 pt-6">
{[
["$0 fees", "On-chain payouts"],
["~1s", "Monad finality"],
["USDC", "Stablecoin rewards"],
].map(([value, label]) => (
<div key={value}>
<div style={{ color: "#4ade80", fontWeight: 700 }}>
{value}
</div>
<div
className="text-white/35"
style={{ fontSize: 13, fontWeight: 400 }}
>
{label}
</div>
</div>
))}
</div>
</div>
</div>

<div className="pointer-events-none absolute left-1/2 top-0 z-20 hidden h-full w-px bg-gradient-to-b from-transparent via-[#d1fae5] to-transparent md:block" />

<div className="relative flex min-h-screen flex-1 items-center overflow-hidden bg-white px-6 py-28 md:px-12 lg:px-20">
<div className="pointer-events-none absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#16a34a_1px,transparent_1px)] [background-size:22px_22px]" />
<div className="pointer-events-none absolute -bottom-36 -right-36 h-96 w-96 rounded-full bg-green-400 opacity-[0.08] blur-3xl" />

<div className="relative z-10 max-w-xl">
<div className="mb-6 inline-flex rounded-full border border-[#bbf7d0] bg-[#f0fdf4] px-4 py-2 text-[#15803d]">
<span style={{ fontSize: 12, fontWeight: 600 }}>
FOR LEARNERS
</span>
</div>

<h1
style={{
color: "#0a0f0a",
fontSize: "clamp(2rem, 4vw, 3rem)",
lineHeight: 1.1,
letterSpacing: "-0.03em",
fontWeight: 800,
}}
>
Earn While You{" "}
<span className="bg-gradient-to-r from-[#16a34a] to-[#15803d] bg-clip-text text-transparent">
Learn
</span>
</h1>

<p
className="mt-6 max-w-md text-[#52525b]"
style={{ fontSize: 18, lineHeight: 1.65, fontWeight: 500 }}
>
Complete courses. Get verified. Receive USDC instantly on Monad.
</p>

<Link
href="/learner"
className="mt-9 inline-flex items-center gap-2 rounded-xl bg-[#0a0f0a] px-7 py-4 text-white shadow-[0_18px_45px_rgba(10,15,10,0.18)] transition hover:scale-[1.03] active:scale-[0.98]"
style={{ fontWeight: 600 }}
>
Start Learning
<ArrowIcon />
</Link>

<div className="mt-14 flex flex-wrap gap-3 border-t border-zinc-200 pt-6">
{[
"✓ On-chain verification",
"✓ Instant USDC payouts",
"✓ No wallet friction",
].map((chip) => (
<span
key={chip}
className="rounded-full bg-[#f4f4f5] px-4 py-2 text-[#52525b]"
style={{ fontSize: 14, fontWeight: 500 }}
>
{chip}
</span>
))}
</div>
</div>
</div>
</section>
</main>
);
}
