"use client";
import { useEffect, useRef, useCallback } from "react";
import "./tech.css";

export default function Tech() {
  const containerRef = useRef(null);
  const highlightRef = useRef(null);
  const animationFrameRef = useRef(null);

  const techStack = [
    { name: "HTML", color: "#E34F26" },
    { name: "CSS", color: "#1572B6" },
    { name: "JavaScript", color: "#F7DF1E" },
    { name: "React", color: "#61DAFB" },
    { name: "Next.js", color: "#000000" },
    { name: "GSAP", color: "#88CE02" },
    { name: "Three.js", color: "#000000" },
    { name: "Node.js", color: "#339933" },
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
    highlight.style.backgroundColor = element.dataset.color;
    highlight.style.opacity = "1";
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

    const gridItems = container.querySelectorAll(".grid-item");

    // Set colors for each item
    gridItems.forEach((item, index) => {
      const tech = techStack[index % techStack.length];
      item.dataset.color = tech.color;
    });

    // Initialize highlight position
    const firstItem = container.querySelector(".grid-item");
    if (firstItem) {
      moveToElement(firstItem, highlight, container);
    }

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
          <div className="grid-row">
            {techStack.slice(0, 3).map((tech, index) => (
              <div
                key={tech.name}
                className="grid-item"
                data-tech={tech.name.toLowerCase()}
              >
                <p className="tech-label">( {tech.name.toLowerCase()} )</p>
              </div>
            ))}
          </div>
          <div className="grid-row">
            {techStack.slice(3, 8).map((tech, index) => (
              <div
                key={tech.name}
                className="grid-item"
                data-tech={tech.name.toLowerCase()}
              >
                <p className="tech-label">( {tech.name.toLowerCase()} )</p>
              </div>
            ))}
          </div>
        </div>
        <div className="highlight" ref={highlightRef} aria-hidden="true"></div>
      </div>
    </section>
  );
}
