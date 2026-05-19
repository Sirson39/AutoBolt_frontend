const TOKEN_KEY = 'autobolt_token';
const USER_KEY = 'autobolt_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
};

export const setAuth = ({ token, role, fullName, email, expiry, customerId }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ role, fullName, email, expiry, customerId: customerId ?? null }));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => !!getToken() && !!getRole();

export const getRole = () => getUser()?.role || null;
