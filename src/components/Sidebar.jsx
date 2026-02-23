import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  User,
  LogOut,
  Settings,
  MessageCircle,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  // ✅ 1. Extraemos 'isDJ' de tu contexto de autenticación
  const { user, logout, isDJ } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ 2. Cambiamos el label dinámicamente usando 'isDJ'
  const navItems = [
    {
      icon: LayoutGrid,
      label: isDJ ? "Mi Panel" : "Explorar DJs",
      path: "/dashboard",
    },
    { icon: MessageCircle, label: "Chats", path: "/chats" },
    { icon: Calendar, label: "Mis Reservas", path: "/reservas" },
    { icon: User, label: "Mi Perfil", path: "/perfil" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <aside className="w-66 h-screen fixed left-0 top-0 p-4 hidden md:flex flex-col z-50">
      {/* Panel de Cristal Completo */}
      <div className="glass-panel w-full h-full rounded-3xl flex flex-col p-6 relative overflow-hidden">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-10 text-white">
          <img src="/logo.svg" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-xl tracking-wide">DJ CONNECT</span>
        </div>

        {/* Navegación */}
        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
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

        {/* Tarjeta de Usuario (Abajo) */}
        <div className="mt-auto pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={
                user?.profile_image ||
                "https://ui-avatars.com/api/?name=" +
                  user?.name +
                  "&background=random"
              }
              alt="User"
              className="w-10 h-10 rounded-full border border-white/20 object-cover"
            />
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-white truncate">
                {user?.name}
              </h4>
              <p className="text-xs text-gray-400 capitalize">
                {isDJ ? "DJ" : "Cliente"}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors text-sm font-medium"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        {/* Decoración de fondo */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -z-10" />
      </div>
    </aside>
  );
}
