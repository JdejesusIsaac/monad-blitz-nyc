import Link from "next/link";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-8 px-6 py-16">
      <div>
        <p className="text-sm font-medium text-violet-600">AllowMe for Institutions</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          AI-Managed Learning Treasuries
        </h1>
        <p className="mt-4 text-lg text-neutral-600">
          OWS policy-gated treasury wallets on Monad testnet. Verified learning
          outcomes trigger automated USDC rewards — no manual payout approval.
        </p>
      </div>

      <section className="rounded-xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-lg font-medium">Infrastructure APIs</h2>
        <ul className="mt-4 space-y-2 font-mono text-sm text-neutral-700">
          <li>GET /api/treasury</li>
          <li>POST /api/treasury/setup</li>
          <li>POST /api/rewards/execute</li>
          <li>POST /api/verify</li>
          <li>GET /api/programs</li>
        </ul>
      </section>

      <p className="text-sm text-neutral-500">
        OWS bindings: local fork at{" "}
        <code className="rounded bg-neutral-100 px-1">../ows-monad/ows</code>.
        Run <code className="rounded bg-neutral-100 px-1">npm run ows:build</code>{" "}
        before treasury setup. See{" "}
        <Link href="https://github.com" className="underline">
          README
        </Link>
        .
      </p>
    </main>
  );
}
