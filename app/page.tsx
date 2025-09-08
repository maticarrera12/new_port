"use client";
import { useRef, useState, useEffect } from "react";
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
  const tagsRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(false);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const hasShownLoader = sessionStorage.getItem("loaderShown");
    if (!hasShownLoader) {
      setShowPreloader(true);
      sessionStorage.setItem("loaderShown", "true");
    }
  }, []);

  useEffect(() => {
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

  useEffect(() => {
    if (showPreloader) {
      setLoaderAnimating(true);
    }
  }, [showPreloader]);

  return (
    <>
      <Loader show={showPreloader} onComplete={handleLoaderComplete} />
      <div
        className="flex px-8 pb-24 w-full gap-6 justify-between"
        style={{ marginTop: "5rem" }}
      >
        {/* left - 10% */}
        <div className="flex flex-col items-center flex-[0_0_10%] relative">
          <div className="relative  w-[210px] h-[210px] rounded-md overflow-hidden mb-12 transform -rotate-12 -translate-x-24">
            <Image
              src="/work/ssconverso.png"
              alt="Converso"
              fill
              className="object-cover"
            />
          </div>
          <h4
            className="font-extrabold text-orange text-sm text-left"
            style={{ marginTop: "8rem" }}
          >
            2024- <br /> PRESENT
          </h4>
        </div>
        {/* center - 80% */}
        <div className="text-left flex flex-col justify-center flex-[0_0_80%]">
          <h3 className="font-light">
            Hello, I&apos;m <span className="text-orange">Matias Carrera</span>
          </h3>
          <h1 className="font-bold">FULL STACK DEVELOPER & UI/UX DESIGNER</h1>
        </div>
        {/* right - 10% */}
        <div className="flex justify-center flex-[0_0_10%] relative">
          <div className="relative w-[210px] h-[450px] rounded-md overflow-hidden transform rotate-12">
            <Image
              src="/work/ssinquirai.png"
              alt="Inquirai"
              fill
              className="image-crop-custom"
            />
          </div>
        </div>
      </div>


      <div className="relative w-full">
        {/* Barra scroll como base */}
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

        {/* Contenido superpuesto sobre el scroll */}
        <div className="absolute inset-0 flex items-center justify-center gap-8 max-w-6xl mx-auto px-6 pointer-events-none">
          {/* Imagen principal */}
          <div className="relative w-[450px] h-[210px] rounded-md overflow-hidden shadow-lg pointer-events-auto transform ">
            <Image
              src="/work/ssvelyo.png"
              alt="Velyo"
              className="object-cover"
              fill
            />
          </div>

          {/* Imagen secundaria encima de la principal */}
          <div className="absolute left-12 -top-32 w-[140px] h-[140px] rounded-md overflow-hidden shadow-lg transform -rotate-12 pointer-events-auto z-10 translate-y-30">
            <Image
              src="/work/ssvelvetpour.png"
              alt="Mojito"
              className="object-cover"
              fill
            />
          </div>

          {/* Texto a la derecha */}
          <p className="text-orange font-extrabold max-w-[350px] text-sm leading-tight pointer-events-auto translate-y-20">
            FULL STACK DEVELOPER WITH A PASSION FOR CRAFTING SEAMLESS AND
            ENGAGING DIGITAL EXPERIENCES.
          </p>
        </div>
      </div>


      <div className="min-h-screen flex justify-center items-center p-16 md:p-20">
        <div className="max-w-6xl mx-auto m-16 relative">
          {/* Decorative Images - Floating above card */}
          <div className="absolute top-0 right-8 md:right-16 z-20 hidden sm:block">
            <div className="relative">
              {/* First Image - Dashboard mockup */}
              <div className="w-48 h-32 md:w-64 md:h-40  rounded-lg shadow-lg transform rotate-3">
                <Image
                  src="/work/ssmedreserva.png"
                  alt="Dashboard mockup"
                  className="w-full h-full object-cover rounded-lg"
                  width={210}
                  height={210}
                />
              </div>

              {/* Second Image - Rotated */}
              <div className="absolute -top-6 -right-6 w-32 h-24 md:w-40 md:h-28 rotate-12">
                <Image
                  src="/work/quetedebo.png"
                  alt="Mobile app mockup"
                  className="w-full h-full object-cover rounded-lg"
                  width={210}
                  height={210}
                />
              </div>
            </div>
          </div>

          {/* Main Portfolio Card */}
          <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 lg:p-12 mt-16 md:mt-20">
            {/* Profile Section */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
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
                <p className="text-gray-600 text-sm md:text-base mb-4 sm:mb-0">
                  Full Stack Developer
                </p>
              </div>

              <AnimatedButton label="See all my projects" route="/work" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {/* Primera fila */}
              <div className="aspect-square bg-gray-200 rounded-xl"></div>

              <div className="col-span-2 aspect-video bg-gray-200 rounded-xl"></div>

              {/* Rectángulo vertical grande (ocupa dos filas) */}
              <div className="row-span-2 bg-gray-200 rounded-xl"></div>

              {/* Segunda fila */}
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
              <div className="aspect-square bg-gray-200 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>

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
