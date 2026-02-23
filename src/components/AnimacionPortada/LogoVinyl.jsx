import { Disc } from "lucide-react";

export default function LogoVinyl() {
  return (
    <div className="relative flex items-center justify-center w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
      {/* 1. Brillo exterior (Glow pulsante) */}
      <div className="absolute inset-0 rounded-full bg-primary/40 blur-[60px] animate-pulse" />

      {/* 2. El Disco Físico */}
      <div className="relative z-10 w-full h-full rounded-full bg-black border-4 border-white/10 shadow-2xl flex items-center justify-center overflow-hidden">
        {/* Gradiente cónico para simular el brillo del vinilo al girar */}
        {/* Usamos un estilo en línea para la animación específica si no está en tailwind */}
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background:
              "conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.2) 90deg, transparent 180deg, rgba(255,255,255,0.2) 270deg, transparent 360deg)",
            animation: "spin 4s linear infinite",
          }}
        />

        {/* Etiqueta Central del Disco */}
        <div className="relative z-20 p-8 rounded-full bg-[#0a0a0a] border border-white/10 shadow-inner">
          {/* El icono también gira pero más lento o en sentido contrario si quisieras */}
          <Disc
            size={120}
            className="text-primary"
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
