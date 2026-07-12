/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Settings, 
  User, 
  Bell, 
  ShieldCheck, 
  Save, 
  RefreshCw, 
  HelpCircle,
  Smartphone,
  HardDrive,
  Cpu,
  Mail
} from "lucide-react";
import { UserProfile } from "../types";

interface SettingsScreenProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
  onResetDatabase: () => void;
}

export default function SettingsScreen({
  user,
  setUser,
  onResetDatabase
}: SettingsScreenProps) {
  
  // Local form states
  const [profileName, setProfileName] = useState(user.name);
  const [profileRole, setProfileRole] = useState(user.role);
  const [profileDept, setProfileDept] = useState(user.department);
  const [profileAvatar, setProfileAvatar] = useState(user.avatar);
  
  // Toggle states
  const [isoCompliance, setIsoCompliance] = useState(true);
  const [biometricAudit, setBiometricAudit] = useState(true);
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [slackNotifs, setSlackNotifs] = useState(false);
  const [emailNotifs, setEmailNotifs] = useState(true);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({
      name: profileName,
      role: profileRole,
      department: profileDept,
      email: user.email,
      avatar: profileAvatar
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetClick = () => {
    if (confirm("Are you sure you want to restore the entire EAM database? This will clear added assets and reset initial telemetry streams.")) {
      onResetDatabase();
      alert("Database was successfully restored to default seed values.");
    }
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto">
      
      {/* View Header */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">EAM Platform Configurations</h2>
        <p className="text-sm text-slate-500">Manage your administrative credentials, customize notifications, and toggle physical compliance criteria.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column navigation cards */}
        <div className="md:col-span-1 space-y-4">
          
          <div className="bg-slate-900 text-slate-100 p-5 rounded-xl border border-slate-800 space-y-4">
            <div className="flex items-center gap-3">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="h-12 w-12 rounded-full object-cover ring-2 ring-teal-400"
                referrerPolicy="no-referrer"
              />
              <div>
                <h3 className="font-bold text-sm tracking-tight">{user.name}</h3>
                <span className="font-mono text-[9px] text-teal-400 font-semibold uppercase tracking-widest block">{user.role}</span>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
              <p>NODE ID: <span className="text-white">US-WEST-AF09</span></p>
              <p>MFA: <span className="text-emerald-400 font-bold">ACTIVE</span></p>
              <p>COMPLIANCE: <span className="text-teal-400 font-bold">ISO-27001</span></p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-slate-200 text-xs text-slate-500 space-y-2 leading-relaxed">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Cpu className="h-4 w-4 text-slate-400" />
              EAM Engine Specs
            </h4>
            <p><strong>Version:</strong> v2.4.1 (Stable release)</p>
            <p><strong>Latency:</strong> 12ms (Direct-Connect)</p>
            <p><strong>Database:</strong> Simulated Local Storage Transactional Engine</p>
          </div>

        </div>

        {/* Right column: Main settings forms */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Form 1: Admin Profile details */}
          <form onSubmit={handleSaveProfile} className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <User className="h-4 w-4 text-slate-400" />
              Administrative Profile Details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label htmlFor="settings-name" className="text-xs font-bold text-slate-600">Full Name</label>
                <input
                  id="settings-name"
                  type="text"
                  required
                  value={profileName}
                  onChange={(e) => setProfileName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="settings-role" className="text-xs font-bold text-slate-600">Platform Role Title</label>
                <input
                  id="settings-role"
                  type="text"
                  required
                  value={profileRole}
                  onChange={(e) => setProfileRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="settings-department" className="text-xs font-bold text-slate-600">Group Department</label>
                <input
                  id="settings-department"
                  type="text"
                  required
                  value={profileDept}
                  onChange={(e) => setProfileDept(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="settings-avatar" className="text-xs font-bold text-slate-600">Profile Image URL</label>
                <input
                  id="settings-avatar"
                  type="text"
                  required
                  value={profileAvatar}
                  onChange={(e) => setProfileAvatar(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-mono"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              {saveSuccess ? (
                <span className="text-xs font-semibold text-emerald-600">✔ Profile updated successfully!</span>
              ) : (
                <span></span>
              )}
              <button
                id="save-profile-settings-btn"
                type="submit"
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg cursor-pointer flex items-center gap-1.5 transition-colors"
              >
                <Save className="h-3.5 w-3.5" />
                Save Profile
              </button>
            </div>
          </form>

          {/* Form 2: Platform Compliance & Biometric Controls */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              Security Safeguards & Compliance Protocols
            </h3>

            <div className="space-y-3">
              {/* ISO */}
              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Strict ISO-27001 Validation</span>
                  <span className="text-[10px] text-slate-400 block">Restrict asset dispatch to certified compliance staff only.</span>
                </div>
                <input
                  id="toggle-iso-compliance"
                  type="checkbox"
                  checked={isoCompliance}
                  onChange={(e) => setIsoCompliance(e.target.checked)}
                  className="accent-teal-500 h-4 w-4 rounded bg-slate-100 text-teal-500"
                />
              </label>

              {/* Biometrics */}
              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Automated Biometric Security Scans</span>
                  <span className="text-[10px] text-slate-400 block">Enable continuous AI-driven security auditing of device locations.</span>
                </div>
                <input
                  id="toggle-biometric-audit"
                  type="checkbox"
                  checked={biometricAudit}
                  onChange={(e) => setBiometricAudit(e.target.checked)}
                  className="accent-teal-500 h-4 w-4 rounded bg-slate-100 text-teal-500"
                />
              </label>

              {/* MFA */}
              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Require Multi-Factor SSO Keys</span>
                  <span className="text-[10px] text-slate-400 block">Enforce authentication tokens for changing asset allocation owners.</span>
                </div>
                <input
                  id="toggle-mfa-security"
                  type="checkbox"
                  checked={mfaEnabled}
                  onChange={(e) => setMfaEnabled(e.target.checked)}
                  className="accent-teal-500 h-4 w-4 rounded bg-slate-100 text-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Form 3: Telemetry Alerts notification matrix */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2 pb-2 border-b border-slate-100">
              <Bell className="h-4 w-4 text-slate-400" />
              Notification Dispatch Channel Rules
            </h3>

            <div className="space-y-3">
              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Send System Email Digests</span>
                  <span className="text-[10px] text-slate-400 block">Weekly inventory reports and procurement warranty reminders.</span>
                </div>
                <input
                  id="toggle-email-notifs"
                  type="checkbox"
                  checked={emailNotifs}
                  onChange={(e) => setEmailNotifs(e.target.checked)}
                  className="accent-teal-500 h-4 w-4 rounded bg-slate-100 text-teal-500"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer py-1 hover:bg-slate-50 rounded px-1 transition-colors">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Active Slack Integration</span>
                  <span className="text-[10px] text-slate-400 block">Post instant webhook notifications for critical security audit failures.</span>
                </div>
                <input
                  id="toggle-slack-integration"
                  type="checkbox"
                  checked={slackNotifs}
                  onChange={(e) => setSlackNotifs(e.target.checked)}
                  className="accent-teal-500 h-4 w-4 rounded bg-slate-100 text-teal-500"
                />
              </label>
            </div>
          </div>

          {/* Dangerous Zone: Ledger Reset */}
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6 shadow-xs space-y-3">
            <h3 className="font-bold text-rose-800 text-sm flex items-center gap-2">
              <HardDrive className="h-4.5 w-4.5" />
              Platform Maintenance Zone (Destructive Actions)
            </h3>
            <p className="text-xs text-rose-700 leading-normal font-medium">
              Restore the entire EAM ledger registry to standard seed data parameters. All manual edits, reservation logs, and compliance scans will be cleared.
            </p>

            <button
              id="reset-database-button"
              onClick={handleResetClick}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md shadow-rose-200 transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Reset & Seed EAM Database
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
