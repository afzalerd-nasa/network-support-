import React, { useState } from 'react';
import { NetworkProject } from '../types/network';
import {
  Layers,
  Server,
  Shield,
  Cloud,
  Briefcase,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Cpu,
} from 'lucide-react';

interface ProjectsSectionProps {
  projects: NetworkProject[];
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({ projects }) => {
  const [expandedId, setExpandedId] = useState<string | null>(projects[0]?.id || null);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const getCategoryIcon = (category: NetworkProject['category']) => {
    switch (category) {
      case 'Enterprise LAN':
        return Layers;
      case 'WAN & Routing':
        return Server;
      case 'Network Security':
        return Shield;
      case 'Linux & Cloud':
        return Cloud;
      case 'Enterprise ERP':
        return Briefcase;
      default:
        return Server;
    }
  };

  return (
    <section id="projects" className="py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            PORTFOLIO SHOWCASE
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Engineering Projects &amp; Implementations
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Real enterprise deployments across campus networking, next-gen perimeter security, hybrid cloud VPCs, and SAP ERP infrastructure.
          </p>
        </div>

        {/* Projects Accordion / Grid List */}
        <div className="space-y-4">
          {projects.map((project) => {
            const isExpanded = expandedId === project.id;
            const CategoryIcon = getCategoryIcon(project.category);

            return (
              <div
                key={project.id}
                className={`rounded-xl border transition-all overflow-hidden ${
                  isExpanded
                    ? 'bg-[#090f1d] border-cyan-500/50 shadow-xl'
                    : 'bg-[#090f1d]/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Clickable Header Bar */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full p-5 lg:p-6 text-left flex items-start justify-between gap-4 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400 shrink-0">
                      <CategoryIcon className="w-5 h-5" />
                    </div>
                    <div>
                      {/* Zero-pill clean metadata line */}
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 font-mono mb-1">
                        <span className="text-cyan-400">{project.category}</span>
                        <span aria-hidden="true">·</span>
                        <span>Role: {project.role}</span>
                        <span aria-hidden="true">·</span>
                        <span>Timeline: {project.period}</span>
                      </div>
                      <h3 className="text-lg font-bold text-white tracking-tight">
                        {project.title}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
                        {project.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 pt-1">
                    <div className="hidden sm:flex items-center gap-4 text-right">
                      {project.results[0] && (
                        <div>
                          <div className="text-base font-bold font-mono text-cyan-400">
                            {project.results[0].metric}
                          </div>
                          <div className="text-[10px] text-slate-400 uppercase">
                            {project.results[0].label}
                          </div>
                        </div>
                      )}
                    </div>
                    <div className="p-1 rounded-md bg-slate-800 text-slate-300">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </button>

                {/* Expanded Project Details Pane */}
                {isExpanded && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-800/80 space-y-6">
                    {/* Metrics Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {project.results.map((res, idx) => (
                        <div
                          key={idx}
                          className="bg-[#070b14] border border-slate-800 p-3 rounded-lg text-center"
                        >
                          <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums">
                            {res.metric}
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{res.label}</div>
                        </div>
                      ))}
                    </div>

                    {/* Architecture Summary */}
                    <div className="bg-[#070b14] border border-slate-800 p-4 rounded-lg space-y-1.5">
                      <div className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                        Architecture Topology &amp; Flow
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {project.architectureSummary}
                      </p>
                    </div>

                    {/* Challenges vs Solution Two-Column Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Challenges */}
                      <div className="bg-[#070b14] border border-slate-800 p-4 rounded-lg space-y-2">
                        <div className="text-xs font-mono uppercase text-amber-400 font-semibold">
                          Engineering Challenges
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {project.challenges.map((ch, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400 text-xs">✕</span>
                              <span>{ch}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Solution */}
                      <div className="bg-[#070b14] border border-slate-800 p-4 rounded-lg space-y-2">
                        <div className="text-xs font-mono uppercase text-emerald-400 font-semibold">
                          Implemented Solution
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {project.solution.map((sol, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-emerald-400 text-xs">✓</span>
                              <span>{sol}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Tech Stack & Hardware Badges (Unboxed typography / simple tags) */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800 text-xs">
                      <div>
                        <span className="text-slate-500 mr-2 font-mono text-[11px]">TECH:</span>
                        <span className="text-slate-300 font-mono">
                          {project.technologies.join(' · ')}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 mr-2 font-mono text-[11px]">HARDWARE:</span>
                        <span className="text-cyan-400 font-mono">
                          {project.hardwareUsed.join(' · ')}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
