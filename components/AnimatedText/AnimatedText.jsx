"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import AnimatedTextSection from "./AnimatedTextSection";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = ({ sections }) => {
  const lenisRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Inicializar Lenis
      const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: "vertical",
        gestureDirection: "vertical",
        smooth: true,
        mouseMultiplier: 1,
        smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      });

      lenisRef.current = lenis;

      lenis.on("scroll", ScrollTrigger.update);

      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });

      gsap.ticker.lagSmoothing(0);
    }, 500);

    return () => {
      clearTimeout(timer);
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      gsap.ticker.remove((time) => {
        if (lenisRef.current) {
          lenisRef.current.raf(time * 1000);
        }
      });
    };
  }, []);

  return (
    <div className="animated-text-wrapper">
      {sections &&
        sections.map((section, index) => (
          <AnimatedTextSection
            key={index}
            text={section.text}
            highlights={section.highlights}
            className={section.className}
            containerClass={section.containerClass || "anime-text-container"}
            wordHighlightBgColor={section.wordHighlightBgColor || "60, 60, 60"}
          />
        ))}
    </div>
  );
};

export default AnimatedText;
