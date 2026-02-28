import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiDjs, apiReservas, apiValoraciones, apiPortafolio } from "../services/api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import {
  Calendar,
  MapPin,
  Music,
  Star,
  Clock,
  CheckCircle,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  User,
  Image as ImageIcon,
  PlayCircle,
  Headphones,
  Film,
  PartyPopper,
} from "lucide-react";

export default function DJDetail() {
  const { id } = useParams();
  const navegar = useNavigate();
  const { usuario } = useAuth();

  const [dj, setDj] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [portafolio, setPortafolio] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [enviando, setEnviando] = useState(false);

  // Formulario adaptado 100% al Swagger
  const [fecha, setFecha] = useState("");
  const [horaInicio, setHoraInicio] = useState("22:00");
  const [horas, setHoras] = useState(2);
  const [lugar, setLugar] = useState("");
  const [tipoEvento, setTipoEvento] = useState("Fiesta Privada");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [djRes, reviewsRes, portfolioRes] = await Promise.all([
          apiDjs.obtenerPorId(id),
          apiValoraciones.obtenerPorDj(id),
          apiPortafolio.obtenerPorDj(id),
        ]);

        setDj(djRes.data);
        setReviews(reviewsRes.data);
        setPortafolio(portfolioRes.data);
      } catch (error) {
        console.error("Error cargando datos:", error);
        toast.error("Error al cargar el perfil");
        navegar("/dashboard");
      } finally {
        setCargando(false);
      }
    };
    fetchData();
  }, [id, navegar]);

  const manejarReserva = async (e) => {
    e.preventDefault();
    if (!usuario) return navegar("/login");

    setEnviando(true);
    try {
      // 1. Enviamos la fecha y hora "local" (sin la Z al final)
      // Esto evita que JavaScript reste una hora al convertir a UTC
      const fechaHoraLocal = `${fecha}T${horaInicio}:00`;

      // 2. Enviamos el horario solo como el número de horas (ej: "2", "3")
      // Esto permite que el backend haga el cálculo de: Precio * Horas
      await apiReservas.create({
        djId: parseInt(id),
        fechaEvento: fechaHoraLocal,
        horario: horas.toString(), // Enviamos solo el número
        tipoEvento: tipoEvento,
        ubicacionEvento: lugar,
      });

      toast.success("¡Solicitud enviada!");
      setTimeout(() => navegar("/reservas"), 2000);
    } catch (error) {
      console.log("🛑 DETALLES DEL ERROR:", error.response?.data);
      const errorMsg =
        error.response?.data?.mensaje ||
        error.response?.data ||
        "Error interno del servidor. Inténtalo de nuevo.";

      toast.error(errorMsg);
    } finally {
      setEnviando(false);
    }
  };

  if (cargando)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  if (!dj) return null;

  const foto = dj.foto || "/images/default-dj.jpg";
  const generos = dj.generosMusicales
    ? dj.generosMusicales.split(",")
    : ["Varios"];

  // Separamos el portafolio por tipos para pintarlos ordenados
  const fotosYVideos = portafolio.filter(
    (p) => p.tipo === "imagen" || p.tipo === "video",
  );
  const musica = portafolio.filter((p) => p.tipo === "musica");

  return (
    <div className="max-w-7xl mx-auto pb-20 pt-6 px-4 animate-fade-in">
      <button
        onClick={() => navegar(-1)}
        className="text-gray-400 hover:text-white flex items-center gap-2 mb-6 transition-colors"
      >
        <ArrowLeft size={20} /> Volver
      </button>

      {/* === HEADER === */}
      <div className="relative h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/10 mb-8 group">
        <div
          className="absolute inset-0 bg-cover bg-center blur-xl opacity-40 scale-110 group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url(${foto})` }}
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent" />

        <div className="absolute bottom-0 left-0 w-full p-8 flex items-end gap-8">
          <img
            src={foto}
            alt={dj.nombreArtistico}
            className="w-40 h-40 rounded-2xl border-4 border-[#0a0a0a] object-cover bg-[#0a0a0a] shadow-2xl"
          />
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2 tracking-tight">
              {dj.nombreArtistico}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-gray-300">
              <span className="flex items-center gap-1 bg-white/5 px-3 py-1 rounded-full text-sm border border-white/10">
                <MapPin size={14} className="text-primary" />{" "}
                {dj.ciudad || "Global"}
              </span>

              <span className="flex items-center gap-1 text-yellow-400 font-bold bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                <Star size={14} fill="currentColor" />
                {dj.valoracionPromedio > 0
                  ? dj.valoracionPromedio.toFixed(1)
                  : "Nuevo"}
                <span className="text-gray-500 font-normal ml-1">
                  ({dj.numeroValoraciones})
                </span>
              </span>

              {dj.aniosExperiencia > 0 && (
                <span className="text-sm text-gray-400 pl-4 border-l border-white/20">
                  {dj.aniosExperiencia} años exp.
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* COLUMNA IZQUIERDA: CONTENIDO */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. BIO */}
          <div className="glass-panel p-8 rounded-3xl">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <Music className="text-secondary" /> Bio & Estilo
            </h2>
            <div className="flex flex-wrap gap-2 mb-6">
              {generos.map((g, i) => (
                <span key={i} className="badge-primary">
                  {g.trim()}
                </span>
              ))}
            </div>
            <p className="text-gray-400 leading-relaxed whitespace-pre-line">
              {dj.bio || "Este DJ prefiere dejar que su música hable por él."}
            </p>
          </div>

          {/* 2. PORTFOLIO MULTIMEDIA */}
          {portafolio.length > 0 && (
            <div className="glass-panel p-8 rounded-3xl">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                <PlayCircle className="text-blue-400" /> Galería & Sesiones
              </h2>

              {/* Grid de Fotos y Videos */}
              {fotosYVideos.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {fotosYVideos.map((item) => (
                    <div
                      key={item.id}
                      className="relative aspect-video rounded-xl overflow-hidden bg-black/50 border border-white/10 group"
                    >
                      {item.tipo === "video" ? (
                        <video
                          src={item.url}
                          controls
                          className="w-full h-full object-cover"
                          poster={item.url.replace(/\.[^/.]+$/, ".jpg")}
                        />
                      ) : (
                        <img
                          src={item.url}
                          alt={item.titulo}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                      )}

                      {/* Badge Tipo */}
                      <div className="absolute top-2 left-2 px-2 py-1 bg-black/60 backdrop-blur rounded text-xs text-white font-bold flex items-center gap-1 uppercase">
                        {item.tipo === "video" ? (
                          <Film size={10} />
                        ) : (
                          <ImageIcon size={10} />
                        )}{" "}
                        {item.tipo}
                      </div>

                      {/* Título en hover (solo imagen) */}
                      {item.titulo && item.tipo === "imagen" && (
                        <div className="absolute bottom-0 left-0 w-full p-3 bg-linear-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                          <p className="text-white text-sm font-medium truncate">
                            {item.titulo}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Lista de Audio / Sets */}
              {musica.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-2">
                    Sesiones de Audio
                  </h3>
                  {musica.map((track) => (
                    <div
                      key={track.id}
                      className="bg-white/5 border border-white/5 p-3 rounded-xl flex items-center gap-4 hover:bg-white/10 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
                        <Headphones size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {track.titulo || "Sesión sin título"}
                        </p>
                        <p className="text-xs text-gray-500">
                          Subido el{" "}
                          {new Date(track.fechaSubida).toLocaleDateString()}
                        </p>
                      </div>
                      <audio
                        controls
                        src={track.url}
                        className="h-8 w-32 sm:w-64 opacity-80 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. OPINIONES */}
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Star className="text-yellow-400" /> Opiniones ({reviews.length})
            </h3>

            {reviews.length === 0 ? (
              <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
                <p className="text-gray-500 italic">Aún no hay opiniones.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border-b border-white/5 pb-6 last:pb-0 last:border-0"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                          <User size={14} className="text-gray-400" />
                        </div>
                        <div>
                          <span className="font-bold text-white text-sm block">
                            {review.clienteNombre}
                          </span>
                          <div className="flex items-center gap-0.5 text-yellow-400">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={10}
                                fill={
                                  i < review.puntuacion
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  i < review.puntuacion ? "" : "text-gray-700"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(review.fecha).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-2 leading-relaxed">
                      "{review.comentario}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: FORMULARIO */}
        <div className="lg:col-span-1">
          <div className="glass-panel p-6 rounded-3xl sticky top-24 border border-primary/20 shadow-[0_0_30px_rgba(124,58,237,0.05)]">
            <div className="flex justify-between items-end mb-6 border-b border-white/10 pb-4">
              <div>
                <span className="text-gray-400 text-sm">Precio / hora</span>
                <div className="text-3xl font-bold text-white">
                  {dj.precio}€
                </div>
              </div>
              <div className="text-green-400 text-sm font-bold flex items-center gap-1">
                <CheckCircle size={14} /> Disponible
              </div>
            </div>

            <form onSubmit={manejarReserva} className="space-y-4">
              {/* TIPO DE EVENTO */}
              <div className="space-y-1">
                <label className="text-gray-300 text-sm">Tipo de Evento</label>
                <div className="relative">
                  <PartyPopper
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <select
                    className="glass-input w-full pl-10 bg-[#0a0a0a]/50 text-white"
                    value={tipoEvento}
                    onChange={(e) => setTipoEvento(e.target.value)}
                  >
                    <option value="Fiesta Privada">Fiesta Privada</option>
                    <option value="Boda">Boda</option>
                    <option value="Club / Discoteca">Club / Discoteca</option>
                    <option value="Evento Corporativo">
                      Evento Corporativo
                    </option>
                  </select>
                </div>
              </div>

              {/* LUGAR DEL EVENTO */}
              <div className="space-y-1">
                <label className="text-gray-300 text-sm">Ubicación</label>
                <div className="relative">
                  <MapPin
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    size={16}
                  />
                  <input
                    type="text"
                    className="glass-input w-full pl-10 bg-[#0a0a0a]/50 text-white"
                    placeholder="Ej: Sala Caracol, Madrid"
                    value={lugar}
                    onChange={(e) => setLugar(e.target.value)}
                    required
                  />
                </div>
              </div>

              {/* FECHA Y HORA (En 2 columnas) */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-300 text-sm">Fecha</label>
                  <div className="relative">
                    <Calendar
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <input
                      type="date"
                      className="glass-input w-full pl-10 bg-[#0a0a0a]/50 text-white text-sm"
                      onChange={(e) => setFecha(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-gray-300 text-sm">Hora inicio</label>
                  <div className="relative">
                    <Clock
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                      size={16}
                    />
                    <input
                      type="time"
                      className="glass-input w-full pl-10 bg-[#0a0a0a]/50 text-white text-sm"
                      value={horaInicio}
                      onChange={(e) => setHoraInicio(e.target.value)}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* HORAS DE DURACIÓN */}
              <div className="space-y-1">
                <label className="text-gray-300 text-sm">Duración</label>
                <select
                  className="glass-input w-full bg-[#0a0a0a]/50 text-white"
                  onChange={(e) => setHoras(e.target.value)}
                  value={horas}
                >
                  {[2, 3, 4, 5, 6, 8].map((h) => (
                    <option key={h} value={h} className="bg-black">
                      {h} horas de set
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-between text-white font-bold text-lg pt-4 border-t border-white/10">
                <span>Total</span>
                <span className="text-primary">{dj.precio * horas}€</span>
              </div>

              <button
                type="submit"
                disabled={enviando}
                className="btn-primary w-full py-3 rounded-xl font-bold mt-4"
              >
                {enviando ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Reservar Ahora"
                )}
              </button>

              <div className="flex gap-2 items-center justify-center mt-4 opacity-60">
                <ShieldCheck size={14} className="text-green-400" />
                <p className="text-xs text-gray-400">Pago 100% protegido</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
