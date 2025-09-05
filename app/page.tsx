"use client";
import { useRef, useState, useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import CustomEase from "gsap/CustomEase";
import { useLenis } from "lenis/react";
import Loader from "../components/Loader/Loader";
import AnimatedText from "../components/AnimatedText/AnimatedText";

gsap.registerPlugin(ScrollTrigger, CustomEase);
CustomEase.create("hop", "0.9, 0, 0.1, 1");
export default function Home() {
  const tagsRef = useRef(null);
  const [showPreloader, setShowPreloader] = useState(false);
  const [loaderAnimating, setLoaderAnimating] = useState(false);
  const lenis = useLenis();

  useEffect(() => {
    const hasShownLoader = sessionStorage.getItem("loaderShown");
    if (!hasShownLoader) {
      setShowPreloader(true);
      sessionStorage.setItem("loaderShown", "true");
    }
  }, []);

  useEffect(() => {
    if (lenis) {
      if (loaderAnimating) {
        lenis.stop();
      } else {
        lenis.start();
      }
    }
  }, [lenis, loaderAnimating]);

  const handleLoaderComplete = () => {
    setLoaderAnimating(false);
    setShowPreloader(false);
  };

  useEffect(() => {
    if (showPreloader) {
      setLoaderAnimating(true);
    }
  }, [showPreloader]);

  return (
    <div>
      <Loader show={showPreloader} onComplete={handleLoaderComplete} />
      <div className="min-h-dvh flex items-center justify-center">
          <h1>FULL STACK DEVELOPER</h1>
        </div>
      <AnimatedText />
    </div>
  );
}
