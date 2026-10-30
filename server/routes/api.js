import express from 'express';
import { store } from '../data/store.js';
import { 
  triggerOnboardingAutomation, 
  sendToMetaCloudApi, 
  sendViaTwilio,
  buildTemplatePayload, 
  buildAudioPayload, 
  buildRegionalReminderText,
  REGIONAL_ASSETS 
} from '../services/whatsappService.js';
import { config, updateMetaConfig, updateTwilioConfig } from '../config.js';

const router = express.Router();

/**
 * 1. POST /api/dispositions/submit
 * Core requirement: Submits disposition, updates case state, and triggers Meta WhatsApp Cloud API automation
 */
router.post('/dispositions/submit', async (req, res) => {
  try {
    const {
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
      sendWhatsApp = true
    } = req.body;

    if (!caseId || !merchantPhone || !disposition) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields: caseId, merchantPhone, and disposition are mandatory."
      });
    }

    console.log(`[POST /api/dispositions/submit] Received disposition for Case #${caseId} (${merchantName}): ${disposition} / ${subStatus}`);

    let whatsappResult = null;
    // Only dispatch WhatsApp automation when sendWhatsApp is explicitly true (Button 2)
    const shouldSendWhatsApp = Boolean(sendWhatsApp === true || sendWhatsApp === 'true');

    if (shouldSendWhatsApp) {
      try {
        const existingCase = store.getCaseById(caseId);
        whatsappResult = await triggerOnboardingAutomation({
          recipientPhone: merchantPhone,
          merchantName: merchantName || existingCase?.merchantName || "Merchant Partner",
          agentName: agentName || "Akash Kumar",
          pack: pack || existingCase?.plan || "Silver",
          language: language || "Hindi",
          disposition,
          subStatus,
          expiryDate: req.body.expiryDate || existingCase?.expiry || "2026-11-20"
        });
      } catch (waErr) {
        console.error('[WhatsApp Trigger Error]:', waErr);
        whatsappResult = {
          triggered: true,
          status: "Error",
          error: waErr.message
        };
      }
    }

    // Add to Store & compute updated metrics
    const result = store.addDisposition({
      caseId,
      merchantPhone,
      merchantName,
      disposition,
      subStatus,
      language,
      pack,
      agentName,
      remark,
      callbackTime,
      whatsappDetails: whatsappResult
    });

    return res.status(200).json({
      success: true,
      message: "Disposition submitted & automation processed successfully",
      case: result.caseItem,
      timelineEntry: result.logEntry,
      metrics: result.metrics,
      whatsapp: whatsappResult
    });

  } catch (error) {
    console.error('Error submitting disposition:', error);
    return res.status(500).json({
      success: false,
      error: error.message || "Internal server error submitting disposition"
    });
  }
});

/**
 * 2. GET /api/cases
 * List cases with filters: all, active_not_cancelled, active_cancelled, plus search and queue card filters
 */
router.get('/cases', (req, res) => {
  const { filter = 'all', search = '', queue = '' } = req.query;
  const cases = store.getCases({ filter, search, queue });
  res.json({
    success: true,
    count: cases.length,
    cases
  });
});

/**
 * 3. GET /api/cases/:id
 * Retrieve individual case details + full chronological history
 */
router.get('/cases/:id', (req, res) => {
  const found = store.getCaseById(req.params.id);
  if (!found) {
    return res.status(404).json({ success: false, error: "Case not found" });
  }
  res.json({ success: true, case: found });
});

/**
 * 4. GET /api/metrics
 * Work Queue Metrics: NEW, CALLBACKS TODAY, OVERDUE, OPEN TECHNICAL, AGEING OPEN, ALL OPEN, COMPLETED, REQ CALL BACK
 */
router.get('/metrics', (req, res) => {
  const metrics = store.getMetrics();
  res.json({ success: true, metrics });
});

/**
 * 5. GET /api/whatsapp/config
 * Check current WhatsApp Meta integration state
 */
router.get('/whatsapp/config', (req, res) => {
  const isMetaConfigured = Boolean(
    config.meta.token && 
    config.meta.phoneNumberId && 
    config.meta.token !== 'YOUR_WHATSAPP_TOKEN' &&
    !config.meta.token.startsWith('mock_')
  );

  const isTwilioProvided = Boolean(
    config.twilio.accountSid &&
    config.twilio.authToken
  );

  const isTwilioActive = !isMetaConfigured && isTwilioProvided;

  res.json({
    success: true,
    configured: isMetaConfigured || isTwilioActive,
    provider: isMetaConfigured ? "meta" : (isTwilioActive ? "twilio" : "simulator"),
    mode: isMetaConfigured ? "LIVE_META_API" : (isTwilioActive ? "TWILIO_SANDBOX" : "SIMULATION_SANDBOX"),
    isTwilioMode: isTwilioActive,
    meta: {
      phoneNumberId: config.meta.phoneNumberId ? `${config.meta.phoneNumberId.slice(0, 4)}...${config.meta.phoneNumberId.slice(-3)}` : 'Not set',
      businessAccountId: config.meta.businessAccountId ? `${config.meta.businessAccountId.slice(0, 4)}...` : 'Not set',
      apiVersion: config.meta.apiVersion
    },
    twilio: {
      accountSid: config.twilio.accountSid ? `${config.twilio.accountSid.slice(0, 6)}...${config.twilio.accountSid.slice(-4)}` : 'Not set',
      fromNumber: config.twilio.fromNumber,
      isTemporary: config.twilio.accountSid === 'AC_TEMPORARY_TEST_SID'
    },
    languages: Object.keys(REGIONAL_ASSETS)
  });
});

