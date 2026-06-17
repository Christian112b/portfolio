"use client";

import { useState } from "react";
import { Container } from "./ui/Container";
import { portfolioData } from "@/data/portfolio";
import { Github, Linkedin, Mail, Plus } from "lucide-react";
import { ProjectCreateForm } from "./ProjectCreateForm";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  mail: Mail,
};

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <>
      <footer className="py-8 border-t border-border">
        <Container>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="text-sm text-muted">
              © {currentYear} {portfolioData.name}. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-4">
              {portfolioData.socials.map((social) => {
                const Icon = iconMap[social.icon];
                if (!Icon) return null;

                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted hover:text-foreground transition-colors"
                    aria-label={social.name}
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              })}
              
              {/* Botón Agregar Proyecto - icono + */}
              <button
                onClick={() => setShowCreateForm(true)}
                className="text-muted hover:text-foreground transition-colors"
                aria-label="Agregar Proyecto"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </div>
        </Container>
      </footer>

      {/* Modal del formulario */}
      {showCreateForm && (
        <ProjectCreateForm 
          onClose={() => setShowCreateForm(false)}
          onSuccess={() => setShowCreateForm(false)}
        />
      )}
    </>
  );
}