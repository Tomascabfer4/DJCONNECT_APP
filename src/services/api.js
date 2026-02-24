import axios from "axios";

// ==========================================
// CONFIGURACIÓN GLOBAL DE AXIOS
// ==========================================
// Todas las peticiones saldrán hacia este dominio base.
const API_URL = "https://djconnect-api.onrender.com/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==========================================
// Basicamente aqui lo que hace axios es capturar la peticion, busca el token
// en el navegador y lo envia al backend, para que este sepa quién es el usuario
// ==========================================

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ==========================================
// Esta es la respuesta del backend, si el backend nos da un error 401
// axios borra automáticamente el token guardado para "echar" al usuario
// ==========================================
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
// Basicamente guardamos todos los endpoints de nuestra API
// ==========================================

export const authAPI = {
  login: (credentials) => api.post("/Usuarios/login", credentials),
  registerClient: (data) => api.post("/Usuarios/registro/cliente", data),
  registerDj: (data) => api.post("/Usuarios/registro/dj", data),
  getMe: () => api.get("/Usuarios/me"), // Recuperar sesión con el token
  getUserById: (id) => api.get(`/Usuarios/${id}`),
  updateProfile: (data) => api.put("/Usuarios/perfil", data),
  deactivateAccount: () => api.delete("/Usuarios/desactivar-cuenta"),
  uploadPhoto: (formData) =>
    api.put("/Usuarios/perfil/foto", formData, {
      headers: { "Content-Type": "multipart/form-data" }, // Para enviar archivos físicos
    }),
  deletePhoto: () => api.delete("/Usuarios/perfil/foto"),
};

export const djsAPI = {
  getAll: () => api.get("/DJs"),
  search: (params) => api.get("/DJs/buscar", { params }), // Buscador dinámico
  getById: (id) => api.get(`/DJs/${id}`), // Trae la ficha pública completa
  updateDjProfile: (data) => api.put("/DJs/perfil", data),
};

export const bookingsAPI = {
  create: (data) => api.post("/Reservas", data),
  getAllMyBookings: () => api.get("/Reservas"), // Bandeja de entrada de reservas
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
  getDashboard: () => api.get("/Stats/dashboard"), // Estadísticas del panel DJ
};

export const reviewsAPI = {
  create: (data) => api.post("/Valoraciones", data),
  getByDj: (djId) => api.get(`/Valoraciones/dj/${djId}`), // Lista de opiniones para el perfil del DJ
};

export default api;
