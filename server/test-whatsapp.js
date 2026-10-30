import { store } from './data/store.js';
import { 
  triggerOnboardingAutomation, 
  buildTemplatePayload, 
  buildAudioPayload 
} from './services/whatsappService.js';

async function runTests() {
  console.log('🧪 Starting Pi Commerce Backend & WhatsApp Integration Test Suite...\n');

  // Test 1: Store Initialization & Metrics
  console.log('1️⃣ Checking Initial Work Queue Metrics...');
  const initialMetrics = store.getMetrics();
  console.log('Initial Metrics:', initialMetrics);
  if (initialMetrics['ALL OPEN'] > 0) {
    console.log('✅ Metrics loaded correctly.\n');
  } else {
    throw new Error('Metrics verification failed');
  }

  // Test 2: Verify Initial Priority Test Case
  console.log('2️⃣ Verifying Priority Target Case Manu Agarwal (#1439868101)...');
  const targetCase = store.getCaseById('1439868101');
  if (!targetCase) {
    throw new Error('Target case 1439868101 not found');
  }
  console.log(`Found: ${targetCase.merchantName} | Phone: ${targetCase.merchantPhone} | Plan: ${targetCase.plan}`);
  console.log(`Existing Timeline entries: ${targetCase.timeline.length}`);
  console.log('✅ Target case verified.\n');

  // Test 3: Build Meta WhatsApp Template Payload
  console.log('3️⃣ Building Meta WhatsApp Cloud API Template Payload...');
  const templatePayload = buildTemplatePayload({
    recipientPhone: "919873141101",
    merchantName: "Manu Agarwal (Manu Enterprises)",
    agentName: "Akash Kumar",
    pack: "Gold",
    language: "Hindi"
  });
  console.log('Template Payload for Meta API:', JSON.stringify(templatePayload, null, 2));
  if (templatePayload.messaging_product === 'whatsapp' && templatePayload.template.name === 'pi_commerce_onboarding_rnr') {
    console.log('✅ Meta Cloud API Template Payload correctly structured.\n');
  } else {
    throw new Error('Template payload format error');
  }

  // Test 4: Build Meta WhatsApp Audio Payload (Regional Voice Note)
  console.log('4️⃣ Building Meta WhatsApp Audio Payload (Regional Voice Note)...');
  const audioPayload = buildAudioPayload({
    recipientPhone: "919873141101",
    language: "Hindi"
  });
  console.log('Audio Payload for Meta API:', JSON.stringify(audioPayload, null, 2));
  if (audioPayload.type === 'audio' && audioPayload.audio.link.includes('.mp3')) {
    console.log('✅ Meta Cloud API Audio Payload correctly structured.\n');
  } else {
    throw new Error('Audio payload format error');
  }

  // Test 5: Trigger Automation Pipeline
  console.log('5️⃣ Triggering Automation Pipeline...');
  const automationResult = await triggerOnboardingAutomation({
    recipientPhone: "919873141101",
    merchantName: "Manu Agarwal (Manu Enterprises)",
    agentName: "Akash Kumar",
    pack: "Gold",
    language: "Hindi",
    disposition: "Not Connected",
    subStatus: "RNR"
  });
  console.log('Automation Result:', JSON.stringify(automationResult, null, 2));
  console.log('✅ Automation pipeline executed with Message ID:', automationResult.messageId);

  // Test 6: Submit Disposition
  console.log('\n6️⃣ Submitting Disposition via Store...');
  const submissionResult = store.addDisposition({
    caseId: "1439868101",
    merchantPhone: "919873141101",
    merchantName: "Manu Agarwal (Manu Enterprises)",
    disposition: "Not Connected",
    subStatus: "RNR",
    language: "Hindi",
    pack: "Gold",
    agentName: "Akash Kumar",
    remark: "Customer disconnected call on first ring. Automated WhatsApp Onboarding Template and Regional Hindi Voice Note triggered successfully.",
    whatsappDetails: automationResult
  });

  console.log(`New Timeline count: ${submissionResult.caseItem.timeline.length}`);
  const latestEntry = submissionResult.caseItem.timeline[0];
  console.log('Latest Timeline Entry:', {
    timestamp: latestEntry.timestamp,
    agent: latestEntry.agentName,
    status: latestEntry.status,
    subStatus: latestEntry.subStatus,
    whatsappStatus: latestEntry.whatsappStatus,
    whatsappMessageId: latestEntry.whatsappMessageId,
    voiceNoteTitle: latestEntry.voiceNoteTitle
  });

  if (latestEntry.status === 'Not Connected' && latestEntry.subStatus === 'RNR' && latestEntry.agentName === 'Akash Kumar') {
    console.log('✅ Disposition submitted and recorded in timeline successfully with agent Akash Kumar!\n');
  } else {
    throw new Error('Disposition submission record mismatch');
  }

  console.log('🎉 ALL BACKEND & WHATSAPP INTEGRATION TESTS PASSED!');
}

runTests().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
