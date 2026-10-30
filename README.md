# Pi Commerce · Onboarding Workspace

Production-ready Full-Stack Web Application and API Service for **Pi Commerce - Onboarding Workspace**, engineered to integrate seamlessly with **Meta's Official WhatsApp Business Cloud API (v18.0)**.

---

## 🌟 Key Features

### 1. Pixel-Perfect Pi Commerce Workspace UI
- **Dark Navy Header**: Branded header titled `Pi Commerce · Onboarding Workspace`, with User Badge `Akash Kumar` (Online Status), live Meta WhatsApp API status indicator, and Logout action.
- **Top Work Queue Metrics Grid**: 8 responsive, interactive cards with real-time counters:
  1. `NEW`
  2. `CALLBACKS TODAY`
  3. `OVERDUE`
  4. `OPEN TECHNICAL`
  5. `AGEING OPEN`
  6. `ALL OPEN`
  7. `COMPLETED`
  8. `REQ CALL BACK`
  *(Clicking any metric card filters the merchant cases queue in real-time).*
- **Filter Tabs & Search**:
  - Filter Tabs: `All`, `Active (not cancelled/expired)`, `Active (cancelled/expired)`.
  - Instant Search Bar: Query by Merchant Name, Phone ID (+91), or Customer ID.
- **Left Sidebar (Technical Case List)**:
  - Default Case: **SYAN ELECTRONICS**, Customer ID: `1439868655`, Plan: `Silver - ₹1,999`, Credits: `₹2,000`.
  - Additional realistic merchant cases across diverse statuses and plans.
- **Main Panel (CASE VIEW)**:
  - **Merchant**: `SYAN ELECTRONICS` | **Customer ID**: `1439868655` | **Phone**: `+91 9877585378`
  - **Assigned To**: `Akash Kumar` | **Date of Sale**: `2026-10-15` | **Current Status**: `Not Connected`
  - **Plan**: `Silver - ₹1,999` | **Credits**: `₹2,000` | **Sub Status**: `Active, cancelled` | **Expiry**: `2026-11-14`
  - Quick action toolbar: Direct WhatsApp click-to-chat, phone call trigger, and copy actions.
- **Disposition Action Panel (Top of History)**:
  - **Primary Disposition**: `[Connected, Not Connected, Callback, Technical Issue, Face-to-Face, Not Interested]`
  - **Sub-Status / Issue**: Dynamic contextual issues:
    - *Not Connected*: `RNR`, `Busy`, `Switch Off`, `Call Disconnected`, `Invalid Number`, `Network Issue`
    - *Callback*: `Busy`, `Requested Callback`, `Showroom Rush`, `Owner Traveling`, `Evening Slot`
    - *Technical Issue*: `Facebook Login Issue`, `Ad Setup Pending`, `Catalog Sync Error`, `Domain Verification Failed`, `Meta 2FA Blocked`
    - *Connected*: `Onboarding Completed`, `Ad Campaign Launched`, `WhatsApp Business API Connected`
  - **Callback Scheduler**: Integrated datetime picker visible when `Callback` is selected.
  - **Regional Language Selector**: Supports `Hindi` (Default), `English`, `Hinglish`, `Marathi`, `Gujarati`, `Tamil`, `Telugu`.
  - **Manual Remark**: Textarea with 1-click quick remark snippets.
  - **WhatsApp Automation Toggle**: `"Auto-Send WhatsApp Onboarding Template & Regional Voice Note"` (Checked by default for `Not Connected` and `Callback`).
  - **Regional Voice Note Player**: Preview and listen to regional audio voice notes directly inside the application.
  - **Action Button**: `"Submit Disposition & Trigger Automation"`.
- **Chronological History Timeline Section**:
  - Vertical audit log cards with bullet nodes:
    - Example: `18 Oct, 3:24 pm - Rohit Sharma` | Status: `Not Connected` | Sub-status: `RNR` | Remark: `Didn't Pick Up the Call WhatsApp Message already shared`
    - Real-time WhatsApp delivery indicators (Sent, Delivered with double checks, Read with double blue checks).
    - Meta Message ID badge (`wamid.HBg...`) with 1-click clipboard copy.
    - Regional Voice Note dispatch badge with audio playback.
  - Dynamic behavior: Submitting a new disposition immediately appends a new card to the timeline in real-time, increments queue metrics, and updates the merchant record.

---

## 🛠️ Meta WhatsApp Business Cloud API Backend Architecture

