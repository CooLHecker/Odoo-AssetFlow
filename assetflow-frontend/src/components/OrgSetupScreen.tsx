/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Building2, 
  Tag, 
  Plus, 
  User, 
  Users, 
  Trash2, 
  CheckCircle2, 
  Layers, 
  Settings2,
  FileSpreadsheet,
  X,
  Sparkles
} from "lucide-react";
import { Department, AssetCategory } from "../types";

interface OrgSetupScreenProps {
  departments: Department[];
  setDepartments: React.Dispatch<React.SetStateAction<Department[]>>;
  categories: AssetCategory[];
  setCategories: React.Dispatch<React.SetStateAction<AssetCategory[]>>;
}

export default function OrgSetupScreen({
  departments,
  setDepartments,
  categories,
  setCategories
}: OrgSetupScreenProps) {
  
  // Modals visibility state
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isCatModalOpen, setIsCatModalOpen] = useState(false);

  // New Department local state
  const [newDept, setNewDept] = useState({
    code: "",
    name: "",
    manager: "",
    staffCount: 12
  });

  // New Category local state
  const [newCat, setNewCat] = useState({
    name: "",
    description: "",
    icon: "laptop"
  });

  // Action: Add Department
  const handleAddDept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDept.name || !newDept.manager) {
      alert("Please fill in Department name and Manager.");
      return;
    }

    const codeToUse = newDept.code || `DEPT-${newDept.name.substring(0, 3).toUpperCase()}-${Math.floor(10 + Math.random() * 89)}`;
    const added: Department = {
      code: codeToUse,
      name: newDept.name,
      manager: newDept.manager,
      staffCount: Number(newDept.staffCount) || 1
    };

    setDepartments(prev => [...prev, added]);
    setIsDeptModalOpen(false);
    setNewDept({ code: "", name: "", manager: "", staffCount: 12 });
  };

  // Action: Add Category
  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCat.name) {
      alert("Category name is required.");
      return;
    }

    const idToUse = newCat.name.toLowerCase().replace(/\s+/g, '-');
    const added: AssetCategory = {
      id: idToUse,
      name: newCat.name,
      description: newCat.description || "General asset category catalog entry.",
      icon: newCat.icon,
      assetCount: 0
    };

    setCategories(prev => [...prev, added]);
    setIsCatModalOpen(false);
    setNewCat({ name: "", description: "", icon: "laptop" });
  };

  // Action: Delete Department
  const handleDeleteDept = (code: string) => {
    if (confirm(`Are you sure you want to dismantle department group ${code}?`)) {
      setDepartments(prev => prev.filter(d => d.code !== code));
    }
  };

  // Action: Delete Category
  const handleDeleteCat = (id: string) => {
    if (confirm("Are you sure you want to retire this category catalog?")) {
      setCategories(prev => prev.filter(c => c.id !== id));
    }
  };

  return (
    <div id="organization-setup-view" className="space-y-8">
      
      {/* Top Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">Organization & Category Structure</h2>
        <p className="text-sm text-slate-500">Configure departments, assign management supervisors, and partition inventory asset classes.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Department Catalog Management */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building2 className="h-4.5 w-4.5 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-sm">Corporate Departments</h3>
            </div>
            <button
              id="add-department-button"
              onClick={() => setIsDeptModalOpen(true)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Group
            </button>
          </div>

          <div className="space-y-3">
            {departments.map((dept) => (
              <div 
                key={dept.code} 
                id={`dept-card-${dept.code.toLowerCase()}`}
                className="p-4 border border-slate-150 bg-slate-50/40 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{dept.name}</h4>
                    <span className="font-mono text-[9px] bg-slate-150 px-1.5 py-0.5 rounded text-slate-500 font-semibold uppercase">{dept.code}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-slate-500">
                    <span className="flex items-center gap-1">
                      <User className="h-3.5 w-3.5 text-slate-400" />
                      Manager: <strong className="text-slate-700">{dept.manager}</strong>
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      Staff count: <strong className="text-slate-700">{dept.staffCount}</strong>
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteDept(dept.code)}
                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                  title="Dismantle Department"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Asset Category Catalog Management */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Layers className="h-4.5 w-4.5 text-slate-500" />
              <h3 className="font-bold text-slate-800 text-sm">Asset Partition Categories</h3>
            </div>
            <button
              id="add-category-button"
              onClick={() => setIsCatModalOpen(true)}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add Class
            </button>
          </div>

          <div className="space-y-3">
            {categories.map((cat) => (
              <div 
                key={cat.id} 
                id={`category-card-${cat.id}`}
                className="p-4 border border-slate-150 bg-slate-50/40 hover:bg-slate-50 rounded-xl flex items-center justify-between gap-4 transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm leading-tight">{cat.name}</h4>
                    <span className="text-[10px] bg-teal-50 text-teal-700 border border-teal-200 px-1.5 py-0.5 rounded font-mono font-bold uppercase">
                      {cat.assetCount > 0 ? `${cat.assetCount} registered` : "0 registered"}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium leading-normal">{cat.description}</p>
                </div>

                <button
                  onClick={() => handleDeleteCat(cat.id)}
                  className="p-1.5 hover:bg-rose-50 text-slate-400 hover:text-rose-500 rounded transition-colors cursor-pointer"
                  title="Retire Class"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Dynamic Guideline Banner */}
      <div className="bg-slate-50 border border-slate-200/80 p-5 rounded-xl flex gap-4">
        <Sparkles className="h-6 w-6 text-teal-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-sm font-bold text-slate-800">Dynamic Hierarchy Synchronization</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Adding a new department or hardware category updates the asset registry dropdown menus instantly. This ensures flawless structural data hygiene and zero orphan listings.
          </p>
        </div>
      </div>

      {/* MODAL 3A: ADD DEPARTMENT FORM */}
      {isDeptModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Add Organizational Department Group</h3>
              <button 
                onClick={() => setIsDeptModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddDept} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label htmlFor="dept-name" className="text-xs font-bold text-slate-600">Department Name *</label>
                <input
                  id="dept-name"
                  type="text"
                  required
                  value={newDept.name}
                  onChange={(e) => setNewDept(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Creative Labs Design Group"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label htmlFor="dept-code" className="text-xs font-bold text-slate-600">Group Unique Code</label>
                  <input
                    id="dept-code"
                    type="text"
                    value={newDept.code}
                    onChange={(e) => setNewDept(prev => ({ ...prev, code: e.target.value }))}
                    placeholder="e.g. CR-LABS-99"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label htmlFor="dept-staff" className="text-xs font-bold text-slate-600">Approx. Staff Count</label>
                  <input
                    id="dept-staff"
                    type="number"
                    value={newDept.staffCount}
                    onChange={(e) => setNewDept(prev => ({ ...prev, staffCount: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label htmlFor="dept-manager" className="text-xs font-bold text-slate-600">Assigned Department Manager *</label>
                <input
                  id="dept-manager"
                  type="text"
                  required
                  value={newDept.manager}
                  onChange={(e) => setNewDept(prev => ({ ...prev, manager: e.target.value }))}
                  placeholder="e.g. Dr. Leah Vance"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsDeptModalOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-add-department"
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md"
                >
                  Create Department
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL 3B: ADD CATEGORY FORM */}
      {isCatModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-800 text-sm">Add EAM Asset Partition Class</h3>
              <button 
                onClick={() => setIsCatModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddCat} className="p-6 space-y-4">
              
              <div className="space-y-1">
                <label htmlFor="cat-name" className="text-xs font-bold text-slate-600">Category Name *</label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  value={newCat.name}
                  onChange={(e) => setNewCat(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g. Heavy Laboratory Gear"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cat-desc" className="text-xs font-bold text-slate-600">Description</label>
                <textarea
                  id="cat-desc"
                  value={newCat.description}
                  rows={2}
                  onChange={(e) => setNewCat(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Oscilloscopes, mass spectrometers, and high-temp furnaces."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="cat-icon" className="text-xs font-bold text-slate-600">Visual Category Icon</label>
                <select
                  id="cat-icon"
                  value={newCat.icon}
                  onChange={(e) => setNewCat(prev => ({ ...prev, icon: e.target.value }))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-xs text-slate-800 focus:outline-none"
                >
                  <option value="laptop">Laptop Computer icon</option>
                  <option value="truck">Electric Vehicle icon</option>
                  <option value="wrench">Mechanical Tools icon</option>
                  <option value="monitor">Peripherals/Monitor icon</option>
                </select>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCatModalOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="confirm-add-category"
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md"
                >
                  Create Class
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
