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