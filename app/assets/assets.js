// Las imágenes ahora se referencian desde public/work

export const technologies = [
  {
    name: "Next.js",
    image: "/work/next.png",
    category: "front-end",
  },
  {
    name: "ReactJS",
    image: "/work/react.png",
    category: "front-end",
  },
  {
    name: "JavaScript",
    image: "/work/js.png",
    category: "front-end",
  },
  {
    name: "GSAP",
    image: "/work/gsap.png",
    category: "front-end",
  },
  {
    name: "TypeScript",
    image: "/work/typescript.png",
    category: "front-end",
  },
  {
    name: "Node.js",
    image: "/work/node.png",
    category: "back-end",
  },
  {
    name: "SpringBoot",
    image: "/work/springboot.png",
    category: "back-end",
  },
  {
    name: "Java",
    image: "/work/java.png",
    category: "back-end",
  },
  {
    name: "Express.js",
    image: "/work/expressjs.png",
    category: "back-end",
  },
  {
    name: "TailwindCSS",
    image: "/work/tailwind.png",
    category: "front-end",
  },
  {
    name: "MYSQL",
    image: "/work/mysql.png",
    category: "back-end",
  },
  {
    name: "MongoDB",
    image: "/work/mongodb.png",
    category: "back-end",
  },
  {
    name: "Supabase",
    image: "/work/supabase.png",
    category: "back-end",
  },
  {
    name: "HTML",
    image: "/work/html.png",
    category: "front-end",
  },
  {
    name: "CSS",
    image: "/work/css.png",
    category: "front-end",
  },
];

