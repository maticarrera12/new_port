"use client"

import React, { useEffect, useRef } from 'react'
import "./styles.css"
import { gsap } from "gsap"
import Lenis from "@studio-freight/lenis"

const Projects = () => {
  const lenisRef = useRef<Lenis | null>(null)
  const awardsListContainerRef = useRef<HTMLDivElement>(null)
  const awardPreviewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisRef.current = lenis

    const awardsListContainer = awardsListContainerRef.current
    const awardPreview = awardPreviewRef.current
    const awardsList = awardsListContainerRef.current

    if (!awardsListContainer || !awardPreview || !awardsList) return

    const POSITIONS = {
      BOTTOM: 0,
      MIDDLE: -80,
      TOP: -160,
    }

    let lastMousePosition = { x: 0, y: 0 }
    let activeAward: HTMLElement | null = null
    let ticking = false
    let mouseTimeout: NodeJS.Timeout | null = null
    let isMouseMoving = false

    // Awards data - you can move this to a separate file if needed
    const awards = [
      { name: "Best Design", type: "2025", project: "Project Alpha", label: "See Website" },
      { name: "Innovation", type: "2025", project: "Project Beta", label: "See Website" },
      { name: "Excellence", type: "2025", project: "Project Gamma", label: "See Website" },
      { name: "Creativity", type: "2025", project: "Project Delta", label: "See Website" },
      { name: "Quality", type: "2025", project: "Project Epsilon", label: "See Website" },
      { name: "Best Design", type: "2025", project: "Project Alpha", label: "See Website" },
      { name: "Innovation", type: "2025", project: "Project Beta", label: "See Website" },
      { name: "Excellence", type: "2025", project: "Project Gamma", label: "See Website" },
      { name: "Creativity", type: "2025", project: "Project Delta", label: "See Website" }
    ]

    awards.forEach((award) => {
      const awardElement = document.createElement("div")
      awardElement.className = "award"

      awardElement.innerHTML = `
        <div class="award-wrapper">
          <div class="award-name">
            <h1>${award.name}</h1>
            <h1>${award.type}</h1>
          </div>
          <div class="award-project">
            <h1>${award.project}</h1>
            <h1>${award.label}</h1>
          </div>
          <div class="award-name">
            <h1>${award.name}</h1>
            <h1>${award.type}</h1>
          </div>
        </div>
      `

      awardsListContainer.appendChild(awardElement)
    })

    const awardsElements = document.querySelectorAll(".award")

    const animatePreview = () => {
      const awardsListRect = awardsList.getBoundingClientRect()
      if (
        lastMousePosition.x < awardsListRect.left ||
        lastMousePosition.x > awardsListRect.right ||
        lastMousePosition.y < awardsListRect.top ||
        lastMousePosition.y > awardsListRect.bottom
      ) {
        const previewImages = awardPreview.querySelectorAll("img")
        previewImages.forEach((img) => {
          gsap.to(img, {
            scale: 0,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => img.remove(),
          })
        })
      }
    }

    const updateAwards = () => {
      animatePreview()

      if (activeAward) {
        const rect = activeAward.getBoundingClientRect()
        const isStillOver =
          lastMousePosition.x >= rect.left &&
          lastMousePosition.x <= rect.right &&
          lastMousePosition.y >= rect.top &&
          lastMousePosition.y <= rect.bottom

        if (!isStillOver) {
          const wrapper = activeAward.querySelector(".award-wrapper") as HTMLElement
          const leavingFromTop = lastMousePosition.y < rect.top + rect.height / 2

          gsap.to(wrapper, {
            y: leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM,
            duration: 0.4,
            ease: "power2.out",
          })
          activeAward = null
        }
      }

      awardsElements.forEach((award) => {
        if (award === activeAward) return

        const rect = award.getBoundingClientRect()
        const isMouseOver =
          lastMousePosition.x >= rect.left &&
          lastMousePosition.x <= rect.right &&
          lastMousePosition.y >= rect.top &&
          lastMousePosition.y <= rect.bottom

        if (isMouseOver) {
          const wrapper = award.querySelector(".award-wrapper") as HTMLElement
          const enterFromTop = lastMousePosition.y < rect.top + rect.height / 2

          gsap.to(wrapper, {
            y: POSITIONS.MIDDLE,
            duration: 0.4,
            ease: "power2.out",
          })
          activeAward = award as HTMLElement
        }
      })

      ticking = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      lastMousePosition.x = e.clientX
      lastMousePosition.y = e.clientY

      isMouseMoving = true
      if (mouseTimeout) {
        clearTimeout(mouseTimeout)
      }

      const awardsListRect = awardsList.getBoundingClientRect()
      const isInsideAwardsList =
        lastMousePosition.x >= awardsListRect.left &&
        lastMousePosition.x <= awardsListRect.right &&
        lastMousePosition.y >= awardsListRect.top &&
        lastMousePosition.y <= awardsListRect.bottom

      if (isInsideAwardsList) {
        mouseTimeout = setTimeout(() => {
          isMouseMoving = false
          const images = awardPreview.querySelectorAll("img")
          if (images.length > 1) {
            const lastImage = images[images.length - 1]
            images.forEach((img) => {
              if (img !== lastImage) {
                gsap.to(img, {
                  scale: 0,
                  duration: 0.4,
                  ease: "power2.out",
                  onComplete: () => img.remove(),
                })
              }
            })
          }
        }, 2000)
      }

      animatePreview()
    }

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          updateAwards()
        })
        ticking = true
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("scroll", handleScroll, { passive: true })

    awardsElements.forEach((award, index) => {
      const wrapper = award.querySelector(".award-wrapper") as HTMLElement
      let currentPosition = POSITIONS.TOP
      let currentImage: HTMLImageElement | null = null

      const handleMouseEnter = (e: Event) => {
        const mouseEvent = e as MouseEvent
        activeAward = award as HTMLElement
        const rect = award.getBoundingClientRect()
        const enterFromTop = mouseEvent.clientY < rect.top + rect.height / 2

        if (enterFromTop || currentPosition === POSITIONS.BOTTOM) {
          currentPosition = POSITIONS.MIDDLE
          gsap.to(wrapper, {
            y: POSITIONS.MIDDLE,
            duration: 0.4,
            ease: "power2.out",
          })
        }

        // Remover imagen anterior si existe
        const existingImages = awardPreview.querySelectorAll("img")
        existingImages.forEach((existingImg) => {
          gsap.to(existingImg, {
            scale: 0,
            duration: 0.2,
            ease: "power2.out",
            onComplete: () => {
              if (existingImg.parentNode) {
                existingImg.parentNode.removeChild(existingImg)
              }
            }
          })
        })

        // Crear imagen en la posición del cursor
        const img = document.createElement("img")
        img.src = `/projects/img${index + 1}.jpg`
        img.style.position = "fixed"
        img.style.top = `${mouseEvent.clientY - 100}px`
        img.style.left = `${mouseEvent.clientX - 100}px`
        img.style.width = "200px"
        img.style.height = "200px"
        img.style.objectFit = "cover"
        img.style.borderRadius = "8px"
        img.style.scale = "0"
        img.style.zIndex = "1000"
        img.style.pointerEvents = "none"
        img.style.boxShadow = "0 10px 30px rgba(0,0,0,0.3)"
        img.style.transition = "all 0.1s ease"

        awardPreview.appendChild(img)
        currentImage = img

        gsap.to(img, {
          scale: 1,
          duration: 0.4,
          ease: "power2.out",
        })
      }

      const handleMouseLeave = (e: Event) => {
        const mouseEvent = e as MouseEvent
        activeAward = null
        const rect = award.getBoundingClientRect()
        const leavingFromTop = mouseEvent.clientY < rect.top + rect.height / 2

        currentPosition = leavingFromTop ? POSITIONS.TOP : POSITIONS.BOTTOM
        gsap.to(wrapper, {
          y: currentPosition,
          duration: 0.4,
          ease: "power2.out",
        })

        // Remover imagen al salir del award
        if (currentImage) {
          gsap.to(currentImage, {
            scale: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => {
              if (currentImage && currentImage.parentNode) {
                currentImage.parentNode.removeChild(currentImage)
              }
              currentImage = null
            }
          })
        }
      }

      const handleAwardMouseMove = (e: Event) => {
        const mouseEvent = e as MouseEvent
        
        // Actualizar posición de la imagen para que siga el cursor
        if (currentImage) {
          currentImage.style.top = `${mouseEvent.clientY - 100}px`
          currentImage.style.left = `${mouseEvent.clientX - 100}px`
        }
      }

      award.addEventListener("mouseenter", handleMouseEnter)
      award.addEventListener("mouseleave", handleMouseLeave)
      award.addEventListener("mousemove", handleAwardMouseMove)
    })

    // Cleanup function
    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("scroll", handleScroll)
      
      if (lenisRef.current) {
        lenisRef.current.destroy()
      }

      // Clean up event listeners from awards
      awardsElements.forEach((award) => {
        award.removeEventListener("mouseenter", () => {})
        award.removeEventListener("mouseleave", () => {})
      })

      if (mouseTimeout) {
        clearTimeout(mouseTimeout)
      }
    }
  }, [])

  return (
    <>
      <section className="awards">
        <div className="awards-list" ref={awardsListContainerRef}></div>
        <div className="awards-preview" ref={awardPreviewRef}></div>
      </section>
    </>
  )
}

export default Projects