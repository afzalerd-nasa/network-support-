import React, { useState, useEffect } from 'react';
import {
  NetworkLab,
  NetworkProject,
  BlogPost,
  Certification,
  ContactMessage,
} from '../types/network';
import {
  getStoredLabs,
  saveStoredLabs,
  getStoredProjects,
  saveStoredProjects,
  getStoredBlogs,
  saveStoredBlogs,
  getStoredCerts,
  saveStoredCerts,
  getStoredMessages,
  saveStoredMessages,
  resetAllData,
} from '../utils/storage';
import {
  Lock,
  Unlock,
  X,
  Mail,
  Layers,
  Terminal,
  BookOpen,
  Award,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
} from 'lucide-react';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  onDataUpdated: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  isOpen,
  onClose,
  onDataUpdated,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState(false);

  const [activeTab, setActiveTab] = useState<'messages' | 'projects' | 'labs' | 'blogs' | 'settings'>('messages');

  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [projects, setProjects] = useState<NetworkProject[]>([]);
  const [labs, setLabs] = useState<NetworkLab[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Simple Add Modals
  const [newProjectTitle, setNewProjectTitle] = useState('');
  const [newProjectCategory, setNewProjectCategory] = useState<NetworkProject['category']>('Enterprise LAN');
  const [newProjectSummary, setNewProjectSummary] = useState('');

  const [newLabTitle, setNewLabTitle] = useState('');
  const [newLabCategory, setNewLabCategory] = useState<NetworkLab['category']>('Routing');
  const [newLabObjective, setNewLabObjective] = useState('');

  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogSummary, setNewBlogSummary] = useState('');

  useEffect(() => {
    if (isOpen) {
      setMessages(getStoredMessages());
      setProjects(getStoredProjects());
      setLabs(getStoredLabs());
      setBlogs(getStoredBlogs());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode.trim() === 'cisco123' || passcode.trim() === 'admin2026') {
      setIsAuthenticated(true);
      setAuthError(false);
    } else {
      setAuthError(true);
    }
  };

  const handleDeleteMessage = (id: string) => {
    const updated = messages.filter((m) => m.id !== id);
    setMessages(updated);
    saveStoredMessages(updated);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectTitle.trim()) return;

    const newProj: NetworkProject = {
      id: `proj-${Date.now()}`,
      title: newProjectTitle,
      category: newProjectCategory,
      period: 'Recent',
      role: 'Network Engineer',
      summary: newProjectSummary || 'Enterprise infrastructure implementation.',
      technologies: ['Cisco IOS', 'Routing', 'Switching'],
      hardwareUsed: ['Cisco Hardware'],
      challenges: ['High-availability requirement', 'Strict packet latency SLA'],
      solution: ['Deployed redundant topologies with sub-second failover'],
      results: [{ metric: '100%', label: 'Delivery Success' }],
      architectureSummary: 'Standard enterprise modular architecture.',
    };

    const updated = [newProj, ...projects];
    setProjects(updated);
    saveStoredProjects(updated);
    onDataUpdated();
    setNewProjectTitle('');
    setNewProjectSummary('');
  };

  const handleAddLab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabTitle.trim()) return;

    const newLab: NetworkLab = {
      id: `lab-${Date.now()}`,
      number: labs.length + 1,
      title: newLabTitle,
      category: newLabCategory,
      difficulty: 'Intermediate',
      estimatedTime: '45 mins',
      objective: newLabObjective || 'Configure and verify network topologies.',
      topologySummary: 'Router and switch topology testbed.',
      devices: [
        { name: 'R1-CORE', model: 'Cisco ISR', role: 'Gateway', interfaces: 'Gi0/0, Gi0/1' }
      ],
      configs: [
        {
          device: 'R1-CORE',
          mode: 'Config Terminal',
          commands: ['enable', 'configure terminal', '! Custom configuration', 'end'],
          explanation: 'Initial base setup.'
        }
      ],
      verificationCommands: [
        { command: 'show ip route', description: 'Inspect routing table', sampleOutput: 'Connected routes verified.' }
      ],
      troubleshootingSteps: ['Check physical cabling', 'Verify IP addressing'],
      expectedResult: 'Lab successfully verified.'
    };

    const updated = [...labs, newLab];
    setLabs(updated);
    saveStoredLabs(updated);
    onDataUpdated();
    setNewLabTitle('');
    setNewLabObjective('');
  };

  const handleAddBlog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle.trim()) return;

    const newPost: BlogPost = {
      id: `blog-${Date.now()}`,
      title: newBlogTitle,
      slug: newBlogTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      category: 'Network Engineering',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      readTime: '5 min read',
      tags: ['Networking', 'Cisco'],
      summary: newBlogSummary || 'Technical engineering guide.',
      content: 'Detailed article content draft.'
    };

    const updated = [newPost, ...blogs];
    setBlogs(updated);
    saveStoredBlogs(updated);
    onDataUpdated();
    setNewBlogTitle('');
    setNewBlogSummary('');
  };

  const handleResetData = () => {
    if (confirm('Are you sure you want to reset all portfolio data to factory defaults?')) {
      resetAllData();
      setMessages(getStoredMessages());
      setProjects(getStoredProjects());
      setLabs(getStoredLabs());
      setBlogs(getStoredBlogs());
      onDataUpdated();
      alert('Portfolio reset to default state.');
    }
  };

  const handleExportBackup = () => {
    const backupData = {
      labs: getStoredLabs(),
      projects: getStoredProjects(),
      blogs: getStoredBlogs(),
      certs: getStoredCerts(),
      messages: getStoredMessages(),
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `afzal-portfolio-backup-${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#090f1d] border border-slate-700 rounded-xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0b1222] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <span className="text-sm font-bold text-white">Afzal Ahmad — Admin Control Console</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-md bg-slate-800/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          {!isAuthenticated ? (
            <div className="max-w-md mx-auto my-12 space-y-6 text-center">
              <div className="w-12 h-12 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center mx-auto text-cyan-400">
                <Lock className="w-6 h-6" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white">Admin Authentication</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Manage your portfolio, read contact messages, and add custom networking labs.
                </p>
              </div>

              <div className="p-3 bg-[#070b14] border border-slate-800 rounded-lg text-xs font-mono text-cyan-300">
                Demo Passcode: <span className="font-bold underline">cisco123</span> or <span className="font-bold underline">admin2026</span>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Enter administrator passcode..."
                  className="w-full px-3.5 py-2.5 bg-[#070b14] border border-slate-800 rounded-lg text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500 font-mono text-center"
                  autoFocus
                />
                {authError && (
                  <p className="text-xs text-red-400 font-mono">
                    Invalid passcode. Use "cisco123" to enter.
                  </p>
                )}
                <button
                  type="submit"
                  className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded-lg transition-colors"
                >
                  Unlock Admin Console
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Tab Navigation */}
              <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
                <button
                  onClick={() => setActiveTab('messages')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'messages'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Inquiries ({messages.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('projects')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'projects'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Projects ({projects.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('labs')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'labs'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  <Terminal className="w-3.5 h-3.5" />
                  <span>Labs ({labs.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('blogs')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'blogs'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Blog Articles ({blogs.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${
                    activeTab === 'settings'
                      ? 'bg-cyan-600 text-white'
                      : 'text-slate-400 hover:text-white bg-slate-900 border border-slate-800'
                  }`}
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Backup &amp; Reset</span>
                </button>
              </div>

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase text-cyan-400">
                    Received Inquiries &amp; Messages
                  </h4>
                  {messages.length === 0 ? (
                    <p className="text-xs text-slate-400">No contact submissions received yet.</p>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className="p-4 bg-[#070b14] border border-slate-800 rounded-lg space-y-2 text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="font-bold text-white">{msg.name} ({msg.email})</div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-slate-500 text-[11px]">{msg.createdAt}</span>
                              <button
                                onClick={() => handleDeleteMessage(msg.id)}
                                className="p-1 text-slate-500 hover:text-red-400"
                                title="Delete message"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                          <div className="text-cyan-400 font-semibold">{msg.subject}</div>
                          <p className="text-slate-300 leading-relaxed">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Projects Tab */}
              {activeTab === 'projects' && (
                <div className="space-y-6">
                  {/* Add Project Form */}
                  <form onSubmit={handleAddProject} className="p-4 bg-[#070b14] border border-slate-800 rounded-lg space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Network Project</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        placeholder="Project Title (e.g. Cisco ACI Spine-Leaf Fabric)..."
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                      <select
                        value={newProjectCategory}
                        onChange={(e) => setNewProjectCategory(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      >
                        <option value="Enterprise LAN">Enterprise LAN</option>
                        <option value="WAN & Routing">WAN & Routing</option>
                        <option value="Network Security">Network Security</option>
                        <option value="Linux & Cloud">Linux & Cloud</option>
                        <option value="Enterprise ERP">Enterprise ERP</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={newProjectSummary}
                      onChange={(e) => setNewProjectSummary(e.target.value)}
                      placeholder="Summary and key outcomes..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded transition-colors"
                    >
                      Save Project to Portfolio
                    </button>
                  </form>

                  {/* Existing Projects List */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono uppercase text-slate-400">Current Projects ({projects.length})</h5>
                    {projects.map((p) => (
                      <div key={p.id} className="p-3 bg-[#070b14] border border-slate-800 rounded text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{p.title}</div>
                          <div className="text-[11px] text-slate-400">{p.category} · {p.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Labs Tab */}
              {activeTab === 'labs' && (
                <div className="space-y-6">
                  {/* Add Lab Form */}
                  <form onSubmit={handleAddLab} className="p-4 bg-[#070b14] border border-slate-800 rounded-lg space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Add New Network Lab</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        value={newLabTitle}
                        onChange={(e) => setNewLabTitle(e.target.value)}
                        placeholder="Lab Title (e.g. HSRP Dual Gateway)..."
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      />
                      <select
                        value={newLabCategory}
                        onChange={(e) => setNewLabCategory(e.target.value as any)}
                        className="px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                      >
                        <option value="Routing">Routing</option>
                        <option value="Switching">Switching</option>
                        <option value="Security">Security</option>
                        <option value="Services">Services</option>
                        <option value="VPN">VPN</option>
                      </select>
                    </div>
                    <textarea
                      rows={2}
                      value={newLabObjective}
                      onChange={(e) => setNewLabObjective(e.target.value)}
                      placeholder="Lab objective and commands summary..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded transition-colors"
                    >
                      Publish Lab
                    </button>
                  </form>

                  {/* Current Labs */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono uppercase text-slate-400">Current Labs ({labs.length})</h5>
                    {labs.map((l) => (
                      <div key={l.id} className="p-3 bg-[#070b14] border border-slate-800 rounded text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">Lab {l.number}: {l.title}</div>
                          <div className="text-[11px] text-slate-400">{l.category} · {l.difficulty}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Blogs Tab */}
              {activeTab === 'blogs' && (
                <div className="space-y-6">
                  {/* Add Blog Form */}
                  <form onSubmit={handleAddBlog} className="p-4 bg-[#070b14] border border-slate-800 rounded-lg space-y-3">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-cyan-400" />
                      <span>Publish New Technical Guide</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={newBlogTitle}
                      onChange={(e) => setNewBlogTitle(e.target.value)}
                      placeholder="Article Title (e.g. Wireshark TCP Windowing Analysis)..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                    <textarea
                      rows={2}
                      value={newBlogSummary}
                      onChange={(e) => setNewBlogSummary(e.target.value)}
                      placeholder="Brief excerpt / introduction..."
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded text-xs text-white"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs rounded transition-colors"
                    >
                      Publish Guide
                    </button>
                  </form>

                  {/* Current Blogs */}
                  <div className="space-y-2">
                    <h5 className="text-xs font-mono uppercase text-slate-400">Articles ({blogs.length})</h5>
                    {blogs.map((b) => (
                      <div key={b.id} className="p-3 bg-[#070b14] border border-slate-800 rounded text-xs flex justify-between items-center">
                        <div>
                          <div className="font-bold text-white">{b.title}</div>
                          <div className="text-[11px] text-slate-400">{b.category} · {b.date}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Settings / Reset / Backup Tab */}
              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <div className="p-4 bg-[#070b14] border border-slate-800 rounded-lg space-y-3">
                    <h4 className="text-xs font-mono uppercase text-white font-bold">Data Management</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Download a complete JSON snapshot of all labs, projects, certifications, and messages, or restore factory default data.
                    </p>
                    <div className="flex flex-wrap gap-3 pt-2">
                      <button
                        onClick={handleExportBackup}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium flex items-center gap-1.5 border border-slate-700"
                      >
                        <Download className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Export JSON Backup</span>
                      </button>

                      <button
                        onClick={handleResetData}
                        className="px-3 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-300 rounded text-xs font-medium flex items-center gap-1.5 border border-red-800/60"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Reset All Data to Defaults</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
