/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight,
  TrendingUp,
  Server,
  Users,
  CheckCircle2
} from "lucide-react";
import { UserProfile } from "../types";

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  defaultUser: UserProfile;
}

export default function LoginScreen({ onLoginSuccess, defaultUser }: LoginScreenProps) {
  const [email, setEmail] = useState("admin@assetflow.com");
  const [password, setPassword] = useState("••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    // Simulate standard secure SSO authentication
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...defaultUser,
        email: email === "admin@assetflow.com" ? defaultUser.email : email,
      });
    }, 1200);
  };

  const handlePreFill = (role: "admin" | "auditor") => {
    if (role === "admin") {
      setEmail("admin@assetflow.com");
      setPassword("password123");
    } else {
      setEmail("auditor.compliance@assetflow.com");
      setPassword("secPass99");
    }
  };

  return (
    <div id="login-container" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-teal-500 selection:text-slate-950">
      {/* Background ambient glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-5xl bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl flex flex-col md:flex-row relative z-10">
        
        {/* Left pane: Brand Illustration & Info */}
        <div className="w-full md:w-1/2 bg-slate-950/80 p-8 sm:p-12 border-b md:border-b-0 md:border-r border-slate-800/80 flex flex-col justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="bg-teal-500/10 p-2 rounded-lg border border-teal-500/30">
              <ShieldCheck className="h-6 w-6 text-teal-400" />
            </div>
            <div>
              <span className="font-bold text-xl text-white tracking-tight">AssetFlow</span>
              <span className="font-mono text-[9px] text-teal-400 font-semibold uppercase tracking-widest block leading-none">ENTERPRISE EAM</span>
            </div>
          </div>

          {/* Slogan */}
          <div className="my-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
              Enterprise Asset <br className="hidden sm:inline" />
              Management. <span className="text-teal-400">Reimagined.</span>
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              Track, allocate, maintain, and audit organizational physical assets, fleet vehicles, and digital equipment with cryptographic precision.
            </p>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-3 mt-8">
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Active Nodes</span>
                <span className="text-base font-bold text-white font-mono mt-1 block">4,812</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Uptime Rate</span>
                <span className="text-base font-bold text-emerald-400 font-mono mt-1 block">99.98%</span>
              </div>
              <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                <span className="text-[10px] text-slate-500 font-mono block uppercase">Compliance</span>
                <span className="text-base font-bold text-teal-400 font-mono mt-1 block">ISO-EAM</span>
              </div>
            </div>
          </div>

          {/* Footer of login branding */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Server className="h-3.5 w-3.5" />
            <span>Secure TLS 1.3 Encryption Active</span>
          </div>

        </div>

        {/* Right pane: SSO and local authentication form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-slate-900/40 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Identity Verification</h3>
            <p className="text-slate-400 text-xs mt-1">
              Enter your credentials or use standard pre-set profiles to log in.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email field */}
            <div className="space-y-1.5">
              <label htmlFor="email-input" className="text-xs font-semibold text-slate-300">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="password-input" className="text-xs font-semibold text-slate-300">
                  Authentication Token / Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Self-service reset is managed by Azure AD/Okta directory admins."); }} className="text-[10px] font-mono text-teal-400 hover:underline">
                  Forgot?
                </a>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  id="password-input"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Remember & SSO Option */}
            <div className="flex items-center justify-between text-xs py-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input
                  id="remember-me-checkbox"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="accent-teal-500 h-3.5 w-3.5 rounded border-slate-800 bg-slate-950 text-teal-500 focus:ring-0 focus:ring-offset-0"
                />
                Remember this device
              </label>
              <span className="text-slate-500">MFA Enabled</span>
            </div>

            {/* Error Message */}
            {errorMsg && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-medium">
                {errorMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              id="login-submit-button"
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all duration-150"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Initializing Session...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Sandbox Pre-fills */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block mb-2">
              Sandbox Testing Credentials
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                id="prefill-admin-btn"
                type="button"
                onClick={() => handlePreFill("admin")}
                className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-md text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-teal-400"></div>
                Admin Manager
              </button>
              <button
                id="prefill-auditor-btn"
                type="button"
                onClick={() => handlePreFill("auditor")}
                className="bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-md text-xs text-slate-300 font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <div className="h-1.5 w-1.5 rounded-full bg-violet-400"></div>
                Auditor Compliance
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
