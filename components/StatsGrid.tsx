// components/StatsGrid.tsx - Fixed version with proper TypeScript types
import { useStats } from '../lib/api';
import { FileCheck2, CheckCircle2, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface StatProps {
  label: string;
  value: string | number;
  hint?: string;
  icon?: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  className?: string;
}

const Stat = ({ label, value, hint, icon, trend, className = "" }: StatProps) => {
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
      {hint && trend && (
        <div className="flex items-center gap-1 text-xs">
          <TrendingUp size={12} className={trendColors[trend]} />
          <span className={trendColors[trend]}>{hint}</span>
        </div>
      )}
      {hint && !trend && (
        <div className="text-xs text-slate-500">{hint}</div>
      )}
    </div>
  );
};

export function StatsGrid() {
  const { stats, loading, error } = useStats();

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="rounded-2xl p-6 bg-white shadow-sm border border-slate-200">
            <div className="animate-pulse">
              <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
              <div className="h-8 bg-slate-200 rounded w-1/2 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 text-red-600">
        <p>Failed to load statistics: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (!stats) return null;

  const statsData: StatProps[] = [
    {
      label: "Documents Processed",
      value: stats.documents_processed.toLocaleString(),
      hint: "+47 today",
      icon: <FileCheck2 size={20} />,
      trend: "up"
    },
    {
      label: "Issues Resolved", 
      value: `${stats.issues_resolved_percent}%`,
      hint: "Above target",
      icon: <CheckCircle2 size={20} />,
      trend: "up"
    },
    {
      label: "Avg Processing Time",
      value: `${stats.avg_processing_time}min`,
      hint: "-18% vs last month",
      icon: <Clock size={20} />,
      trend: "down"
    },
    {
      label: "Total Savings",
      value: `$${(stats.total_savings / 1000).toFixed(1)}K`,
      hint: "YTD efficiency gains",
      icon: <DollarSign size={20} />,
      trend: "up"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {statsData.map((stat) => (
        <Stat key={stat.label} {...stat} />
      ))}
    </div>
  );
}