"use client";
import { useRef, useState, useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import { useLenis } from "lenis/react";
import Loader from "../components/Loader/Loader";
import AnimatedText from "../components/AnimatedText/AnimatedText";
import Tech from "../components/tech/Tech";
import Image from "next/image";
import AnimatedButton from "@/components/AnimatedButton/AnimatedButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

export default function Home() {
  const [showPreloader, setShowPreloader] = useState(false);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const gridRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heroParentRef = useRef<HTMLDivElement | null>(null);

  // Preloader simple
  useLayoutEffect(() => {
    const shown = sessionStorage.getItem("loaderShown");
    if (!shown) {
      setShowPreloader(true);
      sessionStorage.setItem("loaderShown", "true");
    }
  }, []);

  useLayoutEffect(() => {
    if (lenis) {
      if (loaderAnimating) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  const handleLoaderComplete = () => {
    setLoaderAnimating(false);
    setShowPreloader(false);
  };

  useLayoutEffect(() => {
    if (showPreloader) return;

    const images = imageRefs.current;
    const gridItems = gridRefs.current;

    images.forEach((img, i) => {
      if (!img) return;

      const target = gridItems[i];
      if (!target) return;

      const heroParent = heroParentRef.current;

      const rect = img.getBoundingClientRect();
      const startX = rect.left;
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
          const values = matrix[1].split(",").map((v) => parseFloat(v.trim()));
          if (values.length >= 4) {
            startRotation = Math.atan2(values[1], values[0]) * (180 / Math.PI);
          }
        }
      }

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
            gsap.set(img, {
              position: "fixed",
              left: currentX,
              top: currentY,
              width: currentWidth,
              height: currentHeight,
              rotation: currentRotation,
              zIndex: 999,
            });

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
      });
    });
  }, [showPreloader]);

  return (
    <>
      <Loader show={showPreloader} onComplete={handleLoaderComplete} />
      <div className="w-full min-h-screen flex flex-col justify-between intro">
        {/* === HERO (simplificado a lo tuyo) === */}
        <div
          className="relative px-8 pb-24 w-full"
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
            <div className="w-[90%] text-left flex flex-col justify-center mt-72 md:mt-0">
              <h3 className="font-light">
                Hello, I&apos;m{" "}
                <span className="text-orange">Matias Carrera</span>
              </h3>
              <h1 className="font-bold">
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
              right: "-6rem",
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
                className="relative w-[200px] h-[105px] md:w-[450px] md:h-[210px] rounded-md overflow-hidden shadow-lg pointer-events-auto div3 z-1"
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
      <div className="flex justify-center items-center portfolio-section mt-16">
        <div className="w-full max-w-6xl mx-auto px-6 relative">
          <div className="absolute top-0 right-8 md:right-16 z-20 hidden sm:block">
            <div className="relative">
              <div
                ref={(el) => {
                  imageRefs.current[4] = el;
                }}
                className="w-48 h-32 md:w-64 md:h-40 rounded-lg shadow-lg div4 z-1"
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
                className="absolute -top-6 -right-6 w-32 h-24 md:w-40 md:h-28 div2 z-10"
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

          <div className="bg-white rounded-4xl shadow-2xl mt-16 p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-center p-2 gap-2">
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

              <AnimatedButton label="See all" route="/work" />
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

      {/* Texts, Tech, etc */}
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
  );
}
