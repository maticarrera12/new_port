"use client";
import "./styles.css";
import { useEffect } from "react";

const Page = () => {
  useEffect(() => {
    // Esperar a que el DOM esté listo y luego ejecutar el JavaScript
    const timer = setTimeout(() => {
      import("./work.js");
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);

    return (
    <>
      <section className="intro">
        <h1>Projects</h1>
      </section>
      <section className="work">
        <div className="text-container"></div>
        <div className="cards">
          <div className="card"><div className="card-img"><img src="/work/assets/img1.jpg" alt="" /></div><div className="card-copy"><p>Eclipse Horizon</p><p>739284</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img2.jpg" alt="" /></div><div className="card-copy"><p>Vision Link</p><p>385912</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img3.jpg" alt="" /></div><div className="card-copy"><p>Iron Bond</p><p>621478</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img4.jpg" alt="" /></div><div className="card-copy"><p>Golden Case</p><p>839251</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img5.jpg" alt="" /></div><div className="card-copy"><p>Virtual Space</p><p>456732</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img6.jpg" alt="" /></div><div className="card-copy"><p>Smart Vision</p><p>974315</p></div></div>
          <div className="card"><div className="card-img"><img src="/work/assets/img7.jpg" alt="" /></div><div className="card-copy"><p>Desert Tunnel</p><p>682943</p></div></div>
        </div>
      </section>
      <section className="outro">
        <h1>Projects</h1>
      </section>
    </>
  );
};

export default Page;
