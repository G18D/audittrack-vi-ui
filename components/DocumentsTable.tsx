// components/DocumentsTable.tsx - Fixed version with proper TypeScript types
import { useDocuments } from '../lib/api';
import { FileText, CheckCircle2, AlertTriangle, CircleHelp } from 'lucide-react';

// Define the tone type properly
type BadgeTone = "reef" | "coral" | "mango";

const Badge = ({ 
  tone = "reef", 
  size = "sm", 
  children, 
  className = "" 
}: {
  tone?: BadgeTone;
  size?: "xs" | "sm" | "md";
  children: React.ReactNode;
  className?: string;
}) => {
  const sizes = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-1 text-xs", 
    md: "px-3 py-1.5 text-sm"
  };

  const toneStyles: Record<BadgeTone, string> = {
    reef: "bg-emerald-50 text-emerald-600 border-emerald-200",
    coral: "bg-red-50 text-red-600 border-red-200",
    mango: "bg-yellow-50 text-yellow-600 border-yellow-200",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-semibold border ${sizes[size]} ${toneStyles[tone]} ${className}`}>
      {children}
    </span>
  );
};

// Define status configuration with proper typing - Fixed to accept Lucide icon props
const statusConfig: Record<'Passed' | 'Flagged' | 'Manual Review', { tone: BadgeTone; icon: React.ComponentType<any> }> = {
  "Passed": { tone: "reef", icon: CheckCircle2 },
  "Flagged": { tone: "coral", icon: AlertTriangle },
  "Manual Review": { tone: "mango", icon: CircleHelp }
};

export function DocumentsTable({ searchTerm = "" }: { searchTerm?: string }) {
  const { documents, loading, error } = useDocuments();

  const filteredDocs = documents.filter(doc => 
    !searchTerm || 
    doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.vendor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="animate-pulse space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-16 bg-slate-100 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-600">
        <p>Failed to load documents: {error}</p>
      </div>
    );
  }

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
            {filteredDocs.map((doc) => {
              const statusInfo = statusConfig[doc.status];
              const StatusIcon = statusInfo.icon;
              
              return (
                <tr key={doc.id} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{doc.name}</div>
                        <div className="text-xs text-slate-500">{doc.size}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-slate-700">{doc.vendor}</td>
                  <td className="py-4 font-medium text-slate-900">{doc.amount}</td>
                  <td className="py-4">
                    <Badge tone={statusInfo.tone}>
                      <StatusIcon size={12} />
                      {doc.status}
                    </Badge>
                  </td>
                  <td className="py-4">
                    {doc.issues > 0 ? (
                      <span className="text-red-600 font-medium">{doc.issues}</span>
                    ) : (
                      <span className="text-slate-500">—</span>
                    )}
                  </td>
                  <td className="py-4 text-slate-500">{doc.uploadedAt}</td>
                  <td className="py-4">
                    <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                      Review
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {filteredDocs.length === 0 && !loading && (
        <div className="text-center py-12 text-slate-500">
          <FileText size={48} className="mx-auto mb-4 opacity-50" />
          <div className="font-medium">No documents found</div>
          <div className="text-sm">Try adjusting your search terms</div>
        </div>
      )}
    </div>
  );
}