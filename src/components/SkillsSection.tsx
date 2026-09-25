import React, { useState } from 'react';
import { PROFILE_INFO } from '../data/initialData';
import {
  Layers,
  Shield,
  Server,
  Terminal,
  Cloud,
  Briefcase,
  CheckCircle2,
} from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Domains' },
    { id: 'routing', label: 'Routing & Switching', icon: Layers },
    { id: 'security', label: 'Network Security', icon: Shield },
    { id: 'infrastructure', label: 'Infrastructure', icon: Server },
    { id: 'os', label: 'Operating Systems', icon: Terminal },
    { id: 'cloud', label: 'Cloud Networking', icon: Cloud },
    { id: 'enterprise', label: 'Enterprise Apps (SAP)', icon: Briefcase },
  ];

  const skillGroups = [
    {
      id: 'routing',
      title: 'Routing & Switching',
      icon: Layers,
      description: 'Core packet forwarding, loop prevention, and Layer 2 / Layer 3 protocols.',
      items: PROFILE_INFO.skillsMatrix.routingSwitching,
      protocols: ['802.1Q', 'OSPFv2/v3', 'eBGP/iBGP', 'Rapid-PVST+', 'LACP (802.3ad)', 'RIPv2'],
    },
    {
      id: 'security',
      title: 'Network Security',
      icon: Shield,
      description: 'Perimeter firewalls, zero-trust policies, and encrypted tunnels.',
      items: PROFILE_INFO.skillsMatrix.security,
      protocols: ['Palo Alto PAN-OS', 'IPsec (IKEv1/v2)', 'Extended ACLs', 'App-ID', 'User-ID'],
    },
    {
      id: 'infrastructure',
      title: 'Infrastructure & Hardware',
      icon: Server,
      description: 'Enterprise hardware chassis, wireless controllers, and network core services.',
      items: PROFILE_INFO.skillsMatrix.infrastructure,
      protocols: ['Cisco Catalyst', 'Cisco ISR/ASR', 'Wi-Fi 6 WLC', 'DNS / DHCP Relay', 'TCP/IP'],
    },
    {
      id: 'os',
      title: 'Operating Systems',
      icon: Terminal,
      description: 'Host-level networking stacks, interface bonding, and system administration.',
      items: PROFILE_INFO.skillsMatrix.operatingSystems,
      protocols: ['Ubuntu Server', 'RHEL / CentOS', 'SLES', 'Netplan', 'Windows Server 2022'],
    },
    {
      id: 'cloud',
      title: 'Cloud & Hybrid Networking',
      icon: Cloud,
      description: 'Scalable cloud landing zones, transit routing, and hybrid interconnects.',
      items: PROFILE_INFO.skillsMatrix.cloud,
      protocols: ['AWS VPC', 'Transit Gateway', 'Direct Connect', 'Route 53', 'Cloud VPN'],
    },
    {
      id: 'enterprise',
      title: 'Enterprise Applications (SAP)',
      icon: Briefcase,
      description: 'Business-critical ERP system connectivity, database storage, and high availability.',
      items: PROFILE_INFO.skillsMatrix.enterpriseApps,
      protocols: ['SAP Business One', 'SAP BASIS', 'SAP HANA', 'Storage MTU 9000', 'ERP QoS'],
    },
  ];

  const filteredGroups =
    activeCategory === 'all'
      ? skillGroups
      : skillGroups.filter((g) => g.id === activeCategory);

  return (
    <section id="skills" className="py-20 bg-[#060a14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              TECHNICAL MATRIX
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
              Networking &amp; Infrastructure Skills
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Deep practical knowledge across Cisco hardware, Palo Alto security, Linux internals, and enterprise protocols.
            </p>
          </div>

          {/* Interactive filter buttons / segmented controls */}
          <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skill Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className="rounded-xl border border-slate-800/90 bg-[#090f1d] p-6 hover:border-slate-700 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">{group.title}</h3>
                      <p className="text-[11px] text-slate-400">{group.description}</p>
                    </div>
                  </div>

                  {/* Skills Progress List */}
                  <div className="space-y-3.5 mt-5">
                    {group.items.map((skill) => (
                      <div key={skill.name} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-200">{skill.name}</span>
                          <span className="font-mono text-cyan-400 tabular-nums">
                            {skill.level}%
                          </span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-500"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Unboxed Metadata Protocol Footer (Zero-pill discipline) */}
                <div className="mt-6 pt-4 border-t border-slate-800/80 text-[11px] text-slate-400">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    Key Standards &amp; Tools:
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 text-slate-300 font-mono">
                    {group.protocols.map((proto, idx) => (
                      <React.Fragment key={proto}>
                        <span>{proto}</span>
                        {idx < group.protocols.length - 1 && (
                          <span className="text-slate-600" aria-hidden="true">
                            ·
                          </span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
