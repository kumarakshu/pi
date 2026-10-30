import React, { useState } from 'react';
import { 
  Building2, 
  Phone, 
  User, 
  Calendar, 
  Tag, 
  CreditCard, 
  Coins, 
  AlertCircle, 
  Copy, 
  Check, 
  ExternalLink,
  MessageSquare,
  ShieldCheck,
  Clock,
  Globe
} from 'lucide-react';

export const REGIONAL_WHATSAPP_TEMPLATES = {
  English: {
    label: "English",
    buildText: ({ merchantName, planName, expiryDate }) => `Hello ${merchantName},

Thank you for choosing Paytm Pi Commerce!

Your subscription details:
- Plan: ${planName}
- Expiry Date: ${expiryDate}

Your ad onboarding is still pending. Complete your setup to make your first ad live immediately.

Don't delay! Complete onboarding before the expiry date to make the most of your plan.

Regards,
Paytm Pi Commerce Team`
  },
  Hindi: {
    label: "हिन्दी (Hindi)",
    buildText: ({ merchantName, planName, expiryDate }) => `नमस्ते ${merchantName},

Paytm Pi Commerce चुनने के लिए धन्यवाद!

आपके सब्सक्रिप्शन की जानकारी:
- प्लान: ${planName}
- एक्सपायरी डेट: ${expiryDate}

आपका Ad Onboarding अभी भी पेंडिंग है। अब आपको अपना सेटअप पूरा करके अपना पहला विज्ञापन (Ad) जल्द से जल्द लाइव करना है।

एक्सपायरी डेट से पहले अपना ऑनबोर्डिंग पूरा करें और अपने खरीदे हुए प्लान का पूरा फायदा उठाएं।

धन्यवाद,
Paytm Pi Commerce Team`
  },
  Hinglish: {
    label: "Hinglish",
    buildText: ({ merchantName, planName, expiryDate }) => `Namaste ${merchantName},

Paytm Pi Commerce chunne ke liye dhanyawad!

Aapke subscription ki details:
- Plan: ${planName}
- Expiry Date: ${expiryDate}

Aapka ad onboarding abhi pending hai. Apne setup ko complete karke pehla ad jaldi live karein.

Expiry date se pehle onboarding complete karein aur plan ka poora fayda uthayein.

Dhanyawad,
Paytm Pi Commerce Team`
  },
  Tamil: {
    label: "தமிழ் (Tamil)",
    buildText: ({ merchantName, planName, expiryDate }) => `வணக்கம் ${merchantName},

Paytm Pi Commerce ஐ தேர்ந்தெடுத்ததற்கு நன்றி!

உங்கள் சந்தா விவரங்கள்:
- திட்டம்: ${planName}
- காலாவதி தேதி: ${expiryDate}

உங்கள் Ad Onboarding இன்னும் நிலுவையில் உள்ளது. உங்கள் முதல் விளம்பரத்தை உடனடியாக நேரலை செய்ய அமைப்பை முடிக்கவும்.

உங்கள் திட்டத்தின் முழு பலனையும் பெற காலாவதி தேதிக்கு முன் முடிக்கவும்.

நன்றி,
Paytm Pi Commerce Team`
  },
  Telugu: {
    label: "తెలుగు (Telugu)",
    buildText: ({ merchantName, planName, expiryDate }) => `నమస్కారం ${merchantName},

Paytm Pi Commerce ను ఎంచుకున్నందుకు ధన్యవాదాలు!

మీ సబ్‌స్క్రిప్షన్ వివరాలు:
- ప్లాన్: ${planName}
- గడువు తేదీ: ${expiryDate}

మీ Ad Onboarding ఇంకా పెండింగ్లో ఉంది. మీ మొదటి ప్రకటనను వెంటనే లైవ్ చేయడానికి సెటప్ పూర్తి చేయండి.

గడువు తేదీకి ముందే పూర్తి చేసి ప్లాన్ ప్రయోజనాలను పొందండి.

ధన్యవాదాలు,
Paytm Pi Commerce Team`
  },
  Marathi: {
    label: "मराठी (Marathi)",
    buildText: ({ merchantName, planName, expiryDate }) => `नमस्कार ${merchantName},

Paytm Pi Commerce निवडल्याबद्दल धन्यवाद!

तुमच्या सबस्क्रिप्शनचा तपशील:
- प्लॅन: ${planName}
- एक्सपायरी डेट: ${expiryDate}

तुमचे Ad Onboarding अजून प्रलंबित आहे. तुमची पहिली जाहिरात त्वरित लाईव्ह करण्यासाठी सेटअप पूर्ण करा.

एक्सपायरी डेटपूर्वी ऑनबोर्डिंग पूर्ण करा आणि प्लॅनचा पूर्ण फायदा घ्या.

धन्यवाद,
Paytm Pi Commerce Team`
  },
  Gujarati: {
    label: "ગુજરાતી (Gujarati)",
    buildText: ({ merchantName, planName, expiryDate }) => `નમસ્તે ${merchantName},

Paytm Pi Commerce પસંદ કરવા બદલ આભાર!

તમારી સબ્સ્ક્રિપ્શન વિગતો:
- પ્લાન: ${planName}
- એક્સપાયરી તારીખ: ${expiryDate}

તમારું Ad Onboarding હજુ બાકી છે. તમારી પ્રથમ જાહેરાત તાત્કાલિક લાઈવ કરવા સેટઅપ પૂર્ણ કરો.

એક્સપાયરી તારીખ પહેલાં ઓનબોર્ડિંગ પૂર્ણ કરી પ્લાનનો સંપૂર્ણ લાભ લો.

ધન્યવાદ,
Paytm Pi Commerce Team`
  }
};

