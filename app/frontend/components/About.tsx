"use client";

import { Section } from "./ui/Section";
import { Container } from "./ui/Container";
import { Badge } from "./ui/Badge";
import { portfolioData } from "@/data/portfolio";

export function About() {
  const profile = portfolioData;

  return (
    <Section id="about">
      <Container>
        <h2 className="text-2xl font-bold mb-6">About Me</h2>

        <div className="space-y-6">
          {/* Bio */}
          <p className="text-lg text-muted max-w-2xl">
            {profile.bio}
          </p>

          {/* Skills */}
          <div>
            <h3 className="text-sm font-medium mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {portfolioData.skills.map((skill) => (
                <Badge key={skill.name}>{skill.name}</Badge>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
