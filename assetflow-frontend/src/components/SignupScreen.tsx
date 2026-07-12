/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { ShieldCheck, Lock, Mail, User, Building2, ArrowRight } from "lucide-react";
import { UserProfile, UserRoleCode } from "../types";
import { api, setToken } from "../api";

interface BackendUser {
  id: number;
  name: string;
  email: string;
  role: UserRoleCode;
  department: string | null;
  status: string;
}

interface SignupResponse {
  token: string;
  user: BackendUser;
}

interface SignupScreenProps {
  onSignupSuccess: (user: UserProfile) => void;
  onGoToLogin: () => void;
}

export default function SignupScreen({ onSignupSuccess, onGoToLogin }: SignupScreenProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [department, setDepartment] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      return;
    }
    if (password.length < 8) {
      setErrorMsg("Password must be at least 8 characters");
      return;
    }

    setIsLoading(true);
    try {
      const { token, user } = await api.post<SignupResponse>("/api/auth/signup", {
        name,
        email,
        password,
        department: department || undefined,
      });
      setToken(token);
      onSignupSuccess({
        id: user.id,
        name: user.name,
        email: user.email,
        role: "Employee",
        roleCode: user.role,
        department: user.department ?? "Unassigned",
        avatar: "",
      });
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="signup-container" className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-6 font-sans selection:bg-teal-500 selection:text-slate-950">
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl relative z-10 p-8 sm:p-10">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-teal-500/10 p-2 rounded-lg border border-teal-500/30">
            <ShieldCheck className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <span className="font-bold text-xl text-white tracking-tight">AssetFlow</span>
            <span className="font-mono text-[9px] text-teal-400 font-semibold uppercase tracking-widest block leading-none">ENTERPRISE EAM</span>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white tracking-tight">Create your account</h3>
        <p className="text-slate-400 text-xs mt-1 mb-6">
          New accounts start as an Employee. An Admin can promote you to Department Head or Asset Manager later.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label htmlFor="name-input" className="text-xs font-semibold text-slate-300">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="name-input"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Blake"
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-email-input" className="text-xs font-semibold text-slate-300">Work Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="signup-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@organization.com"
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="department-input" className="text-xs font-semibold text-slate-300">Department (optional)</label>
            <div className="relative">
              <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="department-input"
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="Engineering"
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="signup-password-input" className="text-xs font-semibold text-slate-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="signup-password-input"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="confirm-password-input" className="text-xs font-semibold text-slate-300">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <input
                id="confirm-password-input"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-slate-950/60 border border-slate-800 hover:border-slate-700 focus:border-teal-500 rounded-lg py-2 pl-9 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs rounded-lg font-medium">
              {errorMsg}
            </div>
          )}

          <button
            id="signup-submit-button"
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-500 hover:bg-teal-400 active:bg-teal-600 disabled:opacity-50 text-slate-950 font-bold py-2.5 px-4 rounded-lg text-sm flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-teal-500/10 hover:shadow-teal-500/20 transition-all duration-150"
          >
            {isLoading ? "Creating account..." : (
              <>
                Create Account
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-slate-800 text-center">
          <span className="text-xs text-slate-400">Already have an account? </span>
          <button
            id="go-to-login-button"
            type="button"
            onClick={onGoToLogin}
            className="text-xs font-semibold text-teal-400 hover:underline cursor-pointer"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
