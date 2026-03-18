import { Disc } from "lucide-react";

export default function LogoVinyl() {
  return (
    // 1. Añadimos 'mx-auto' para forzar el centrado horizontal.
    // 2. Reducimos el tamaño base a 'w-64' (256px) para móviles pequeños y 'max-w-full' para evitar desbordes.
    <div className="relative flex items-center justify-center mx-auto w-64 h-64 sm:w-[300px] sm:h-[300px] md:w-[400px] md:h-[400px] max-w-full">
      {/* Brillo exterior (Glow pulsante) */}
      <div className="absolute inset-0 rounded-full bg-primary/40 blur-[60px] animate-pulse" />

      {/* El Disco Físico */}
      <div className="relative z-10 w-full h-full rounded-full bg-black border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Gradiente cónico para simular el brillo del vinilo al girar */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 90deg, transparent 180deg, rgba(255,255,255,0.2) 270deg, transparent 360deg)",
            animation: "spin 4s linear infinite",
          }}
        />

        {/* Etiqueta Central del Disco */}
        <div className="relative z-20 p-4 md:p-8 rounded-full bg-[#0a0a0a] border border-white/10 shadow-inner flex items-center justify-center">
          {/* 3. En lugar de usar size={120} fijo, usamos clases de Tailwind (w-16 h-16) 
              para que el icono encoja en móviles y vuelva a su tamaño original en PC (md:w-[120px]) */}
          <Disc
            className="text-primary w-16 h-16 md:w-[120px] md:h-[120px]"
            style={{ animation: "spin 10s linear infinite" }}
          />
        </div>

        {/* Surcos del vinilo (Decoración) */}
        <div className="absolute inset-[20%] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-[35%] rounded-full border border-white/5 pointer-events-none" />
        <div className="absolute inset-[50%] rounded-full border border-white/5 pointer-events-none" />
      </div>

      {/* Estilos para animaciones inline por si acaso */}
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
