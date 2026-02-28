import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Disc,
  Mail,
  Lock,
  User,
  Loader2,
  ArrowRight,
  Headphones,
  Music2,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function Register() {
  // ESTADOS LOCALES (State)
  // Campos del formulario
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // userType: Puede ser "client" o "dj".
  // Controla colores, imágenes y a qué endpoint de la API llamaremos.
  const [userType, setUserType] = useState("client");
  const [cargando, setCargando] = useState(false);

  // CONEXIÓN CONTEXTO: Extraemos la función register del AuthContext.
  const { registrarUsuario } = useAuth();
  const navegar = useNavigate();

  // ==========================================
  // FUNCIÓN: handleSubmit
  // FLUJO: Recoge los datos del estado y los envía al AuthContext.
  // El contexto decidirá si llamar a /registro/cliente o /registro/dj en el backend.
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);

    try {
      await registrarUsuario(
        {
          nombre: name,
          email,
          password,
        },
        userType,
      );

      // Notificación personalizada según el rol
      toast.success(
        userType === "dj" ? "¡Bienvenido, Maestro! 🎚️" : "¡Cuenta creada! 🎟️",
      );

      // Tras el registro exitoso, el AuthContext ya nos habrá logueado automáticamente.
      navegar("/");
    } catch (err) {
      console.error(err);
      // Mostramos el mensaje de error que viene directamente de C# (ej: "El email ya existe").
      toast.error(err.response?.data || "Error al registrarse.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* FONDOS ANIMADOS DINÁMICOS
          FLUJO: Si eliges DJ, los orbes de luz se vuelven Violetas (Primary). 
          Si eliges Fan, se vuelven Azules (Secondary). */}
      <div
        className={`absolute top-[-10%] left-[-10%] w-96 h-96 rounded-full blur-3xl animate-pulse transition-colors duration-700 
        ${userType === "dj" ? "bg-primary/30" : "bg-secondary/30"}`}
      />
      <div
        className={`absolute bottom-[-10%] right-[-10%] w-96 h-96 rounded-full blur-3xl animate-pulse delay-1000 transition-colors duration-700
        ${userType === "dj" ? "bg-secondary/20" : "bg-primary/20"}`}
      />

      <div className="flex w-full max-w-5xl h-[700px] glass-panel rounded-3xl overflow-hidden shadow-2xl relative z-10">
        {/* LADO IZQUIERDO: Formulario de entrada */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Crea tu cuenta
            </h2>
            <p className="text-gray-400">Elige tu perfil para comenzar.</p>
          </div>

          {/* SELECTOR DE ROL (User Experience)
              Cambia el estado 'userType', lo que dispara todas las transiciones visuales de la página. */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => setUserType("client")}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2 group
                ${
                  userType === "client"
                    ? "bg-secondary/20 border-secondary text-white shadow-lg shadow-secondary/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
            >
              <Headphones
                size={28}
                className={
                  userType === "client" ? "text-secondary" : "text-gray-500"
                }
              />
              <span className="font-bold text-sm">Soy Fan</span>
            </button>

            <button
              type="button"
              onClick={() => setUserType("dj")}
              className={`p-4 rounded-xl border transition-all duration-300 flex flex-col items-center gap-2
                ${
                  userType === "dj"
                    ? "bg-primary/20 border-primary text-white shadow-lg shadow-primary/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                }`}
            >
              <Music2
                size={28}
                className={userType === "dj" ? "text-primary" : "text-gray-500"}
              />
              <span className="font-bold text-sm">Soy DJ</span>
            </button>
          </div>

          {/* FORMULARIO */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Nombre Completo
              </label>
              <div className="relative">
                <User
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Ej: Laura García"
                  className="glass-input pl-12"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="glass-input pl-12"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Contraseña
              </label>
              <div className="relative">
                <Lock
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="glass-input pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
              </div>
            </div>

            {/* BOTÓN DINÁMICO
                FLUJO: Cambia su gradiente (Primary vs Secondary) según el rol. */}
            <button
              type="submit"
              disabled={cargando}
              className={`w-full flex items-center justify-center gap-2 mt-6 py-3 px-6 rounded-xl text-white font-bold transition-transform hover:scale-[1.02] shadow-lg
                ${
                  userType === "dj"
                    ? "bg-linear-to-r from-primary to-purple-600 shadow-primary/25"
                    : "bg-linear-to-r from-secondary to-cyan-600 shadow-secondary/25"
                }`}
            >
              {cargando ? <Loader2 className="animate-spin" /> : "Crear Cuenta"}
              {!cargando && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-400 text-sm">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-white font-semibold hover:underline decoration-secondary transition-all"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>

        {/* LADO DERECHO: Panel Inspiracional (Solo escritorio)
            FLUJO: Aquí la imagen de fondo y los textos cambian al 100% según el 'userType'. */}
        <div className="hidden md:flex w-1/2 bg-black/40 relative items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-black/60 to-transparent z-10" />

          <img
            src={
              userType === "dj"
                ? "images/FotoRegistroDJ.jpg"
                : "images/FotoRegistroFan.avif"
            }
            alt="Background"
            className="absolute inset-0 w-full h-full object-cover opacity-70 transition-opacity duration-700"
          />

          <div className="relative z-20 text-center p-10">
            <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-6 border border-white/20">
              {/* El vinilo gira más lento para dar un toque elegante */}
              <Disc
                size={40}
                className={`animate-spin-slow ${userType === "dj" ? "text-primary" : "text-secondary"}`}
              />
            </div>
            <h3 className="text-4xl font-bold text-white mb-4">
              {userType === "dj" ? "Domina la pista" : "Vive la fiesta"}
            </h3>
            <p className="text-gray-300 text-lg max-w-xs mx-auto">
              {userType === "dj"
                ? "Gestiona tus bolos, conecta con locales y haz crecer tu carrera."
                : "Encuentra los mejores DJs para tus eventos privados o fiestas."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
