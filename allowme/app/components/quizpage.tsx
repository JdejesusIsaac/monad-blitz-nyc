"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// ─── Wagmi stub ───────────────────────────────────────────────────────────────
// In Next.js replace with: import { useAccount } from "wagmi"
function useWalletStub() {
const [address] = useState<string | null>(
"0xA1b2C3d4E5f6A7b8C9d0E1f2A3b4C5d6E7f8A9b0"
);
return { address, isConnected: !!address };
}

function truncate(addr: string) {
return addr.slice(0, 6) + "..." + addr.slice(-4);
}

// ─── Green tokens ─────────────────────────────────────────────────────────────
const G = {
primary: "#16a34a",
dark: "#15803d",
light: "#4ade80",
bg: "#f0fdf4",
border: "#bbf7d0",
pill: "#dcfce7",
pillText: "#15803d",
selected: "#f0fdf4",
selBorder: "#16a34a",
selText: "#14532d",
selLabel: "#16a34a",
dot: "#86efac",
dotAnswered: "#4ade80",
shadow: "rgba(22,163,74,0.25)",
logoGrad: "linear-gradient(135deg, #16a34a, #15803d)",
btnGrad: "linear-gradient(135deg, #16a34a, #15803d)",
progressGrad: "linear-gradient(90deg, #22c55e, #16a34a)",
};

// ─── Quiz data ────────────────────────────────────────────────────────────────
type Question = {
id: number;
section: string;
text: string;
multi?: boolean;
options: string[];
correct: number | number[];
};

