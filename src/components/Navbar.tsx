import React, { useState } from 'react';
import { Terminal, Shield, Menu, X, Settings } from 'lucide-react';

interface NavbarProps {
  onOpenSimulator: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenSimulator,
  onOpenResume,
  onOpenAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Labs', href: '#labs' },
    { label: 'Topology', href: '#topology' },
    { label: 'Projects', href: '#projects' },
    { label: 'Troubleshooting', href: '#troubleshooting' },
    { label: 'Commands', href: '#commands' },
    { label: 'Blog', href: '#blog' },
    { label: 'Certifications', href: '#certifications' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#070b14]/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-3">
          <a
            href="#"
            className="flex items-center gap-2 text-base sm:text-lg font-bold tracking-tight text-white hover:text-cyan-400 transition-colors"
          >
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />
            <span>Afzal Ahmad</span>
            <span className="hidden sm:inline-block text-xs font-mono text-slate-400 border border-slate-800 px-1.5 py-0.5 rounded">
              CCNA / PCNSA
            </span>
          </a>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden xl:flex items-center gap-5 text-xs font-medium tracking-wide text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-cyan-400 transition-colors whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={onOpenSimulator}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-700/60 rounded-md hover:bg-cyan-900/50 hover:border-cyan-500 transition-colors whitespace-nowrap"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Lab Simulator</span>
          </button>

          <button
            onClick={onOpenResume}
            className="px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors whitespace-nowrap"
          >
            Resume
          </button>

          <button
            onClick={onOpenAdmin}
            title="Admin Console"
            aria-label="Admin Console"
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 rounded-md border border-transparent hover:border-slate-700 transition-colors"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-1.5 text-slate-300 hover:text-white rounded-md border border-slate-800"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-b border-slate-800 bg-[#090f1d] px-4 pt-3 pb-5 space-y-1">
          <div className="grid grid-cols-2 gap-2 mb-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 rounded-md"
              >
                {link.label}
              </a>
            ))}
          </div>
          <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSimulator();
              }}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-cyan-300 bg-cyan-950/60 border border-cyan-800 rounded-md"
            >
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Launch Network Lab Simulator</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="w-full px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 border border-slate-700 rounded-md text-center"
            >
              View & Download Resume
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
