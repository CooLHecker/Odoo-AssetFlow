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
  Server,
} from "lucide-react";
import { UserProfile, UserRoleCode } from "../types";
import { api, setToken } from "../api";

const ROLE_LABELS: Record<UserRoleCode, string> = {
  EMPLOYEE: "Employee",
  DEPARTMENT_HEAD: "Department Head",
  ASSET_MANAGER: "Asset Manager",
  ADMIN: "Administrator",
};

interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: UserRoleCode;
  department: string | null;
  status: string;
}

interface LoginResponse {
  token: string;
  user: BackendUser;
}

interface LoginScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
  onGoToSignup: () => void;
}

function toUserProfile(u: BackendUser): UserProfile {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role: ROLE_LABELS[u.role] ?? u.role,
    roleCode: u.role,
    department: u.department ?? "Unassigned",
    avatar: "",
  };
}

export default function LoginScreen({ onLoginSuccess, onGoToSignup }: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);
    try {
      const { token, user } = await api.post<LoginResponse>("/api/auth/login", { email, password });
      setToken(token);
      onLoginSuccess(toUserProfile(user));
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
          </div>

          {/* Footer of login branding */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Server className="h-3.5 w-3.5" />
            <span>Secure TLS 1.3 Encryption Active</span>
          </div>

        </div>

        {/* Right pane: authentication form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 bg-slate-900/40 flex flex-col justify-center">
          
          <div className="mb-6">
            <h3 className="text-xl font-bold text-white tracking-tight">Identity Verification</h3>
            <p className="text-slate-400 text-xs mt-1">
              Enter your credentials to log in.
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
                  Password
                </label>
                <a href="#forgot" onClick={(e) => { e.preventDefault(); alert("Forgot-password self-service is coming in a later build. Contact your Admin to reset your password for now."); }} className="text-[10px] font-mono text-teal-400 hover:underline">
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
                  Verifying...
                </>
              ) : (
                <>
                  Verify & Continue
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          {/* Signup link */}
          <div className="mt-8 pt-6 border-t border-slate-800 text-center">
            <span className="text-xs text-slate-400">Don't have an account? </span>
            <button
              id="go-to-signup-button"
              type="button"
              onClick={onGoToSignup}
              className="text-xs font-semibold text-teal-400 hover:underline cursor-pointer"
            >
              Create one
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

