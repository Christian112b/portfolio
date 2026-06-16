import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Badge } from "./ui/Badge";
import { portfolioData } from "@/data/portfolio";
import { Github, ExternalLink, ImageIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function Projects() {
  return (
    <Section id="projects">
      <Container>
        <h2 className="text-2xl font-bold mb-10">Projects</h2>

        <div className="space-y-10">

          {portfolioData.projects.map((project, index) => (
            <div key={project.id}>
              <div className="flex flex-col lg:flex-row lg:gap-6">

                {/* Images Carousel */}
                {project.image_url && project.image_url.length > 0 && (
                  <div className="lg:w-1/2 mb-4 lg:mb-0">
                    <div className="grid grid-cols-2 gap-2">
                      {project.image_url.slice(0, 4).map((img, imgIndex) => (
                        <div key={imgIndex} className="relative aspect-video rounded-lg overflow-hidden bg-accent/5">
                          <Image
                            src={img}
                            alt={`${project.title} screenshot ${imgIndex + 1}`}
                            fill
                            className="object-cover hover:scale-105 transition-transform duration-300"
                            sizes="(max-width: 768px) 50vw, 33vw"
                          />
                        </div>
                      ))}
                    </div>
                    {project.image_url.length > 4 && (
                      <p className="text-xs text-muted mt-2">+{project.image_url.length - 4} more images</p>
                    )}
                  </div>
                )}

                {/* Project Info */}
                <div className="flex-1 flex flex-col gap-2">
                  <h3 className="text-lg font-semibold">{project.title}</h3>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <Badge key={tag}>{tag}</Badge>
                    ))}
                  </div>

                  <p className="text-muted mt-2">{project.description}</p>

                  <div className="flex gap-4 mt-3">
                    {project.github && (
                      <Link
                        href={project.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                      >
                        <Github className="w-4 h-4" />
                        GitHub
                      </Link>
                    )}
                    {project.live && (
                      <Link
                        href={project.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Live Demo
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {index < portfolioData.projects.length - 1 && (
                <div className="border-t border-border mt-8" />
              )}
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
