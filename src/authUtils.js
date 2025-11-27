// Save authentication data
export const saveAuthData = (token, username, role) => {
  localStorage.setItem('jwtToken', token);
  localStorage.setItem('username', username);
  localStorage.setItem('userRole', role);
};

// Get stored token
export const getAuthToken = () => {
  return localStorage.getItem('jwtToken');
};

// Get stored username
export const getUsername = () => {
  return localStorage.getItem('username');
};

// Get stored user role
export const getUserRole = () => {
  return localStorage.getItem('userRole');
};

// Check if user is logged in
export const isLoggedIn = () => {
  const token = getAuthToken();
  return token !== null && token !== '';
};

// Check if user has specific role
export const hasRole = (role) => {
  return getUserRole() === role;
};

// Check if user is admin
export const isAdmin = () => {
  return hasRole('ADMIN');
};

// Check if user is seller
export const isSeller = () => {
  return hasRole('SELLER');
};

// Check if user is regular user
export const isUser = () => {
  return hasRole('USER');
};

// Logout user
export const logout = () => {
  localStorage.removeItem('jwtToken');
  localStorage.removeItem('username');
  localStorage.removeItem('userRole');
};

// Get authorization header for API calls
export const getAuthHeader = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