const QUESTIONS: Question[] = [
{
id: 1,
section: "Section 1 — Foundations of AI Ethics",
text: "Which of the following best defines AI ethics?",
options: [
"Rules that govern how AI systems are marketed",
"A field concerned with moral questions around the design, deployment, and impact of AI",
"A set of programming guidelines for writing cleaner code",
"Regulations mandating open-source AI models",
],
correct: 1,
},
{
id: 2,
section: "Section 1 — Foundations of AI Ethics",
text: "What does 'value alignment' mean in the context of AI?",
options: [
"Aligning the financial incentives of AI companies with government policy",
"Ensuring AI systems pursue goals that reflect human values and intentions",
"Making sure all AI models use the same dataset format",
"Synchronising model weights across distributed servers",
],
correct: 1,
},
{
id: 3,
section: "Section 1 — Foundations of AI Ethics",
text: "Why is human oversight important in AI systems?",
options: [
"It reduces the computational cost of inference",
"It ensures AI decisions can be reviewed, corrected, and held accountable",
"It speeds up the training process",
"It removes the need for data labelling",
],
correct: 1,
},
{
id: 4,
section: "Section 2 — Bias & Fairness",
text: "Algorithmic bias most commonly originates from:",
options: [
"Hardware defects in GPU clusters",
"Poor network connectivity during inference",
"Biased or unrepresentative training data",
"Using too many model parameters",
],
correct: 2,
},
{
id: 5,
section: "Section 2 — Bias & Fairness",
text: "A hiring algorithm consistently ranks candidates from certain universities lower. This is an example of:",
options: [
"Overfitting",
"Systematic bias causing disparate impact",
"Underfitting",
"Regularisation error",
],
correct: 1,
},
{
id: 6,
section: "Section 2 — Bias & Fairness",
text: "Which fairness criterion requires equal accuracy across demographic groups?",
options: [
"Individual fairness",
"Demographic parity",
"Equalised odds",
"Counterfactual fairness",
],
correct: 2,
},
{
id: 7,
section: "Section 2 — Bias & Fairness",
text: "The best way to detect bias in a deployed model is to:",
options: [
"Re-read the model architecture documentation",
"Increase the learning rate",
"Audit model outputs across subgroups using real-world data",
"Add more hidden layers",
],
correct: 2,
},
{
id: 8,
section: "Section 3 — Transparency & Explainability",
text: "What is a 'black-box' model?",
options: [
"A model trained exclusively on encrypted data",
"A model whose internal decision process is not interpretable by humans",
"A model stored on a private server",
"A model that only accepts binary input",
],
correct: 1,
},
{
id: 9,
section: "Section 3 — Transparency & Explainability",
text: "LIME and SHAP are tools used for:",
options: [
"Accelerating model training on TPUs",
"Compressing neural network weights",
"Generating synthetic training data",
"Explaining individual predictions of complex models",
],
correct: 3,
},
{
id: 10,
section: "Section 3 — Transparency & Explainability",
text: "The 'right to explanation' in the EU AI Act refers to:",
options: [
"A company's right to keep its model proprietary",
"The right of individuals affected by automated decisions to receive a meaningful explanation",
"A requirement to publish all training data",
"Mandatory open-sourcing of model weights",
],
correct: 1,
},
{
id: 11,
section: "Section 4 — Privacy & Data Rights",
text: "Which of the following are recognised privacy-preserving techniques? (Choose all that apply)",
multi: true,
options: [
"Differential privacy",
"Federated learning",
"Data minimisation",
"Homomorphic encryption",
],
correct: [0, 1, 2, 3],
},
{
id: 12,
section: "Section 4 — Privacy & Data Rights",
text: "Under GDPR, 'data minimisation' means:",
options: [
"Compressing data files to save storage",
"Collecting only the data that is strictly necessary for a specified purpose",
"Deleting all data after 30 days",
"Anonymising all data before training",
],
correct: 1,
},
{
id: 13,
section: "Section 4 — Privacy & Data Rights",
text: "Federated learning helps protect privacy by:",
options: [
"Encrypting the model architecture",
"Training models locally on-device and sharing only model updates, not raw data",
"Requiring users to sign data-sharing agreements",
"Using synthetic data exclusively",
],
correct: 1,
},
{
id: 14,
section: "Section 5 — Societal Impact & Governance",
text: "Which sector is considered 'high risk' under the EU AI Act?",
options: [
"Music streaming recommendations",
"AI used in recruitment, credit scoring, and law enforcement",
"Chatbots used for entertainment",
"Image filters in social media apps",
],
correct: 1,
},
{
id: 15,
section: "Section 5 — Societal Impact & Governance",
text: "AI-generated deepfakes pose an ethical concern primarily because:",
options: [
"They require excessive compute resources",
"They can spread misinformation and erode trust in authentic media",
"They are too expensive to produce at scale",
"They are difficult to store efficiently",
],
correct: 1,
},
{
id: 16,
section: "Section 5 — Societal Impact & Governance",
text: "What does 'responsible AI' typically require from organisations?",
options: [
"Prioritising speed of deployment over safety testing",
"Keeping AI development entirely internal and undisclosed",
"Accountability, transparency, fairness, and ongoing risk assessment",
"Using only open-source foundation models",
],
correct: 2,
},
{
id: 17,
section: "Section 5 — Societal Impact & Governance",
text: "The primary goal of AI governance frameworks is to:",
options: [
"Restrict AI research to government institutions",
"Maximise the profitability of AI products",
"Ensure AI development benefits society while managing risks",
"Standardise programming languages used for AI",
],
correct: 2,
},
];

