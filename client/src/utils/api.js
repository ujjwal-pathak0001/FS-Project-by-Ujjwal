const API_BASE_URL = import.meta.env?.VITE_API_URL || "http://localhost:5000";

export const authRoutes = {
  register: `${API_BASE_URL}/api/user/register`,
  login: `${API_BASE_URL}/api/user/login`,
  tenantProfile: `${API_BASE_URL}/api/user/tenant/profile`,
  setRole: `${API_BASE_URL}/api/user/role`,
};

export const adminRoutes = {
  settings: `${API_BASE_URL}/api/admin/settings`,
};

export const postsRoute = (tenantId) =>
  `${API_BASE_URL}/api/tenants/${tenantId}/posts`;

export default API_BASE_URL;
