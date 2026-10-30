import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'cases_data.json');

const INITIAL_CASES = [
  {
    caseId: "1439868101",
    merchantName: "Manu Agarwal (Manu Enterprises)",
    merchantPhone: "+919873141101",
    cleanPhone: "919873141101",
    assignedTo: "Akash Kumar",
    dateOfSale: "2026-10-20",
    currentStatus: "Not Connected",
    subStatus: "RNR",
    statusCategory: "active_cancelled",
    queueCategory: "ALL OPEN",
    plan: "Gold - ₹4,999",
    planTier: "Gold",
    planPrice: "₹4,999",
    credits: "₹5,000",
    expiry: "2026-11-20",
    lastDisposition: "Not Connected",
    lastSubStatus: "RNR",
    lastRemark: "Didn't Pick Up the Call WhatsApp Message already shared",
    callbackSchedule: null,
    preferredLanguage: "Hindi",
    timeline: [
      {
        id: "log-101",
        timestamp: "28 Oct, 3:24 pm",
        date: "2026-10-28T15:24:00+05:30",
        agentName: "Akash Kumar",
        status: "Not Connected",
        subStatus: "RNR",
        remark: "Didn't Pick Up the Call WhatsApp Message already shared",
        whatsappTriggered: true,
        whatsappStatus: "Delivered",
        whatsappMessageId: "wamid.HBgMOTE5ODczMTQxMTAxFQIAERgSRDM2Qzk5QjE2NTQ4NEQ4NUQA",
        templateName: "pi_commerce_onboarding_rnr",
        language: "Hindi",
        voiceNoteSent: true,
        voiceNoteTitle: "Hindi Onboarding Introduction Note"
      },
      {
        id: "log-100",
        timestamp: "25 Oct, 11:30 am",
        date: "2026-10-25T11:30:00+05:30",
        agentName: "Akash Kumar",
        status: "Callback",
        subStatus: "Busy",
        remark: "Customer requested callback after showroom rush.",
        whatsappTriggered: true,
        whatsappStatus: "Read",
        whatsappMessageId: "wamid.HBgMOTE5ODczMTQxMTAxFQIAERgSRDM2Qzk5QjE2NTQ4NEQ4OTVB",
        templateName: "pi_commerce_callback_scheduled",
        language: "Hindi",
        voiceNoteSent: false
      },
      {
        id: "log-99",
        timestamp: "20 Oct, 2:15 pm",
        date: "2026-10-20T14:15:00+05:30",
        agentName: "Akash Kumar",
        status: "New",
        subStatus: "Lead Assignment",
        remark: "Lead onboarded via Sales Portal. Gold Plan (₹4,999) + ₹5,000 ad credits. Assigned to Akash Kumar.",
        whatsappTriggered: true,
        whatsappStatus: "Read",
        whatsappMessageId: "wamid.HBgMOTE5ODczMTQxMTAxFQIAERgSRDM2Qzk5QjE2NTQ4NEQ4OTAA",
        templateName: "pi_commerce_welcome_pack",
        language: "Hindi",
        voiceNoteSent: false
      }
    ]
  },
  {
    caseId: "1439868584",
    merchantName: "Dhruv Tyagi (Tyagi Solutions)",
    merchantPhone: "+917976671584",
    cleanPhone: "917976671584",
    assignedTo: "Akash Kumar",
    dateOfSale: "2026-10-22",
    currentStatus: "Not Connected",
    subStatus: "Busy",
    statusCategory: "active_not_cancelled",
    queueCategory: "ALL OPEN",
    plan: "Platinum - ₹14,999",
    planTier: "Platinum",
    planPrice: "₹14,999",
    credits: "₹18,000",
    expiry: "2026-11-22",
    lastDisposition: "Not Connected",
    lastSubStatus: "Busy",
    lastRemark: "Merchant was on another call, automated WhatsApp message dispatched.",
    callbackSchedule: null,
    preferredLanguage: "Hindi",
    timeline: [
      {
        id: "log-201",
        timestamp: "29 Oct, 4:15 pm",
        date: "2026-10-29T16:15:00+05:30",
        agentName: "Akash Kumar",
        status: "Not Connected",
        subStatus: "Busy",
        remark: "Customer was on another call. WhatsApp onboarding catalog dispatched.",
        whatsappTriggered: true,
        whatsappStatus: "Delivered",
        whatsappMessageId: "wamid.HBgMOTE3OTc2NjcxNTg0FQIAERgS",
        templateName: "pi_commerce_onboarding_rnr",
        language: "Hindi",
        voiceNoteSent: true,
        voiceNoteTitle: "Hindi Onboarding Introduction Note"
      },
      {
        id: "log-200",
        timestamp: "22 Oct, 10:00 am",
        date: "2026-10-22T10:00:00+05:30",
        agentName: "Akash Kumar",
        status: "New",
        subStatus: "Lead Assignment",
        remark: "Lead onboarded. Platinum Plan (₹14,999) + ₹18,000 ad credits. Assigned to Akash Kumar.",
        whatsappTriggered: true,
        whatsappStatus: "Read",
        whatsappMessageId: "wamid.HBgMOTE3OTc2NjcxNTg0FQIAERgSRDM2Qzk5QjE2NTQ4NEQ4OTAA",
        templateName: "pi_commerce_welcome_pack",
        language: "Hindi",
        voiceNoteSent: false
      }
    ]
  },
  {
    caseId: "1439868757",
    merchantName: "Harsh (Harsh Retail)",
    merchantPhone: "+919996496757",
    cleanPhone: "919996496757",
    assignedTo: "Akash Kumar",
    dateOfSale: "2026-10-25",
    currentStatus: "Not Connected",
    subStatus: "Switched Off",
    statusCategory: "active_not_cancelled",
    queueCategory: "ALL OPEN",
    plan: "Silver - ₹1,999",
    planTier: "Silver",
    planPrice: "₹1,999",
    credits: "₹2,000",
    expiry: "2026-11-25",
    lastDisposition: "Not Connected",
    lastSubStatus: "Switched Off",
    lastRemark: "Phone switched off. Regional voice note and WhatsApp message dispatched.",
    callbackSchedule: null,
    preferredLanguage: "Hindi",
    timeline: [
      {
        id: "log-301",
        timestamp: "29 Oct, 6:30 pm",
        date: "2026-10-29T18:30:00+05:30",
        agentName: "Akash Kumar",
        status: "Not Connected",
        subStatus: "Switched Off",
        remark: "Phone switched off. Regional voice note and WhatsApp message dispatched.",
        whatsappTriggered: true,
        whatsappStatus: "Sent",
        whatsappMessageId: "wamid.HBgMOTE5OTk2NDk2NzU3FQIAERgS",
        templateName: "pi_commerce_onboarding_rnr",
        language: "Hindi",
        voiceNoteSent: true,
        voiceNoteTitle: "Hindi Onboarding Introduction Note"
      },
      {
        id: "log-300",
        timestamp: "25 Oct, 3:00 pm",
        date: "2026-10-25T15:00:00+05:30",
        agentName: "Akash Kumar",
        status: "New",
        subStatus: "Lead Assignment",
        remark: "Lead onboarded. Silver Plan (₹1,999) + ₹2,000 ad credits. Assigned to Akash Kumar.",
        whatsappTriggered: true,
        whatsappStatus: "Read",
        whatsappMessageId: "wamid.HBgMOTE5OTk2NDk2NzU3FQIAERgSRDM2Qzk5QjE2NTQ4NEQ4OTAA",
        templateName: "pi_commerce_welcome_pack",
        language: "Hindi",
        voiceNoteSent: false
      }
    ]
  }
];

