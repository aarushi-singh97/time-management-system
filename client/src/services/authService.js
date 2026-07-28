const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

async function sendRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Request failed.');
  }

  return data;
}

export function registerUser(userData) {
  return sendRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function loginUser(credentials) {
  return sendRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
}

export function saveSession(loginData) {
  localStorage.setItem('tms_token', loginData.token);
  localStorage.setItem(
    'tms_user',
    JSON.stringify({
      id: loginData.id,
      full_name: loginData.full_name,
      email: loginData.email,
      role: loginData.role,
    })
  );
}

export function getSavedUser() {
  const savedUser = localStorage.getItem('tms_user');
  return savedUser ? JSON.parse(savedUser) : null;
}

export function clearSession() {
  localStorage.removeItem('tms_token');
  localStorage.removeItem('tms_user');
}

export async function logoutUser() {
  const token = localStorage.getItem('tms_token');

  try {
    if (token) {
      await sendRequest('/auth/logout', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } finally {
    // JWT logout is client-side: deleting the token stops it being sent to the API.
    clearSession();
  }
}
