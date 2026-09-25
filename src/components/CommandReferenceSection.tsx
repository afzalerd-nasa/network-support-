import React, { useState } from 'react';
import { INITIAL_COMMANDS } from '../data/initialData';
import { CommandItem } from '../types/network';
import {
  Terminal,
  Search,
  Copy,
  Check,
  Code,
  Layers,
  Server,
  Shield,
  Monitor,
} from 'lucide-react';

export const CommandReferenceSection: React.FC = () => {
  const [platformFilter, setPlatformFilter] = useState<'All' | 'Cisco' | 'Linux' | 'Palo Alto' | 'Windows'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredCommands = INITIAL_COMMANDS.filter((cmd) => {
    const matchesPlatform = platformFilter === 'All' || cmd.platform === platformFilter;
    const matchesSearch =
      cmd.command.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPlatform && matchesSearch;
  });

  const handleCopy = (command: string, id: string) => {
    navigator.clipboard.writeText(command);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <section id="commands" className="py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            ENGINEERING CHEATSHEET
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Network Engineer Command Reference
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Quick-reference CLI commands for Cisco IOS, Linux iproute2, Palo Alto PAN-OS, and Windows diagnostics with instant clipboard copying.
          </p>
        </div>

        {/* Filter & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search commands (e.g. show ip route, ss, trunk, vlan, dig)..."
              className="w-full pl-9 pr-4 py-2 bg-[#090f1d] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          {/* Platform Filter Buttons */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {(['All', 'Cisco', 'Linux', 'Palo Alto', 'Windows'] as const).map((platform) => (
              <button
                key={platform}
                onClick={() => setPlatformFilter(platform)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  platformFilter === platform
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {platform}
              </button>
            ))}
          </div>
        </div>

        {/* Commands Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCommands.map((item) => (
            <div
              key={item.id}
              className="bg-[#090f1d] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Meta Top Line */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-semibold ${
                        item.platform === 'Cisco'
                          ? 'text-cyan-400'
                          : item.platform === 'Linux'
                          ? 'text-amber-400'
                          : item.platform === 'Palo Alto'
                          ? 'text-red-400'
                          : 'text-blue-400'
                      }`}
                    >
                      {item.platform}
                    </span>
                    <span className="text-slate-600">·</span>
                    <span className="text-slate-400">{item.category}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(item.command, item.id)}
                    className="p-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                    title="Copy command"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Command Snippet Block */}
                <div className="bg-[#050811] border border-slate-800/90 rounded-lg p-3 font-mono text-xs text-cyan-300 font-semibold flex items-center justify-between">
                  <span className="select-all">{item.command}</span>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 leading-relaxed">
                  {item.description}
                </p>

                {item.parametersExplanation && (
                  <p className="text-[11px] text-slate-400 italic">
                    Tip: {item.parametersExplanation}
                  </p>
                )}
              </div>

              {/* Sample Output Dropdown/Block */}
              {item.exampleOutput && (
                <div className="border-t border-slate-800/80 pt-3">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    Sample CLI Output:
                  </div>
                  <pre className="p-2.5 bg-[#050811] border border-slate-800/60 rounded text-[10px] font-mono text-slate-400 overflow-x-auto leading-tight">
                    {item.exampleOutput}
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