export function getWhatsAppDeepLink(caseData, language = 'Hindi') {
  if (!caseData) return '#';
  const cleanPhone = caseData.cleanPhone || (caseData.merchantPhone ? caseData.merchantPhone.replace(/\D/g, '') : '');
  const merchantName = caseData.merchantName || 'Merchant Partner';
  const planName = caseData.plan || 'Silver - ₹1,999';
  const expiryDate = caseData.expiry || '2026-11-20';

  const templateObj = REGIONAL_WHATSAPP_TEMPLATES[language] || REGIONAL_WHATSAPP_TEMPLATES['Hindi'];
  const rawMessage = templateObj.buildText({ merchantName, planName, expiryDate });

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(rawMessage)}`;
}

export default function CaseDetailHeader({ caseData, language = 'Hindi' }) {
  const [copiedField, setCopiedField] = useState(null);

  if (!caseData) return null;

  const copyToClipboard = (text, fieldName) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Status Badge styling
  let statusBadgeClass = "bg-rose-50 text-rose-700 border-rose-300";
  if (caseData.currentStatus === 'Connected') {
    statusBadgeClass = "bg-emerald-50 text-emerald-700 border-emerald-300";
  } else if (caseData.currentStatus === 'Callback') {
    statusBadgeClass = "bg-amber-50 text-amber-700 border-amber-300";
  } else if (caseData.currentStatus === 'Technical Issue') {
    statusBadgeClass = "bg-indigo-50 text-indigo-700 border-indigo-300";
  } else if (caseData.currentStatus === 'New') {
    statusBadgeClass = "bg-blue-50 text-blue-700 border-blue-300";
  }

  const deepLink = getWhatsAppDeepLink(caseData, language);

  return (
    <div className="bg-white rounded-lg border border-slate-200 shadow-xs p-5 mb-5">
      
      {/* Top row: Title, ID, Phone, Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
              {caseData.merchantName}
            </h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${statusBadgeClass}`}>
              {caseData.currentStatus}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <span>Customer ID:</span>
              <span className="font-semibold text-slate-800 font-mono">{caseData.caseId}</span>
              <button
                onClick={() => copyToClipboard(caseData.caseId, 'caseId')}
                className="text-slate-400 hover:text-slate-600 transition"
                title="Copy Customer ID"
              >
                {copiedField === 'caseId' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>

            <span className="text-slate-300">•</span>

            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>Phone:</span>
              <span className="font-semibold text-slate-800">{caseData.merchantPhone}</span>
              <button
                onClick={() => copyToClipboard(caseData.cleanPhone, 'phone')}
                className="text-slate-400 hover:text-slate-600 transition"
                title="Copy Phone Number"
              >
                {copiedField === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Quick action buttons with synchronized dynamic language */}
        <div className="flex items-center gap-2">
          <a
            href={deepLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-md text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition group"
            title={`Open WhatsApp chat with pre-filled ${language} onboarding reminder`}
          >
            <MessageSquare className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
            <span>Open WhatsApp ({language})</span>
          </a>
          <a
            href={`tel:${caseData.merchantPhone}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
          >
            <Phone className="w-3.5 h-3.5" />
            <span>Call Merchant</span>
          </a>
        </div>
      </div>

      {/* Detail Fields 2-Row Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 text-xs">
        
        {/* Assigned To */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Assigned To</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <User className="w-3.5 h-3.5 text-blue-600" />
            <span>{caseData.assignedTo}</span>
          </div>
        </div>

        {/* Date of Sale */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Date of Sale</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            <span>{caseData.dateOfSale}</span>
          </div>
        </div>

        {/* Plan */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Plan</span>
          <div className="flex items-center gap-1.5 font-bold text-blue-700">
            <CreditCard className="w-3.5 h-3.5 text-blue-600" />
            <span>{caseData.plan}</span>
          </div>
        </div>

        {/* Credits */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Credits</span>
          <div className="flex items-center gap-1.5 font-bold text-amber-700">
            <Coins className="w-3.5 h-3.5 text-amber-600" />
            <span>{caseData.credits}</span>
          </div>
        </div>

        {/* Sub Status */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Sub Status</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Tag className="w-3.5 h-3.5 text-slate-500" />
            <span className="truncate">{caseData.subStatus}</span>
          </div>
        </div>

        {/* Expiry */}
        <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
          <span className="text-slate-400 block text-[10px] font-medium uppercase tracking-wider mb-0.5">Expiry Date</span>
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>{caseData.expiry}</span>
          </div>
        </div>

      </div>

    </div>
  );
}
