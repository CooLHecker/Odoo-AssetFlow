/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import {
  Wrench,
  DollarSign,
  Download,
  ChevronRight,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Zap,
  Tag,
  UserCheck
} from "lucide-react";
import { Asset, AssetStatus, Reservation, NotificationItem } from "../types";
import { api } from "../api";

interface DashboardScreenProps {
  assets: Asset[];
  reservations: Reservation[];
  notifications: NotificationItem[];
  setReservations: React.Dispatch<React.SetStateAction<Reservation[]>>;
  setNotifications: React.Dispatch<React.SetStateAction<NotificationItem[]>>;
  setCurrentTab: (tab: string) => void;
}

export default function DashboardScreen({
  assets,
  reservations,
  notifications,
  setReservations,
  setNotifications,
  setCurrentTab
}: DashboardScreenProps) {

  // Real stats, computed straight from live data — no artificial baseline padding
  const totalAssetsCount = assets.length;
  const allocatedAssetsCount = assets.filter(a => a.status === AssetStatus.ALLOCATED).length;
  const maintenanceCount = assets.filter(a => a.status === AssetStatus.MAINTENANCE).length;
  const utilizationPct = totalAssetsCount > 0 ? Math.round((allocatedAssetsCount / totalAssetsCount) * 100) : 0;

  const totalValue = assets.reduce((sum, item) => sum + (item.purchaseValue || 0), 0);
  const formattedValue = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(totalValue);

  // Department Breakdown — derived entirely from live asset data
  const deptMap: Record<string, number> = {};
  assets.forEach(asset => {
    const dept = asset.department || "Unassigned";
    deptMap[dept] = (deptMap[dept] || 0) + 1;
  });
  const deptTotal = Object.values(deptMap).reduce((a, b) => a + b, 0) || 1;

  // Category Breakdown — derived entirely from live asset data
  const catColors = ["bg-teal-500", "bg-cyan-500", "bg-indigo-500", "bg-amber-500", "bg-slate-400", "bg-rose-400"];
  const catMap: Record<string, number> = {};
  assets.forEach(asset => {
    const cat = asset.category || "Uncategorized";
    catMap[cat] = (catMap[cat] || 0) + 1;
  });
  const catTotal = Object.values(catMap).reduce((a, b) => a + b, 0) || 1;
  const catDistribution = Object.entries(catMap).map(([name, count], i) => ({
    name,
    count,
    pct: `${Math.round((count / catTotal) * 100)}%`,
    color: catColors[i % catColors.length],
  }));

  // Quick Action: Export EAM Inventory Data as JSON
  const handleExportData = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(assets, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "AssetFlow_EAM_Inventory_Export.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Quick Action: Approve Reservation — persists to the backend, then updates local state
  const handleApproveReservation = async (id: string) => {
    try {
      await api.patch(`/api/bookings/${id}/status`, { status: "Active" });
      setReservations(prev => prev.map(res => (res.id === id ? { ...res, status: "Active" } : res)));
    } catch (err) {
      console.error("Failed to approve reservation:", err);
      alert("Couldn't approve this booking. Please try again.");
    }
  };

  // Quick Action: Reject / Cancel Reservation — persists to the backend, then updates local state
  const handleRejectReservation = async (id: string) => {
    try {
      await api.patch(`/api/bookings/${id}/status`, { status: "Completed" });
      setReservations(prev => prev.map(res => (res.id === id ? { ...res, status: "Completed" } : res)));
    } catch (err) {
      console.error("Failed to decline reservation:", err);
      alert("Couldn't decline this booking. Please try again.");
    }
  };

  // Quick Action: Clear dynamic notification — persists to the backend, then updates local state
  const handleDismissNotification = async (id: string) => {
    try {
      await api.del(`/api/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n.id !== id));
    } catch (err) {
      console.error("Failed to dismiss notification:", err);
      alert("Couldn't dismiss this notification. Please try again.");
    }
  };

  return (
    <div id="dashboard-view" className="space-y-6">
      
      {/* Title & Action row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight font-sans">Command & Telemetry Overview</h2>
          <p className="text-sm text-slate-500">Real-time inventory statistics, utilization telemetry, and resource scheduling.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            id="export-report-button"
            onClick={handleExportData}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm"
          >
            <Download className="h-3.5 w-3.5" />
            Export System Inventory (JSON)
          </button>
        </div>
      </div>

      {/* Grid of Key Telemetry Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: Total Assets */}
        <div id="stat-card-total-assets" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-teal-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Assets Registered</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{totalAssetsCount.toLocaleString()}</span>
            </div>
            <p className="text-[11px] text-slate-400">Total physical & digital nodes</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-teal-50 transition-colors border border-slate-100">
            <Tag className="h-5 w-5 text-slate-500 group-hover:text-teal-500 transition-colors" />
          </div>
        </div>

        {/* Card 2: Allocated Assets */}
        <div id="stat-card-allocated-assets" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-teal-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">Allocated Units</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{allocatedAssetsCount.toLocaleString()}</span>
              <span className="text-xs font-bold text-teal-600 flex items-center bg-teal-50 px-1.5 py-0.5 rounded">
                {utilizationPct}% Util
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Active operational assignments</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-teal-50 transition-colors border border-slate-100">
            <UserCheck className="h-5 w-5 text-slate-500 group-hover:text-teal-500 transition-colors" />
          </div>
        </div>

        {/* Card 3: Maintenance Tickets */}
        <div id="stat-card-maintenance" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-amber-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">In Maintenance</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{maintenanceCount}</span>
            </div>
            <p className="text-[11px] text-slate-400">Scheduled/unplanned servicing</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-amber-50 transition-colors border border-slate-100">
            <Wrench className="h-5 w-5 text-slate-500 group-hover:text-amber-500 transition-colors" />
          </div>
        </div>

        {/* Card 4: Total Value */}
        <div id="stat-card-value" className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs flex items-center justify-between group hover:border-teal-500/30 transition-all">
          <div className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider font-mono">EAM Ledger Value</span>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900 font-sans tracking-tight">{formattedValue}</span>
              <span className="text-[11px] font-medium text-slate-500 ml-1">
                Net Cost
              </span>
            </div>
            <p className="text-[11px] text-slate-400">Audited hardware ledger total</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg group-hover:bg-teal-50 transition-colors border border-slate-100">
            <DollarSign className="h-5 w-5 text-slate-500 group-hover:text-teal-500 transition-colors" />
          </div>
        </div>

      </div>

      {/* Main Double Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2/3 width on large screens) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Department Distribution Bar Chart Component */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Asset Distribution by Department</h3>
                <p className="text-xs text-slate-400">Visual mapping of hardware allocations across corporate groups.</p>
              </div>
              <span className="text-xs font-mono font-bold text-teal-600 bg-teal-50 px-2.5 py-1 rounded-lg">
                Live
              </span>
            </div>

            <div className="space-y-4">
              {Object.entries(deptMap).length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No assets registered yet.</p>
              )}
              {Object.entries(deptMap).map(([dept, count]) => {
                const percentage = Math.round((count / deptTotal) * 100);
                return (
                  <div key={dept} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-slate-700">{dept}</span>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-900 font-bold">{count.toLocaleString()} units</span>
                        <span className="text-slate-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                      <div 
                        className="bg-slate-900 hover:bg-teal-500 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Reservations Table */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">Active & Pending Bookings</h3>
                <p className="text-xs text-slate-400">Shared pool devices, fleet vehicles, and workspace reservations.</p>
              </div>
              <button
                onClick={() => setCurrentTab("booking")}
                className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 hover:underline cursor-pointer"
              >
                Booking Center
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-mono uppercase text-[10px]">
                    <th className="py-3 font-semibold">Reserved Asset</th>
                    <th className="py-3 font-semibold">User</th>
                    <th className="py-3 font-semibold">Schedule Time</th>
                    <th className="py-3 font-semibold">Current Status</th>
                    <th className="py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {reservations.length === 0 && (
                    <tr>
                      <td colSpan={5} className="py-6 text-center text-slate-400">No bookings yet.</td>
                    </tr>
                  )}
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 pr-3">
                        <div>
                          <p className="font-bold text-slate-800">{res.specificAsset}</p>
                          <p className="text-[10px] text-slate-400">{res.resourceType}</p>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="flex items-center gap-2">
                          {res.bookedByAvatar && (
                            <img 
                              src={res.bookedByAvatar} 
                              alt={res.bookedBy} 
                              className="h-6 w-6 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                          <span className="font-medium text-slate-700">{res.bookedBy}</span>
                        </div>
                      </td>
                      <td className="py-3.5 pr-3">
                        <div className="font-mono text-slate-500">
                          <p className="text-slate-700 font-semibold">{res.date}</p>
                          <p className="text-[10px]">{res.startTime} - {res.endTime}</p>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          res.status === "Active" 
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                            : "bg-amber-50 text-amber-700 border border-amber-200"
                        }`}>
                          <span className={`h-1 w-1 rounded-full ${res.status === "Active" ? "bg-emerald-500" : "bg-amber-500"}`}></span>
                          {res.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {res.status === "Pending" ? (
                            <>
                              <button
                                onClick={() => handleApproveReservation(res.id)}
                                className="p-1 hover:bg-emerald-50 rounded text-emerald-600 hover:text-emerald-700 transition-colors"
                                title="Approve Reservation"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleRejectReservation(res.id)}
                                className="p-1 hover:bg-rose-50 rounded text-rose-600 hover:text-rose-700 transition-colors"
                                title="Decline Reservation"
                              >
                                <XCircle className="h-4 w-4" />
                              </button>
                            </>
                          ) : (
                            <span className="text-[10px] font-mono text-slate-400">Confirmed</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Right Column (1/3 width on large screens) */}
        <div className="space-y-6">
          
          {/* Real-time Security & Operations Alerts */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-rose-500" />
                  Urgent System Alerts
                </h3>
                <p className="text-xs text-slate-400">Events requiring immediate manager triage.</p>
              </div>
              <span className="bg-rose-100 text-rose-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                {notifications.filter(n => n.unread).length} New
              </span>
            </div>

            <div className="space-y-3">
              {notifications.filter(n => n.type === "alert" || n.type === "booking" || n.actionable).slice(0, 3).map((item) => (
                <div key={item.id} className="p-3 bg-slate-50 border border-slate-150 rounded-lg hover:bg-slate-100/60 transition-colors space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold text-slate-800">{item.title}</p>
                      <p className="text-[11px] text-slate-500 leading-normal">{item.description}</p>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">{item.timeText}</span>
                  </div>
                  
                  {/* Micro Actions */}
                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px]">
                    <span className="font-mono text-slate-400">ID: {item.id}</span>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleDismissNotification(item.id)}
                        className="text-slate-500 hover:text-slate-800 font-semibold cursor-pointer"
                      >
                        Dismiss
                      </button>
                      <button 
                        onClick={() => {
                          if (item.assetTag) {
                            setCurrentTab("directory");
                          } else {
                            setCurrentTab("booking");
                          }
                        }}
                        className="text-teal-600 hover:text-teal-700 font-bold flex items-center gap-0.5 cursor-pointer"
                      >
                        Resolve
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {notifications.filter(n => n.type === "alert" || n.type === "booking" || n.actionable).length === 0 && (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-emerald-400 mx-auto mb-2" />
                  <p className="text-xs text-slate-500">All alerts cleared. Node is secure.</p>
                </div>
              )}
            </div>
          </div>

          {/* Utilization Breakdown Rings */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight mb-1">Utilization by Category</h3>
            <p className="text-xs text-slate-400 mb-4">Proportion of registered assets per inventory vertical.</p>

            <div className="space-y-3.5">
              {catDistribution.length === 0 && (
                <p className="text-xs text-slate-400 text-center py-6">No assets registered yet.</p>
              )}
              {catDistribution.map((cat) => (
                <div key={cat.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded ${cat.color}`}></span>
                      <span className="font-semibold text-slate-700">{cat.name}</span>
                    </div>
                    <span className="font-mono text-slate-500">{cat.count} nodes ({cat.pct})</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${cat.color}`} 
                      style={{ width: cat.pct }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-5 p-3.5 bg-slate-50 rounded-lg border border-slate-150 flex items-center gap-3">
              <Zap className="h-5 w-5 text-amber-500 shrink-0" />
              <div>
                <h4 className="text-[11px] font-bold text-slate-800">Optimize Idle Inventory</h4>
                <p className="text-[10px] text-slate-500 leading-normal">Review low-utilization assets for reallocation opportunities.</p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
