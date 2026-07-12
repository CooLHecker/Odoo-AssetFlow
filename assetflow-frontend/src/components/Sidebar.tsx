/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  LayoutDashboard, 
  FolderTree, 
  UserCheck, 
  CalendarDays, 
  Building2, 
  History, 
  Bell, 
  Settings, 
  LogOut,
  ShieldCheck,
  TrendingUp
} from "lucide-react";
import { UserProfile } from "../types";

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  user: UserProfile;
  onLogout: () => void;
  unreadCount: number;
}

export default function Sidebar({ currentTab, setCurrentTab, user, onLogout, unreadCount }: SidebarProps) {
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "directory", label: "Asset Directory", icon: FolderTree },
    { id: "allocation", label: "Asset Allocation", icon: UserCheck },
    { id: "booking", label: "Resource Booking", icon: CalendarDays },
    { id: "org_setup", label: "Organization Setup", icon: Building2 },
    { id: "activity", label: "Activity Logs", icon: History },
    { id: "notifications", label: "Notifications", icon: Bell, badge: unreadCount },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <aside id="app-sidebar" className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col text-slate-300 h-screen sticky top-0 shrink-0">
      {/* Brand Logo */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-teal-500/10 p-2 rounded-lg border border-teal-500/30">
            <ShieldCheck className="h-6 w-6 text-teal-400" />
          </div>
          <div>
            <h1 className="font-sans font-bold text-lg text-white tracking-tight leading-none">AssetFlow</h1>
            <span className="font-mono text-[10px] text-teal-400 font-semibold uppercase tracking-widest mt-1 block">ENTERPRISE EAM</span>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-tab-${item.id}`}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                isActive 
                  ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" 
                  : "hover:bg-slate-800/60 text-slate-400 hover:text-slate-100 border border-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`h-4.5 w-4.5 shrink-0 transition-colors ${isActive ? "text-teal-400" : "text-slate-400 group-hover:text-slate-300"}`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full ring-2 ring-slate-900">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Active System Status Bar */}
      <div className="px-6 py-3 border-t border-slate-800/50 bg-slate-950/40 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-[11px] font-mono text-slate-500 font-medium">Secured Node CL-04</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="h-3 w-3 text-teal-500" />
          <span className="text-[10px] font-mono text-teal-500 font-bold">99.98%</span>
        </div>
      </div>

      {/* User Info & Logout Card */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between bg-slate-950/50">
        <div className="flex items-center gap-3 overflow-hidden">
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="w-9 h-9 rounded-full object-cover ring-2 ring-slate-800"
            referrerPolicy="no-referrer"
          />
          <div className="overflow-hidden min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-slate-400 truncate">{user.role}</p>
          </div>
        </div>
        <button 
          id="logout-button"
          onClick={onLogout}
          title="Sign Out"
          className="p-1.5 hover:bg-slate-800 rounded-md text-slate-400 hover:text-rose-400 transition-colors"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </aside>
  );
}
