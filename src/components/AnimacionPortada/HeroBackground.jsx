import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import LogoVinyl from "./LogoVinyl";
import HeroFloatingElements from "./HeroFloatingElements";
import HeroWave from "./HeroWave";

// RUTAS DE LAS IMÁGENES
const DJ_TEXT_SRC = "/images/dj-text.png"; // Tu imagen de texto
const DJ_LOGO_SRC = "/logo.svg"; // Tu nueva imagen

export default function HeroBackground() {
  const containerRef = useRef(null);
  const glowRef = useRef(null);
  const wrapperRef = useRef(null);

  // Refs para los 3 elementos de la secuencia
  const logoVinylRef = useRef(null); // 0. El Vinilo animado
  const textRef = useRef(null); // 1. El Texto
  const iconRef = useRef(null); // 2. El Nuevo Logo (Icono)

  const wave1Ref = useRef(null);
  const wave2Ref = useRef(null);
  const wave3Ref = useRef(null);

  // Estado para el ciclo (aunque no lo usemos en el return, es necesario para el loop)
  // Usamos _ para indicar que la variable de lectura no se usa explícitamente
  const [_, setActiveIndex] = useState(0);

  useEffect(() => {
    // === 1. MOVIMIENTO DEL MOUSE ===
    const handleMouseMove = (e) => {
      if (!glowRef.current || !wrapperRef.current) return;
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;

      gsap.to(glowRef.current, {
        x: clientX,
        y: clientY,
        duration: 0.8,
        ease: "power2.out",
      });

      const xPos = clientX / innerWidth - 0.5;
      const yPos = clientY / innerHeight - 0.5;

      gsap.to(wrapperRef.current, {
        rotationY: xPos * 50,
        rotationX: -yPos * 50,
        x: xPos * 40,
        y: yPos * 40,
        transformPerspective: 600,
        transformOrigin: "center center",
        duration: 0.8,
        ease: "power2.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    const ctx = gsap.context(() => {
      // === 2. CONFIGURACIÓN INICIAL ===
      gsap.set(textRef.current, {
        autoAlpha: 0,
        scale: 0.5,
        filter: "blur(10px)",
      });
      gsap.set(iconRef.current, {
        autoAlpha: 0,
        scale: 0.5,
        filter: "blur(10px)",
      });

      // El Vinilo empieza visible
      gsap.set(logoVinylRef.current, {
        autoAlpha: 1,
        scale: 1,
        filter: "blur(0px)",
      });

      // Entrada inicial del Vinilo
      gsap.from(logoVinylRef.current, {
        rotation: -360,
        scale: 0,
        opacity: 0,
        duration: 1.5,
        ease: "back.out(1.7)",
      });

      // Animación de ondas (fondo)
      const wavesTl = gsap.timeline({ repeat: -1 });

      // EL LATIDO (Heartbeat)
      gsap.to(glowRef.current, {
        scale: 1.2,
        opacity: 0.8,
        duration: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      [wave1Ref.current, wave2Ref.current, wave3Ref.current].forEach(
        (wave, i) => {
          wavesTl.fromTo(
            wave,
            { scale: 0.8, opacity: 0.8, borderWidth: "5px" },
            {
              scale: 4.5,
              opacity: 0,
              borderWidth: "0px",
              duration: 3,
              ease: "expo.out",
              immediateRender: false,
            },
            i * 0.8,
          );
        },
      );
    }, containerRef);

    // === 3. CICLO DE SECUENCIA ===
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => {
        const elements = [
          logoVinylRef.current,
          textRef.current,
          iconRef.current,
        ];

        // Colores correspondientes a cada estado
        const glowColors = [
          "rgba(124, 58, 237, 0.3)", // Purple (Primary)
          "rgba(6, 182, 212, 0.3)", // Cyan (Secondary)
          "rgba(236, 72, 153, 0.3)", // Pink (Party)
        ];

        const currentIndex = prevIndex;
        const nextIndex = (prevIndex + 1) % 3;

        const outgoing = elements[currentIndex];
        const incoming = elements[nextIndex];

        // Animación de SALIDA
        gsap.to(outgoing, {
          autoAlpha: 0,
          scale: 2,
          filter: "blur(20px)",
          duration: 0.6,
          ease: "power2.in",
        });

        // Animación de ENTRADA
        gsap.fromTo(
          incoming,
          { autoAlpha: 0, scale: 0, filter: "blur(10px)" },
          {
            autoAlpha: 1,
            scale: 1,
            filter: "blur(0px)",
            duration: 1,
            ease: "elastic.out(1, 0.5)",
            delay: 0.1,
          },
        );

        // CAMBIO DE COLOR DE LA LUZ
        gsap.to(glowRef.current, {
          background: `radial-gradient(circle, ${glowColors[nextIndex]} 0%, rgba(6, 182, 212, 0.05) 50%, transparent 70%)`,
          duration: 1.5,
          ease: "sine.inOut",
        });

        return nextIndex;
      });
    }, 4000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(interval);
      ctx.revert();
    };
  }, []);

  const waveStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "50%",
    border: "2px solid rgba(124, 58, 237, 0.6)",
    pointerEvents: "none",
    zIndex: -1,
    boxShadow: "0 0 50px rgba(124, 58, 237, 0.3) inset",
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        overflow: "hidden",
        background: "#000000",
        zIndex: 0,
      }}
    >
      {/* FONDO CUADRÍCULA */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
          linear-gradient(rgba(124, 58, 237, 0.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(124, 58, 237, 0.1) 1px, transparent 1px)
        `,
          backgroundSize: "100px 100px",
          maskImage:
            "radial-gradient(circle at center, black 20%, transparent 100%)",
          opacity: 0.8,
        }}
      />

      <HeroFloatingElements />

      <div
        ref={glowRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "1000px",
          height: "1000px",
          background:
            "radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, rgba(6, 182, 212, 0.1) 50%, transparent 70%)",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
          mixBlendMode: "screen",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "45%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "600px",
          height: "600px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          perspective: "600px",
        }}
      >
        <div
          ref={wave1Ref}
          style={{ ...waveStyle, width: "100%", height: "100%" }}
        />
        <div
          ref={wave2Ref}
          style={{ ...waveStyle, width: "100%", height: "100%" }}
        />
        <div
          ref={wave3Ref}
          style={{ ...waveStyle, width: "100%", height: "100%" }}
        />

        <HeroWave />

        {/* WRAPPER 3D DONDE OCURRE LA MAGIA */}
        <div
          ref={wrapperRef}
          style={{
            position: "relative",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            transformStyle: "preserve-3d",
            willChange: "transform",
          }}
        >
          {/* 1. EL VINILO */}
          <div
            ref={logoVinylRef}
            style={{
              position: "absolute",
              width: "420px",
              zIndex: 10,
              filter: "drop-shadow(0 50px 50px rgba(0,0,0,0.8))",
            }}
          >
            <LogoVinyl />
          </div>

          {/* 2. EL TEXTO */}
          <img
            ref={textRef}
            src={DJ_TEXT_SRC}
            alt="DJ Connect Text"
            style={{
              position: "absolute",
              width: "600px",
              maxWidth: "95vw",
              height: "auto",
              zIndex: 10,
              opacity: 0,
              filter: "drop-shadow(0 50px 50px rgba(0,0,0,0.8))",
            }}
          />

          {/* 3. EL NUEVO LOGO (ICONO) */}
          <img
            ref={iconRef}
            src={DJ_LOGO_SRC}
            alt="DJ Logo Icon"
            style={{
              position: "absolute",
              width: "350px",
              height: "auto",
              zIndex: 10,
              opacity: 0,
              filter: "drop-shadow(0 50px 50px rgba(0,0,0,0.8))",
            }}
          />
        </div>
      </div>
    </div>
  );
}
