"use client";

import React, { useMemo, useState } from "react";
import { Upload, FileCheck2, ShieldCheck, Settings, ScanSearch, DatabaseZap, History, Download, Trash2, Play, Pause, ChevronRight, CheckCircle2, AlertTriangle, CircleHelp, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

/**
 * AuditTrack VI — Single-file React UI
 * Caribbean color scheme with a vibrant red accent.
 * Tailwind-only styling (no CSS files). Production-ready structure in one file.
 *
 * How to use in Next.js:
 * - Create a page (e.g., app/page.tsx) and paste this component as default export
 * - Ensure Tailwind is enabled
 * - Optional: wire handlers to your APIs
 */

// Caribbean palette — tune freely in Tailwind config if you like
const palette = {
  reef: "#00B6A0",      // reef teal
  lagoon: "#15C3D6",    // lagoon aqua
  sea: "#007D8C",       // deep sea teal
  sand: "#F4E6C5",      // warm sand
  dusk: "#0B3045",      // island dusk (navy)
  coral: "#FF4D5A",     // coral red (accent)
  mango: "#F7B500",     // mango yellow
  surf: "#E8FBF8"       // surf foam
};

// Tiny helpers
const Badge = ({ tone = "reef", children }: { tone?: keyof typeof palette; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold`} style={{ background: `${palette[tone]}22`, color: palette[tone] }}>
    {children}
  </span>
);

const Stat = ({ label, value, hint }: { label: string; value: string | number; hint?: string }) => (
  <div className="rounded-2xl p-4 shadow-sm bg-white/70 border border-white/60">
    <div className="text-sm text-slate-600">{label}</div>
    <div className="text-2xl font-bold text-slate-900 mt-1">{value}</div>
    {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
  </div>
);

const Card = ({ title, icon, actions, children, accent = "reef" }: { title: string; icon?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode; accent?: keyof typeof palette }) => (
  <div className="rounded-2xl bg-white shadow-sm border border-white/70 overflow-hidden">
    <div className="flex items-center justify-between px-4 py-3" style={{ background: `${palette[accent]}18` }}>
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-xl flex items-center justify-center" style={{ background: `${palette[accent]}2A`, color: palette[accent] }}>
          {icon}
        </div>
        <h3 className="font-semibold text-slate-900">{title}</h3>
      </div>
      <div className="flex items-center gap-2">{actions}</div>
    </div>
    <div className="p-4">{children}</div>
  </div>
);

const filesDemo = [
  { id: 1, name: "Invoice_000124.pdf", size: "412 KB", status: "Passed", issues: 0, vendor: "Carib Foods LLC" },
  { id: 2, name: "Payroll_May2025.csv", size: "38 KB", status: "Flagged", issues: 3, vendor: "HR Export" },
  { id: 3, name: "Contract_UVI_Catering.pdf", size: "1.6 MB", status: "Manual Review", issues: 1, vendor: "Island Caterers" }
];

const statusTone: Record<string, keyof typeof palette> = {
  Passed: "reef",
  Flagged: "coral",
  "Manual Review": "mango"
};

const ProgressPill = ({ value }: { value: number }) => (
  <div className="h-3 w-full rounded-full bg-slate-200 overflow-hidden">
    <div
      className="h-full rounded-full"
      style={{ width: `${value}%`, background: `linear-gradient(90deg, ${palette.reef}, ${palette.lagoon})` }}
    />
  </div>
);

const ActionButton = ({ icon, label, onClick, tone = "reef" }: { icon: React.ReactNode; label: string; onClick?: () => void; tone?: keyof typeof palette }) => (
  <button
    onClick={onClick}
    className="inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold shadow-sm border hover:shadow-md transition"
    style={{ background: "white", color: palette[tone], borderColor: `${palette[tone]}55` }}
  >
    {icon}
    {label}
  </button>
);

function Sidebar({ current, onNavigate }: { current: string; onNavigate: (key: string) => void }) {
  const items = [
    { key: "dashboard", label: "Dashboard", icon: <ShieldCheck size={18} /> },
    { key: "ingest", label: "Ingest Rules", icon: <DatabaseZap size={18} /> },
    { key: "review", label: "Review Queue", icon: <ScanSearch size={18} /> },
    { key: "history", label: "History", icon: <History size={18} /> },
    { key: "settings", label: "Settings", icon: <Settings size={18} /> }
  ];

  return (
    <aside className="h-full w-[280px] shrink-0 p-4">
      <div className="rounded-2xl h-full p-4 flex flex-col gap-2 border shadow-sm" style={{ background: `linear-gradient(180deg, ${palette.surf}, ${palette.sand})`, borderColor: `${palette.sea}22` }}>
        <div className="flex items-center gap-3 mb-2">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center text-white font-bold" style={{ background: `linear-gradient(135deg, ${palette.sea}, ${palette.reef})` }}>AT</div>
          <div>
            <div className="text-sm tracking-wider font-semibold text-slate-800">AuditTrack <span className="text-[10px] align-top bg-white/70 px-1.5 py-0.5 rounded ml-1 border" style={{ borderColor: `${palette.sea}22` }}>VI</span></div>
            <div className="text-[11px] text-slate-600">Design · Renovate · Build · Comply</div>
          </div>
        </div>
        <div className="mt-2 mb-3">
          <Badge tone="coral">Caribbean Edition</Badge>
        </div>
        <nav className="flex-1 flex flex-col gap-1">
          {items.map((it) => (
            <button
              key={it.key}
              onClick={() => onNavigate(it.key)}
              className={`flex items-center gap-3 w-full rounded-xl px-3 py-2 text-sm font-semibold text-left border transition ${ 
                current === it.key ? "bg-white shadow-sm" : "hover:bg-white/70"
              }`}
              style={{ borderColor: `${palette.sea}18`, color: current === it.key ? palette.sea : "#0f172a" }}
            >
              {it.icon}
              {it.label}
              {current === it.key && <ChevronRight className="ml-auto" size={16} />}
            </button>
          ))}
        </nav>
        <div className="text-[11px] text-slate-600 pt-2 border-t" style={{ borderColor: `${palette.sea}22` }}>
          <div>Made for the U.S. Virgin Islands</div>
          <div className="mt-1">Accent <span style={{ color: palette.coral }}>●</span> coral red</div>
        </div>
      </div>
    </aside>
  );
}

function UploadZone() {
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const picked = Array.from(e.dataTransfer.files || []);
    setFiles((f) => [...f, ...picked]);
  };

  const onPick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles((f) => [...f, ...picked]);
  };

  const simulate = async () => {
    setBusy(true);
    await new Promise((r) => setTimeout(r, 1200));
    setBusy(false);
    alert("Files queued for AI audit (demo)");
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className="rounded-2xl border-2 border-dashed p-8 text-center bg-white/70"
        style={{ borderColor: `${palette.reef}55` }}
      >
        <div className="flex items-center justify-center gap-3">
          <Upload />
          <div className="font-semibold">Drag & drop receipts, invoices, payroll, contracts</div>
        </div>
        <div className="text-xs text-slate-500 mt-2">PDF, CSV, XLSX, DOCX</div>
        <div className="mt-4 flex items-center justify-center gap-2">
          <label className="inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold cursor-pointer border shadow-sm hover:shadow-md" style={{ color: palette.sea, borderColor: `${palette.sea}33`, background: "white" }}>
            <Upload size={16} /> Choose Files
            <input type="file" className="hidden" multiple onChange={onPick} />
          </label>
          <ActionButton icon={busy ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />} label={busy ? "Queuing..." : "Queue for Audit"} onClick={simulate} tone="reef" />
        </div>
        {!!files.length && (
          <div className="mt-4 text-xs text-slate-600">
            {files.length} file{files.length > 1 ? "s" : ""} selected
          </div>
        )}
      </div>
    </div>
  );
}

function FilesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2">File</th>
            <th className="py-2">Vendor</th>
            <th className="py-2">Size</th>
            <th className="py-2">Status</th>
            <th className="py-2">Issues</th>
            <th className="py-2"></th>
          </tr>
        </thead>
        <tbody>
          {filesDemo.map((f) => (
            <tr key={f.id} className="border-t last:border-b" style={{ borderColor: `${palette.sea}12` }}>
              <td className="py-3 font-medium text-slate-900">{f.name}</td>
              <td className="py-3 text-slate-700">{f.vendor}</td>
              <td className="py-3 text-slate-600">{f.size}</td>
              <td className="py-3">
                <Badge tone={statusTone[f.status]}>
                  {f.status === "Passed" && <CheckCircle2 size={14} />}
                  {f.status === "Flagged" && <AlertTriangle size={14} />}
                  {f.status === "Manual Review" && <CircleHelp size={14} />}
                  {f.status}
                </Badge>
              </td>
              <td className="py-3 text-slate-700">{f.issues}</td>
              <td className="py-3">
                <button className="text-xs underline hover:opacity-80" style={{ color: palette.sea }}>View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RulesIngest() {
  const [pct, setPct] = useState(32);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card title="Ingest Laws & Policies" icon={<DatabaseZap size={16} />} accent="sea" actions={<ActionButton icon={<Upload size={16} />} label="Upload PDFs" tone="sea" />}
        >
          <div className="text-sm text-slate-700">Drop IRS pubs, VI DOL guidance, GASB/OMB circulars, procurement rules. We'll OCR, chunk, embed (Pinecone), and index.</div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <div>Corpus readiness</div>
              <div>{pct}%</div>
            </div>
            <ProgressPill value={pct} />
            <div className="mt-3 flex gap-2">
              <ActionButton icon={<Play size={16} />} label="Start Ingestion" onClick={() => setPct((p) => Math.min(100, p + 8))} tone="reef" />
              <ActionButton icon={<Pause size={16} />} label="Pause" tone="mango" />
            </div>
          </div>
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card title="Sources" icon={<FileCheck2 size={16} />} accent="reef">
          <ul className="text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>IRS Publications (1040/1065/1120, rev. dates)</li>
            <li>USVI DOL Wage & Hour, quarterly reports</li>
            <li>GASB statements; OMB Uniform Guidance</li>
            <li>UVI procurement & grants policy</li>
          </ul>
          <div className="mt-3 text-xs text-slate-500">Connect cloud buckets to auto-sync new revisions.</div>
        </Card>
      </div>
    </div>
  );
}

function ReviewQueue() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="lg:col-span-2">
        <Card title="Queue" icon={<ScanSearch size={16} />} accent="reef" actions={<ActionButton icon={<Download size={16} />} label="Export CSV" tone="reef" />}>
          <FilesTable />
        </Card>
      </div>
      <div className="lg:col-span-1">
        <Card title="Auto-Fixes" icon={<ShieldCheck size={16} />} accent="mango">
          <div className="text-sm text-slate-700">Common corrections your agent can apply automatically:</div>
          <ul className="mt-2 text-sm text-slate-700 list-disc pl-5 space-y-1">
            <li>Normalize dates (ISO)</li>
            <li>Vendor name canonicalization</li>
            <li>Totals vs. line-sum mismatch</li>
            <li>Missing signatures flag</li>
          </ul>
          <div className="mt-3 text-xs text-slate-500">Manual approvals required for high‑risk edits.</div>
        </Card>
      </div>
    </div>
  );
}

function SettingsPanel() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card title="Integrations" icon={<Settings size={16} />} accent="sea">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <label className="flex flex-col gap-1">
            <span className="text-slate-600">Pinecone Index</span>
            <input placeholder="audittrack-vi" className="rounded-xl border px-3 py-2" style={{ borderColor: `${palette.sea}33` }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-600">OpenAI API Key</span>
            <input placeholder="sk-..." className="rounded-xl border px-3 py-2" style={{ borderColor: `${palette.sea}33` }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-600">Notion Token</span>
            <input placeholder="secret_..." className="rounded-xl border px-3 py-2" style={{ borderColor: `${palette.sea}33` }} />
          </label>
          <label className="flex flex-col gap-1">
            <span className="text-slate-600">Webhook (n8n)</span>
            <input placeholder="https://n8n.example/webhook/..." className="rounded-xl border px-3 py-2" style={{ borderColor: `${palette.sea}33` }} />
          </label>
        </div>
      </Card>
      <Card title="Policies" icon={<ShieldCheck size={16} />} accent="mango">
        <div className="text-sm text-slate-700">Choose enforcement profile</div>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {["Lenient", "Standard", "Strict"].map((p) => (
            <button key={p} className="rounded-xl px-3 py-2 border text-sm font-semibold bg-white hover:shadow-sm" style={{ borderColor: `${palette.reef}33`, color: palette.sea }}>{p}</button>
          ))}
        </div>
        <div className="mt-3 text-xs text-slate-500">Profiles control thresholds, auto‑fix scope, dual‑approval, and audit trail verbosity.</div>
      </Card>
    </div>
  );
}

export default function AuditTrackVIApp() {
  const [route, setRoute] = useState("dashboard");

  const stats = useMemo(() => ([
    { label: "Docs Audited", value: 128, hint: "+14 today" },
    { label: "Flags Resolved", value: 76, hint: "92% SLA" },
    { label: "Avg. Turnaround", value: "3m 21s", hint: "P95: 11m" }
  ]), []);

  return (
    <div className="min-h-screen" style={{ background: `linear-gradient(135deg, ${palette.surf}, ${palette.sand})` }}>
      {/* Top Bar */}
      <header className="sticky top-0 z-20 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b" style={{ borderColor: `${palette.sea}12` }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl grid place-items-center text-white font-bold shadow" style={{ background: `linear-gradient(135deg, ${palette.coral}, ${palette.mango})` }}>VI</div>
          <div className="font-semibold tracking-wide text-slate-900">AuditTrack VI</div>
          <Badge tone="coral">Caribbean</Badge>
          <div className="ml-auto flex items-center gap-2">
            <input placeholder="Search invoices, rules, vendors…" className="rounded-xl px-3 py-2 text-sm border w-[280px]" style={{ borderColor: `${palette.sea}22` }} />
            <ActionButton icon={<Settings size={16} />} label="Quick Config" tone="sea" />
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-2 sm:px-4 py-4 flex">
        <Sidebar current={route} onNavigate={setRoute} />

        <div className="flex-1 p-2 sm:p-4">
          {route === "dashboard" && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {stats.map((s) => (
                  <Stat key={s.label} label={s.label} value={s.value} hint={s.hint} />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <Card title="Upload for Audit" icon={<Upload size={16} />} accent="reef" actions={<ActionButton icon={<Trash2 size={16} />} label="Clear" tone="coral" />}>
                    <UploadZone />
                  </Card>
                </div>
                <div className="lg:col-span-1">
                  <Card title="Compliance Health" icon={<ShieldCheck size={16} />} accent="mango">
                    <div className="text-sm text-slate-700">Organization score</div>
                    <div className="mt-2">
                      <ProgressPill value={84} />
                      <div className="mt-2 text-xs text-slate-600">84/100 · Improving · Focus: payroll quarterly</div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge tone="reef">IRS</Badge>
                      <Badge tone="mango">USVI DOL</Badge>
                      <Badge tone="sea">GASB</Badge>
                      <Badge tone="coral">Red Flags</Badge>
                    </div>
                  </Card>
                </div>
              </div>
              <Card title="Recent Files" icon={<FileCheck2 size={16} />} accent="sea" actions={<ActionButton icon={<Download size={16} />} label="Download Report" tone="sea" />}>
                <FilesTable />
              </Card>
            </motion.div>
          )}

          {route === "ingest" && <RulesIngest />}
          {route === "review" && <ReviewQueue />}
          {route === "history" && (
            <div className="grid grid-cols-1 gap-4">
              <Card title="History" icon={<History size={16} />} accent="sea">
                <div className="text-sm text-slate-700">Your last 30 days of audits will appear here with filters by vendor, status, and rule source.</div>
              </Card>
            </div>
          )}
          {route === "settings" && <SettingsPanel />}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 text-xs text-slate-600">
        <div className="flex flex-wrap items-center gap-2 justify-between">
          <div>
            © {new Date().getFullYear()} AuditTrack VI · Built for transparency across the Virgin Islands.
          </div>
          <div>
            Theme: <span className="font-semibold" style={{ color: palette.coral }}>Coral</span> + Reef + Lagoon + Sand
          </div>
        </div>
      </footer>
    </div>
  );
}
