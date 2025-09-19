"use client";
import { useRef, useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import AnimatedText from "../components/AnimatedText/AnimatedText";
import Tech from "../components/tech/Tech";
import Image from "next/image";
import AnimatedButton from "../components/AnimatedButton/AnimatedButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Loader from "../components/Loader/Loader";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroParentRef = useRef<HTMLDivElement | null>(null);

  // Detectar si es la primera visita de la sesión
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showLoader, setShowLoader] = useState(false);
  const [loaderComplete, setLoaderComplete] = useState(false);

  // Verificar primera visita al montar el componente
  useLayoutEffect(() => {
    const hasVisited = sessionStorage.getItem("hasVisitedHome");
    if (!hasVisited) {
      // Primera visita
      setIsFirstVisit(true);
      setShowLoader(true);
      setLoaderComplete(false);
      sessionStorage.setItem("hasVisitedHome", "true");
    } else {
      // Ya ha visitado antes en esta sesión
      setIsFirstVisit(false);
      setShowLoader(false);
      setLoaderComplete(true);
    }
  }, []);

  const handleLoaderComplete = () => {
    setLoaderComplete(true);
    setShowLoader(false);
  };

  useLayoutEffect(() => {
    // Solo inicializar ScrollTriggers después de que termine el Loader
    if (!loaderComplete) return;

    // Delay adicional para asegurar que todo el contenido esté renderizado
    const initDelay = setTimeout(() => {
      // Forzar recálculo de ScrollTrigger después del Loader
      ScrollTrigger.refresh();

      const images = imageRefs.current;
      const gridItems = gridRefs.current;

      images.forEach((img, i) => {
        if (!img) return;

        const target = gridItems[i];
        if (!target) return;

        const heroParent = heroParentRef.current;

        // Almacenar estilos originales del CSS
        const originalStyles = {
          position: window.getComputedStyle(img).position,
          left: window.getComputedStyle(img).left,
          top: window.getComputedStyle(img).top,
          right: window.getComputedStyle(img).right,
          bottom: window.getComputedStyle(img).bottom,
          width: window.getComputedStyle(img).width,
          height: window.getComputedStyle(img).height,
          transform: window.getComputedStyle(img).transform,
          zIndex: window.getComputedStyle(img).zIndex,
        };

        // Corregir posiciones específicas para las imágenes sobre el grid del portfolio
        if (i === 3) {
          // Inquirai - responsive positioning
          originalStyles.position = "absolute";
          // Usar valores responsivos según el viewport
          if (window.innerWidth < 768) {
            originalStyles.top = "-0.75rem"; // -top-3 = -0.75rem en móviles
            originalStyles.right = "-0.75rem"; // -right-3 = -0.75rem en móviles
          } else {
            originalStyles.top = "-1.5rem"; // -top-6 = -1.5rem en desktop
            originalStyles.right = "-1.5rem"; // -right-6 = -1.5rem en desktop
          }
          originalStyles.left = "auto";
          originalStyles.bottom = "auto";
          originalStyles.transform = "rotate(12deg)";
        } else if (i === 4) {
          // MedReservA - relative con rotate(3deg)
          originalStyles.position = "relative";
          originalStyles.top = "auto";
          originalStyles.left = "auto";
          originalStyles.right = "auto";
          originalStyles.bottom = "auto";
          originalStyles.transform = "rotate(3deg)";
        }

        // Recalcular posiciones después del reseteo
        const rect = img.getBoundingClientRect();

        // Para la imagen de Velvet Pour (índice 5), calcular la posición left equivalente
        let startX = rect.left;
        if (i === 5) {
          // Si está posicionada con right, calcular left equivalente
          const computedStyle = window.getComputedStyle(img);
          const rightValue = computedStyle.right;
          if (rightValue && rightValue !== "auto") {
            // Calcular left basado en right
            const rightPx = parseFloat(rightValue.replace("px", ""));
            startX = window.innerWidth - rect.width - rightPx;
          }
        }

        const startY = rect.top;
        const startWidth = rect.width;
        const startHeight = rect.height;

        // Obtener rotación inicial
        const computedStyle = window.getComputedStyle(img);
        const transform = computedStyle.transform;
        let startRotation = 0;
        if (transform && transform !== "none") {
          const matrix = transform.match(/matrix\(([^)]+)\)/);
          if (matrix) {
            const values = matrix[1]
              .split(",")
              .map((v) => parseFloat(v.trim()));
            if (values.length >= 4) {
              startRotation =
                Math.atan2(values[1], values[0]) * (180 / Math.PI);
            }
          }
        }

        // Función para recalcular startX en resize (solo para Velvet Pour)
        const recalculateStartX = () => {
          if (i === 5) {
            const rect = img.getBoundingClientRect();
            const computedStyle = window.getComputedStyle(img);
            const rightValue = computedStyle.right;
            if (rightValue && rightValue !== "auto") {
              const rightPx = parseFloat(rightValue.replace("px", ""));
              startX = window.innerWidth - rect.width - rightPx;
            }
          }
        };

        // Función para reposicionar la imagen en su posición original
        const repositionToOriginal = () => {
          const isInGrid = img.parentElement?.classList.contains("parent");
          if (!isInGrid) {
            // Restaurar estilos originales almacenados
            gsap.set(img, {
              position: originalStyles.position,
              left: originalStyles.left,
              top: originalStyles.top,
              right: originalStyles.right,
              bottom: originalStyles.bottom,
              width: originalStyles.width,
              height: originalStyles.height,
              transform: originalStyles.transform,
              zIndex: originalStyles.zIndex,
            });
          }
        };

        // Listener para resize
        const handleResize = () => {
          recalculateStartX();
          repositionToOriginal();
        };

        window.addEventListener("resize", handleResize);

        ScrollTrigger.create({
          trigger: ".portfolio-section",
          start: "top 90%",
          end: "top 10%",
          scrub: 1,
          onUpdate: (self) => {
            const progress = gsap.utils.clamp(0, 1, self.progress);
            const targetRect = target.getBoundingClientRect();
            const finalX = targetRect.left;
            const finalY = targetRect.top;
            const finalWidth = targetRect.width;
            const finalHeight = targetRect.height;

            const currentX = gsap.utils.interpolate(startX, finalX, progress);
            const currentY = gsap.utils.interpolate(startY, finalY, progress);
            const currentWidth = gsap.utils.interpolate(
              startWidth,
              finalWidth,
              progress
            );
            const currentHeight = gsap.utils.interpolate(
              startHeight,
              finalHeight,
              progress
            );
            const currentRotation = gsap.utils.interpolate(
              startRotation,
              0,
              progress
            );

            gsap.set(img, {
              position: "fixed",
              left: currentX,
              top: currentY,
              width: currentWidth,
              height: currentHeight,
              rotation: currentRotation,
              zIndex: 999,
            });

            // Al final absoluto del scroll
            if (progress >= 1) {
              target.appendChild(img);
              gsap.set(img, {
                position: "absolute",
                left: 0,
                top: 0,
                width: "100%",
                height: "100%",
                rotation: 0,
                borderRadius: "6px",
                zIndex: 1,
                margin: 0,
                padding: 0,
              });
              target.style.color = "transparent";

              // Asegurar que la imagen ocupe todo el div
              const imgElement = img.querySelector("img");
              if (imgElement) {
                gsap.set(imgElement, {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "center",
                  position: "absolute",
                  top: 0,
                  left: 0,
                  borderRadius: "6px",
                  display: "block",
                  margin: 0,
                  padding: 0,
                  maxWidth: "100%",
                  maxHeight: "100%",
                  minWidth: "100%",
                  minHeight: "100%",
                });
              }
            } else if (img.parentElement === target && progress < 1) {
              heroParent?.appendChild(img);

              // Para Velvet Pour (índice 5), usar posicionamiento right
              if (i === 5) {
                gsap.set(img, {
                  position: "fixed",
                  right: "-6rem",
                  top: currentY,
                  width: currentWidth,
                  height: currentHeight,
                  rotation: currentRotation,
                  zIndex: 999,
                });
              } else {
                gsap.set(img, {
                  position: "fixed",
                  left: currentX,
                  top: currentY,
                  width: currentWidth,
                  height: currentHeight,
                  rotation: currentRotation,
                  zIndex: 999,
                });
              }

              // Restaurar la imagen interna a su tamaño original
              const imgElement = img.querySelector("img");
              if (imgElement) {
                gsap.set(imgElement, {
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  position: "relative",
                });
              }

              target.style.color = "#2980b9";
            }
          },
          onKill: () => {
            // Limpiar listener cuando se destruya
            window.removeEventListener("resize", handleResize);
          },
        });
      });
    }, 200); // 200ms delay para asegurar renderizado completo

    return () => {
      clearTimeout(initDelay);
    };
  }, [loaderComplete]);

  return (
    <>
      {isFirstVisit && (
        <Loader show={showLoader} onComplete={handleLoaderComplete} />
      )}
      <div className="w-full flex flex-col intro">
        {/* === HERO (simplificado a lo tuyo) === */}
        <div
          className="relative lg:px-8 pb-32 w-full overflow-x-hidden"
          style={{ marginTop: "5rem" }}
        >
          <div className="flex justify-center items-center w-full">
            {/* Columna izquierda - 5% */}

            <div className="w-[5%]">
              <h4
                className="absolute text-orange font-extrabold"
                style={{
                  left: "2rem",
                  bottom: "2rem",
                }}
              >
                2024- <br /> PRESENT
              </h4>
            </div>

            {/* Columna central - 90% */}
            <div className="w-[90%] text-left flex flex-col justify-center mt-64 md:mt-0">
              <h3 className="font-light z-1000">
                Hello, I&apos;m{" "}
                <span className="text-orange">Matias Carrera</span>
              </h3>
              <h1 className="font-bold z-1000 text-md">
                FULL-STACK DEVELOPER <br /> & UI/UX DESIGNER
              </h1>
            </div>

            {/* Columna derecha - 5% */}
            <div className="w-[5%]"></div>
          </div>

          {/* Imágenes posicionadas con absolute -> ahora controladas por GSAP (se setean a fixed al iniciar) */}
          <div
            ref={(el) => {
              imageRefs.current[0] = el;
            }}
            className="absolute w-[210px] h-[210px] rounded-md overflow-hidden div1"
            style={{
              left: "-8rem",
              top: "2vh",
              transform: "rotate(-12deg)",
            }}
          >
            <Image
              src="/work/ssconverso.png"
              alt="Converso"
              fill
              className="object-cover"
            />
          </div>

          <div
            ref={(el) => {
              imageRefs.current[5] = el;
            }}
            className="absolute w-[180px] h-[400px] rounded-md overflow-hidden div5"
            style={{
              right: "-8rem",
              top: "2vh",
              transform: "rotate(6deg)",
            }}
          >
            <Image
              src="/work/ssvelvetpour.png"
              alt="Velvet Pour"
              fill
              className="image-crop-custom"
            />
          </div>
        </div>

        {/* MARQUEE */}
        <div className="relative w-full">
          <div className="bg-black w-full overflow-hidden relative h-12 flex items-center">
            <div className="animate-scroll-horizontal whitespace-nowrap">
              {Array.from({ length: 20 }, (_, i) => (
                <span
                  key={i}
                  className="text-white inline-block mr-12"
                  style={{ marginRight: "48px" }}
                >
                  MCARRERA // &copy; {new Date().getFullYear()}
                </span>
              ))}
            </div>
          </div>

          {/* Imágenes por encima de la banda negra */}
          <div className="absolute inset-0 flex items-center justify-start w-full px-6 pointer-events-none">
            {/* Lado izquierdo - Imágenes */}
            <div className="flex items-center gap-8 relative">
              <div
                ref={(el) => {
                  imageRefs.current[2] = el;
                }}
                className="relative w-[200px] h-[105px] lg:w-[450px] lg:h-[210px] rounded-md overflow-hidden shadow-lg pointer-events-auto div3 z-1"
              >
                <Image
                  src="/work/ssvelyo.png"
                  alt="Velyo"
                  className="object-cover"
                  fill
                />
              </div>

              <div
                ref={(el) => {
                  imageRefs.current[1] = el;
                }}
                className="absolute w-[100px] h-[100px] rounded-md overflow-hidden div6 z-10"
                style={{
                  transform: "rotate(-12deg)",
                  bottom: 0,
                }}
              >
                <Image
                  src="/work/quetedebo.png"
                  alt="Que te debo"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Texto debajo de la banda negra */}
          <div className="flex w-full px-6 py-8">
            {/* Espacio para la mitad izquierda */}
            <div className="w-1/2"></div>
            {/* Texto en la mitad derecha, posicionado a la derecha pero alineado a la izquierda */}
            <div className="w-1/2 flex justify-end">
              <p className="text-orange font-extrabold max-w-[150px] md:max-w-[450px] text-sm leading-tight text-left">
                FULL STACK DEVELOPER WITH A PASSION FOR CRAFTING SEAMLESS AND
                ENGAGING DIGITAL EXPERIENCES.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="flex justify-center items-center portfolio-section mt-2 lg:mt-16">
        <div className="w-full max-w-6xl mx-auto px-6 relative">
          <div className="absolute top-0 right-8 md:right-16 z-20">
            <div className="relative">
              <div
                ref={(el) => {
                  imageRefs.current[4] = el;
                }}
                className="w-32 h-20 md:w-48 lg:w-64 md:h-32 lg:h-40 rounded-lg shadow-lg div4 z-1"
                style={{ transform: "rotate(3deg)" }}
              >
                <Image
                  src="/work/ssmedreserva.png"
                  alt="MedReservA"
                  fill
                  className="object-cover"
                />
              </div>

              <div
                ref={(el) => {
                  imageRefs.current[3] = el;
                }}
                className="absolute -top-3 -right-3 md:-top-6 md:-right-6 w-20 h-16 md:w-32 lg:w-40 md:h-24 lg:h-28 div2 z-10"
                style={{ transform: "rotate(12deg)" }}
              >
                <Image
                  src="/work/ssinquirai.png"
                  alt="Inquirai"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-4xl shadow-2xl mt-16 p-2 md:p-8">
            <div className="flex flex-col md:flex-row items-center p-1 md:p-2 gap-2">
              <Avatar className="w-16 h-16 md:w-20 md:h-20">
                <AvatarImage src="/mcanimated.png" />
                <AvatarFallback className="bg-gray-200 text-gray-600 text-xl font-semibold">
                  MC
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <h4 className="text-xl font-bold text-gray-900 mb-1">
                  Matías Carrera
                </h4>
                <p className="text-gray-600 text-sm md:text-base">
                  Full Stack Developer
                </p>
              </div>

              <div className="flex-shrink-0">
                <AnimatedButton
                  label="See all"
                  route="/work"
                  animate={true}
                  animateOnScroll={true}
                  delay={0.2}
                />
              </div>
            </div>

            <div className="grid">
              <div ref={heroParentRef} className="parent">
                {Array(6)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      ref={(el) => {
                        gridRefs.current[index] = el;
                      }}
                      className={`div${index + 1}`}
                    ></div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Texts, Tech, etc - Solo renderizar después del Loader */}
      {loaderComplete && (
        <>
          <AnimatedText
            sections={[
              {
                text: [
                  "I'm Matías Carrera, a fullstack developer passionate about crafting intuitive and living interfaces. My work blends clarity, expression, and strong storytelling to bring bold ideas into motion.",
                  "With a background in design and development, I create projects that combine interactive experiences, modern structures, and a clear vision. Every line of code and every detail in the UI is built with intent — so digital products feel both functional and vibrant.",
                ],
                highlights: [
                  "vibrant",
                  "living",
                  "clarity",
                  "expression",
                  "storytelling",
                  "interactive",
                  "vision",
                  "intuitive",
                ],
                className: "about-container",
                containerClass: "anime-text-container",
              },
            ]}
          />

          <Tech />

          <AnimatedText
            sections={[
              {
                text: [
                  "From prototypes to full-stack applications, I build solutions that feel modern, intuitive, and interactive. I focus on responsive design, smooth motion, and creative problem solving.",
                  "My goal is to turn complex challenges into clear and elegant digital products — where expression meets clarity, and every idea finds its shape.",
                ],
                highlights: [
                  "modern",
                  "intuitive",
                  "interactive",
                  "responsive",
                  "motion",
                  "creative",
                  "elegant",
                  "expression",
                  "clarity",
                  "shape",
                ],
                className: "features",
                containerClass: "anime-text-container",
              },
            ]}
          />
        </>
      )}
    </>
  );
}
