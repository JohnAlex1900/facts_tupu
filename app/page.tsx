import Link from "next/link";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-emerald-500 selection:text-slate-950">
      {/* GLOBAL NAVIGATION LAYER */}
      <header className="border-b border-slate-900 bg-slate-950/80 backdrop-blur-md sticky top-0 z-50 px-3 sm:px-4 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-base sm:text-xl font-black tracking-tighter text-white">
            FACTS <span className="text-emerald-500">TUPU.</span>
          </span>
          <span className="hidden sm:inline-flex text-[10px] bg-slate-900 text-slate-400 font-mono font-bold px-1.5 py-0.5 rounded border border-slate-800">
            V1.0.0
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 text-xs font-bold tracking-wide uppercase text-slate-400">
          <a href="#metrics" className="hover:text-white transition">
            Platform Overview
          </a>
          <a href="#features" className="hover:text-white transition">
            Features
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 px-4 py-2 text-xs font-bold text-white transition shadow-sm"
          >
            Launch Dashboard
          </Link>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 max-w-4xl mx-auto pt-20 pb-16">
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/20 px-3 py-1 text-[11px] font-bold text-emerald-400 uppercase tracking-widest mb-6">
          ⚡ Public Leadership & Accountability Platform
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-6 leading-tight max-w-3xl">
          Uncompromising Accountability For{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
            Every Elected Seat.
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl font-normal leading-relaxed mb-10 px-2 sm:px-0">
          Welcome to{" "}
          <strong className="text-white font-medium">facts tupu</strong>—a
          clear, reliable data platform tracking all levels of Kenyan
          leadership. We provide factual, un-biased performance metrics,
          tracking what our elected officials promise against what they actually
          deliver.
        </p>

        {/* PRIMARY CALL TO ACTION GRID */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-20">
          <Link
            href="/dashboard"
            className="w-full sm:w-auto rounded-xl bg-emerald-600 hover:bg-emerald-500 px-8 py-3.5 text-sm font-extrabold text-white shadow-xl shadow-emerald-950/40 transition text-center"
          >
            Access Transparency Dashboard
          </Link>
          <Link
            href="/onboard"
            className="w-full sm:w-auto rounded-xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 px-8 py-3.5 text-sm font-extrabold text-slate-300 transition text-center"
          >
            Register as a Challenger
          </Link>
        </div>

        {/* LIVE PLATFORM METRICS */}
        <section
          id="metrics"
          className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 border border-slate-900 bg-slate-950 p-4 rounded-2xl shadow-2xl mb-24 text-left"
        >
          <div className="p-4 border-r border-slate-900 last:border-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Tracked Leaders
            </span>
            <span className="text-2xl font-extrabold font-mono text-white mt-1 block">
              349 / 349
            </span>
          </div>
          <div className="p-4 md:border-r border-slate-900 last:border-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Data Updates / Day
            </span>
            <span className="text-2xl font-extrabold font-mono text-emerald-400 mt-1 block">
              14,200+
            </span>
          </div>
          <div className="p-4 border-r border-slate-900 last:border-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Audited Manifestos
            </span>
            <span className="text-2xl font-extrabold font-mono text-white mt-1 block">
              1,840+
            </span>
          </div>
          <div className="p-4 last:border-0">
            <span className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Information Accuracy
            </span>
            <span className="text-2xl font-extrabold font-mono text-teal-400 mt-1 block">
              100% Verified
            </span>
          </div>
        </section>

        {/* FEATURE CAPABILITIES GRID */}
        <section id="features" className="w-full text-left space-y-4">
          <h2 className="text-xs font-black uppercase tracking-widest text-emerald-400 border-b border-slate-900 pb-2">
            What You Can Explore Inside The Dashboard
          </h2>

          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pt-2">
            {/* FEATURE 1 */}
            <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 sm:p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-emerald-950 border border-emerald-800 flex items-center justify-center text-emerald-400 text-sm font-bold">
                01
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Representative Feed
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A live updates feed gathering the recent decisions and official
                project updates from sitting Governors, Senators, Women Reps,
                MPs, and MCAs.
              </p>
            </div>

            {/* FEATURE 2 */}
            <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 sm:p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-teal-950 border border-teal-800 flex items-center justify-center text-teal-400 text-sm font-bold">
                02
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                AI Performance Monitor
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                An easy-to-read view for everyday citizens to see how well
                leaders are performing against their original campaign promises
                and scorecards.
              </p>
            </div>

            {/* FEATURE 3 */}
            <div className="rounded-xl border border-slate-900 bg-slate-900/20 p-4 sm:p-5 space-y-2">
              <div className="h-8 w-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 text-sm font-bold">
                03
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Challengers Hub
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                A clean space designed for users to view upcoming alternative
                candidates, read their goals, and explore their verified
                manifesto files.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-900 bg-slate-950/40 py-6 px-4 text-center text-[10px] font-mono text-slate-600">
        © {new Date().getFullYear()} facts tupu. Built to provide open
        transparency and factual information on public leadership tracking
        frameworks.
      </footer>
    </div>
  );
}
