import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // 1. Definimos logout arriba para evitar errores de referencia
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const mapUser = (apiUser) => ({
    id: apiUser.id,
    name: apiUser.nombre,
    email: apiUser.email,
    user_type: apiUser.rol?.toLowerCase() || "client",
    profile_image: apiUser.foto,
    ...apiUser,
  });

  useEffect(() => {
    const loadUser = async () => {
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        try {
          const { data } = await authAPI.getMe();
          setUser(mapUser(data));
        } catch (error) {
          console.error("Error de sesión:", error);
          logout();
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { data } = await authAPI.login({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);
    const meResponse = await authAPI.getMe();
    setUser(mapUser(meResponse.data));
  };

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
        isDJ: user?.user_type === "dj",
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// 2. LA SOLUCIÓN: Añadimos esta línea para que Vite no se queje del export
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
