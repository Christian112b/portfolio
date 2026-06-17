import { PortfolioData } from "@/types";

export const portfolioData: PortfolioData = {
  name: process.env.NEXT_PUBLIC_NAME || "Christian Zavala",
  title: process.env.NEXT_PUBLIC_TITLE || "IT Professional",
  bio: process.env.NEXT_PUBLIC_BIO || "IT Professional with a focus on innovative solutions and process optimization. I pride myself on an analytical and collaborative approach, always ensuring that each project is clear, efficient, and adaptable.",
  email: process.env.NEXT_PUBLIC_EMAIL || "hello@example.com",
  projects: [
  ],
  skills: [
    { name: "JavaScript", category: "frontend" },
    { name: "TypeScript", category: "frontend" },
    { name: "React", category: "frontend" },
    { name: "Next.js", category: "frontend" },
    { name: "Tailwind CSS", category: "frontend" },
    { name: "Node.js", category: "backend" },
    { name: "PostgreSQL", category: "backend" },
    { name: "Git", category: "tools" },
    { name: "Docker", category: "tools" },
    { name: "AWS", category: "tools" },
  ],
  socials: [
    { name: "GitHub", url: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com", icon: "github" },
    { name: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com", icon: "linkedin" },
    { name: "Email", url: `mailto:${process.env.NEXT_PUBLIC_EMAIL || "hello@example.com"}`, icon: "mail" },
  ],
};
