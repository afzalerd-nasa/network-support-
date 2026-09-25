export interface LabConfigSnippet {
  device: string;
  mode: string;
  commands: string[];
  explanation: string;
}

export interface NetworkLab {
  id: string;
  number: number;
  title: string;
  category: 'Routing' | 'Switching' | 'Security' | 'Services' | 'VPN';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedTime: string;
  objective: string;
  topologySummary: string;
  devices: {
    name: string;
    model: string;
    role: string;
    interfaces: string;
  }[];
  configs: LabConfigSnippet[];
  verificationCommands: {
    command: string;
    description: string;
    sampleOutput: string;
  }[];
  troubleshootingSteps: string[];
  expectedResult: string;
}

export interface NetworkProject {
  id: string;
  title: string;
  category: 'Enterprise LAN' | 'WAN & Routing' | 'Network Security' | 'Linux & Cloud' | 'Enterprise ERP';
  period: string;
  role: string;
  summary: string;
  technologies: string[];
  hardwareUsed: string[];
  challenges: string[];
  solution: string[];
  results: {
    metric: string;
    label: string;
  }[];
  architectureSummary: string;
}

export interface TroubleshootingItem {
  id: string;
  category: 'Routing' | 'VLAN' | 'DHCP' | 'DNS' | 'Firewall' | 'Internet' | 'Linux' | 'Windows';
  title: string;
  symptom: string;
  rootCauses: string[];
  steps: string[];
  diagnosticCommands: {
    cmd: string;
    outputNote: string;
  }[];
  resolutionSummary: string;
}

export interface CommandItem {
  id: string;
  platform: 'Cisco' | 'Linux' | 'Palo Alto' | 'Windows';
  category: 'Interface & IP' | 'Routing & Tables' | 'Switching & VLAN' | 'Diagnostics & Packet Flow' | 'Security & ACL';
  command: string;
  description: string;
  parametersExplanation?: string;
  exampleOutput?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  category: string;
  date: string;
  readTime: string;
  summary: string;
  tags: string[];
  content: string;
}

export interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialId: string;
  status: 'Active' | 'Verified';
  verifyUrl: string;
  skills: string[];
  description: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export interface TopologyDevice {
  id: string;
  name: string;
  type: 'router' | 'firewall' | 'core_switch' | 'access_switch' | 'server' | 'pc' | 'wifi' | 'internet';
  ipAddress: string;
  subnetMask: string;
  defaultGateway?: string;
  primaryInterface: string;
  vlan?: string;
  routingProtocol: string;
  status: 'UP / UP' | 'STANDBY' | 'FILTERING';
  details: {
    model: string;
    uptime: string;
    macAddress?: string;
    activeSessions?: number;
    description: string;
    openPorts?: string[];
  };
}
