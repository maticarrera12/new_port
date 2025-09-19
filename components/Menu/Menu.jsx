"use client";
import "./Menu.css";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { SplitText } from "gsap/all";
import { useGSAP } from "@gsap/react";
import Link from "next/link";

gsap.registerPlugin(SplitText, useGSAP);

const Menu = ({ containerRef }) => {
  const navToggleRef = useRef(null);
  const menuOverlayRef = useRef(null);
  const menuContentRef = useRef(null);
  const menuImageRef = useRef(null);
  const menuLinksWrapperRef = useRef(null);
  const linkHighlighterRef = useRef(null);
  const menuLinksRef = useRef([]);
  const menuLinkContainersRef = useRef([]);
  const menuContentItemsRef = useRef([]);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMenuAnimating, setIsMenuAnimating] = useState(false);

  const menuItems = [
    { label: "Home", route: "/" },
    { label: "Services", route: "/services" },
    { label: "Work", route: "/work" },
    { label: "About", route: "/about" },
    { label: "Write", route: "/write" },
  ];

  const currentX = useRef(0);
  const targetX = useRef(0);
  const lerpFactor = 0.05;

  const currentHighlighterX = useRef(0);
  const targetHighlighterX = useRef(0);
  const currentHighlighterWidth = useRef(0);
  const targetHighlighterWidth = useRef(0);

  const animationFrameRef = useRef(null);

  useGSAP(
    () => {
      const menuLinks = menuLinksRef.current;
      const menuOverlay = menuOverlayRef.current;
      const menuLinksWrapper = menuLinksWrapperRef.current;
      const linkHighlighter = linkHighlighterRef.current;
      const menuContent = menuContentRef.current;
      const menuImage = menuImageRef.current;
      const container = containerRef.current;
      const menuLinkContainers = menuLinkContainersRef.current;
      const menuContentItems = menuContentItemsRef.current;

      menuLinks.forEach((link) => {
        const chars = link.querySelectorAll("span");
        chars.forEach((char, charIndex) => {
          const split = new SplitText(char, { type: "chars" });
          split.chars.forEach((char) => {
            char.classList.add("char");
          });
          if (charIndex === 1) {
            gsap.set(split.chars, { y: "110%" });
          }
        });
      });

      // Configurar SplitText para elementos del contenido del menú
      menuContentItems.forEach((contentItem) => {
        if (contentItem) {
          const chars = contentItem.querySelectorAll("span");
          chars.forEach((char, charIndex) => {
            const split = new SplitText(char, { type: "chars" });
            split.chars.forEach((char) => {
              char.classList.add("char");
            });
            if (charIndex === 1) {
              gsap.set(split.chars, { y: "110%" });
            }
          });
        }
      });

      gsap.set(menuContent, { y: "50%", opacity: 0.25 });
      gsap.set(menuImage, { scale: 0.5, opacity: 0.25 });
      gsap.set(menuLinks, { y: "150%" });
      gsap.set(linkHighlighter, { y: "150%" });

      const defaultLinkText = menuLinksWrapper.querySelector(
        ".menu-link:first-child a span"
      );
      if (defaultLinkText) {
        const linkWidth = defaultLinkText.offsetWidth;
        linkHighlighter.style.width = linkWidth + "px";
        currentHighlighterWidth.current = linkWidth;
        targetHighlighterWidth.current = linkWidth;

        const defaultLinkTextElement = menuLinksWrapper.querySelector(
          ".menu-link:first-child"
        );
        const linkRect = defaultLinkTextElement.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();
        const initialX = linkRect.left - menuWrapperRect.left;
        currentHighlighterX.current = initialX;
        targetHighlighterX.current = initialX;
      }

      const handleMouseMove = (e) => {
        if (window.innerWidth < 1000) return;

        const mouseX = e.clientX;
        const viewportWidth = window.innerWidth;
        const menuLinksWrapperWidth = menuLinksWrapper.offsetWidth;

        const maxMoveLeft = 0;
        const maxMoveRight = viewportWidth - menuLinksWrapperWidth;

        const sensitivityRange = viewportWidth * 0.5;
        const startX = (viewportWidth - sensitivityRange) / 2;
        const endX = startX + sensitivityRange;

        let mousePercentage;
        if (mouseX <= startX) {
          mousePercentage = 0;
        } else if (mouseX >= endX) {
          mousePercentage = 1;
        } else {
          mousePercentage = (mouseX - startX) / sensitivityRange;
        }

        targetX.current =
          maxMoveLeft + mousePercentage * (maxMoveRight - maxMoveLeft);
      };

      menuLinkContainers.forEach((link) => {
        const handleMouseEnter = () => {
          if (window.innerWidth < 1000) return;

          const linkCopy = link.querySelectorAll("a span");
          const visibleCopy = linkCopy[0];
          const animatedCopy = linkCopy[1];

          const visibleChars = visibleCopy.querySelectorAll(".char");
          gsap.to(visibleChars, {
            y: "-110%",
            stagger: 0.03,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const animatedChars = animatedCopy.querySelectorAll(".char");
          gsap.to(animatedChars, {
            y: "0%",
            stagger: 0.03,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const linkRect = link.getBoundingClientRect();
          const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

          targetHighlighterX.current = linkRect.left - menuWrapperRect.left;

          const linkCopyElement = link.querySelector("a span");
          targetHighlighterWidth.current = linkCopyElement
            ? linkCopyElement.offsetWidth
            : link.offsetWidth;
        };

        const handleMouseLeave = () => {
          if (window.innerWidth < 1000) return;

          const linkCopy = link.querySelectorAll("a span");
          const visibleCopy = linkCopy[0];
          const animatedCopy = linkCopy[1];

          const animatedChars = animatedCopy.querySelectorAll(".char");
          gsap.to(animatedChars, {
            y: "110%",
            stagger: 0.03,
            duration: 0.5,
            ease: "expo.inOut",
          });

          const visibleChars = visibleCopy.querySelectorAll(".char");
          gsap.to(visibleChars, {
            y: "0%",
            stagger: 0.03,
            duration: 0.5,
            ease: "expo.inOut",
          });
        };

        link.addEventListener("mouseenter", handleMouseEnter);
        link.addEventListener("mouseleave", handleMouseLeave);
      });

      // Agregar animaciones hover para elementos del contenido del menú
      menuContentItems.forEach((contentItem) => {
        if (contentItem) {
          const handleContentMouseEnter = () => {
            const spans = contentItem.querySelectorAll("span");
            const visibleSpan = spans[0];
            const animatedSpan = spans[1];

            const visibleChars = visibleSpan.querySelectorAll(".char");
            gsap.to(visibleChars, {
              y: "-110%",
              stagger: 0.03,
              duration: 0.5,
              ease: "expo.inOut",
            });

            const animatedChars = animatedSpan.querySelectorAll(".char");
            gsap.to(animatedChars, {
              y: "0%",
              stagger: 0.03,
              duration: 0.5,
              ease: "expo.inOut",
            });
          };

          const handleContentMouseLeave = () => {
            const spans = contentItem.querySelectorAll("span");
            const visibleSpan = spans[0];
            const animatedSpan = spans[1];

            const animatedChars = animatedSpan.querySelectorAll(".char");
            gsap.to(animatedChars, {
              y: "110%",
              stagger: 0.03,
              duration: 0.5,
              ease: "expo.inOut",
            });

            const visibleChars = visibleSpan.querySelectorAll(".char");
            gsap.to(visibleChars, {
              y: "0%",
              stagger: 0.03,
              duration: 0.5,
              ease: "expo.inOut",
            });
          };

          contentItem._contentMouseEnterHandler = handleContentMouseEnter;
          contentItem._contentMouseLeaveHandler = handleContentMouseLeave;
          contentItem.addEventListener("mouseenter", handleContentMouseEnter);
          contentItem.addEventListener("mouseleave", handleContentMouseLeave);
        }
      });

      const handleMenuLinksWrapperMouseLeave = () => {
        const defaultLinkText = menuLinksWrapper.querySelector(
          ".menu-link:first-child"
        );
        const defaultLinkTextSpan = defaultLinkText.querySelector("a span");

        const linkRect = defaultLinkText.getBoundingClientRect();
        const menuWrapperRect = menuLinksWrapper.getBoundingClientRect();

        targetHighlighterX.current = linkRect.left - menuWrapperRect.left;
        targetHighlighterWidth.current = defaultLinkTextSpan.offsetWidth;
      };

      menuOverlay.addEventListener("mousemove", handleMouseMove);
      menuLinksWrapper.addEventListener(
        "mouseleave",
        handleMenuLinksWrapperMouseLeave
      );

      const animate = () => {
        currentX.current += (targetX.current - currentX.current) * lerpFactor;
        currentHighlighterX.current +=
          (targetHighlighterX.current - currentHighlighterX.current) *
          lerpFactor;
        currentHighlighterWidth.current +=
          (targetHighlighterWidth.current - currentHighlighterWidth.current) *
          lerpFactor;

        gsap.to(menuLinksWrapper, {
          x: currentX.current,
          duration: 0.3,
          ease: "power4.out",
        });

        gsap.to(linkHighlighter, {
          x: currentHighlighterX.current,
          width: currentHighlighterWidth.current,
          duration: 0.3,
          ease: "power4.out",
        });

        animationFrameRef.current = requestAnimationFrame(animate);
      };

      animate();

      return () => {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        menuOverlay.removeEventListener("mousemove", handleMouseMove);
        menuLinksWrapper.removeEventListener(
          "mouseleave",
          handleMenuLinksWrapperMouseLeave
        );

        menuLinkContainers.forEach((link) => {
          const mouseEnterHandler = link._mouseEnterHandler;
          const mouseLeaveHandler = link._mouseLeaveHandler;
          if (mouseEnterHandler)
            link.removeEventListener("mouseenter", mouseEnterHandler);
          if (mouseLeaveHandler)
            link.removeEventListener("mouseleave", mouseLeaveHandler);
        });

        // Limpiar event listeners de elementos del contenido del menú
        menuContentItems.forEach((contentItem) => {
          if (contentItem) {
            const mouseEnterHandler = contentItem._contentMouseEnterHandler;
            const mouseLeaveHandler = contentItem._contentMouseLeaveHandler;
            if (mouseEnterHandler)
              contentItem.removeEventListener("mouseenter", mouseEnterHandler);
            if (mouseLeaveHandler)
              contentItem.removeEventListener("mouseleave", mouseLeaveHandler);
          }
        });
      };
    },
    { scope: menuOverlayRef }
  );

  const toggleMenu = () => {
    if (isMenuAnimating) return;
    setIsMenuAnimating(true);

    // Cambiar el estado inmediatamente para que el texto cambie al inicio de la animación
    setIsMenuOpen(!isMenuOpen);

    const menuOverlay = menuOverlayRef.current;
    const menuContent = menuContentRef.current;
    const menuImage = menuImageRef.current;
    const menuLinks = menuLinksRef.current;
    const linkHighlighter = linkHighlighterRef.current;
    const menuLinksWrapper = menuLinksWrapperRef.current;

    if (!isMenuOpen) {
      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 100%, 100% 100%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(".menu-link", { overflow: "visible" });

          setIsMenuAnimating(false);
        },
      });

      gsap.to(menuContent, {
        y: "0%",
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.to(menuImage, {
        scale: 1,
        opacity: 1,
        duration: 1.5,
        ease: "expo.out",
      });

      gsap.to(menuLinks, {
        y: "0%",
        duration: 1.25,
        stagger: 0.1,
        delay: 0.25,
        ease: "expo.out",
      });

      gsap.to(linkHighlighter, {
        y: "0%",
        duration: 1,
        delay: 1,
        ease: "expo.out",
      });
    } else {
      gsap.to(menuLinks, {
        y: "-200%",
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuContent, {
        y: "-100%",
        opacity: 0.25,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuImage, {
        y: "-100%",
        opacity: 0.5,
        duration: 1.25,
        ease: "expo.out",
      });

      gsap.to(menuOverlay, {
        clipPath: "polygon(0% 0%, 100% 0%, 100% 0%, 0% 0%)",
        duration: 1.25,
        ease: "expo.out",
        onComplete: () => {
          gsap.set(menuOverlay, {
            clipPath: "polygon(0% 100%, 100% 100%, 100% 100%, 0% 100%)",
          });
          gsap.set(menuLinks, { y: "150%" });
          gsap.set(linkHighlighter, { y: "150%" });
          gsap.set(menuContent, { y: "50%", opacity: 0.25 });
          gsap.set(menuImage, { y: "0%", scale: 0.5, opacity: 0.25 });
          gsap.set(".menu-link", { overflow: "hidden" });

          gsap.set(menuLinksWrapper, { x: 0 });
          currentX.current = 0;
          targetX.current = 0;

          setIsMenuAnimating(false);
        },
      });
    }
  };

  return (
    <>
      <nav className="menu">
        <div className="nav-toggle" ref={navToggleRef} onClick={toggleMenu}>
          <p>{isMenuOpen ? "Close" : "Menu"}</p>
        </div>
        <Link href="/write" className="nav-item">
          <p>Write Me</p>
        </Link>
      </nav>

      <div className="menu-overlay menu" ref={menuOverlayRef}>
        <div className="menu-content" ref={menuContentRef}>
          <div className="menu-col">
            <p ref={(el) => (menuContentItemsRef.current[0] = el)}>
              <span>Matias Carrera</span>
              <span>Matias Carrera</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[1] = el)}>
              <span>Buenos Aires</span>
              <span>Buenos Aires</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[2] = el)}>
              <span>Argentina</span>
              <span>Argentina</span>
            </p>
            <br />
            <p ref={(el) => (menuContentItemsRef.current[3] = el)}>
              <span>Contact</span>
              <span>Contact</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[4] = el)}>
              <span>mcarreradev12@gmail.com</span>
              <span>mcarreradev12@gmail.com</span>
            </p>
            <br />
            <p ref={(el) => (menuContentItemsRef.current[5] = el)}>
              <span>Direct</span>
              <span>Direct</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[6] = el)}>
              <span>+54 11 5479 3056</span>
              <span>+54 11 5479 3056</span>
            </p>
          </div>
          <div className="menu-col">
            <p ref={(el) => (menuContentItemsRef.current[7] = el)}>
              <span>Github</span>
              <span>Github</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[8] = el)}>
              <span>Linkedin</span>
              <span>Linkedin</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[9] = el)}>
              <span>X</span>
              <span>X</span>
            </p>
            <br />
            <p ref={(el) => (menuContentItemsRef.current[10] = el)}>
              <span>English</span>
              <span>English</span>
            </p>
            <p ref={(el) => (menuContentItemsRef.current[11] = el)}>
              <span>Spanish</span>
              <span>Spanish</span>
            </p>
          </div>
        </div>

        <div className="menu-img" ref={menuImageRef}>
          <img src="/portfolio-illustration.png" alt="" />
        </div>

        <div className="menu-links-wrapper" ref={menuLinksWrapperRef}>
          {menuItems.map((item, index) => (
            <div
              key={item.label}
              className="menu-link"
              ref={(el) => (menuLinkContainersRef.current[index] = el)}
            >
              <a
                href={item.route}
                ref={(el) => (menuLinksRef.current[index] = el)}
              >
                <span>{item.label}</span>
                <span>{item.label}</span>
              </a>
            </div>
          ))}

          <div className="link-highlighter" ref={linkHighlighterRef}></div>
        </div>
      </div>
    </>
  );
};

export default Menu;
