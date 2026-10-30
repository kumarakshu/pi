import React from 'react';
import { 
  LogOut, 
  User, 
  Settings, 
  Radio, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  PhoneCall,
  Clock
} from 'lucide-react';

export default function Header({ metaConfig, onOpenConfig, onLogout }) {
  const isLive = metaConfig?.configured && metaConfig?.mode === 'LIVE_META_API';

  return (
    <header className="bg-[#0b1329] text-white border-b border-slate-800 shadow-md sticky top-0 z-50">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        
        {/* Left: Brand & App Title */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-900/40">
            <span className="tracking-tighter">π</span>
          </div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <span className="text-white">Pi Commerce</span>
              <span className="text-slate-500 font-normal">·</span>
              <span className="text-slate-200 font-medium text-base">Onboarding Workspace</span>
            </h1>
          </div>
          <span className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-950/80 text-blue-300 border border-blue-800/60">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></span>
            WhatsApp Cloud v18.0
          </span>
        </div>

        {/* Center: System Status Indicator */}
        <div className="hidden md:flex items-center gap-4">
          <button 
            onClick={onOpenConfig}
            className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 border ${
              isLive 
                ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60 hover:bg-emerald-900/60' 
                : 'bg-amber-950/40 text-amber-300 border-amber-800/60 hover:bg-amber-900/50'
            }`}
            title="Click to configure Meta WhatsApp Cloud API credentials"
          >
            <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400' : 'bg-amber-400'} animate-pulse`}></span>
            <span>Meta API: {isLive ? 'Live Production' : 'Simulator Mode'}</span>
            <Settings className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Right: User Badge & Actions */}
        <div className="flex items-center gap-3">
          {/* User Badge */}
          <div className="flex items-center gap-3 pl-3 pr-2 py-1 rounded-full bg-[#142247]/70 border border-slate-700/60 hover:border-slate-600 transition">
            <div className="relative">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-xs font-semibold text-white shadow">
                AK
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#0b1329]"></span>
            </div>
            <div className="flex flex-col text-left pr-2">
              <span className="text-xs font-semibold text-slate-100 leading-tight">Akash Kumar</span>
              <span className="text-[10px] text-slate-400 font-medium">Onboarding Lead</span>
            </div>
          </div>

          {/* Quick Settings Button */}
          <button
            onClick={onOpenConfig}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
            title="Configure WhatsApp API"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Logout Button */}
          <button 
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-red-950/80 hover:text-red-200 hover:border-red-800/60 border border-slate-700/70 transition"
            title="Logout of Pi Commerce Workspace"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>

      </div>
    </header>
  );
}

