import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import MetricsGrid from './components/MetricsGrid';
import FilterBar from './components/FilterBar';
import CaseSidebar from './components/CaseSidebar';
import CaseDetailHeader from './components/CaseDetailHeader';
import DispositionPanel from './components/DispositionPanel';
import HistoryTimeline from './components/HistoryTimeline';
import MetaConfigModal from './components/MetaConfigModal';
import AudioPreviewModal from './components/AudioPreviewModal';

import { 
  fetchMetrics, 
  fetchCases, 
  fetchCaseById, 
  submitDisposition, 
  fetchWhatsAppConfig 
} from './services/api';

import { 
  CheckCircle2, 
  AlertCircle, 
  MessageSquare, 
  Volume2, 
  Sparkles,
  X
} from 'lucide-react';

export default function App() {
  const [metrics, setMetrics] = useState(null);
  const [cases, setCases] = useState([]);
  const [selectedCaseId, setSelectedCaseId] = useState('1439868101');
  const [currentCase, setCurrentCase] = useState(null);
  
  const [currentTab, setCurrentTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedQueue, setSelectedQueue] = useState('');
  
  const [metaConfig, setMetaConfig] = useState(null);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isAudioModalOpen, setIsAudioModalOpen] = useState(false);
  const [audioModalLang, setAudioModalLang] = useState('Hindi');
  const [selectedLanguage, setSelectedLanguage] = useState('Hindi');
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  const loadCaseDetail = async (id) => {
    try {
      const data = await fetchCaseById(id);
      setCurrentCase(data);
      if (data?.preferredLanguage) {
        setSelectedLanguage(data.preferredLanguage);
      }
    } catch (err) {
      console.error('Failed to load case detail:', err);
    }
  };

  const loadCases = async () => {
    try {
      const data = await fetchCases({ filter: currentTab, search: searchQuery, queue: selectedQueue });
      setCases(data);
    } catch (err) {
      console.error('Failed to filter cases:', err);
    }
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [metricsData, casesData, configData] = await Promise.all([
        fetchMetrics().catch(() => null),
        fetchCases({ filter: currentTab, search: searchQuery, queue: selectedQueue }).catch(() => []),
        fetchWhatsAppConfig().catch(() => null)
      ]);

      if (metricsData) setMetrics(metricsData);
      if (casesData) setCases(casesData);
      if (configData) setMetaConfig(configData);

      if (casesData && casesData.length > 0) {
        const exists = casesData.some(c => c.caseId === selectedCaseId);
        const targetId = exists ? selectedCaseId : casesData[0].caseId;
        setSelectedCaseId(targetId);
        await loadCaseDetail(targetId);
      }
    } catch (err) {
      console.error('Failed to load workspace data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Initial Load
  useEffect(() => {
    loadAllData();
  }, []);

  // Filter effect
  useEffect(() => {
    loadCases();
  }, [currentTab, searchQuery, selectedQueue]);

  // Load single case details when selected
  useEffect(() => {
    if (selectedCaseId) {
      loadCaseDetail(selectedCaseId);
    }
  }, [selectedCaseId]);

  const handleSubmit = async (payload) => {
    setIsSubmitting(true);
    setToast(null);
    try {
      const response = await submitDisposition(payload);

      // Refresh case detail
      setCurrentCase(response.case);

      // Refresh metrics
      if (response.metrics) {
        setMetrics(response.metrics);
      }

      // Refresh case in sidebar
      setCases(prev => prev.map(c => c.caseId === response.case.caseId ? response.case : c));

      // Show comprehensive success toast
      const waSent = response.whatsapp?.triggered;
      const isTwilio = response.whatsapp?.provider === 'twilio' || metaConfig?.isTwilioMode || metaConfig?.provider === 'twilio';

      setToast({
        type: 'success',
        title: waSent 
          ? (isTwilio ? 'Live Test WhatsApp & Audio Dispatched via Twilio Sandbox!' : 'Disposition & WhatsApp Automation Dispatched') 
          : 'Disposition Saved (Internal Log)',
        message: waSent
          ? (isTwilio
              ? `Live Test WhatsApp message & ${payload.language} voice note dispatched via Twilio Sandbox (${response.whatsapp?.fromNumber || metaConfig?.twilio?.fromNumber || 'whatsapp:+17372508034'} ➔ ${response.whatsapp?.recipientPhone || payload.merchantPhone}). Message SID: ${response.whatsapp?.messageId || 'Delivered'}`
              : `Status updated to "${payload.disposition}". Meta WhatsApp Cloud Template & ${payload.language} Voice Note dispatched to ${payload.merchantPhone}!`)
          : `Status updated to "${payload.disposition}" (${payload.subStatus}) and timeline updated without WhatsApp triggers.`,
        messageId: response.whatsapp?.messageId
      });

    } catch (err) {
      setToast({
        type: 'error',
        title: 'Submission Failed',
        message: err.message || 'Error communicating with Meta WhatsApp API or Server.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenAudioPreview = (language) => {
    setAudioModalLang(language || 'Hindi');
    setIsAudioModalOpen(true);
  };

  const handleLogout = () => {
    setToast({
      type: 'info',
      title: 'Session Notice',
      message: 'Logged out from Pi Commerce workspace. Session preserved in memory.'
    });
  };

  return (
    <div className="min-h-screen bg-[#f1f5f9] flex flex-col">
      
      {/* Header */}
      <Header
        metaConfig={metaConfig}
        onOpenConfig={() => setIsConfigModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1920px] w-full mx-auto px-4 sm:px-6 py-5">
        
        {/* Top Work Queue Metrics Grid */}
        <MetricsGrid
          metrics={metrics}
          selectedQueue={selectedQueue}
          onSelectQueue={(q) => setSelectedQueue(q)}
        />

        {/* Filter Tabs & Search Bar */}
        <FilterBar
          currentTab={currentTab}
          onTabChange={(tab) => setCurrentTab(tab)}
          searchQuery={searchQuery}
          onSearchChange={(q) => setSearchQuery(q)}
          onRefresh={loadAllData}
          isLoading={isLoading}
        />

        {/* Global Toast Notification */}
        {toast && (
          <div className={`mb-4 p-4 rounded-lg shadow-sm border flex items-start justify-between gap-3 animate-fadeIn ${
            toast.type === 'success' 
              ? 'bg-emerald-50 border-emerald-300 text-emerald-900' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-300 text-red-900'
              : 'bg-blue-50 border-blue-300 text-blue-900'
          }`}>
            <div className="flex items-start gap-3">
              {toast.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : (
                <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <h4 className="font-bold text-xs">{toast.title}</h4>
                <p className="text-xs mt-0.5">{toast.message}</p>
                {toast.messageId && (
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded bg-emerald-100 font-mono text-[10px] text-emerald-800">
                    Meta ID: {toast.messageId}
                  </span>
                )}
              </div>
            </div>
            <button onClick={() => setToast(null)} className="text-slate-400 hover:text-slate-700">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Content Layout: Left Sidebar + Main Panel */}
        <div className="flex flex-col lg:flex-row gap-5 items-start">
          
          {/* Left Sidebar: Technical Case List */}
          <CaseSidebar
            cases={cases}
            selectedCaseId={selectedCaseId}
            onSelectCase={(id) => setSelectedCaseId(id)}
            isLoading={isLoading}
          />

          {/* Main Panel: CASE VIEW */}
          <div className="flex-1 w-full min-w-0">
            {currentCase ? (
              <>
                {/* 1. Case Header & Details */}
                <CaseDetailHeader 
                  caseData={currentCase} 
                  language={selectedLanguage}
                />

                {/* 2. Disposition Action Panel */}
                <DispositionPanel
                  caseData={currentCase}
                  onSubmitDisposition={handleSubmit}
                  isSubmitting={isSubmitting}
                  onOpenAudioPreview={handleOpenAudioPreview}
                  selectedLanguage={selectedLanguage}
                  onLanguageChange={setSelectedLanguage}
                  metaConfig={metaConfig}
                />

                {/* 3. History Timeline Section */}
                <HistoryTimeline
                  timeline={currentCase.timeline || []}
                  onOpenAudioPreview={handleOpenAudioPreview}
                />
              </>
            ) : (
              <div className="bg-white rounded-lg border border-slate-200 p-12 text-center text-slate-500">
                <p className="text-sm font-semibold">No case selected</p>
                <p className="text-xs mt-1">Please select a merchant case from the left sidebar to view details.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Meta WhatsApp Cloud API Configuration Modal */}
      <MetaConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        currentConfig={metaConfig}
        onConfigUpdated={() => {
          fetchWhatsAppConfig().then(cfg => setMetaConfig(cfg));
        }}
      />

      {/* Regional Voice Note Audio Preview Modal */}
      <AudioPreviewModal
        isOpen={isAudioModalOpen}
        onClose={() => setIsAudioModalOpen(false)}
        initialLanguage={audioModalLang}
      />

    </div>
  );
}

