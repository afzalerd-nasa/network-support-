import React from 'react';
import { PROFILE_INFO } from '../data/initialData';
import { ExternalLink, Terminal, Mail, Phone } from 'lucide-react';

interface FooterProps {
  onOpenSimulator: () => void;
  onOpenResume: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenSimulator,
  onOpenResume,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#050811] border-t border-slate-800 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Col 1: Brand & Philosophy */}
          <div className="space-y-3">
            <div className="text-white font-bold text-base tracking-tight flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Afzal Ahmad</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Network Engineer &amp; IT Infrastructure Specialist focused on high availability, zero-trust perimeter firewalls, and enterprise routing.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Sections
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#about" className="hover:text-cyan-400 transition-colors">About Me</a></li>
              <li><a href="#skills" className="hover:text-cyan-400 transition-colors">Networking Skills</a></li>
              <li><a href="#labs" className="hover:text-cyan-400 transition-colors">Hands-on Labs</a></li>
              <li><a href="#topology" className="hover:text-cyan-400 transition-colors">Topology Visualizer</a></li>
              <li><a href="#projects" className="hover:text-cyan-400 transition-colors">Projects</a></li>
            </ul>
          </div>

          {/* Col 3: Knowledge Base & Tools */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Engineering Tools
            </div>
            <ul className="space-y-1.5 text-xs">
              <li><a href="#troubleshooting" className="hover:text-cyan-400 transition-colors">Troubleshooting Playbook</a></li>
              <li><a href="#commands" className="hover:text-cyan-400 transition-colors">Command Cheatsheet</a></li>
              <li><a href="#blog" className="hover:text-cyan-400 transition-colors">Technical Articles</a></li>
              <li><a href="#certifications" className="hover:text-cyan-400 transition-colors">Certifications</a></li>
              <li>
                <button onClick={onOpenSimulator} className="text-cyan-400 hover:underline">
                  Launch Lab Simulator
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Contact Coordinates */}
          <div className="space-y-2">
            <div className="text-slate-200 font-semibold uppercase font-mono text-[11px] tracking-wider">
              Direct Contact
            </div>
            <div className="space-y-1.5 text-xs font-mono">
              <div>
                <a href={`mailto:${PROFILE_INFO.email}`} className="text-cyan-400 hover:underline">
                  {PROFILE_INFO.email}
                </a>
              </div>
              <div>
                <a href={`tel:${PROFILE_INFO.phone}`} className="hover:text-slate-200">
                  {PROFILE_INFO.phone}
                </a>
              </div>
              <div className="pt-2 flex items-center gap-3">
                <a
                  href={PROFILE_INFO.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  LinkedIn
                </a>
                <span>·</span>
                <a
                  href={PROFILE_INFO.github}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-white"
                >
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Quiet Bottom Copyright */}
        <div className="pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Afzal Ahmad · Designed for enterprise network engineering
          </div>
          <div className="flex items-center gap-4">
            <button onClick={onOpenResume} className="hover:text-slate-400 transition-colors">
              Resume View
            </button>
            <span>·</span>
            <button onClick={onOpenAdmin} className="hover:text-slate-400 transition-colors">
              Admin Console
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
