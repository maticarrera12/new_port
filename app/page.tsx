"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import { useLenis } from "lenis/react";
import Loader from "../components/Loader/Loader";
import AnimatedText from "../components/AnimatedText/AnimatedText";
import Tech from "../components/tech/Tech";

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
    <div>
      <Loader show={showPreloader} onComplete={handleLoaderComplete} />
      <div className="min-h-dvh flex items-center justify-center">
        <h1>FULL STACK DEVELOPER</h1>
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
    </div>
  );
}
