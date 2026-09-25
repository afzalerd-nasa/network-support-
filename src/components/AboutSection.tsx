import React from 'react';
import { PROFILE_INFO } from '../data/initialData';
import {
  User,
  MapPin,
  Briefcase,
  Mail,
  Phone,
  Code,
  ShieldCheck,
  CheckCircle2,
  Terminal,
  Server,
  Cloud,
  Layers,
  ExternalLink,
} from 'lucide-react';

export const AboutSection: React.FC = () => {
  const coreCompetencies = [
    {
      title: 'Network Configuration',
      desc: 'Expertise in provisioning Cisco Catalyst switches, ISR/ASR routers, VLANs, 802.1Q trunks, and subnetting.',
      icon: Terminal,
    },
    {
      title: 'Network Troubleshooting',
      desc: 'Methodical OSI model Layer 1 to Layer 7 root cause analysis using Wireshark, CLI diagnostics, and syslog.',
      icon: ShieldCheck,
    },
    {
      title: 'LAN / WAN Design',
      desc: 'Designing redundant campus LANs, link aggregation (LACP), high availability (HSRP/VRRP), and multi-site WANs.',
      icon: Layers,
    },
    {
      title: 'Routing & Switching',
      desc: 'Proficient in OSPFv2/v3, eBGP/iBGP, RIPv2, static routing, Rapid-PVST+, and wire-speed SVI routing.',
      icon: Server,
    },
    {
      title: 'Network Security & Firewalls',
      desc: 'Palo Alto PA-Series NGFW, PAN-OS, App-ID, User-ID zero-trust policies, NAT Overload, and IPsec VPN tunnels.',
      icon: ShieldCheck,
    },
    {
      title: 'Linux Administration',
      desc: 'Enterprise Linux (Ubuntu, RHEL, SLES) network stack, Netplan, systemd-networkd, bonding mode 4, and nftables.',
      icon: Code,
    },
    {
      title: 'Cloud Infrastructure',
      desc: 'AWS VPC architecture, Transit Gateway routing, Route 53 DNS resolvers, and hybrid on-prem VPN connectivity.',
      icon: Cloud,
    },
    {
      title: 'Server & ERP Administration',
      desc: 'Windows Server 2022, Active Directory, SAP Business One on HANA, backup orchestration, and ERP QoS tuning.',
      icon: Briefcase,
    },
  ];

  return (
    <section id="about" className="py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-12">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            ENGINEERING PROFILE
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">About Me</h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            A comprehensive look at my background, enterprise infrastructure capabilities, and hands-on networking ethos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Professional Profile Card */}
          <div className="lg:col-span-4 space-y-6">
            <div className="rounded-xl border border-slate-700/80 bg-[#0b1222] p-6 space-y-6 shadow-xl">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-cyan-600 to-blue-700 p-0.5 shadow-lg">
                  <div className="w-full h-full rounded-full bg-[#070b14] flex items-center justify-center text-cyan-300 font-bold text-xl font-mono">
                    AA
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">{PROFILE_INFO.name}</h3>
                  <p className="text-xs text-cyan-400 font-medium">{PROFILE_INFO.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{PROFILE_INFO.location}</span>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4 space-y-3 text-xs">
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Specialization</span>
                  <span className="text-slate-200 text-right font-medium">Enterprise Routing &amp; Security</span>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Direct Email</span>
                  <a
                    href={`mailto:${PROFILE_INFO.email}`}
                    className="text-cyan-400 hover:underline text-right font-mono"
                  >
                    {PROFILE_INFO.email}
                  </a>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">Phone</span>
                  <a
                    href={`tel:${PROFILE_INFO.phone}`}
                    className="text-slate-200 hover:text-cyan-400 text-right font-mono"
                  >
                    {PROFILE_INFO.phone}
                  </a>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">LinkedIn</span>
                  <a
                    href={PROFILE_INFO.linkedin}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>View Profile</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <div className="flex items-start justify-between">
                  <span className="text-slate-400">GitHub</span>
                  <a
                    href={PROFILE_INFO.github}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline inline-flex items-center gap-1"
                  >
                    <span>Repositories</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>

              <div className="border-t border-slate-800 pt-4">
                <div className="text-xs font-semibold text-white mb-2">Technical Interests</div>
                <div className="space-y-1.5 text-xs text-slate-300">
                  {PROFILE_INFO.technicalInterests.map((interest, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-cyan-400 text-xs">›</span>
                      <span>{interest}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Education Card */}
            <div className="rounded-xl border border-slate-800 bg-[#090f1d] p-5 text-xs space-y-2">
              <div className="font-semibold text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-cyan-400" />
                <span>Education Background</span>
              </div>
              <p className="text-slate-200 font-medium">{PROFILE_INFO.education[0].degree}</p>
              <p className="text-slate-400">{PROFILE_INFO.education[0].institution} · {PROFILE_INFO.education[0].period}</p>
              <p className="text-slate-500 text-[11px] pt-1">{PROFILE_INFO.education[0].focus}</p>
            </div>
          </div>

          {/* Right Column: Bio Prose & Hands-On Expertise Grid */}
          <div className="lg:col-span-8 space-y-6">
            <div className="rounded-xl border border-slate-800 bg-[#090f1d] p-6 lg:p-8 space-y-4">
              <h3 className="text-xl font-bold text-white tracking-tight">
                Architecting Resilient, High-Throughput &amp; Zero-Downtime Networks
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                As a dedicated <strong>Network Engineer</strong> and <strong>IT Infrastructure Specialist</strong>, I bridge physical hardware, virtualization, and enterprise routing. Whether diagnosing an elusive spanning-tree broadcast loop, architecting a multi-area OSPF backbone, or implementing strict Palo Alto firewall security inspection, my approach is methodical and rooted in real-world packet flow principles.
              </p>
              <p className="text-sm text-slate-300 leading-relaxed">
                My hands-on experience spans physical data center rack infrastructure, Layer 2 access switching, Layer 3 multi-gigabit core routing, hybrid cloud integration via AWS Transit Gateways, Linux operating system hardening, and mission-critical ERP backend administration for SAP Business One and SAP HANA.
              </p>
            </div>

            {/* Core Competencies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {coreCompetencies.map((comp) => {
                const IconComponent = comp.icon;
                return (
                  <div
                    key={comp.title}
                    className="p-4 rounded-xl border border-slate-800/90 bg-[#0b1222]/80 hover:border-cyan-500/40 transition-colors space-y-2"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="p-2 rounded-lg bg-cyan-950/60 border border-cyan-800/60 text-cyan-400">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <h4 className="text-xs font-semibold text-white tracking-wide">
                        {comp.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {comp.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
