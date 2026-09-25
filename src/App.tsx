import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AboutSection } from './components/AboutSection';
import { SkillsSection } from './components/SkillsSection';
import { LabShowcase } from './components/LabShowcase';
import { TopologyVisualizer } from './components/TopologyVisualizer';
import { ProjectsSection } from './components/ProjectsSection';
import { TroubleshootingSection } from './components/TroubleshootingSection';
import { CommandReferenceSection } from './components/CommandReferenceSection';
import { BlogSection } from './components/BlogSection';
import { CertificationsSection } from './components/CertificationsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { AdminDashboard } from './components/AdminDashboard';
import {
  getStoredLabs,
  getStoredProjects,
  getStoredBlogs,
  getStoredCerts,
} from './utils/storage';
import { INITIAL_TROUBLESHOOTING } from './data/initialData';

export default function App() {
  const [resumeOpen, setResumeOpen] = useState(false);
  const [adminOpen, setAdminOpen] = useState(false);

  // App Data State (Synced with localStorage)
  const [labs, setLabs] = useState(getStoredLabs());
  const [projects, setProjects] = useState(getStoredProjects());
  const [blogs, setBlogs] = useState(getStoredBlogs());
  const [certs, setCerts] = useState(getStoredCerts());

  const handleRefreshData = () => {
    setLabs(getStoredLabs());
    setProjects(getStoredProjects());
    setBlogs(getStoredBlogs());
    setCerts(getStoredCerts());
  };

  const handleScrollToSimulator = () => {
    const el = document.getElementById('labs');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Bar Navigation */}
      <Navbar
        onOpenSimulator={handleScrollToSimulator}
        onOpenResume={() => setResumeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      <main className="flex-1">
        {/* 1. Hero Section */}
        <Hero
          onOpenResume={() => setResumeOpen(true)}
          onOpenSimulator={handleScrollToSimulator}
        />

        {/* 2. About Me */}
        <AboutSection />

        {/* 3. Networking Skills */}
        <SkillsSection />

        {/* 4. Networking Labs & Lab Simulator */}
        <LabShowcase labs={labs} />

        {/* 5. Network Topology Visualizer */}
        <TopologyVisualizer />

        {/* 6. Projects */}
        <ProjectsSection projects={projects} />

        {/* 7. Troubleshooting Knowledge Base */}
        <TroubleshootingSection items={INITIAL_TROUBLESHOOTING} />

        {/* 8. Command Reference */}
        <CommandReferenceSection />

        {/* 9. Blog / Technical Articles */}
        <BlogSection posts={blogs} />

        {/* 10. Certifications */}
        <CertificationsSection certs={certs} />

        {/* 11. Contact Page */}
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenSimulator={handleScrollToSimulator}
        onOpenResume={() => setResumeOpen(true)}
        onOpenAdmin={() => setAdminOpen(true)}
      />

      {/* Modals */}
      <ResumeModal
        isOpen={resumeOpen}
        onClose={() => setResumeOpen(false)}
      />

      <AdminDashboard
        isOpen={adminOpen}
        onClose={() => setAdminOpen(false)}
        onDataUpdated={handleRefreshData}
      />
    </div>
  );
}
