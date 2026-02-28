import { useNavigate } from "react-router-dom";
import { Settings, Wrench, ArrowLeft } from "lucide-react";

export default function Configuration() {
  const navegar = useNavigate();

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex items-center justify-center p-4 animate-fade-in relative z-10">
      <div className="glass-panel p-10 md:p-16 rounded-3xl text-center border border-white/10 relative overflow-hidden max-w-lg w-full shadow-2xl">
        {/* Efecto de luz de fondo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10 pointer-events-none" />

        {/* Iconos animados */}
        <div className="relative inline-flex mb-8">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/10 shadow-lg">
            {/* El engranaje gira lentamente */}
            <Settings
              size={56}
              className="text-primary animate-[spin_6s_linear_infinite]"
            />
          </div>
          <div className="absolute -bottom-3 -right-3 p-2 bg-darker rounded-xl border border-white/10">
            <Wrench size={24} className="text-gray-400" />
          </div>
        </div>

        {/* Textos */}
        <h1 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tight">
          En Construcción
        </h1>
        <p className="text-gray-400 mb-8 text-base md:text-lg leading-relaxed">
          Estamos preparando el panel de configuración perfecto para que puedas
          personalizar tu experiencia al máximo. ¡Estará listo muy pronto!
        </p>

        {/* Botón de regreso */}
        <button
          onClick={() => navegar(-1)} // Vuelve a la página anterior
          className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white border border-white/10 px-6 py-3 rounded-xl transition-all hover:-translate-x-1 font-bold shadow-md"
        >
          <ArrowLeft size={18} />
          Volver atrás
        </button>
      </div>
    </div>
  );
}
