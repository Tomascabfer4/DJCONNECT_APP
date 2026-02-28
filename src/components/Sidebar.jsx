import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  User,
  LogOut,
  Settings,
  MessageCircle,
  Menu,
  X,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  // CONTEXTO: Extraemos 'esDJ' para saber qué etiquetas mostrar y 'cerrarSesion' para cerrar sesión.
  const { usuario, cerrarSesion, esDJ } = useAuth();
  const navegar = useNavigate();

  // ESTADO: Controla si el menú lateral está abierto en dispositivos móviles.
  const [estaAbierto, setEstaAbierto] = useState(false);

  // Para cerrar sesión.
  const manejarCerrarSesion = () => {
    cerrarSesion();
    navegar("/login");
  };

  // Rutas del menu, si eres DJ ves "Mi Panel", si eres Cliente ves "Explorar DJs"
  const itemsNavegacion = [
    {
      icon: LayoutGrid,
      label: esDJ ? "Mi Panel" : "Explorar DJs",
      path: "/dashboard",
    },
    { icon: MessageCircle, label: "Chats", path: "/chats" },
    { icon: Calendar, label: "Mis Reservas", path: "/reservas" },
    { icon: User, label: "Mi Perfil", path: "/perfil" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <>
      {/* Para que este siempre disponible en moviles aun cuando se desplace */}
      <div className="md:hidden fixed top-0 left-0 w-full z-990 p-4">
        <div className="glass-panel w-full bg-[#0a0a0a]/90 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 flex items-center justify-between shadow-2xl">
          <div className="flex items-center gap-3 text-white">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-8 h-8"
              onError={(e) => (e.target.style.display = "none")} // Si no se encuentra el logo se oculta
            />
            <span className="font-black text-lg tracking-wider">
              DJ CONNECT
            </span>
          </div>
          <button
            type="button"
            onClick={() => setEstaAbierto(true)}
            className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-xl border border-white/10 transition-colors"
          >
            <Menu size={24} />
          </button>
        </div>
      </div>

      {estaAbierto && (
        <div
          className="md:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-998"
          onClick={() => setEstaAbierto(false)} // Si se toca fuera del menu se cierra
        />
      )}

      {/* 🚀 SIDEBAR PRINCIPAL
          Se oculta en moviles y se muestra fijo en escritorio */}
      <aside
        className={`
          w-[280px] h-dvh fixed left-0 top-0 p-4 flex flex-col z-1000 transition-transform duration-300 ease-in-out
          ${estaAbierto ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="glass-panel w-full h-full rounded-3xl flex flex-col p-6 relative overflow-hidden bg-[#0a0a0a]/95 md:bg-transparent shadow-2xl md:shadow-none">
          <div className="flex items-center justify-between mb-10 mt-2 md:mt-0">
            <div className="flex items-center gap-3 text-white">
              <img src="/logo.svg" alt="Logo" className="w-10 h-10 shrink-0" />
              <span className="font-black text-xl tracking-wide">
                DJ CONNECT
              </span>
            </div>

            {/* Ponemos un boton de cerrar solo para moviles */}
            <button
              type="button"
              onClick={() => setEstaAbierto(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors bg-white/5 p-2 rounded-xl border border-white/10 shrink-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* 🔗 MENÚ DE NAVEGACIÓN
              Mapeamos los ítems y usamos NavLink para detectar automáticamente en qué página estamos (isActive). */}
          <nav className="flex-1 space-y-2">
            {itemsNavegacion.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setEstaAbierto(false)} // 🔄 FLUJO: Al hacer clic en un enlace, el menú móvil se cierra solo.
                className={({ isActive }) => `
                  flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-primary/20 text-white shadow-lg shadow-primary/10 border border-primary/20"
                      : "text-gray-400 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <item.icon size={20} className="transition-colors" />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          {/* 👤 TARJETA DE USUARIO (Sección inferior)
              Muestra la foto de perfil desde la API o un avatar por defecto si no tiene. */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={
                  usuario?.imagenPerfil ||
                  `https://ui-avatars.com/api/?name=${usuario?.nombre}&background=random`
                }
                alt="User"
                className="w-10 h-10 rounded-full border border-white/20 object-cover shrink-0"
              />
              <div className="overflow-hidden">
                <h4 className="text-sm font-bold text-white truncate">
                  {usuario?.nombre}
                </h4>
                <p className="text-xs text-gray-400 capitalize">
                  {esDJ ? "DJ" : "Cliente"}
                </p>
              </div>
            </div>

            <button
              onClick={manejarCerrarSesion}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-bold border border-red-500/10"
            >
              <LogOut size={18} /> Cerrar Sesión
            </button>
          </div>

          {/* ✨ LUCES DE FONDO (Efecto visual) */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
        </div>
      </aside>
    </>
  );
}
