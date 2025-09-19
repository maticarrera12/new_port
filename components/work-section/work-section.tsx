"use client"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import "./styles.css"
import Image from "next/image"
import { projects } from '../../app/assets/assets.js'

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

interface ExtendedLine extends THREE.Line {
  curve: THREE.CatmullRomCurve3;
  letterElements: HTMLElement[];
}

export default function WorkSection() {
  const workSectionRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const gridCanvasRef = useRef<HTMLCanvasElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const [isWorkSectionActive, setIsWorkSectionActive] = useState(false)

  useEffect(() => {
    if (!workSectionRef.current || !cardsContainerRef.current || !textContainerRef.current || !gridCanvasRef.current)
      return

    // Agregar funcionalidad de click a las tarjetas
    const handleCardClick = (e: Event) => {
      const target = e.currentTarget as HTMLElement
      const projectLink = target.getAttribute('data-project-link')
      if (projectLink && projectLink !== '#') {
        window.open(projectLink, '_blank')
      }
    }

    // Agregar event listeners a las tarjetas existentes
    const cardsContainer = cardsContainerRef.current
    const cards = cardsContainer?.querySelectorAll('.card')
    cards?.forEach(card => {
      card.addEventListener('click', handleCardClick)
    })

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const workSection = workSectionRef.current
    const textContainer = textContainerRef.current
    const gridCanvas = gridCanvasRef.current
    // Calcular distancia de movimiento basada en el tamaño de pantalla
    const isMobile = window.innerWidth <= 768
    const moveDistanceRef = { current: isMobile ? window.innerWidth * 4.2 : window.innerWidth * 6.5 }
    let currentXPosition = 0

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    // Setup grid canvas
    const gridCtx = gridCanvas.getContext("2d")!

    const resizeGridCanvas = () => {
      const dpr = window.devicePixelRatio || 1
      gridCanvas.width = window.innerWidth * dpr
      gridCanvas.height = window.innerHeight * dpr
      gridCanvas.style.width = `${window.innerWidth}px`
      gridCanvas.style.height = `${window.innerHeight}px`
      gridCtx.scale(dpr, dpr)
    }
    resizeGridCanvas()

    const drawGrid = (scrollProgress = 0) => {
      gridCtx.fillStyle = "black"
      gridCtx.fillRect(0, 0, gridCanvas.width, gridCanvas.height)
      gridCtx.fillStyle = "var(--orange)";
      const dotSize = 1
      const spacing = 30
      const rows = Math.ceil(gridCanvas.height / spacing)
      const cols = Math.ceil(gridCanvas.width / spacing) + 15
      const offset = (scrollProgress * spacing * 10) % spacing

      for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
          gridCtx.beginPath()
          gridCtx.arc(x * spacing - offset, y * spacing, dotSize, 0, Math.PI * 2)
          gridCtx.fill()
        }
      }
    }

    // Three.js setup for letters
    const lettersScene = new THREE.Scene()
    const lettersCamera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000)
    lettersCamera.position.z = 20

    const lettersRenderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    })
    lettersRenderer.setSize(window.innerWidth, window.innerHeight)
    lettersRenderer.setClearColor(0x000000, 0)
    lettersRenderer.setPixelRatio(window.devicePixelRatio)
    lettersRenderer.domElement.id = "letters-canvas"
    lettersRenderer.domElement.style.position = "absolute"
    lettersRenderer.domElement.style.top = "0"
    lettersRenderer.domElement.style.left = "0"
    lettersRenderer.domElement.style.pointerEvents = "none"
    workSection.appendChild(lettersRenderer.domElement)

    const createTextAnimationPath = (yPos: number, amplitude: number): ExtendedLine => {
      const points = []
      for (let i = 0; i <= 20; i++) {
        const t = i / 20
        points.push(
          new THREE.Vector3(
            -25 + 50 * t,
            yPos + Math.sin(t * Math.PI) * -amplitude,
            (1 - Math.pow(Math.abs(t - 0.5) * 2, 2)) * -5,
          ),
        )
      }
      const curve = new THREE.CatmullRomCurve3(points)
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(100)),
        new THREE.LineBasicMaterial({ color: 0x000, linewidth: 1 }),
      )
      
      // Cast to unknown first, then to ExtendedLine
      const extendedLine = line as unknown as ExtendedLine
      extendedLine.curve = curve
      extendedLine.letterElements = []
      return extendedLine
    }

    const path = [
      createTextAnimationPath(10, 2),
      createTextAnimationPath(3.5, 1),
      createTextAnimationPath(-3.5, -1),
      createTextAnimationPath(-10, -2),
    ]
    path.forEach((line) => lettersScene.add(line))

    const letterPositions = new Map()
    path.forEach((line, i) => {
      ;(line as ExtendedLine).letterElements = Array.from({ length: 15 }, () => {
        const el = document.createElement("div")
        el.className = "letter"
        el.textContent = ["W", "O", "R", "K"][i]
        el.style.position = "absolute"
        el.style.fontSize = "clamp(6rem, 12vw, 25rem)" // Tamaño inicial más equilibrado
        el.style.fontWeight = "bold"
        el.style.color = "var(--orange)";
        el.style.pointerEvents = "none"
        el.style.zIndex = "10"
        textContainer.appendChild(el)
        letterPositions.set(el, {
          current: { x: 0, y: 0 },
          target: { x: 0, y: 0 },
        })
        return el
      })
    })

    const lineSpeedMultipliers = [0.8, 1, 0.7, 0.9]
    const updateTargetPositions = (scrollProgress = 0) => {
      path.forEach((line, lineIndex) => {
        ;(line as ExtendedLine).letterElements.forEach((element: HTMLElement, i: number) => {
          const point = (line as ExtendedLine).curve.getPoint((i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1)
          const vector = point.clone().project(lettersCamera)
          const positions = letterPositions.get(element)
          positions.target = {
            x: (-vector.x * 0.5 + 0.5) * window.innerWidth,
            y: (-vector.y * 0.5 + 0.5) * window.innerHeight,
          }
        })
      })
    }

    const updateLetterPositions = () => {
      letterPositions.forEach((positions, element) => {
        const distX = positions.target.x - positions.current.x
        if (Math.abs(distX) > window.innerWidth * 0.7) {
          positions.current.x = positions.target.x
          positions.current.y = positions.target.y
        } else {
          positions.current.x = lerp(positions.current.x, positions.target.x, 0.07)
          positions.current.y = lerp(positions.current.y, positions.target.y, 0.07)
        }
        element.style.transform = `translate(-50%, -50%) translate3d(${positions.current.x}px, ${positions.current.y}px, 0px)`
      })
    }

    const updateCardsPosition = () => {
      const targetX = -moveDistanceRef.current * (ScrollTrigger.getAll()[0]?.progress || 0)
      currentXPosition = lerp(currentXPosition, targetX, 0.07)
      gsap.set(cardsContainer, {
        x: currentXPosition,
      })
    }

    const animate = () => {
      updateLetterPositions()
      updateCardsPosition()
      lettersRenderer.render(lettersScene, lettersCamera)
      animationFrameRef.current = requestAnimationFrame(animate)
    }

    // ScrollTrigger setup
    ScrollTrigger.create({
      trigger: workSection,
      start: "top top",
      end: isMobile ? "+=500%" : "+=850%",
      pin: true,
      pinSpacing: true,
      scrub: 1,
      onUpdate: (self) => {
        updateTargetPositions(self.progress)
        drawGrid(self.progress)
        setIsWorkSectionActive(self.progress > 0)
      },
    })

    const updateLetterSizes = () => {
      // Usar el mismo tamaño grande para todas las pantallas
      const fontSize = `clamp(8rem, 12vw, 25rem)`;
      
      // Update all existing letters
      letterPositions.forEach((_, element) => {
        element.style.fontSize = fontSize;
      });
    }

    const handleResize = () => {
      resizeGridCanvas()
      drawGrid(ScrollTrigger.getAll()[0]?.progress || 0)
      lettersCamera.aspect = window.innerWidth / window.innerHeight
      lettersCamera.updateProjectionMatrix()
      lettersRenderer.setSize(window.innerWidth, window.innerHeight)
      updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0)
      updateLetterSizes()
      
      // Recalcular distancia de movimiento para el nuevo tamaño de pantalla
      const newIsMobile = window.innerWidth <= 768
      moveDistanceRef.current = newIsMobile ? window.innerWidth * 4.2 : window.innerWidth * 6.5
    }

    window.addEventListener("resize", handleResize)

    // Función para inicializar posiciones correctas de las letras
    const initializeLetterPositions = () => {
      path.forEach((line, lineIndex) => {
        ;(line as ExtendedLine).letterElements.forEach((element: HTMLElement, i: number) => {
          const initialCurvePosition = i / 14
          const initialPoint = (line as ExtendedLine).curve.getPoint(initialCurvePosition)
          const initialVector = initialPoint.clone().project(lettersCamera)
          const initialX = (-initialVector.x * 0.5 + 0.5) * window.innerWidth
          const initialY = (-initialVector.y * 0.5 + 0.5) * window.innerHeight
          
          const positions = letterPositions.get(element)
          positions.current = { x: initialX, y: initialY }
          positions.target = { x: initialX, y: initialY }
          
          // Establecer posición inicial inmediatamente en el DOM
          element.style.transform = `translate(-50%, -50%) translate3d(${initialX}px, ${initialY}px, 0px)`
        })
      })
    }

    // Initialize
    drawGrid(0)
    animate()
    updateTargetPositions(0)
    updateLetterSizes()
    // Inicializar posiciones después de que todo esté configurado
    initializeLetterPositions()

    // Cleanup function
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Clean up Lenis
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }

      // Clean up GSAP
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())

      // Clean up Three.js
      lettersRenderer.dispose()
      lettersScene.clear()

      // Clean up DOM elements
      if (lettersRenderer.domElement.parentNode) {
        lettersRenderer.domElement.parentNode.removeChild(lettersRenderer.domElement)
      }

      // Clean up letter elements
      letterPositions.forEach((_, element) => {
        if (element.parentNode) {
          element.parentNode.removeChild(element)
        }
      })

      // Clean up card event listeners
      const cardsToCleanup = cardsContainer?.querySelectorAll('.card')
      cardsToCleanup?.forEach(card => {
        card.removeEventListener('click', handleCardClick)
      })

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="app">
      <section className="min-h-screen flex justify-center items-center">
        <h1 className="text-5xl font-bold uppercase">See My Work</h1>
      </section>

      <section className="work" ref={workSectionRef}>
        <canvas
          id="grid-canvas"
          ref={gridCanvasRef}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            zIndex: 0,
            pointerEvents: "none",
            opacity: isWorkSectionActive ? 1 : 0,
            transition: "opacity 0.3s ease",
          }}
        />
        <div className="text-container" ref={textContainerRef}></div>
        <div className="cards" ref={cardsContainerRef}>
          {projects.map((project, index) => (
            <div key={index} className="card" data-project-link={project.projectLink}>
              <div className="card-img">
                <Image 
                  src={project.image} 
                  alt={`${project.title} project`} 
                  fill
                  style={{ 
                    objectFit: 'cover',
                    objectPosition: 'center'
                  }}
                  sizes="(max-width: 480px) 60vw, (max-width: 768px) 45vw, (max-width: 1200px) 35vw, 30vw"
                  quality={100}
                  priority={false}
                  unoptimized={true}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
