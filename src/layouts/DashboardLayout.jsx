import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

/**
 * Se encarga de pintar la estructura fija (el Sidebar) y dejar un espacio dinámico
 * (el Outlet) donde se cargarán el Dashboard, los Chats, el Perfil, etc.
 */
export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-darker relative">
      <Sidebar />

      <main className="pt-24 md:pt-8 md:pl-[296px] p-4 md:pr-8 min-h-screen transition-all duration-300">
        {/* Aqui es donde se renderizan los componentes de las rutas protegidas */}
        <Outlet />
      </main>

      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
