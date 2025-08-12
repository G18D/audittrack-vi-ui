"use client";

import React, { useMemo, useState, useCallback } from "react";
import {
  Upload,
  FileCheck2,
  ShieldCheck,
  Settings,
  ScanSearch,
  DatabaseZap,
  History,
  Download,
  Trash2,
  Play,
  Pause,
  ChevronRight,
  CheckCircle2,
  AlertTriangle,
  CircleHelp,
  Loader2,
  Search,
  FileText,
  Filter,
  Menu,
  X,
  TrendingUp,
  Clock,
  Users,
  DollarSign,
} from "lucide-react";

/**
 * AuditTrack VI — Enhanced Caribbean-themed audit management system
 * Production-ready Next.js App Router page
 */

// Caribbean color palette - simplified for better TypeScript compatibility
const colors = {
  reef: "#00B6A0",
  lagoon: "#15C3D6", 
  sea: "#007D8C",
  sand: "#F4E6C5",
  dusk: "#0B3045",
  coral: "#FF4D5A",
  mango: "#F7B500",
  surf: "#E8FBF8",
} as const;

// Enhanced Badge component
const Badge = ({
  tone = "reef",
  size = "sm",
  children,
  className = "",
}: {
  tone?: keyof typeof colors;
  size?: "xs" | "sm" | "md";
  children: React.ReactNode;
  className?: string;
}) => {
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs", 
    md: "px-3 py-1.5 text-sm"
  };

  const toneStyles = {
    reef: "bg-emerald-50 text-emerald-600 border-emerald-200",
    lagoon: "bg-cyan-50 text-cyan-600 border-cyan-200",
    sea: "bg-teal-50 text-teal-600 border-teal-200",
    coral: "bg-red-50 text-red-600 border-red-200",
    mango: "bg-yellow-50 text-yellow-600 border-yellow-200",
    sand: "bg-amber-50 text-amber-600 border-amber-200",
    surf: "bg-teal-50 text-teal-600 border-teal-200",
    dusk: "bg-slate-50 text-slate-600 border-slate-200",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold border ${sizes[size]} ${toneStyles[tone]} ${className}`}
    >
      {children}
    </span>
  );
};

// Enhanced Stat component with better visual hierarchy
const Stat = ({
  label,
  value,
  hint,
  icon,
  trend,
  className = "",
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}) => {
  const trendColors = {
    up: "text-emerald-600",
    down: "text-red-600",
    neutral: "text-slate-500"
  };

  return (
    <div className={`rounded-2xl p-6 bg-white shadow-sm hover:shadow-md transition-all border border-slate-200 ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="text-sm font-medium text-slate-600">{label}</div>
        {icon && (
          <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
            {icon}
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-slate-900 mb-1">{value}</div>
      {hint && (
        <div className="flex items-center gap-1 text-xs">
          {trend && <TrendingUp size={12} className={trendColors[trend]} />}
          <span className={trendColors[trend || 'neutral']}>{hint}</span>
        </div>
      )}
    </div>
  );
};

// Enhanced Card component with better styling
const Card = ({
  title,
  icon,
  actions,
  children,
  accent = "reef",
  className = "",
}: {
  title: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  children: React.ReactNode;
  accent?: keyof typeof colors;
  className?: string;
}) => {
  const accentStyles = {
    reef: "bg-emerald-50 border-emerald-100",
    lagoon: "bg-cyan-50 border-cyan-100",
    sea: "bg-teal-50 border-teal-100",
    coral: "bg-red-50 border-red-100",
    mango: "bg-yellow-50 border-yellow-100",
    sand: "bg-amber-50 border-amber-100",
    surf: "bg-teal-50 border-teal-100",
    dusk: "bg-slate-50 border-slate-100",
  };

  const iconStyles = {
    reef: "bg-emerald-100 text-emerald-600",
    lagoon: "bg-cyan-100 text-cyan-600",
    sea: "bg-teal-100 text-teal-600",
    coral: "bg-red-100 text-red-600",
    mango: "bg-yellow-100 text-yellow-600",
    sand: "bg-amber-100 text-amber-600",
    surf: "bg-teal-100 text-teal-600",
    dusk: "bg-slate-100 text-slate-600",
  };

  return (
    <div className={`rounded-2xl bg-white shadow-md hover:shadow-lg transition-all duration-200 border border-slate-200 overflow-hidden ${className}`}>
      <div className={`flex items-center justify-between px-6 py-4 border-b border-slate-100 ${accentStyles[accent]}`}>
        <div className="flex items-center gap-3">
          {icon && (
            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${iconStyles[accent]}`}>
              {icon}
            </div>
          )}
          <h3 className="font-semibold text-slate-900 text-lg">{title}</h3>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

// Sample data with more realistic content
const filesDemo = [
  {
    id: 1,
    name: "Invoice_Q2_2025_001247.pdf",
    size: "2.4 MB",
    status: "Passed" as const,
    issues: 0,
    vendor: "Caribbean Supply Co.",
    uploadedAt: "2 hours ago",
    amount: "$15,240.00"
  },
  {
    id: 2,
    name: "Payroll_July_2025.xlsx", 
    size: "156 KB",
    status: "Flagged" as const,
    issues: 3,
    vendor: "HR Department",
    uploadedAt: "4 hours ago",
    amount: "$89,750.00"
  },
  {
    id: 3,
    name: "Contract_Maintenance_UVI.pdf",
    size: "3.8 MB", 
    status: "Manual Review" as const,
    issues: 1,
    vendor: "Island Facilities LLC",
    uploadedAt: "1 day ago",
    amount: "$45,500.00"
  },
  {
    id: 4,
    name: "Receipt_Office_Supplies.pdf",
    size: "890 KB",
    status: "Passed" as const, 
    issues: 0,
    vendor: "Office Depot VI",
    uploadedAt: "2 days ago",
    amount: "$1,847.32"
  }
] as const;

const statusConfig = {
  "Passed": { tone: "reef" as const, icon: CheckCircle2 },
  "Flagged": { tone: "coral" as const, icon: AlertTriangle },
  "Manual Review": { tone: "mango" as const, icon: CircleHelp }
};

// Enhanced Progress component
const ProgressPill = ({ value, label, className = "" }: { value: number; label?: string; className?: string }) => (
  <div className={`space-y-2 ${className}`}>
    {label && (
      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-600">{label}</span>
        <span className="font-medium text-slate-900">{value}%</span>
      </div>
    )}
    <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-cyan-500"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

// Enhanced Action Button
const ActionButton = ({
  icon,
  label,
  onClick,
  tone = "reef",
  size = "md",
  variant = "outline",
  disabled = false,
  className = "",
}: {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  tone?: keyof typeof colors;
  size?: "sm" | "md" | "lg";
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
  className?: string;
}) => {
  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm", 
    lg: "px-6 py-3 text-base"
  };

  const variants = {
    reef: {
      solid: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
      outline: "bg-white text-emerald-600 border-emerald-300 hover:border-emerald-400",
      ghost: "bg-transparent text-emerald-600 border-transparent hover:bg-emerald-50",
    },
    lagoon: {
      solid: "bg-cyan-600 text-white border-cyan-600 hover:bg-cyan-700",
      outline: "bg-white text-cyan-600 border-cyan-300 hover:border-cyan-400", 
      ghost: "bg-transparent text-cyan-600 border-transparent hover:bg-cyan-50",
    },
    sea: {
      solid: "bg-teal-600 text-white border-teal-600 hover:bg-teal-700",
      outline: "bg-white text-teal-600 border-teal-300 hover:border-teal-400",
      ghost: "bg-transparent text-teal-600 border-transparent hover:bg-teal-50",
    },
    coral: {
      solid: "bg-red-600 text-white border-red-600 hover:bg-red-700",
      outline: "bg-white text-red-600 border-red-300 hover:border-red-400",
      ghost: "bg-transparent text-red-600 border-transparent hover:bg-red-50",
    },
    mango: {
      solid: "bg-yellow-600 text-white border-yellow-600 hover:bg-yellow-700",
      outline: "bg-white text-yellow-600 border-yellow-300 hover:border-yellow-400",
      ghost: "bg-transparent text-yellow-600 border-transparent hover:bg-yellow-50",
    },
    sand: {
      solid: "bg-amber-600 text-white border-amber-600 hover:bg-amber-700",
      outline: "bg-white text-amber-600 border-amber-300 hover:border-amber-400",
      ghost: "bg-transparent text-amber-600 border-transparent hover:bg-amber-50",
    },
    surf: {
      solid: "bg-teal-600 text-white border-teal-600 hover:bg-teal-700",
      outline: "bg-white text-teal-600 border-teal-300 hover:border-teal-400",
      ghost: "bg-transparent text-teal-600 border-transparent hover:bg-teal-50",
    },
    dusk: {
      solid: "bg-slate-600 text-white border-slate-600 hover:bg-slate-700",
      outline: "bg-white text-slate-600 border-slate-300 hover:border-slate-400",
      ghost: "bg-transparent text-slate-600 border-transparent hover:bg-slate-50",
    },
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${sizes[size]} ${variants[tone][variant]} ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};

// Enhanced Sidebar with mobile support
function Sidebar({
  current,
  onNavigate,
  isOpen,
  onClose,
  className = "",
}: {
  current: string;
  onNavigate: (key: string) => void;
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <ShieldCheck size={18} /> },
    { key: "ingest", label: "Ingest Rules", icon: <DatabaseZap size={18} /> },
    { key: "review", label: "Review Queue", icon: <ScanSearch size={18} /> },
    { key: "history", label: "History", icon: <History size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky top-0 left-0 h-screen w-[280px] shrink-0 p-4 z-50 lg:z-auto
        transform transition-transform duration-200 lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        ${className}
      `}>
        <div className="rounded-2xl h-full p-6 flex flex-col gap-4 shadow-lg border bg-gradient-to-b from-teal-50 to-amber-50 border-teal-200">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold shadow-md bg-gradient-to-br from-teal-600 to-emerald-600">
                AT
              </div>
              <div>
                <div className="text-lg font-bold text-slate-800">
                  AuditTrack{" "}
                  <span className="text-xs bg-white/80 px-2 py-1 rounded-md ml-1 border border-teal-300 font-medium text-teal-600">
                    VI
                  </span>
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Virgin Islands Edition
                </div>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <X size={18} />
            </button>
          </div>

          {/* Badge */}
          <div className="flex gap-2">
            <Badge tone="coral" size="sm">Caribbean</Badge>
            <Badge tone="reef" size="sm">Beta</Badge>
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex flex-col gap-2">
            {items.map((item) => (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item.key);
                  onClose();
                }}
                className={`flex items-center gap-3 w-full rounded-xl px-4 py-3 text-sm font-medium text-left border transition-all duration-200 ${
                  current === item.key 
                    ? "bg-white shadow-sm border-slate-200 text-teal-700" 
                    : "hover:bg-white/60 border-transparent text-slate-700"
                }`}
              >
                {item.icon}
                {item.label}
                {current === item.key && <ChevronRight className="ml-auto" size={16} />}
              </button>
            ))}
          </nav>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-200/50 space-y-2">
            <div className="text-xs text-slate-600">
              Built for the U.S. Virgin Islands
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span>Status:</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full animate-pulse bg-emerald-500" />
                <span>Online</span>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}

