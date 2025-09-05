"use client";
import React, { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      const lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);

      const animeTextParagraphs = document.querySelectorAll(".anime-text p");

      const wordHighlightBgColor = "60, 60, 60";

      const keywords = [
        "vibrant",
        "living",
        "clarity",
        "expression",
        "shape",
        "intuitive",
        "storytelling",
        "interactive",
        "vision",
      ];

      animeTextParagraphs.forEach((paragraph) => {
        const text = paragraph.textContent;
        const words = text.split(/\s+/);
        paragraph.innerHTML = "";

        words.forEach((word) => {
          if (word.trim()) {
            const wordContainer = document.createElement("div");
            wordContainer.className = "word";
            // Ocultar solo visualmente, no funcionalmente
            wordContainer.style.visibility = "hidden";

            const wordText = document.createElement("span");
            wordText.textContent = word;
            wordText.style.visibility = "hidden";

            const normalizedWord = word.toLowerCase().replace(/[.,!?;:"]/g, "");
            if (keywords.includes(normalizedWord)) {
              wordContainer.classList.add("keyword-wrapper");
              wordText.classList.add("keyword", normalizedWord);
            }

            wordContainer.appendChild(wordText);
            paragraph.appendChild(wordContainer);
          }
        });
      });

      const animeTextContainers = document.querySelectorAll(
        ".anime-text-container"
      );

      animeTextContainers.forEach((container) => {
        ScrollTrigger.create({
          trigger: container,
          pin: container,
          start: "top top",
          end: `+=${window.innerHeight * 4}`,
          pinSpacing: true,
          onUpdate: (self) => {
            const progress = self.progress;
            const words = Array.from(
              container.querySelectorAll(".anime-text .word")
            );
            const totalWords = words.length;

            words.forEach((word, index) => {
              const wordText = word.querySelector("span");

              if (progress <= 0.7) {
                const progressTarget = 0.7;
                const revealProgress = Math.min(1, progress / progressTarget);

                const overlapWords = 15;
                const totalAnimationLength = 1 + overlapWords / totalWords;

                const wordStart = index / totalWords;
                const wordEnd = wordStart + overlapWords / totalWords;

                const timelineScale =
                  1 /
                  Math.min(
                    totalAnimationLength,
                    1 +
                      (totalWords - 1) / totalWords +
                      overlapWords / totalWords
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

                // Hacer visible y animar la opacidad
                word.style.visibility = "visible";
                word.style.opacity = wordProgress;

                const backgroundFadeStart =
                  wordProgress >= 0.9 ? (wordProgress - 0.9) / 0.1 : 0;
                const backgroundOpacity = Math.max(0, 1 - backgroundFadeStart);
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, ${backgroundOpacity})`;

                const textRevealThreshold = 0.9;
                const textRevealProgress =
                  wordProgress >= textRevealThreshold
                    ? (wordProgress - textRevealThreshold) /
                      (1 - textRevealThreshold)
                    : 0;

                // Hacer visible el texto y animar su opacidad
                wordText.style.visibility = "visible";
                wordText.style.opacity = Math.pow(textRevealProgress, 0.5);
              } else {
                // Una vez que las palabras se revelan, mantenerlas visibles
                word.style.visibility = "visible";
                word.style.opacity = 1;
                wordText.style.visibility = "visible";
                wordText.style.opacity = 1;
                word.style.backgroundColor = `rgba(${wordHighlightBgColor}, 0)`;
              }
            });
          },
        });
      });
    }, 500);

    return () => {
      clearTimeout(timer);
      lenis?.destroy();
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div className="animated-text-wrapper">
      <section className="about-container anime-text-container">
        <div className="copy-container">
          <div className="anime-text">
            <p>
              I'm Matías Carrera, a fullstack developer passionate about
              crafting intuitive and living interfaces. My work blends clarity,
              expression, and strong storytelling to bring bold ideas into
              motion.
            </p>
            <p>
              With a background in design and development, I create projects
              that combine interactive experiences, modern structures, and a
              clear vision. Every line of code and every detail in the UI is
              built with intent — so digital products feel both functional and
              vibrant.
            </p>
          </div>
        </div>
      </section>

      <section className="features anime-text-container">
        <div className="copy-container">
          <div className="anime-text">
            <p>
              From prototypes to full-stack applications, I build solutions that
              feel modern, intuitive, and interactive. I focus on responsive
              design, smooth motion, and creative problem solving.
            </p>
            <p>
              My goal is to turn complex challenges into clear and elegant
              digital products — where expression meets clarity, and every idea
              finds its shape.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AnimatedText;
