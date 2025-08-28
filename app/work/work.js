// Importar las dependencias necesarias
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import * as THREE from "three";

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Función principal que se ejecuta inmediatamente
const initWorkPage = () => {
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
  
  console.log('Lenis initialized');
  console.log('ScrollTrigger plugins registered');

  const workSection = document.querySelector(".work");
  const cardsContainer = document.querySelector(".cards");
  const textContainer = document.querySelector(".text-container");
  
  if (!workSection || !cardsContainer || !textContainer) {
    console.error("Elementos necesarios no encontrados:", { workSection, cardsContainer, textContainer });
    return;
  }
  
  console.log('Elementos encontrados:', { 
    workSection: !!workSection, 
    cardsContainer: !!cardsContainer, 
    textContainer: !!textContainer 
  });

  const moveDistance = window.innerWidth * 5;
  let currentXPosition = 0;

  const lerp = (start, end, t) => start + (end - start) * t;

  // ---------- GRID CANVAS ----------
  const gridCanvas = document.createElement("canvas");
  gridCanvas.id = "grid-canvas";
  workSection.appendChild(gridCanvas);
  const gridCtx = gridCanvas.getContext("2d");

  const resizeGridCanvas = () => {
    const dpr = window.devicePixelRatio || 1;
    [gridCanvas.width, gridCanvas.height] = [
      window.innerWidth * dpr,
      window.innerHeight * dpr,
    ];
    [gridCanvas.style.width, gridCanvas.style.height] = [
      `${window.innerWidth}px`,
      `${window.innerHeight}px`,
    ];
    gridCtx.scale(dpr, dpr);
  };
  resizeGridCanvas();

  const drawGrid = (scrollProgress = 0) => {
    gridCtx.fillStyle = "black";
    gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height);
    gridCtx.fillStyle = "#f40c3f";
    const [dotSize, spacing] = [1, 30];
    const [rows, cols] = [
      Math.ceil(gridCanvas.height / spacing),
      Math.ceil(gridCanvas.width / spacing) + 15,
    ];
    
    // Filas pares van a la derecha, impares a la izquierda
    for (let y = 0; y < rows; y++) {
      const direction = y % 2 === 0 ? 1 : -1;
      const offset = (scrollProgress * spacing * 15 * direction) % spacing;
      
      for (let x = 0; x < cols; x++) {
        gridCtx.beginPath();
        gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2);
        gridCtx.fill();
      }
    }
  };

  // ---------- THREE.JS LETTERS ----------
  const lettersScene = new THREE.Scene();
  const lettersCamera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  lettersCamera.position.z = 20;

  const lettersRenderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
  });
  lettersRenderer.setSize(window.innerWidth, window.innerHeight);
  lettersRenderer.setClearColor(0x000000, 0);
  lettersRenderer.setPixelRatio(window.devicePixelRatio);
  lettersRenderer.domElement.id = "letters-canvas";
  workSection.appendChild(lettersRenderer.domElement);

  const createTextAnimationPath = (yPos, amplitude) => {
    const points = [];
    for (let i = 0; i <= 20; i++) {
      const t = i / 20;
      points.push(
        new THREE.Vector3(
          -25 + 50 * t,
          yPos + Math.sin(t * Math.PI) * -amplitude,
          (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5
        )
      );
    }
    const curve = new THREE.CatmullRomCurve3(points);
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
      new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 })
    );
    line.curve = curve;
    return line;
  };

  const path = [
    createTextAnimationPath(10, 2),
    createTextAnimationPath(3.5, 1),
    createTextAnimationPath(-3.5, -1),
    createTextAnimationPath(-10, -2),
  ];
  path.forEach((line) => lettersScene.add(line));

  const letterPositions = new Map();
  path.forEach((line, i) => {
    line.letterElements = Array.from({ length: 15 }, () => {
      const el = document.createElement("div");
      el.className = "letter";
      el.textContent = ["W", "O", "R", "K"][i];
      textContainer.appendChild(el);
      letterPositions.set(el, {
        current: { x: 0, y: 0 },
        target: { x: 0, y: 0 },
      });
      return el;
    });
  });

  const updateTargetPositions = (scrollProgress = 0) => {
    path.forEach((line, lineIndex) => {
      line.letterElements.forEach((element, i) => {
        // Líneas pares van a la derecha, impares a la izquierda
        const direction = lineIndex % 2 === 0 ? 1 : -1;
        const speed = 2; // Velocidad de movimiento
        
        // Calcular posición basada en scroll y dirección
        const t = (i / 14 + scrollProgress * speed * direction) % 1;
        
        const point = line.curve.getPoint(t);
        const vector = point.clone().project(lettersCamera);
        const positions = letterPositions.get(element);
        positions.target = {
          x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
          y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
        };
      });
    });
  };

  const updateLetterPositions = () => {
    letterPositions.forEach((positions, element) => {
      const distX = positions.target.x - positions.current.x;
      if (Math.abs(distX) > window.innerWidth * 0.7) {
        [positions.current.x, positions.current.y] = [
          positions.target.x,
          positions.target.y,
        ];
      } else {
        positions.current.x = lerp(
          positions.current.x,
          positions.target.x,
          0.07
        );
        positions.current.y = lerp(
          positions.current.y,
          positions.target.y,
          0.07
        );
      }
      element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`;
    });
  };

  const updateCardsPosition = () => {
    const currentProgress = ScrollTrigger.getAll()[0]?.progress || 0;
    const targetX = -moveDistance * currentProgress;
    currentXPosition = lerp(currentXPosition, targetX, 0.1); // Más suave
    
    gsap.set(cardsContainer, {
      x: currentXPosition,
    });
  };

  const animate = () => {
    // Obtener el progreso actual del scroll
    const currentProgress = ScrollTrigger.getAll()[0]?.progress || 0;
    
    // Actualizar posiciones de letras y grid en cada frame
    updateTargetPositions(currentProgress);
    drawGrid(currentProgress);
    
    updateLetterPositions();
    updateCardsPosition();
    lettersRenderer.render(lettersScene, lettersCamera);
    
    requestAnimationFrame(animate);
  };

  const scrollTrigger = ScrollTrigger.create({
    trigger: ".work",
    start: "top top",
    end: "+=500%", // Reducido para mejor control
    pin: true,
    pinSpacing: false,
    scrub: 0.5, // Más suave
    onUpdate: (self) => {
      console.log('ScrollTrigger progress:', self.progress);
    },
  });

  // Inicializar todo
  drawGrid(0);
  updateTargetPositions(0);
  
  // Iniciar animación después de un pequeño delay
  setTimeout(() => {
    animate();
  }, 100);

  window.addEventListener("resize", () => {
    resizeGridCanvas();
    drawGrid(ScrollTrigger.getAll()[0]?.progress || 0);
    lettersCamera.aspect = window.innerWidth / window.innerHeight;
    lettersCamera.updateProjectionMatrix();
    lettersRenderer.setSize(window.innerWidth, window.innerHeight);
    updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0);
  });

  // Cleanup function
  return () => {
    lenis.destroy();
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    if (workSection.contains(gridCanvas)) workSection.removeChild(gridCanvas);
    if (workSection.contains(lettersRenderer.domElement)) {
      workSection.removeChild(lettersRenderer.domElement);
    }
  };
};

// Ejecutar inmediatamente
initWorkPage();
  