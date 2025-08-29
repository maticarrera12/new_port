"use client"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"
import "./styles.css"
import Image from "next/image"

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
  const animationFrameRef = useRef<number>()
  const [isWorkSectionActive, setIsWorkSectionActive] = useState(false)

  useEffect(() => {
    if (!workSectionRef.current || !cardsContainerRef.current || !textContainerRef.current || !gridCanvasRef.current)
      return

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
    const cardsContainer = cardsContainerRef.current
    const textContainer = textContainerRef.current
    const gridCanvas = gridCanvasRef.current
    const moveDistance = window.innerWidth * 5
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
      gridCtx.fillStyle = "#ff3500"
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
        el.style.fontSize = "clamp(8rem, 15vw, 30rem)"
        el.style.fontWeight = "bold"
        el.style.color = "#ff3500"
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
      const targetX = -moveDistance * (ScrollTrigger.getAll()[0]?.progress || 0)
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
      end: "+=700%",
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
      const width = window.innerWidth;
      let fontSize;
      
      if (width <= 480) {
        fontSize = `clamp(3rem, 8vw, 15rem)`;
      } else if (width <= 768) {
        fontSize = `clamp(4rem, 10vw, 20rem)`;
      } else if (width <= 1200) {
        fontSize = `clamp(6rem, 12vw, 25rem)`;
      } else {
        fontSize = `clamp(8rem, 15vw, 30rem)`;
      }
      
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
    }

    window.addEventListener("resize", handleResize)

    // Initialize
    drawGrid(0)
    animate()
    updateTargetPositions(0)
    updateLetterSizes()

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

      window.removeEventListener("resize", handleResize)
    }
  }, [])

  return (
    <div className="app">
      <section className="intro">
        <h1>Projects</h1>
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
                      <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img1.jpg" 
                alt="Eclipse Horizon project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Eclipse Horizon</p>
              <p>739284</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img2.jpg" 
                alt="Vision Link project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Vision Link</p>
              <p>385912</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img3.jpg" 
                alt="Iron Bond project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Iron Bond</p>
              <p>621478</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img4.jpg" 
                alt="Golden Case project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Golden Case</p>
              <p>839251</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img5.jpg" 
                alt="Virtual Space project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Virtual Space</p>
              <p>456732</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img6.jpg" 
                alt="Smart Vision project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Smart Vision</p>
              <p>974315</p>
            </div>
          </div>
          <div className="card">
            <div className="card-img">
              <Image 
                src="/work/img7.jpg" 
                alt="Desert Tunnel project" 
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 480px) 20vw, (max-width: 768px) 15vw, (max-width: 1200px) 12vw, 10vw"
              />
            </div>
            <div className="card-copy">
              <p>Desert Tunnel</p>
              <p>621943</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