class Store {
  constructor() {
    this.cases = [];
    this.init();
  }

  init() {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf8');
        this.cases = JSON.parse(raw);
      } else {
        this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
        this.save();
      }
    } catch (err) {
      console.warn('Could not load data file, falling back to in-memory initial data', err.message);
      this.cases = JSON.parse(JSON.stringify(INITIAL_CASES));
    }
  }

  save() {
    try {
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.cases, null, 2), 'utf8');
    } catch (err) {
      console.error('Failed to save store to file:', err.message);
    }
  }

  getCases({ filter = 'all', search = '', queue = '' } = {}) {
    let result = [...this.cases];

    // Filter by tab:
    // 'all'
    // 'active_not_cancelled' (Active, not cancelled/expired)
    // 'active_cancelled' (Active, cancelled/expired)
    if (filter === 'active_not_cancelled') {
      result = result.filter(c => c.statusCategory === 'active_not_cancelled');
    } else if (filter === 'active_cancelled') {
      result = result.filter(c => c.statusCategory === 'active_cancelled');
    }

    // Filter by queue card if clicked:
    if (queue) {
      const qUpper = queue.toUpperCase().trim();
      if (qUpper === 'ALL OPEN') {
        result = result.filter(c => c.currentStatus !== 'Connected' && c.currentStatus !== 'Not Interested');
      } else if (qUpper === 'NEW') {
        result = result.filter(c => c.queueCategory === 'NEW' || c.currentStatus === 'New');
      } else if (qUpper === 'CALLBACKS TODAY') {
        result = result.filter(c => c.queueCategory === 'CALLBACKS TODAY' || (c.currentStatus === 'Callback' && c.callbackSchedule));
      } else if (qUpper === 'OVERDUE') {
        result = result.filter(c => c.queueCategory === 'OVERDUE');
      } else if (qUpper === 'OPEN TECHNICAL') {
        result = result.filter(c => c.queueCategory === 'OPEN TECHNICAL' || c.currentStatus === 'Technical Issue');
      } else if (qUpper === 'AGEING OPEN') {
        result = result.filter(c => c.queueCategory === 'AGEING OPEN');
      } else if (qUpper === 'COMPLETED') {
        result = result.filter(c => c.queueCategory === 'COMPLETED' || c.currentStatus === 'Connected');
      } else if (qUpper === 'REQ CALL BACK') {
        result = result.filter(c => c.queueCategory === 'REQ CALL BACK');
      }
    }

    // Filter by search query (Merchant name, Case ID, Phone ID)
    if (search && search.trim()) {
      const term = search.toLowerCase().trim();
      result = result.filter(c =>
        c.merchantName.toLowerCase().includes(term) ||
        c.caseId.includes(term) ||
        c.cleanPhone.includes(term) ||
        c.merchantPhone.includes(term)
      );
    }

    return result;
  }

  getCaseById(caseId) {
    return this.cases.find(c => c.caseId === String(caseId)) || null;
  }

  getMetrics() {
    // Work Queue Metrics:
    // NEW, CALLBACKS TODAY, OVERDUE, OPEN TECHNICAL, AGEING OPEN, ALL OPEN, COMPLETED, REQ CALL BACK
    let newCount = 0;
    let callbacksTodayCount = 0;
    let overdueCount = 0;
    let openTechnicalCount = 0;
    let ageingOpenCount = 0;
    let allOpenCount = 0;
    let completedCount = 0;
    let reqCallBackCount = 0;

    for (const c of this.cases) {
      if (c.queueCategory === 'NEW' || c.currentStatus === 'New') newCount++;
      if (c.queueCategory === 'CALLBACKS TODAY' || (c.currentStatus === 'Callback' && c.callbackSchedule)) callbacksTodayCount++;
      if (c.queueCategory === 'OVERDUE') overdueCount++;
      if (c.queueCategory === 'OPEN TECHNICAL' || c.currentStatus === 'Technical Issue') openTechnicalCount++;
      if (c.queueCategory === 'AGEING OPEN') ageingOpenCount++;
      if (c.currentStatus !== 'Connected' && c.currentStatus !== 'Not Interested') allOpenCount++;
      if (c.queueCategory === 'COMPLETED' || c.currentStatus === 'Connected') completedCount++;
      if (c.queueCategory === 'REQ CALL BACK') reqCallBackCount++;
    }

    return {
      NEW: newCount,
      "CALLBACKS TODAY": callbacksTodayCount,
      OVERDUE: overdueCount,
      "OPEN TECHNICAL": openTechnicalCount,
      "AGEING OPEN": ageingOpenCount,
      "ALL OPEN": allOpenCount,
      COMPLETED: completedCount,
      "REQ CALL BACK": reqCallBackCount
    };
  }

  addDisposition({
    caseId,
    merchantPhone,
    merchantName,
    disposition,
    subStatus,
    language = "Hindi",
    pack = "Silver",
    agentName = "Akash Kumar",
    remark = "",
    callbackTime = null,
    whatsappDetails = null
  }) {
    let target = this.getCaseById(caseId);
    if (!target) {
      // Create fresh case record if not present
      target = {
        caseId: String(caseId),
        merchantName: merchantName || `Merchant ${caseId}`,
        merchantPhone: merchantPhone.startsWith('+') ? merchantPhone : `+${merchantPhone}`,
        cleanPhone: merchantPhone.replace(/\D/g, ''),
        assignedTo: agentName,
        dateOfSale: new Date().toISOString().split('T')[0],
        currentStatus: disposition,
        subStatus: subStatus || "Active",
        statusCategory: "active_cancelled",
        queueCategory: "ALL OPEN",
        plan: `${pack} - ₹1,999`,
        planTier: pack,
        planPrice: "₹1,999",
        credits: "₹2,000",
        expiry: "2026-11-14",
        timeline: []
      };
      this.cases.unshift(target);
    }

    // Format formatted timestamp e.g. "30 Oct, 2:15 pm"
    const now = new Date();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    let hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const formattedTimestamp = `${now.getDate()} ${months[now.getMonth()]}, ${hours}:${minutes} ${ampm}`;

    // Update case state
    target.currentStatus = disposition;
    target.lastDisposition = disposition;
    target.lastSubStatus = subStatus;
    target.lastRemark = remark;
    target.preferredLanguage = language;
    if (callbackTime) {
      target.callbackSchedule = callbackTime;
      target.queueCategory = "CALLBACKS TODAY";
    } else if (disposition === 'Connected') {
      target.queueCategory = "COMPLETED";
    } else if (disposition === 'Technical Issue') {
      target.queueCategory = "OPEN TECHNICAL";
    }

    const isWaTriggered = Boolean(whatsappDetails?.triggered);

    const logEntry = {
      id: `log-${Date.now()}`,
      timestamp: formattedTimestamp,
      date: now.toISOString(),
      agentName: agentName,
      status: disposition,
      subStatus: subStatus,
      remark: remark || (disposition === 'Not Connected' 
        ? (isWaTriggered 
            ? "Customer didn't answer. Automated WhatsApp onboarding message & regional voice note dispatched." 
            : "Customer didn't answer (RNR). Disposition logged.") 
        : `Disposition: ${disposition} (${subStatus})`),
      whatsappTriggered: isWaTriggered,
      whatsappStatus: isWaTriggered ? (whatsappDetails?.status || "Delivered") : null,
      whatsappMessageId: isWaTriggered ? (whatsappDetails?.messageId || `wamid.HBgM${target.cleanPhone}FQIAERgS`) : null,
      templateName: isWaTriggered ? (whatsappDetails?.templateName || "pi_commerce_onboarding_rnr") : null,
      language: language,
      voiceNoteSent: isWaTriggered && Boolean(whatsappDetails?.voiceNoteSent),
      voiceNoteTitle: (isWaTriggered && whatsappDetails?.voiceNoteSent) ? (whatsappDetails?.voiceNoteTitle || `${language} Onboarding Audio Guide`) : null,
      voiceNoteUrl: (isWaTriggered && whatsappDetails?.voiceNoteSent) ? (whatsappDetails?.voiceNoteUrl || null) : null,
      metaResponse: whatsappDetails?.metaResponse || null
    };

    target.timeline.unshift(logEntry);
    this.save();

    return {
      caseItem: target,
      logEntry,
      metrics: this.getMetrics()
    };
  }

  updateWhatsAppStatus(messageId, status) {
    for (const c of this.cases) {
      for (const item of c.timeline) {
        if (item.whatsappMessageId === messageId) {
          item.whatsappStatus = status;
          this.save();
          return { caseId: c.caseId, logId: item.id, status };
        }
      }
    }
    return null;
  }
}

export const store = new Store();