// ─── Badge logic ──────────────────────────────────────────────────────────────
function getBadge(pct: number) {
if (pct === 100) return { label: "AI Master", emoji: "🏆", color: "#854d0e", bg: "#fef9c3", border: "#fde047" };
if (pct >= 88) return { label: "AI Pro", emoji: "⭐", color: G.dark, bg: G.bg, border: G.border };
if (pct >= 70) return { label: "AI Explorer", emoji: "🔍", color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4" };
if (pct >= 50) return { label: "AI Learner", emoji: "📘", color: "#0369a1", bg: "#f0f9ff", border: "#bae6fd" };
return { label: "Needs More Practice", emoji: "💪", color: "#9a3412", bg: "#fff7ed", border: "#fed7aa" };
}

// ─── Main component ───────────────────────────────────────────────────────────
export function QuizPage({ onBack: _onBack }: { onBack?: () => void }) {
const router = useRouter();
const { address, isConnected } = useWalletStub();

const [programId, setProgramId] = useState<string | null>(null);
const [current, setCurrent] = useState(0);
const [answers, setAnswers] = useState<(number | number[] | null)[]>(
Array(QUESTIONS.length).fill(null)
);
const [submitted, setSubmitted] = useState(false);
const [claiming, setClaiming] = useState(false);
const [claimError, setClaimError] = useState<string | null>(null);

useEffect(() => {
  fetch("/api/programs")
    .then((res) => res.json())
    .then((programs: Array<{ id: string; courseSlug: string }>) => {
      const program =
        programs.find((p) => p.courseSlug === "ai-ethics-101") ?? programs[0];
      setProgramId(program?.id ?? null);
    })
    .catch(() => setProgramId(null));
}, []);

const q = QUESTIONS[current];
const answer = answers[current];

const isSelected = (i: number) =>
q.multi ? Array.isArray(answer) && answer.includes(i) : answer === i;

const hasAnswer = () =>
q.multi ? Array.isArray(answer) && answer.length > 0 : answer !== null;

const selectOption = (i: number) => {
const updated = [...answers];
if (q.multi) {
const prev: number[] = Array.isArray(answer) ? answer : [];
updated[current] = prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i];
} else {
updated[current] = i;
}
setAnswers(updated);
};

const score = QUESTIONS.reduce((acc, q, idx) => {
const a = answers[idx];
if (q.multi) {
const corr = q.correct as number[];
const given = Array.isArray(a) ? a : [];
return acc + (corr.length === given.length && corr.every((c) => given.includes(c)) ? 1 : 0);
}
return acc + (a === q.correct ? 1 : 0);
}, 0);

const pct = Math.round((score / QUESTIONS.length) * 100);
const pass = pct >= 80;
const badge = getBadge(pct);

const claimReward = async () => {
if (!address || !programId) {
  setClaimError(programId ? null : "Program not loaded. Run npm run seed first.");
  return;
}
setClaiming(true);
setClaimError(null);
try {
const res = await fetch("/api/verify", {
method: "POST",
headers: { "Content-Type": "application/json" },
body: JSON.stringify({
  programId,
  learnerId: address.toLowerCase(),
  learnerWallet: address,
  score: pct,
}),
});
const data = (await res.json()) as {
  reward?: { ok: boolean; txHash?: string; explorerLink?: string; amount?: string; error?: string };
  error?: string;
};
if (!res.ok || !data.reward?.ok) {
  throw new Error(data.reward?.error ?? data.error ?? `Server returned ${res.status}`);
}
const params = new URLSearchParams({
  score: String(pct),
  tx: data.reward.txHash ?? "",
  amount: data.reward.amount ?? "1000000",
});
if (data.reward.explorerLink) {
  params.set("explorer", data.reward.explorerLink);
}
router.push(`/learner/success?${params.toString()}`);
} catch (err: unknown) {
setClaimError(err instanceof Error ? err.message : "Unknown error");
} finally {
setClaiming(false);
}
};

// ── Not connected gate ──────────────────────────────────────────────────────
if (!isConnected || !address) {
return (
<div className="flex size-full min-h-screen items-center justify-center" style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}>
<div className="rounded-2xl bg-white p-10 flex flex-col items-center gap-5 max-w-sm w-full" style={{ border: "1px solid #e5e7eb", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
<div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: G.bg }}>
<svg width="24" height="24" viewBox="0 0 24 24" fill="none">
<rect x="2" y="7" width="20" height="14" rx="3" stroke={G.primary} strokeWidth="1.8" />
<path d="M16 12a2 2 0 110 4 2 2 0 010-4z" fill={G.primary} />
<path d="M8 7V6a4 4 0 018 0v1" stroke={G.primary} strokeWidth="1.8" strokeLinecap="round" />
</svg>
</div>
<div className="text-center">
<div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#111827", marginBottom: "6px" }}>Wallet Required</div>
<div style={{ fontSize: "0.85rem", color: "#6b7280", lineHeight: 1.6 }}>
Connect your wallet before starting the quiz so your USDC reward can be sent to the right address.
</div>
</div>
<a
href="/learner"
className="w-full text-center rounded-xl py-3 transition-all hover:opacity-90"
style={{ background: G.btnGrad, color: "#fff", fontWeight: 600, fontSize: "0.875rem", textDecoration: "none" }}
>
Go to Learner Dashboard
</a>
</div>
</div>
);
}

