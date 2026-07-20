import Link from "next/link";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

const footerLinks = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy", label: "Privacy" },
  { href: "/terms", label: "Terms" },
  { href: "/login", label: "Login" },
  { href: "/register", label: "Register" },
];

export function Footer() {
  return (
    <footer className="border-t border-aimers-border bg-aimers-black text-aimers-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <p className="font-[family-name:var(--font-space-grotesk)] text-lg font-bold">
              Aimers
            </p>
            <p className="mt-2 text-sm text-aimers-white/70">
              Aim higher. Learn smarter. Online education built for focused
              students worldwide.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-aimers-gold">
              Quick links
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-aimers-white/70 transition hover:text-aimers-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-aimers-gold">
              Contact
            </p>
            <a
              href="mailto:hello@aimers.learn"
              className="mt-4 block text-sm text-aimers-white/70 transition hover:text-aimers-white"
            >
              hello@aimers.learn
            </a>
            <a
              href="https://github.com/Rumman954/Aimers"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 text-sm text-aimers-white/70 transition hover:text-aimers-white"
            >
              <GitHubIcon className="h-4 w-4" />
              GitHub repository
            </a>
          </div>
        </div>

        <div className="mt-10 border-t border-aimers-white/10 pt-6 text-center text-xs text-aimers-white/50">
          © {new Date().getFullYear()} Aimers. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
