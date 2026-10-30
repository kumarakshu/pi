import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Clock, 
  MessageSquare, 
  Radio, 
  Volume2, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  ChevronDown, 
  Calendar, 
  Languages, 
  Eye, 
  Save, 
  FileText,
  Check
} from 'lucide-react';
import { REGIONAL_WHATSAPP_TEMPLATES } from './CaseDetailHeader';

const PRIMARY_DISPOSITIONS = [
  'Not Connected',
  'Connected',
  'Callback',
  'Technical Issue',
  'Face-to-Face',
  'Not Interested'
];

const SUB_STATUS_MAP = {
  'Not Connected': [
    'RNR',
    'Busy',
    'Switch Off',
    'Call Disconnected',
    'Invalid Number',
    'Network Issue'
  ],
  'Callback': [
    'Busy',
    'Requested Callback',
    'Owner Traveling',
    'Showroom Rush',
    'Evening Slot (After 5 PM)',
    'Callback with Decision Maker'
  ],
  'Technical Issue': [
    'Facebook Login Issue',
    'Ad Setup Pending',
    'Catalog Sync Error',
    'Domain Verification Failed',
    'Payment Gateway Issue',
    'Meta Business Manager 2FA Blocked'
  ],
  'Connected': [
    'Onboarding Completed',
    'Ad Campaign Launched',
    'WhatsApp Business API Connected',
    'Catalog Verified & Live'
  ],
  'Face-to-Face': [
    'Field Agent Visit Scheduled',
    'Physical Document Collection',
    'Showroom Product Demo Required'
  ],
  'Not Interested': [
    'Budget Constraints',
    'Switched to Competitor',
    'Shop Closed Temporarily',
    'Not Ready for Online Ads'
  ]
};

const LANGUAGES = [
  { id: 'Hindi', label: 'हिन्दी (Hindi)', code: 'hi' },
  { id: 'English', label: 'English', code: 'en_US' },
  { id: 'Hinglish', label: 'Hinglish (Hindi in English Script)', code: 'hi' },
  { id: 'Marathi', label: 'मराठी (Marathi)', code: 'mr' },
  { id: 'Gujarati', label: 'ગુજરાતી (Gujarati)', code: 'gu' },
  { id: 'Tamil', label: 'தமிழ் (Tamil)', code: 'ta' },
  { id: 'Telugu', label: 'తెలుగు (Telugu)', code: 'te' }
];

