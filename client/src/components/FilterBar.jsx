import React from 'react';
import { Search, X, RefreshCw } from 'lucide-react';

const TABS = [
  { id: 'all', label: 'All' },
  { id: 'active_not_cancelled', label: 'Active (not cancelled/expired)' },
  { id: 'active_cancelled', label: 'Active (cancelled/expired)' }
];

export default function FilterBar({ 
  currentTab, 
  onTabChange, 
  searchQuery, 
  onSearchChange,
  onRefresh,
  isLoading 
}) {
  return (
    <div className="bg-white rounded-lg border border-slate-200 p-2.5 mb-4 shadow-2xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
      
      {/* Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
        {TABS.map(tab => {
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Search & Refresh */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search Merchant or Phone ID..."
            className="w-full pl-9 pr-8 py-1.5 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md border border-slate-200 transition"
          title="Refresh Data"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-blue-600' : ''}`} />
        </button>
      </div>

    </div>
  );
}

