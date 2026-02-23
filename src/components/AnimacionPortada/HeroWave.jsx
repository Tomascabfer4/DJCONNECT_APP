import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroWave() {
  const pathRef = useRef(null);

  useEffect(() => {
    // Animación simple: la onda se "estira" y respira
    gsap.to(pathRef.current, {
      scaleY: 1.5, // Se estira verticalmente
      transformOrigin: "center center",
      duration: 2,
      yoyo: true, // Va y vuelve
      repeat: -1, // Infinito
      ease: "sine.inOut",
    });
  }, []);

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[300px] -z-10 pointer-events-none opacity-40 mix-blend-screen">
      <svg
        viewBox="0 0 1440 320"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full drop-shadow-[0_0_15px_rgba(124,58,237,0.5)]"
      >
        {/* Definimos un gradiente para la línea */}
        <defs>
          <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(124, 58, 237, 0)" />
            <stop offset="50%" stopColor="#06B6D4" /> {/* Cyan en el centro */}
            <stop offset="100%" stopColor="rgba(124, 58, 237, 0)" />
          </linearGradient>
        </defs>

        {/* El Camino de la Onda (Wave Path) */}
        <path
          ref={pathRef}
          fill="none"
          stroke="url(#waveGradient)"
          strokeWidth="6"
          strokeLinecap="round"
          d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,138.7C672,117,768,107,864,122.7C960,139,1056,181,1152,192C1248,203,1344,181,1392,170.7L1440,160"
        />
      </svg>
    </div>
  );
}
