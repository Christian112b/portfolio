"use client";

import Link from "next/link";
import { Container } from "./ui/Container";
import { Github, Linkedin, Mail } from "lucide-react";

import { useLanguage } from "@/context/LanguageContext";
import { LanguageSwitcher } from "./LanguageSwitcher";

const socialIcons = [
  { icon: Github, href: process.env.NEXT_PUBLIC_GITHUB_URL || "https://github.com", label: "GitHub" },
  { icon: Linkedin, href: process.env.NEXT_PUBLIC_LINKEDIN_URL || "https://linkedin.com", label: "LinkedIn" },
  { icon: Mail, href: `mailto:${process.env.NEXT_PUBLIC_EMAIL || "hello@example.com"}`, label: "Email" },
];



export function Header() {

  // const { t } = useLanguage();

  // const navItems = [
  //   { name: t("nav.projects"), href: "#projects" },
  //   { name: t("nav.about"), href: "#about" },
  //   { name: t("nav.contact"), href: "#contact" },
  // ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-sm border-b border-border">
      <Container>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-lg font-bold hover:text-accent transition-colors px-3 py-1.5 rounded-md border-2 border-foreground/20 hover:border-accent bg-background/50"
          >
            CZ
          </Link>

          {/* Navigation */}
          {/* <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav> */}

          {/* Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1">
              {socialIcons.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full hover:bg-accent/10 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

              {/* Language Switcher */}
              <LanguageSwitcher />


          </div>
        </div>
      </Container>
    </header>
  );
}
