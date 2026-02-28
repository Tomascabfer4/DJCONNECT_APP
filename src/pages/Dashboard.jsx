import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { apiDjs, apiEstadisticas } from "../services/api";
import DJCard from "../components/DJCard";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Sparkles,
  Loader2,
  Filter,
  TrendingUp,
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Music,
  Euro,
  ArrowRight,
} from "lucide-react";
import { toast } from "react-toastify";

// Hook para no saturar el backend con peticiones en cada tecla
const useRetraso = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
};

export default function Dashboard() {
  const { esDJ } = useAuth();
  return esDJ ? <DJDashboard /> : <ClientDashboard />;
}

// === VISTA PARA EL DJ (Panel de Control) ===
function DJDashboard() {
  const [estadisticas, setEstadisticas] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navegar = useNavigate();
  const { usuario } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await apiEstadisticas.obtenerDashboard();
        setEstadisticas(data);
      } catch (error) {
        console.error("Error estadisticas:", error);
        toast.error("No se pudieron cargar las estadísticas.");
      } finally {
        setCargando(false);
      }
    };
    fetchStats();
  }, []);

  if (cargando)
    return (
      <div className="h-64 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-10 pt-6 px-4">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight">
          Hola, <span className="text-primary">{usuario?.nombre || "DJ"}</span> 👋
        </h1>
        <p className="text-gray-400 mt-2 text-lg">
          Aquí tienes el resumen de tu imperio musical.
        </p>
      </div>

      {/* BANNER: PRÓXIMO EVENTO (Si existe) */}
      {estadisticas?.proximoEvento && (
        <div className="glass-panel border border-primary/30 bg-linear-to-r from-primary/10 via-transparent to-transparent p-6 sm:p-8 rounded-3xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden group hover:border-primary/50 transition-colors duration-500">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-primary/20 blur-3xl rounded-full group-hover:bg-primary/30 transition-colors duration-700" />

          <div className="flex items-center gap-5 relative z-10">
            <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(124,58,237,0.3)]">
              <Sparkles size={28} />
            </div>
            <div>
              <p className="text-primary font-bold text-xs uppercase tracking-widest mb-1">
                Siguiente parada
              </p>
              <h3 className="text-white font-extrabold text-2xl md:text-3xl">
                {estadisticas.proximoEvento.clienteNombre}
              </h3>
              <p className="text-gray-300 text-sm flex items-center gap-3 mt-2 font-medium">
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  <Calendar size={14} className="text-gray-400" />
                  {new Date(estadisticas.proximoEvento.fechaEvento).toLocaleDateString(
                    "es-ES",
                    { day: "numeric", month: "short" },
                  )}
                </span>
                <span className="flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md border border-white/10">
                  <MapPin size={14} className="text-gray-400" />
                  {estadisticas.proximoEvento.ubicacionEvento}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => navegar("/reservas")}
            className="btn-primary py-3 px-6 rounded-xl font-bold whitespace-nowrap flex items-center gap-2 group relative z-10 shadow-lg"
          >
            Ver Detalles{" "}
            <ArrowRight
              size={18}
              className="group-hover:translate-x-1 transition-transform"
            />
          </button>
        </div>
      )}

      {/* TARJETAS DE MÉTRICAS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Ingresos */}
        <div className="glass-panel p-6 rounded-3xl border border-green-500/20 bg-linear-to-br from-green-500/5 to-transparent hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400">
              <DollarSign size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Ingresos Totales</p>
          <h3 className="text-3xl font-black text-white mt-1">
            {estadisticas?.ingresos?.toLocaleString("es-ES") || 0}€
          </h3>
        </div>

        {/* Pendientes */}
        <div
          className="glass-panel p-6 rounded-3xl border border-yellow-500/20 bg-linear-to-br from-yellow-500/5 to-transparent cursor-pointer hover:-translate-y-1 hover:border-yellow-500/40 transition-all duration-300 group"
          onClick={() => navegar("/reservas")}
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 group-hover:scale-110 transition-transform">
              <Clock size={24} />
            </div>
            {estadisticas?.pendientes > 0 && (
              <span className="flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm font-medium">
            Solicitudes Pendientes
          </p>
          <h3 className="text-3xl font-black text-white mt-1">
            {estadisticas?.pendientes || 0}
          </h3>
        </div>

        {/* Eventos */}
        <div className="glass-panel p-6 rounded-3xl border border-blue-500/20 bg-linear-to-br from-blue-500/5 to-transparent hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400">
              <Calendar size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Bolos Confirmados</p>
          <h3 className="text-3xl font-black text-white mt-1">
            {estadisticas?.totalEventos || 0}
          </h3>
        </div>

        {/* Valoración */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-linear-to-br from-purple-500/5 to-transparent hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-xl text-purple-400">
              <TrendingUp size={24} />
            </div>
          </div>
          <p className="text-gray-400 text-sm font-medium">Valoración Media</p>
          <h3 className="text-3xl font-black text-white mt-1">
            {estadisticas?.valoracion > 0 ? estadisticas.valoracion.toFixed(1) : "N/A"}
            {estadisticas?.valoracion > 0 && (
              <span className="text-sm text-yellow-500 ml-1">★</span>
            )}
          </h3>
        </div>
      </div>
    </div>
  );
}

// === VISTA PARA EL CLIENTE (Buscador) ===
function ClientDashboard() {
  const [listaDjs, setListaDjs] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [nombre, setNombre] = useState("");
  const [genero, setGenero] = useState("");
  const [ubicacion, setUbicacion] = useState("");
  const [precioMax, setPrecioMax] = useState("");

  const nombreConRetraso = useRetraso(nombre, 500);
  const generoConRetraso = useRetraso(genero, 500);
  const ubicacionConRetraso = useRetraso(ubicacion, 500);
  const precioConRetraso = useRetraso(precioMax, 500);

  useEffect(() => {
    const buscarDjs = async () => {
      setCargando(true);
      try {
        const { data } = await apiDjs.buscar({
          nombre: nombreConRetraso || null,
          genero: generoConRetraso || null,
          ubicacion: ubicacionConRetraso || null,
          precioMax: precioConRetraso || null,
        });
        setListaDjs(data);
      } catch (error) {
        console.error("Error buscando:", error);
        toast.error("Error al filtrar DJs.");
      } finally {
        setCargando(false);
      }
    };
    buscarDjs();
  }, [nombreConRetraso, generoConRetraso, ubicacionConRetraso, precioConRetraso]);

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-fade-in pb-10 pt-6 px-4">
      {/* CABECERA */}
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-white via-gray-200 to-gray-500 tracking-tight">
            Explorar Talento
          </h1>
          <p className="text-gray-400 mt-2 text-lg">
            Encuentra al DJ perfecto para tu próximo evento.
          </p>
        </div>

        {/* BARRA DE BÚSQUEDA AVANZADA */}
        <div className="glass-panel p-3 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-3 items-center shadow-xl">
          <div className="relative w-full group">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="¿Qué DJ buscas?"
              className="glass-input w-full pl-12 bg-white/5 border-transparent focus:bg-white/10 focus:border-primary/50 text-white rounded-2xl h-12 transition-all"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="w-full md:w-px h-px md:h-8 bg-white/10 shrink-0" />

          <div className="relative w-full group">
            <Music
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Género (Ej. Techno)"
              className="glass-input w-full pl-12 bg-white/5 border-transparent focus:bg-white/10 focus:border-primary/50 text-white rounded-2xl h-12 transition-all"
              value={genero}
              onChange={(e) => setGenero(e.target.value)}
            />
          </div>

          <div className="w-full md:w-px h-px md:h-8 bg-white/10 shrink-0" />

          <div className="relative w-full group">
            <MapPin
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="text"
              placeholder="Ciudad"
              className="glass-input w-full pl-12 bg-white/5 border-transparent focus:bg-white/10 focus:border-primary/50 text-white rounded-2xl h-12 transition-all"
              value={ubicacion}
              onChange={(e) => setUbicacion(e.target.value)}
            />
          </div>

          <div className="w-full md:w-px h-px md:h-8 bg-white/10 shrink-0" />

          <div className="relative w-full md:w-48 group">
            <Euro
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-primary transition-colors"
              size={18}
            />
            <input
              type="number"
              placeholder="Max €"
              className="glass-input w-full pl-12 bg-white/5 border-transparent focus:bg-white/10 focus:border-primary/50 text-white rounded-2xl h-12 appearance-none transition-all"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
              min="0"
            />
          </div>

          {/* Botón de limpiar filtros (opcional, aparece si hay algo escrito) */}
          {(nombre || genero || ubicacion || precioMax) && (
            <button
              onClick={() => {
                setNombre("");
                setGenero("");
                setUbicacion("");
                setPrecioMax("");
              }}
              className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-2xl transition-colors shrink-0"
              title="Limpiar filtros"
            >
              <Filter size={20} />
            </button>
          )}
        </div>
      </div>

      {/* RESULTADOS */}
      {cargando ? (
        <div className="h-64 flex items-center justify-center">
          <Loader2 className="animate-spin text-primary" size={48} />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listaDjs.map((dj) => (
            <DJCard key={dj.id} dj={dj} />
          ))}

          {listaDjs.length === 0 && (
            <div className="col-span-full py-24 text-center glass-panel rounded-3xl border border-dashed border-white/10 bg-white/5">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="text-gray-500" size={32} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                No hay nadie en la pista
              </h3>
              <p className="text-gray-400 max-w-md mx-auto">
                No hemos encontrado DJs que coincidan con tu búsqueda. Prueba a
                relajar los filtros o buscar en otra ciudad.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
