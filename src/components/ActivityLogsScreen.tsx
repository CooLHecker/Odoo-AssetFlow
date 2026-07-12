/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  History, 
  Search, 
  ShieldCheck, 
  SlidersHorizontal, 
  CheckCircle, 
  AlertTriangle, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  FileSpreadsheet,
  Download
} from "lucide-react";
import { ActivityLog } from "../types";

interface ActivityLogsScreenProps {
  activityLogs: ActivityLog[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
}

export default function ActivityLogsScreen({
  activityLogs,
  setActivityLogs
}: ActivityLogsScreenProps) {
  
  // Search & Filter local state
  const [logSearch, setLogSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [isAuditing, setIsAuditing] = useState(false);

  // Filter logs logic
  const filteredLogs = activityLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.assetId.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.action.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.department.toLowerCase().includes(logSearch.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || log.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Action: Trigger Simulated compliance scan and append a REAL log!
  const handleTriggerAudit = () => {
    setIsAuditing(true);
    
    setTimeout(() => {
      setIsAuditing(false);
      
      const newAuditLog: ActivityLog = {
        id: `LOG-AUD-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
        user: "EAM Auditor-Bot",
        userAvatar: "",
        action: "COMPLIANCE AUDIT",
        assetId: "SYS-NETWORK-NODE",
        department: "Information Technology",
        status: "Verified",
        details: "Automated biometric security check on HQ floor assets executed successfully. 0 discrepancies found."
      };

      setActivityLogs(prev => [newAuditLog, ...prev]);
    }, 1500);
  };

  // Quick Action: Export audit logs as CSV
  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,ID,Timestamp,User,Action,AssetID,Department,Status,Details\n";
    filteredLogs.forEach(log => {
      const row = [
        log.id,
        log.timestamp,
        `"${log.user}"`,
        log.action,
        log.assetId,
        `"${log.department}"`,
        log.status,
        `"${log.details}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", encodedUri);
    downloadAnchor.setAttribute("download", "AssetFlow_Audit_Logs.csv");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const getStatusBadgeStyle = (status: string) => {
    switch (status) {
      case "Success":
        return "bg-emerald-50 text-emerald-700 border border-emerald-200";
      case "Verified":
        return "bg-teal-50 text-teal-700 border border-teal-200";
      case "Flagged":
        return "bg-rose-50 text-rose-700 border border-rose-200 animate-pulse";
      default:
        return "bg-amber-50 text-amber-700 border border-amber-200";
    }
  };

  return (
    <div id="activity-logs-view" className="space-y-6">
      
      {/* Title block */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <History className="h-5 w-5 text-slate-700" />
            Cryptographic Audit Ledger
          </h2>
          <p className="text-sm text-slate-500">Immutable chronological timeline logs tracking all physical checkouts, returns, and security scans.</p>
        </div>
        
        {/* Top actions */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <button
            id="trigger-compliance-audit-btn"
            onClick={handleTriggerAudit}
            disabled={isAuditing}
            className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-2 cursor-pointer transition-all shadow-sm"
          >
            {isAuditing ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                Scanning nodes...
              </>
            ) : (
              <>
                <ShieldCheck className="h-3.5 w-3.5 text-teal-400" />
                Trigger Compliance Audit
              </>
            )}
          </button>

          <button
            id="export-audit-csv-btn"
            onClick={handleExportCSV}
            className="p-2 bg-white hover:bg-slate-50 border border-slate-250 text-slate-600 hover:text-slate-900 rounded-lg text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer"
            title="Download CSV report"
          >
            <Download className="h-4.5 w-4.5" />
          </button>
        </div>
      </div>

      {/* Filter and search parameters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-lg w-fit">
            {["ALL", "Success", "Verified", "Flagged", "Pending Review"].map((tab) => (
              <button
                key={tab}
                id={`filter-log-status-${tab.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === tab 
                    ? "bg-white text-slate-900 shadow-2xs border border-slate-200/40" 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search bar */}
          <div className="relative w-full sm:w-64">
            <input
              id="audit-log-search-input"
              type="text"
              placeholder="Filter logs by operator, action, id..."
              value={logSearch}
              onChange={(e) => setLogSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-lg py-2 pl-3 pr-8 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-sans"
            />
            <Search className="absolute right-2.5 top-2.5 h-4 w-4 text-slate-400 pointer-events-none" />
          </div>

        </div>
      </div>

      {/* Main Audit Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-4 font-semibold">Timeline / ID</th>
                <th className="p-4 font-semibold">Operator</th>
                <th className="p-4 font-semibold">Action</th>
                <th className="p-4 font-semibold">Asset / Target</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Status Code</th>
                <th className="p-4 font-semibold">Mutation Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/50 transition-colors">
                  
                  {/* Timestamp & ID */}
                  <td className="p-4 shrink-0">
                    <div className="font-mono">
                      <p className="text-slate-800 font-bold">{log.timestamp}</p>
                      <p className="text-[10px] text-slate-400">{log.id}</p>
                    </div>
                  </td>

                  {/* Operator/User */}
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {log.userAvatar ? (
                        <img 
                          src={log.userAvatar} 
                          alt={log.user} 
                          className="h-6 w-6 rounded-full object-cover ring-1 ring-slate-200"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[9px]">
                          {log.user.split(" ").map(n => n[0]).join("")}
                        </div>
                      )}
                      <span className="font-semibold text-slate-700">{log.user}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className="p-4">
                    <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded text-[10px] uppercase">
                      {log.action}
                    </span>
                  </td>

                  {/* Target Asset Code */}
                  <td className="p-4">
                    <span className="font-mono text-slate-600 font-semibold">{log.assetId}</span>
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    <span className="text-slate-500 font-medium">{log.department}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusBadgeStyle(log.status)}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${
                        log.status === "Success" || log.status === "Verified" ? "bg-teal-500" : "bg-rose-500 animate-pulse"
                      }`}></span>
                      {log.status}
                    </span>
                  </td>

                  {/* Details summary */}
                  <td className="p-4 max-w-xs truncate text-slate-600 font-medium leading-relaxed">
                    {log.details}
                  </td>

                </tr>
              ))}

              {filteredLogs.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-slate-400">
                    <History className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <p className="font-bold text-slate-600">No matching audit logs found.</p>
                    <p className="text-xs text-slate-400 mt-1">Try relaxing filters or search query terms.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