/**
 * 6. POST /api/whatsapp/config
 * Update WhatsApp credentials at runtime (Meta or Twilio)
 */
router.post('/whatsapp/config', (req, res) => {
  const { 
    token, 
    phoneNumberId, 
    businessAccountId, 
    webhookVerifyToken,
    twilioAccountSid,
    twilioAuthToken,
    twilioFromNumber
  } = req.body;

  const updatedMeta = updateMetaConfig({ token, phoneNumberId, businessAccountId, webhookVerifyToken });
  let updatedTwilio = null;
  if (twilioAccountSid !== undefined || twilioAuthToken !== undefined || twilioFromNumber !== undefined) {
    updatedTwilio = updateTwilioConfig({ 
      accountSid: twilioAccountSid, 
      authToken: twilioAuthToken, 
      fromNumber: twilioFromNumber 
    });
  }

  res.json({
    success: true,
    message: "WhatsApp credentials updated",
    meta: updatedMeta,
    twilio: updatedTwilio || { accountSid: config.twilio.accountSid, fromNumber: config.twilio.fromNumber }
  });
});

/**
 * 7. POST /api/whatsapp/test-send
 * Direct test sender to verify credentials or inspect payload
 */
router.post('/whatsapp/test-send', async (req, res) => {
  try {
    const {
      phone = "919873141101",
      merchantName = "Manu Agarwal (Manu Enterprises)",
      agentName = "Akash Kumar",
      pack = "Gold - ₹4,999",
      language = "Hindi",
      type = "template" // "template" or "audio"
    } = req.body;

    const isMetaConfigured = Boolean(
      config.meta.token && 
      config.meta.phoneNumberId && 
      config.meta.token !== 'YOUR_WHATSAPP_TOKEN' &&
      !config.meta.token.startsWith('mock_')
    );

    const isTwilioActive = !isMetaConfigured && Boolean(config.twilio.accountSid && config.twilio.authToken);

    if (isTwilioActive) {
      const audioBaseUrl = process.env.AUDIO_BASE_URL || config.audioBaseUrl || 'http://localhost:5000/audio';
      const cleanAudioUrl = `${audioBaseUrl}/voice_note_${language.toLowerCase()}_onboarding.mp3`;

      const twilioResult = await sendViaTwilio({
        recipientPhone: phone,
        merchantName,
        planName: pack,
        expiryDate: "2026-11-20",
        audioUrl: cleanAudioUrl,
        language
      });

      return res.json({
        success: true,
        provider: "twilio",
        result: twilioResult
      });
    }

    let payload;
    if (type === 'audio') {
      payload = buildAudioPayload({ recipientPhone: phone, language });
    } else {
      payload = buildTemplatePayload({
        recipientPhone: phone,
        merchantName,
        agentName,
        pack,
        language
      });
    }

    const result = await sendToMetaCloudApi(payload);
    res.json({
      success: true,
      provider: "meta",
      result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * 8. Meta Webhook Verification & Events
 */
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === config.meta.webhookVerifyToken) {
    console.log('[Meta Webhook] Successfully verified challenge handshake');
    return res.status(200).send(challenge);
  }
  console.warn('[Meta Webhook] Verification token mismatch');
  return res.sendStatus(403);
});

router.post('/webhook', (req, res) => {
  try {
    const body = req.body;
    console.log('[Meta Webhook] Received webhook event:', JSON.stringify(body, null, 2));

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const change = entry?.changes?.[0]?.value;

      // Handle delivery status update (sent, delivered, read, failed)
      if (change?.statuses?.[0]) {
        const statusObj = change.statuses[0];
        const messageId = statusObj.id;
        const status = statusObj.status; // sent, delivered, read
        console.log(`[Meta Webhook] Status update for message ${messageId} -> ${status}`);
        store.updateWhatsAppStatus(messageId, status.charAt(0).toUpperCase() + status.slice(1));
      }

      // Handle incoming reply / quick reply click
      if (change?.messages?.[0]) {
        const msg = change.messages[0];
        const from = msg.from;
        if (msg.type === 'button' && msg.button?.payload === 'SCHEDULE_CALLBACK') {
          console.log(`[Meta Webhook] Merchant ${from} clicked SCHEDULE_CALLBACK!`);
        }
      }

      return res.status(200).send('EVENT_RECEIVED');
    }

    res.sendStatus(404);
  } catch (err) {
    console.error('[Meta Webhook Error]:', err);
    res.sendStatus(500);
  }
});

export default router;

