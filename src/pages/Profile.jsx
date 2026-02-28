import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { apiAutenticacion, apiDjs, apiPortafolio } from "../services/api";
import { toast } from "react-toastify";
import {
  User,
  Camera,
  Save,
  Music,
  DollarSign,
  Loader2,
  Trash2,
  UploadCloud,
  Film,
  Image as ImageIcon,
  Headphones,
} from "lucide-react";

export default function Profile() {
  const { esDJ } = useAuth();
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [pestanaActiva, setPestanaActiva] = useState("cuenta"); // "cuenta" | "artista"

  // ESTADOS - DATOS BÁSICOS (Usuario)
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: "",
    telefono: "",
    ubicacion: "",
  });
  const [fotoPreview, setFotoPreview] = useState(null);

  // ESTADOS - DATOS DJ (Solo si es DJ)
  const [datosDj, setDatosDj] = useState({
    nombreArtistico: "",
    bio: "",
    generos: "",
    precioPorHora: 50,
    aniosExperiencia: 0,
  });

  // ESTADOS - PORTFOLIO (Solo si es DJ)
  const [portafolio, setPortafolio] = useState([]);
  const [subiendo, setSubiendo] = useState(false);

  // 1. CARGAR DATOS AL ENTRAR
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        // A) Cargar datos básicos de Usuario
        const { data: userData } = await apiAutenticacion.obtenerUsuarioActual();
        setDatosFormulario({
          nombre: userData.nombre || "",
          telefono: userData.telefono || "",
          ubicacion: userData.ubicacion || "",
        });
        setFotoPreview(userData.foto);

        // B) Si es DJ, cargar datos extendidos y portafolio
        if (esDJ) {
          const { data: djProfile } = await apiDjs.obtenerPorId(userData.id);
          setDatosDj({
            nombreArtistico: djProfile.nombreArtistico || "",
            bio: djProfile.bio || "",
            generos: djProfile.generosMusicales || "",
            precioPorHora: djProfile.precio || 0,
            aniosExperiencia: djProfile.aniosExperiencia || 0,
          });

          const { data: portfolioData } = await apiPortafolio.obtenerPorDj(
            userData.id,
          );
          setPortafolio(portfolioData);
        }
      } catch (error) {
        // CORRECCIÓN 2: Usamos 'error' para loguearlo en consola
        console.error("Error al cargar perfil:", error);
        toast.error("Error al cargar tu perfil");
      } finally {
        setCargando(false);
      }
    };
    cargarPerfil();
  }, [esDJ]);

  // 2. GUARDAR DATOS BÁSICOS
  const manejarActualizacionBasica = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await apiAutenticacion.actualizarPerfil(datosFormulario);
      toast.success("Datos personales actualizados");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al guardar datos personales");
    } finally {
      setGuardando(false);
    }
  };

  // 3. GUARDAR DATOS DJ
  const manejarActualizacionDj = async (e) => {
    e.preventDefault();
    setGuardando(true);
    try {
      await apiDjs.actualizarPerfilDj(datosDj);
      toast.success("Perfil de artista actualizado");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al guardar perfil de DJ");
    } finally {
      setGuardando(false);
    }
  };

  // 4. SUBIR FOTO DE PERFIL
  const manejarCambioAvatar = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("File", file);

    try {
      toast.info("Subiendo foto...");
      const { data } = await apiAutenticacion.subirFoto(form);
      setFotoPreview(data.url);
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al subir la foto");
    }
  };

  // 5. SUBIR ITEM AL PORTFOLIO
  const manejarSubidaPortafolio = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("File", file);
    form.append("Tipo", tipo);
    form.append("Titulo", file.name.split(".")[0]);

    setSubiendo(true);
    try {
      const { data } = await apiPortafolio.subir(form);
      setPortafolio([data, ...portafolio]);
      toast.success("Archivo añadido al portafolio");
    } catch (error) {
      console.error("Error subida:", error); // Usamos error
      toast.error("Error al subir archivo");
    } finally {
      setSubiendo(false);
    }
  };

  // 6. BORRAR ITEM PORTFOLIO
  const manejarEliminarPortafolio = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este archivo?")) return;
    try {
      await apiPortafolio.eliminar(id);
      setPortafolio(portafolio.filter((p) => p.id !== id));
      toast.success("Archivo eliminado");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al eliminar");
    }
  };

  if (cargando)
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );

  return (
    <div className="max-w-4xl mx-auto pb-20 pt-6 px-4 animate-fade-in">
      <h1 className="text-3xl font-bold text-white mb-6">
        Configuración de Perfil
      </h1>

      {/* TABS (Solo si es DJ) */}
      {esDJ && (
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setPestanaActiva("cuenta")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${pestanaActiva === "cuenta" ? "border-primary text-white" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            Cuenta y Seguridad
          </button>
          <button
            onClick={() => setPestanaActiva("artista")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${pestanaActiva === "artista" ? "border-primary text-white" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            Perfil de Artista (Público)
          </button>
        </div>
      )}

      {/* === TAB 1: DATOS CUENTA === */}
      {pestanaActiva === "cuenta" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* FOTO DE PERFIL */}
          <div className="md:col-span-1">
            <div className="glass-panel p-6 rounded-3xl text-center">
              <div className="relative w-32 h-32 mx-auto mb-4 group">
                <img
                  src={fotoPreview || "/images/default-avatar.png"}
                  alt="Avatar"
                  className="w-full h-full rounded-full object-cover border-4 border-white/10 group-hover:border-primary/50 transition-colors"
                />
                <label className="absolute bottom-0 right-0 bg-primary p-2 rounded-full cursor-pointer hover:bg-primary/80 transition-colors shadow-lg">
                  <Camera size={16} className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={manejarCambioAvatar}
                  />
                </label>
              </div>
              <p className="text-sm text-gray-400">
                Haz clic en la cámara para cambiar tu foto.
              </p>
            </div>
          </div>

          {/* FORMULARIO DATOS */}
          <div className="md:col-span-2">
            <form
              onSubmit={manejarActualizacionBasica}
              className="glass-panel p-8 rounded-3xl space-y-6"
            >
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <User size={20} className="text-primary" /> Datos Personales
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    className="glass-input w-full bg-black/40 text-white"
                    value={datosFormulario.nombre}
                    onChange={(e) =>
                      setDatosFormulario({ ...datosFormulario, nombre: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    className="glass-input w-full bg-black/40 text-white"
                    value={datosFormulario.telefono}
                    onChange={(e) =>
                      setDatosFormulario({ ...datosFormulario, telefono: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Ciudad / Ubicación
                  </label>
                  <input
                    type="text"
                    className="glass-input w-full bg-black/40 text-white"
                    value={datosFormulario.ubicacion}
                    onChange={(e) =>
                      setDatosFormulario({ ...datosFormulario, ubicacion: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={guardando}
                className="btn-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                {guardando ? (
                  <Loader2 className="animate-spin" size={18} />
                ) : (
                  <Save size={18} />
                )}{" "}
                Guardar Cambios
              </button>
            </form>
          </div>
        </div>
      )}

      {/* === TAB 2: PERFIL ARTISTA (Solo DJ) === */}
      {esDJ && pestanaActiva === "artista" && (
        <div className="space-y-8">
          {/* FORMULARIO DJ */}
          <form
            onSubmit={manejarActualizacionDj}
            className="glass-panel p-8 rounded-3xl space-y-6"
          >
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Music size={20} className="text-secondary" /> Información
              Profesional
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 block mb-1">
                  Nombre Artístico
                </label>
                <input
                  type="text"
                  className="glass-input w-full bg-black/40 text-white font-bold text-lg"
                  value={datosDj.nombreArtistico}
                  onChange={(e) =>
                    setDatosDj({ ...datosDj, nombreArtistico: e.target.value })
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 block mb-1">
                  Biografía
                </label>
                <textarea
                  rows="4"
                  className="glass-input w-full bg-black/40 text-white"
                  placeholder="Cuéntanos tu historia, estilo y experiencia..."
                  value={datosDj.bio}
                  onChange={(e) =>
                    setDatosDj({ ...datosDj, bio: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="text-sm text-gray-400 block mb-1">
                  Géneros (separados por coma)
                </label>
                <input
                  type="text"
                  className="glass-input w-full bg-black/40 text-white"
                  placeholder="Techno, House, Pop..."
                  value={datosDj.generos}
                  onChange={(e) =>
                    setDatosDj({ ...datosDj, generos: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Precio / Hora (€)
                  </label>
                  <div className="relative">
                    <DollarSign
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                    />
                    <input
                      type="number"
                      className="glass-input w-full pl-10 bg-black/40 text-white"
                      value={datosDj.precioPorHora}
                      onChange={(e) =>
                        setDatosDj({ ...datosDj, precioPorHora: e.target.value })
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-1">
                    Años Exp.
                  </label>
                  <input
                    type="number"
                    className="glass-input w-full bg-black/40 text-white"
                    value={datosDj.aniosExperiencia}
                    onChange={(e) =>
                      setDatosDj({ ...datosDj, aniosExperiencia: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={guardando}
              className="btn-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              {guardando ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}{" "}
              Actualizar Ficha
            </button>
          </form>

          {/* PORTFOLIO MANAGER */}
          <div className="glass-panel p-8 rounded-3xl space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <UploadCloud size={20} className="text-blue-400" /> Portfolio
                Multimedia
              </h3>
              {subiendo && (
                <span className="text-sm text-blue-400 animate-pulse">
                  Subiendo archivo...
                </span>
              )}
            </div>

            {/* Botones de subida */}
            <div className="flex gap-4 mb-6">
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 transition-colors">
                <ImageIcon size={18} /> Subir Foto
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => manejarSubidaPortafolio(e, "imagen")}
                  disabled={subiendo}
                />
              </label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 transition-colors">
                <Film size={18} /> Subir Vídeo
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => manejarSubidaPortafolio(e, "video")}
                  disabled={subiendo}
                />
              </label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 transition-colors">
                <Headphones size={18} /> Subir Audio
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => manejarSubidaPortafolio(e, "musica")}
                  disabled={subiendo}
                />
              </label>
            </div>

            {/* Grid de archivos subidos */}
            {portafolio.length === 0 ? (
              <p className="text-gray-500 italic text-sm">
                Aún no has subido contenido a tu portafolio.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portafolio.map((item) => (
                  <div
                    key={item.id}
                    className="relative group aspect-square bg-black/50 rounded-xl overflow-hidden border border-white/10"
                  >
                    {/* Previsualización según tipo */}
                    {item.tipo === "imagen" && (
                      <img
                        src={item.url}
                        className="w-full h-full object-cover"
                        alt="Portfolio"
                      />
                    )}
                    {item.tipo === "video" && (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                    {item.tipo === "musica" && (
                      <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                        <Headphones size={32} />
                        <span className="text-xs mt-2 px-2 text-center truncate w-full">
                          {item.titulo}
                        </span>
                      </div>
                    )}

                    {/* Overlay de borrado */}
                    <div className="absolute inset-0 bg-red-500/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => manejarEliminarPortafolio(item.id)}
                        className="text-white flex flex-col items-center gap-1"
                      >
                        <Trash2 size={24} />
                        <span className="text-xs font-bold">Eliminar</span>
                      </button>
                    </div>

                    {/* Badge tipo */}
                    <div className="absolute top-2 left-2 bg-black/60 px-2 py-0.5 rounded text-[10px] text-white uppercase font-bold">
                      {item.tipo}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
