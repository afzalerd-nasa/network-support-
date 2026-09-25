import React, { useRef } from 'react';
import { PROFILE_INFO, INITIAL_PROJECTS, INITIAL_CERTIFICATIONS } from '../data/initialData';
import {
  Download,
  Printer,
  X,
  Mail,
  Phone,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Copy,
  Check,
} from 'lucide-react';

interface ResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResumeModal: React.FC<ResumeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = React.useState(false);
  const printRef = useRef<HTMLDivElement | null>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyText = () => {
    const resumeText = `
AFZAL AHMAD
Network Engineer | Network Support Engineer | IT Infrastructure
Email: ${PROFILE_INFO.email} | Phone: ${PROFILE_INFO.phone}
LinkedIn: ${PROFILE_INFO.linkedin}
Location: ${PROFILE_INFO.location}

PROFESSIONAL SUMMARY
${PROFILE_INFO.summary}

CORE SKILLS
- Routing & Switching: VLANs, 802.1Q, Inter-VLAN Routing, OSPFv2, BGP, STP, LACP, RIPv2, DHCP, NAT/PAT
- Security: Palo Alto NGFW (PAN-OS), Standard/Extended ACLs, IPsec VPN, App-ID, Zero Trust
- Infrastructure: Cisco Catalyst (2960, 3850, 9300), ISR/ASR Routers, Wi-Fi 6 APs, DNS/DHCP, TCP/IP
- Operating Systems: Linux (Ubuntu, RHEL, SLES), Windows Server 2022, Active Directory
- Cloud & Hybrid: AWS VPC, Transit Gateway, Route 53, Direct Connect, Hybrid VPN
- Enterprise ERP: SAP Business One Administration, SAP BASIS, SAP HANA Storage Interconnects

KEY PROJECTS
${INITIAL_PROJECTS.map(p => `* ${p.title} (${p.category}) - ${p.summary}`).join('\n')}

CERTIFICATIONS
${INITIAL_CERTIFICATIONS.map(c => `* ${c.title} - ${c.issuer} (${c.credentialId})`).join('\n')}

EDUCATION
* ${PROFILE_INFO.education[0].degree} - ${PROFILE_INFO.education[0].institution} (${PROFILE_INFO.education[0].period})
    `.trim();

    navigator.clipboard.writeText(resumeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090f1d] border border-slate-700 rounded-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Top Control Bar */}
        <div className="px-6 py-4 bg-[#0b1222] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-white">Afzal Ahmad — Professional Resume</span>
            <span className="text-xs font-mono text-cyan-400">PDF Ready</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-md transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-800/80"
              aria-label="Close resume modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Resume Document Body */}
        <div
          ref={printRef}
          className="p-6 sm:p-10 overflow-y-auto space-y-8 bg-[#090f1d] text-slate-200 font-sans print:bg-white print:text-black print:p-0"
        >
          {/* Header */}
          <div className="border-b border-slate-800 pb-6 print:border-black">
            <h1 className="text-3xl font-bold tracking-tight text-white print:text-black">
              {PROFILE_INFO.name}
            </h1>
            <p className="text-base font-semibold text-cyan-400 print:text-gray-800 mt-1">
              {PROFILE_INFO.title}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 print:text-gray-600 mt-3 font-mono">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" /> {PROFILE_INFO.email}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5" /> {PROFILE_INFO.phone}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {PROFILE_INFO.location}
              </span>
              <span>·</span>
              <span>LinkedIn: linkedin.com/in/afzal-ahmad</span>
            </div>
          </div>

          {/* Professional Summary */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-black font-bold">
              PROFESSIONAL SUMMARY
            </h2>
            <p className="text-xs text-slate-300 print:text-gray-800 leading-relaxed">
              {PROFILE_INFO.summary}
            </p>
          </div>

          {/* Technical Skills Matrix */}
          <div className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-black font-bold">
              CORE TECHNICAL EXPERTISE
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="space-y-1">
                <div className="font-semibold text-white print:text-black">Routing &amp; Switching:</div>
                <p className="text-slate-400 print:text-gray-700">
                  VLANs, 802.1Q Trunking, Inter-VLAN Routing (SVI &amp; ROAS), OSPFv2 Multi-Area, BGP (eBGP/iBGP), Rapid-PVST+, LACP EtherChannel, Static Routing, RIPv2, DHCP Server/Relay, NAT/PAT.
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-white print:text-black">Network Security &amp; Firewalls:</div>
                <p className="text-slate-400 print:text-gray-700">
                  Palo Alto Networks Next-Gen Firewalls (PAN-OS), Standard &amp; Extended ACLs, Site-to-Site IPsec VPN, App-ID, User-ID, SSL Decryption, Security &amp; NAT Policies, DHCP Snooping.
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-white print:text-black">Infrastructure &amp; Hardware:</div>
                <p className="text-slate-400 print:text-gray-700">
                  Cisco Catalyst 2960/3850/9300 Switches, Cisco ISR 4331/4431 &amp; ASR 1001-X Routers, Wireless APs &amp; WLC, DNS/DHCP Services, TCP/IP, Wireshark Protocol Analysis.
                </p>
              </div>
              <div className="space-y-1">
                <div className="font-semibold text-white print:text-black">Systems, Cloud &amp; ERP:</div>
                <p className="text-slate-400 print:text-gray-700">
                  Linux (Ubuntu, RHEL, SLES, Netplan, systemd), Windows Server 2022, Active Directory, AWS VPC, Transit Gateway, Route 53, SAP Business One Administration, SAP BASIS, SAP HANA.
                </p>
              </div>
            </div>
          </div>

          {/* Work Experience & Projects */}
          <div className="space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-black font-bold">
              FEATURED ENGINEERING PROJECTS
            </h2>
            <div className="space-y-4">
              {INITIAL_PROJECTS.slice(0, 4).map((proj) => (
                <div key={proj.id} className="space-y-1 text-xs">
                  <div className="flex justify-between items-baseline">
                    <span className="font-bold text-white print:text-black">{proj.title}</span>
                    <span className="font-mono text-slate-400 print:text-gray-600">{proj.period}</span>
                  </div>
                  <div className="text-cyan-400 print:text-gray-700 font-medium">
                    Role: {proj.role} · Category: {proj.category}
                  </div>
                  <p className="text-slate-300 print:text-gray-800 leading-relaxed">
                    {proj.summary}
                  </p>
                  <p className="text-[11px] text-slate-400 print:text-gray-600 font-mono">
                    Technologies: {proj.technologies.join(', ')}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Certifications */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-black font-bold">
              PROFESSIONAL CERTIFICATIONS
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {INITIAL_CERTIFICATIONS.map((cert) => (
                <div key={cert.id} className="p-2.5 bg-[#070b14] print:bg-gray-100 rounded border border-slate-800 print:border-gray-300">
                  <div className="font-bold text-white print:text-black">{cert.title}</div>
                  <div className="text-cyan-400 print:text-gray-700">{cert.issuer} ({cert.issueDate})</div>
                  <div className="text-[11px] text-slate-400 print:text-gray-600 font-mono">ID: {cert.credentialId}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-cyan-400 print:text-black font-bold">
              EDUCATION
            </h2>
            <div className="text-xs">
              <div className="font-bold text-white print:text-black">{PROFILE_INFO.education[0].degree}</div>
              <div className="text-slate-400 print:text-gray-700">{PROFILE_INFO.education[0].institution} · {PROFILE_INFO.education[0].period}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
