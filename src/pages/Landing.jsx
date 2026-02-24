import { useLayoutEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Music, ShieldCheck, Zap, Disc } from "lucide-react";
import HeroBackground from "../components/AnimacionPortada/HeroBackground";

gsap.registerPlugin(ScrollTrigger);

export default function Landing() {
  const navigate = useNavigate();
  const comp = useRef(null);
  const bgRef = useRef(null);
  const contentRef = useRef(null);
  const navRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      // 1. ANIMACIÓN DEL FONDO (EL "APAGADO DE CINE")
      gsap.to(bgRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top bottom",
          end: "top top",
          scrub: true,
        },
        opacity: 0.2,
        filter: "blur(15px)",
        scale: 1.1,
      });

      // 2. ANIMACIÓN DE LA NAVBAR
      gsap.from(navRef.current, {
        scrollTrigger: {
          trigger: contentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
        y: -100,
        autoAlpha: 0,
        duration: 0.5,
      });

      // 3. ENTRADA DEL TEXTO HERO
      const heroTl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero-title",
          start: "top 80%",
        },
      });

      heroTl
        .from("#hero-title", {
          y: 100,
          opacity: 0,
          duration: 1,
          ease: "power4.out",
        })
        .from(
          "#hero-subtitle",
          {
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.6",
        )
        .from(
          ".hero-btn",
          {
            y: 20,
            opacity: 0,
            stagger: 0.2,
            duration: 0.5,
          },
          "-=0.4",
        );

      // 4. FEATURE CARDS
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: "#features",
          start: "top 80%",
        },
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "back.out(1.7)",
      });
    }, comp);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={comp} className="relative bg-transparent overflow-x-hidden">
      {/* === FONDO FIJO === */}
      <div ref={bgRef} className="fixed inset-0 -z-20 w-full h-full">
        <HeroBackground />
      </div>

      {/* === NAVBAR === */}
      <nav ref={navRef} className="fixed top-0 w-full z-50 px-6 py-4 invisible">
        <div className="max-w-7xl mx-auto glass-panel rounded-full px-6 py-3 flex justify-between items-center border border-white/10 backdrop-blur-md">
          <div className="flex items-center gap-2">
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-10 h-10 rounded-full"
            />
            <span className="font-bold text-xl tracking-tight text-white">
              DJ CONNECT
            </span>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
            >
              Entrar
            </button>
            <button
              onClick={() => navigate("/registro")}
              className="px-4 py-2 bg-primary hover:bg-primary/80 rounded-full text-sm font-bold transition-all text-white shadow-lg shadow-primary/20"
            >
              Registrarse
            </button>
          </div>
        </div>
      </nav>

      {/* === SECCIÓN 1: INTRO SPACER === */}
      <section className="h-screen w-full flex flex-col items-center justify-end pb-12 relative z-0">
        <div className="flex flex-col items-center gap-2 animate-bounce opacity-70">
          <span className="text-xs font-medium tracking-[0.2em] text-gray-400 uppercase">
            Scroll para explorar
          </span>
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
          </div>
        </div>
      </section>

      {/* === SECCIÓN 2: CONTENIDO PRINCIPAL === */}
      <div ref={contentRef} className="relative z-10 w-full">
        {/* HERO CONTENT */}
        <section className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 pb-20 bg-linear-to-b from-transparent via-darker/50 to-darker">
          <div className="max-w-4xl space-y-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/40 border border-white/10 backdrop-blur-xl mb-4">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
                La plataforma #1 para eventos
              </span>
            </div>

            <h1
              id="hero-title"
              className="text-6xl md:text-8xl font-black leading-tight tracking-tight text-white drop-shadow-2xl"
            >
              Siente el <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-primary via-purple-400 to-secondary">
                Ritmo Real
              </span>
            </h1>

            <p
              id="hero-subtitle"
              className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto leading-relaxed drop-shadow-md bg-black/20 p-4 rounded-2xl backdrop-blur-sm"
            >
              Conectamos a los mejores <strong>DJs</strong> con organizadores de
              eventos y amantes de la música. Sin intermediarios, todo directo.
            </p>
          </div>
        </section>

        <section className="relative z-20 -mt-20 pb-32 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Contenedor con efecto Glass + Glow detrás */}
            <div className="relative group">
              {/* Glow morado detrás de la imagen */}
              <div className="absolute -inset-1 bg-linear-to-r from-primary to-secondary rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200"></div>

              {/* La Imagen del Dashboard */}
              <div className="relative rounded-2xl bg-black/80 border border-white/10 p-2 shadow-2xl backdrop-blur-sm transform transition-transform duration-500 hover:scale-[1.01] hover:-translate-y-2">
                {/* Barra de ventana estilo navegador (Detalle Pro) */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5 rounded-t-xl">
                  <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
                  {/* Barra de dirección falsa */}
                  <div className="ml-4 px-3 py-1 rounded-md bg-black/50 text-[10px] text-gray-500 font-mono flex-1 text-center border border-white/5">
                    djconnect.app/dashboard
                  </div>
                </div>

                {/* TU CAPTURA DE PANTALLA AQUÍ */}
                <img
                  src="/images/DashboardPreview.png"
                  alt="Interfaz de DJ Connect"
                  className="w-full rounded-b-xl opacity-90 hover:opacity-100 transition-opacity"
                  // Si no tienes la foto aún, usa este placeholder:
                  onError={(e) =>
                    (e.currentTarget.src =
                      "https://cdn.dribbble.com/userupload/12569768/file/original-090d0b073530030500a43093c403932e.png?resize=1504x1128")
                  }
                />
              </div>
            </div>

            {/* MARCA DE CONFIANZA (Pequeño detalle abajo) */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 uppercase tracking-widest mb-6 font-semibold">
                Usado por los mejores clubs de Europa
              </p>
              <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                {/* Iconos o Logos SVG simples como placeholders */}
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Zap size={24} /> THUNDER CLUB
                </div>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Disc size={24} /> VINYL ROOM
                </div>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <Music size={24} /> SOUNDWAVE
                </div>
                <div className="flex items-center gap-2 text-xl font-bold">
                  <ShieldCheck size={24} /> SAFE HOUSE
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* RESTO DE LA PÁGINA */}
        <div className="bg-darker border-t border-white/5 shadow-[0_-50px_100px_rgba(0,0,0,0.8)] relative">
          <section id="features" className="py-32 relative">
            <div className="max-w-7xl mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="feature-card glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 bg-primary/20 rounded-2xl flex items-center justify-center mb-6 text-primary">
                    <Music size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Talento Puro
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Accede a un catálogo exclusivo de DJs verificados. Filtra
                    por género, ubicación y escucha sus sets antes de reservar.
                  </p>
                </div>

                <div className="feature-card glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300 border-primary/30 relative">
                  <div className="absolute -top-4 -right-4 bg-linear-to-r from-primary to-secondary px-4 py-1 rounded-full text-xs font-bold uppercase shadow-lg text-white">
                    Popular
                  </div>
                  <div className="w-14 h-14 bg-secondary/20 rounded-2xl flex items-center justify-center mb-6 text-secondary">
                    <Zap size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Reserva Instantánea
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Olvídate de emails interminables. Consulta disponibilidad en
                    tiempo real y cierra la contratación en segundos.
                  </p>
                </div>

                <div className="feature-card glass-panel p-8 rounded-3xl hover:-translate-y-2 transition-transform duration-300">
                  <div className="w-14 h-14 bg-green-500/20 rounded-2xl flex items-center justify-center mb-6 text-green-400">
                    <ShieldCheck size={32} />
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-white">
                    Pagos Seguros
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    Tu dinero está protegido. El pago se libera al DJ solo
                    cuando el evento se ha realizado con éxito.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto glass-panel rounded-[3rem] p-12 md:p-24 text-center relative overflow-hidden border border-white/10">
              <div className="absolute inset-0 bg-linear-to-r from-primary/20 to-secondary/20 blur-3xl -z-10" />
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white">
                ¿Listo para sonar fuerte?
              </h2>
              <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
                Únete a miles de artistas y organizadores que ya están cambiando
                la escena nocturna.
              </p>
              <button
                onClick={() => navigate("/registro")}
                className="btn-primary text-xl px-12 py-5 shadow-2xl shadow-primary/40 hover:shadow-primary/60"
              >
                Crear Cuenta Gratis
              </button>
            </div>
          </section>

          <footer className="border-t border-white/10 py-12 text-center text-gray-500 text-sm">
            <div className="flex items-center justify-center gap-2 mb-4 opacity-50 text-white">
              <Disc size={20} />
              <span className="font-bold">DJ CONNECT</span>
            </div>
            <p>© 2026 DJCONNECT. Creado con ❤️ y mucho Café.</p>
          </footer>
        </div>
      </div>
    </div>
  );
}
