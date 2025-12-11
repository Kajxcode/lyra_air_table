import Link from "next/link";

import { LatestPost } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { api, HydrateClient } from "@/trpc/server";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await auth();

  if (session?.user) {
    void api.post.getLatest.prefetch();
  }

  return (
    <HydrateClient>
      <main className="min-h-screen bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-50">
        <div className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-16 lg:px-10">
          <section className="grid gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur md:grid-cols-2">
            <div className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-indigo-200">
                Lyra Airtable
              </p>
              <h1 className="text-4xl font-bold leading-tight sm:text-5xl">
                A simple home to plug in Airtable and test your stack.
              </h1>
              <p className="text-base text-slate-200">
                Use this starter page to confirm authentication, run a tRPC
                round-trip, and jump into the rest of the app once you are
                signed in.
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-indigo-100">
                  {hello ? hello.greeting : "Loading tRPC query..."}
                </span>
                {session?.user ? (
  <div className="flex items-center gap-3 rounded-full bg-white/10 px-4 py-2">
    {session.user.image && (
      <img
        src={session.user.image}
        alt="profile"
        className="h-6 w-6 rounded-full"
      />
    )}
    <span className="text-sm text-indigo-100 font-medium">
      {session.user.name ?? session.user.email}
    </span>
  </div>
) : (
  <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
    You are browsing as a guest
  </span>
)}

              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={session ? "/api/auth/signout" : "/api/auth/signin"}
                  className="rounded-full bg-indigo-500 px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  {session ? "Sign out" : "Sign in"}
                </Link>
                <Link
                  href="/"
                  className="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-100 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                >
                  Refresh status
                </Link>
              </div>
            </div>
            <div className="grid gap-4 rounded-2xl border border-white/5 bg-black/20 p-5">
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-indigo-200">
                  Quick start
                </p>
                <ul className="mt-3 space-y-2 text-sm text-slate-200">
                  <li>1. Sign in to enable protected routes.</li>
                  <li>2. Confirm the tRPC hello message returns a greeting.</li>
                  <li>3. Add your Airtable credentials in `.env` and restart.</li>
                  <li>4. Build your first query or mutation.</li>
                </ul>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                <p className="text-sm font-semibold text-indigo-200">
                  Live status
                </p>
                <div className="mt-3 space-y-1 text-sm text-slate-200">
                  <p>
                    Auth:{" "}
                    {session?.user
                      ? `Authenticated as ${session.user.name ?? "user"}`
                      : "Not authenticated"}
                  </p>
                  <p>tRPC: {hello ? "Connected" : "Loading..."}</p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Latest
              </p>
              <div className="mt-4">
                {session?.user ? (
                  <LatestPost />
                ) : (
                  <p className="text-sm text-slate-200">
                    Sign in to load the latest content.
                  </p>
                )}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 shadow-lg">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-200">
                Notes
              </p>
              <p className="mt-4 text-sm text-slate-200">
                This page keeps the app minimal while you wire up Airtable or
                other data sources. Extend it with cards or links to the pieces
                you are building next.
              </p>
            </div>
          </section>
        </div>
      </main>
    </HydrateClient>
  );
}
