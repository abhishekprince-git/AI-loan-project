const getBackendUrl = () => import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

async function request(path, options = {}) {
  const response = await fetch(`${getBackendUrl()}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const payload = await response.json();
      message = payload?.error || message;
    } catch (_error) {
      message = message;
    }

    throw new Error(message);
  }

  return response.json();
}

export function fetchApplicationState() {
  return request('/app-state');
}

export function updateOfferAcceptance(appId, payload) {
  return request(`/applications/${appId}/offer`, {
    method: 'PATCH',
    body: JSON.stringify(payload)
  });
}

export function submitDetectedAge(age) {
  return request('/verification/age', {
    method: 'POST',
    body: JSON.stringify({ age })
  });
}

export function sendVerificationOtp(email) {
  return request('/verification/send-otp', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

export function verifyOtp(email, code) {
  return request('/verification/verify-otp', {
    method: 'POST',
    body: JSON.stringify({ email, code })
  });
}

export async function uploadDocument(documentFile, documentType) {
  const formData = new FormData();
  formData.append('document', documentFile);
  if (documentType) {
    formData.append('documentType', documentType);
  }

  const response = await fetch(`${getBackendUrl()}/documents/upload`, {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      message = payload?.error || message;
    } catch (_error) {
      message = message;
    }
    throw new Error(message);
  }

  return response.json();
}

export function chatLoanForm(payload) {
  return request('/loan/form-chat', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function downloadLoanApplicationPdf(payload) {
  const backendUrl = getBackendUrl();
  const response = await fetch(`${backendUrl}/loan/application/pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;
    try {
      const payload = await response.json();
      message = payload?.error || message;
    } catch (_error) {
      // ignore
    }
    throw new Error(message);
  }

  const blob = await response.blob();
  const fileUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = fileUrl;
  link.download = 'loan-application-summary.pdf';
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(fileUrl);
}
