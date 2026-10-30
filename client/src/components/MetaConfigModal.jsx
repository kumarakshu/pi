import React, { useState } from 'react';
import { 
  X, 
  Settings, 
  Key, 
  Phone, 
  Building, 
  Shield, 
  Send, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Code
} from 'lucide-react';
import { updateWhatsAppConfig, testSendWhatsApp } from '../services/api';

export default function MetaConfigModal({ isOpen, onClose, currentConfig, onConfigUpdated }) {
  const [token, setToken] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState(currentConfig?.meta?.phoneNumberId || '');
  const [businessAccountId, setBusinessAccountId] = useState(currentConfig?.meta?.businessAccountId || '');
  const [webhookVerifyToken, setWebhookVerifyToken] = useState('pi_commerce_secret_webhook_verify_2026');
  
  // Twilio WhatsApp Sandbox State
  const [twilioAccountSid, setTwilioAccountSid] = useState(currentConfig?.twilio?.accountSid || '');
  const [twilioAuthToken, setTwilioAuthToken] = useState('');
  const [twilioFromNumber, setTwilioFromNumber] = useState(currentConfig?.twilio?.fromNumber || 'whatsapp:+17372508034');

  const [isSaving, setIsSaving] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [message, setMessage] = useState(null);

  if (!isOpen) return null;

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);
    try {
      const res = await updateWhatsAppConfig({
        token: token || undefined,
        phoneNumberId: phoneNumberId || undefined,
        businessAccountId: businessAccountId || undefined,
        webhookVerifyToken: webhookVerifyToken || undefined,
        twilioAccountSid: twilioAccountSid || undefined,
        twilioAuthToken: twilioAuthToken || undefined,
        twilioFromNumber: twilioFromNumber || undefined
      });
      setMessage({ type: 'success', text: 'WhatsApp credentials saved successfully!' });
      onConfigUpdated();
      setTimeout(() => onClose(), 1200);
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testSendWhatsApp({
        phone: "919877585378",
        merchantName: "SYAN ELECTRONICS",
        agentName: "Akash Kumar",
        pack: "Silver",
        language: "Hindi"
      });
      setTestResult(res.result);
    } catch (err) {
      setTestResult({ error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-fadeIn">
        
        {/* Header */}
        <div className="bg-[#0b1329] px-6 py-4 flex items-center justify-between text-white border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/30 rounded-lg border border-blue-500/40">
              <Settings className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h3 className="font-bold text-base">Meta WhatsApp Business Cloud API Settings</h3>
              <p className="text-xs text-slate-400">Configure Graph API credentials for live or sandbox message dispatches</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 max-h-[calc(80vh-100px)] overflow-y-auto space-y-5 text-xs text-slate-700">
          
          {/* Mode Banner */}
          <div className="p-3.5 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
            <div className="p-1 bg-blue-600 rounded text-white flex-shrink-0 mt-0.5">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-blue-900 mb-0.5">
                Current Mode: {currentConfig?.mode === 'LIVE_META_API' ? 'Live Meta Cloud API' : 'Sandbox Simulator Mode'}
              </div>
              <p className="text-blue-800 leading-relaxed text-[11px]">
                In Sandbox Simulator mode, the system auto-generates official <code>wamid</code> receipts, creates WhatsApp timeline cards, and logs the exact Meta API curl request and payload. To dispatch live WhatsApp messages to real phones, paste your Permanent System User Token below.
              </p>
            </div>
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-xs flex items-center gap-2 ${
              message.type === 'success' 
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' 
                : 'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : <AlertCircle className="w-4 h-4 text-red-600" />}
              <span>{message.text}</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* WHATSAPP_TOKEN */}
            <div>
              <label className="block font-bold text-slate-800 mb-1 flex items-center justify-between">
                <span>Meta System User Access Token (WHATSAPP_TOKEN)</span>
                <span className="text-[10px] text-slate-400 font-normal">Begins with EAAG...</span>
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder="Paste Meta Access Token here (leave blank to keep current)"
                  className="w-full pl-3 pr-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Grid 2: PHONE_NUMBER_ID & WABA_ID */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Phone Number ID (WHATSAPP_PHONE_NUMBER_ID)
                </label>
                <input
                  type="text"
                  value={phoneNumberId}
                  onChange={(e) => setPhoneNumberId(e.target.value)}
                  placeholder="e.g. 104928189481928"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  WhatsApp Business Account ID (WABA_ID)
                </label>
                <input
                  type="text"
                  value={businessAccountId}
                  onChange={(e) => setBusinessAccountId(e.target.value)}
                  placeholder="e.g. 109283746192837"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Webhook Verify Token */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                Webhook Verify Token
              </label>
              <input
                type="text"
                value={webhookVerifyToken}
                onChange={(e) => setWebhookVerifyToken(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                Webhook URL: <code>http://your-domain/api/webhook</code> (handles subscription challenges & status callbacks)
              </span>
            </div>

            {/* Twilio WhatsApp Sandbox Fallback Section */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber-500"></div>
                  <h4 className="font-bold text-slate-900 text-xs">Twilio WhatsApp Sandbox (Temporary Live Fallback)</h4>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {currentConfig?.isTwilioMode ? 'Active Fallback Mode' : 'Configured'}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                When Meta WABA token is empty, the workspace routes live WhatsApp templates and regional audio notes via Twilio Sandbox numbers.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Twilio Account SID (TWILIO_ACCOUNT_SID)
                  </label>
                  <input
                    type="text"
                    value={twilioAccountSid}
                    onChange={(e) => setTwilioAccountSid(e.target.value)}
                    placeholder="e.g. ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Twilio Auth Token (TWILIO_AUTH_TOKEN)
                  </label>
                  <input
                    type="password"
                    value={twilioAuthToken}
                    onChange={(e) => setTwilioAuthToken(e.target.value)}
                    placeholder="Paste Twilio Auth Token here"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Twilio WhatsApp Sender Number
                </label>
                <input
                  type="text"
                  value={twilioFromNumber}
                  onChange={(e) => setTwilioFromNumber(e.target.value)}
                  placeholder="whatsapp:+17372508034"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-md font-mono text-xs focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={handleTestPing}
                disabled={isTesting}
                className="px-3 py-2 rounded-md font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 transition flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>{isTesting ? 'Sending test...' : 'Send Test WhatsApp Ping'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-md font-medium text-slate-600 hover:bg-slate-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-4 py-2 rounded-md font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition"
                >
                  {isSaving ? 'Saving...' : 'Save Configuration'}
                </button>
              </div>
            </div>

          </form>

          {/* Test Send Result Viewer */}
          {testResult && (
            <div className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[11px] overflow-x-auto space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span>Meta API Dispatch Output</span>
                <span className={testResult.success ? 'text-emerald-400' : 'text-red-400'}>
                  {testResult.success ? 'HTTP 200 OK' : 'FAILED'}
                </span>
              </div>
              <pre className="text-slate-300 overflow-x-auto">
                {JSON.stringify(testResult, null, 2)}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

