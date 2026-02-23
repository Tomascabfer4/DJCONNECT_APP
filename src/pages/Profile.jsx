import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { authAPI, djsAPI, portfolioAPI } from "../services/api";
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
  // CORRECCIÓN 1: Quitamos 'user' y 'login' porque no los usamos aquí
  const { isDJ } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("cuenta"); // "cuenta" | "artista"

  // ESTADOS - DATOS BÁSICOS (Usuario)
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    ubicacion: "",
  });
  const [fotoPreview, setFotoPreview] = useState(null);

  // ESTADOS - DATOS DJ (Solo si es DJ)
  const [djData, setDjData] = useState({
    nombreArtistico: "",
    bio: "",
    generos: "",
    precioPorHora: 50,
    aniosExperiencia: 0,
  });

  // ESTADOS - PORTFOLIO (Solo si es DJ)
  const [portfolio, setPortfolio] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 1. CARGAR DATOS AL ENTRAR
  useEffect(() => {
    const loadProfile = async () => {
      try {
        // A) Cargar datos básicos de Usuario
        const { data: userData } = await authAPI.getMe();
        setFormData({
          nombre: userData.nombre || "",
          telefono: userData.telefono || "",
          ubicacion: userData.ubicacion || "",
        });
        setFotoPreview(userData.foto);

        // B) Si es DJ, cargar datos extendidos y portfolio
        if (isDJ) {
          const { data: djProfile } = await djsAPI.getById(userData.id);
          setDjData({
            nombreArtistico: djProfile.nombreArtistico || "",
            bio: djProfile.bio || "",
            generos: djProfile.generosMusicales || "",
            precioPorHora: djProfile.precio || 0,
            aniosExperiencia: djProfile.aniosExperiencia || 0,
          });

          const { data: portfolioData } = await portfolioAPI.getByDj(
            userData.id,
          );
          setPortfolio(portfolioData);
        }
      } catch (error) {
        // CORRECCIÓN 2: Usamos 'error' para loguearlo en consola
        console.error("Error al cargar perfil:", error);
        toast.error("Error al cargar tu perfil");
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [isDJ]);

  // 2. GUARDAR DATOS BÁSICOS
  const handleUpdateBasic = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await authAPI.updateProfile(formData);
      toast.success("Datos personales actualizados");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al guardar datos personales");
    } finally {
      setSaving(false);
    }
  };

  // 3. GUARDAR DATOS DJ
  const handleUpdateDJ = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await djsAPI.updateDjProfile(djData);
      toast.success("Perfil de artista actualizado");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al guardar perfil de DJ");
    } finally {
      setSaving(false);
    }
  };

  // 4. SUBIR FOTO DE PERFIL
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("File", file);

    try {
      toast.info("Subiendo foto...");
      const { data } = await authAPI.uploadPhoto(form);
      setFotoPreview(data.url);
      toast.success("Foto de perfil actualizada");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al subir la foto");
    }
  };

  // 5. SUBIR ITEM AL PORTFOLIO
  const handleUploadPortfolio = async (e, tipo) => {
    const file = e.target.files[0];
    if (!file) return;

    const form = new FormData();
    form.append("File", file);
    form.append("Tipo", tipo);
    form.append("Titulo", file.name.split(".")[0]);

    setUploading(true);
    try {
      const { data } = await portfolioAPI.upload(form);
      setPortfolio([data, ...portfolio]);
      toast.success("Archivo añadido al portfolio");
    } catch (error) {
      console.error("Error subida:", error); // Usamos error
      toast.error("Error al subir archivo");
    } finally {
      setUploading(false);
    }
  };

  // 6. BORRAR ITEM PORTFOLIO
  const handleDeletePortfolio = async (id) => {
    if (!confirm("¿Seguro que quieres borrar este archivo?")) return;
    try {
      await portfolioAPI.delete(id);
      setPortfolio(portfolio.filter((p) => p.id !== id));
      toast.success("Archivo eliminado");
    } catch (error) {
      console.error(error); // Usamos error
      toast.error("Error al eliminar");
    }
  };

  if (loading)
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
      {isDJ && (
        <div className="flex gap-4 mb-8 border-b border-white/10">
          <button
            onClick={() => setActiveTab("cuenta")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "cuenta" ? "border-primary text-white" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            Cuenta y Seguridad
          </button>
          <button
            onClick={() => setActiveTab("artista")}
            className={`pb-3 px-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "artista" ? "border-primary text-white" : "border-transparent text-gray-400 hover:text-white"}`}
          >
            Perfil de Artista (Público)
          </button>
        </div>
      )}

      {/* === TAB 1: DATOS CUENTA === */}
      {activeTab === "cuenta" && (
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
                    onChange={handleAvatarChange}
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
              onSubmit={handleUpdateBasic}
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
                    value={formData.nombre}
                    onChange={(e) =>
                      setFormData({ ...formData, nombre: e.target.value })
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
                    value={formData.telefono}
                    onChange={(e) =>
                      setFormData({ ...formData, telefono: e.target.value })
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
                    value={formData.ubicacion}
                    onChange={(e) =>
                      setFormData({ ...formData, ubicacion: e.target.value })
                    }
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="btn-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2"
              >
                {saving ? (
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
      {isDJ && activeTab === "artista" && (
        <div className="space-y-8">
          {/* FORMULARIO DJ */}
          <form
            onSubmit={handleUpdateDJ}
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
                  value={djData.nombreArtistico}
                  onChange={(e) =>
                    setDjData({ ...djData, nombreArtistico: e.target.value })
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
                  value={djData.bio}
                  onChange={(e) =>
                    setDjData({ ...djData, bio: e.target.value })
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
                  value={djData.generos}
                  onChange={(e) =>
                    setDjData({ ...djData, generos: e.target.value })
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
                      value={djData.precioPorHora}
                      onChange={(e) =>
                        setDjData({ ...djData, precioPorHora: e.target.value })
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
                    value={djData.aniosExperiencia}
                    onChange={(e) =>
                      setDjData({ ...djData, aniosExperiencia: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn-primary px-6 py-2 rounded-xl font-bold flex items-center gap-2"
            >
              {saving ? (
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
              {uploading && (
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
                  onChange={(e) => handleUploadPortfolio(e, "imagen")}
                  disabled={uploading}
                />
              </label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 transition-colors">
                <Film size={18} /> Subir Vídeo
                <input
                  type="file"
                  className="hidden"
                  accept="video/*"
                  onChange={(e) => handleUploadPortfolio(e, "video")}
                  disabled={uploading}
                />
              </label>
              <label className="cursor-pointer bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-xl flex items-center gap-2 text-gray-300 transition-colors">
                <Headphones size={18} /> Subir Audio
                <input
                  type="file"
                  className="hidden"
                  accept="audio/*"
                  onChange={(e) => handleUploadPortfolio(e, "musica")}
                  disabled={uploading}
                />
              </label>
            </div>

            {/* Grid de archivos subidos */}
            {portfolio.length === 0 ? (
              <p className="text-gray-500 italic text-sm">
                Aún no has subido contenido a tu portfolio.
              </p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {portfolio.map((item) => (
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
                        onClick={() => handleDeletePortfolio(item.id)}
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
