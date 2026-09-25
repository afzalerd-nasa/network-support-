import React, { useState } from 'react';
import { NetworkLab } from '../types/network';
import {
  Terminal,
  Layers,
  Copy,
  Check,
  CheckCircle2,
  AlertTriangle,
  Play,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
} from 'lucide-react';

interface LabShowcaseProps {
  labs: NetworkLab[];
}

export const LabShowcase: React.FC<LabShowcaseProps> = ({ labs }) => {
  const [selectedLab, setSelectedLab] = useState<NetworkLab>(labs[0] || {} as NetworkLab);
  const [activeTab, setActiveTab] = useState<'topology' | 'config' | 'cli_sim' | 'troubleshoot' | 'result'>('topology');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  // Interactive CLI Simulator State
  const [cliInput, setCliInput] = useState('');
  const [cliHistory, setCliHistory] = useState<string[]>([
    'Cisco IOS Software, ISR Software (X86_64_LINUX_IOSD-UNIVERSALK9-M), Version 16.9.4',
    'Technical Support: http://www.cisco.com/techsupport',
    'Compiled Thu 22-Aug-19 12:45 by prod_rel_team',
    '',
    'Switch> enable',
    'Switch#',
  ]);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCliSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cliInput.trim()) return;

    const cmd = cliInput.trim().toLowerCase();
    const newHistory = [...cliHistory, `Router# ${cliInput}`];

    if (cmd === 'clear') {
      setCliHistory(['Router#']);
      setCliInput('');
      return;
    }

    if (cmd.includes('show ip route')) {
      newHistory.push(
        'Codes: L - local, C - connected, S - static, R - RIP, M - mobile, B - BGP',
        '       D - EIGRP, EX - EIGRP external, O - OSPF, IA - OSPF inter area',
        'Gateway of last resort is 203.0.113.1 to network 0.0.0.0',
        '',
        'S*    0.0.0.0/0 [1/0] via 203.0.113.1',
        'C     192.168.10.0/24 is directly connected, GigabitEthernet0/0/0.10',
        'C     192.168.20.0/24 is directly connected, GigabitEthernet0/0/0.20',
        'O     10.0.0.0/30 [110/2] via 10.0.0.1, 00:14:22, GigabitEthernet0/0/1'
      );
    } else if (cmd.includes('show vlan') || cmd.includes('show vlan brief')) {
      newHistory.push(
        'VLAN Name                             Status    Ports',
        '---- -------------------------------- --------- -------------------------------',
        '1    default                          active    Fa0/3, Fa0/4, Fa0/5',
        '10   ENGINEERING                      active    Fa0/1',
        '20   SALES                            active    Fa0/2',
        '99   MANAGEMENT                       active    '
      );
    } else if (cmd.includes('show ip int') || cmd.includes('show ip interface brief')) {
      newHistory.push(
        'Interface              IP-Address      OK? Method Status                Protocol',
        'GigabitEthernet0/0/0   unassigned      YES unset  up                    up',
        'GigabitEthernet0/0/0.10 192.168.10.1   YES manual up                    up',
        'GigabitEthernet0/0/0.20 192.168.20.1   YES manual up                    up',
        'GigabitEthernet0/0/1   203.0.113.2     YES manual up                    up'
      );
    } else if (cmd.startsWith('ping')) {
      newHistory.push(
        'Type escape sequence to abort.',
        `Sending 5, 100-byte ICMP Echos to target, timeout is 2 seconds:`,
        '!!!!!',
        'Success rate is 100 percent (5/5), round-trip min/avg/max = 1/2/4 ms'
      );
    } else if (cmd.includes('show ip ospf neighbor')) {
      newHistory.push(
        'Neighbor ID     Pri   State           Dead Time   Address         Interface',
        '2.2.2.2           1   FULL/DR         00:00:36    10.0.0.2        GigabitEthernet0/0/1'
      );
    } else if (cmd.includes('show ip bgp summary')) {
      newHistory.push(
        'BGP router identifier 1.1.1.1, local AS number 65100',
        'Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd',
        '203.0.113.1     4        65200      35      38        3    0    0 00:24:15        1'
      );
    } else if (cmd.includes('show running-config') || cmd === 'sh run') {
      newHistory.push(
        'Building configuration...',
        'Current configuration : 1845 bytes',
        '!',
        'hostname Edge-Router-01',
        '!',
        'interface GigabitEthernet0/0/0',
        ' no ip address',
        ' no shutdown',
        '!',
        'interface GigabitEthernet0/0/0.10',
        ' encapsulation dot1Q 10',
        ' ip address 192.168.10.1 255.255.255.0'
      );
    } else {
      newHistory.push(
        `% Command recognized. Executing in simulated environment: "${cmd}".`,
        'Type "show ip route", "show vlan brief", "show ip int brief", "ping <ip>", or "clear".'
      );
    }

    setCliHistory(newHistory);
    setCliInput('');
  };

  const runQuickCommand = (commandText: string) => {
    setCliInput(commandText);
  };

  return (
    <section id="labs" className="py-20 bg-[#060a14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              HANDS-ON LABORATORY
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
              Network Engineering Labs &amp; Simulator
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Real-world Cisco and security lab implementations covering topology, CLI configuration, live verification, and systematic troubleshooting.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-lg">
              <Terminal className="w-3.5 h-3.5 text-cyan-400" />
              <span>10 PRACTICAL LABS PUBLISHED</span>
            </span>
          </div>
        </div>

        {/* Lab Selection Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2 mb-8">
          {labs.map((lab) => {
            const isSelected = selectedLab.id === lab.id;
            return (
              <button
                key={lab.id}
                onClick={() => setSelectedLab(lab)}
                className={`p-2.5 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-[#090f1d] border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[10px] font-mono text-cyan-400">LAB {lab.number}</div>
                <div className="text-xs font-bold text-white truncate">{lab.category}</div>
                <div className="text-[10px] text-slate-400 truncate">{lab.difficulty}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Lab Workstation Box */}
        <div className="bg-[#090f1d] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
          {/* Header Bar */}
          <div className="p-6 border-b border-slate-800 bg-[#0b1222] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-1">
                <span className="text-cyan-400 font-bold">LAB {selectedLab.number}</span>
                <span>·</span>
                <span>Category: {selectedLab.category}</span>
                <span>·</span>
                <span>Est. Time: {selectedLab.estimatedTime}</span>
                <span>·</span>
                <span className="text-emerald-400">{selectedLab.difficulty}</span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedLab.title}</h3>
            </div>

            {/* Interactive Workflow Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              <button
                onClick={() => setActiveTab('topology')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'topology'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                1. Topology
              </button>
              <button
                onClick={() => setActiveTab('config')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'config'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                2. Configuration
              </button>
              <button
                onClick={() => setActiveTab('cli_sim')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1 ${
                  activeTab === 'cli_sim'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-cyan-400 hover:text-white'
                }`}
              >
                <Terminal className="w-3.5 h-3.5" />
                <span>3. CLI Simulator</span>
              </button>
              <button
                onClick={() => setActiveTab('troubleshoot')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'troubleshoot'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                4. Troubleshooting
              </button>
              <button
                onClick={() => setActiveTab('result')}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  activeTab === 'result'
                    ? 'bg-cyan-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                5. Result
              </button>
            </div>
          </div>

          {/* Tab Content Panes */}
          <div className="p-6">
            {/* 1. Topology & Objective */}
            {activeTab === 'topology' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    Lab Objective
                  </h4>
                  <p className="text-sm text-slate-300 leading-relaxed bg-[#070b14] border border-slate-800 p-4 rounded-lg">
                    {selectedLab.objective}
                  </p>
                </div>

                {/* Topology Schematic Diagram */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    Topology Architecture &amp; Interfaces
                  </h4>
                  <div className="bg-[#070b14] border border-slate-800 rounded-lg p-6 text-center space-y-4">
                    <p className="text-xs font-mono text-slate-400">
                      {selectedLab.topologySummary}
                    </p>

                    {/* Nodes Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                      {selectedLab.devices.map((dev) => (
                        <div
                          key={dev.name}
                          className="bg-slate-900/90 border border-slate-800 p-3 rounded-lg text-left"
                        >
                          <div className="text-xs font-bold text-white font-mono">{dev.name}</div>
                          <div className="text-[11px] text-cyan-400">{dev.model}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{dev.role}</div>
                          <div className="text-[10px] font-mono text-slate-500 mt-1 truncate">
                            {dev.interfaces}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('config')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Proceed to Configuration Commands</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 2. Configuration Commands */}
            {activeTab === 'config' && (
              <div className="space-y-6">
                {selectedLab.configs.map((snippet, idx) => {
                  const commandBlock = snippet.commands.join('\n');
                  return (
                    <div
                      key={idx}
                      className="border border-slate-800 rounded-lg overflow-hidden bg-[#070b14]"
                    >
                      <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                          <span className="text-xs font-bold text-white font-mono">
                            {snippet.device} ({snippet.mode})
                          </span>
                        </div>
                        <button
                          onClick={() => copyToClipboard(commandBlock, idx)}
                          className="px-2.5 py-1 text-[11px] font-mono font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors flex items-center gap-1"
                        >
                          {copiedIndex === idx ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-400" />
                              <span className="text-emerald-400">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Copy CLI Commands</span>
                            </>
                          )}
                        </button>
                      </div>

                      <pre className="p-4 text-xs font-mono text-cyan-300 overflow-x-auto leading-relaxed selection:bg-cyan-900">
                        {commandBlock}
                      </pre>

                      <div className="px-4 py-2.5 bg-slate-900/40 border-t border-slate-800/80 text-xs text-slate-400">
                        <strong>Explanation: </strong> {snippet.explanation}
                      </div>
                    </div>
                  );
                })}

                <div className="flex justify-end pt-2">
                  <button
                    onClick={() => setActiveTab('cli_sim')}
                    className="px-4 py-2 text-xs font-semibold text-white bg-cyan-600 hover:bg-cyan-500 rounded-lg transition-colors flex items-center gap-1.5"
                  >
                    <span>Test in Interactive CLI Simulator</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* 3. Interactive CLI Terminal Simulator */}
            {activeTab === 'cli_sim' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-slate-400 font-mono">
                    INTERACTIVE CISCO IOS TERMINAL — Run real CLI verification commands
                  </div>
                  <button
                    onClick={() => setCliHistory(['Router> enable', 'Router#'])}
                    className="text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Terminal</span>
                  </button>
                </div>

                {/* Quick command shortcut chips */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs font-mono">
                  <span className="text-slate-500 text-[11px]">Quick Run:</span>
                  <button
                    onClick={() => runQuickCommand('show ip route')}
                    className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 hover:bg-slate-700"
                  >
                    show ip route
                  </button>
                  <button
                    onClick={() => runQuickCommand('show vlan brief')}
                    className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 hover:bg-slate-700"
                  >
                    show vlan brief
                  </button>
                  <button
                    onClick={() => runQuickCommand('show ip interface brief')}
                    className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 hover:bg-slate-700"
                  >
                    show ip interface brief
                  </button>
                  <button
                    onClick={() => runQuickCommand('show ip ospf neighbor')}
                    className="px-2 py-0.5 bg-slate-800 text-cyan-300 rounded border border-slate-700 hover:bg-slate-700"
                  >
                    show ip ospf neighbor
                  </button>
                  <button
                    onClick={() => runQuickCommand('ping 192.168.10.1')}
                    className="px-2 py-0.5 bg-slate-800 text-emerald-300 rounded border border-slate-700 hover:bg-slate-700"
                  >
                    ping 192.168.10.1
                  </button>
                </div>

                {/* Simulated Terminal Window */}
                <div className="bg-[#050811] border border-slate-800 rounded-lg p-4 font-mono text-xs text-slate-200 min-h-[300px] flex flex-col justify-between shadow-inner">
                  <div className="space-y-1 overflow-y-auto max-h-[350px]">
                    {cliHistory.map((line, idx) => (
                      <div
                        key={idx}
                        className={
                          line.startsWith('Router#') || line.startsWith('Switch#')
                            ? 'text-cyan-400 font-bold'
                            : line.startsWith('%')
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }
                      >
                        {line}
                      </div>
                    ))}
                  </div>

                  {/* Terminal Input Line */}
                  <form onSubmit={handleCliSubmit} className="mt-4 pt-2 border-t border-slate-800 flex items-center gap-2">
                    <span className="text-cyan-400 font-bold select-none">Router#</span>
                    <input
                      type="text"
                      value={cliInput}
                      onChange={(e) => setCliInput(e.target.value)}
                      placeholder="Type command (e.g. show ip route, ping, show vlan brief)..."
                      className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs placeholder:text-slate-600"
                      autoFocus
                    />
                    <button
                      type="submit"
                      className="px-3 py-1 bg-cyan-700 hover:bg-cyan-600 text-white rounded text-xs font-mono"
                    >
                      Execute
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* 4. Troubleshooting Steps */}
            {activeTab === 'troubleshoot' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span>Common Failure Modes &amp; Systematic Diagnostics</span>
                  </h4>
                  <div className="space-y-3">
                    {selectedLab.troubleshootingSteps.map((step, idx) => (
                      <div
                        key={idx}
                        className="bg-[#070b14] border border-slate-800 p-4 rounded-lg flex items-start gap-3 text-xs text-slate-300"
                      >
                        <span className="w-5 h-5 rounded-full bg-slate-800 flex items-center justify-center font-mono text-cyan-400 text-[11px] shrink-0">
                          {idx + 1}
                        </span>
                        <p className="leading-relaxed">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Verification Checklist */}
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-wider text-cyan-400 mb-2">
                    Standard Verification CLI Outputs
                  </h4>
                  <div className="space-y-4">
                    {selectedLab.verificationCommands.map((vCmd, idx) => (
                      <div
                        key={idx}
                        className="bg-[#070b14] border border-slate-800 rounded-lg overflow-hidden"
                      >
                        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 text-xs font-mono text-cyan-400">
                          {vCmd.command} <span className="text-slate-500">· {vCmd.description}</span>
                        </div>
                        <pre className="p-4 text-[11px] font-mono text-slate-300 overflow-x-auto leading-relaxed">
                          {vCmd.sampleOutput}
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* 5. Result */}
            {activeTab === 'result' && (
              <div className="space-y-6">
                <div className="bg-emerald-950/20 border border-emerald-800/60 rounded-xl p-6 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Lab Implementation Verified &amp; Production-Ready</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {selectedLab.expectedResult}
                  </p>
                </div>

                <div className="border border-slate-800 bg-[#070b14] p-5 rounded-xl space-y-3">
                  <div className="text-xs font-semibold text-white">Engineering Takeaways:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-400">
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="text-cyan-400 font-semibold mb-1">Layer 2 Isolation</div>
                      <div>Eliminated broadcast cross-talk and enhanced internal security posture.</div>
                    </div>
                    <div className="p-3 bg-slate-900/60 rounded-lg border border-slate-800">
                      <div className="text-cyan-400 font-semibold mb-1">Deterministic Convergence</div>
                      <div>Spanning Tree &amp; routing timers tuned for immediate link failover.</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