// Enhanced Upload Zone
function UploadZone() {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const picked = Array.from(e.dataTransfer.files || []);
    setFiles((f) => [...f, ...picked]);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((f) => [...f, ...picked]);
  }, []);

  const simulate = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 2000));
    setBusy(false);
    setFiles([]);
    alert("Files successfully queued for audit processing!");
  };

  const clearFiles = () => setFiles([]);

  return (
    <div className="space-y-4">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
          dragOver 
            ? 'border-emerald-400 bg-emerald-50 scale-[1.02]' 
            : 'border-slate-300 bg-white/80 hover:bg-white hover:border-emerald-300'
        }`}
      >
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="p-4 rounded-2xl bg-emerald-50 text-emerald-600">
            <Upload size={32} />
          </div>
          <div>
            <div className="font-semibold text-xl text-slate-900 mb-2">
              Drop your documents here
            </div>
            <div className="text-slate-600 mb-4">
              Upload receipts, invoices, payroll files, and contracts for automated audit
            </div>
            <div className="text-sm text-slate-500">
              Supports PDF, CSV, XLSX, DOCX files up to 10MB
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
          <label>
            <ActionButton
              icon={<Upload size={16} />}
              label="Browse Files"
              variant="outline"
              tone="reef"
            />
            <input 
              type="file" 
              className="hidden" 
              multiple 
              accept=".pdf,.csv,.xlsx,.docx"
              onChange={onPick} 
            />
          </label>
          
          {files.length > 0 && (
            <>
              <ActionButton
                icon={busy ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                label={busy ? "Processing..." : `Process ${files.length} Files`}
                onClick={simulate}
                variant="solid"
                tone="reef"
                disabled={busy}
              />
              <ActionButton
                icon={<Trash2 size={16} />}
                label="Clear"
                onClick={clearFiles}
                variant="ghost"
                tone="coral"
              />
            </>
          )}
        </div>

        {files.length > 0 && (
          <div className="mt-6 p-4 bg-slate-50 rounded-xl">
            <div className="text-sm font-medium text-slate-900 mb-2">
              {files.length} file{files.length > 1 ? 's' : ''} selected
            </div>
            <div className="space-y-1">
              {files.slice(0, 3).map((file, i) => (
                <div key={i} className="text-sm text-slate-600 flex items-center gap-2">
                  <FileText size={14} />
                  <span className="truncate">{file.name}</span>
                  <span className="text-xs text-slate-400">
                    ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </span>
                </div>
              ))}
              {files.length > 3 && (
                <div className="text-xs text-slate-500">
                  ...and {files.length - 3} more files
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Enhanced Files Table
function FilesTable({ searchTerm = "" }: { searchTerm?: string }) {
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return filesDemo;
    return filesDemo.filter(file => 
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.vendor.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-slate-200">
              <th className="pb-3 font-semibold text-slate-700">Document</th>
              <th className="pb-3 font-semibold text-slate-700">Vendor</th>
              <th className="pb-3 font-semibold text-slate-700">Amount</th>
              <th className="pb-3 font-semibold text-slate-700">Status</th>
              <th className="pb-3 font-semibold text-slate-700">Issues</th>
              <th className="pb-3 font-semibold text-slate-700">Uploaded</th>
              <th className="pb-3"></th>
            </tr>
          </thead>
          <tbody>
            {filteredFiles.map((file) => {
              const StatusIcon = statusConfig[file.status].icon;
              return (
                <tr key={file.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{file.name}</div>
                        <div className="text-xs text-slate-500">{file.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-700">{file.vendor}</td>
                  <td className="py-4 font-medium text-slate-900">{file.amount}</td>
                  <td className="py-4">
                    <Badge tone={statusConfig[file.status].tone}>
                      <StatusIcon size={12} />
                      {file.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    {file.issues > 0 ? (
                      <span className="text-red-600 font-medium">{file.issues}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-4 text-slate-500">{file.uploadedAt}</td>
                  <td className="py-4">
                    <ActionButton
                      label="Review"
                      variant="ghost"
                      tone="reef"
                      size="sm"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredFiles.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <div className="font-medium">No documents found</div>
          <div className="text-sm">Try adjusting your search terms</div>
        </div>
      )}
    </div>
  );
}

// Main App Component
export default function AuditTrackVIApp() {
  const [route, setRoute] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(
    () => [
      { 
        label: "Documents Processed", 
        value: "1,247", 
        hint: "+47 today", 
        icon: <FileCheck2 size={20} />,
        trend: "up" as const
      },
      { 
        label: "Issues Resolved", 
        value: "89%", 
        hint: "Above target", 
        icon: <CheckCircle2 size={20} />,
        trend: "up" as const
      },
      { 
        label: "Avg Processing Time", 
        value: "2.3min", 
        hint: "-18% vs last month", 
        icon: <Clock size={20} />,
        trend: "down" as const
      },
      { 
        label: "Total Savings", 
        value: "$89.2K", 
        hint: "YTD efficiency gains", 
        icon: <DollarSign size={20} />,
        trend: "up" as const
      },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-amber-50">
      {/* Enhanced Top Bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <Menu size={20} />
            </button>

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl grid place-items-center text-white font-bold shadow-md bg-gradient-to-br from-red-500 to-yellow-500">
                VI
              </div>
              <div>
                <div className="font-bold text-slate-900">AuditTrack VI</div>
                <div className="text-xs text-slate-500">Caribbean Edition</div>
              </div>
            </div>

            <Badge tone="coral" size="sm">Live</Badge>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={16} />
                <input
                  type="text"
                  placeholder="Search documents, vendors, amounts..."
                  className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <ActionButton 
                icon={<Filter size={16} />} 
                label="Filter" 
                variant="ghost" 
                tone="sea"
                className="hidden sm:inline-flex"
              />
              <ActionButton 
                icon={<Settings size={16} />} 
                label="Settings" 
                variant="outline" 
                tone="sea" 
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="max-w-7xl mx-auto flex">
        <Sidebar 
          current={route} 
          onNavigate={setRoute}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <main className="flex-1 p-6 lg:ml-0">
          {route === "dashboard" && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Stat key={stat.label} {...stat} />
                ))}
              </div>

              {/* Upload and Compliance */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card
                    title="Document Upload Center"
                    icon={<Upload size={20} />}
                    accent="reef"
                    actions={
                      <ActionButton 
                        icon={<Trash2 size={16} />} 
                        label="Clear Queue" 
                        variant="ghost"
                        tone="coral" 
                      />
                    }
                  >
                    <UploadZone />
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card title="Compliance Score" icon={<ShieldCheck size={20} />} accent="mango">
                    <div className="space-y-4">
                      <ProgressPill value={87} label="Overall Compliance" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <div className="text-slate-600">IRS Compliance</div>
                          <div className="font-semibold text-slate-900">94%</div>
                        </div>
                        <div>
                          <div className="text-slate-600">USVI DOL</div>
                          <div className="font-semibold text-slate-900">82%</div>
                        </div>
                      </div>
                      <ActionButton 
                        label="View Report" 
                        variant="outline" 
                        tone="mango"
                        className="w-full"
                      />
                    </div>
                  </Card>

                  <Card title="Quick Actions" icon={<DatabaseZap size={20} />} accent="sea">
                    <div className="space-y-3">
                      <ActionButton 
                        icon={<ScanSearch size={16} />}
                        label="Review Queue (12)"
                        variant="outline"
                        tone="sea"
                        className="w-full justify-start"
                      />
                      <ActionButton 
                        icon={<History size={16} />}
                        label="View History"
                        variant="outline"
                        tone="sea"
                        className="w-full justify-start"
                      />
                      <ActionButton 
                        icon={<Download size={16} />}
                        label="Export Reports"
                        variant="outline"
                        tone="sea"
                        className="w-full justify-start"
                      />
                    </div>
                  </Card>
                </div>
              </div>

              {/* Recent Documents */}
              <Card
                title="Recent Documents"
                icon={<FileCheck2 size={20} />}
                accent="sea"
                actions={
                  <div className="flex gap-2">
                    <ActionButton 
                      icon={<Filter size={16} />} 
                      label="Filter" 
                      variant="ghost"
                      tone="sea" 
                    />
                    <ActionButton 
                      icon={<Download size={16} />} 
                      label="Export" 
                      variant="outline"
                      tone="sea" 
                    />
                  </div>
                }
              >
                <FilesTable searchTerm={searchTerm} />
              </Card>
            </div>
          )}

          {route === "ingest" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card
                    title="Knowledge Base Ingestion"
                    icon={<DatabaseZap size={20} />}
                    accent="sea"
                    actions={<ActionButton icon={<Upload size={16} />} label="Upload Documents" variant="solid" tone="sea" />}
                  >
                    <div className="space-y-6">
                      <div className="text-slate-700">
                        Upload regulatory documents, IRS publications, USVI DOL guidance, and compliance manuals. 
                        Our AI will automatically extract rules, regulations, and requirements to enhance audit accuracy.
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-medium text-slate-900 mb-2">Processing Status</div>
                          <ProgressPill value={68} label="Document Processing" />
                          <div className="mt-2 text-sm text-slate-600">
                            247 documents processed, 89 pending
                          </div>
                        </div>
                        
                        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                          <div className="font-medium text-slate-900 mb-2">Knowledge Extraction</div>
                          <ProgressPill value={84} label="Rule Extraction" />
                          <div className="mt-2 text-sm text-slate-600">
                            1,247 rules indexed and searchable
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <ActionButton icon={<Play size={16} />} label="Start Batch Processing" variant="solid" tone="reef" />
                        <ActionButton icon={<Pause size={16} />} label="Pause Processing" variant="outline" tone="mango" />
                        <ActionButton icon={<Settings size={16} />} label="Configure Rules" variant="ghost" tone="sea" />
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card title="Document Sources" icon={<FileCheck2 size={20} />} accent="reef">
                    <div className="space-y-4">
                      <div className="text-sm text-slate-700 mb-4">
                        Active knowledge sources for audit rules
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { name: "IRS Publications", count: 47, status: "Updated" },
                          { name: "USVI DOL Guidelines", count: 23, status: "Current" },
                          { name: "GASB Statements", count: 31, status: "Updated" },
                          { name: "OMB Circulars", count: 18, status: "Current" },
                          { name: "UVI Policies", count: 12, status: "Pending" }
                        ].map((source) => (
                          <div key={source.name} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200">
                            <div>
                              <div className="font-medium text-slate-900">{source.name}</div>
                              <div className="text-sm text-slate-600">{source.count} documents</div>
                            </div>
                            <Badge 
                              tone={source.status === "Updated" ? "reef" : source.status === "Current" ? "mango" : "coral"}
                              size="sm"
                            >
                              {source.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                      
                      <ActionButton 
                        label="Manage Sources" 
                        variant="outline" 
                        tone="reef"
                        className="w-full"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {route === "review" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Stat label="Pending Review" value="23" hint="Priority: 8 high" icon={<AlertTriangle size={20} />} />
                <Stat label="Auto-Resolved" value="156" hint="This week" icon={<CheckCircle2 size={20} />} />
                <Stat label="Manual Actions" value="7" hint="Requiring approval" icon={<Users size={20} />} />
                <Stat label="Avg Review Time" value="4.2min" hint="Per document" icon={<Clock size={20} />} />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card
                    title="Review Queue"
                    icon={<ScanSearch size={20} />}
                    accent="reef"
                    actions={
                      <div className="flex gap-2">
                        <ActionButton icon={<Filter size={16} />} label="Filter" variant="ghost" tone="reef" />
                        <ActionButton icon={<Download size={16} />} label="Export" variant="outline" tone="reef" />
                      </div>
                    }
                  >
                    <FilesTable searchTerm={searchTerm} />
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card title="AI Recommendations" icon={<ShieldCheck size={20} />} accent="mango">
                    <div className="space-y-4">
                      <div className="text-sm text-slate-700">
                        Smart suggestions for common audit issues
                      </div>
                      
                      <div className="space-y-3">
                        {[
                          { type: "Date Format", action: "Standardize to ISO format", confidence: 95 },
                          { type: "Vendor Names", action: "Canonicalize spelling", confidence: 88 },
                          { type: "Amount Validation", action: "Verify against totals", confidence: 92 },
                          { type: "Missing Signatures", action: "Flag for manual review", confidence: 100 }
                        ].map((rec) => (
                          <div key={rec.type} className="p-3 bg-white rounded-lg border border-slate-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium text-slate-900">{rec.type}</div>
                              <Badge tone="reef" size="xs">{rec.confidence}%</Badge>
                            </div>
                            <div className="text-sm text-slate-600">{rec.action}</div>
                          </div>
                        ))}
                      </div>
                      
                      <ActionButton 
                        label="Apply All Recommendations" 
                        variant="solid" 
                        tone="mango"
                        className="w-full"
                      />
                    </div>
                  </Card>

                  <Card title="Bulk Actions" icon={<DatabaseZap size={20} />} accent="sea">
                    <div className="space-y-3">
                      <ActionButton 
                        icon={<CheckCircle2 size={16} />}
                        label="Approve All Low-Risk"
                        variant="outline"
                        tone="reef"
                        className="w-full justify-start"
                      />
                      <ActionButton 
                        icon={<AlertTriangle size={16} />}
                        label="Flag High-Risk Items"
                        variant="outline"
                        tone="mango"
                        className="w-full justify-start"
                      />
                      <ActionButton 
                        icon={<Download size={16} />}
                        label="Export Issues Report"
                        variant="outline"
                        tone="sea"
                        className="w-full justify-start"
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {route === "history" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <Stat label="Total Processed" value="12,847" hint="All time" icon={<FileCheck2 size={20} />} />
                <Stat label="Success Rate" value="94.2%" hint="Last 30 days" icon={<CheckCircle2 size={20} />} />
                <Stat label="Cost Savings" value="$245K" hint="Annual estimate" icon={<DollarSign size={20} />} />
                <Stat label="Time Saved" value="1,247hrs" hint="Manual review avoided" icon={<Clock size={20} />} />
              </div>

              <Card
                title="Audit History"
                icon={<History size={20} />}
                accent="sea"
                actions={
                  <div className="flex gap-2">
                    <ActionButton icon={<Filter size={16} />} label="Date Range" variant="ghost" tone="sea" />
                    <ActionButton icon={<Download size={16} />} label="Export History" variant="outline" tone="sea" />
                  </div>
                }
              >
                <div className="text-center py-12 text-slate-500">
                  <History size={48} className="mx-auto mb-4 opacity-50" />
                  <div className="font-medium">Audit history will appear here</div>
                  <div className="text-sm">Historical data from your processed documents</div>
                </div>
              </Card>
            </div>
          )}

          {route === "settings" && (
            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="API Integrations" icon={<Settings size={20} />} accent="sea">
                  <div className="space-y-4">
                    <div className="text-sm text-slate-700 mb-4">
                      Configure external service connections
                    </div>
                    
                    <div className="space-y-4">
                      {[
                        { service: "OpenAI API", status: "Connected", key: "sk-..." },
                        { service: "Pinecone Vector DB", status: "Connected", key: "pc-..." },
                        { service: "Notion Workspace", status: "Disconnected", key: "" },
                        { service: "n8n Webhooks", status: "Connected", key: "https://..." }
                      ].map((integration) => (
                        <div key={integration.service} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                          <div>
                            <div className="font-medium text-slate-900">{integration.service}</div>
                            <div className="text-sm text-slate-600">
                              {integration.key || "Not configured"}
                            </div>
                          </div>
                          <Badge 
                            tone={integration.status === "Connected" ? "reef" : "coral"}
                            size="sm"
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      ))}
                    </div>
                    
                    <ActionButton 
                      label="Configure Integrations" 
                      variant="outline" 
                      tone="sea"
                      className="w-full"
                    />
                  </div>
                </Card>

                <Card title="Audit Policies" icon={<ShieldCheck size={20} />} accent="mango">
                  <div className="space-y-4">
                    <div className="text-sm text-slate-700 mb-4">
                      Choose your compliance enforcement level
                    </div>
                    
                    <div className="grid grid-cols-1 gap-3">
                      {[
                        { 
                          level: "Lenient", 
                          description: "Flexible rules, fewer flags",
                          selected: false 
                        },
                        { 
                          level: "Standard", 
                          description: "Balanced approach (recommended)",
                          selected: true 
                        },
                        { 
                          level: "Strict", 
                          description: "Rigorous compliance checking",
                          selected: false 
                        }
                      ].map((policy) => (
                        <button
                          key={policy.level}
                          className={`p-4 rounded-xl border text-left transition-all ${
                            policy.selected 
                              ? 'border-yellow-400 bg-yellow-50 shadow-sm' 
                              : 'border-slate-200 hover:border-yellow-300 hover:bg-yellow-50/50'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-slate-900">{policy.level}</div>
                            {policy.selected && (
                              <div className="w-4 h-4 rounded-full bg-yellow-500" />
                            )}
                          </div>
                          <div className="text-sm text-slate-600">{policy.description}</div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="text-sm text-blue-800">
                        <strong>Current Policy:</strong> Standard enforcement with dual-approval for high-risk items
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              <Card title="System Configuration" icon={<DatabaseZap size={20} />} accent="reef">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="font-medium text-slate-900">Processing Settings</div>
                    <div className="space-y-3">
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Auto-process uploads</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Email notifications</span>
                        <input type="checkbox" className="rounded" defaultChecked />
                      </label>
                      <label className="flex items-center justify-between">
                        <span className="text-sm text-slate-700">Bulk operations</span>
                        <input type="checkbox" className="rounded" />
                      </label>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="font-medium text-slate-900">Regional Settings</div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Jurisdiction</label>
                        <select className="w-full p-2 rounded-lg border border-slate-300">
                          <option>U.S. Virgin Islands</option>
                          <option>Puerto Rico</option>
                          <option>Other Territory</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-700 mb-1">Tax Year</label>
                        <select className="w-full p-2 rounded-lg border border-slate-300">
                          <option>2025</option>
                          <option>2024</option>
                          <option>2023</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold bg-gradient-to-br from-teal-600 to-emerald-600">
                  AT
                </div>
                <div>
                  <div className="font-bold text-slate-900">AuditTrack VI</div>
                  <div className="text-sm text-slate-600">Caribbean Edition</div>
                </div>
              </div>
              <div className="text-sm text-slate-600 max-w-md">
                Built specifically for the U.S. Virgin Islands government and organizations, 
                ensuring compliance with local regulations and federal requirements.
              </div>
            </div>
            
            <div>
              <div className="font-semibold text-slate-900 mb-3">Features</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>Document Processing</div>
                <div>AI-Powered Auditing</div>
                <div>Compliance Monitoring</div>
                <div>Automated Reporting</div>
              </div>
            </div>
            
            <div>
              <div className="font-semibold text-slate-900 mb-3">Support</div>
              <div className="space-y-2 text-sm text-slate-600">
                <div>Documentation</div>
                <div>API Reference</div>
                <div>Contact Support</div>
                <div>System Status</div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-slate-600">
              © 2025 AuditTrack VI. Built for transparency across the Virgin Islands.
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-slate-600">Theme:</span>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-slate-600">Coral</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="text-slate-600">Reef</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-slate-600">Lagoon</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}