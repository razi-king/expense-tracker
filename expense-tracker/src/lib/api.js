import { to } from './paths';

const API = (import.meta.env.PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
export const apiConfigured = Boolean(API);

const TOKEN = 'et.token';
const USER = 'et.user';

export const session = {
  token: () => localStorage.getItem(TOKEN),
  user: () => {
    try { return JSON.parse(localStorage.getItem(USER) || 'null'); } catch { return null; }
  },
  save({ token, user }) {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
  },
  clear() {
    localStorage.removeItem(TOKEN);
    localStorage.removeItem(USER);
  },
};

/** Error with the API's message and per-field messages, ready for the forms. */
export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message);
    this.status = status;
    this.fields = fields || {};
  }
}

/**
 * Calls the Spring Boot API. Free hosting sleeps when idle, so the first call
 * can take up to a minute: onSlow lets the UI say so instead of looking broken.
 */
export async function request(path, { method = 'GET', body, onSlow } = {}) {
  if (!API) throw new ApiError(0, 'The backend is not connected yet. Set PUBLIC_API_BASE_URL.');
  const headers = { 'Content-Type': 'application/json' };
  const token = session.token();
  if (token) headers.Authorization = `Bearer ${token}`;

  const slow = onSlow ? setTimeout(onSlow, 4000) : null;
  let res;
  try {
    res = await fetch(API + path, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError(0, 'Could not reach the server. Check your connection and try again.');
  } finally {
    if (slow) clearTimeout(slow);
  }

  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (res.ok) return data;

  if (res.status === 401 && token) {
    session.clear();
    window.location.href = to('/login?expired=1');
  }
  throw new ApiError(res.status, data?.message || `Request failed (${res.status})`, data?.fields);
}

export const wakeServer = () => API && fetch(`${API}/healthz`).catch(() => {});
