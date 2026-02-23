import { useNavigate } from "react-router-dom";
import { MapPin, Star, Music } from "lucide-react";

export default function DJCard({ dj }) {
  const navigate = useNavigate();

  // Mapeo seguro de datos (por si la API devuelve null en algún campo)
  const name = dj.nombreArtistico || dj.nombre || "DJ Desconocido";
  // Usamos una imagen por defecto si no tiene foto
  const image = dj.foto || "/images/FotoEjemploDj.jpg";
  const genre = dj.generos ? dj.generos.split(",")[0] : "Varios";
  const rating = dj.valoracionPromedio || 5.0;
  const location = dj.ubicacion || "Disponible en todo el mundo";

  return (
    <div
      onClick={() => navigate(`/dj/${dj.id}`)}
      className="glass-panel group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
    >
      {/* Imagen con Overlay al hacer hover */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Etiqueta de Género flotante */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-secondary border border-white/10 flex items-center gap-1">
          <Music size={10} /> {genre}
        </div>

        {/* Overlay oscuro al pasar el ratón */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Info del DJ */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white truncate mb-1">{name}</h3>

        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
