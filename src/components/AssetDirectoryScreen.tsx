/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  SlidersHorizontal, 
  Tag, 
  User, 
  MapPin, 
  Calendar, 
  Info, 
  Edit3, 
  Trash2, 
  ExternalLink,
  ChevronRight,
  Filter,
  DollarSign,
  AlertTriangle,
  FileSpreadsheet,
  X,
  History,
  Database,
  Upload,
  Check,
  AlertCircle,
  FileText,
  Copy
} from "lucide-react";
import { Asset, AssetStatus } from "../types";

function parseSqlToAssets(sqlText: string): { success: boolean; assets: Asset[]; error?: string } {
  const assets: Asset[] = [];
  try {
    // Remove comments
    let cleanSql = sqlText
      .replace(/--.*$/gm, '') // single-line comments
      .replace(/\/\*[\s\S]*?\*\//g, ''); // block comments

    // Match INSERT INTO statements
    const insertRegex = /INSERT\s+INTO\s+(\w+)\s*(?:\(([^)]+)\))?\s*VALUES\s*([\s\S]+?)(?:;|$)/gi;
    
    let match;
    let foundAny = false;
    
    while ((match = insertRegex.exec(cleanSql)) !== null) {
      foundAny = true;
      const colString = match[2];
      const valString = match[3];

      let columns: string[] = [];
      if (colString) {
        columns = colString.split(',').map(c => c.trim().replace(/[`"']/g, ''));
      }

      // Regex to extract each row inside parenthesis
      const rowRegex = /\(([\s\S]*?)\)/g;
      let rowMatch;
      while ((rowMatch = rowRegex.exec(valString)) !== null) {
        const rawRowValues = rowMatch[1];
        const values: string[] = [];
        let currentVal = '';
        let inString = false;
        let quoteChar = '';

        for (let i = 0; i < rawRowValues.length; i++) {
          const char = rawRowValues[i];
          if ((char === "'" || char === '"' || char === '`') && (i === 0 || rawRowValues[i - 1] !== '\\')) {
            if (inString && quoteChar === char) {
              inString = false;
            } else if (!inString) {
              inString = true;
              quoteChar = char;
            } else {
              currentVal += char;
            }
          } else if (char === ',' && !inString) {
            values.push(currentVal.trim());
            currentVal = '';
          } else {
            currentVal += char;
          }
        }
        if (currentVal.trim() || values.length > 0) {
          values.push(currentVal.trim());
        }

        const cleanValues = values.map(val => {
          const trimmed = val.trim();
          if (trimmed.toUpperCase() === 'NULL') return '';
          if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            return trimmed.slice(1, -1);
          }
          return trimmed;
        });

        const schemaCols = [
          'tag', 'name', 'category', 'department', 'status', 'assignedto', 'condition', 'location', 
          'purchasedate', 'purchasevalue', 'warrantytill', 'serialnumber', 'manufacturer', 'specs'
        ];

        const rowObj: Record<string, string> = {};
        
        if (columns.length > 0) {
          columns.forEach((col, idx) => {
            const colLower = col.toLowerCase().replace(/_([a-z])/g, '$1'); // handle snake_case
            if (cleanValues[idx] !== undefined) {
              rowObj[colLower] = cleanValues[idx];
            }
          });
        } else {
          schemaCols.forEach((col, idx) => {
            if (cleanValues[idx] !== undefined) {
              rowObj[col] = cleanValues[idx];
            }
          });
        }

        const tag = rowObj['tag'] || rowObj['assettag'] || `AF-SQL-${Math.floor(1000 + Math.random() * 9000)}`;
        const name = rowObj['name'] || rowObj['assetname'] || rowObj['title'] || `SQL Asset (${tag})`;
        const category = rowObj['category'] || rowObj['type'] || 'Peripherals';
        const department = rowObj['department'] || rowObj['dept'] || 'IT Logistics';
        
        let status = AssetStatus.AVAILABLE;
        const rawStatus = (rowObj['status'] || '').toUpperCase();
        if (rawStatus.includes('ALLOCATED') || rawStatus.includes('ASSIGNED')) {
          status = AssetStatus.ALLOCATED;
        } else if (rawStatus.includes('MAINTENANCE') || rawStatus.includes('REPAIR')) {
          status = AssetStatus.MAINTENANCE;
        }

        const assignedTo = rowObj['assignedto'] || rowObj['owner'] || '';
        const condition = rowObj['condition'] || rowObj['state'] || 'Excellent';
        const location = rowObj['location'] || rowObj['place'] || 'HQ - Room 101';
        const purchaseDate = rowObj['purchasedate'] || rowObj['purchase_date'] || new Date().toISOString().split('T')[0];
        const purchaseValue = Number(rowObj['purchasevalue'] || rowObj['value'] || rowObj['price'] || rowObj['cost'] || 0);
        const warrantyTill = rowObj['warrantytill'] || `${Number(purchaseDate.split('-')[0] || 2026) + 3}-12-31`;
        const serialNumber = rowObj['serialnumber'] || rowObj['serial_number'] || rowObj['serial'] || rowObj['sn'] || `SN-${tag}`;
        const manufacturer = rowObj['manufacturer'] || rowObj['brand'] || rowObj['make'] || 'Generic';
        const specs = rowObj['specs'] || rowObj['description'] || rowObj['specifications'] || 'No additional configuration provided.';

        assets.push({
          tag,
          name,
          category,
          department,
          status,
          assignedTo,
          assignedToTitle: assignedTo ? "Associate" : undefined,
          condition,
          location,
          purchaseDate,
          purchaseValue,
          warrantyTill,
          serialNumber,
          manufacturer,
          specs,
          history: [
            { date: new Date().toISOString().split('T')[0], action: "SQL_IMPORT", details: `Imported via SQL terminal load` }
          ]
        });
      }
    }

    if (!foundAny) {
      // Bracket fallback scanner
      const fallbackRegex = /\(([^)]+)\)/g;
      let fMatch;
      while ((fMatch = fallbackRegex.exec(cleanSql)) !== null) {
        const rawRowValues = fMatch[1];
        const values = rawRowValues.split(',').map(v => {
          let trimmed = v.trim();
          if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
            trimmed = trimmed.slice(1, -1);
          }
          return trimmed;
        });

        if (values.length >= 2) {
          const tag = values[0] || `AF-SQL-${Math.floor(1000 + Math.random() * 9000)}`;
          const name = values[1] || `SQL Fallback Unit (${tag})`;
          const category = values[2] || 'Laptops';
          const department = values[3] || 'Engineering';
          const value = Number(values[4]) || 1200;

          assets.push({
            tag,
            name,
            category,
            department,
            status: AssetStatus.AVAILABLE,
            assignedTo: "",
            condition: "Excellent",
            location: "HQ - Floor 4",
            purchaseDate: new Date().toISOString().split('T')[0],
            purchaseValue: value,
            warrantyTill: "2029-12-31",
            serialNumber: `SN-${tag}`,
            manufacturer: "Generic",
            specs: "Imported via SQL fallback parsing",
            history: [{ date: new Date().toISOString().split('T')[0], action: "SQL_IMPORT", details: "Imported via bracket fallback parser" }]
          });
        }
      }
    }

    if (assets.length === 0) {
      return {
        success: false,
        assets: [],
        error: "No valid INSERT statements or bracketed SQL record definitions detected. Ensure your SQL contains standard INSERT INTO syntax."
      };
    }

    return {
      success: true,
      assets
    };

  } catch (err: any) {
    return {
      success: false,
      assets: [],
      error: err?.message || "Syntactic parser error during SQL processing."
    };
  }
}


