"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/components/auth/auth-provider";
import { AimersLogo } from "@/components/brand/aimers-logo";
import { cn } from "@/lib/utils";

const loggedOutLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/login", label: "Login" },
];

const loggedInLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/ai-tools", label: "AI Tools" },
  { href: "/contact", label: "Contact" },
];

const studentLinks = [{ href: "/my-class", label: "My Class" }];

const instructorLinks = [{ href: "/items/manage", label: "Manage" }];

export function Navbar() {
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = isAuthenticated
    ? [
        ...loggedInLinks.slice(0, 3),
        ...(user?.role === "student" ? studentLinks : []),
        ...loggedInLinks.slice(3),
        ...(user?.role === "instructor" || user?.role === "admin"
          ? instructorLinks
          : []),
      ]
    : loggedOutLinks;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-aimers-border/60 bg-aimers-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-6 lg:px-8">
        <Link
          href="/"
          aria-label="Aimers home"
          onClick={() => setMobileOpen(false)}
        >
          <AimersLogo variant="nav" priority />
        </Link>

        <ul className="hidden items-center gap-6 lg:gap-8 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm font-medium text-aimers-black/80 transition hover:text-aimers-black"
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button
                type="button"
                onClick={logout}
                className="text-sm font-medium text-aimers-black/80 transition hover:text-aimers-black"
              >
                Logout
              </button>
            </li>
          )}
        </ul>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-[var(--aimers-radius)] p-2 text-aimers-black md:hidden"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          "border-t border-aimers-border/60 bg-aimers-white/95 backdrop-blur-md md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
      >
        <ul className="flex flex-col gap-1 px-4 py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block rounded-[var(--aimers-radius)] px-3 py-2.5 text-sm font-medium text-aimers-black/80 transition hover:bg-aimers-surface hover:text-aimers-black"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            </li>
          ))}
          {isAuthenticated && (
            <li>
              <button
                type="button"
                onClick={() => {
                  logout();
                  setMobileOpen(false);
                }}
                className="block w-full rounded-[var(--aimers-radius)] px-3 py-2.5 text-left text-sm font-medium text-aimers-black/80 transition hover:bg-aimers-surface hover:text-aimers-black"
              >
                Logout
              </button>
            </li>
          )}
        </ul>
      </div>
    </header>
  );
}
