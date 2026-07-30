import React from "react";
import Link from "next/link";

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-300 py-12 px-4 sm:px-6 lg:px-8 selection:bg-emerald-500/30">
      <div className="max-w-5xl mx-auto">
        {/* Header Navigation Bar */}
        <nav className="flex items-center justify-between mb-8 pb-4 border-b border-slate-800/60">
          <Link
            href="/"
            className="text-base font-black tracking-widest text-emerald-400 hover:text-emerald-300 transition-colors uppercase"
          >
            FACTS TUPU
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center text-sm font-medium text-slate-400 hover:text-emerald-400 transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </nav>

        {/* Page Header */}
        <header className="mb-12 border-b border-slate-800 pb-8">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-100 mb-4">
            Terms and Conditions & Legal Disclaimer
          </h1>
          <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">
            Last Updated: <span className="text-slate-400">July 2026</span>
          </p>
        </header>

        {/* Main Content Container */}
        <main className="space-y-10 bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-10 shadow-xl">
          {/* Introduction */}
          <section className="text-base leading-relaxed text-slate-300">
            <p>
              Welcome to <strong className="text-slate-100">Facts Tupu</strong>{" "}
              (the &quot;Platform&quot;, &quot;Service&quot;, &quot;We&quot;,
              &quot;Us&quot;, or &quot;Our&quot;). By accessing, browsing,
              subscribing to, or otherwise using this platform, you
              (&quot;User&quot;, &quot;Subscriber&quot;, or &quot;You&quot;)
              agree to be bound by these Terms and Conditions
              (&quot;Terms&quot;). If you do not agree to these Terms, you must
              immediately cease all use of the Platform.
            </p>
          </section>

          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              1. Nature of the Platform & Data Aggregation
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  1.1. Public Record Aggregation:
                </strong>{" "}
                Facts Tupu is an independent civic technology platform designed
                to aggregate, analyze, and synthesize publicly available data
                regarding elected officials, public institutions, campaign
                commitments, legislative records (such as Hansard reports),
                budget allocations, and public performance metrics.
              </p>
              <p>
                <strong className="text-slate-200">
                  1.2. No Official Affiliation:
                </strong>{" "}
                Facts Tupu is a private entity. It is <strong>not</strong>{" "}
                affiliated, endorsed by, or sponsored by any government,
                government agency, political party, or elected official.
              </p>
              <p>
                <strong className="text-slate-200">
                  1.3. Independent Analysis & Scoring:
                </strong>{" "}
                Performance scores, impact ratings, exaggeration risk
                indicators, and delivery statuses calculated by the Platform are
                produced through proprietary dynamic scoring algorithms, public
                data ingestion, and third-party reporting. They represent
                analytical estimations and opinions, not factual guarantees or
                judicial determinations.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              2. Disclaimer of Warranties & &quot;As-Is&quot; Provision
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  2.1. &quot;As-Is&quot; & &quot;As-Available&quot;:
                </strong>{" "}
                All services, data, ratings, scorecards, and content provided on
                Facts Tupu are provided on an <strong>&quot;AS IS&quot;</strong>{" "}
                and <strong>&quot;AS AVAILABLE&quot;</strong> basis without
                warranties of any kind, whether express, implied, statutory, or
                otherwise.
              </p>
              <p>
                <strong className="text-slate-200">
                  2.2. No Guarantee of Accuracy:
                </strong>{" "}
                While We endeavor to maintain accurate and up-to-date data, We
                make no representation or warranty regarding the accuracy,
                completeness, reliability, timeliness, legality, or error-free
                nature of any data, report, or score provided on the Platform.
                Data may be delayed, incomplete, or based on outdated public
                domain records.
              </p>
              <p>
                <strong className="text-slate-200">2.3. User Reliance:</strong>{" "}
                Any reliance you place on information found on Facts Tupu is
                strictly at your own risk. You are solely responsible for
                independently verifying any legislative, financial, or political
                information prior to making civic, voting, legal, or financial
                decisions.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              3. Absolute Limitation of Liability & Indemnification
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  3.1. Exoneration from Legal Action:
                </strong>{" "}
                To the maximum extent permitted by applicable law, the
                creator(s), operators, developers, owners, affiliates,
                employees, and agents of Facts Tupu shall <strong>NOT</strong>{" "}
                be held liable for any direct, indirect, incidental,
                consequential, special, punitive, or exemplary damages arising
                out of or in connection with:
              </p>
              <ul className="list-disc list-inside space-y-2 text-slate-400 ml-2">
                <li>
                  Your access to, reliance upon, or use of the Platform or its
                  data.
                </li>
                <li>
                  Any inaccuracies, errors, omissions, or misstatements in the
                  data or performance scores.
                </li>
                <li>
                  Any defamation, libel, or slander claims brought by third
                  parties, elected officials, or political entities regarding
                  performance ratings published on the Platform.
                </li>
                <li>
                  Any political, financial, or personal consequences resulting
                  from the public sharing of downloadable report cards or
                  scorecards generated by the Platform.
                </li>
                <li>
                  Any loss of business, reputation, profit, or data resulting
                  from service interruptions or platform downtime.
                </li>
              </ul>
              <p className="pt-2">
                <strong className="text-slate-200">
                  3.2. Indemnification:
                </strong>{" "}
                You agree to defend, indemnify, and hold harmless Facts Tupu,
                its creator(s), developers, and affiliates from and against any
                claims, liabilities, damages, losses, or expenses (including
                reasonable legal fees) arising out of your violation of these
                Terms, your misuse of the Platform, or your distribution/sharing
                of Platform materials on external channels (e.g., social media,
                messaging platforms).
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              4. Fair Use, Non-Defamation, & Data Protection
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  4.1. Public Domain & Fair Comment:
                </strong>{" "}
                Data published on this platform regarding public figures and
                elected officials is compiled under constitutional guarantees of
                freedom of expression, access to information, and fair comment
                on matters of public interest.
              </p>
              <p>
                <strong className="text-slate-200">
                  4.2. Data Processing:
                </strong>{" "}
                The Platform processes public performance metrics in accordance
                with relevant data protection guidelines. Personal data
                collected from subscribers (e.g., M-Pesa phone numbers, email
                addresses for subscriptions) is used strictly for account
                administration, payment verification, and service delivery, and
                will not be sold to third parties.
              </p>
              <p>
                <strong className="text-slate-200">
                  4.3. Right to Verification / Dispute Mechanism:
                </strong>{" "}
                Any elected official or public entity who believes a score or
                project delivery status displayed on the Platform is based on
                inaccurate public data may submit verified primary receipts,
                gazette notices, or official documentation through the
                Platform’s designated verification portal. The Platform reserves
                the right to evaluate and update scores at its sole discretion
                upon reviewing verified evidence, without admitting liability
                for prior iterations.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              5. Subscriptions, Payments, & Monetization
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  5.1. Subscription Access:
                </strong>{" "}
                Certain features, including ward-level budget tracking,
                historical evidence vaults, and SMS/WhatsApp alerts, may require
                a paid subscription fee (processed via mobile money services
                like M-Pesa or third-party payment gateways).
              </p>
              <p>
                <strong className="text-slate-200">5.2. No Refunds:</strong> All
                subscription payments are final and non-refundable, except where
                explicitly required by applicable consumer protection laws.
              </p>
              <p>
                <strong className="text-slate-200">
                  5.3. Service Adjustments:
                </strong>{" "}
                We reserve the right to alter subscription tiers, features,
                pricing, or data availability at any time without prior
                liability.
              </p>
            </div>
          </section>

          {/* Section 6 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              6. Intellectual Property & Acceptable Use
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">
                  6.1. Platform Rights:
                </strong>{" "}
                The design, code, scoring algorithms, logo, and aggregated
                database architecture of Facts Tupu are the exclusive property
                of the Platform’s creators.
              </p>
              <p>
                <strong className="text-slate-200">
                  6.2. Limited Sharing License:
                </strong>{" "}
                Users are granted a revocable, non-exclusive license to download
                and share generated public report cards for non-commercial,
                personal, or civic educational purposes, provided the Facts Tupu
                branding and source attribution remain intact and unedited.
              </p>
              <p>
                <strong className="text-slate-200">
                  6.3. Prohibited Conduct:
                </strong>{" "}
                You agree not to reverse-engineer the scoring backend, attempt
                unauthorized scraping of bulk databases without API licensing,
                or use the Platform to disseminate malicious, fraudulent, or
                intentionally altered misinformation.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              7. Governing Law & Dispute Resolution
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                <strong className="text-slate-200">7.1. Jurisdiction:</strong>{" "}
                These Terms shall be governed by and construed in accordance
                with the laws of the <strong>Republic of Kenya</strong>.
              </p>
              <p>
                <strong className="text-slate-200">7.2. Arbitration:</strong>{" "}
                Any dispute, controversy, or claim arising out of or relating to
                these Terms or the use of the Platform shall first be attempted
                to be resolved informally. If unresolved, it shall be referred
                to confidential arbitration prior to the initiation of formal
                litigation.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-400 border-l-4 border-emerald-500 pl-3">
              8. Contact Information
            </h2>
            <div className="space-y-3 pl-4">
              <p>
                If you have any questions regarding these Terms or wish to
                submit public record corrections, please contact:
              </p>
              <ul className="list-disc list-inside space-y-1 text-slate-400 ml-2">
                <li>
                  <strong className="text-slate-200">
                    Platform Legal / Desk:
                  </strong>{" "}
                  <a
                    href="mailto:legal@facts-tupu.vercel.app"
                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    legal@facts-tupu.vercel.app
                  </a>
                </li>
              </ul>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
