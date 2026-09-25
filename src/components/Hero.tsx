import React from 'react';
import { NetworkCanvas } from './NetworkCanvas';
import { PROFILE_INFO } from '../data/initialData';
import {
  Server,
  Shield,
  Layers,
  Terminal,
  Download,
  Mail,
  ArrowRight,
  CheckCircle,
  Wifi,
  Cpu,
} from 'lucide-react';

interface HeroProps {
  onOpenResume: () => void;
  onOpenSimulator: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenResume, onOpenSimulator }) => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden border-b border-slate-800/80 bg-[#060a14]">
      {/* Animated Network Canvas Background */}
      <NetworkCanvas />

      {/* Modern Cybernetic Mesh Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e910_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e910_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Layered Modern Ambient Glow Lights */}
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[720px] h-[480px] bg-gradient-to-tr from-cyan-500/20 via-blue-600/15 to-indigo-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-1/3 -right-24 w-[380px] h-[380px] bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-[420px] h-[360px] bg-cyan-600/10 blur-[100px] rounded-full pointer-events-none" />

      {/* Modern Vignette Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#060a14]/60 via-transparent to-[#070b14] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-24 z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Main Hero Column */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Domain metadata unboxed line */}
            <div className="flex flex-wrap items-center gap-2 text-xs font-mono text-cyan-400">
              <span className="flex items-center gap-1.5 bg-cyan-950/80 border border-cyan-800/60 px-2.5 py-1 rounded">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>INFRASTRUCTURE STATUS: OPTIMAL</span>
              </span>
              <span className="text-slate-500">·</span>
              <span className="text-slate-400">BGP / OSPF / VLANs / Zero-Trust</span>
            </div>

            <div className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight">
                {PROFILE_INFO.name}
              </h1>
              <p className="text-lg sm:text-xl font-semibold text-cyan-400 tracking-tight">
                {PROFILE_INFO.title}
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {PROFILE_INFO.subtitle}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#skills"
                className="px-4 py-2.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg shadow-sm shadow-cyan-900/30 transition-colors flex items-center gap-1.5"
              >
                <span>View My Skills</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>

              <a
                href="#projects"
                className="px-4 py-2.5 text-xs font-semibold text-slate-200 bg-slate-800/90 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <span>View Projects</span>
              </a>

              <button
                onClick={onOpenResume}
                className="px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Download Resume</span>
              </button>

              <a
                href="#contact"
                className="px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 border border-slate-800 rounded-lg transition-colors flex items-center gap-1.5"
              >
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Contact Me</span>
              </a>
            </div>

            {/* Quick trust metrics row */}
            <div className="pt-6 border-t border-slate-800/60 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white tabular-nums">
                  10+
                </div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                  Hands-on Labs
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-emerald-400 tabular-nums">
                  99.99%
                </div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                  Uptime Record
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-cyan-400 tabular-nums">
                  10 Gbps
                </div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                  Core Backbone
                </div>
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-amber-400 tabular-nums">
                  L2 / L3 / L7
                </div>
                <div className="text-slate-400 text-[11px] uppercase tracking-wider">
                  Full Stack Net
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Hardware & Topology Preview Card */}
          <div className="lg:col-span-5">
            <div className="relative rounded-xl border border-slate-700/80 bg-[#0b1222]/90 backdrop-blur-md p-6 shadow-2xl space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-xs font-mono text-slate-400">
                    edge-gw-01# terminal monitor
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">OSPF FULL</span>
              </div>

              {/* Network Diagram Node Map Mini Visual */}
              <div className="bg-[#070b14] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-300 space-y-2">
                <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80 pb-1.5">
                  <span>TOPOLOGY SUMMARY</span>
                  <span className="text-cyan-400">ACTIVE FIBER LINK</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center py-2">
                  <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                    <Shield className="w-5 h-5 mx-auto mb-1 text-red-400" />
                    <div className="font-semibold text-[11px] text-white">Palo Alto PA</div>
                    <div className="text-[9px] text-slate-400">Untrust 203.0.113.2</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                    <Server className="w-5 h-5 mx-auto mb-1 text-cyan-400" />
                    <div className="font-semibold text-[11px] text-white">Cisco ISR 4431</div>
                    <div className="text-[9px] text-slate-400">Area 0 (10.0.0.2)</div>
                  </div>
                  <div className="p-2 rounded bg-slate-900/90 border border-slate-800">
                    <Layers className="w-5 h-5 mx-auto mb-1 text-emerald-400" />
                    <div className="font-semibold text-[11px] text-white">Catalyst 3850</div>
                    <div className="text-[9px] text-slate-400">SVIs 10, 20, 30</div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 space-y-1 pt-1">
                  <div className="flex justify-between">
                    <span>Routing Protocols:</span>
                    <span className="text-white">OSPFv2 · eBGP · Static</span>
                  </div>
                  <div className="flex justify-between">
                    <span>VLAN Segments:</span>
                    <span className="text-white">Eng (10) · ERP (20) · Wi-Fi (30)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security Profile:</span>
                    <span className="text-emerald-400">Zero-Trust App-ID Enforced</span>
                  </div>
                </div>
              </div>

              {/* Interactive Simulator Launcher Button */}
              <button
                onClick={onOpenSimulator}
                className="w-full py-2.5 px-4 rounded-lg bg-gradient-to-r from-cyan-600/80 to-blue-600/80 hover:from-cyan-500 hover:to-blue-500 border border-cyan-400/40 text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-lg transition-all"
              >
                <Terminal className="w-4 h-4 text-cyan-200" />
                <span>Open Hands-On Lab Simulator (10 Labs)</span>
              </button>

              <div className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-4">
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Cisco IOS CLI
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Live Verification
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Troubleshooting
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
