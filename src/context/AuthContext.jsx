import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

// ==========================================
// Este componente envuelve a toda la app an app.jsx
// para que todos los componentes puedan usarla.
// ==========================================
export function AuthProvider({ children }) {
  // ESTADOS GLOBALES (State)
  // user: Guarda la información del usuario logueado.
  // token: El acceso encriptado que nos dio el backend.
  // loading: Para evitar que la web cargue hasta saber si estás logueado o no.
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // ==========================================
  // FUNCIÓN: Logout
  // FLUJO: Borra el token para cerrar sesión.
  // ==========================================
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  // Simplemente mapea los datos para que React los use correctamente.
  const mapUser = (apiUser) => ({
    id: apiUser.id,
    name: apiUser.nombre,
    email: apiUser.email,
    user_type: apiUser.rol?.toLowerCase() || "client",
    profile_image: apiUser.foto,
    ...apiUser,
  });

  // ==========================================
  // Usamos useEffect para cargar la sesión al recargar (F5)
  // useEffect en este caso se carga al cargar el componente.
  // ==========================================
  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          // Llama al endpoint GET /Usuarios/me
          const { data } = await authAPI.getMe();
          setUser(mapUser(data)); // Guarda los datos en el estado global
        } catch (error) {
          console.error(
            "Error de sesión: El token caducó o no es válido",
            error,
          );
          logout(); // Si falla (ej: expiró a las 2h), lo echamos
        }
      }
      setLoading(false); // Si loading es false, ya hemos cargado la sesión.
    };
    loadUser();
  }, []);

  // ==========================================
  // Para logearse utilizamos la endpoint de getme y guardamos el token
  // ==========================================
  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // Una vez logueado, traemos los datos visuales
    const meResponse = await authAPI.getMe();
    setUser(mapUser(meResponse.data));
  };

  // ==========================================
  // Para registrar un usuario utilizamos la endpoint de registerDj o registerClient
  // Despues llamamos a la funcion anterior para que haga logueo automatico
  // ==========================================
  const register = async (formData, type) => {
    const apiCall = type === "dj" ? authAPI.registerDj : authAPI.registerClient;
    await apiCall(formData);
    await login(formData.email, formData.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        isDJ: user?.user_type === "dj", // Variable para saber si el usuario es DJ o Cliente
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ==========================================
// HOOK PERSONALIZADO: useAuth()
// Esto se usa en toda la app para saber quién está logueado.
// ==========================================
// Lo de abajo es para que no se muestre un error
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
