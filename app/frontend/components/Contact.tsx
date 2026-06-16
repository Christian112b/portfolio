import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { portfolioData } from "@/data/portfolio";
import { Github, Linkedin, Twitter, Mail } from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  mail: Mail,
};

export function Contact() {
  return (
    <Section id="contact">
      <Container>
        <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>

        <p className="text-muted mb-6 max-w-lg">
          Feel free to reach out if you have any questions or just want to say
          hi. I'm always open to discussing new projects or opportunities.
        </p>

        <div className="flex flex-wrap gap-4">
          {portfolioData.socials.map((social) => {
            const Icon = iconMap[social.icon];
            if (!Icon) return null;

            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border hover:bg-accent/10 hover:border-accent transition-colors"
              >
                <Icon className="w-4 h-4" />
                {social.name}
              </a>
            );
          })}
        </div>

        {/* Email direct */}
        <div className="mt-8">
          <a
            href={`mailto:${portfolioData.email}`}
            className="text-accent hover:underline"
          >
            {portfolioData.email}
          </a>
        </div>
      </Container>
    </Section>
  );
}
