"use client";
import "./Loader.css";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import CustomEase from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");

const Loader = ({ onComplete, show = true }) => {
  const loaderRef = useRef(null);

  useGSAP(() => {
    if (!show || !loaderRef.current) return;

    const tl = gsap.timeline({
      delay: 0.3,
      defaults: {
        ease: "hop",
      },
    });

    const counts = loaderRef.current.querySelectorAll(".count");

    // Animar contadores numéricos
    counts.forEach((count, index) => {
      const digits = count.querySelectorAll(".digit h1");

      tl.to(
        digits,
        {
          y: "0%",
          duration: 1,
          stagger: 0.075,
        },
        index * 1
      );

      if (index < counts.length) {
        tl.to(
          digits,
          {
            y: "-100%",
            duration: 1,
            stagger: 0.075,
          },
          index * 1 + 1
        );
      }
    });

    // Ocultar spinner
    tl.to(".spinner", {
      opacity: 0,
      duration: 0.3,
    });

    // Mostrar palabras "Matias Carrera"
    tl.to(
      ".word h1",
      {
        y: "0%",
        duration: 1,
      },
      "<"
    );

    // Animar divisor vertical
    tl.to(".divider", {
      scaleY: "100%",
      duration: 1,
      onComplete: () => {
        gsap.to(".divider", { opacity: 0, duration: 0.3, delay: 0.3 });
      },
    });

    // Ocultar palabras
    tl.to("#word-1 h1", {
      y: "100%",
      duration: 1,
      delay: 0.3,
    });

    tl.to(
      "#word-2 h1",
      {
        y: "-100%",
        duration: 1,
      },
      "<"
    );

    // Cerrar bloques overlay
    tl.to(
      ".block",
      {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1,
        stagger: 0.1,
        delay: 0.75,
        onStart: () => {
          // Activar imagen hero si existe
          const heroImg = document.querySelector(".hero-img");
          if (heroImg) {
            gsap.to(heroImg, { scale: 1, duration: 2, ease: "hop" });
          }
        },
        onComplete: () => {
          gsap.set(loaderRef.current, { pointerEvents: "none" });
          if (onComplete) onComplete();
        },
      },
      "<"
    );
  }, [show, onComplete]);

  if (!show) return null;

  return (
    <div className="loader" ref={loaderRef}>
      <div className="overlay">
        <div className="block"></div>
        <div className="block"></div>
      </div>

      <div className="intro-logo">
        <div className="word" id="word-1">
          <h1>
            <span>Matias</span>
          </h1>
        </div>
        <div className="word" id="word-2">
          <h1>Carrera</h1>
        </div>
      </div>

      <div className="divider"></div>

      <div className="spinner-container">
        <div className="spinner"></div>
      </div>

      <div className="counter">
        <div className="count">
          <div className="digit">
            <h1>0</h1>
          </div>
          <div className="digit">
            <h1>0</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>2</h1>
          </div>
          <div className="digit">
            <h1>7</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>6</h1>
          </div>
          <div className="digit">
            <h1>5</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>9</h1>
          </div>
          <div className="digit">
            <h1>8</h1>
          </div>
        </div>
        <div className="count">
          <div className="digit">
            <h1>9</h1>
          </div>
          <div className="digit">
            <h1>9</h1>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;
