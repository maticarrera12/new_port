"use client";
import Image from "next/image";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "./styles.css";

declare global {
  interface Window {
    duplicateIcons: HTMLElement[] | null;
  }
}

const AboutPage = () => {
  const lenisRef = useRef<Lenis | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis();
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    const animatedIcons = document.querySelector(".animated-icons");
    const iconElements = document.querySelectorAll(".animated-icon");
    const textSegments = document.querySelectorAll(".text-segment");
    const placeholders = document.querySelectorAll(".placeholder-icon");
    const heroHeader = document.querySelector(".hero-header");
    const heroSection = document.querySelector(".hero");

    const textAnimationOrder: { segment: Element; originalIndex: number }[] =
      [];
    textSegments.forEach((segment, index) => {
      textAnimationOrder.push({ segment, originalIndex: index });
    });

    for (let i = textAnimationOrder.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [textAnimationOrder[i], textAnimationOrder[j]] = [
        textAnimationOrder[j],
        textAnimationOrder[i],
      ];
    }

    const isMobile = window.innerWidth <= 1000;
    const headerIconSize = isMobile ? 30 : 60;
    const currentIconSize = iconElements[0].getBoundingClientRect().width;
    const exactScale = headerIconSize / currentIconSize;

    ScrollTrigger.create({
      trigger: ".hero",
      start: "top top",
      end: `+=${window.innerHeight * 8}px`,
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;

        textSegments.forEach((segment) => {
          gsap.set(segment, { opacity: 0 });
        });

        if (progress <= 0.3) {
          const moveProgress = progress / 0.3;
          const containerMoveY = -window.innerHeight * 0.3 * moveProgress;

          if (progress <= 0.15) {
            const headerProgress = progress / 0.15;
            const headerMoveY = -50 * headerProgress;
            const headerOpacity = 1 - headerProgress;

            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + ${headerMoveY}px))`,
              opacity: headerOpacity,
            });
          } else {
            gsap.set(heroHeader, {
              transform: `translate(-50%, calc(-50% + -50px))`,
              opacity: 0,
            });
          }

          if (window.duplicateIcons) {
            window.duplicateIcons.forEach((duplicate: HTMLElement) => {
              if (duplicate.parentNode) {
                duplicate.parentNode.removeChild(duplicate);
              }
            });
            window.duplicateIcons = null;
          }

          gsap.set(animatedIcons!, {
            x: 0,
            y: containerMoveY,
            scale: 1,
            opacity: 1,
          });

          iconElements.forEach((icon, index) => {
            const staggerDelay = index * 0.1;
            const iconStart = staggerDelay;
            const iconEnd = staggerDelay + 0.5;

            const iconProgress = gsap.utils.mapRange(
              iconStart,
              iconEnd,
              0,
              1,
              moveProgress
            );
            const clampedProgress = Math.max(0, Math.min(1, iconProgress));

            const startOffset = -containerMoveY;
            const individualY = startOffset * (1 - clampedProgress);

            gsap.set(icon, {
              x: 0,
              y: individualY,
            });
          });
        } else if (progress <= 0.6) {
          const scaleProgress = (progress - 0.3) / 0.3;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });

          if (scaleProgress >= 0.5) {
            (heroSection as HTMLElement)!.style.backgroundColor = "#FAFAFA";
          } else {
            (heroSection as HTMLElement)!.style.backgroundColor = "#141414";
          }

          // Hide duplicate icons during scaling phase
          hideDuplicateIcons();

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons!.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = (targetCenterX - currentCenterX) * scaleProgress;
          const deltaY = (targetCenterY - currentCenterY) * scaleProgress;
          const baseY = -window.innerHeight * 0.3;
          const currentScale = 1 + (exactScale - 1) * scaleProgress;

          gsap.set(animatedIcons!, {
            x: deltaX,
            y: baseY + deltaY,
            scale: currentScale,
            opacity: 1,
          });

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 });
          });
        } else if (progress <= 0.75) {
          const moveProgress = (progress - 0.6) / 0.15;

          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -50px))`,
            opacity: 0,
          });

          (heroSection as HTMLElement)!.style.backgroundColor = "#FAFAFA";

          const targetCenterY = window.innerHeight / 2;
          const targetCenterX = window.innerWidth / 2;
          const containerRect = animatedIcons!.getBoundingClientRect();
          const currentCenterX = containerRect.left + containerRect.width / 2;
          const currentCenterY = containerRect.top + containerRect.height / 2;
          const deltaX = targetCenterX - currentCenterX;
          const deltaY = targetCenterY - currentCenterY;
          const baseY = -window.innerHeight * 0.3;

          gsap.set(animatedIcons, {
            x: deltaX,
            y: baseY + deltaY,
            scale: exactScale,
            opacity: 0,
          });

          iconElements.forEach((icon) => {
            gsap.set(icon, { x: 0, y: 0 });
          });

          if (!window.duplicateIcons) {
            window.duplicateIcons = [];

            iconElements.forEach((icon, index) => {
              const duplicate = icon.cloneNode(true) as HTMLElement;
              duplicate.className = "duplicate-icon";
              duplicate.style.position = "absolute";
              duplicate.style.width = headerIconSize + "px";
              duplicate.style.height = headerIconSize + "px";

              document.body.appendChild(duplicate);
              window.duplicateIcons.push(duplicate);
            });
          }

          if (window.duplicateIcons) {
            window.duplicateIcons.forEach((duplicate, index) => {
              if (index < placeholders.length) {
                const iconRect = iconElements[index].getBoundingClientRect();
                const startCenterX = iconRect.left + iconRect.width / 2;
                const startCenterY = iconRect.top + iconRect.height / 2;
                const startPageX = startCenterX + window.pageXOffset;
                const startPageY = startCenterY + window.pageYOffset;

                const targetRect = placeholders[index].getBoundingClientRect();
                const targetCenterX = targetRect.left + targetRect.width / 2;
                const targetCenterY = targetRect.top + targetRect.height / 2;
                const targetPageX = targetCenterX + window.pageXOffset;
                const targetPageY = targetCenterY + window.pageYOffset;

                const moveX = targetPageX - startPageX;
                const moveY = targetPageY - startPageY;

                let currentX = 0;
                let currentY = 0;

                if (moveProgress <= 0.5) {
                  const verticalProgress = moveProgress / 0.5;
                  currentY = moveY * verticalProgress;
                } else {
                  const horizontalProgress = (moveProgress - 0.5) / 0.5;
                  currentY = moveY;
                  currentX = moveX * horizontalProgress;
                }

                const finalPageX = startPageX + currentX;
                const finalPageY = startPageY + currentY;

                duplicate.style.left = finalPageX - headerIconSize / 2 + "px";
                duplicate.style.top = finalPageY - headerIconSize / 2 + "px";
                duplicate.style.opacity = "1";
                duplicate.style.display = "flex";
              }
            });
          }
        } else {
          gsap.set(heroHeader, {
            transform: `translate(-50%, calc(-50% + -100px))`,
            opacity: 0,
          });

          (heroSection as HTMLElement)!.style.backgroundColor = "#FAFAFA";

          gsap.set(animatedIcons, { opacity: 0 });

          if (window.duplicateIcons) {
            window.duplicateIcons.forEach((duplicate, index) => {
              if (index < placeholders.length) {
                const targetRect = placeholders[index].getBoundingClientRect();
                const targetCenterX = targetRect.left + targetRect.width / 2;
                const targetCenterY = targetRect.top + targetRect.height / 2;
                const targetPageX = targetCenterX + window.pageXOffset;
                const targetPageY = targetCenterY + window.pageYOffset;

                duplicate.style.left = targetPageX - headerIconSize / 2 + "px";
                duplicate.style.top = targetPageY - headerIconSize / 2 + "px";
                duplicate.style.opacity = "1";
                duplicate.style.display = "flex";
              }
            });
          }

          textAnimationOrder.forEach((item, randomIndex) => {
            const segmentStart = 0.75 + randomIndex * 0.03;
            const segmentEnd = segmentStart + 0.015;

            const segmentProgress = gsap.utils.mapRange(
              segmentStart,
              segmentEnd,
              0,
              1,
              progress
            );
            const clampedProgress = Math.max(0, Math.min(1, segmentProgress));

            gsap.set(item.segment, {
              opacity: clampedProgress,
            });
          });
        }
      },
    });

    // Cleanup function
    return () => {
      const currentAnimationFrame = animationFrameRef.current;
      if (currentAnimationFrame) {
        cancelAnimationFrame(currentAnimationFrame);
      }

      // Clean up Lenis
      const currentLenis = lenisRef.current;
      if (currentLenis) {
        currentLenis.destroy();
        gsap.ticker.remove((time) => currentLenis.raf(time * 1000));
      }

      // Clean up GSAP
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

      // Clean up duplicate icons
      if (window.duplicateIcons) {
        window.duplicateIcons.forEach((duplicate: HTMLElement) => {
          if (duplicate.parentNode) {
            duplicate.parentNode.removeChild(duplicate);
          }
        });
        window.duplicateIcons = null;
      }
    };
  }, []);

  return (
    <div>
    <div className="min-h-screen about">
      <section className="hero">
        <div className="hero-header">
          <h1>MCarrera</h1>
          <p>Full Stack Developer & UI/UX Designer</p>
        </div>

        <div className="animated-icons">
          <div className="animated-icon icon-1">
            <Image
              src="/about/icon_1.png"
              alt="Icon 1"
              width={60}
              height={60}
            />
          </div>
          <div className="animated-icon icon-2">
            <Image
              src="/about/icon_2.png"
              alt="Icon 2"
              width={60}
              height={60}
            />
          </div>
          <div className="animated-icon icon-3">
            <Image
              src="/about/icon_3.png"
              alt="Icon 3"
              width={60}
              height={60}
            />
          </div>
          <div className="animated-icon icon-4">
            <Image
              src="/about/icon_4.png"
              alt="Icon 4"
              width={60}
              height={60}
            />
          </div>
          <div className="animated-icon icon-5">
            <Image
              src="/about/icon_5.png"
              alt="Icon 5"
              width={60}
              height={60}
            />
          </div>
        </div>

        <h1 className="animated-text">
          <span className="text-segment">Crafting</span>
          <div className="placeholder-icon"></div>
          <span className="text-segment">digital</span>
          <span className="text-segment"> experiences that</span>
          <div className="placeholder-icon"></div>
          <span className="text-segment">blend functionality </span>
          <span className="text-segment">with</span>
          <div className="placeholder-icon"></div>
          <span className="text-segment">beautiful</span>
          <div className="placeholder-icon"></div>
          <span className="text-segment">interface design </span>
          <span className="text-segment">and seamless user</span>
          <div className="placeholder-icon"></div>
          <span className="text-segment">interactions.</span>
        </h1>
      </section>
    </div>
    <div>
    </div>
    </div>
  );
};

export default AboutPage;