// ── Results screen ──────────────────────────────────────────────────────────
if (submitted) {
return (
<div className="flex size-full min-h-screen items-center justify-center px-4 py-12" style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}>
<div className="rounded-2xl bg-white p-10 flex flex-col items-center gap-6 w-full max-w-lg" style={{ border: "1px solid #e5e7eb", boxShadow: "0 8px 32px rgba(0,0,0,0.08)" }}>

{/* Score ring */}
<div
className="w-28 h-28 rounded-full flex flex-col items-center justify-center"
style={{ background: pass ? G.btnGrad : "linear-gradient(135deg, #dc2626, #b91c1c)" }}
>
<div style={{ fontWeight: 800, fontSize: "2rem", color: "#fff", lineHeight: 1 }}>{pct}%</div>
<div style={{ fontSize: "0.72rem", color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{score}/{QUESTIONS.length}</div>
</div>

{/* Badge */}
<div className="flex items-center gap-2 rounded-full px-5 py-2" style={{ background: badge.bg, border: `1px solid ${badge.border}` }}>
<span style={{ fontSize: "1.1rem" }}>{badge.emoji}</span>
<span style={{ fontWeight: 700, fontSize: "0.9rem", color: badge.color }}>{badge.label}</span>
</div>

<div className="text-center">
<div style={{ fontWeight: 800, fontSize: "1.35rem", color: "#111827", letterSpacing: "-0.02em" }}>
{pass ? "Quiz Complete!" : "Almost There"}
</div>
<div style={{ fontSize: "0.85rem", color: "#6b7280", marginTop: "6px", lineHeight: 1.6 }}>
{pass
? `You scored ${score} out of ${QUESTIONS.length}. Claim your $1 USDC reward below.`
: `You scored ${score} out of ${QUESTIONS.length}. You need 80% or above to claim the reward.`}
</div>
</div>

{/* Payout address */}
<div className="w-full rounded-xl px-4 py-3 flex items-center gap-2" style={{ background: "#f8f9fb", border: "1px solid #e5e7eb" }}>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<rect x="1" y="4" width="12" height="8" rx="2" stroke="#9ca3af" strokeWidth="1.3" />
<path d="M10 8a1 1 0 110-2 1 1 0 010 2z" fill="#9ca3af" />
<path d="M4 4V3a3 3 0 016 0v1" stroke="#9ca3af" strokeWidth="1.3" strokeLinecap="round" />
</svg>
<span style={{ fontSize: "0.75rem", color: "#6b7280", fontWeight: 500 }}>Payout address: </span>
<span style={{ fontFamily: "monospace", fontSize: "0.78rem", color: "#374151", fontWeight: 600 }}>{truncate(address)}</span>
</div>

{/* Q breakdown */}
<div className="w-full flex flex-col gap-1.5 max-h-52 overflow-y-auto pr-1">
{QUESTIONS.map((q, idx) => {
const a = answers[idx];
let correct = false;
if (q.multi) {
const given = Array.isArray(a) ? a : [];
const corr = q.correct as number[];
correct = corr.length === given.length && corr.every((c) => given.includes(c));
} else {
correct = a === q.correct;
}
return (
<div
key={q.id}
className="flex items-center gap-3 rounded-lg px-3 py-2"
style={{ background: correct ? G.bg : "#fff7f7", border: `1px solid ${correct ? G.border : "#fecaca"}` }}
>
<span style={{ fontSize: "0.75rem", color: correct ? G.primary : "#dc2626" }}>{correct ? "✓" : "✗"}</span>
<span style={{ fontSize: "0.75rem", color: "#374151", fontWeight: 500, flex: 1 }}>
Q{q.id}: {q.text.slice(0, 55)}…
</span>
</div>
);
})}
</div>

{/* CTA */}
{pass ? (
<div className="w-full flex flex-col gap-2">
<button
onClick={claimReward}
disabled={claiming || !programId}
className="w-full rounded-xl py-3.5 transition-all hover:scale-[1.02] active:scale-[0.98]"
style={{
background: claiming || !programId ? G.pill : G.btnGrad,
color: claiming || !programId ? G.dark : "#fff",
fontWeight: 700,
fontSize: "0.95rem",
border: "none",
cursor: claiming || !programId ? "wait" : "pointer",
boxShadow: `0 4px 16px ${G.shadow}`,
}}
>
{claiming ? "Submitting…" : "Claim $1 USDC Reward"}
</button>
{!programId && (
<div style={{ fontSize: "0.75rem", color: "#9ca3af", textAlign: "center" }}>
Loading program…
</div>
)}
{claimError && <div style={{ fontSize: "0.75rem", color: "#dc2626", textAlign: "center" }}>Error: {claimError}</div>}
</div>
) : (
<button
onClick={() => { setCurrent(0); setAnswers(Array(QUESTIONS.length).fill(null)); setSubmitted(false); setClaimError(null); }}
className="w-full rounded-xl py-3.5 transition-all hover:opacity-90"
style={{ background: "#111827", color: "#fff", fontWeight: 700, fontSize: "0.95rem", border: "none", cursor: "pointer" }}
>
Try Again
</button>
)}

<Link href="/learner" style={{ fontSize: "0.8rem", color: "#9ca3af", fontWeight: 500, textDecoration: "none" }} className="hover:text-gray-600 transition-colors">
← Back to Dashboard
</Link>
</div>
</div>
);
}

// ── Quiz screen ─────────────────────────────────────────────────────────────
const progressPct = ((current + 1) / QUESTIONS.length) * 100;

return (
<div className="flex size-full min-h-screen flex-col" style={{ fontFamily: "'Inter', sans-serif", background: "#f8f9fb" }}>

{/* Top bar */}
<header className="bg-white px-8 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid #e5e7eb" }}>
<div className="flex items-center gap-3">
<div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: G.logoGrad }}>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M7 1L13 4.5v5L7 13 1 9.5v-5L7 1z" fill="white" fillOpacity="0.9" />
</svg>
</div>
<span style={{ fontWeight: 700, fontSize: "0.95rem", color: "#111827" }}>AllowMe</span>
<span style={{ color: "#e5e7eb" }}>·</span>
<span style={{ fontSize: "0.82rem", color: "#6b7280", fontWeight: 500 }}>AI Ethics 101</span>
</div>

