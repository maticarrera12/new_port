"use client";
import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./cards.css";

const CardsService = () => {
  const rootRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // No crear una nueva instancia de Lenis si ya existe una en la página padre
    let lenis;
    if (typeof window !== "undefined" && !window.lenis) {
      lenis = new Lenis();
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
      });
      gsap.ticker.lagSmoothing(0);
      window.lenis = lenis;
    } else {
      // Usar la instancia existente de Lenis
      lenis = window.lenis;
    }

    const smoothStep = (p) => p * p * (3 - 2 * p);

    if (window.innerWidth > 1000) {
      // Hero Animation - Solo si existe el elemento .hero dentro del componente
      const heroElement = rootRef.current?.querySelector(".hero");
      if (heroElement) {
        ScrollTrigger.create({
          trigger: heroElement,
          start: "top top",
          end: "75% top",
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            const heroCardsContainerOpacity = gsap.utils.interpolate(
              1,
              0.5,
              smoothStep(progress)
            );
            gsap.set(".hero-cards", {
              opacity: heroCardsContainerOpacity,
            });

            ["#hero-card-1", "#hero-card-2", "#hero-card-3"].forEach(
              (cardId, index) => {
                const delay = index * 0.9;
                const cardProgress = gsap.utils.clamp(
                  0,
                  1,
                  (progress - delay * 0.1) / (1 - delay * 0.1)
                );

                const y = gsap.utils.interpolate(
                  "0%",
                  "350%",
                  smoothStep(cardProgress)
                );
                const scale = gsap.utils.interpolate(
                  1,
                  0.75,
                  smoothStep(cardProgress)
                );

                let x = "0%";
                let rotation = 0;
                if (index === 0) {
                  x = gsap.utils.interpolate(
                    "0%",
                    "90%",
                    smoothStep(cardProgress)
                  );
                  rotation = gsap.utils.interpolate(
                    0,
                    -15,
                    smoothStep(cardProgress)
                  );
                } else if (index === 2) {
                  x = gsap.utils.interpolate(
                    "0%",
                    "-90%",
                    smoothStep(cardProgress)
                  );
                  rotation = gsap.utils.interpolate(
                    0,
                    15,
                    smoothStep(cardProgress)
                  );
                }

                gsap.set(cardId, {
                  y: y,
                  x: x,
                  rotation: rotation,
                  scale: scale,
                });
              }
            );
          },
        });
      }

      // Services Pin - Solo si existe el elemento .services dentro del componente
      const servicesElement = rootRef.current?.querySelector(".services");
      if (servicesElement) {
        ScrollTrigger.create({
          trigger: servicesElement,
          start: "top top",
          end: `+=${window.innerHeight * 4}px`,
          pin: servicesElement,
          pinSpacing: true,
        });

        ScrollTrigger.create({
          trigger: servicesElement,
          start: "top top",
          end: `+=${window.innerHeight * 4}px`,
          onLeave: () => {
            const servicesRect = servicesElement.getBoundingClientRect();
            const servicesTop = window.pageYOffset + servicesRect.top;

            gsap.set(".cards", {
              position: "absolute",
              top: servicesTop,
              left: 0,
              width: "100vw",
              height: "100vh",
            });
          },
          onEnterBack: () => {
            gsap.set(".cards", {
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
            });
          },
        });
      }

      // Cards Animation - Solo si existe el elemento .services dentro del componente
      if (servicesElement) {
        ScrollTrigger.create({
          trigger: servicesElement,
          start: "top bottom",
          end: `+=${window.innerHeight * 4}`,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress;

            const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9);
            const headerY = gsap.utils.interpolate(
              "400%",
              "0%",
              smoothStep(headerProgress)
            );
            gsap.set(".services-header", {
              y: headerY,
            });

            ["#card-1", "#card-2", "#card-3"].forEach((cardId, index) => {
              const delay = index * 0.5;
              const cardProgress = gsap.utils.clamp(
                0,
                1,
                (progress - delay * 0.1) / (0.9 - delay * 0.1)
              );

              const innerCard = document.querySelector(
                `${cardId} .flip-card-inner`
              );

              let y;
              if (cardProgress < 0.4) {
                const normalizedProgress = cardProgress / 0.4;
                y = gsap.utils.interpolate(
                  "-100%",
                  "50%",
                  smoothStep(normalizedProgress)
                );
              } else if (cardProgress < 0.6) {
                const normalizedProgress = (cardProgress - 0.4) / 0.2;
                y = gsap.utils.interpolate(
                  "50%",
                  "0%",
                  smoothStep(normalizedProgress)
                );
              } else {
                y = "0%";
              }

              let scale;
              if (cardProgress < 0.4) {
                const normalizedProgress = cardProgress / 0.4;
                scale = gsap.utils.interpolate(
                  0.25,
                  0.75,
                  smoothStep(normalizedProgress)
                );
              } else if (cardProgress < 0.6) {
                const normalizedProgress = (cardProgress - 0.4) / 0.2;
                scale = gsap.utils.interpolate(
                  0.75,
                  1,
                  smoothStep(normalizedProgress)
                );
              } else {
                scale = 1;
              }

              let opacity;
              if (cardProgress < 0.2) {
                const normalizedProgress = cardProgress / 0.2;
                opacity = smoothStep(normalizedProgress);
              } else {
                opacity = 1;
              }

              let x, rotate, rotationY;
              if (cardProgress < 0.6) {
                x = index === 0 ? "100%" : index === 1 ? "0%" : "-100%";
                rotate = index === 0 ? -5 : index === 1 ? 0 : 5;
                rotationY = 0;
              } else if (cardProgress < 1) {
                const normalizedProgress = (cardProgress - 0.6) / 0.4;
                x = gsap.utils.interpolate(
                  index === 0 ? "100%" : index === 1 ? "0%" : "-100%",
                  "0%",
                  smoothStep(normalizedProgress)
                );
                rotate = gsap.utils.interpolate(
                  index === 0 ? -5 : index === 1 ? 0 : 5,
                  0,
                  smoothStep(normalizedProgress)
                );
                rotationY = smoothStep(normalizedProgress) * 180;
              } else {
                x = "0%";
                rotate = 0;
                rotationY = 180;
              }

              gsap.set(cardId, {
                opacity: opacity,
                y: y,
                x: x,
                rotate: rotate,
                scale: scale,
              });

              gsap.set(innerCard, {
                rotationY: rotationY,
              });
            });
          },
        });
      }
    }

    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // Solo destruir Lenis si lo creamos nosotros
      if (lenis && window.lenis === lenis) {
        lenis.destroy();
        window.lenis = null;
      }
    };
  }, []);

  return (
    <div ref={rootRef}>
      <section class="hero">
        <div class="hero-cards">
           <div class="card" id="hero-card-1">
             <div class="card-title">
               <span>UX/UI</span>
               <span>01</span>
             </div>
             <div class="card-image">
               <img src="/tech/figma.svg" alt="UX/UI Design" />
             </div>
             <div class="card-title">
               <span>01</span>
               <span>UX/UI</span>
             </div>
           </div>

           <div class="card" id="hero-card-2">
             <div class="card-title">
               <span>FrontEnd</span>
               <span>02</span>
             </div>
             <div class="card-image">
               <img src="/tech/react.svg" alt="FrontEnd Development" />
             </div>
             <div class="card-title">
               <span>02</span>
               <span>FrontEnd</span>
             </div>
           </div>

           <div class="card" id="hero-card-3">
             <div class="card-title">
               <span>BackEnd</span>
               <span>03</span>
             </div>
             <div class="card-image">
               <img src="/tech/springboot.svg" alt="BackEnd Development" />
             </div>
             <div class="card-title">
               <span>03</span>
               <span>BackEnd</span>
             </div>
           </div>
        </div>
      </section>

      <section class="about">
        <h1>Keep scrolling — it gets good</h1>
      </section>

      <section class="services">
        <div class="services-header">
          <h1>Stuff I make so you don’t have to</h1>
        </div>

        <div class="mobile-cards">
          <div class="cards-container">
            <div class="card" id="mobile-card-1">
              <div class="card-wrapper">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <div class="card-title">
                      <span>UX/UI</span>
                      <span>01</span>
                    </div>
                    <div class="card-title">
                      <span>01</span>
                      <span>UX/UI</span>
                    </div>
                  </div>
                  <div class="flip-card-back">
                    <div class="card-title">
                      <span>UX/UI</span>
                      <span>01</span>
                    </div>
                    <div class="card-copy">
                      <p>User Research</p>
                      <p>Wireframes</p>
                      <p>Prototypes</p>
                      <p>Visual Design</p>
                      <p>Interaction Design</p>
                      <p>Design Systems</p>
                    </div>
                    <div class="card-title">
                      <span>01</span>
                      <span>UX/UI</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" id="mobile-card-2">
              <div class="card-wrapper">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <div class="card-title">
                      <span>FrontEnd</span>
                      <span>02</span>
                    </div>
                    <div class="card-title">
                      <span>02</span>
                      <span>FrontEnd</span>
                    </div>
                  </div>
                  <div class="flip-card-back">
                    <div class="card-title">
                      <span>FrontEnd</span>
                      <span>02</span>
                    </div>
                    <div class="card-copy">
                      <p>React & Next.js</p>
                      <p>TypeScript</p>
                      <p>Tailwind CSS</p>
                      <p>GSAP Animations</p>
                      <p>Responsive Design</p>
                      <p>Performance</p>
                    </div>
                    <div class="card-title">
                      <span>02</span>
                      <span>FrontEnd</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="card" id="mobile-card-3">
              <div class="card-wrapper">
                <div class="flip-card-inner">
                  <div class="flip-card-front">
                    <div class="card-title">
                      <span>BackEnd</span>
                      <span>03</span>
                    </div>
                    <div class="card-title">
                      <span>03</span>
                      <span>BackEnd</span>
                    </div>
                  </div>
                  <div class="flip-card-back">
                    <div class="card-title">
                      <span>BackEnd</span>
                      <span>03</span>
                    </div>
                    <div class="card-copy">
                      <p>Node.js & Express</p>
                      <p>Spring Boot</p>
                      <p>PostgreSQL & MongoDB & MySQL</p>
                      <p>RESTful APIs</p>
                      <p>Authentication</p>
                      <p>Deployment</p>
                    </div>
                    <div class="card-title">
                      <span>03</span>
                      <span>BackEnd</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="cards">
        <div class="cards-container">
           <div class="card" id="card-1">
             <div class="card-wrapper">
               <div class="flip-card-inner">
                 <div class="flip-card-front">
                   <div class="card-title">
                     <span>UX/UI</span>
                     <span>01</span>
                   </div>
                   <div class="card-image">
                     <img src="/tech/figma.svg" alt="UX/UI Design" />
                   </div>
                   <div class="card-title">
                     <span>01</span>
                     <span>UX/UI</span>
                   </div>
                 </div>
                 <div class="flip-card-back">
                   <div class="card-title">
                     <span>UX/UI</span>
                     <span>01</span>
                   </div>
                   <div class="card-copy">
                     <p>User Research</p>
                     <p>Wireframes</p>
                     <p>Prototypes</p>
                     <p>Visual Design</p>
                     <p>Interaction Design</p>
                     <p>Design Systems</p>
                   </div>
                   <div class="card-title">
                     <span>01</span>
                     <span>UX/UI</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           <div class="card" id="card-2">
             <div class="card-wrapper">
               <div class="flip-card-inner">
                 <div class="flip-card-front">
                   <div class="card-title">
                     <span>FrontEnd</span>
                     <span>02</span>
                   </div>
                   <div class="card-image">
                     <img src="/tech/react.svg" alt="FrontEnd Development" />
                   </div>
                   <div class="card-title">
                     <span>02</span>
                     <span>FrontEnd</span>
                   </div>
                 </div>
                 <div class="flip-card-back">
                   <div class="card-title">
                     <span>FrontEnd</span>
                     <span>02</span>
                   </div>
                   <div class="card-copy">
                     <p>React & Next.js</p>
                     <p>TypeScript</p>
                     <p>Tailwind CSS</p>
                     <p>GSAP Animations</p>
                     <p>Responsive Design</p>
                     <p>Performance</p>
                   </div>
                   <div class="card-title">
                     <span>02</span>
                     <span>FrontEnd</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>

           <div class="card" id="card-3">
             <div class="card-wrapper">
               <div class="flip-card-inner">
                 <div class="flip-card-front">
                   <div class="card-title">
                     <span>BackEnd</span>
                     <span>03</span>
                   </div>
                   <div class="card-image">
                     <img src="/tech/springboot.svg" alt="BackEnd Development" />
                   </div>
                   <div class="card-title">
                     <span>03</span>
                     <span>BackEnd</span>
                   </div>
                 </div>
                 <div class="flip-card-back">
                   <div class="card-title">
                     <span>BackEnd</span>
                     <span>03</span>
                   </div>
                   <div class="card-copy">
                     <p>Node.js & Express</p>
                     <p>Spring Boot</p>
                     <p>PostgreSQL & MongoDB & MySQL</p>
                     <p>RESTful APIs</p>
                     <p>Authentication</p>
                     <p>Deployment</p>
                   </div>
                   <div class="card-title">
                     <span>03</span>
                     <span>BackEnd</span>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default CardsService;
