import { decodeJwtPayload } from '../utils/authUtils';

const TOKEN_KEY = 'finance_frontend_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isAuthenticated() {
  return Boolean(getToken());
}

export function getCurrentUser() {
  const token = getToken();
  if (!token) return null;

  const payload = decodeJwtPayload(token);
  return payload ? { role: payload.role, id: payload.id } : null;
}

export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function useAuth() {
  return {
    token: getToken(),
    isAuthenticated: isAuthenticated(),
    user: getCurrentUser()
  };
}
