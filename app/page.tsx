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

// Import the new API-connected components
import { StatsGrid } from "../components/StatsGrid";
import { EnhancedUploadZone } from "../components/EnhancedUploadZone";
import { DocumentsTable } from "../components/DocumentsTable";
import { ComplianceCard } from "../components/ComplianceCard";

/**
 * AuditTrack VI — Enhanced Caribbean-themed audit management system
 * Production-ready Next.js App Router page with real API integration
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

// Enhanced Badge component (keep your existing one)
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

// Enhanced Card component (keep your existing one)
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

// Enhanced Action Button (keep your existing one)
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

// Enhanced Sidebar with mobile support (keep your existing one)
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
            <Badge tone="reef" size="sm">Live</Badge>
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

// Main App Component
export default function AuditTrackVIApp() {
  const [route, setRoute] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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
              {/* UPDATED: Real Stats Grid instead of mock */}
              <StatsGrid />

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
                    {/* UPDATED: Real Upload Zone instead of mock */}
                    <EnhancedUploadZone onUploadComplete={() => {
                      console.log("Upload completed! Could refresh document list here.");
                    }} />
                  </Card>
                </div>
                
                <div className="space-y-6">
                  <Card title="Compliance Score" icon={<ShieldCheck size={20} />} accent="mango">
                    {/* UPDATED: Real Compliance Card instead of mock */}
                    <ComplianceCard />
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
                {/* UPDATED: Real Documents Table instead of mock */}
                <DocumentsTable searchTerm={searchTerm} />
              </Card>
            </div>
          )}

          {/* Keep all your other routes exactly the same for now */}
          {route === "ingest" && (
            <div className="space-y-8">
              {/* ... keep your existing ingest route code ... */}
            </div>
          )}

          {route === "review" && (
            <div className="space-y-8">
              {/* ... keep your existing review route code ... */}
            </div>
          )}

          {route === "history" && (
            <div className="space-y-8">
              {/* ... keep your existing history route code ... */}
            </div>
          )}

          {route === "settings" && (
            <div className="space-y-8">
              {/* ... keep your existing settings route code ... */}
            </div>
          )}
        </main>
      </div>

      {/* Footer - keep your existing footer exactly the same */}
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