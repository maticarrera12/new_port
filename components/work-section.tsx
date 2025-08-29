"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Lenis from "@studio-freight/lenis"

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger)

export default function WorkSection() {
  const workSectionRef = useRef<HTMLDivElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)
  const textContainerRef = useRef<HTMLDivElement>(null)
  const lenisRef = useRef<Lenis | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    if (!workSectionRef.current || !cardsContainerRef.current || !textContainerRef.current) return

    // Initialize Lenis smooth scrolling
    const lenis = new Lenis()
    lenisRef.current = lenis

    lenis.on("scroll", ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    const workSection = workSectionRef.current
    const cardsContainer = cardsContainerRef.current
    const textContainer = textContainerRef.current
    const moveDistance = window.innerWidth * 5
    let currentXPosition = 0

    const lerp = (start: number, end: number, t: number) => start + (end - start) * t

    // Create grid canvas
    const gridCanvas = document.createElement("canvas")
    gridCanvas.id = "grid-canvas"
    gridCanvas.style.position = "absolute"
    gridCanvas.style.top = "0"
    gridCanvas.style.left = "0"
    gridCanvas.style.pointerEvents = "none"
    workSection.appendChild(gridCanvas)
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
      gridCtx.fillStyle = "#f40c3f"
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

    const createTextAnimationPath = (yPos: number, amplitude: number) => {
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
      ;(line as any).curve = curve
      return line as any
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
      ;(line as any).letterElements = Array.from({ length: 15 }, () => {
        const el = document.createElement("div")
        el.className = "letter"
        el.textContent = ["W", "O", "R", "K"][i]
        el.style.position = "absolute"
        el.style.fontSize = "4rem"
        el.style.fontWeight = "bold"
        el.style.color = "#f40c3f"
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
        ;(line as any).letterElements.forEach((element: HTMLElement, i: number) => {
          const point = (line as any).curve.getPoint((i / 14 + scrollProgress * lineSpeedMultipliers[lineIndex]) % 1)
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
      },
    })

    const handleResize = () => {
      resizeGridCanvas()
      drawGrid(ScrollTrigger.getAll()[0]?.progress || 0)
      lettersCamera.aspect = window.innerWidth / window.innerHeight
      lettersCamera.updateProjectionMatrix()
      lettersRenderer.setSize(window.innerWidth, window.innerHeight)
      updateTargetPositions(ScrollTrigger.getAll()[0]?.progress || 0)
    }

    window.addEventListener("resize", handleResize)

    // Initialize
    drawGrid(0)
    animate()
    updateTargetPositions(0)

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
      if (gridCanvas.parentNode) {
        gridCanvas.parentNode.removeChild(gridCanvas)
      }
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
    <div ref={workSectionRef} className="work relative h-screen overflow-hidden bg-black">
      <div ref={textContainerRef} className="text-container absolute inset-0 z-10" />
      <div ref={cardsContainerRef} className="cards flex gap-8 p-8">
        {/* Add your card content here */}
        <div className="card min-w-[300px] h-[400px] bg-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Project 1</h3>
          <p className="text-gray-600">Your project description here...</p>
        </div>
        <div className="card min-w-[300px] h-[400px] bg-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Project 2</h3>
          <p className="text-gray-600">Your project description here...</p>
        </div>
        <div className="card min-w-[300px] h-[400px] bg-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Project 3</h3>
          <p className="text-gray-600">Your project description here...</p>
        </div>
        <div className="card min-w-[300px] h-[400px] bg-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Project 4</h3>
          <p className="text-gray-600">Your project description here...</p>
        </div>
        <div className="card min-w-[300px] h-[400px] bg-white rounded-lg p-6">
          <h3 className="text-2xl font-bold mb-4">Project 5</h3>
          <p className="text-gray-600">Your project description here...</p>
        </div>
      </div>
    </div>
  )
}
