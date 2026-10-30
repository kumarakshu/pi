const API_BASE = '/api';

export async function fetchMetrics() {
  const res = await fetch(`${API_BASE}/metrics`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  const data = await res.json();
  return data.metrics;
}

export async function fetchCases({ filter = 'all', search = '', queue = '' } = {}) {
  const params = new URLSearchParams();
  if (filter && filter !== 'all') params.append('filter', filter);
  if (search) params.append('search', search);
  if (queue) params.append('queue', queue);

  const res = await fetch(`${API_BASE}/cases?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch cases');
  const data = await res.json();
  return data.cases;
}

export async function fetchCaseById(caseId) {
  const res = await fetch(`${API_BASE}/cases/${caseId}`);
  if (!res.ok) throw new Error('Failed to fetch case detail');
  const data = await res.json();
  return data.case;
}

export async function submitDisposition(payload) {
  const res = await fetch(`${API_BASE}/dispositions/submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to submit disposition');
  }
  return await res.json();
}

export async function fetchWhatsAppConfig() {
  const res = await fetch(`${API_BASE}/whatsapp/config`);
  if (!res.ok) throw new Error('Failed to fetch WhatsApp config');
  return await res.json();
}

export async function updateWhatsAppConfig(configData) {
  const res = await fetch(`${API_BASE}/whatsapp/config`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(configData)
  });
  if (!res.ok) throw new Error('Failed to update WhatsApp config');
  return await res.json();
}

export async function testSendWhatsApp(payload) {
  const res = await fetch(`${API_BASE}/whatsapp/test-send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error('Failed to trigger WhatsApp test send');
  return await res.json();
}