export default function DispositionPanel({ 
  caseData, 
  onSubmitDisposition, 
  isSubmitting, 
  onOpenAudioPreview,
  selectedLanguage = 'Hindi',
  onLanguageChange,
  metaConfig
}) {
  const [primaryDisposition, setPrimaryDisposition] = useState('Not Connected');
  const [subStatus, setSubStatus] = useState('RNR');
  const [callbackTime, setCallbackTime] = useState('');
  const [remark, setRemark] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [submittingAction, setSubmittingAction] = useState(null); // 'save_only' | 'save_and_send'
  const [twilioToast, setTwilioToast] = useState(false);

  const language = selectedLanguage || 'Hindi';

  const handleLanguageChange = (newLang) => {
    if (onLanguageChange) {
      onLanguageChange(newLang);
    }
  };

  // Update sub-status options when primary disposition changes
  useEffect(() => {
    const available = SUB_STATUS_MAP[primaryDisposition] || [];
    if (!available.includes(subStatus)) {
      setSubStatus(available[0] || '');
    }
  }, [primaryDisposition]);

  // Set default callback date/time when Callback is chosen
  useEffect(() => {
    if (primaryDisposition === 'Callback' && !callbackTime) {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(15, 0, 0, 0); // 3:00 PM tomorrow
      const formatted = tomorrow.toISOString().slice(0, 16);
      setCallbackTime(formatted);
    }
  }, [primaryDisposition]);

  // Handle action submission: trigger automation or save only
  const handleActionSubmit = (sendWhatsApp) => {
    setValidationError('');

    if (!primaryDisposition) {
      setValidationError('Please select a Primary Disposition');
      return;
    }
    if (!subStatus) {
      setValidationError('Please select a Sub-Status / Issue');
      return;
    }
    if (primaryDisposition === 'Callback' && !callbackTime) {
      setValidationError('Please specify the Callback Date & Time');
      return;
    }

    setSubmittingAction(sendWhatsApp ? 'save_and_send' : 'save_only');

    // Show toast badge when live test automation is triggered under Twilio mode
    if (sendWhatsApp && (metaConfig?.isTwilioMode || metaConfig?.provider === 'twilio' || metaConfig?.mode === 'TWILIO_SANDBOX' || !metaConfig?.meta?.token)) {
      setTwilioToast(true);
      setTimeout(() => setTwilioToast(false), 9000);
    }

    onSubmitDisposition({
      caseId: caseData.caseId,
      merchantPhone: caseData.cleanPhone,
      merchantName: caseData.merchantName,
      disposition: primaryDisposition,
      subStatus: subStatus,
      language: language,
      pack: caseData.planTier || "Silver",
      agentName: "Akash Kumar",
      remark: remark.trim(),
      callbackTime: primaryDisposition === 'Callback' ? callbackTime : null,
      sendWhatsApp: Boolean(sendWhatsApp)
    });

    // Reset remark
    setRemark('');
  };

  const insertSnippet = (snippet) => {
    setRemark(prev => (prev ? `${prev} - ${snippet}` : snippet));
  };

  // Compute preview message text using the universal template generator
  const templateConfig = REGIONAL_WHATSAPP_TEMPLATES[language] || REGIONAL_WHATSAPP_TEMPLATES['Hindi'];
  const previewText = templateConfig.buildText({
    merchantName: caseData.merchantName,
    planName: caseData.plan,
    expiryDate: caseData.expiry
  });

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 mb-5">
      
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Disposition Action Panel
          </h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-500 font-medium">
            Agent: <strong className="text-slate-800 font-semibold">Akash Kumar</strong>
          </span>
        </div>
      </div>

      {validationError && (
        <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2 animate-fadeIn">
          <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      <div className="space-y-4">
        
        {/* Row 1: Primary Disposition & Sub-Status / Issue & Universal Language Selector */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          
          {/* Dropdown 1: Primary Disposition */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Primary Disposition <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={primaryDisposition}
                onChange={(e) => setPrimaryDisposition(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
              >
                {PRIMARY_DISPOSITIONS.map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Dropdown 2: Sub-Status / Issue */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Sub-Status / Issue <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                value={subStatus}
                onChange={(e) => setSubStatus(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs font-semibold text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none transition"
              >
                {(SUB_STATUS_MAP[primaryDisposition] || []).map(item => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Universal Synchronized Language Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <span>Template & Voice Language</span>
                <span className="text-[10px] text-blue-600 bg-blue-50 px-1 rounded font-semibold uppercase">Live Sync</span>
              </span>
              <Languages className="w-3.5 h-3.5 text-blue-600" />
            </label>
            <div className="relative">
              <select
                value={language}
                onChange={(e) => handleLanguageChange(e.target.value)}
                className="w-full pl-3 pr-8 py-2 bg-slate-50 border border-blue-400 rounded-md text-xs font-bold text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none transition shadow-2xs"
              >
                {LANGUAGES.map(item => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-blue-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* Conditional Callback Date/Time Picker */}
        {primaryDisposition === 'Callback' && (
          <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-lg animate-fadeIn">
            <label className="block text-xs font-bold text-amber-900 mb-1 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Schedule Callback Date & Time</span>
              <span className="text-red-500">*</span>
            </label>
            <input
              type="datetime-local"
              value={callbackTime}
              onChange={(e) => setCallbackTime(e.target.value)}
              className="w-full sm:w-72 px-3 py-1.5 bg-white border border-amber-300 rounded-md text-xs font-medium text-slate-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <span className="block text-[11px] text-amber-700 mt-1">
              Callback time will be recorded in the customer's timeline and queued on the workspace.
            </span>
          </div>
        )}

        {/* Manual Remark Textarea & Quick Snippets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-slate-700">
              Manual Remark / Call Observations
            </label>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-slate-400 mr-1">Quick Snippets:</span>
              <button
                type="button"
                onClick={() => insertSnippet("Didn't Pick Up the Call WhatsApp Message already shared")}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
              >
                Didn't Pick Up
              </button>
              <button
                type="button"
                onClick={() => insertSnippet("Shop rush, requested callback")}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
              >
                Shop Rush
              </button>
              <button
                type="button"
                onClick={() => insertSnippet("Meta BM 2FA checkpoint blocked")}
                className="px-2 py-0.5 text-[10px] font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 rounded transition"
              >
                FB 2FA
              </button>
            </div>
          </div>
          <textarea
            rows="2"
            value={remark}
            onChange={(e) => setRemark(e.target.value)}
            placeholder="Type specific notes or remarks from the call (e.g., customer was at billing counter, requested guide in Hindi)..."
            className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition"
          ></textarea>
        </div>

        {/* Message Preview & Voice Note Banner */}
        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="p-1 bg-emerald-100 rounded text-emerald-800 mt-0.5">
              <MessageSquare className="w-4 h-4 text-emerald-700" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900">
                Official WhatsApp Onboarding Template & Regional Audio Note
              </span>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Target recipient: <strong className="text-slate-800 font-semibold">{caseData.merchantPhone}</strong> ({language})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end sm:self-center">
            <button
              type="button"
              onClick={() => setShowPreview(!showPreview)}
              className="text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-300 px-2.5 py-1 rounded flex items-center gap-1.5 transition shadow-2xs"
            >
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>{showPreview ? 'Hide Preview' : 'Preview Message'}</span>
            </button>
            <button
              type="button"
              onClick={() => onOpenAudioPreview(language)}
              className="text-xs font-semibold text-purple-700 hover:text-purple-900 bg-purple-50 hover:bg-purple-100 border border-purple-200 px-2.5 py-1 rounded flex items-center gap-1.5 transition shadow-2xs"
              title="Listen to regional audio voice note"
            >
              <Volume2 className="w-3.5 h-3.5 text-purple-600" />
              <span>Listen Voice Note</span>
            </button>
          </div>
        </div>

        {/* Live Preview Accordion with User's Specified Dynamic Message Structure */}
        {showPreview && (
          <div className="p-4 bg-slate-900 text-slate-100 rounded-lg text-xs space-y-3 border border-slate-700 animate-fadeIn">
            <div className="flex items-center justify-between text-slate-400 pb-2 border-b border-slate-800">
              <span className="font-mono text-[11px]">Meta Cloud API Payload · Template: pi_commerce_onboarding_rnr ({language})</span>
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <Check className="w-3.5 h-3.5" />
                <span>Ready to dispatch</span>
              </span>
            </div>
            
            <div className="bg-[#0b141a] p-4 rounded-lg border border-[#202c33] text-[#e9edef] max-w-lg space-y-2.5 shadow-md">
              <div className="flex items-center justify-between pb-1.5 border-b border-[#202c33]">
                <div className="font-bold text-[#00a884] flex items-center gap-1.5">
                  <span className="text-sm">π Paytm Pi Commerce</span>
                  <span className="text-[10px] text-slate-400 font-normal">· Verified Business</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Onboarding Reminder</span>
              </div>

              <div className="text-[11px] leading-relaxed whitespace-pre-line text-slate-200">
                {previewText}
              </div>

              <div className="p-2 bg-[#1f2c34] rounded flex items-center justify-between text-[11px] text-[#00a884]">
                <div className="flex items-center gap-2">
                  <Volume2 className="w-4 h-4 flex-shrink-0" />
                  <span>🎙️ Voice Note ({language} Regional Audio Attached)</span>
                </div>
                <span className="text-[10px] text-slate-400">MP3</span>
              </div>

              <div className="pt-2 border-t border-[#2a3942] text-center text-[#53bdeb] font-semibold text-[11px] flex items-center justify-center gap-1.5 cursor-pointer hover:underline">
                <Calendar className="w-3.5 h-3.5" />
                <span>Schedule Callback / Instant Setup</span>
              </div>
            </div>
          </div>
        )}

        {/* Twilio Sandbox Toast Notification Badge */}
        {twilioToast && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-fadeIn">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce" />
              <span>Live Test WhatsApp & Audio Dispatched via Twilio Sandbox!</span>
            </div>
            <button 
              type="button" 
              onClick={() => setTwilioToast(false)} 
              className="text-emerald-700 hover:text-emerald-950 font-bold px-1.5 py-0.5 rounded transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Twilio Mode Information Pill */}
        {(metaConfig?.isTwilioMode || metaConfig?.provider === 'twilio' || metaConfig?.mode === 'TWILIO_SANDBOX') && (
          <div className="px-3 py-2 rounded-lg bg-amber-50/90 border border-amber-200 text-amber-900 text-[11px] flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
              </span>
              <span>
                Twilio WhatsApp Sandbox Active: <strong>{metaConfig?.twilio?.fromNumber?.replace('whatsapp:', '') || '+1 737 250 8034'}</strong> ➔ Test Numbers
              </span>
            </div>
            <span className="text-[10px] text-amber-700 font-semibold bg-amber-100 px-2 py-0.5 rounded">REAL DISPATCH MODE</span>
          </div>
        )}

        {/* Dual Disposition Action Buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 pt-3 border-t border-slate-100">
          
          {/* Button 1: Save Disposition Only (Secondary / Outline) */}
          <button
            type="button"
            onClick={() => handleActionSubmit(false)}
            disabled={isSubmitting}
            className="px-4 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 shadow-2xs hover:border-slate-400 transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed"
            title="Saves disposition remark to local audit timeline without sending WhatsApp messages"
          >
            {isSubmitting && submittingAction === 'save_only' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Disposition...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 text-slate-500" />
                <span>Save Disposition Only</span>
              </>
            )}
          </button>

          {/* Button 2: Submit & Send WhatsApp Automation (Primary / Filled Green) */}
          <button
            type="button"
            onClick={() => handleActionSubmit(true)}
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/25 transition-all active:scale-[0.99] disabled:bg-slate-400 disabled:cursor-not-allowed"
            title="Saves disposition and dispatches Meta WhatsApp Cloud API template & regional voice note"
          >
            {isSubmitting && submittingAction === 'save_and_send' ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending Automation...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit & Send WhatsApp Automation</span>
              </>
            )}
          </button>

        </div>

      </div>
    </div>
  );
}
