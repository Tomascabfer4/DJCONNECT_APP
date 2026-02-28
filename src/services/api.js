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

export const apiAutenticacion = {
  iniciarSesion: (credenciales) => api.post("/Usuarios/login", credenciales),
  registrarCliente: (datos) => api.post("/Usuarios/registro/cliente", datos),
  registrarDj: (datos) => api.post("/Usuarios/registro/dj", datos),
  obtenerUsuarioActual: () => api.get("/Usuarios/me"), // Recuperar sesión con el token
  obtenerUsuarioPorId: (id) => api.get(`/Usuarios/${id}`),
  actualizarPerfil: (datos) => api.put("/Usuarios/perfil", datos),
  desactivarCuenta: () => api.delete("/Usuarios/desactivar-cuenta"),
  subirFoto: (datosFormulario) =>
    api.put("/Usuarios/perfil/foto", datosFormulario, {
      headers: { "Content-Type": "multipart/form-data" }, // Para enviar archivos físicos
    }),
  eliminarFoto: () => api.delete("/Usuarios/perfil/foto"),
};

export const apiDjs = {
  obtenerTodos: () => api.get("/DJs"),
  buscar: (parametros) => api.get("/DJs/buscar", { params: parametros }), // Buscador dinámico
  obtenerPorId: (id) => api.get(`/DJs/${id}`), // Trae la ficha pública completa
  actualizarPerfilDj: (datos) => api.put("/DJs/perfil", datos),
};

export const apiReservas = {
  crear: (datos) => api.post("/Reservas", datos),
  obtenerMisReservas: () => api.get("/Reservas"), // Bandeja de entrada de reservas
  actualizarEstado: (id, estado) =>
    api.put(`/Reservas/${id}/estado`, JSON.stringify(estado), {
      headers: { "Content-Type": "application/json" },
    }),
  actualizar: (id, datos) => api.put(`/Reservas/${id}`, datos),
  eliminar: (id) => api.delete(`/Reservas/${id}`),
};

export const apiPortafolio = {
  subir: (datosFormulario) =>
    api.post("/Portfolio/upload", datosFormulario, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  obtenerPorDj: (idDj) => api.get(`/Portfolio/${idDj}`),
  eliminar: (id) => api.delete(`/Portfolio/${id}`),
};

export const apiChat = {
  obtenerHistorial: (idReserva) => api.get(`/Chat/${idReserva}`),
  enviarMensaje: (datos) => api.post("/Chat", datos),
};

export const apiEstadisticas = {
  obtenerDashboard: () => api.get("/Stats/dashboard"), // Estadísticas del panel DJ
};

export const apiValoraciones = {
  crear: (datos) => api.post("/Valoraciones", datos),
  obtenerPorDj: (idDj) => api.get(`/Valoraciones/dj/${idDj}`), // Lista de opiniones para el perfil del DJ
};

export default api;
