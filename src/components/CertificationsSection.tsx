import React from 'react';
import { Certification } from '../types/network';
import {
  ShieldCheck,
  Award,
  ExternalLink,
  CheckCircle,
  FileCheck,
} from 'lucide-react';

interface CertificationsSectionProps {
  certs: Certification[];
}

export const CertificationsSection: React.FC<CertificationsSectionProps> = ({ certs }) => {
  return (
    <section id="certifications" className="py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="space-y-2 mb-10">
          <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
            INDUSTRY CREDENTIALS
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Professional Certifications
          </h2>
          <p className="text-sm text-slate-400 max-w-2xl">
            Certified technical competencies across Cisco networking, Palo Alto network security, AWS cloud architecture, and enterprise ERP systems.
          </p>
        </div>

        {/* Certifications Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certs.map((cert) => (
            <div
              key={cert.id}
              className="bg-[#090f1d] border border-slate-800 rounded-xl p-6 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="p-2.5 rounded-lg bg-cyan-950/70 border border-cyan-800/60 text-cyan-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    <CheckCircle className="w-3 h-3" />
                    <span>{cert.status}</span>
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-white tracking-tight leading-snug">
                    {cert.title}
                  </h3>
                  <div className="text-xs text-cyan-400 font-mono mt-0.5">{cert.issuer}</div>
                </div>

                <div className="text-xs text-slate-400 space-y-1 font-mono">
                  <div>
                    <span className="text-slate-500">Validity:</span> {cert.issueDate}
                  </div>
                  <div>
                    <span className="text-slate-500">Credential ID:</span> {cert.credentialId}
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed pt-1">
                  {cert.description}
                </p>

                {/* Covered Skills */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[10px] uppercase font-mono text-slate-500 mb-1">
                    Validated Competencies:
                  </div>
                  <div className="flex flex-wrap gap-1 text-[11px] text-slate-300 font-mono">
                    {cert.skills.slice(0, 4).map((skill, idx) => (
                      <React.Fragment key={skill}>
                        <span>{skill}</span>
                        {idx < Math.min(cert.skills.length, 4) - 1 && (
                          <span className="text-slate-600">·</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>

              {/* Verify Link */}
              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <a
                  href={cert.verifyUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1"
                >
                  <span>Verify Credential</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
