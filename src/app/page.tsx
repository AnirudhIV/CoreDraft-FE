'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '../components/navbar'; // Adjust import path as needed

export default function Home() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Optionally decode and verify token expiry here
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-white relative overflow-hidden">
      {/* Show landing page navbar or full navbar based on login */}
      {isLoggedIn ? <Navbar /> : <LandingNavbar />}

      {/* Background pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40%)]"
          style={{ backgroundSize: 'cover' }}
        ></div>
      </div>

      {/* The rest of your landing page content */}
      <main className="relative z-10 flex flex-col justify-center items-center text-center py-20 px-6 sm:px-12">
        <h2 className="text-5xl sm:text-6xl font-extrabold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Welcome to CoreDraft
        </h2>
        <p className="text-lg sm:text-xl text-slate-300 mb-10 max-w-3xl leading-relaxed">
          Streamline your compliance workflow with AI-powered document management. Upload, generate,
          audit, and maintain all your compliance documents in one intelligent platform.
        </p>
        <button
          onClick={() => router.push('/register')}
          className="px-8 py-3 bg-purple-600 rounded-xl font-semibold shadow-lg hover:bg-purple-700 active:scale-95 transition-all duration-200"
        >
          Get Started Free
        </button>
      </main>
      {/* Continue with rest of your sections as before */}
      {/* Problem Statement */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-slate-800/40 border-t border-slate-700">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Why Compliance Matters
        </h2>
        <div className="max-w-4xl mx-auto text-slate-300 space-y-6 text-lg leading-relaxed">
          <p>
            The Digital Personal Data Protection Act (DPDPA) 2023 requires Indian companies to maintain strong
            data governance, compliance documentation, and demonstrate accountability.
          </p>
          <p>
            Most small and mid-sized companies lack in-house compliance teams, and manual tracking is
            time-consuming, costly, and error-prone. Non-compliance can result in penalties up to
            <span className="text-pink-400 font-semibold"> ₹250 crore per violation</span>.
          </p>
        </div>
      </section>

      {/* Features Section with detailed explanations */}
      <div className="relative z-10 py-16 px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Powerful Features for Modern Compliance
        </h2>
        <div className="grid gap-10 sm:grid-cols-2 max-w-6xl mx-auto">
          <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">AI Document Management</h3>
            <p className="text-slate-300">
              Upload compliance policies, contracts, and SOPs. Our AI automatically categorizes them, adds relevant tags, 
              and keeps everything searchable and audit-ready. No more digging through folders.
            </p>
          </div>
          <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">Compliance Dashboards</h3>
            <p className="text-slate-300">
              Get a real-time view of your compliance posture. Track readiness percentage, missing documentation, 
              pending assessments, and open compliance gaps—all in one dashboard.
            </p>
          </div>
          <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">Automated Reporting</h3>
            <p className="text-slate-300">
              Instantly generate structured compliance reports for management and auditors. Save hours of manual effort 
              by letting AI handle formatting, summaries, and risk indicators.
            </p>
          </div>
          <div className="p-6 bg-slate-800/70 border border-slate-700 rounded-2xl shadow-lg">
            <h3 className="text-xl font-semibold mb-3 text-white">AI-Powered Q&A</h3>
            <p className="text-slate-300">
              Ask natural language questions like “Which policies are missing breach notification clauses?” 
              and receive instant, context-aware answers from your compliance library.
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases Section */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-slate-800/40 border-t border-slate-700">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Real-World Use Cases
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 max-w-6xl mx-auto">
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-white">AI Policy Review</h3>
            <p className="text-slate-300">
              Automatically highlight risky clauses in contracts and policies that may conflict with DPDPA 
              or other regulations, and receive suggested revisions.
            </p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-white">Incident Response</h3>
            <p className="text-slate-300">
              When a breach occurs, Compliance Copilot generates a step-by-step checklist 
              to ensure you report within the required 72-hour window.
            </p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-white">Vendor Risk Monitoring</h3>
            <p className="text-slate-300">
              Upload vendor contracts to automatically check for missing data protection clauses, 
              liability terms, and breach notification responsibilities.
            </p>
          </div>
          <div className="bg-slate-900/60 p-6 rounded-xl border border-slate-700 shadow-md">
            <h3 className="text-xl font-semibold mb-3 text-white">Employee Training Gaps</h3>
            <p className="text-slate-300">
              Analyze training material and identify missing topics such as grievance redressal, 
              breach reporting, and consent management.
            </p>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="relative z-10 py-16 px-6 sm:px-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Our Roadmap
        </h2>
        <div className="max-w-4xl mx-auto text-slate-300 text-lg leading-relaxed space-y-4">
          <p><span className="text-pink-400 font-semibold">Phase 1:</span> Document upload, AI summarization, dashboards (MVP).</p>
          <p><span className="text-pink-400 font-semibold">Phase 2:</span> Automated compliance checklists, vendor risk scoring.</p>
          <p><span className="text-pink-400 font-semibold">Phase 3:</span> Expansion to cover GDPR, HIPAA, ISO 27001.</p>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative z-10 py-16 px-6 sm:px-12 bg-slate-800/40 border-t border-slate-700">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto space-y-6 text-slate-300">
          <div>
            <h3 className="font-semibold text-white">Who are the target users?</h3>
            <p>The users of Compliance Copilot are primarily compliance officers, legal teams, and small to mid-sized companies that need to efficiently manage and automate their regulatory compliance workflows. 
              The platform helps these users streamline document management, audit readiness, and real-time compliance monitoring with AI-powered tools.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Do you only support DPDPA?</h3>
            <p>We start with DPDPA 2023, but our roadmap expands to GDPR, HIPAA, and ISO 27001 compliance frameworks.</p>
          </div>
          <div>
            <h3 className="font-semibold text-white">Can I try it before paying?</h3>
            <p>Yes. We offer a free tier for small teams and trials for advanced features.</p>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="relative z-10 py-16 px-6 sm:px-12 text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-purple-500">
          Stay Updated
        </h2>
        <p className="text-slate-300 mb-6">Get the latest compliance tips and product updates straight to your inbox.</p>
        <form className="flex justify-center gap-2 max-w-md mx-auto">
          <input type="email" placeholder="Enter your email" className="flex-1 px-4 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white" />
          <button className="px-6 py-2 bg-purple-600 rounded-lg font-medium hover:bg-purple-700 transition">
            Subscribe
          </button>
        </form>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-slate-500 text-sm border-t border-slate-700">
        &copy; {new Date().getFullYear()} Compliance Copilot. All rights reserved.
      </footer>
    </div>
  );
}

function LandingNavbar() {
  const router = useRouter();

  return (
    <nav className="w-full flex justify-between items-center px-6 py-4 bg-slate-900/80 border-b border-slate-700 fixed top-0 left-0 z-50 backdrop-blur">
      <h1
        onClick={() => router.push('/')}
        className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text"
      >
        CoreDraft
      </h1>

      <div className="flex gap-4">
        <button
          onClick={() => router.push('/login')}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Login
        </button>
        <button
          onClick={() => router.push('/register')}
          className="px-4 py-2 border border-purple-500 text-purple-400 rounded-lg hover:bg-purple-600 hover:text-white transition"
        >
          Register
        </button>
      </div>
    </nav>
  );
}
