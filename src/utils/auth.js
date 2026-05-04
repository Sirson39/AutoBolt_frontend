const TOKEN_KEY = 'autobolt_token';
const USER_KEY = 'autobolt_user';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(USER_KEY)); }
  catch { return null; }
};

export const setAuth = ({ token, role, fullName, email, expiry }) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify({ role, fullName, email, expiry }));
};

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) return false;
  try {
    const user = getUser();
    return user?.expiry ? new Date(user.expiry) > new Date() : false;
  } catch { return false; }
};

export const getRole = () => getUser()?.role || null;
