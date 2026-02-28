import { createContext, useContext, useState, useEffect } from "react";
import { apiAutenticacion } from "../services/api";

const AuthContext = createContext();

// ==========================================
// Este componente envuelve a toda la app an app.jsx
// para que todos los componentes puedan usarla.
// ==========================================
export function AuthProvider({ children }) {
  // ESTADOS GLOBALES (State)
  // usuario: Guarda la información del usuario logueado.
  // token: El acceso encriptado que nos dio el backend.
  // cargando: Para evitar que la web cargue hasta saber si estás logueado o no.
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [cargando, setCargando] = useState(true);

  // ==========================================
  // FUNCIÓN: cerrarSesion
  // FLUJO: Borra el token para cerrar sesión.
  // ==========================================
  const cerrarSesion = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUsuario(null);
  };

  // Simplemente mapea los datos para que React los use correctamente.
  const mapearUsuario = (usuarioApi) => ({
    id: usuarioApi.id,
    nombre: usuarioApi.nombre,
    email: usuarioApi.email,
    tipoUsuario: usuarioApi.rol?.toLowerCase() || "client",
    imagenPerfil: usuarioApi.foto,
    ...usuarioApi,
  });

  // ==========================================
  // Usamos useEffect para cargar la sesión al recargar (F5)
  // useEffect en este caso se carga al cargar el componente.
  // ==========================================
  useEffect(() => {
    const cargarUsuario = async () => {
      const tokenGuardado = localStorage.getItem("token");
      if (tokenGuardado) {
        try {
          // Llama al endpoint GET /Usuarios/me
          const { data } = await apiAutenticacion.obtenerUsuarioActual();
          setUsuario(mapearUsuario(data)); // Guarda los datos en el estado global
        } catch (error) {
          console.error(
            "Error de sesión: El token caducó o no es válido",
            error,
          );
          cerrarSesion(); // Si falla (ej: expiró a las 2h), lo echamos
        }
      }
      setCargando(false); // Si cargando es false, ya hemos cargado la sesión.
    };
    cargarUsuario();
  }, []);

  // ==========================================
  // Para logearse utilizamos la endpoint de obtenerUsuarioActual y guardamos el token
  // ==========================================
  const iniciarSesion = async (email, password) => {
    const { data } = await apiAutenticacion.iniciarSesion({ email, password });
    localStorage.setItem("token", data.token);
    setToken(data.token);

    // Una vez logueado, traemos los datos visuales
    const respuestaUsuario = await apiAutenticacion.obtenerUsuarioActual();
    setUsuario(mapearUsuario(respuestaUsuario.data));
  };

  // ==========================================
  // Para registrar un usuario utilizamos la endpoint de registrarDj o registrarCliente
  // Despues llamamos a la funcion anterior para que haga logueo automatico
  // ==========================================
  const registrarUsuario = async (datosFormulario, tipo) => {
    const llamadaApi =
      tipo === "dj"
        ? apiAutenticacion.registrarDj
        : apiAutenticacion.registrarCliente;
    await llamadaApi(datosFormulario);
    await iniciarSesion(datosFormulario.email, datosFormulario.password);
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        token,
        cargando,
        iniciarSesion,
        registrarUsuario,
        cerrarSesion,
        esDJ: usuario?.tipoUsuario === "dj", // Variable para saber si el usuario es DJ o Cliente
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
  const contexto = useContext(AuthContext);
  if (contexto === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return contexto;
};