<div className="flex items-center gap-3">
<div className="flex items-center gap-1.5 rounded-lg px-3 py-1.5" style={{ background: "#f3f4f6", border: "1px solid #e5e7eb" }}>
<span className="w-1.5 h-1.5 rounded-full" style={{ background: G.light, boxShadow: `0 0 4px ${G.shadow}` }} />
<span style={{ fontFamily: "monospace", fontSize: "0.75rem", color: "#374151", fontWeight: 500 }}>{truncate(address)}</span>
</div>
<span style={{ fontSize: "0.82rem", color: "#9ca3af", fontWeight: 500 }}>
Question {current + 1} of {QUESTIONS.length}
</span>
</div>
</header>

{/* Progress bar */}
<div className="w-full h-1.5" style={{ background: "#e5e7eb" }}>
<div className="h-1.5 transition-all duration-500" style={{ width: `${progressPct}%`, background: G.progressGrad }} />
</div>

{/* Body */}
<div className="flex-1 flex items-start justify-center px-4 py-12">
<div className="w-full max-w-2xl flex flex-col gap-6">

{/* Section label */}
<div
className="inline-flex self-start items-center rounded-full px-3 py-1"
style={{ background: G.bg, border: `1px solid ${G.border}` }}
>
<span style={{ fontSize: "0.72rem", fontWeight: 700, color: G.dark, letterSpacing: "0.06em" }}>
{q.section.toUpperCase()}
</span>
</div>

