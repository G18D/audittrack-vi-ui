// components/EnhancedUploadZone.tsx - Fixed version with proper TypeScript types
import React, { useCallback, useState } from 'react';
import { Upload, FileText, Trash2, Play, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useUpload } from '../lib/api';

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonTone = "reef" | "coral";

interface ActionButtonProps {
  icon?: React.ReactNode;
  label: string;
  onClick?: () => void;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  disabled?: boolean;
  className?: string;
}

const ActionButton = ({ 
  icon, 
  label, 
  onClick, 
  variant = "outline", 
  tone = "reef", 
  disabled = false, 
  className = "" 
}: ActionButtonProps) => {
  const variants: Record<ButtonTone, Record<ButtonVariant, string>> = {
    reef: {
      solid: "bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700",
      outline: "bg-white text-emerald-600 border-emerald-300 hover:border-emerald-400",
      ghost: "bg-transparent text-emerald-600 border-transparent hover:bg-emerald-50",
    },
    coral: {
      solid: "bg-red-600 text-white border-red-600 hover:bg-red-700",
      outline: "bg-white text-red-600 border-red-300 hover:border-red-400",
      ghost: "bg-transparent text-red-600 border-transparent hover:bg-red-50",
    }
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm rounded-xl font-semibold shadow-sm hover:shadow-md transition-all duration-200 border disabled:opacity-50 disabled:cursor-not-allowed ${variants[tone][variant]} ${className}`}
    >
      {icon}
      {label}
    </button>
  );
};

interface UploadResult {
  filename?: string;
  success: boolean;
  audit_id?: string;
  error?: string;
}

interface EnhancedUploadZoneProps {
  onUploadComplete?: () => void;
}

export function EnhancedUploadZone({ onUploadComplete }: EnhancedUploadZoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);
  const [results, setResults] = useState<UploadResult[]>([]);
  
  const { uploadFile, uploadFiles, uploading, progress, error } = useUpload();

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const picked = Array.from(e.dataTransfer.files || []);
    setFiles(prev => [...prev, ...picked]);
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => {
    setDragOver(false);
  }, []);

  const onPick = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const picked = Array.from(e.target.files || []);
    setFiles(prev => [...prev, ...picked]);
  }, []);

  const processFiles = async () => {
    try {
      if (files.length === 1) {
        const result = await uploadFile(files[0]);
        if (result) {
          setResults([{
            filename: files[0].name,
            success: result.success,
            audit_id: result.audit_id
          }]);
          setFiles([]);
          onUploadComplete?.();
        }
      } else {
        const result = await uploadFiles(files);
        if (result && result.results) {
          setResults(result.results);
          setFiles([]);
          onUploadComplete?.();
        }
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setResults([{
        filename: files[0]?.name || 'Unknown',
        success: false,
        error: err instanceof Error ? err.message : 'Upload failed'
      }]);
    }
  };

  const clearFiles = () => {
    setFiles([]);
    setResults([]);
  };

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
                icon={uploading ? <Loader2 className="animate-spin" size={16} /> : <Play size={16} />}
                label={uploading ? `Processing... ${progress}%` : `Process ${files.length} Files`}
                onClick={processFiles}
                variant="solid"
                tone="reef"
                disabled={uploading}
              />
              <ActionButton
                icon={<Trash2 size={16} />}
                label="Clear"
                onClick={clearFiles}
                variant="ghost"
                tone="coral"
                disabled={uploading}
              />
            </>
          )}
        </div>

        {/* Progress bar */}
        {uploading && progress > 0 && (
          <div className="mt-4">
            <div className="h-2 w-full rounded-full bg-slate-200 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-emerald-500 to-cyan-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Error display */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700">
            <AlertCircle size={16} />
            <span className="text-sm">{error}</span>
          </div>
        )}

        {/* File list */}
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

        {/* Results display */}
        {results.length > 0 && (
          <div className="mt-6 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
            <div className="text-sm font-medium text-emerald-900 mb-2 flex items-center gap-2">
              <CheckCircle2 size={16} />
              Processing Complete
            </div>
            <div className="space-y-1">
              {results.map((result, i) => (
                <div key={i} className="text-sm text-emerald-700 flex items-center justify-between">
                  <span>{result.filename || `File ${i + 1}`}</span>
                  <span className={result.success ? "text-emerald-600" : "text-red-600"}>
                    {result.success ? "✓ Success" : "✗ Failed"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}