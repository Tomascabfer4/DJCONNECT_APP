import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Disc, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify"; // Para alertas bonitas

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await login(email, password);
      toast.success("¡Bienvenido de nuevo! 🎧");
      navigate("/"); // Redirige al Home si todo va bien
    } catch (err) {
      console.error(err);
      toast.error("Email o contraseña incorrectos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Círculos de fondo animados (Efecto Aurora) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse delay-1000" />

      <div className="flex w-full max-w-5xl h-[600px] glass-panel rounded-3xl overflow-hidden shadow-2xl">
        {/* LADO IZQUIERDO: Formulario */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center relative z-10">
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-2">
              <img src="/logo.svg" alt="Logo" className="w-10 h-10" />

              <span className="text-2xl font-bold tracking-tight text-white">
                DJ CONNECT
              </span>
            </div>
            <h2 className="text-3xl font-bold mt-6 mb-2">
              Bienvenido de nuevo
            </h2>
            <p className="text-gray-400">
              Ingresa tus credenciales para acceder.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">
                Email
              </label>
              <div className="relative">
                <Mail
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="email"
                  placeholder="tu@email.com"
                  className="glass-input pl-12" // Padding left para el icono
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
                  size={20}
                />
                <input
                  type="password"
                  placeholder="••••••••"
                  className="glass-input pl-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Iniciar Sesión"
              )}
              {!loading && <ArrowRight size={20} />}
            </button>
          </form>

          <p className="mt-8 text-center text-gray-400 text-sm">
            ¿No tienes cuenta?{" "}
            <Link
              to="/registro"
              className="text-primary hover:text-purple-400 font-semibold transition-colors"
            >
              Regístrate gratis
            </Link>
          </p>
        </div>

        {/* LADO DERECHO: Decoración (Solo visible en escritorio) */}
        <div className="hidden md:flex w-1/2 bg-black/20 items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-br from-primary/20 to-secondary/20 mix-blend-overlay" />
          <div className="text-center p-8 relative z-10">
            <h3 className="text-3xl font-bold mb-4 bg-clip-text text-transparent bg-linear-to-r from-white to-gray-400">
              Conecta. Crea. Vibra.
            </h3>
            <p className="text-gray-400 max-w-xs mx-auto">
              La plataforma definitiva para conectar DJs profesionales con los
              mejores eventos del mundo.
            </p>
          </div>
          {/* Círculos decorativos extra */}
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/40 rounded-full blur-2xl" />
          <div className="absolute bottom-1/4 left-1/4 w-40 h-40 bg-secondary/40 rounded-full blur-2xl" />
        </div>
      </div>
    </div>
  );
}
