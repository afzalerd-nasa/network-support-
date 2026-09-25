import React, { useState } from 'react';
import { TroubleshootingItem } from '../types/network';
import {
  Search,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Terminal,
  Layers,
  Server,
  Shield,
  Globe,
  Code,
} from 'lucide-react';

interface TroubleshootingSectionProps {
  items: TroubleshootingItem[];
}

export const TroubleshootingSection: React.FC<TroubleshootingSectionProps> = ({ items }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(items[0]?.id || null);

  const categories = [
    { id: 'all', label: 'All Issues' },
    { id: 'VLAN', label: 'VLAN & Trunks' },
    { id: 'Routing', label: 'Routing Protocols' },
    { id: 'DHCP', label: 'DHCP & Relay' },
    { id: 'DNS', label: 'DNS Resolution' },
    { id: 'Firewall', label: 'Firewall & NAT' },
    { id: 'Internet', label: 'Internet & MTU' },
    { id: 'Linux', label: 'Linux Networking' },
    { id: 'Windows', label: 'Windows Networking' },
  ];

  const filteredItems = items.filter((item) => {
    const matchesCategory =
      selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.symptom.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.steps.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <section id="troubleshooting" className="py-20 bg-[#060a14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            KNOWLEDGE BASE
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Networking Troubleshooting &amp; Diagnostics
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            A searchable engineering playbook covering root-cause analyses, packet drop forensics, and step-by-step resolution workflows.
          </p>
        </div>

        {/* Search & Category Filter Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search problems (e.g. VLAN, OSPF EXSTART, APIPA 169.254, DNS, MTU)..."
              className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Items List */}
        <div className="space-y-4">
          {filteredItems.length === 0 ? (
            <div className="bg-[#090f1d] border border-slate-800 p-8 rounded-xl text-center text-slate-400 text-xs">
              No troubleshooting guide matched your query "{searchQuery}". Try searching for VLAN, OSPF, or DHCP.
            </div>
          ) : (
            filteredItems.map((item) => {
              const isExpanded = expandedId === item.id;

              return (
                <div
                  key={item.id}
                  className={`rounded-xl border transition-all overflow-hidden ${
                    isExpanded
                      ? 'bg-[#090f1d] border-cyan-500/50 shadow-lg'
                      : 'bg-[#090f1d]/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Item Header */}
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="w-full p-5 text-left flex items-start justify-between gap-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-amber-950/50 border border-amber-800/60 text-amber-400 shrink-0">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1">
                          <span>Category: {item.category}</span>
                        </div>
                        <h3 className="text-base font-bold text-white tracking-tight">
                          {item.title}
                        </h3>
                        <p className="text-xs text-slate-400 mt-0.5">
                          <strong>Symptom:</strong> {item.symptom}
                        </p>
                      </div>
                    </div>

                    <div className="p-1 rounded-md bg-slate-800 text-slate-300 shrink-0">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Expanded Diagnostic Workflow Pane */}
                  {isExpanded && (
                    <div className="px-6 pb-6 pt-2 border-t border-slate-800 space-y-6">
                      {/* Potential Root Causes */}
                      <div className="bg-[#070b14] border border-slate-800 p-4 rounded-lg space-y-2">
                        <div className="text-xs font-mono uppercase text-amber-400 font-semibold">
                          Potential Root Causes
                        </div>
                        <ul className="space-y-1.5 text-xs text-slate-300">
                          {item.rootCauses.map((cause, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-amber-400">›</span>
                              <span>{cause}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Step-by-Step Diagnostic Sequence */}
                      <div className="space-y-2">
                        <div className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                          Step-by-Step Diagnostic Sequence
                        </div>
                        <div className="space-y-2">
                          {item.steps.map((step, idx) => (
                            <div
                              key={idx}
                              className="p-3 bg-[#070b14] border border-slate-800/90 rounded-lg text-xs font-mono text-slate-200 flex items-start gap-2"
                            >
                              <span className="text-cyan-400 font-bold">{idx + 1}.</span>
                              <span className="leading-relaxed">{step}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key CLI Diagnostic Commands */}
                      {item.diagnosticCommands.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-xs font-mono uppercase text-slate-300 font-semibold">
                            Recommended CLI Diagnostic Commands
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {item.diagnosticCommands.map((diag, idx) => (
                              <div
                                key={idx}
                                className="p-3 bg-[#070b14] border border-slate-800 rounded-lg space-y-1"
                              >
                                <div className="text-xs font-mono text-cyan-300 font-bold">
                                  {diag.cmd}
                                </div>
                                <div className="text-[11px] text-slate-400">{diag.outputNote}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Verified Resolution */}
                      <div className="p-4 bg-emerald-950/20 border border-emerald-800/50 rounded-lg flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-semibold text-emerald-400 mb-0.5">
                            Verified Resolution Summary
                          </div>
                          <p className="text-xs text-slate-300 leading-relaxed">
                            {item.resolutionSummary}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};
