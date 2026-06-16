"use client";

import { useEffect, useState, useRef } from "react";
import { portfolioData } from "@/data/portfolio";
import { Github, Linkedin, Mail, ChevronLeft, ChevronRight } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { Project } from "@/types";

import Image from "next/image";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Hero() {

  const { t } = useLanguage();

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  const [activeProjectIndex, setActiveProjectIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isContentVisible, setIsContentVisible] = useState(true);
  const descriptionRef = useRef<HTMLDivElement>(null);

  {/* Funcion colapsar o expandir*/ }
  const [isLeftOpen, setIsLeftOpen] = useState(true); // Valor por defecto

  useEffect(() => {
    // Solo ejecutar en cliente
    const saved = localStorage.getItem("sidebarOpen");
    if (saved !== null) {
      setIsLeftOpen(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("sidebarOpen", JSON.stringify(isLeftOpen));
    if (isLeftOpen) {
      const timer = setTimeout(() => setIsContentVisible(true), 200);
      return () => clearTimeout(timer);
    } else {
      setIsContentVisible(false);
    }
  }, [isLeftOpen]);


  useEffect(() => {
    const fetchProjects = async () => {

      try {
        setLoading(true);
        setError(null);

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/projects`);

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.statusText}`);
        }

        const data = await res.json();
        const normalizedData = data.map((project: Project) => ({
          ...project,
          tags: typeof project.tags === 'string'
            ? (project.tags as string).split(',').map((t: string) => t.trim()).filter(Boolean)
            : project.tags || []
        }));
        setProjects(normalizedData);

      } catch (err) {
        console.error("Error fetching projects:", err);
        setError(t("hero.fetchError"));
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [t]);

  const displayProjects = projects.slice(0, 4);
  const showNoProjectsMessage = displayProjects.length === 0;

  const project = displayProjects[activeProjectIndex];

  const imageUrls = project
    ? Array.isArray(project['images'])
      ? project['images']
      : project['images']
        ? [project['images']]
        : []
    : [];

  useEffect(() => {
    if (imageUrls.length > 1) {
      const interval = setInterval(() => {
        setActiveImageIndex(prev => (prev + 1) % imageUrls.length);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [activeProjectIndex, imageUrls.length]);

  useEffect(() => {
    setActiveImageIndex(0);
    setIsDescriptionExpanded(false);
  }, [activeProjectIndex]);

  const handleDescriptionToggle = (expand: boolean) => {
    if (!expand && descriptionRef.current) {
      descriptionRef.current.scrollTop = 0;
    }
    setIsDescriptionExpanded(expand);
  };

  if (loading) {
    return (
      <section id="hero" className="flex items-start pt-24 pb-16">
        <div className="w-full px-4 md:px-16 lg:px-24">
          <p className="text-center py-8">Loading projects...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="hero" className="flex items-start pt-24 pb-16">
        <div className="w-full px-4 md:px-16 lg:px-24">
          <p className="text-center text-red-500 py-8">
            Error loading projects: {error}
          </p>
        </div>
      </section>
    );
  }

  const underConstructionBanner = (
    <div className="mb-4 flex items-center justify-center gap-2 bg-white text-black text-xs sm:text-sm px-4 py-2 rounded-full border border-gray-300">
      <span className="font-medium">{t("hero.underConstruction")}</span>
      <span className="hidden sm:inline">—</span>
      <span className="hidden sm:inline text-gray-600">{t("hero.underConstructionDescription")}</span>
    </div>
  );


 return (
    <section id="hero" className="flex pt-24 pb-16 min-h-[calc(100vh-4rem-3rem)]">
      <div className="w-full px-4 md:px-8 h-full">
        {underConstructionBanner}
        <div
          className="w-full grid gap-4 md:gap-8 h-full items-start"
          style={{
            gridTemplateColumns: isLeftOpen
              ? 'minmax(256px, 25%) 1fr'
              : '64px 1fr',
            transition: 'grid-template-columns 500ms ease-in-out'
          }}
        >


          {/* Left side - Sidebar with profile info and contact */}
          <div className={`transition-all duration-300 ease-in-out flex-shrink-0 ${isLeftOpen
              ? "hidden md:block w-full"
              : "w-16 md:w-20"
            }`}>
            {isLeftOpen ? (
              <div className="bg-card border border-border rounded-2xl p-2 sm:p-3 md:p-4 lg:p-5 xl:p-6 shadow-sm w-full flex flex-col h-screen sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-160px)] xl:h-[calc(100vh-200px)] items-center gap-1 sm:gap-2 md:gap-3 lg:gap-4 overflow-y-auto">
                {/* Boton para expandir o colapsar en la card */}
                <button
                  onClick={() => setIsLeftOpen(!isLeftOpen)}
                  className="self-end p-1 rounded-md text-accent hover:bg-accent/10 transition"
                  aria-label="Ocultar perfil"
                >
                  <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                {/* Contenido con fade-in */}
                <div style={{
                  opacity: isContentVisible ? 1 : 0,
                  transition: 'opacity 100ms ease-in 200ms'
                }}>
                  {/* Name */}
                  <h1 className="text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-3xl font-bold mb-1 sm:mb-2 lg:mb-3 text-center">
                    {t("hero.name")}
                  </h1>

                  {/* Title */}
                  <p className="text-xs sm:text-sm md:text-sm lg:text-base text-muted mb-1 sm:mb-2 lg:mb-3 text-center">{t("hero.title")}</p>

                  {/* Bio */}
                  <p className="text-xs sm:text-xs md:text-sm lg:text-sm text-muted mb-2 sm:mb-3 lg:mb-4 text-center leading-relaxed">
                    {t("hero.bio")}
                  </p>

                  {/* Contact Links */}
                  <div className="w-full px-1 sm:px-2">
                    <h3 className="text-xs sm:text-xs md:text-sm lg:text-sm font-medium mb-1 sm:mb-2 lg:mb-3 text-center">{t("hero.contactMe")}</h3>
                    <div className="flex flex-wrap gap-1 justify-center">
                      {portfolioData.socials.map((social) => {
                        const Icon = iconMap[social.icon];
                        if (!Icon) return null;

                        return (
                          <a
                            key={social.name}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-full border border-border hover:bg-accent/10 hover:border-accent transition-colors text-xs"
                          >
                            <Icon className="w-3 h-3" />
                            <span>{social.name}</span>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Estado colapsado - solo iconos */
              <div className="bg-card border border-border rounded-2xl p-2 shadow-sm w-full flex flex-col items-center gap-3 sm:gap-4 min-h-[calc(100vh-160px)] sm:min-h-[calc(100vh-200px)] md:min-h-[calc(100vh-240px)] lg:min-h-[calc(100vh-260px)] xl:min-h-[calc(100vh-280px)]">
                {/* Boton para expandir en la card colapsada */}
                <button
                  onClick={() => setIsLeftOpen(!isLeftOpen)}
                  className="p-1 rounded-md text-accent hover:bg-accent/10 transition"
                  aria-label="Mostrar perfil"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                <h3 className="text-[0.6rem] sm:text-[0.7rem] font-medium text-center text-muted">
                  {t("hero.contactMe")}
                </h3>
                <div className="flex flex-col gap-2 w-full items-center mt-auto">
                  {portfolioData.socials.map((social) => {
                    const Icon = iconMap[social.icon];
                    if (!Icon) return null;

                    return (
                      <a
                        key={social.name}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-border hover:bg-accent/10 hover:border-accent transition-colors"
                        title={social.name}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Projects with vertical tabs */}
          <div className="flex-1 flex flex-col min-w-0">
            <div className="flex gap-0 bg-card border border-border rounded-xl overflow-hidden h-screen sm:h-[calc(100vh-2rem)] md:h-[calc(100vh-4rem)] lg:h-[calc(100vh-160px)] xl:h-[calc(100vh-200px)]">


              {/* Project content */}
              <div className="p-3 sm:p-4 md:p-6 flex flex-col overflow-y-auto">
                {showNoProjectsMessage ? (
                  <p className="text-center">No projects available</p>
                ) : (
                  <>
                    {/* Project info header */}
                    <h3 className="font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl mb-2 sm:mb-3 hover:text-accent transition-colors">
                      <a
                        href={displayProjects[activeProjectIndex].live}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {displayProjects[activeProjectIndex].title}
                      </a>
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 sm:gap-2 mb-3 sm:mb-4">
                      {displayProjects[activeProjectIndex].tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="text-[0.75rem] sm:text-xs px-2 py-0.5 sm:px-3 sm:py-1.5 bg-accent/10 text-accent rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Content area - description + image */}
                    <div className="flex-1 flex flex-col">

                      {/* Description with toggle */}
                      <div className="relative">
                        <div
                          ref={descriptionRef}
                          className={`transition-all duration-300 mb-2 ${isDescriptionExpanded ? 'max-h-20 sm:max-h-24 overflow-y-auto pr-2' : ''}`}
                        >
                          <p
                            className={`text-muted leading-relaxed text-xs sm:text-sm md:text-base ${isDescriptionExpanded ? '' : 'line-clamp-2'}`}
                          >
                            {displayProjects[activeProjectIndex].description}
                          </p>
                        </div>
                        {displayProjects[activeProjectIndex].description &&
                          displayProjects[activeProjectIndex].description.length > 100 && (
                            <button
                              onClick={() => handleDescriptionToggle(!isDescriptionExpanded)}
                              className="text-accent text-xs sm:text-sm font-medium hover:underline"
                            >
                              {isDescriptionExpanded ? t("hero.readLess") : t("hero.readMore")}
                            </button>
                          )}
                      </div>

                      {/* Image as clickable link */}
                      {imageUrls.length > 0 && (
                        <a
                          href={displayProjects[activeProjectIndex].live}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-3 sm:mt-4 rounded-xl overflow-hidden group border border-border/60 shadow-sm hover:shadow-md transition-all duration-300 block w-full"
                        >
                          <div className="relative w-full h-[180px] sm:h-[260px] md:h-[400px] lg:h-[500px] animate-fade-in">
                            <Image
                              key={activeImageIndex}
                              src={`${process.env.NEXT_PUBLIC_IMAGE_URL}${imageUrls[activeImageIndex]}`}
                              alt={`${project.title} screenshot ${activeImageIndex + 1}`}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                              priority
                              unoptimized
                            />
                            {/* Carousel indicators */}
                            {imageUrls.length > 1 && (
                              <div className="absolute bottom-3 right-3 flex gap-1.5 bg-black/40 backdrop-blur-sm rounded-full px-2.5 py-1.5 z-10">
                                {imageUrls.map((_, idx) => (
                                  <button
                                    key={idx}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setActiveProjectIndex(activeProjectIndex);
                                      setActiveImageIndex(idx);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-200 ${idx === activeImageIndex
                                      ? 'w-6 bg-accent'
                                      : 'w-2 bg-white/60 hover:bg-white/90'
                                      }`}
                                    aria-label={`Go to image ${idx + 1}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </a>
                      )}
                    </div>


                    {/* View Project - footer at bottom */}
                    <div className="flex items-center gap-3 text-accent font-medium text-xs sm:text-sm md:text-base mt-auto pt-3 border-t border-border bg-card flex-wrap">
                      {displayProjects[activeProjectIndex].live_url && (
                        <a
                          href={displayProjects[activeProjectIndex].live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                        >
                          <span>{t("hero.viewProject")}</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      )}
                      {displayProjects[activeProjectIndex].repo_url && (
                        <a
                          href={displayProjects[activeProjectIndex].repo_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 hover:underline"
                        >
                          <span>{t("hero.viewRepo")}</span>
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                          </svg>
                        </a>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Vertical tabs - right side */}
              {!showNoProjectsMessage && (
                <div className="w-128 border-l border-border flex flex-col">
                  {displayProjects.map((project, index) => (
                    <button
                      key={`tab-${project.id || index}`}
                      onClick={() => setActiveProjectIndex(index)}
                      className={`px-2 sm:px-3 md:px-4 py-2 sm:py-3 md:py-4 text-left transition-all duration-200 border-b border-border last:border-b-0 ${activeProjectIndex === index
                        ? "bg-accent/10 text-accent border-l-2 border-l-accent"
                        : "text-muted hover:bg-muted/10"
                        }`}
                    >
                      <span className="font-medium text-xs sm:text-xs md:text-sm">{project.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}