"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "es";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.projects": "Projects",
    "nav.about": "About",
    "nav.contact": "Contact",
    
    // Hero
    "hero.name": "Christian Zavala",
    "hero.title": "IT Professional",
    "hero.bio": "IT Professional with a focus on innovative solutions and process optimization. I pride myself on an analytical and collaborative approach, always ensuring that each project is clear, efficient, and adaptable.",


    "hero.viewProjects": "View Projects",
    "hero.contactMe": "Contact Me",
    "hero.featuredProjects": "Featured Projects",
    "hero.viewProject": "View Project",
    "hero.viewRepo": "View Repository",
    "hero.fetchError": "Failed to load projects",
    "hero.readMore": "Read more...",
    "hero.readLess": "Read less",
    "hero.underConstruction": "Under Construction",
    "hero.underConstructionDescription": "Some features may still be in progress. Thanks for your patience!",
    
    // About
    "about.title": "About Me",
    "about.frontend": "Frontend",
    "about.backend": "Backend",
    "about.tools": "Tools",
    
    // Projects
    "projects.title": "Projects",
    "projects.subtitle": "Some of my recent work",
    "projects.viewLive": "View Live",
    "projects.viewCode": "View Code",
    
    // Contact
    "contact.title": "Get In Touch",
    "contact.subtitle": "Have a project in mind? Let's talk!",
    "contact.send": "Send Message",
    "contact.name": "Name",
    "contact.email": "Email",
    "contact.message": "Message",
    
    // Footer
    "footer.rights": "All rights reserved",
  },
  es: {
    // Navigation
    "nav.projects": "Proyectos",
    "nav.about": "Sobre Mí",
    "nav.contact": "Contacto",
    
    // Hero

    "hero.name": "Christian Zavala",  // nombre propio, igual
    "hero.title": "Profesional en TI",
    "hero.bio": "Profesional en Tecnologías de la Información con interés en el desarrollo de soluciones innovadoras y en la optimización de procesos. Me caracterizo por un enfoque analítico y colaborativo, buscando siempre que cada proyecto sea claro, eficiente y adaptable.",


    "hero.viewProjects": "Ver Proyectos",
    "hero.contactMe": "Contáctame",
    "hero.featuredProjects": "Proyectos Destacados",
    "hero.viewProject": "Ver Proyecto",
    "hero.viewRepo": "Ver Repositorio",
    "hero.fetchError": "Error al cargar proyectos",
    "hero.readMore": "Leer más...",
    "hero.readLess": "Leer menos",
    "hero.underConstruction": "Sitio En Construcción",
    "hero.underConstructionDescription": "Algunas funcionalidades aún están en desarrollo. ¡Gracias por tu paciencia!",
    
    // About
    "about.title": "Sobre Mí",
    "about.frontend": "Frontend",
    "about.backend": "Backend",
    "about.tools": "Herramientas",
    
    // Projects
    "projects.title": "Proyectos",
    "projects.subtitle": "Algunos de mis trabajos recientes",
    "projects.viewLive": "Ver En Vivo",
    "projects.viewCode": "Ver Código",
    
    // Contact
    "contact.title": "Contáctame",
    "contact.subtitle": "¿Tienes un proyecto en mente? ¡Hablamos!",
    "contact.send": "Enviar Mensaje",
    "contact.name": "Nombre",
    "contact.email": "Correo",
    "contact.message": "Mensaje",
    
    // Footer
    "footer.rights": "Todos los derechos reservados",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && (saved === "en" || saved === "es")) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
