import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:8000/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

