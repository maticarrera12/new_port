"use client";
import Menu from "../components/Menu/Menu.jsx";
import { useRef } from "react";


export default function ClientLayout({ children }) {
  const containerRef = useRef(null);

  return (
    <>
      <Menu containerRef={containerRef} />
      <div className="container" ref={containerRef}>
        {children}
      </div>
    </>
  );
}