interface AssetDirectoryScreenProps {
  assets: Asset[];
  setAssets: React.Dispatch<React.SetStateAction<Asset[]>>;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function AssetDirectoryScreen({
  assets,
  setAssets,
  searchQuery,
  setSearchQuery
}: AssetDirectoryScreenProps) {
  
  // Local UI State
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [deptFilter, setDeptFilter] = useState<string>("ALL");
  const [catFilter, setCatFilter] = useState<string>("ALL");
  
  // Add Asset modal state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newAsset, setNewAsset] = useState({
    tag: "",
    name: "",
    category: "Laptops",
    department: "Engineering",
    status: AssetStatus.AVAILABLE,
    assignedTo: "",
    condition: "Excellent",
    location: "HQ - Floor 4",
    purchaseDate: new Date().toISOString().split('T')[0],
    purchaseValue: 1200,
    serialNumber: "",
    manufacturer: "",
    specs: ""
  });

  // Selected asset for detailed slider
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);

  // SQL Import Console State
  const [isSqlModalOpen, setIsSqlModalOpen] = useState(false);
  const [sqlInput, setSqlInput] = useState("");
  const [parsedPreview, setParsedPreview] = useState<Asset[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<"APPEND" | "REPLACE">("APPEND");
  const [isDragging, setIsDragging] = useState(false);
  const [copiedSample, setCopiedSample] = useState(false);

  const SAMPLE_SQL_TEMPLATE = `-- Create Table Definition for Reference
CREATE TABLE assets (
  tag VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(100),
  department VARCHAR(100),
  status VARCHAR(50),
  assignedTo VARCHAR(255),
  condition VARCHAR(50),
  location VARCHAR(255),
  purchaseDate DATE,
  purchaseValue INT,
  serialNumber VARCHAR(100),
  manufacturer VARCHAR(100),
  specs TEXT
);

-- Insert custom inventory nodes
INSERT INTO assets 
  (tag, name, category, department, status, assignedTo, condition, location, purchaseDate, purchaseValue, serialNumber, manufacturer, specs) 
VALUES 
  ('AF-SQL-M3', 'Quantum MacBook Pro M3', 'Laptops', 'Engineering', 'AVAILABLE', '', 'New', 'Server Room Alpha', '2026-07-10', 3499, 'QT-M3-9021', 'Apple', '128GB RAM, 4TB SSD, Liquid Retina XDR'),
  ('AF-SQL-S1', 'UltraWide OLED 49" Monitor', 'Peripherals', 'Engineering', 'ALLOCATED', 'Elena Rostova', 'Excellent', 'HQ - Floor 2', '2026-05-15', 1299, 'OLED-49-77A', 'Samsung', 'Dual QHD, 240Hz, Curved Smart Screen'),
  ('AF-SQL-V2', 'Autonomous Logistic Drone V2', 'Vehicles', 'Logistics', 'MAINTENANCE', 'Daemon Operator', 'Good', 'Depot Wing Beta', '2025-11-22', 15000, 'DRN-V2-882', 'AssetFlow Tech', 'AI Guidance, Lidar Scanner, 15km range'),
  ('AF-SQL-C8', 'Ergonomic Aero Mesh Chair', 'Furniture', 'Marketing', 'AVAILABLE', '', 'Excellent', 'HQ - Floor 1', '2026-02-01', 850, 'CHR-AERO-04', 'Herman Miller', 'Pneumatic adjustment, posturefit SL support');`;

  const handleLoadSample = () => {
    setSqlInput(SAMPLE_SQL_TEMPLATE);
    const result = parseSqlToAssets(SAMPLE_SQL_TEMPLATE);
    if (result.success) {
      setParsedPreview(result.assets);
      setParseError(null);
    } else {
      setParsedPreview([]);
      setParseError(result.error || "Failed to parse");
    }
  };

  const handleSqlChange = (value: string) => {
    setSqlInput(value);
    if (!value.trim()) {
      setParsedPreview([]);
      setParseError(null);
      return;
    }
    const result = parseSqlToAssets(value);
    if (result.success) {
      setParsedPreview(result.assets);
      setParseError(null);
    } else {
      setParsedPreview([]);
      setParseError(result.error || "Failed to parse template");
    }
  };

  const handleFileUpload = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      handleSqlChange(text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const triggerFileInput = () => {
    const fileInput = document.getElementById("sql-file-picker") as HTMLInputElement;
    if (fileInput) fileInput.click();
  };

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (parsedPreview.length === 0) {
      alert("No valid assets found to import. Please check your SQL syntax.");
      return;
    }

    if (importMode === "REPLACE") {
      if (confirm(`This will wipe all existing ${assets.length} items in the inventory and replace them with ${parsedPreview.length} items from your SQL script. Proceed?`)) {
        setAssets(parsedPreview);
        setIsSqlModalOpen(false);
        resetSqlState();
      }
    } else {
      const existingTags = new Set(assets.map(a => a.tag));
      const overlappingTags = parsedPreview.filter(p => existingTags.has(p.tag));
      
      let shouldProceed = true;
      if (overlappingTags.length > 0) {
        shouldProceed = confirm(`${overlappingTags.length} assets from your SQL file share matching serial/tags with items in your inventory. Overwrite existing ones with new SQL values? (Unmatched items will be cleanly appended)`);
      }

      if (shouldProceed) {
        setAssets(prev => {
          const sqlTags = new Set(parsedPreview.map(p => p.tag));
          const filteredPrev = prev.filter(p => !sqlTags.has(p.tag));
          return [...parsedPreview, ...filteredPrev];
        });
        setIsSqlModalOpen(false);
        resetSqlState();
      }
    }
  };

  const resetSqlState = () => {
    setSqlInput("");
    setParsedPreview([]);
    setParseError(null);
    setImportMode("APPEND");
  };

  // Derive unique categories and departments for dynamic filter dropdowns
  const categories = ["ALL", ...Array.from(new Set(assets.map(a => a.category)))];
  const departments = ["ALL", ...Array.from(new Set(assets.map(a => a.department)))];

  // Filtering Logic
  const filteredAssets = assets.filter((asset) => {
    // Search query matching
    const matchesSearch = 
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.tag.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.assignedTo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.specs.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "ALL" || asset.status === statusFilter;
    const matchesDept = deptFilter === "ALL" || asset.department === deptFilter;
    const matchesCat = catFilter === "ALL" || asset.category === catFilter;

    return matchesSearch && matchesStatus && matchesDept && matchesCat;
  });

  // Submit Handler: Add Asset
  const handleAddAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.name || !newAsset.serialNumber) {
      alert("Please provide an asset name and serial number.");
      return;
    }

    const tagToUse = newAsset.tag || `AF-2026-${Math.floor(100 + Math.random() * 900)}`;
    const addedAsset: Asset = {
      tag: tagToUse,
      name: newAsset.name,
      category: newAsset.category,
      department: newAsset.department,
      status: newAsset.status,
      assignedTo: newAsset.assignedTo,
      assignedToTitle: newAsset.assignedTo ? "General Associate" : undefined,
      condition: newAsset.condition,
      location: newAsset.location,
      purchaseDate: newAsset.purchaseDate,
      purchaseValue: Number(newAsset.purchaseValue) || 0,
      warrantyTill: newAsset.purchaseDate ? `${Number(newAsset.purchaseDate.split("-")[0]) + 3}-12-31` : "2029-12-31",
      serialNumber: newAsset.serialNumber,
      manufacturer: newAsset.manufacturer || "Generic Manufacturer",
      specs: newAsset.specs || "No additional configuration provided.",
      history: [
        { date: new Date().toISOString().split('T')[0], action: "ADDED", details: "Asset registered into inventory ledger" }
      ]
    };

    setAssets(prev => [addedAsset, ...prev]);
    setIsAddModalOpen(false);
    // Reset form
    setNewAsset({
      tag: "",
      name: "",
      category: "Laptops",
      department: "Engineering",
      status: AssetStatus.AVAILABLE,
      assignedTo: "",
      condition: "Excellent",
      location: "HQ - Floor 4",
      purchaseDate: new Date().toISOString().split('T')[0],
      purchaseValue: 1200,
      serialNumber: "",
      manufacturer: "",
      specs: ""
    });
  };

  // Quick Action: Delete Asset
  const handleDeleteAsset = (tag: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid triggering details modal
    if (confirm(`Are you sure you want to retire asset ${tag} from the inventory?`)) {
      setAssets(prev => prev.filter(a => a.tag !== tag));
      if (selectedAsset?.tag === tag) {
        setSelectedAsset(null);
      }
    }
  };

  return (
    <div id="asset-directory-view" className="space-y-6">
      
      {/* View Header with Add Asset trigger */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Hardware Inventory</h2>
          <p className="text-sm text-slate-500">Search, monitor and register corporate assets across all facilities.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          <button
            id="sql-import-button"
            onClick={() => setIsSqlModalOpen(true)}
            className="bg-white border border-slate-250 hover:bg-slate-50 hover:text-slate-900 text-slate-700 font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer transition-all shadow-sm"
          >
            <Database className="h-4 w-4 text-teal-600" />
            SQL Import & Load
          </button>
          <button
            id="add-asset-button"
            onClick={() => setIsAddModalOpen(true)}
            className="bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 font-bold py-2 px-4 rounded-lg text-xs flex items-center gap-1.5 cursor-pointer shadow-md transition-all"
          >
            <Plus className="h-4 w-4" />
            Add Asset to Ledger
          </button>
        </div>
      </div>

      {/* Grid of active Filters & Search Indicators */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs">
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Quick status tabs */}
          <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-lg">
            {["ALL", "AVAILABLE", "ALLOCATED", "MAINTENANCE"].map((tab) => (
              <button
                key={tab}
                id={`filter-status-${tab.toLowerCase()}`}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors cursor-pointer ${
                  statusFilter === tab 
                    ? "bg-white text-slate-900 shadow-xs border border-slate-200/50" 
                    : "text-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.charAt(0) + tab.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          {/* Department Filter dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              id="filter-department-select"
              value={deptFilter}
              onChange={(e) => setDeptFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-250 rounded-lg p-1.5 text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Departments</option>
              {departments.filter(d => d !== "ALL").map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Category Filter dropdown */}
          <div className="flex items-center gap-2">
            <Tag className="h-3.5 w-3.5 text-slate-400" />
            <select
              id="filter-category-select"
              value={catFilter}
              onChange={(e) => setCatFilter(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-250 rounded-lg p-1.5 text-slate-700 font-medium focus:outline-none focus:border-teal-500"
            >
              <option value="ALL">All Categories</option>
              {categories.filter(c => c !== "ALL").map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Clear Filter display */}
          {(statusFilter !== "ALL" || deptFilter !== "ALL" || catFilter !== "ALL" || searchQuery) && (
            <button
              onClick={() => {
                setStatusFilter("ALL");
                setDeptFilter("ALL");
                setCatFilter("ALL");
                setSearchQuery("");
              }}
              className="text-xs text-rose-500 hover:text-rose-600 font-bold hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}

          {/* Matches indicators */}
          <span className="ml-auto font-mono text-[11px] text-slate-400">
            Showing {filteredAssets.length} of {assets.length} ledger nodes
          </span>

        </div>
      </div>

      {/* Main Asset Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-400 font-mono uppercase text-[10px]">
                <th className="p-4 font-semibold">Asset / Tag</th>
                <th className="p-4 font-semibold">Category</th>
                <th className="p-4 font-semibold">Department</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Assigned To</th>
                <th className="p-4 font-semibold">Location</th>
                <th className="p-4 font-semibold text-right">Ledger Value</th>
                <th className="p-4 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAssets.map((asset) => (
                <tr 
                  key={asset.tag} 
                  id={`asset-row-${asset.tag.toLowerCase()}`}
                  onClick={() => setSelectedAsset(asset)}
                  className="hover:bg-slate-50/70 transition-colors cursor-pointer group"
                >
                  {/* Name & Tag */}
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-slate-100 group-hover:bg-teal-50 p-2 rounded-lg border border-slate-150 transition-colors text-slate-500 group-hover:text-teal-600">
                        <Tag className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-800 text-sm group-hover:text-slate-900 transition-colors">{asset.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">{asset.tag}</p>
                      </div>
                    </div>
                  </td>
                  
                  {/* Category */}
                  <td className="p-4">
                    <span className="text-slate-700 font-medium">{asset.category}</span>
                  </td>

                  {/* Department */}
                  <td className="p-4">
                    <span className="text-slate-500 font-medium">{asset.department}</span>
                  </td>

                  {/* Status Badge */}
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                      asset.status === AssetStatus.AVAILABLE 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                        : asset.status === AssetStatus.ALLOCATED 
                        ? "bg-sky-50 text-sky-700 border border-sky-200" 
                        : "bg-amber-50 text-amber-700 border border-amber-200"
                    }`}>
                      <span className={`h-1 w-1 rounded-full ${
                        asset.status === AssetStatus.AVAILABLE 
                          ? "bg-emerald-500" 
                          : asset.status === AssetStatus.ALLOCATED 
                          ? "bg-sky-500" 
                          : "bg-amber-500"
                      }`}></span>
                      {asset.status}
                    </span>
                  </td>

                  {/* Assigned To */}
                  <td className="p-4">
                    {asset.assignedTo ? (
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-[10px]">
                          {asset.assignedTo.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800">{asset.assignedTo}</p>
                          {asset.assignedToTitle && <p className="text-[10px] text-slate-400">{asset.assignedToTitle}</p>}
                        </div>
                      </div>
                    ) : (
                      <span className="text-slate-400 italic">Unassigned</span>
                    )}
                  </td>

                  {/* Location */}
                  <td className="p-4">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                      <span>{asset.location}</span>
                    </div>
                  </td>

                  {/* Ledger Value */}
                  <td className="p-4 text-right font-mono font-bold text-slate-700">
                    ${asset.purchaseValue.toLocaleString()}
                  </td>

                  {/* Table Actions */}
                  <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => setSelectedAsset(asset)}
                        className="p-1.5 hover:bg-slate-100 rounded-md text-slate-400 hover:text-slate-600 transition-colors"
                        title="View Details"
                      >
                        <Info className="h-4 w-4" />
                      </button>
                      <button
                        onClick={(e) => handleDeleteAsset(asset.tag, e)}
                        className="p-1.5 hover:bg-rose-50 rounded-md text-slate-400 hover:text-rose-500 transition-colors"
                        title="Retire Asset"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredAssets.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-12 text-center">
                    <SlidersHorizontal className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                    <p className="text-slate-500 font-semibold">No assets found matching the query.</p>
                    <p className="text-slate-400 text-xs mt-1">Try resetting the filters or modifying your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL 1: ADD ASSET PANEL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="font-bold text-slate-800 text-base">Register New Asset Node</h3>
                <p className="text-xs text-slate-400">Introduce a physical or logical unit to the organization's EAM ledger.</p>
              </div>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleAddAsset} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-name" className="text-xs font-bold text-slate-600">Asset Name *</label>
                  <input
                    id="new-asset-name"
                    type="text"
                    required
                    value={newAsset.name}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="e.g. MacBook Pro 16-inch M3"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Serial Number */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-serial" className="text-xs font-bold text-slate-600">Serial / Asset ID Token *</label>
                  <input
                    id="new-asset-serial"
                    type="text"
                    required
                    value={newAsset.serialNumber}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, serialNumber: e.target.value }))}
                    placeholder="e.g. SN-8921-X99"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-category" className="text-xs font-bold text-slate-600">Inventory Category</label>
                  <select
                    id="new-asset-category"
                    value={newAsset.category}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Laptops">Laptops</option>
                    <option value="Peripherals">Peripherals</option>
                    <option value="Vehicles">Vehicles</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Server Stack">Server Stack</option>
                  </select>
                </div>

                {/* Department */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-department" className="text-xs font-bold text-slate-600">Asset Department</label>
                  <select
                    id="new-asset-department"
                    value={newAsset.department}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, department: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Operations">Operations</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                {/* Manufacturer */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-manufacturer" className="text-xs font-bold text-slate-600">Manufacturer</label>
                  <input
                    id="new-asset-manufacturer"
                    type="text"
                    value={newAsset.manufacturer}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, manufacturer: e.target.value }))}
                    placeholder="e.g. Apple, Dell, Steelcase"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Condition */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-condition" className="text-xs font-bold text-slate-600">Unit Condition</label>
                  <select
                    id="new-asset-condition"
                    value={newAsset.condition}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, condition: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  >
                    <option value="New">New / In Box</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair (Wear and Tear)</option>
                  </select>
                </div>

                {/* Purchase Date */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-purchase-date" className="text-xs font-bold text-slate-600">Purchase Date</label>
                  <input
                    id="new-asset-purchase-date"
                    type="date"
                    value={newAsset.purchaseDate}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, purchaseDate: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

                {/* Purchase Value */}
                <div className="space-y-1">
                  <label htmlFor="new-asset-value" className="text-xs font-bold text-slate-600">Acquisition Value (USD)</label>
                  <input
                    id="new-asset-value"
                    type="number"
                    value={newAsset.purchaseValue}
                    onChange={(e) => setNewAsset(prev => ({ ...prev, purchaseValue: Number(e.target.value) }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                  />
                </div>

              </div>

              {/* Physical Location */}
              <div className="space-y-1">
                <label htmlFor="new-asset-location" className="text-xs font-bold text-slate-600">Storage / Deployment Location</label>
                <input
                  id="new-asset-location"
                  type="text"
                  value={newAsset.location}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g. HQ - Floor 4, Server Room B"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Specs */}
              <div className="space-y-1">
                <label htmlFor="new-asset-specs" className="text-xs font-bold text-slate-600">Technical Specs & Configuration</label>
                <textarea
                  id="new-asset-specs"
                  value={newAsset.specs}
                  rows={2}
                  onChange={(e) => setNewAsset(prev => ({ ...prev, specs: e.target.value }))}
                  placeholder="e.g. 64GB RAM, 2TB SSD, Intel Core Ultra 9"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-800 focus:outline-none focus:border-teal-500"
                />
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="submit-new-asset-button"
                  type="submit"
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 active:bg-teal-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md"
                >
                  Confirm Registration
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* DETAIL DRAWER / SLIDER: SELECT AN ASSET */}
      {selectedAsset && (
        <div className="fixed inset-y-0 right-0 w-full sm:max-w-md bg-white border-l border-slate-200 z-50 shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
          
          {/* Slider Header */}
          <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                {selectedAsset.tag}
              </span>
              <span className="text-xs font-bold text-slate-400">Spec Node Sheet</span>
            </div>
            <button 
              onClick={() => setSelectedAsset(null)}
              className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Slider Content */}
          <div className="flex-1 p-6 space-y-6 overflow-y-auto">
            
            {/* Title & Core Details */}
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-slate-900 font-sans tracking-tight leading-tight">{selectedAsset.name}</h3>
              <p className="text-xs text-slate-400">{selectedAsset.category} &bull; {selectedAsset.department} Department</p>
              
              <div className="pt-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                  selectedAsset.status === AssetStatus.AVAILABLE 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200" 
                    : selectedAsset.status === AssetStatus.ALLOCATED 
                    ? "bg-sky-50 text-sky-700 border border-sky-200" 
                    : "bg-amber-50 text-amber-700 border border-amber-200"
                }`}>
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    selectedAsset.status === AssetStatus.AVAILABLE ? "bg-emerald-500" : selectedAsset.status === AssetStatus.ALLOCATED ? "bg-sky-500" : "bg-amber-500"
                  }`}></span>
                  {selectedAsset.status}
                </span>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Hardware Information Metadata Grid */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Device Hardware Manifest</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Manufacturer</span>
                  <span className="text-xs font-medium text-slate-800">{selectedAsset.manufacturer}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Serial Code</span>
                  <span className="text-xs font-mono font-medium text-slate-800">{selectedAsset.serialNumber}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Hardware Condition</span>
                  <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md inline-block font-semibold">
                    {selectedAsset.condition}
                  </span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Location</span>
                  <span className="text-xs font-medium text-slate-800">{selectedAsset.location}</span>
                </div>
              </div>

              <div className="space-y-1 bg-slate-50 p-3 rounded-lg border border-slate-100">
                <span className="text-[10px] text-slate-400 font-mono block uppercase">Technical Specs Configuration</span>
                <p className="text-xs text-slate-700 leading-normal font-medium">{selectedAsset.specs}</p>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Procurement Ledger Details */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider">Financial & Procurement Ledger</h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Purchase Date</span>
                  <span className="text-xs font-medium text-slate-800">{selectedAsset.purchaseDate}</span>
                </div>
                <div className="space-y-0.5">
                  <span className="text-[10px] text-slate-400 block font-semibold">Acquisition Value</span>
                  <span className="text-xs font-mono font-bold text-slate-900">${selectedAsset.purchaseValue.toLocaleString()} USD</span>
                </div>
                <div className="space-y-0.5 col-span-2">
                  <span className="text-[10px] text-slate-400 block font-semibold">Active Warranty Until</span>
                  <span className="text-xs font-semibold text-slate-700 flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5 text-slate-400" />
                    {selectedAsset.warrantyTill}
                  </span>
                </div>
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Event History Logs */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <History className="h-3.5 w-3.5 text-slate-400" />
                Ledger Mutation Timeline ({selectedAsset.history.length})
              </h4>
              
              <div className="space-y-3 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
                {selectedAsset.history.map((hist, i) => (
                  <div key={i} className="flex gap-4 relative">
                    <div className="h-4.5 w-4.5 rounded-full bg-teal-50 border border-teal-200 flex items-center justify-center shrink-0 z-10">
                      <span className="h-1.5 w-1.5 rounded-full bg-teal-500"></span>
                    </div>
                    <div className="space-y-0.5 text-xs">
                      <div className="flex items-baseline gap-2">
                        <span className="font-bold text-slate-800 uppercase tracking-tight">{hist.action}</span>
                        <span className="text-[10px] font-mono text-slate-400">{hist.date}</span>
                      </div>
                      <p className="text-slate-500 leading-normal">{hist.details}</p>
                    </div>
                  </div>
                ))}

                {selectedAsset.history.length === 0 && (
                  <p className="text-xs text-slate-400 italic">No historical timeline records available for this unit.</p>
                )}
              </div>
            </div>

          </div>

          {/* Drawer Footer Actions */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/80 flex gap-2">
            <button
              onClick={() => {
                const newStatus = selectedAsset.status === AssetStatus.AVAILABLE ? AssetStatus.ALLOCATED : AssetStatus.AVAILABLE;
                setAssets(prev => prev.map(a => {
                  if (a.tag === selectedAsset.tag) {
                    return {
                      ...a,
                      status: newStatus,
                      assignedTo: newStatus === AssetStatus.AVAILABLE ? "" : "Marcus Chen",
                      history: [
                        { date: new Date().toISOString().split('T')[0], action: "STATUS_CHANGE", details: `Status manually updated to ${newStatus} in details sheet` },
                        ...a.history
                      ]
                    };
                  }
                  return a;
                }));
                setSelectedAsset(null);
              }}
              className="flex-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2 px-3 rounded-lg text-xs cursor-pointer transition-colors"
            >
              Toggle Status (Checkout/Return)
            </button>
            <button
              onClick={() => setSelectedAsset(null)}
              className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
            >
              Close Panel
            </button>
          </div>

        </div>
      )}

      {/* SQL IMPORT MODAL CONSOLE */}
      {isSqlModalOpen && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-150 flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="bg-teal-50 border border-teal-200 p-2 rounded-lg text-teal-600">
                  <Database className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-base">Cryptographic SQL Terminal Import</h3>
                  <p className="text-xs text-slate-400">Load backup files, SQL scripts or manually write structured INSERT statements.</p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsSqlModalOpen(false);
                  resetSqlState();
                }}
                className="p-1.5 hover:bg-slate-200 rounded-lg text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5">
              
              {/* Drag-and-Drop + Select File Drop Zone */}
              <div 
                id="sql-drag-drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={triggerFileInput}
                className={`border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-2 ${
                  isDragging 
                    ? "border-teal-500 bg-teal-50/50 scale-[0.99] shadow-inner" 
                    : sqlInput 
                    ? "border-slate-200 bg-slate-50/50 hover:bg-slate-100/30" 
                    : "border-slate-300 hover:border-teal-400 hover:bg-slate-50/50"
                }`}
              >
                <input 
                  id="sql-file-picker"
                  type="file" 
                  accept=".sql,.txt"
                  className="hidden" 
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileUpload(e.target.files[0]);
                    }
                  }}
                />
                
                {sqlInput ? (
                  <div className="flex items-center gap-2 text-slate-600">
                    <FileText className="h-8 w-8 text-teal-500" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-slate-800">SQL Database Loaded</p>
                      <p className="text-[10px] text-slate-400">Content loaded into editor terminal below</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <Upload className={`h-8 w-8 transition-colors ${isDragging ? 'text-teal-500' : 'text-slate-400'}`} />
                    <div>
                      <p className="text-xs font-bold text-slate-700">Drag & drop your .sql file here</p>
                      <p className="text-[10px] text-slate-400 mt-1">or click to manually browse and select a file from your system</p>
                    </div>
                  </>
                )}
              </div>

              {/* Text Area Manual Input */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="sql-manual-input" className="text-xs font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5 text-slate-400" />
                    SQL Script Editor
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSample}
                      className="text-[10px] font-bold text-teal-600 hover:text-teal-700 hover:underline cursor-pointer bg-teal-50/80 px-2.5 py-1 rounded border border-teal-100 transition-colors"
                    >
                      💡 Load Sample Template SQL
                    </button>
                    {sqlInput && (
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(sqlInput);
                          setCopiedSample(true);
                          setTimeout(() => setCopiedSample(false), 2000);
                        }}
                        className="text-[10px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer bg-slate-100 px-2 py-1 rounded transition-colors flex items-center gap-1"
                      >
                        {copiedSample ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-500" />
                            Copied!
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            Copy SQL
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                <div className="relative border border-slate-200 rounded-xl overflow-hidden shadow-2xs font-mono">
                  <textarea
                    id="sql-manual-input"
                    value={sqlInput}
                    onChange={(e) => handleSqlChange(e.target.value)}
                    placeholder="-- Write or paste your custom SQL dump script here&#10;-- Expected syntax: INSERT INTO assets (tag, name, category, department, ...) VALUES (...);&#10;-- Or paste bracket definitions like: ('AF-01', 'My MacBook', 'Laptops', 'Engineering', 1200)"
                    rows={8}
                    className="w-full bg-slate-900 text-slate-100 text-xs p-4 focus:outline-none leading-relaxed resize-none scrollbar-thin scrollbar-thumb-slate-800"
                  />
                  
                  {/* Realtime status floating footer */}
                  <div className="absolute bottom-2 right-2 flex items-center gap-2">
                    {parseError ? (
                      <span className="text-[10px] bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded font-sans flex items-center gap-1 font-semibold">
                        <AlertCircle className="h-3 w-3" />
                        Syntax Error
                      </span>
                    ) : parsedPreview.length > 0 ? (
                      <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded font-sans flex items-center gap-1 font-semibold">
                        <Check className="h-3 w-3" />
                        {parsedPreview.length} assets ready
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Parse feedback error message if invalid */}
              {parseError && (
                <div className="bg-rose-50 border border-rose-150 p-3.5 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-semibold leading-relaxed">
                  <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-rose-800">SQL Parsing Error</p>
                    <p className="font-medium mt-0.5 text-[11px] text-rose-600/95">{parseError}</p>
                  </div>
                </div>
              )}

              {/* Dynamic Live Preview Area of the parsed assets */}
              {parsedPreview.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest px-1">
                    SQL Parsing Live Manifest Preview ({parsedPreview.length} units detected)
                  </h4>
                  
                  <div className="border border-slate-150 rounded-xl max-h-48 overflow-y-auto divide-y divide-slate-100 bg-slate-50/50">
                    {parsedPreview.map((preview, i) => (
                      <div key={i} className="p-3 text-xs flex items-center justify-between gap-4 hover:bg-white transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="bg-white border border-slate-150 text-slate-500 p-1.5 rounded-lg font-mono text-[9px] font-bold">
                            {preview.tag}
                          </div>
                          <div>
                            <p className="font-bold text-slate-800">{preview.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {preview.manufacturer} &bull; {preview.category} &bull; {preview.department}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 font-mono">
                          <span className="text-[10px] font-bold text-slate-400">
                            {preview.location}
                          </span>
                          <span className="font-bold text-slate-900">
                            ${preview.purchaseValue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Import Mode toggles */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800 block">Database Synchronization Mode</span>
                  <span className="text-[10px] text-slate-400 block">Choose how parsed items merge into your current hardware directory list.</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white border border-slate-200/80 p-1 rounded-lg shadow-3xs self-stretch sm:self-auto justify-center">
                  <button
                    type="button"
                    onClick={() => setImportMode("APPEND")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      importMode === "APPEND"
                        ? "bg-slate-900 text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    Append & Sync
                  </button>
                  <button
                    type="button"
                    onClick={() => setImportMode("REPLACE")}
                    className={`flex-1 sm:flex-initial px-3.5 py-1.5 text-[11px] font-bold rounded-md transition-all cursor-pointer ${
                      importMode === "REPLACE"
                        ? "bg-rose-500 text-white shadow-xs"
                        : "text-slate-500 hover:text-rose-600"
                    }`}
                  >
                    Wipe & Replace
                  </button>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between shrink-0">
              <span className="text-[10px] font-mono text-slate-400 font-medium">
                Engine supports standard SQL Dumps (Postgres, MySQL, Oracle schemas).
              </span>
              
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsSqlModalOpen(false);
                    resetSqlState();
                  }}
                  className="px-4 py-2 hover:bg-slate-100 text-slate-600 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  id="execute-sql-import-btn"
                  type="button"
                  onClick={handleImportSubmit}
                  disabled={parsedPreview.length === 0}
                  className="px-4 py-2 bg-teal-500 hover:bg-teal-400 disabled:opacity-50 active:bg-teal-600 text-slate-950 text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md flex items-center gap-1"
                >
                  <Check className="h-3.5 w-3.5" />
                  Commit SQL Data
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
