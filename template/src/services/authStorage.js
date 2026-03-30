const AUTH_TOKEN_KEY = 'bakery_auth_token';
const AUTH_USER_KEY = 'bakery_auth_user';

export function setSession(token, user) {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(AUTH_TOKEN_KEY, token);
  window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user || null));
}

export function clearSession() {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}

export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getUser() {
  if (typeof window === 'undefined') {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

export function isAuthenticated() {
  return Boolean(getToken());
}