export const projects = [
  {
    title: "InquirAI",
    image: "/work/ssinquirai.png",
    description:
      "InquirAi es una aplicación web que permite a los usuarios realizar preguntas y recibir respuestas generadas por inteligencia artificial. Utiliza la API de OpenAI para procesar las preguntas y generar respuestas. La aplicación cuenta con un diseño responsivo, una interfaz de usuario intuitiva y un sistema de autenticación para usuarios registrados. Los usuarios pueden hacer preguntas, ver respuestas anteriores y gestionar su perfil.",
    projectLink: "https://inquirai.vercel.app",
    codeLink: "https://github.com/maticarrera12/inquirai",
    technologies: [
      "Next.js",
      "TypeScript",
      "MongoDB",
      "TailwindCSS",
      "JavaScript",
    ],
    year: "2025",
  },
  {
    title: "Velyo",
    image: "/work/ssvelyo.png",
    description:
      "Velyo es una aplicación web de reservas de alojamientos desarrollada como proyecto fullstack. Permite a los usuarios explorar, buscar y reservar distintos tipos de alojamientos, como habitaciones y casas completas. La aplicación incluye funcionalidades como filtrado por características, carga de imágenes, gestión de reservas y panel de administración. El frontend está desarrollado con ReactJS, utilizando librerías como Ant Design, Formik y Yup para la construcción de formularios y validaciones. El backend está construido con Java Spring Boot, siguiendo una arquitectura basada en controladores, servicios y repositorios.La persistencia de datos se realiza mediante una base de datos MySQL.",
    codeLink: "https://github.com/maticarrera12/velyo-professional-developer",
    technologies: [
      "ReactJS",
      "SpringBoot",
      "MYSQL",
      "HTML",
      "CSS",
      "JavaScript",
      "Java",
    ],
    year: "2025",
  },
  {
    title: "MedReserva",
    image: "/work/ssmedreserva.png",
    description:
      "MedReserva es una aplicación web desarrollada con el stack MERN (MongoDB, Express.js, ReactJS y Node.js) para la gestión de turnos médicos. Permite a pacientes reservar turnos, a médicos administrar su disponibilidad y a administradores gestionar usuarios y especialidades. La app incluye autenticación por roles y está integrada con Mercado Pago para la gestión de pagos. El diseño está construido con TailwindCSS, y se utilizan librerías como React Router y Axios para la navegación y consumo de APIs.",
    projectLink: "https://med-reserva.vercel.app",
    codeLink: "https://github.com/maticarrera12/MedReserva",
    technologies: [
      "ReactJS",
      "Node.js",
      "Express.js",
      "MongoDB",
      "TailwindCSS",
      "HTML",
      "CSS",
      "JavaScript",
    ],
    year: "2025",
  },
  {
    title: "Converso",
    image: "/work/ssconverso.png",
    description:
      "Converso es una plataforma SaaS desarrollada con Next.js que permite generar clases interactivas por videollamada impulsadas por inteligencia artificial. Integra autenticación y gestión de billing con Clerk, base de datos y backend con Supabase, UI con ShadCN, y monitoreo de errores con Sentry. Ideal para explorar la combinación de IA y educación en tiempo real.",
    projectLink: "https://converso-web.vercel.app",
    codeLink: "https://github.com/maticarrera12/converso",
    technologies: [
      "Next.js",
      "Supabase",
      "TailwindCSS",
      "ReactJS",
      "JavaScript",
    ],
    year: "2025",
  },
  {
    title: "VelvetPour",
    image: "/work/ssvelvetpour.png",
    description:
      "Velvet Pour es una landing page diseñada para un bar, pensada para transmitir una experiencia visual envolvente y moderna. Este proyecto destaca por el uso intensivo de animaciones fluidas y creativas implementadas con GSAP (GreenSock Animation Platform), que aportan dinamismo e interacción a cada sección del sitio. Este proyecto fue una exploración en motion design web, centrada en microinteracciones, transiciones suaves y scroll animations usando GSAP.",
    projectLink: "https://velvetpour.vercel.app",
    codeLink: "https://github.com/maticarrera12/mojito-landing",
    technologies: ["GSAP", "ReactJS", "TailwindCSS", "JavaScript"],
    year: "2025",
  },
  {
    title: "GTAVI",
    image: "/work/ssgtavi.png",
    description:
      "Desarrollé la landing page inspirada en Grand Theft Auto VI como proyecto personal para explorar animaciones web avanzadas utilizando GSAP (GreenSock Animation Platform). La página cuenta con transiciones suaves, efectos de entrada y salida, scroll animations, efectos de máscara y secuencias sincronizadas que mejoran la experiencia visual. Implementé scroll-based animations, timeline control, interacciones dinámicas y una arquitectura responsive moderna con Tailwind CSS. Este proyecto me permitió reforzar mis habilidades en JavaScript, GSAP, UX/UI y animación web avanzada.",
    projectLink: "https://gta-vi-landing-eight.vercel.app",
    codeLink: "https://github.com/maticarrera12/gta_vi_landing",
    technologies: ["GSAP", "ReactJS", "TailwindCSS", "JavaScript"],
  },
  {
    title: "QueTeDebo?",
    image: "/work/quetedebo.png",
    description:
      "¿Saliste con amigos y uno terminó pagando todo? Con esta app no hace falta hacer cuentas raras ni pelearse con la calculadora. Cargás quién pagó qué y te dice al toque cuánto tiene que poner cada uno para que todos queden a mano. ¡Ideal para cenas, birras o viajes!",
    projectLink: "https://quetedebo.vercel.app",
    codeLink: "https://github.com/maticarrera12/quetedebo",
    technologies: ["ReactJS", "TypeScript", "TailwindCSS", "JavaScript"],
    year: "2025",
  },
  {
    title: "Awwward-winner",
    image: "/work/ssawwwardwinner.png",
    description: "Clon de una pagina awwward-winner.",
    projectLink: "https://awwwards-winner.vercel.app/",
    codeLink: "https://github.com/maticarrera12/awwwards-winner",
    technologies: ["ReactJS", "TailwindCSS", "JavaScript", "HTML", "CSS"],
    year: "2024",
  },
  {
    title: "FilmTrailers",
    image: "/work/ssfilmtrailers.png",
    description: "Clon de una plataforma de series y peliculas muy famosa.",
    projectLink: "https://film-trailers.vercel.app",
    codeLink: "https://github.com/maticarrera12/FilmTrailers",
    technologies: ["ReactJS", "TailwindCSS", "JavaScript", "HTML", "CSS"],
    year: "2024",
  },
];