### Environment Configuration (`.env`)
```ini
PORT=5000
WHATSAPP_TOKEN=EAAG...your_system_user_token
WHATSAPP_PHONE_NUMBER_ID=104928189481928
WHATSAPP_BUSINESS_ACCOUNT_ID=109283746192837
WHATSAPP_WEBHOOK_VERIFY_TOKEN=pi_commerce_secret_webhook_verify_2026
WHATSAPP_API_VERSION=v18.0
AUDIO_BASE_URL=https://assets.picommerce.in/audio
```

> **Sandbox / Simulator Mode**: If `WHATSAPP_TOKEN` is not yet configured, the service runs in **Developer Sandbox Simulator Mode**. It generates realistic `wamid.HBg...` Meta IDs, logs the complete `curl` equivalent and JSON request payload, and creates timeline audit logs seamlessly without failing. You can plug in live credentials anytime via the UI Settings modal or `.env`.

---

## 🚀 API Endpoints

### 1. `POST /api/dispositions/submit`
Submits merchant disposition and dispatches Meta WhatsApp Cloud API automation.

**Payload:**
```json
{
  "caseId": "1439868655",
  "merchantPhone": "919877585378",
  "merchantName": "SYAN ELECTRONICS",
  "disposition": "Not Connected",
  "subStatus": "RNR",
  "language": "Hindi",
  "pack": "Silver",
  "agentName": "Akash Kumar",
  "remark": "Customer didn't answer. Dispatched regional onboarding kit.",
  "callbackTime": null,
  "sendWhatsApp": true
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Disposition submitted & automation processed successfully",
  "case": {
    "caseId": "1439868655",
    "merchantName": "SYAN ELECTRONICS",
    "currentStatus": "Not Connected",
    "timeline": [ ... ]
  },
  "timelineEntry": {
    "id": "log-1793306859534",
    "timestamp": "30 Oct, 2:17 am",
    "agentName": "Akash Kumar",
    "status": "Not Connected",
    "subStatus": "RNR",
    "whatsappTriggered": true,
    "whatsappStatus": "Delivered",
    "whatsappMessageId": "wamid.HBgM919877585378FQIAERgSA9FF0BE8E8DA1CDB281DD54FA",
    "templateName": "pi_commerce_onboarding_rnr",
    "voiceNoteSent": true,
    "voiceNoteTitle": "Hindi Voice Note · Onboarding Introduction & Next Steps"
  },
  "metrics": {
    "NEW": 1,
    "CALLBACKS TODAY": 2,
    "OVERDUE": 1,
    "OPEN TECHNICAL": 1,
    "AGEING OPEN": 1,
    "ALL OPEN": 7,
    "COMPLETED": 1,
    "REQ CALL BACK": 1
  }
}
```

### 2. Meta WhatsApp Cloud API Dispatch Format
Target endpoint:
```
POST https://graph.facebook.com/v18.0/{PHONE_NUMBER_ID}/messages
Authorization: Bearer {WHATSAPP_TOKEN}
Content-Type: application/json
```

**Template Payload:**
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "919877585378",
  "type": "template",
  "template": {
    "name": "pi_commerce_onboarding_rnr",
    "language": {
      "code": "hi"
    },
    "components": [
      {
        "type": "header",
        "parameters": [
          { "type": "text", "text": "SYAN ELECTRONICS" }
        ]
      },
      {
        "type": "body",
        "parameters": [
          { "type": "text", "text": "SYAN ELECTRONICS" },
          { "type": "text", "text": "Silver Plan" },
          { "type": "text", "text": "Akash Kumar" }
        ]
      },
      {
        "type": "button",
        "sub_type": "quick_reply",
        "index": "0",
        "parameters": [
          { "type": "payload", "payload": "SCHEDULE_CALLBACK" }
        ]
      }
    ]
  }
}
```

**Regional Voice Note Payload:**
```json
{
  "messaging_product": "whatsapp",
  "recipient_type": "individual",
  "to": "919877585378",
  "type": "audio",
  "audio": {
    "link": "https://assets.picommerce.in/audio/voice_note_hindi_onboarding.mp3"
  }
}
```

### 3. Webhook Endpoints
- `GET /api/webhook`: Meta Webhook challenge verification (`hub.mode`, `hub.verify_token`, `hub.challenge`).
- `POST /api/webhook`: Delivery status receipts (`sent`, `delivered`, `read`) and incoming interactive button click events.

---

## 🏃 Running the Application

### Production Run (Frontend + Backend on single port 5000):
```bash
npm start
```
Open [http://localhost:5000](http://localhost:5000) in your web browser.

### Run Integration Test Suite:
```bash
npm test
```
*(Runs full test suite verifying Work Queue metrics, case lookups, Meta Cloud API template construction, audio payload generation, automation triggers, and timeline persistence).*

