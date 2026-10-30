import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '5000', 10),
  meta: {
    token: process.env.WHATSAPP_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    businessAccountId: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
    webhookVerifyToken: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'pi_commerce_secret_webhook_verify_2026',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    graphBaseUrl: 'https://graph.facebook.com'
  },
  twilio: {
    accountSid: process.env.TWILIO_ACCOUNT_SID || 'AC_TEMPORARY_TEST_SID',
    authToken: process.env.TWILIO_AUTH_TOKEN || 'TEMPORARY_AUTH_TOKEN',
    fromNumber: process.env.TWILIO_WHATSAPP_NUMBER || 'whatsapp:+17372508034'
  },
  audioBaseUrl: process.env.AUDIO_BASE_URL || 'http://localhost:5000/audio'
};

// Allow runtime override for testing
export function updateMetaConfig({ token, phoneNumberId, businessAccountId, webhookVerifyToken }) {
  if (token !== undefined) config.meta.token = token.trim();
  if (phoneNumberId !== undefined) config.meta.phoneNumberId = phoneNumberId.trim();
  if (businessAccountId !== undefined) config.meta.businessAccountId = businessAccountId.trim();
  if (webhookVerifyToken !== undefined) config.meta.webhookVerifyToken = webhookVerifyToken.trim();
  return { ...config.meta, token: config.meta.token ? `${config.meta.token.slice(0, 6)}...${config.meta.token.slice(-4)}` : '' };
}

export function updateTwilioConfig({ accountSid, authToken, fromNumber }) {
  if (accountSid !== undefined) config.twilio.accountSid = accountSid.trim();
  if (authToken !== undefined) config.twilio.authToken = authToken.trim();
  if (fromNumber !== undefined) config.twilio.fromNumber = fromNumber.trim();
  return {
    accountSid: config.twilio.accountSid ? `${config.twilio.accountSid.slice(0, 6)}...${config.twilio.accountSid.slice(-4)}` : '',
    fromNumber: config.twilio.fromNumber,
    hasAuthToken: Boolean(config.twilio.authToken && config.twilio.authToken !== 'TEMPORARY_AUTH_TOKEN')
  };
}

