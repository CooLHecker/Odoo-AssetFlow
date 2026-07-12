/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { 
  Search, 
  Bell, 
  HelpCircle, 
  RefreshCw,
  Globe,
  Settings,
  SlidersHorizontal
} from "lucide-react";
import { UserProfile } from "../types";

interface TopNavBarProps {
  currentTab: string;
  user: UserProfile;
  unreadCount: number;
  setCurrentTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function TopNavBar({ 
  currentTab, 
  user, 
  unreadCount, 
  setCurrentTab,
  searchQuery,
  setSearchQuery,
  onRefresh,
  isRefreshing = false
}: TopNavBarProps) {
  
  const getTabTitle = (tab: string) => {
    switch (tab) {
      case "dashboard":
        return "Command Dashboard";
      case "directory":
        return "Asset Directory";
      case "allocation":
        return "Asset Allocation Matrix";
      case "booking":
        return "Resource Booking System";
      case "org_setup":
        return "Organization Structure";
      case "activity":
        return "System Activity Audit Logs";
      case "notifications":
        return "Notification Center";
      case "settings":
        return "Platform Settings & Controls";
      default:
        return "EAM Platform";
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    // If user types and is not in directory, maybe they want to view the directory
    if (currentTab !== "directory" && currentTab !== "dashboard" && currentTab !== "booking") {
      // Just keep query updated, or optionally switch
    }
  };

  return (
    <header id="app-top-navbar" className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-30 shrink-0">
      {/* Search Input Section */}
      <div className="flex items-center gap-4 w-96">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            id="top-navbar-search-input"
            type="text"
            placeholder="Search assets, owners, serials, logs..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-1.5 bg-slate-50 border border-slate-200 hover:border-slate-300 focus:border-teal-500 focus:bg-white rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none transition-all duration-150 font-sans"
          />
        </div>
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery("")}
            className="text-xs font-mono text-slate-400 hover:text-slate-600 transition-colors cursor-pointer shrink-0"
          >
            Clear
          </button>
        )}
      </div>

      {/* Screen Title & Quick Actions */}
      <div className="flex items-center gap-6">
        {/* Sync Status / Auto Refresh */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-md">
          <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
          <span className="text-[11px] font-mono text-slate-500 font-medium uppercase tracking-wider">Live Sync</span>
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className={`p-1 hover:bg-slate-200 rounded text-slate-400 hover:text-slate-600 transition-colors ${
              isRefreshing ? "animate-spin text-teal-500" : ""
            }`}
            title="Refresh EAM Data"
          >
            <RefreshCw className="h-3 w-3" />
          </button>
        </div>

        {/* Global Action Icons */}
        <div className="flex items-center gap-1.5 border-r border-slate-200 pr-4">
          <button
            onClick={() => setCurrentTab("notifications")}
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg relative transition-colors"
            title="Notifications"
          >
            <Bell className="h-4.5 w-4.5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 h-2 w-2 bg-rose-500 rounded-full ring-2 ring-white"></span>
            )}
          </button>
          
          <button
            onClick={() => setCurrentTab("settings")}
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
            title="Settings"
          >
            <Settings className="h-4.5 w-4.5" />
          </button>

          <a
            href="https://github.com/Karmanya-Jakhotia"
            target="_blank"
            rel="noreferrer"
            className="p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800 rounded-lg transition-colors"
            title="Enterprise Portal"
          >
            <Globe className="h-4.5 w-4.5" />
          </a>
        </div>

        {/* Mini Profile Display */}
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-slate-700 block leading-tight">{user.name}</span>
            <span className="text-[10px] font-mono text-slate-400 block">{user.department}</span>
          </div>
          <img 
            src={user.avatar} 
            alt={user.name} 
            className="h-8.5 w-8.5 rounded-full object-cover ring-2 ring-teal-500/20"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
