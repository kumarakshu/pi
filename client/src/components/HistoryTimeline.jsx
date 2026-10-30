import React, { useState } from 'react';
import { 
  History, 
  MessageSquare, 
  CheckCheck, 
  Check, 
  Clock, 
  Volume2, 
  Tag, 
  User, 
  Copy, 
  Sparkles,
  PhoneCall,
  AlertCircle
} from 'lucide-react';

export default function HistoryTimeline({ timeline = [], onOpenAudioPreview }) {
  const [copiedId, setCopiedId] = useState(null);

  const copyId = (id) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-slate-700" />
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            History & Audit Timeline
          </h3>
          <span className="ml-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
            {timeline.length} logs
          </span>
        </div>
        <span className="text-[11px] text-slate-400">
          Chronological Order (Newest first)
        </span>
      </div>

      {timeline.length === 0 ? (
        <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-lg">
          No audit entries recorded yet. Submit a disposition above to record history.
        </div>
      ) : (
        <div className="relative pl-6 space-y-4 timeline-line">
          {timeline.map((entry, idx) => {
            const isLatest = idx === 0;

            // Status Badge styling
            let badgeStyle = "bg-slate-100 text-slate-700 border-slate-200";
            let dotColor = "bg-slate-400";
            if (entry.status === 'Not Connected') {
              badgeStyle = "bg-rose-50 text-rose-700 border-rose-200";
              dotColor = "bg-rose-500";
            } else if (entry.status === 'Connected') {
              badgeStyle = "bg-emerald-50 text-emerald-700 border-emerald-200";
              dotColor = "bg-emerald-500";
            } else if (entry.status === 'Callback') {
              badgeStyle = "bg-amber-50 text-amber-700 border-amber-200";
              dotColor = "bg-amber-500";
            } else if (entry.status === 'Technical Issue') {
              badgeStyle = "bg-indigo-50 text-indigo-700 border-indigo-200";
              dotColor = "bg-indigo-500";
            } else if (entry.status === 'New') {
              badgeStyle = "bg-blue-50 text-blue-700 border-blue-200";
              dotColor = "bg-blue-500";
            }

            return (
              <div key={entry.id || idx} className="relative group">
                
                {/* Timeline node circle */}
                <div className={`absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-white ${dotColor} shadow-xs flex items-center justify-center`}>
                  {isLatest && <span className="w-1.5 h-1.5 rounded-full bg-white"></span>}
                </div>

                {/* Card Container */}
                <div className={`p-4 rounded-lg border transition-all duration-150 ${
                  isLatest 
                    ? 'bg-slate-50/80 border-slate-300 shadow-xs ring-1 ring-slate-200' 
                    : 'bg-white border-slate-200 hover:border-slate-300'
                }`}>
                  
                  {/* Card Header: Timestamp & Agent & Status Badge */}
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-100">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-bold text-slate-900 tracking-tight">
                        {entry.timestamp}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="flex items-center gap-1 text-slate-600 font-medium">
                        <User className="w-3 h-3 text-slate-400" />
                        <span>{entry.agentName}</span>
                      </span>
                      {isLatest && (
                        <span className="text-[10px] uppercase font-bold text-blue-600 bg-blue-100/70 px-1.5 py-0.2 rounded">
                          Latest
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5">
                      {entry.subStatus && (
                        <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {entry.subStatus}
                        </span>
                      )}
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}>
                        {entry.status}
                      </span>
                    </div>
                  </div>

                  {/* Remark Text */}
                  <div className="text-xs text-slate-700 leading-relaxed mb-3">
                    <p className="font-medium text-slate-800">"{entry.remark}"</p>
                  </div>

                  {/* WhatsApp Automation & Voice Note Details */}
                  {entry.whatsappTriggered && (
                    <div className="pt-2 border-t border-slate-200/70 flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      
                      {/* Left: WhatsApp Template & Delivery info */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <MessageSquare className="w-3 h-3 text-emerald-600" />
                          <span>WhatsApp Template Sent</span>
                        </span>

                        {/* WhatsApp Delivery Receipt */}
                        <span className="inline-flex items-center gap-1 font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          {entry.whatsappStatus === 'Read' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-blue-600" />
                          ) : entry.whatsappStatus === 'Delivered' ? (
                            <CheckCheck className="w-3.5 h-3.5 text-slate-500" />
                          ) : (
                            <Check className="w-3.5 h-3.5 text-slate-400" />
                          )}
                          <span>Status: <strong>{entry.whatsappStatus || 'Delivered'}</strong></span>
                        </span>

                        {/* Regional Voice Note Badge */}
                        {entry.voiceNoteSent && (
                          <button
                            type="button"
                            onClick={() => onOpenAudioPreview(entry.language || 'Hindi')}
                            className="inline-flex items-center gap-1 font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded border border-purple-200 transition"
                            title="Click to play regional voice note"
                          >
                            <Volume2 className="w-3 h-3 text-purple-600" />
                            <span>{entry.voiceNoteTitle || `${entry.language || 'Hindi'} Voice Note`}</span>
                          </button>
                        )}
                      </div>

                      {/* Right: Message ID (wamid) */}
                      {entry.whatsappMessageId && (
                        <div className="flex items-center gap-1 font-mono text-[10px] text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded">
                          <span title={entry.whatsappMessageId}>
                            ID: {entry.whatsappMessageId.slice(0, 16)}...
                          </span>
                          <button
                            onClick={() => copyId(entry.whatsappMessageId)}
                            className="text-slate-400 hover:text-slate-700"
                            title="Copy full Meta Message ID"
                          >
                            {copiedId === entry.whatsappMessageId ? (
                              <Check className="w-3 h-3 text-emerald-600" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}

                    </div>
                  )}

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}

