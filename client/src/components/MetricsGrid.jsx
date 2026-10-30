import React from 'react';
import { 
  Sparkles, 
  PhoneForwarded, 
  AlertTriangle, 
  Wrench, 
  Clock, 
  FolderOpen, 
  CheckCircle2, 
  PhoneCall,
  X
} from 'lucide-react';

const QUEUE_CONFIGS = [
  {
    key: 'NEW',
    label: 'NEW',
    description: 'Fresh unassigned / uncontacted leads',
    accentColor: 'border-t-blue-500 text-blue-700 bg-blue-50/40',
    badgeColor: 'bg-blue-100 text-blue-800',
    icon: Sparkles
  },
  {
    key: 'CALLBACKS TODAY',
    label: 'CALLBACKS TODAY',
    description: 'Follow-ups scheduled for today',
    accentColor: 'border-t-amber-500 text-amber-700 bg-amber-50/40',
    badgeColor: 'bg-amber-100 text-amber-800',
    icon: PhoneForwarded
  },
  {
    key: 'OVERDUE',
    label: 'OVERDUE',
    description: 'Missed deadline or past SLA',
    accentColor: 'border-t-red-500 text-red-700 bg-red-50/40',
    badgeColor: 'bg-red-100 text-red-800',
    icon: AlertTriangle
  },
  {
    key: 'OPEN TECHNICAL',
    label: 'OPEN TECHNICAL',
    description: 'Meta login, 2FA or catalog issues',
    accentColor: 'border-t-indigo-500 text-indigo-700 bg-indigo-50/40',
    badgeColor: 'bg-indigo-100 text-indigo-800',
    icon: Wrench
  },
  {
    key: 'AGEING OPEN',
    label: 'AGEING OPEN',
    description: 'Open > 14 days without resolution',
    accentColor: 'border-t-purple-500 text-purple-700 bg-purple-50/40',
    badgeColor: 'bg-purple-100 text-purple-800',
    icon: Clock
  },
  {
    key: 'ALL OPEN',
    label: 'ALL OPEN',
    description: 'All active pending onboarding cases',
    accentColor: 'border-t-slate-700 text-slate-800 bg-slate-50/50',
    badgeColor: 'bg-slate-200 text-slate-800',
    icon: FolderOpen
  },
  {
    key: 'COMPLETED',
    label: 'COMPLETED',
    description: 'Successfully onboarded & live',
    accentColor: 'border-t-emerald-500 text-emerald-700 bg-emerald-50/40',
    badgeColor: 'bg-emerald-100 text-emerald-800',
    icon: CheckCircle2
  },
  {
    key: 'REQ CALL BACK',
    label: 'REQ CALL BACK',
    description: 'Merchant requested inbound callback',
    accentColor: 'border-t-cyan-500 text-cyan-700 bg-cyan-50/40',
    badgeColor: 'bg-cyan-100 text-cyan-800',
    icon: PhoneCall
  }
];

export default function MetricsGrid({ metrics, selectedQueue, onSelectQueue }) {
  return (
    <div className="mb-4">
      {/* Optional Active Filter Indicator */}
      {selectedQueue && (
        <div className="flex items-center justify-between mb-2 px-1">
          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
            <span>Filtered queue:</span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold uppercase">
              {selectedQueue}
            </span>
          </div>
          <button
            onClick={() => onSelectQueue('')}
            className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium hover:underline"
          >
            <X className="w-3 h-3" />
            Show all queues
          </button>
        </div>
      )}

      {/* Grid of 8 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5">
        {QUEUE_CONFIGS.map(item => {
          const count = metrics?.[item.key] ?? 0;
          const isSelected = selectedQueue === item.key;
          const IconComponent = item.icon;

          return (
            <button
              key={item.key}
              onClick={() => onSelectQueue(isSelected ? '' : item.key)}
              className={`text-left p-3 rounded-lg bg-white border border-slate-200 border-t-4 transition-all duration-150 shadow-xs hover:shadow-md cursor-pointer ${item.accentColor} ${
                isSelected 
                  ? 'ring-2 ring-blue-600 ring-offset-1 shadow-sm' 
                  : 'hover:border-slate-300'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold tracking-tight text-slate-500 truncate" title={item.label}>
                  {item.label}
                </span>
                <IconComponent className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="flex items-baseline justify-between mt-0.5">
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                  {count}
                </span>
                {isSelected && (
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1 rounded">
                    Active
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

