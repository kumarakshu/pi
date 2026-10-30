import React from 'react';
import { 
  Building2, 
  Phone, 
  CreditCard, 
  Clock, 
  Tag, 
  AlertCircle,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CaseSidebar({ 
  cases, 
  selectedCaseId, 
  onSelectCase,
  isLoading 
}) {
  if (isLoading && (!cases || cases.length === 0)) {
    return (
      <div className="w-full lg:w-80 flex-shrink-0 bg-white rounded-lg border border-slate-200 p-4 shadow-2xs space-y-3">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
        <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
        <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
        <div className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col space-y-2">
      <div className="flex items-center justify-between px-1 text-xs font-semibold text-slate-500 uppercase tracking-wider">
        <span>Technical Cases ({cases.length})</span>
        <span className="text-[10px] text-slate-400 font-normal">Select case to view</span>
      </div>

      <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
        {cases.length === 0 ? (
          <div className="p-6 text-center bg-white rounded-lg border border-dashed border-slate-300 text-xs text-slate-500">
            No matching merchant cases found. Try adjusting your search or filters.
          </div>
        ) : (
          cases.map(item => {
            const isSelected = selectedCaseId === item.caseId;
            const isPrimary = item.caseId === "1439868101";

            // Status Badge styling
            let statusBadgeClass = "bg-slate-100 text-slate-700 border-slate-200";
            if (item.currentStatus === 'Not Connected') {
              statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-200";
            } else if (item.currentStatus === 'Connected') {
              statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-200";
            } else if (item.currentStatus === 'Callback') {
              statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-200";
            } else if (item.currentStatus === 'Technical Issue') {
              statusBadgeClass = "bg-indigo-50 text-indigo-700 border-indigo-200";
            } else if (item.currentStatus === 'New') {
              statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-200";
            }

            return (
              <div
                key={item.caseId}
                onClick={() => onSelectCase(item.caseId)}
                className={`relative p-3.5 rounded-lg border text-left cursor-pointer transition-all duration-150 ${
                  isSelected
                    ? 'bg-blue-50/70 border-blue-500 shadow-xs ring-1 ring-blue-500'
                    : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/60 shadow-2xs'
                }`}
              >
                {/* Active indicator bar */}
                {isSelected && (
                  <div className="absolute left-0 top-3 bottom-3 w-1 bg-blue-600 rounded-r"></div>
                )}

                {/* Header: Merchant & Status */}
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900 tracking-tight leading-tight">
                      {item.merchantName}
                    </span>
                    {isPrimary && (
                      <span className="px-1.5 py-0.2 text-[9px] font-bold uppercase rounded bg-indigo-100 text-indigo-700">
                        Priority
                      </span>
                    )}
                  </div>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${statusBadgeClass} whitespace-nowrap`}>
                    {item.currentStatus}
                  </span>
                </div>

                {/* Sub-info: Customer ID & Phone */}
                <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-2">
                  <span>Cust ID: <strong className="text-slate-700 font-medium">{item.caseId}</strong></span>
                  <span>•</span>
                  <span>{item.cleanPhone}</span>
                </div>

                {/* Plan & Credits */}
                <div className="p-2 rounded bg-slate-100/70 border border-slate-200/80 flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1 font-medium text-slate-700">
                    <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                    <span>{item.plan}</span>
                  </div>
                  <div className="text-slate-600 font-semibold text-[11px]">
                    Credits {item.credits}
                  </div>
                </div>

                {/* Sub Status & Expiry Snippet */}
                <div className="mt-2 flex items-center justify-between text-[10px] text-slate-500">
                  <span className="truncate max-w-[170px]">
                    Sub: <span className="font-medium text-slate-600">{item.subStatus}</span>
                  </span>
                  <span>Exp: {item.expiry}</span>
                </div>

              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

