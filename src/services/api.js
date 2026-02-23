import axios from "axios";

// 🌍 URL DE PRODUCCIÓN
const API_URL = "https://djconnect-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔒 Interceptor: Inyectar el Token Automáticamente
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor de respuesta: Limpiar sesión si el token expira
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
    }
    return Promise.reject(error);
  },
);

// ==========================================
// 📡 ENDPOINTS (Actualizados con tu nuevo Backend)
// ==========================================

export const authAPI = {
  login: (credentials) => api.post("/Usuarios/login", credentials),
  registerClient: (data) => api.post("/Usuarios/registro/cliente", data),
  registerDj: (data) => api.post("/Usuarios/registro/dj", data),
  getMe: () => api.get("/Usuarios/me"),
  getUserById: (id) => api.get(`/Usuarios/${id}`),
  updateProfile: (data) => api.put("/Usuarios/perfil", data),
  deactivateAccount: () => api.delete("/Usuarios/desactivar-cuenta"),
  uploadPhoto: (formData) =>
    api.put("/Usuarios/perfil/foto", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deletePhoto: () => api.delete("/Usuarios/perfil/foto"),
};

export const djsAPI = {
  getAll: () => api.get("/DJs"),
  search: (params) => api.get("/DJs/buscar", { params }),

  // ✅ CAMBIO IMPORTANTE: Ahora usamos tu nuevo endpoint nativo
  // Esto traerá Bio, Experiencia y Valoración Promedio real
  getById: (id) => api.get(`/DJs/${id}`),

  updateDjProfile: (data) => api.put("/DJs/perfil", data),
};

export const bookingsAPI = {
  create: (data) => api.post("/Reservas", data),
  getAllMyBookings: () => api.get("/Reservas"),
  updateStatus: (id, estado) =>
    api.put(`/Reservas/${id}/estado`, JSON.stringify(estado), {
      headers: { "Content-Type": "application/json" },
    }),
  update: (id, data) => api.put(`/Reservas/${id}`, data),
  delete: (id) => api.delete(`/Reservas/${id}`),
};

export const portfolioAPI = {
  upload: (formData) =>
    api.post("/Portfolio/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  getByDj: (djId) => api.get(`/Portfolio/${djId}`),
  delete: (id) => api.delete(`/Portfolio/${id}`),
};

export const chatAPI = {
  getHistory: (reservaId) => api.get(`/Chat/${reservaId}`),
  sendMessage: (data) => api.post("/Chat", data),
};

export const statsAPI = {
  getDashboard: () => api.get("/Stats/dashboard"),
};

export const reviewsAPI = {
  create: (data) => api.post("/Valoraciones", data),
  // ✅ NUEVO: Añadido para poder listar las opiniones en el perfil
  getByDj: (djId) => api.get(`/Valoraciones/dj/${djId}`),
};

export default api;
