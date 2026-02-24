import { useNavigate } from "react-router-dom";
import { MapPin, Star, Music } from "lucide-react";

/**
 * PROPS: Recibe un dj como objeto.
 */
export default function DJCard({ dj }) {
  const navigate = useNavigate();

  // ==========================================
  // Mapeo de datos
  // Si no hay datos, se usan valores por defecto.
  // ==========================================

  // Prioriza el nombre artístico definido en 'DjPerfiles', si no, usa el nombre de usuario.
  const name = dj.nombreArtistico || dj.nombre || "DJ Desconocido";

  // Si el DJ no ha subido foto a Cloudinary, usamos una imagen local por defecto.
  const image = dj.foto || "/images/FotoEjemploDj.jpg";

  // C# envía los géneros como un string separado por comas. Aquí sacamos solo el primero para la etiqueta.
  const genre = dj.generos ? dj.generos.split(",")[0] : "Varios";

  // La valoración proviene del cálculo automático que hace el Backend.
  const rating = dj.valoracionPromedio || 5.0;

  const location = dj.ubicacion || "Disponible en todo el mundo";

  return (
    <div
      // Al hacer clic, enviamos al usuario a la vista detalle.
      // Usamos el ID del DJ para que la página 'DJDetail' sepa a qué perfil llamar.
      onClick={() => navigate(`/dj/${dj.id}`)}
      className="glass-panel group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:-translate-y-2 hover:shadow-primary/20"
    >
      {/* SECCIÓN VISUAL (Imagen y Género) */}
      <div className="aspect-square overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Etiqueta de Género flotante (Usa el primer género del string) */}
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-secondary border border-white/10 flex items-center gap-1">
          <Music size={10} /> {genre}
        </div>

        {/* Overlay oscuro: Solo aparece al pasar el ratón para dar profundidad */}
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* SECCIÓN DE INFORMACIÓN */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white truncate mb-1">{name}</h3>

        <div className="flex items-center justify-between text-sm text-gray-400">
          {/* Ubicación (Normalizada arriba) */}
          <div className="flex items-center gap-1.5 overflow-hidden">
            <MapPin size={14} className="text-primary shrink-0" />
            <span className="truncate">{location}</span>
          </div>

          {/* Valoración: Muestra la media de estrellas calculada en C# */}
          <div className="flex items-center gap-1 bg-yellow-500/10 px-2 py-0.5 rounded text-yellow-400">
            <Star size={12} fill="currentColor" />
            <span className="font-bold">{rating.toFixed(1)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
