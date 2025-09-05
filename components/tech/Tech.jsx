"use client";
import { useEffect, useRef, useCallback } from "react";
import "./tech.css";

export default function Tech() {
  const containerRef = useRef(null);
  const highlightRef = useRef(null);
  const animationFrameRef = useRef(null);

  const techStack = [
    { name: "NextJS", logo: "/tech/nextjs.svg" },
    { name: "TypeScript", logo: "/tech/typescript.svg" },
    { name: "Supabase", logo: "/tech/supabase.svg" },
    { name: "ReactJS", logo: "/tech/react.svg" },
    { name: "Tailwind", logo: "/tech/tailwind.svg" },
    { name: "Three.js", logo: "/tech/threejs.svg" },
    { name: "GSAP", logo: "/tech/gsap.svg" },
    { name: "JavaScript", logo: "/tech/javascript.svg" },
    { name: "Spring Boot", logo: "/tech/springboot.svg" },
    { name: "Express", logo: "/tech/express.svg" },
  ];

  const moveToElement = useCallback((element, highlight, container) => {
    if (!element || !highlight || !container) return;

    const rect = element.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();

    const x = rect.left - containerRect.left;
    const y = rect.top - containerRect.top;

    highlight.style.transform = `translate(${x}px, ${y}px)`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.backgroundColor = "#000000";
    highlight.style.opacity = "0.9";
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = requestAnimationFrame(() => {
        const container = containerRef.current;
        const highlight = highlightRef.current;

        if (!container || !highlight) return;

        const hoveredElement = document.elementFromPoint(e.clientX, e.clientY);
        let targetElement = null;

        if (hoveredElement?.classList.contains("grid-item")) {
          targetElement = hoveredElement;
        } else if (hoveredElement?.closest(".grid-item")) {
          targetElement = hoveredElement.closest(".grid-item");
        }

        if (targetElement) {
          moveToElement(targetElement, highlight, container);
        }
      });
    },
    [moveToElement]
  );

  const handleMouseLeave = useCallback(() => {
    const highlight = highlightRef.current;
    if (highlight) {
      highlight.style.opacity = "0";
    }
  }, []);

  const handleMouseEnter = useCallback(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;
    const firstItem = container?.querySelector(".grid-item");

    if (firstItem && highlight && container) {
      moveToElement(firstItem, highlight, container);
    }
  }, [moveToElement]);

  useEffect(() => {
    const container = containerRef.current;
    const highlight = highlightRef.current;

    if (!container || !highlight) return;

    // Initialize highlight as hidden
    highlight.style.opacity = "0";

    // Add event listeners
    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseleave", handleMouseLeave);
    container.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseleave", handleMouseLeave);
      container.removeEventListener("mouseenter", handleMouseEnter);

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [handleMouseMove, handleMouseLeave, handleMouseEnter, moveToElement]);

  return (
    <section className="tech-section">
      <div className="tech-container" ref={containerRef}>
        <div className="tech-grid">
          {/* Primera fila: 3 elementos */}
          <div className="grid-row">
            {techStack.slice(0, 3).map((tech, index) => (
              <div
                key={tech.name}
                className="grid-item"
                data-tech={tech.name.toLowerCase()}
              >
                <div className="tech-content">
                  <img src={tech.logo} alt={tech.name} className="tech-logo" />
                </div>
              </div>
            ))}
          </div>
          {/* Segunda fila: 4 elementos */}
          <div className="grid-row">
            {techStack.slice(3, 7).map((tech, index) => (
              <div
                key={tech.name}
                className="grid-item"
                data-tech={tech.name.toLowerCase()}
              >
                <div className="tech-content">
                  <img src={tech.logo} alt={tech.name} className="tech-logo" />
                </div>
              </div>
            ))}
          </div>
          {/* Tercera fila: 3 elementos */}
          <div className="grid-row">
            {techStack.slice(7, 10).map((tech, index) => (
              <div
                key={tech.name}
                className="grid-item"
                data-tech={tech.name.toLowerCase()}
              >
                <div className="tech-content">
                  <img src={tech.logo} alt={tech.name} className="tech-logo" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="highlight" ref={highlightRef} aria-hidden="true"></div>
      </div>
    </section>
  );
}