{/* Question card */}
<div className="rounded-2xl bg-white p-8 flex flex-col gap-6" style={{ border: "1px solid #e5e7eb", boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
<div>
<div style={{ fontSize: "0.75rem", fontWeight: 600, color: "#9ca3af", letterSpacing: "0.06em", marginBottom: "10px" }}>
QUESTION {q.id} {q.multi ? "· MULTI-SELECT" : "· SINGLE CHOICE"}
</div>
<div style={{ fontWeight: 700, fontSize: "1.1rem", color: "#111827", lineHeight: 1.5 }}>{q.text}</div>
{q.multi && (
<div style={{ fontSize: "0.78rem", color: G.primary, fontWeight: 500, marginTop: "6px" }}>Select all that apply</div>
)}
</div>

{/* Options */}
<div className="flex flex-col gap-3">
{q.options.map((opt, i) => {
const sel = isSelected(i);
return (
<button
key={i}
onClick={() => selectOption(i)}
className="flex items-center gap-4 w-full text-left rounded-xl px-5 py-4 transition-all duration-150"
style={{
background: sel ? G.selected : "#fafafa",
border: `2px solid ${sel ? G.selBorder : "#f3f4f6"}`,
cursor: "pointer",
transform: sel ? "scale(1.01)" : "scale(1)",
}}
>
{/* Checkbox / radio */}
{q.multi ? (
<div
className="w-5 h-5 rounded flex items-center justify-center shrink-0"
style={{ border: `2px solid ${sel ? G.primary : "#d1d5db"}`, background: sel ? G.primary : "#fff" }}
>
{sel && (
<svg width="11" height="11" viewBox="0 0 11 11" fill="none">
<path d="M2 5.5l2.5 2.5 4.5-5" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
)}
</div>
) : (
<div
className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
style={{ border: `2px solid ${sel ? G.primary : "#d1d5db"}`, background: "#fff" }}
>
{sel && <div className="w-2.5 h-2.5 rounded-full" style={{ background: G.primary }} />}
</div>
)}

<span style={{ fontSize: "0.9rem", color: sel ? G.selText : "#374151", fontWeight: sel ? 600 : 400, lineHeight: 1.5 }}>
<span className="mr-2" style={{ fontWeight: 700, color: sel ? G.selLabel : "#9ca3af", fontSize: "0.8rem" }}>
{String.fromCharCode(65 + i)}.
</span>
{opt}
</span>
</button>
);
})}
</div>
</div>

{/* Navigation */}
<div className="flex items-center justify-between">
<button
onClick={() => setCurrent((c) => Math.max(0, c - 1))}
disabled={current === 0}
className="flex items-center gap-2 rounded-xl px-5 py-3 transition-all hover:bg-gray-50"
style={{
background: "#fff",
border: "1px solid #e5e7eb",
color: current === 0 ? "#d1d5db" : "#374151",
fontWeight: 600,
fontSize: "0.875rem",
cursor: current === 0 ? "not-allowed" : "pointer",
}}
>
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M9 11L5 7l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
Previous
</button>

{/* Dot scrubber */}
<div className="flex items-center gap-1.5">
{QUESTIONS.map((_, i) => {
const answered = answers[i] !== null && (!Array.isArray(answers[i]) || (answers[i] as number[]).length > 0);
return (
<div
key={i}
className="rounded-full transition-all duration-200"
style={{
width: i === current ? "20px" : "6px",
height: "6px",
background: i === current ? G.primary : answered ? G.dotAnswered : "#e5e7eb",
}}
/>
);
})}
</div>

{current < QUESTIONS.length - 1 ? (
<button
onClick={() => setCurrent((c) => c + 1)}
disabled={!hasAnswer()}
className="flex items-center gap-2 rounded-xl px-5 py-3 transition-all"
style={{
background: hasAnswer() ? G.btnGrad : "#f3f4f6",
color: hasAnswer() ? "#fff" : "#9ca3af",
fontWeight: 600,
fontSize: "0.875rem",
border: "none",
cursor: hasAnswer() ? "pointer" : "not-allowed",
boxShadow: hasAnswer() ? `0 2px 10px ${G.shadow}` : "none",
}}
>
Next
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M5 3l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</button>
) : (
<button
onClick={() => setSubmitted(true)}
disabled={!hasAnswer()}
className="flex items-center gap-2 rounded-xl px-5 py-3 transition-all"
style={{
background: hasAnswer() ? G.btnGrad : "#f3f4f6",
color: hasAnswer() ? "#fff" : "#9ca3af",
fontWeight: 600,
fontSize: "0.875rem",
border: "none",
cursor: hasAnswer() ? "pointer" : "not-allowed",
boxShadow: hasAnswer() ? `0 2px 10px ${G.shadow}` : "none",
}}
>
Submit Quiz
<svg width="14" height="14" viewBox="0 0 14 14" fill="none">
<path d="M2.5 7.5l3 3 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
</svg>
</button>
)}
</div>
</div>
</div>
</div>
);
}
