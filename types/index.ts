export interface Project {
  id: string;
  title: string;
  description: string;
  tags: string[];
  github?: string;
  live?: string;
  live_url?: string;
  repo_url?: string;
  image_url?: string[];
  images?: string[];
  order?: string[];
}

export interface Skill {
  name: string;
  category: "frontend" | "backend" | "tools" | "other";
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  projects: Project[];
  skills: Skill[];
  socials: SocialLink[];
}
