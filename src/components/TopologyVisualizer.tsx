import React, { useState } from 'react';
import { INITIAL_TOPOLOGY_DEVICES } from '../data/initialData';
import { TopologyDevice } from '../types/network';
import {
  Globe,
  Shield,
  Server,
  Layers,
  Monitor,
  Wifi,
  Database,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Activity,
  Terminal,
  Info,
} from 'lucide-react';

export const TopologyVisualizer: React.FC = () => {
  const [selectedDevice, setSelectedDevice] = useState<TopologyDevice>(
    INITIAL_TOPOLOGY_DEVICES[2] // Cisco Core Router by default
  );
  const [packetFlowState, setPacketFlowState] = useState<{
    running: boolean;
    stage: number;
    log: string[];
    source: string;
    destination: string;
  }>({
    running: false,
    stage: 0,
    log: ['System idle. Select a test flow to simulate packet traversal.'],
    source: 'vlan10',
    destination: 'vlan20',
  });

  const getDeviceIcon = (type: TopologyDevice['type']) => {
    switch (type) {
      case 'internet':
        return Globe;
      case 'firewall':
        return Shield;
      case 'router':
        return Server;
      case 'core_switch':
        return Layers;
      case 'server':
        return Database;
      case 'pc':
        return Monitor;
      case 'wifi':
        return Wifi;
      default:
        return Server;
    }
  };

  const runPacketSimulation = (destType: 'vlan20' | 'internet') => {
    if (packetFlowState.running) return;

    const isInternet = destType === 'internet';
    setPacketFlowState({
      running: true,
      stage: 1,
      source: 'Workstation PC (192.168.10.15)',
      destination: isInternet ? 'Internet Gateway (8.8.8.8)' : 'SAP Database (192.168.20.10)',
      log: [
        `[00.00ms] [TX] Workstation-01 sends ICMP Echo Request (Src: 192.168.10.15, Dst: ${
          isInternet ? '8.8.8.8' : '192.168.20.10'
        })`,
        `[00.12ms] [ARP] Hit default gateway SVI Vlan 10 MAC on Multilayer Switch.`,
      ],
    });

    setTimeout(() => {
      setPacketFlowState((prev) => ({
        ...prev,
        stage: 2,
        log: [
          ...prev.log,
          `[00.45ms] [SW-CORE] SVI routing lookup: ${
            isInternet
              ? 'Route via Default Gateway 10.0.0.2 (RTR-CORE)'
              : 'Direct wire-speed SVI routing to VLAN 20 (SERVERS)'
          }`,
        ],
      }));
    }, 700);

    setTimeout(() => {
      setPacketFlowState((prev) => ({
        ...prev,
        stage: 3,
        log: [
          ...prev.log,
          isInternet
            ? `[00.89ms] [RTR-CORE] Forwarding through Gi0/0/0 to Palo Alto NGFW (10.0.0.1)`
            : `[00.78ms] [SW-CORE] Packet switched to Gi1/0/2 untagged VLAN 20 interface.`,
        ],
      }));
    }, 1400);

    setTimeout(() => {
      setPacketFlowState((prev) => ({
        ...prev,
        stage: 4,
        log: [
          ...prev.log,
          isInternet
            ? `[01.20ms] [PALO-ALTO] App-ID: web-browsing/dns. NAT Overload (Inside Local 192.168.10.15 -> Inside Global 203.0.113.2). Security Rule: ALLOW_OUTBOUND.`
            : `[00.95ms] [SAP-SRV] Host 192.168.20.10 received ICMP Echo Request and generates Echo Reply.`,
        ],
      }));
    }, 2100);

    setTimeout(() => {
      setPacketFlowState((prev) => ({
        ...prev,
        stage: 5,
        running: false,
        log: [
          ...prev.log,
          `[01.85ms] [SUCCESS] ICMP Echo Reply received. 0% packet loss, RTT = 1.85ms. Flow completed.`,
        ],
      }));
    }, 2800);
  };

  return (
    <section id="topology" className="py-20 bg-[#070b14] border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest">
              ENTERPRISE ARCHITECTURE
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white mt-1">
              Interactive Network Topology Visualizer
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Click any device in the hierarchy below to inspect interfaces, IP addressing, routing protocols, and simulate live packet flows.
            </p>
          </div>

          {/* Quick Flow Trigger Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => runPacketSimulation('vlan20')}
              disabled={packetFlowState.running}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3 h-3 text-cyan-400" />
              <span>Simulate VLAN 10 ➔ VLAN 20</span>
            </button>
            <button
              onClick={() => runPacketSimulation('internet')}
              disabled={packetFlowState.running}
              className="px-3 py-1.5 text-xs font-semibold text-cyan-300 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 rounded-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
            >
              <Play className="w-3 h-3 text-emerald-400" />
              <span>Simulate VLAN 10 ➔ Internet</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left / Center: Interactive SVG / HTML Topology Tree Canvas */}
          <div className="lg:col-span-7 bg-[#090f1d] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center space-y-6">
              {/* Level 1: Internet Edge */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[0])}
                  className={`group relative p-3 rounded-xl border transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[0].id
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Tier-1 Internet Carrier</div>
                      <div className="text-[10px] font-mono text-slate-400">203.0.113.1 (eBGP)</div>
                    </div>
                  </div>
                </button>

                {/* Vertical Cable Link */}
                <div className="w-0.5 h-6 bg-slate-700 relative">
                  {packetFlowState.running && packetFlowState.stage >= 4 && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 -left-[3px] absolute animate-ping" />
                  )}
                </div>
              </div>

              {/* Level 2: Next-Gen Firewall */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[1])}
                  className={`group relative p-3 rounded-xl border transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[1].id
                      ? 'bg-red-950/60 border-red-400 shadow-[0_0_15px_rgba(239,68,68,0.3)]'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-red-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Palo Alto PA-3220 NGFW</div>
                      <div className="text-[10px] font-mono text-slate-400">Eth1/1: 203.0.113.2 · Eth1/2: 10.0.0.1</div>
                    </div>
                  </div>
                </button>

                {/* Vertical Cable Link */}
                <div className="w-0.5 h-6 bg-slate-700 relative">
                  {packetFlowState.running && packetFlowState.stage >= 3 && (
                    <div className="w-2 h-2 rounded-full bg-emerald-400 -left-[3px] absolute animate-ping" />
                  )}
                </div>
              </div>

              {/* Level 3: Cisco Core Router */}
              <div className="flex flex-col items-center">
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[2])}
                  className={`group relative p-3 rounded-xl border transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[2].id
                      ? 'bg-blue-950/70 border-blue-400 shadow-[0_0_15px_rgba(59,130,246,0.3)]'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Cisco Core Router (ISR 4431)</div>
                      <div className="text-[10px] font-mono text-slate-400">Gi0/0/0 (10.0.0.2) · OSPF Area 0</div>
                    </div>
                  </div>
                </button>

                {/* Vertical Cable Link */}
                <div className="w-0.5 h-6 bg-slate-700 relative">
                  {packetFlowState.running && packetFlowState.stage >= 2 && (
                    <div className="w-2 h-2 rounded-full bg-cyan-400 -left-[3px] absolute animate-ping" />
                  )}
                </div>
              </div>

              {/* Level 4: Core Switch */}
              <div className="flex flex-col items-center w-full">
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[3])}
                  className={`group relative p-3 rounded-xl border transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[3].id
                      ? 'bg-emerald-950/70 border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-900/90 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Layers className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform" />
                    <div className="text-left">
                      <div className="text-xs font-bold text-white">Multilayer Core Switch (Catalyst 3850)</div>
                      <div className="text-[10px] font-mono text-slate-400">SVIs 10, 20, 30 · Rapid-PVST+ Root</div>
                    </div>
                  </div>
                </button>

                {/* Branching Fan-Out Links to VLANs */}
                <div className="w-full max-w-md h-8 flex justify-between relative mt-1">
                  <div className="w-1/3 border-b-2 border-l-2 border-slate-700 rounded-bl-lg" />
                  <div className="w-0.5 h-8 bg-slate-700" />
                  <div className="w-1/3 border-b-2 border-r-2 border-slate-700 rounded-br-lg" />
                </div>
              </div>

              {/* Level 5: VLAN Segments (Workstations, Servers, Wi-Fi) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full">
                {/* VLAN 10: PCs */}
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[4])}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[4].id
                      ? 'bg-cyan-950/60 border-cyan-400 shadow-md'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Monitor className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white">VLAN 10</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">Workstations</div>
                  <div className="text-[10px] font-mono text-slate-400">192.168.10.0/24</div>
                </button>

                {/* VLAN 20: Servers */}
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[5])}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[5].id
                      ? 'bg-purple-950/60 border-purple-400 shadow-md'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Database className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-bold text-white">VLAN 20</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">Datacenter &amp; SAP</div>
                  <div className="text-[10px] font-mono text-slate-400">192.168.20.0/24</div>
                </button>

                {/* VLAN 30: Wi-Fi */}
                <button
                  onClick={() => setSelectedDevice(INITIAL_TOPOLOGY_DEVICES[6])}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDevice.id === INITIAL_TOPOLOGY_DEVICES[6].id
                      ? 'bg-amber-950/60 border-amber-400 shadow-md'
                      : 'bg-slate-900/90 border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <Wifi className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold text-white">VLAN 30</span>
                  </div>
                  <div className="text-[11px] text-slate-300 font-medium">Enterprise Wi-Fi</div>
                  <div className="text-[10px] font-mono text-slate-400">192.168.30.0/24</div>
                </button>
              </div>
            </div>

            {/* Packet Simulation Console Log */}
            <div className="mt-6 pt-4 border-t border-slate-800 font-mono text-[11px] bg-[#060a14] rounded-lg p-3 text-slate-300 space-y-1">
              <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase pb-1 border-b border-slate-800">
                <span className="flex items-center gap-1 text-cyan-400">
                  <Terminal className="w-3 h-3" /> Packet Inspection Log
                </span>
                <span>{packetFlowState.running ? 'TRANSMITTING...' : 'IDLE'}</span>
              </div>
              <div className="max-h-24 overflow-y-auto space-y-1">
                {packetFlowState.log.map((line, idx) => (
                  <div key={idx} className="leading-tight">
                    {line}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Device Inspector Panel */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#0b1222] border border-slate-700/80 rounded-xl p-6 shadow-xl space-y-5">
              <div className="flex items-start justify-between border-b border-slate-800 pb-4">
                <div>
                  <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider">
                    DEVICE INSPECTOR
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedDevice.name}</h3>
                  <p className="text-xs text-slate-400">{selectedDevice.details.model}</p>
                </div>
                <span className="px-2 py-0.5 text-[11px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                  {selectedDevice.status}
                </span>
              </div>

              {/* Technical Specifications Matrix */}
              <div className="space-y-2.5 text-xs font-mono">
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">IP Address:</span>
                  <span className="text-white font-semibold">{selectedDevice.ipAddress}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Subnet Mask:</span>
                  <span className="text-slate-300">{selectedDevice.subnetMask}</span>
                </div>
                {selectedDevice.defaultGateway && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">Default Gateway:</span>
                    <span className="text-cyan-400">{selectedDevice.defaultGateway}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Primary Interface:</span>
                  <span className="text-slate-300">{selectedDevice.primaryInterface}</span>
                </div>
                {selectedDevice.vlan && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">VLAN ID / Tag:</span>
                    <span className="text-emerald-400 font-semibold">{selectedDevice.vlan}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Routing Protocol:</span>
                  <span className="text-cyan-400">{selectedDevice.routingProtocol}</span>
                </div>
                {selectedDevice.details.macAddress && (
                  <div className="flex justify-between py-1 border-b border-slate-800/60">
                    <span className="text-slate-400">MAC Address:</span>
                    <span className="text-slate-400">{selectedDevice.details.macAddress}</span>
                  </div>
                )}
                <div className="flex justify-between py-1 border-b border-slate-800/60">
                  <span className="text-slate-400">Uptime:</span>
                  <span className="text-slate-400">{selectedDevice.details.uptime}</span>
                </div>
              </div>

              {/* Description */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1">
                  Architecture Role
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {selectedDevice.details.description}
                </p>
              </div>

              {/* Open Ports & Services */}
              {selectedDevice.details.openPorts && (
                <div className="pt-2 border-t border-slate-800">
                  <div className="text-[11px] font-semibold text-slate-300 uppercase tracking-wide mb-1.5">
                    Active Protocols / Listening Ports
                  </div>
                  <div className="flex flex-wrap gap-1.5 font-mono text-[11px]">
                    {selectedDevice.details.openPorts.map((port) => (
                      <span
                        key={port}
                        className="px-2 py-0.5 bg-slate-800/80 border border-slate-700 text-cyan-300 rounded"
                      >
                        {port}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
