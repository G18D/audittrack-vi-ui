// components/ComplianceCard.tsx - Fixed version with proper TypeScript types
import { useCompliance } from '../lib/api';

interface ProgressPillProps {
  value: number;
  label?: string;
  className?: string;
}

const ProgressPill = ({ value, label, className = "" }: ProgressPillProps) => (
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

export function ComplianceCard() {
  const { compliance, loading, error } = useCompliance();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse">
          <ProgressPill value={0} label="Loading..." />
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !compliance) {
    return (
      <div className="text-center p-4 text-red-600">
        <p>Failed to load compliance data</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:no-underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <ProgressPill value={compliance.overall_score} label="Overall Compliance" />
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-slate-600">IRS Compliance</div>
          <div className="font-semibold text-slate-900">{compliance.breakdown.irs_compliance}%</div>
        </div>
        <div>
          <div className="text-slate-600">USVI DOL</div>
          <div className="font-semibold text-slate-900">{compliance.breakdown.usvi_dol_compliance}%</div>
        </div>
      </div>
      
      {compliance.recommendations.length > 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div className="text-sm font-medium text-blue-900 mb-2">Top Recommendation</div>
          <div className="text-sm text-blue-800">
            {compliance.recommendations[0].action}
          </div>
        </div>
      )}
      
      <button className="w-full px-4 py-2 text-sm font-medium text-yellow-600 border border-yellow-300 rounded-xl hover:border-yellow-400 hover:bg-yellow-50 transition-colors">
        View Full Report
      </button>
    </div>
  );
}