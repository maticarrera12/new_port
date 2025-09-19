"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AnimatedTextSection = ({
  text,
  highlights = [],
  className = "",
  containerClass = "anime-text-container",
  wordHighlightBgColor = "200, 200, 200",
}) => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const textElement = textRef.current;

    if (!container || !textElement) return;

    // Procesar el texto y crear palabras
    const processText = () => {
      const paragraphs = textElement.querySelectorAll("p");

      paragraphs.forEach((paragraph) => {
        const originalText = paragraph.textContent;
        const words = originalText.split(/\s+/);
        paragraph.innerHTML = "";

        words.forEach((word) => {
          if (word.trim()) {
            const wordContainer = document.createElement("div");
            wordContainer.className = "word";
            wordContainer.style.visibility = "hidden";
            wordContainer.style.opacity = "0";
            // Valores iniciales ajustados para mobile para evitar overflow
            const isMobile = window.innerWidth <= 768;
            const isExtraSmall = window.innerWidth <= 480;
            const initialX = isExtraSmall ? 3 : isMobile ? 6 : 12;
            const initialY = isExtraSmall ? 2 : isMobile ? 4 : 8;
            wordContainer.style.transform = `translate3d(${initialX}px, ${initialY}px, 0) scale(0.75)`;
            wordContainer.style.filter = "blur(10px)";

            const wordText = document.createElement("span");
            wordText.textContent = word;
            wordText.style.visibility = "hidden";
            wordText.style.opacity = "0";

            const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
            if (highlights.includes(normalizedWord)) {
              wordContainer.classList.add("keyword-wrapper");
              wordText.classList.add("keyword", normalizedWord);
            }

            wordContainer.appendChild(wordText);
            paragraph.appendChild(wordContainer);
          }
        });
      });
    };

    processText();

    // Crear ScrollTrigger
    const scrollTrigger = ScrollTrigger.create({
      trigger: container,
      pin: container,
      start: "top top",
      end: `+=${window.innerHeight * 1.5}`,
      pinSpacing: true,
      onStart: () => {
        // Forzar estilos cuando se hace pin
        container.style.padding = "0";
        container.style.margin = "0";
        container.style.width = "100vw";
        container.style.maxWidth = "100vw";
        container.style.left = "0";
        container.style.right = "0";

        // Forzar padding 0 en anime-text
        const animeTextElement = textElement;
        if (animeTextElement) {
          animeTextElement.style.padding = "0";
          animeTextElement.style.paddingLeft = "0";
          animeTextElement.style.paddingRight = "0";
          animeTextElement.style.paddingTop = "0";
          animeTextElement.style.paddingBottom = "0";
        }
      },
      onUpdate: (self) => {
        // Mantener estilos correctos durante la animación
        container.style.padding = "0";
        container.style.margin = "0";
        container.style.width = "100vw";
        container.style.maxWidth = "100vw";
        container.style.left = "0";
        container.style.right = "0";

        // Mantener padding 0 en anime-text durante la animación
        const animeTextElement = textElement;
        if (animeTextElement) {
          animeTextElement.style.padding = "0";
          animeTextElement.style.paddingLeft = "0";
          animeTextElement.style.paddingRight = "0";
          animeTextElement.style.paddingTop = "0";
          animeTextElement.style.paddingBottom = "0";
        }

        const progress = self.progress;
        const words = Array.from(textElement.querySelectorAll(".word"));
        const totalWords = words.length;

        words.forEach((word, index) => {
          const wordText = word.querySelector("span");

          if (progress <= 0.8) {
            const progressTarget = 0.8;
            const revealProgress = Math.min(1, progress / progressTarget);

            const overlapWords = 15;
            const totalAnimationLength = 1 + overlapWords / totalWords;

            const wordStart = index / totalWords;
            const wordEnd = wordStart + overlapWords / totalWords;

            const timelineScale =
              1 /
              Math.min(
                totalAnimationLength,
                1 + (totalWords - 1) / totalWords + overlapWords / totalWords
              );

            const adjustedStart = wordStart * timelineScale;
            const adjustedEnd = wordEnd * timelineScale;
            const duration = adjustedEnd - adjustedStart;

            const wordProgress =
              revealProgress <= adjustedStart
                ? 0
                : revealProgress >= adjustedEnd
                ? 1
                : (revealProgress - adjustedStart) / duration;

            // Hacer visible y animar con movimiento suave
            word.style.visibility = "visible";
            word.style.opacity = wordProgress;

            // Animación de entrada con movimiento diagonal y easing
            const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
            const moveProgress = Math.min(1, wordProgress * 1.2);
            const easedProgress = easeOutCubic(moveProgress);

            // Reducir movimiento en dispositivos móviles para evitar overflow
            const isMobile = window.innerWidth <= 768;
            const isExtraSmall = window.innerWidth <= 480;
            const translateX =
              (isExtraSmall ? 3 : isMobile ? 6 : 12) * (1 - easedProgress);
            const translateY =
              (isExtraSmall ? 2 : isMobile ? 4 : 8) * (1 - easedProgress);
            const scale = 0.75 + 0.25 * easedProgress;
            const blur = 10 * Math.pow(1 - easedProgress, 2);

            word.style.transform = `translate3d(${translateX}px, ${translateY}px, 0) scale(${scale})`;
            word.style.filter = `blur(${blur}px)`;

            // Primera etapa: mostrar fondo gris (0 - 0.6)
            const backgroundShowThreshold = 0.6;
            const backgroundOpacity =
              wordProgress <= backgroundShowThreshold
                ? Math.min(1, wordProgress / backgroundShowThreshold)
                : Math.max(
                    0,
                    1 -
                      (wordProgress - backgroundShowThreshold) /
                        (1 - backgroundShowThreshold)
                  );

            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

            // Segunda etapa: mostrar texto después del fondo (0.5 - 1.0)
            const textRevealThreshold = 0.5;
            const textRevealProgress =
              wordProgress >= textRevealThreshold
                ? Math.min(
                    1,
                    (wordProgress - textRevealThreshold) /
                      (1 - textRevealThreshold)
                  )
                : 0;

            // Hacer visible el texto con transición suave solo después del threshold
            if (wordProgress >= textRevealThreshold) {
              wordText.style.visibility = "visible";
              wordText.style.opacity = easeOutCubic(textRevealProgress);
            } else {
              wordText.style.visibility = "hidden";
              wordText.style.opacity = 0;
            }
          } else {
            // Una vez que las palabras se revelan, mantenerlas visibles y en posición final
            word.style.visibility = "visible";
            word.style.opacity = 1;
            word.style.transform = "translate3d(0px, 0px, 0) scale(1)";
            word.style.filter = "blur(0px)";
            wordText.style.visibility = "visible";
            wordText.style.opacity = 1;
            word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
          }
        });
      },
    });

    return () => {
      scrollTrigger.kill();
    };
  }, [text, highlights, wordHighlightBgColor]);

  return (
    <section className={`${containerClass} ${className}`} ref={containerRef}>
      <div className="copy-container">
        <div className="anime-text" ref={textRef}>
          {Array.isArray(text) ? (
            text.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p>{text}</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default AnimatedTextSection;