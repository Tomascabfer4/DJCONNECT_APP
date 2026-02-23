import { Music, Star, Zap, Circle, Hexagon, Triangle } from "lucide-react";

// Configuración de los elementos flotantes (CONSTANTES FIJAS)
const ELEMENTS = [
  {
    Icon: Music,
    top: "15%",
    left: "10%",
    delay: "0s",
    color: "#7C3AED",
    size: 32,
  },
  {
    Icon: Star,
    top: "25%",
    left: "85%",
    delay: "1s",
    color: "#F59E0B",
    size: 24,
  },
  {
    Icon: Zap,
    top: "65%",
    left: "15%",
    delay: "2s",
    color: "#06B6D4",
    size: 28,
  },
  {
    Icon: Circle,
    top: "80%",
    left: "80%",
    delay: "1.5s",
    color: "#EC4899",
    size: 20,
  },
  {
    Icon: Music,
    top: "45%",
    left: "92%",
    delay: "3s",
    color: "#8B5CF6",
    size: 24,
  },
  {
    Icon: Star,
    top: "85%",
    left: "35%",
    delay: "0.5s",
    color: "#10B981",
    size: 20,
  },
  {
    Icon: Hexagon,
    top: "10%",
    left: "50%",
    delay: "4s",
    color: "#6366F1",
    size: 18,
  },
  {
    Icon: Triangle,
    top: "50%",
    left: "5%",
    delay: "2.5s",
    color: "#EC4899",
    size: 22,
  },
];

export default function HeroFloatingElements() {
  // ELIMINADO: No necesitamos useState ni useEffect.
  // Al ser datos estáticos, se puede renderizar directamente sin provocar el error.

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {ELEMENTS.map((El, index) => (
        <div
          key={index}
          className="absolute"
          style={{
            top: El.top,
            left: El.left,
            color: El.color,
            opacity: 0.6,
            animation: `float 6s ease-in-out infinite`,
            animationDelay: El.delay,
          }}
        >
          <El.Icon size={El.size} />
        </div>
      ))}

      {/* Definimos la animación de flotación aquí mismo */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(10deg); }
        }
      `}</style>
    </div>
  );
}
