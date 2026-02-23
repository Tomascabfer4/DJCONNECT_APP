import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { Menu } from "lucide-react";
import { useState } from "react";

export default function DashboardLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-darker relative">
      {/* 1. Sidebar (Visible en escritorio) */}
      <Sidebar />

      {/* 2. Botón Menú Móvil (Solo visible en móvil) */}
      <div className="md:hidden p-4 flex justify-between items-center glass-panel m-4 rounded-xl sticky top-4 z-40">
        <div className="flex items-center gap-3">
          <img src="../../public/logo.svg" alt="Logo" className="w-10 h-10" />
          <span className="font-bold text-white">DJ CONNECT</span>
        </div>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          <Menu />
        </button>
      </div>

      {/* 3. Área de Contenido Principal */}
      <main className="md:pl-72 p-4 md:p-8 min-h-screen transition-all duration-300">
        {/* Aquí se renderizarán Home, Perfil, Reservas, etc. */}
        <Outlet />
      </main>

      {/* Fondo Global extra para el Dashboard */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
      </div>
    </div>
  );
}
