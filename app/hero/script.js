gsap.registerPlugin(ScrollTrigger);

window.addEventListener("load", () => {
  const images = document.querySelectorAll(".grid-img");
  const gridItems = document.querySelectorAll(".parent div");
  const heroParent = document.querySelector(".hero .parent");

  images.forEach((img, i) => {
    const target = gridItems[i];

    // Obtener rotación inicial
    const computedStyle = window.getComputedStyle(img);
    const transform = computedStyle.transform;
    let startRotation = 0;
    if (transform && transform !== "none") {
      const matrix = transform.match(/matrix\(([^)]+)\)/);
      if (matrix) {
        const values = matrix[1].split(",").map((v) => parseFloat(v.trim()));
        if (values.length >= 4) {
          startRotation = Math.atan2(values[1], values[0]) * (180 / Math.PI);
        }
      }
    }

    // Guardar posiciones iniciales absolutas
    const rect = img.getBoundingClientRect();
    const startX = rect.left;
    const startY = rect.top;
    const startWidth = rect.width;
    const startHeight = rect.height;

    // Configurar posición inicial fija
    gsap.set(img, {
      position: "fixed",
      left: startX,
      top: startY,
      width: startWidth,
      height: startHeight,
      rotation: startRotation,
      zIndex: 1000,
    });

    // ScrollTrigger
    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      onUpdate: (self) => {
        const progress = gsap.utils.clamp(0, 1, self.progress);

        const targetRect = target.getBoundingClientRect();
        const finalX = targetRect.left;
        const finalY = targetRect.top;
        const finalWidth = targetRect.width;
        const finalHeight = targetRect.height;

        // Interpolar siempre entre hero y target
        const currentX = gsap.utils.interpolate(startX, finalX, progress);
        const currentY = gsap.utils.interpolate(startY, finalY, progress);
        const currentWidth = gsap.utils.interpolate(
          startWidth,
          finalWidth,
          progress
        );
        const currentHeight = gsap.utils.interpolate(
          startHeight,
          finalHeight,
          progress
        );
        const currentRotation = gsap.utils.interpolate(
          startRotation,
          0,
          progress
        );

        gsap.set(img, {
          left: currentX,
          top: currentY,
          width: currentWidth,
          height: currentHeight,
          rotation: currentRotation,
        });

        // Solo al final absoluto del scroll, mover al div final
        if (progress >= 1) {
          target.appendChild(img);
          gsap.set(img, {
            position: "absolute",
            left: 0,
            top: 0,
            width: "100%",
            height: "100%",
            rotation: 0,
            objectFit: "cover",
            borderRadius: "6px",
            zIndex: 1,
          });
          target.style.color = "transparent";
        }
        // Si scroll sube, restaurar al hero
        else if (img.parentElement === target && progress < 1) {
          heroParent.appendChild(img);
          gsap.set(img, {
            position: "fixed",
            left: currentX,
            top: currentY,
            width: currentWidth,
            height: currentHeight,
            rotation: currentRotation,
            zIndex: 1000,
          });
          target.style.color = "#2980b9";
        }
      },
    });
  });
});
