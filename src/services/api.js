import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
});

// Request interceptor - Add token to all requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      // Ensure headers object exists
      if (!config.headers) {
        config.headers = {};
      }
      // Always set Authorization header
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Set Content-Type if not already set
    if (!config.headers["Content-Type"] && config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
      config.headers["Content-Type"] = "application/json";
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      localStorage.removeItem("token");
      // Redirect to login page
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) =>
    api.post(
      "/auth/login",
      new URLSearchParams({
        username: payload.email,
        password: payload.password,
      }),
      {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      },
    ),
};

export const expenseAPI = {
  add: (payload) => api.post("/expenses/", payload),
  listByMonth: (month) => api.get(`/expenses/monthly/${month}`),
  update: (expenseId, payload) => api.put(`/expenses/${expenseId}`, payload),
  remove: (expenseId) => api.delete(`/expenses/${expenseId}`),
};

export const reportAPI = {
  fetchMonthly: (month) => api.get(`/reports/monthly/${month}`),
};

export default api;

