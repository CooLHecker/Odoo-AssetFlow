/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  UserCheck, 
  ArrowLeftRight, 
  Clock, 
  MapPin, 
  CheckCircle, 
  X,
  FileSpreadsheet,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  CornerDownRight,
  ShieldAlert,
  UserPlus,
  RefreshCw,
  FolderMinus,
  Laptop
} from "lucide-react";
import { Asset, AssetStatus, Employee, ActivityLog } from "../types";

interface AssetAllocationScreenProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  employees: Employee[];
  setActivityLogs: React.Dispatch<React.SetStateAction<ActivityLog[]>>;
}

export default function AssetAllocationScreen({
  assets,
  setAssets,
  employees,
  setActivityLogs
}: AssetAllocationScreenProps) {
  
  // Local form state
  const [selectedAssetTag, setSelectedAssetTag] = useState("");
  const [selectedEmployeeId, setSelectedEmployeeId] = useState("");
  const [allocationPurpose, setAllocationPurpose] = useState("Operational Deployment");
  const [expectedReturn, setExpectedReturn] = useState("");
  
  // Filter search states
  const [allocSearch, setAllocSearch] = useState("");

  const availableAssets = assets.filter(a => a.status === AssetStatus.AVAILABLE);
  const allocatedAssets = assets.filter(a => a.status === AssetStatus.ALLOCATED);

  // Submit allocation handler
  const handleAssignAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAssetTag || !selectedEmployeeId) {
      alert("Please select both an available asset and an employee.");
      return;
    }

    const assetToAssign = assets.find(a => a.tag === selectedAssetTag);
    const employeeToAssign = employees.find(emp => emp.id === selectedEmployeeId);

    if (!assetToAssign || !employeeToAssign) return;

    // Mutate assets state
    setAssets(prev => prev.map(asset => {
      if (asset.tag === selectedAssetTag) {
        return {
          ...asset,
          status: AssetStatus.ALLOCATED,
          assignedTo: employeeToAssign.name,
          assignedToTitle: "EAM Assigned Staff",
          department: employeeToAssign.department,
          history: [
            { 
              date: new Date().toISOString().split('T')[0], 
              action: "ALLOCATED", 
              details: `Assigned to ${employeeToAssign.name} (${employeeToAssign.department}) - Purpose: ${allocationPurpose}` 
            },
            ...asset.history
          ]
        };
      }
      return asset;
    }));

    // Register Activity Log
    const newLog: ActivityLog = {
      id: `LOG-ADD-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: "Marcus Chen", // Logged-in admin
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuBQiDmQBAjCFHzREiYAU2iy2QmplS-VUAEkS-i5991Fa9AwWm63DJLM1_pd2-9hDy9CEkyof0W1MWTt-ESO9th5V6WpNRjloESfp5JP6l5HlT8wU-jqZ04ui1gtCoa-zYCF1QNO2-3bzDIRm2WZ6Dpf7kRwx9eMPYai4v8jTl_CilILyShdqrKrXoCjeB2GyeWxZwsuRxU1bG0xPCeWccU6NuanviwpyVgn1nKyM4bACTMpo8CMpeqQ",
      action: "ALLOCATED",
      assetId: assetToAssign.tag,
      department: employeeToAssign.department,
      status: "Success",
      details: `Assigned "${assetToAssign.name}" to ${employeeToAssign.name}`
    };

    setActivityLogs(prev => [newLog, ...prev]);

    // Reset local state
    setSelectedAssetTag("");
    setSelectedEmployeeId("");
    setAllocationPurpose("Operational Deployment");
    setExpectedReturn("");
  };

  // Check-in (release / deallocate) handler
  const handleCheckInAsset = (tag: string) => {
    const assetToRelease = assets.find(a => a.tag === tag);
    if (!assetToRelease) return;

    const previousUser = assetToRelease.assignedTo || "Unidentified User";

    setAssets(prev => prev.map(asset => {
      if (asset.tag === tag) {
        return {
          ...asset,
          status: AssetStatus.AVAILABLE,
          assignedTo: "",
          assignedToTitle: undefined,
          history: [
            { 
              date: new Date().toISOString().split('T')[0], 
              action: "RETURNED", 
              details: `Checked in and returned to inventory by manager. Unit verified status: AVAILABLE` 
            },
            ...asset.history
          ]
        };
      }
      return asset;
    }));

    // Register Activity Log
    const newLog: ActivityLog = {
      id: `LOG-RET-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      user: "Marcus Chen",
      userAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAuBQiDmQBAjCFHzREiYAU2iy2QmplS-VUAEkS-i5991Fa9AwWm63DJLM1_pd2-9hDy9CEkyof0W1MWTt-ESO9th5V6WpNRjloESfp5JP6l5HlT8wU-jqZ04ui1gtCoa-zYCF1QNO2-3bzDIRm2WZ6Dpf7kRwx9eMPYai4v8jTl_CilILyShdqrKrXoCjeB2GyeWxZwsuRxU1bG0xPCeWccU6NuanviwpyVgn1nKyM4bACTMpo8CMpeqQ",
      action: "RETURNED",
      assetId: tag,
      department: assetToRelease.department,
      status: "Verified",
      details: `Released "${assetToRelease.name}" from ${previousUser}`
    };

    setActivityLogs(prev => [newLog, ...prev]);
  };

  // Filter allocated table based on simple search
  const filteredAllocated = allocatedAssets.filter(item => 
    item.name.toLowerCase().includes(allocSearch.toLowerCase()) ||
    item.assignedTo.toLowerCase().includes(allocSearch.toLowerCase()) ||
    item.tag.toLowerCase().includes(allocSearch.toLowerCase()) ||
    item.department.toLowerCase().includes(allocSearch.toLowerCase())
  );

  return (
    <div id="asset-allocation-view" className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      
      {/* Left panel: Live allocation dispatcher form */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs h-fit">
        <div className="flex items-center gap-2 mb-4">
          <div className="bg-teal-50 p-2 rounded-lg border border-teal-200/50">
            <UserCheck className="h-5 w-5 text-teal-600" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">Asset Dispatch Hub</h3>
            <p className="text-xs text-slate-400">Deploy available assets to staff.</p>
          </div>
        </div>

        <form onSubmit={handleAssignAsset} className="space-y-4">
          
          {/* Select Asset */}
          <div className="space-y-1">
            <label htmlFor="select-asset-dropdown" className="text-xs font-bold text-slate-600">Select Available Asset *</label>
            <select
              id="select-asset-dropdown"
              required
              value={selectedAssetTag}
              onChange={(e) => setSelectedAssetTag(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="">-- Choose Asset ({availableAssets.length} Available) --</option>
              {availableAssets.map(asset => (
                <option key={asset.tag} value={asset.tag}>
                  [{asset.tag}] {asset.name} - {asset.location}
                </option>
              ))}
            </select>
          </div>

          {/* Select Personnel */}
          <div className="space-y-1">
            <label htmlFor="select-personnel-dropdown" className="text-xs font-bold text-slate-600">Assign to Employee *</label>
            <select
              id="select-personnel-dropdown"
              required
              value={selectedEmployeeId}
              onChange={(e) => setSelectedEmployeeId(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500 font-medium"
            >
              <option value="">-- Choose Employee ({employees.length} Registered) --</option>
              {employees.map(emp => (
                <option key={emp.id} value={emp.id}>
                  {emp.name} &bull; {emp.department} ({emp.id})
                </option>
              ))}
            </select>
          </div>

          {/* Assignment Purpose */}
          <div className="space-y-1">
            <label htmlFor="input-alloc-purpose" className="text-xs font-bold text-slate-600">Deployment Purpose</label>
            <input
              id="input-alloc-purpose"
              type="text"
              value={allocationPurpose}
              onChange={(e) => setAllocationPurpose(e.target.value)}
              placeholder="e.g. Remote Product Engineering Work"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Expected Return Date */}
          <div className="space-y-1">
            <label htmlFor="input-expected-return" className="text-xs font-bold text-slate-600">Expected Check-In Date</label>
            <input
              id="input-expected-return"
              type="date"
              value={expectedReturn}
              onChange={(e) => setExpectedReturn(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Alert Warning if no assets are available */}
          {availableAssets.length === 0 && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 text-xs flex gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>All assets are currently allocated or undergoing servicing. Go to directory to register new assets first.</span>
            </div>
          )}

          {/* Action dispatch button */}
          <button
            id="dispatch-allocation-button"
            type="submit"
            disabled={availableAssets.length === 0}
            className="w-full py-2.5 bg-teal-500 hover:bg-teal-400 disabled:opacity-40 active:bg-teal-600 text-slate-950 font-bold text-xs rounded-lg cursor-pointer shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <UserCheck className="h-4 w-4" />
            Deploy Allocation
          </button>

        </form>

        {/* Dispatch Guidelines */}
        <div className="mt-6 pt-5 border-t border-slate-100 space-y-3">
          <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest">Active EAM Safeguards</h4>
          
          <div className="flex gap-2.5 text-[11px] text-slate-500">
            <span className="text-emerald-500 font-bold">✔</span>
            <p>Automatic biometric security and compliance check is run upon dispatch.</p>
          </div>
          <div className="flex gap-2.5 text-[11px] text-slate-500">
            <span className="text-emerald-500 font-bold">✔</span>
            <p>Employees receive automated email receipt with terms & serial details.</p>
          </div>
        </div>

      </div>

      {/* Right panel: Table of active assignments (2/3 width) */}
      <div className="lg:col-span-2 space-y-6">
        
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
          
          {/* Header of allocations table */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="font-bold text-slate-800 text-sm">Active Assignments Ledger</h3>
              <p className="text-xs text-slate-400">Monitor and check-in assets currently in possession of employees.</p>
            </div>
            
            {/* Search Input for allocations */}
            <div className="relative w-full sm:w-56">
              <input
                id="allocation-table-search-input"
                type="text"
                placeholder="Search allocations..."
                value={allocSearch}
                onChange={(e) => setAllocSearch(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-3 pr-8 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-teal-500"
              />
              <ArrowLeftRight className="absolute right-2.5 top-2.5 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-mono uppercase text-[10px]">
                  <th className="p-3 font-semibold">Active Asset</th>
                  <th className="p-3 font-semibold">Assigned Owner</th>
                  <th className="p-3 font-semibold">Department</th>
                  <th className="p-3 font-semibold">Dispatched Date</th>
                  <th className="p-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredAllocated.map((asset) => (
                  <tr key={asset.tag} className="hover:bg-slate-50/40 transition-colors">
                    
                    {/* Asset details */}
                    <td className="p-3">
                      <div className="flex items-center gap-2.5">
                        <div className="bg-sky-50 p-2 rounded border border-sky-100 text-sky-600 shrink-0">
                          <Laptop className="h-3.5 w-3.5" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{asset.name}</p>
                          <p className="text-[10px] text-slate-400 font-mono">{asset.tag}</p>
                        </div>
                      </div>
                    </td>

                    {/* Owner employee details */}
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-[10px]">
                          {asset.assignedTo.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="font-semibold text-slate-700">{asset.assignedTo}</span>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="p-3 text-slate-600 font-medium">
                      {asset.department}
                    </td>

                    {/* Return timeline status */}
                    <td className="p-3">
                      <div className="font-mono text-slate-500">
                        <p className="text-slate-800 font-semibold">{asset.purchaseDate}</p>
                        <span className="text-[10px] text-teal-600 font-semibold uppercase">ACTIVE DEPLOYMENT</span>
                      </div>
                    </td>

                    {/* Check in action trigger */}
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleCheckInAsset(asset.tag)}
                        className="px-2.5 py-1.5 border border-slate-250 hover:border-slate-350 hover:bg-slate-50 text-slate-700 text-xs font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        Check In / Release
                      </button>
                    </td>

                  </tr>
                ))}

                {filteredAllocated.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-400">
                      <UserCheck className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                      <p className="font-bold text-slate-600">No active assignments found.</p>
                      <p className="text-xs text-slate-400 mt-1">Use the dispatcher form to deploy units to employees.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
}
