import {
  NetworkLab,
  NetworkProject,
  TroubleshootingItem,
  CommandItem,
  BlogPost,
  Certification,
  TopologyDevice,
} from '../types/network';

export const INITIAL_LABS: NetworkLab[] = [
  {
    id: 'lab-1',
    number: 1,
    title: 'VLAN Configuration & Access Ports',
    category: 'Switching',
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    objective: 'Segment broadcast domains into isolated VLANs (VLAN 10 Engineering & VLAN 20 Sales) on a Cisco Catalyst switch, configure 802.1Q trunking to an upstream switch, and verify port allocation.',
    topologySummary: 'Catalyst 2960 Switch connecting PC-1 (Fa0/1 in VLAN 10), PC-2 (Fa0/2 in VLAN 20), with Gig0/1 trunk uplink to Distribution Switch.',
    devices: [
      { name: 'SW-ACCESS-01', model: 'Cisco Catalyst 2960-X', role: 'Access Layer Switch', interfaces: 'Fa0/1 - Fa0/24 (Access), Gi0/1 (Trunk)' },
      { name: 'PC-1', model: 'Host Workstation', role: 'Engineering Dept', interfaces: 'Eth0: 192.168.10.10/24' },
      { name: 'PC-2', model: 'Host Workstation', role: 'Sales Dept', interfaces: 'Eth0: 192.168.20.10/24' },
    ],
    configs: [
      {
        device: 'SW-ACCESS-01',
        mode: 'Global Configuration Mode',
        commands: [
          'enable',
          'configure terminal',
          'vlan 10',
          ' name ENGINEERING',
          'vlan 20',
          ' name SALES',
          'exit',
          'interface FastEthernet0/1',
          ' description Workstation Eng PC-1',
          ' switchport mode access',
          ' switchport access vlan 10',
          ' spanning-tree portfast',
          ' no shutdown',
          'exit',
          'interface FastEthernet0/2',
          ' description Workstation Sales PC-2',
          ' switchport mode access',
          ' switchport access vlan 20',
          ' spanning-tree portfast',
          ' no shutdown',
          'exit',
          'interface GigabitEthernet0/1',
          ' description Trunk Uplink to Core',
          ' switchport trunk encapsulation dot1q',
          ' switchport mode trunk',
          ' switchport trunk allowed vlan 10,20,99',
          ' switchport trunk native vlan 99',
          ' no shutdown',
          'end',
          'write memory'
        ],
        explanation: 'Creates VLAN databases, assigns access ports with Spanning Tree Portfast enabled for immediate forwarding, and configures an 802.1Q trunk uplink tagged with allowed VLANs and secure native VLAN 99.'
      }
    ],
    verificationCommands: [
      {
        command: 'show vlan brief',
        description: 'Verifies active VLAN IDs, names, and assigned access interfaces.',
        sampleOutput: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/3, Fa0/4, Fa0/5, Fa0/6
10   ENGINEERING                      active    Fa0/1
20   SALES                            active    Fa0/2
99   MANAGEMENT                       active    `
      },
      {
        command: 'show interfaces trunk',
        description: 'Confirms 802.1Q encapsulation, trunking status, native VLAN, and allowed VLAN range.',
        sampleOutput: `Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      99

Port        Vlans allowed on trunk
Gi0/1       10,20,99`
      }
    ],
    troubleshootingSteps: [
      'Issue: End hosts cannot ping devices in the same VLAN on neighboring switch. Check: "show interfaces trunk" to confirm uplink is actively in trunking state, not access.',
      'Check native VLAN mismatch syslog alerts (%CDP-4-NATIVE_VLAN_MISMATCH). Ensure both sides agree on Native VLAN 99.',
      'Verify port status is connected using "show ip interface brief" or "show interfaces Fa0/1 status".'
    ],
    expectedResult: 'Broadcast traffic is strictly isolated between VLAN 10 and VLAN 20. Hosts in the same VLAN communicate over the trunk, while inter-VLAN leakage is prevented without a Layer 3 routing engine.'
  },
  {
    id: 'lab-2',
    number: 2,
    title: 'Inter-VLAN Routing (Router-on-a-Stick & SVI)',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    objective: 'Configure routing between isolated VLANs using both Router-on-a-Stick sub-interfaces on Cisco ISR 4331 and Switched Virtual Interfaces (SVI) on a Catalyst 3850 Multilayer Switch.',
    topologySummary: 'Cisco 4331 Router (Gi0/0/0) connected to Catalyst 3850 Switch (Gi1/0/1) transporting sub-interfaces Gi0/0/0.10 and Gi0/0/0.20.',
    devices: [
      { name: 'RTR-CORE-01', model: 'Cisco ISR 4331', role: 'Default Gateway Router', interfaces: 'Gi0/0/0.10 (192.168.10.1/24), Gi0/0/0.20 (192.168.20.1/24)' },
      { name: 'SW-DIST-01', model: 'Cisco Catalyst 3850', role: 'Distribution / SVI Switch', interfaces: 'Vlan 10 SVI, Vlan 20 SVI' }
    ],
    configs: [
      {
        device: 'RTR-CORE-01',
        mode: 'Router Configuration',
        commands: [
          'enable',
          'configure terminal',
          'interface GigabitEthernet0/0/0',
          ' description Physical Trunk link to SW-DIST-01',
          ' no ip address',
          ' no shutdown',
          'exit',
          'interface GigabitEthernet0/0/0.10',
          ' description Default Gateway for VLAN 10',
          ' encapsulation dot1Q 10',
          ' ip address 192.168.10.1 255.255.255.0',
          'exit',
          'interface GigabitEthernet0/0/0.20',
          ' description Default Gateway for VLAN 20',
          ' encapsulation dot1Q 20',
          ' ip address 192.168.20.1 255.255.255.0',
          'end',
          'write memory'
        ],
        explanation: 'Enables sub-interfaces with IEEE 802.1Q dot1Q tagging matching the client VLAN IDs, acting as default gateways for each subnet.'
      },
      {
        device: 'SW-DIST-01 (Alternative SVI Method)',
        mode: 'Multilayer Switch SVI Config',
        commands: [
          'enable',
          'configure terminal',
          'ip routing',
          'interface Vlan10',
          ' ip address 192.168.10.1 255.255.255.0',
          ' no shutdown',
          'interface Vlan20',
          ' ip address 192.168.20.1 255.255.255.0',
          ' no shutdown',
          'end'
        ],
        explanation: 'Enables hardware-level Layer 3 IP routing inside the switch and creates Switched Virtual Interfaces (SVIs) for wire-speed inter-VLAN forwarding.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip route connected',
        description: 'Confirms connected routes for both VLAN subnets exist in the routing table.',
        sampleOutput: `C    192.168.10.0/24 is directly connected, GigabitEthernet0/0/0.10
C    192.168.20.0/24 is directly connected, GigabitEthernet0/0/0.20`
      },
      {
        command: 'ping 192.168.20.10 source 192.168.10.1',
        description: 'Tests ICMP reachability from router gateway to host across VLAN boundaries.',
        sampleOutput: `Type escape sequence to abort.
Sending 5, 100-byte ICMP Echos to 192.168.20.10, timeout is 2 seconds:
.!!!!
Success rate is 80 percent (4/5), round-trip min/avg/max = 1/2/3 ms`
      }
    ],
    troubleshootingSteps: [
      'Ensure "ip routing" is activated on multilayer switches; without it, SVIs stay up but packet forwarding between SVIs fails.',
      'Check that dot1Q tag number matches the switch VLAN ID exactly (encapsulation dot1Q <vlan-id>).',
      'Verify the physical base interface ("Gi0/0/0") is administratively UP ("no shutdown").'
    ],
    expectedResult: 'Hosts in VLAN 10 (192.168.10.10) can successfully ping hosts in VLAN 20 (192.168.20.10) via the routed gateway.'
  },
  {
    id: 'lab-3',
    number: 3,
    title: 'Static Routing & Default Gateway Implementation',
    category: 'Routing',
    difficulty: 'Beginner',
    estimatedTime: '35 mins',
    objective: 'Implement explicit IPv4 static routes, floating static backup routes with customized administrative distances, and default quad-zero routes (0.0.0.0/0) towards the ISP edge.',
    topologySummary: 'Branch Router (R1) dual-homed to HQ Router (R2) via Primary Serial link (10.1.12.0/30) and Backup Ethernet link (10.1.21.0/30).',
    devices: [
      { name: 'R1-BRANCH', model: 'Cisco 2911', role: 'Branch Edge Router', interfaces: 'Gi0/0 (LAN: 172.16.1.1/24), Gi0/1 (ISP: 203.0.113.2/30), Gi0/2 (Backup)' },
      { name: 'R2-HQ', model: 'Cisco 4431', role: 'Headquarters Router', interfaces: 'Gi0/0 (LAN: 172.16.2.1/24), Gi0/1 (WAN: 203.0.113.1/30)' }
    ],
    configs: [
      {
        device: 'R1-BRANCH',
        mode: 'Global Config',
        commands: [
          'enable',
          'configure terminal',
          'ip route 172.16.2.0 255.255.255.0 203.0.113.1',
          'ip route 172.16.2.0 255.255.255.0 10.1.21.2 130',
          'ip route 0.0.0.0 0.0.0.0 203.0.113.1',
          'end',
          'write memory'
        ],
        explanation: 'Defines a primary static route to HQ LAN via next-hop 203.0.113.1 (AD 1), a floating backup static route with Administrative Distance 130, and a gateway of last resort.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip route static',
        description: 'Displays active static entries in routing table.',
        sampleOutput: `S*    0.0.0.0/0 [1/0] via 203.0.113.1
S     172.16.2.0/24 [1/0] via 203.0.113.1`
      },
      {
        command: 'traceroute 172.16.2.10',
        description: 'Traces path across hops to prove traffic exits through the primary path.',
        sampleOutput: `Tracing the route to 172.16.2.10
  1 203.0.113.1 2 msec 1 msec 1 msec
  2 172.16.2.10 3 msec 2 msec 2 msec`
      }
    ],
    troubleshootingSteps: [
      'Verify next-hop IP address is directly reachable via connected ARP/route lookup.',
      'If floating backup route appears in routing table simultaneously, ensure backup route has higher AD than primary.',
      'Check return path routing on R2-HQ; static routing requires symmetrical route definitions in both directions.'
    ],
    expectedResult: 'Traffic flows smoothly along primary next-hop. Upon shutting down primary link, routing table automatically installs the AD 130 floating backup route.'
  },
  {
    id: 'lab-4',
    number: 4,
    title: 'RIPv2 Routing Protocol Configuration',
    category: 'Routing',
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    objective: 'Configure RIP Version 2 across a multi-hop enterprise backbone, disable classful auto-summarization, configure passive interfaces on host subnets, and propagate default routes.',
    topologySummary: 'Three routers (R1, R2, R3) in a linear topology exchanging RIPv2 updates with split-horizon loop prevention.',
    devices: [
      { name: 'R1', model: 'Cisco 2901', role: 'Site A Edge', interfaces: 'Gi0/0 (LAN: 10.10.1.0/24), Gi0/1 (WAN: 10.0.12.1/30)' },
      { name: 'R2', model: 'Cisco 2901', role: 'Transit Hub', interfaces: 'Gi0/0 (WAN: 10.0.12.2/30), Gi0/1 (WAN: 10.0.23.1/30)' },
      { name: 'R3', model: 'Cisco 2901', role: 'Site B Edge', interfaces: 'Gi0/0 (WAN: 10.0.23.2/30), Gi0/1 (LAN: 10.20.1.0/24)' }
    ],
    configs: [
      {
        device: 'R1',
        mode: 'Router RIP Mode',
        commands: [
          'enable',
          'configure terminal',
          'router rip',
          ' version 2',
          ' no auto-summary',
          ' network 10.0.0.0',
          ' passive-interface GigabitEthernet0/0',
          ' default-information originate',
          'end',
          'write memory'
        ],
        explanation: 'Enables RIPv2 for CIDR subnet mask propagation, disables classful auto-summary, prevents broadcast flooding into LAN host segment, and originates default route.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip protocols',
        description: 'Verifies RIP version, routing timers (30/180/180/240), passive interfaces, and advertised networks.',
        sampleOutput: `Routing Protocol is "rip"
  Sending updates every 30 seconds, next due in 14 seconds
  Invalid after 180 seconds, hold down 180, flushed after 240
  Default redistribution metric is 1
  Redistributing: rip
  Default version control: send version 2, receive 2
    Interface             Send  Recv  Triggered RIP  Key-chain
    GigabitEthernet0/1    2     2                                    
  Automatic network summarization is not in effect
  Routing for Networks:
    10.0.0.0
  Passive Interface(s):
    GigabitEthernet0/0`
      },
      {
        command: 'show ip route rip',
        description: 'Verifies routes learned via RIP (Code R, Administrative Distance 120, Metric by Hop Count).',
        sampleOutput: `R    10.20.1.0/24 [120/2] via 10.0.12.2, 00:00:18, GigabitEthernet0/1`
      }
    ],
    troubleshootingSteps: [
      'Verify "version 2" is typed under "router rip"; RIPv1 does not carry subnet masks and causes silent drop of VLSM networks.',
      'Check that LAN interface is set to passive-interface to prevent security leaks.',
      'Verify hop count is less than 15 (hop count of 16 is considered unreachable in RIP).'
    ],
    expectedResult: 'R1 successfully learns remote network 10.20.1.0/24 with hop count metric 2 and full connectivity is established.'
  },
  {
    id: 'lab-5',
    number: 5,
    title: 'OSPF Multi-Area Routing Implementation',
    category: 'Routing',
    difficulty: 'Intermediate',
    estimatedTime: '50 mins',
    objective: 'Deploy Open Shortest Path First (OSPFv2) in a multi-area hierarchy (Area 0 Backbone and Area 10 Branch), tune reference bandwidth for gigabit links, configure router IDs, and verify DR/BDR election.',
    topologySummary: 'Area 0 Core (R1 & R2) connected over point-to-point Ethernet links, with R2 acting as Area Border Router (ABR) connecting to Area 10 (R3).',
    devices: [
      { name: 'R1-CORE', model: 'Cisco 4321', role: 'Backbone Router (Area 0)', interfaces: 'Loopback0: 1.1.1.1/32, Gi0/0/0: 10.0.0.1/30' },
      { name: 'R2-ABR', model: 'Cisco 4321', role: 'Area Border Router', interfaces: 'Loopback0: 2.2.2.2/32, Gi0/0/0: Area 0, Gi0/0/1: Area 10' },
      { name: 'R3-BRANCH', model: 'Cisco 4321', role: 'Internal Router (Area 10)', interfaces: 'Loopback0: 3.3.3.3/32, Gi0/0/0: Area 10' }
    ],
    configs: [
      {
        device: 'R2-ABR',
        mode: 'OSPF Process 1',
        commands: [
          'enable',
          'configure terminal',
          'router ospf 1',
          ' router-id 2.2.2.2',
          ' auto-cost reference-bandwidth 1000',
          ' network 10.0.0.2 0.0.0.0 area 0',
          ' network 10.10.0.1 0.0.0.0 area 10',
          ' network 2.2.2.2 0.0.0.0 area 0',
          ' passive-interface Loopback0',
          'exit',
          'interface GigabitEthernet0/0/0',
          ' ip ospf network point-to-point',
          ' ip ospf hello-interval 10',
          ' ip ospf dead-interval 40',
          'end',
          'write memory'
        ],
        explanation: 'Sets distinct Router ID, scales reference bandwidth to 1000 Mbps for Gigabit Ethernet metric differentiation, binds interfaces to respective OSPF areas, and tunes network type to point-to-point to skip DR/BDR election.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip ospf neighbor',
        description: 'Displays neighbor adjacency state, neighbor router ID, priority, and dead time.',
        sampleOutput: `Neighbor ID     Pri   State           Dead Time   Address         Interface
1.1.1.1           0   FULL/  -        00:00:36    10.0.0.1        GigabitEthernet0/0/0
3.3.3.3           1   FULL/BDR        00:00:33    10.10.0.2       GigabitEthernet0/0/1`
      },
      {
        command: 'show ip route ospf',
        description: 'Verifies intra-area (O) and inter-area (O IA) routes.',
        sampleOutput: `O IA 10.20.0.0/24 [110/3] via 10.10.0.2, 00:04:12, GigabitEthernet0/0/1
O    1.1.1.1/32 [110/2] via 10.0.0.1, 00:09:44, GigabitEthernet0/0/0`
      }
    ],
    troubleshootingSteps: [
      'Neighbors stuck in INIT: Check for firewall or access-list blocking multicast IP 224.0.0.5.',
      'Neighbors stuck in EXSTART/EXCHANGE: Check for MTU mismatch between peers ("ip ospf mtu-ignore" as temporary diagnostic).',
      'Verify Area ID, Subnet Mask, Hello/Dead timers, and Authentication match on both ends.'
    ],
    expectedResult: 'Full OSPF adjacency reaches FULL state. R1 learns Area 10 routes as O IA (Inter-Area) with optimal SPF metric calculations.'
  },
  {
    id: 'lab-6',
    number: 6,
    title: 'BGP Configuration (eBGP & iBGP Peering)',
    category: 'Routing',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    objective: 'Establish external BGP (eBGP) peering between Enterprise Autonomous System (AS 65100) and Tier-1 ISP (AS 65200), configure route prefix advertisement, next-hop-self for iBGP, and verify BGP path selection.',
    topologySummary: 'Enterprise Edge Router (R1 in AS 65100) peered with ISP Gateway (R2 in AS 65200) over 203.0.113.0/30.',
    devices: [
      { name: 'R1-EDGE', model: 'Cisco ASR 1001-X', role: 'Enterprise Border Router', interfaces: 'Gi0/0/0 (203.0.113.2/30), Lo0 (198.51.100.1/24)' },
      { name: 'R2-ISP', model: 'Cisco ASR 9000', role: 'ISP Transit Router', interfaces: 'Gi0/0/0 (203.0.113.1/30)' }
    ],
    configs: [
      {
        device: 'R1-EDGE',
        mode: 'BGP Config AS 65100',
        commands: [
          'enable',
          'configure terminal',
          'ip prefix-list CORP-PREFIXES permit 198.51.100.0/24',
          'route-map ADVERTISE-CORP permit 10',
          ' match ip address prefix-list CORP-PREFIXES',
          'exit',
          'router bgp 65100',
          ' bgp router-id 1.1.1.1',
          ' bgp log-neighbor-changes',
          ' neighbor 203.0.113.1 remote-as 65200',
          ' neighbor 203.0.113.1 description PEER-TO-ISP-PRIMARY',
          ' neighbor 203.0.113.1 route-map ADVERTISE-CORP out',
          ' network 198.51.100.0 mask 255.255.255.0',
          'end',
          'write memory'
        ],
        explanation: 'Configures eBGP neighbor peering, applies outbound route-map filtering to prevent becoming an accidental transit AS, and injects enterprise /24 public prefix into BGP table.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip bgp summary',
        description: 'Displays neighbor status, AS number, message counters, and prefix count.',
        sampleOutput: `BGP router identifier 1.1.1.1, local AS number 65100
BGP table version is 4, main routing table version 4
1 network entries using 248 bytes of memory

Neighbor        V           AS MsgRcvd MsgSent   TblVer  InQ OutQ Up/Down  State/PfxRcd
203.0.113.1     4        65200      48      52        4    0    0 00:38:12        1`
      },
      {
        command: 'show ip bgp neighbors 203.0.113.1 advertised-routes',
        description: 'Verifies prefix 198.51.100.0/24 is correctly advertised to ISP peer.',
        sampleOutput: `   Network          Next Hop            Metric LocPrf Weight Path
*> 198.51.100.0/24  0.0.0.0                  0         32768 i`
      }
    ],
    troubleshootingSteps: [
      'Neighbor stuck in Active or Idle: Check TCP port 179 connectivity using "telnet 203.0.113.1 179" or ping next-hop IP.',
      'Network not advertised in BGP table: Verify the exact prefix and subnet mask exist in the IGP routing table or null route table.',
      'Check eBGP multihop ("neighbor x.x.x.x ebgp-multihop <ttl>") if peering over loopback addresses instead of directly connected interfaces.'
    ],
    expectedResult: 'BGP peering transitions to ESTABLISHED state (PfxRcd showing number of prefixes) and bidirectional route propagation is confirmed.'
  },
  {
    id: 'lab-7',
    number: 7,
    title: 'DHCP Server & Relay Agent (ip helper-address)',
    category: 'Services',
    difficulty: 'Beginner',
    estimatedTime: '30 mins',
    objective: 'Configure a centralized Cisco IOS DHCP server with excluded ranges, options (DNS, default-router, domain name), and implement "ip helper-address" relay agent on a remote routed boundary.',
    topologySummary: 'Central Server Router hosting DHCP pools for VLAN 10 (192.168.10.0/24) and VLAN 20 (192.168.20.0/24), servicing remote clients via Relay Agent.',
    devices: [
      { name: 'RTR-DHCP-SRV', model: 'Cisco 2911', role: 'DHCP Server', interfaces: 'Gi0/0 (10.0.0.1/30)' },
      { name: 'SW-DIST-RELAY', model: 'Cisco 3850', role: 'DHCP Relay Agent', interfaces: 'SVI 10 (192.168.10.1/24), SVI 20 (192.168.20.1/24)' }
    ],
    configs: [
      {
        device: 'RTR-DHCP-SRV',
        mode: 'DHCP Server Config',
        commands: [
          'enable',
          'configure terminal',
          'ip dhcp excluded-address 192.168.10.1 192.168.10.20',
          'ip dhcp excluded-address 192.168.20.1 192.168.20.20',
          'ip dhcp pool VLAN10-ENGINEERING',
          ' network 192.168.10.0 255.255.255.0',
          ' default-router 192.168.10.1',
          ' dns-server 8.8.8.8 1.1.1.1',
          ' domain-name enterprise.local',
          ' lease 7 0 0',
          'exit',
          'ip dhcp pool VLAN20-SALES',
          ' network 192.168.20.0 255.255.255.0',
          ' default-router 192.168.20.1',
          ' dns-server 8.8.8.8',
          ' lease 3',
          'end',
          'write memory'
        ],
        explanation: 'Reserves static IP range for gateway and printers, provisions dynamic scopes with gateway, DNS resolvers, search domain, and 7-day lease times.'
      },
      {
        device: 'SW-DIST-RELAY',
        mode: 'Relay Agent Config on Client Gateways',
        commands: [
          'interface Vlan10',
          ' ip helper-address 10.0.0.1',
          'interface Vlan20',
          ' ip helper-address 10.0.0.1',
          'end'
        ],
        explanation: 'Converts client broadcast DHCPDISCOVER packets into unicast requests targeted directly at the central DHCP server.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip dhcp binding',
        description: 'Lists active leased IP addresses mapped to host MAC addresses.',
        sampleOutput: `IP address       Client-ID/              Lease expiration        Type
                 Hardware address
192.168.10.21    0100.5079.6668.00       Sep 28 2026 10:14 AM    Automatic
192.168.20.21    0100.5079.6668.01       Sep 24 2026 01:14 PM    Automatic`
      },
      {
        command: 'show ip dhcp pool',
        description: 'Displays total addresses, leased addresses, and pool exhaustion percentage.',
        sampleOutput: `Pool VLAN10-ENGINEERING :
 Utilization mark (high/low)    : 100 / 0
 Subnet size (total/usable)     : 254 / 234
 Leased addresses               : 1
 Pending event                  : none
 1 subnet is currently in the pool :
 Current index        IP address range                    Leased/Deferred/State
 192.168.10.22        192.168.10.1     - 192.168.10.254    1    / 0  / Active`
      }
    ],
    troubleshootingSteps: [
      'DHCP clients fail to get IP ("APIPA 169.254.x.x"): Check that "ip helper-address" is present under the specific client VLAN SVI.',
      'Check for rogue DHCP servers using "ip dhcp snooping" on access switches.',
      'Inspect pool exhaustion using "show ip dhcp pool" and look for conflict entries via "show ip dhcp conflict".'
    ],
    expectedResult: 'Client PCs automatically obtain IP, subnet mask, default gateway, and DNS configuration through the relay agent.'
  },
  {
    id: 'lab-8',
    number: 8,
    title: 'NAT & PAT (Port Address Translation / Overload)',
    category: 'Security',
    difficulty: 'Intermediate',
    estimatedTime: '40 mins',
    objective: 'Implement dynamic Port Address Translation (NAT Overload) allowing entire private RFC 1918 subnets (10.0.0.0/8, 192.168.0.0/16) to access the public Internet using a single routable public IP on the WAN interface.',
    topologySummary: 'Enterprise Edge Router with LAN (Gi0/0 - Inside) and WAN ISP link (Gi0/1 - Outside: 203.0.113.2/30).',
    devices: [
      { name: 'RTR-NAT-GW', model: 'Cisco ISR 4331', role: 'Enterprise Internet Gateway', interfaces: 'Gi0/0 (Inside: 192.168.1.1/24), Gi0/1 (Outside: 203.0.113.2/30)' }
    ],
    configs: [
      {
        device: 'RTR-NAT-GW',
        mode: 'NAT Overload Configuration',
        commands: [
          'enable',
          'configure terminal',
          'interface GigabitEthernet0/0',
          ' description Inside Private LAN',
          ' ip nat inside',
          ' no shutdown',
          'exit',
          'interface GigabitEthernet0/1',
          ' description Outside Public ISP Uplink',
          ' ip nat outside',
          ' no shutdown',
          'exit',
          'ip access-list standard NAT-PERMITTED-HOSTS',
          ' permit 192.168.1.0 0.0.0.255',
          ' permit 10.10.0.0 0.0.255.255',
          'exit',
          'ip nat inside source list NAT-PERMITTED-HOSTS interface GigabitEthernet0/1 overload',
          'end',
          'write memory'
        ],
        explanation: 'Designates inside/outside boundaries, defines ACL for permitted internal hosts, and translates source IP sockets to the public interface IP with unique layer 4 port mappings.'
      }
    ],
    verificationCommands: [
      {
        command: 'show ip nat translations',
        description: 'Inspects real-time NAT translation table with inside local, inside global, outside local, and outside global sockets.',
        sampleOutput: `Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.2:51234  192.168.1.25:51234 142.250.190.46:443 142.250.190.46:443
udp 203.0.113.2:62100  192.168.1.30:62100 8.8.8.8:53         8.8.8.8:53`
      },
      {
        command: 'show ip nat statistics',
        description: 'Displays total active translations, hits, misses, and expired NAT sessions.',
        sampleOutput: `Total active translations: 2 (0 static, 2 dynamic; 2 extended)
Outside interfaces:
  GigabitEthernet0/1
Inside interfaces:
  GigabitEthernet0/0
Hits: 1428  Misses: 0
Expired translations: 412`
      }
    ],
    troubleshootingSteps: [
      'Missing "ip nat inside" or "ip nat outside" on the physical interfaces causes silent forwarding failure with un-translated packets dropped by ISP.',
      'Check ACL syntax: Standard ACL must use wildcard mask (0.0.0.255), not subnet mask.',
      'Verify the keyword "overload" is present in the NAT command; without it, NAT acts as dynamic 1:1 and runs out of addresses on the second connection.'
    ],
    expectedResult: 'LAN devices successfully communicate with external public IP addresses while their private IP addresses remain concealed behind the gateway.'
  },
  {
    id: 'lab-9',
    number: 9,
    title: 'ACL Configuration (Standard, Extended & Named)',
    category: 'Security',
    difficulty: 'Intermediate',
    estimatedTime: '45 mins',
    objective: 'Deploy Standard Named ACL to secure VTY SSH administrative management access, and Extended Named ACL to enforce perimeter DMZ security (allowing HTTP/HTTPS and DNS while dropping unauthorized subnets and ICMP floods).',
    topologySummary: 'Branch Router filtering incoming traffic on Gi0/0 from untrusted segments towards production server farm (10.50.1.0/24).',
    devices: [
      { name: 'RTR-SEC-01', model: 'Cisco 2921', role: 'Security Edge Filter', interfaces: 'Gi0/0 (Outside/Guest), Gi0/1 (VTY Management), Gi0/2 (Server Farm)' }
    ],
    configs: [
      {
        device: 'RTR-SEC-01',
        mode: 'ACL Security Configuration',
        commands: [
          'enable',
          'configure terminal',
          '! 1. Standard ACL for SSH VTY Lines',
          'ip access-list standard SECURE-ADMIN-SSH',
          ' permit 192.168.10.50',
          ' permit 192.168.10.51',
          ' deny any log',
          'exit',
          'line vty 0 4',
          ' access-class SECURE-ADMIN-SSH in',
          ' transport input ssh',
          'exit',
          '! 2. Extended ACL for DMZ Protection',
          'ip access-list extended DMZ-INBOUND-POLICY',
          ' remark Allow Established TCP sessions',
          ' permit tcp any 10.50.1.0 0.0.0.255 established',
          ' remark Allow HTTP and HTTPS to Web Server',
          ' permit tcp any host 10.50.1.10 eq 80',
          ' permit tcp any host 10.50.1.10 eq 443',
          ' remark Allow DNS queries to internal resolver',
          ' permit udp any host 10.50.1.2 eq 53',
          ' remark Explicit Deny with syslog for monitoring',
          ' deny ip any any log',
          'exit',
          'interface GigabitEthernet0/0',
          ' ip access-group DMZ-INBOUND-POLICY in',
          'end',
          'write memory'
        ],
        explanation: 'Implements defense-in-depth: locks down management plane (VTY lines) to authorized administrative workstations and controls data plane through granular Layer 4 extended access lists.'
      }
    ],
    verificationCommands: [
      {
        command: 'show access-lists DMZ-INBOUND-POLICY',
        description: 'Inspects real-time hit counts for each rule to confirm matching traffic.',
        sampleOutput: `Extended IP access list DMZ-INBOUND-POLICY
    10 permit tcp any 10.50.1.0 0.0.0.255 established (1284 matches)
    20 permit tcp any host 10.50.1.10 eq www (492 matches)
    30 permit tcp any host 10.50.1.10 eq 443 (2104 matches)
    40 permit udp any host 10.50.1.2 eq domain (310 matches)
    50 deny ip any any log (86 matches)`
      }
    ],
    troubleshootingSteps: [
      'Remember the implicit "deny ip any any" at the end of every Cisco ACL; if a permit statement is missing, unmatched traffic is silently discarded.',
      'Placement rule: Extended ACLs should be placed closest to the traffic SOURCE; Standard ACLs should be placed closest to the DESTINATION.',
      'Check directionality: "in" applies to traffic entering the router interface, "out" applies to traffic leaving towards the wire.'
    ],
    expectedResult: 'Unauthorized workstations cannot open SSH sessions to the router. Web and DNS requests to DMZ succeed while rogue probes are logged and dropped.'
  },
  {
    id: 'lab-10',
    number: 10,
    title: 'Site-to-Site IPsec VPN (IKEv1 / IKEv2)',
    category: 'VPN',
    difficulty: 'Advanced',
    estimatedTime: '60 mins',
    objective: 'Build an encrypted Site-to-Site IPsec VPN tunnel across an untrusted WAN between Head Office (R1) and Regional Branch Office (R2) using AES-256 encryption, SHA-256 hashing, Diffie-Hellman Group 14, and pre-shared keys.',
    topologySummary: 'HQ Router (203.0.113.1) linked over simulated Internet to Branch Router (198.51.100.2), protecting internal subnets 10.1.0.0/16 and 10.2.0.0/16.',
    devices: [
      { name: 'R1-HQ-GW', model: 'Cisco ISR 4451', role: 'Head Office VPN Gateway', interfaces: 'WAN: 203.0.113.1, LAN: 10.1.0.0/16' },
      { name: 'R2-BRANCH-GW', model: 'Cisco ISR 4331', role: 'Branch Office VPN Gateway', interfaces: 'WAN: 198.51.100.2, LAN: 10.2.0.0/16' }
    ],
    configs: [
      {
        device: 'R1-HQ-GW',
        mode: 'IPsec VPN Phase 1 & 2 Config',
        commands: [
          'enable',
          'configure terminal',
          '! Phase 1: ISAKMP Policy',
          'crypto isakmp policy 10',
          ' encr aes 256',
          ' hash sha256',
          ' authentication pre-share',
          ' group 14',
          ' lifetime 86400',
          'exit',
          'crypto isakmp key CiscoNetSec2026! address 198.51.100.2',
          '! Phase 2: IPsec Transform Set',
          'crypto ipsec transform-set TS-AES-SHA esp-aes 256 esp-sha256-hmac',
          ' mode tunnel',
          'exit',
          '! Interesting Traffic ACL',
          'ip access-list extended VPN-TRAFFIC-HQ-TO-BRANCH',
          ' permit ip 10.1.0.0 0.0.255.255 10.2.0.0 0.0.255.255',
          'exit',
          '! Crypto Map',
          'crypto map CMAP-BRANCH 10 ipsec-isakmp',
          ' set peer 198.51.100.2',
          ' set transform-set TS-AES-SHA',
          ' match address VPN-TRAFFIC-HQ-TO-BRANCH',
          'exit',
          'interface GigabitEthernet0/0/1',
          ' crypto map CMAP-BRANCH',
          'end',
          'write memory'
        ],
        explanation: 'Negotiates IKE Phase 1 security associations using Diffie-Hellman Group 14 (2048-bit), establishes Phase 2 ESP transform set, and applies crypto map to encrypt packets matching the interesting traffic ACL.'
      }
    ],
    verificationCommands: [
      {
        command: 'show crypto isakmp sa',
        description: 'Verifies Phase 1 IKE Security Association is active with QM_IDLE state.',
        sampleOutput: `IPv4 Crypto ISAKMP SA
dst             src             state          conn-id status
198.51.100.2    203.0.113.1     QM_IDLE           1001 ACTIVE`
      },
      {
        command: 'show crypto ipsec sa',
        description: 'Displays Phase 2 encrypted and decrypted packet counters (#pkts encaps / #pkts decaps).',
        sampleOutput: `interface: GigabitEthernet0/0/1
    Crypto map tag: CMAP-BRANCH, local addr 203.0.113.1
   protected vrf: (none)
   local  ident (addr/mask/prot/port): (10.1.0.0/255.255.0.0/0/0)
   remote ident (addr/mask/prot/port): (10.2.0.0/255.255.0.0/0/0)
   current_peer 198.51.100.2 port 500
     #pkts encaps: 489, #pkts encrypt: 489, #pkts digest: 489
     #pkts decaps: 489, #pkts decrypt: 489, #pkts verify: 489`
      }
    ],
    troubleshootingSteps: [
      'Phase 1 fails (MM_NO_STATE): Mismatch in encryption (AES), hash (SHA), pre-shared key, or peer IP address.',
      'Phase 2 fails (QM_IDLE reached but traffic drops): Mismatch in interesting traffic ACLs on R1 and R2; the ACL on R2 must be the exact mirror image of R1.',
      'Check NAT exemption: Traffic destined across VPN must bypass NAT overload rules before leaving WAN interface.'
    ],
    expectedResult: 'Encrypted tunnel activates upon client traffic generation; packets between 10.1.0.0/16 and 10.2.0.0/16 are fully encapsulated and transmitted with confidentiality and integrity.'
  }
];

export const INITIAL_PROJECTS: NetworkProject[] = [
  {
    id: 'proj-1',
    title: 'Enterprise Campus LAN Redesign & VLAN Segmentation',
    category: 'Enterprise LAN',
    period: '8 Months',
    role: 'Lead Network Implementation Engineer',
    summary: 'Architected and rolled out a high-availability modular campus LAN infrastructure replacing legacy flat Layer 2 networks for an enterprise facility with 1,200+ active endpoints.',
    technologies: ['VLANs', '802.1Q Trunking', 'Rapid-PVST+', 'LACP EtherChannel', 'DHCP Snooping', 'Dynamic ARP Inspection'],
    hardwareUsed: ['Cisco Catalyst 3850 Stack (Core)', 'Catalyst 2960-X (Access)', 'Cisco ISR 4431'],
    challenges: [
      'Frequent network-wide broadcast storms caused by looping unmanaged desk switches.',
      'No security segregation between guest Wi-Fi, payroll servers, and engineering workstations.',
      'Zero maintenance window allowed during standard 8 AM - 6 PM business operations.'
    ],
    solution: [
      'Designed a two-tier collapsed core architecture with dual 10G LACP EtherChannel uplinks.',
      'Implemented Rapid-PVST+ with Root Guard, BPDU Guard, and PortFast on all edge ports.',
      'Segregated network into 12 dedicated VLANs with 802.1X NAC enforcement and DHCP Snooping.'
    ],
    results: [
      { metric: '99.99%', label: 'Campus Uptime Achieved' },
      { metric: '0', label: 'Broadcast Storm Outages Post-Deployment' },
      { metric: '10 Gbps', label: 'Core Backbone Bandwidth' }
    ],
    architectureSummary: 'Dual Catalyst 3850 switches in StackWise configuration providing wire-speed Layer 3 SVI routing, connected via redundant 10G fiber uplinks to access layer closets with 802.3ad link aggregation.'
  },
  {
    id: 'proj-2',
    title: 'OSPF Multi-Area Enterprise WAN Migration',
    category: 'WAN & Routing',
    period: '6 Months',
    role: 'Network Engineer',
    summary: 'Migrated a legacy multi-site network running static routing to a resilient Multi-Area OSPFv2 infrastructure spanning a headquarters datacenter and 6 regional branch offices.',
    technologies: ['OSPFv2 Multi-Area', 'Loopback Router IDs', 'SPF Tuning', 'BFD (Bidirectional Forwarding Detection)', 'Route Summarization'],
    hardwareUsed: ['Cisco ISR 4331', 'Cisco ASR 1001-X', 'MPLS / Metro Ethernet Circuits'],
    challenges: [
      'Routing convergence took upwards of 4 minutes whenever primary MPLS links flapped.',
      'Routing tables bloated to hundreds of specific routes causing high CPU utilization on older branch hardware.'
    ],
    solution: [
      'Structured network into Area 0 (Backbone DC) and discrete non-backbone areas for regional clusters.',
      'Configured ABR route summarization at boundary nodes, shrinking routing tables by 65%.',
      'Deployed BFD with sub-second timers, achieving sub-200ms failover detection upon circuit failure.'
    ],
    results: [
      { metric: '< 200 ms', label: 'Failover Detection with BFD' },
      { metric: '-65%', label: 'Routing Table Memory Overhead' },
      { metric: '100%', label: 'Route Convergence Reliability' }
    ],
    architectureSummary: 'Hierarchical OSPF design featuring Area 0 backbone peering over dual MPLS carriers with Stub and Totally Stubby Area designations on branch gateways to eliminate external LSA flooding.'
  },
  {
    id: 'proj-3',
    title: 'Next-Generation Firewall Deployment (Palo Alto Networks)',
    category: 'Network Security',
    period: '5 Months',
    role: 'Network Security Specialist',
    summary: 'Installed and configured redundant Palo Alto PA-3220 firewalls in Active/Passive High Availability mode, migrating legacy port-based firewall rules to App-ID and User-ID zero-trust security profiles.',
    technologies: ['Palo Alto PAN-OS', 'Active/Passive HA', 'App-ID & User-ID', 'SSL Decryption', 'Threat Prevention', 'IPsec GlobalProtect VPN'],
    hardwareUsed: ['Palo Alto PA-3220 (Pair)', 'Cisco Nexus 9300', 'Active Directory Domain Controllers'],
    challenges: [
      'Thousands of outdated permit-any rules in legacy firewall with zero visibility into modern encrypted web traffic.',
      'Remote workforce required secure multi-factor authenticated remote access with minimal latency.'
    ],
    solution: [
      'Configured Active/Passive HA with state synchronization and sub-second heartbeat link monitoring.',
      'Activated App-ID with SSL Forward Proxy decryption to identify malware hidden in encrypted TLS sessions.',
      'Integrated GlobalProtect VPN with SAML 2.0 MFA and role-based access security policies.'
    ],
    results: [
      { metric: '1,500+', label: 'Concurrent Secure VPN Users Supported' },
      { metric: '100%', label: 'Visibility Into App-Layer Traffic' },
      { metric: '0 ms', label: 'Packet Drop during HA Failover Drill' }
    ],
    architectureSummary: 'Palo Alto PA-3220 cluster deployed in routed virtual wire / L3 mode at network perimeter, fronted by dual upstream ISPs and connected downstream to internal DMZ and Core switches.'
  },
  {
    id: 'proj-4',
    title: 'BGP Multi-Homed Edge Network Optimization',
    category: 'WAN & Routing',
    period: '4 Months',
    role: 'Network Infrastructure Engineer',
    summary: 'Engineered an eBGP multi-homed Internet edge deployment with two Tier-1 Service Providers, implementing AS-Path prepending and local preference path manipulation for optimal traffic engineering.',
    technologies: ['BGP (Border Gateway Protocol)', 'eBGP Peering', 'AS-Path Prepending', 'Local Preference', 'MED', 'BGP Community Tags'],
    hardwareUsed: ['Cisco ASR 1002-X Routers', 'Dual 1G Dedicated Internet Access circuits'],
    challenges: [
      'Asymmetric routing caused stateful firewall drops during high-volume data transfers.',
      'All outbound traffic congested ISP 1 while expensive backup fiber link to ISP 2 stayed idle.'
    ],
    solution: [
      'Implemented BGP route-maps using Local Preference (Local-Pref 200 vs 100) to balance outbound egress traffic.',
      'Applied AS-Path prepending on backup ISP announcements to influence inbound Internet routing decisions.',
      'Configured BGP peer authentication and maximum-prefix limits to prevent route-hijacking.'
    ],
    results: [
      { metric: '50/50', label: 'Balanced Link Utilization' },
      { metric: '0', label: 'Asymmetric Firewall Drops' },
      { metric: '100%', label: 'Automatic BGP Failover during outages' }
    ],
    architectureSummary: 'Dual Cisco ASR 1002-X routers with full BGP routing tables from dual carriers, synchronizing internal next-hop states via iBGP session and VRRP first-hop redundancy.'
  },
  {
    id: 'proj-5',
    title: 'Linux Server Network Infrastructure & Hardening',
    category: 'Linux & Cloud',
    period: '4 Months',
    role: 'Systems & Network Administrator',
    summary: 'Standardized network configuration, automated bonding interfaces (LACP 802.3ad), DNS caching resolvers, and firewall security across 35+ Ubuntu Server and RHEL enterprise nodes.',
    technologies: ['Linux Netplan / NetworkManager', 'Bonding mode 4 (802.3ad)', 'iptables / nftables', 'systemd-resolved', 'SSH key-only hardening', 'tcpdump & wireshark diagnostics'],
    hardwareUsed: ['Dell PowerEdge R740', 'Supermicro 1U Nodes', 'Mellanox 10/25G NICs'],
    challenges: [
      'Single NIC failures previously caused database node disconnects and split-brain scenarios.',
      'Inconsistent firewall rules across servers posed lateral movement security risks.'
    ],
    solution: [
      'Configured LACP bond interfaces providing 20Gbps aggregated bandwidth and automatic failover.',
      'Standardized nftables rulesets blocking unauthorized ingress while logging suspicious syn floods.',
      'Automated network configurations using clean YAML declarative templates.'
    ],
    results: [
      { metric: '20 Gbps', label: 'Aggregated Server Throughput' },
      { metric: 'Zero', label: 'Downtime During Physical Link Cuts' },
      { metric: '35+', label: 'Servers Hardened to CIS Benchmark' }
    ],
    architectureSummary: 'Dual 10G SFP+ links per server trunked into separate top-of-rack switches running MLAG, managed via Linux Netplan bond0 configuration.'
  },
  {
    id: 'proj-6',
    title: 'AWS Cloud Hybrid VPC & Transit Gateway Integration',
    category: 'Linux & Cloud',
    period: '5 Months',
    role: 'Cloud Network Specialist',
    summary: 'Designed an enterprise AWS VPC environment interconnected with on-premises datacenters via AWS Site-to-Site IPsec VPN and Transit Gateway, ensuring high throughput and private subnet isolation.',
    technologies: ['AWS VPC', 'Transit Gateway (TGW)', 'Direct Connect / IPsec VPN', 'Route 53 Resolver', 'Security Groups & NACLs'],
    hardwareUsed: ['AWS Cloud Platform', 'Cisco CSR 1000v Cloud Routers', 'On-premises Cisco ISR 4451'],
    challenges: [
      'Multiple isolated AWS VPCs needed low-latency connectivity back to on-prem databases.',
      'Security compliance required zero direct public internet exposure for internal production workloads.'
    ],
    solution: [
      'Deployed centralized AWS Transit Gateway hub with spoke attachments for Prod, Dev, and Shared-Services VPCs.',
      'Established dual redundant IPsec VPN tunnels with BGP dynamic route exchange.',
      'Configured NAT Gateways and private Route 53 outbound endpoints for secure hybrid DNS resolution.'
    ],
    results: [
      { metric: '1.25 Gbps', label: 'Per-Tunnel IPsec Throughput' },
      { metric: '100%', label: 'Private Subnet Isolation' },
      { metric: '10 ms', label: 'Stable Hybrid Network Latency' }
    ],
    architectureSummary: 'Multi-VPC AWS cloud landing zone connected via AWS Transit Gateway with BGP-peered IPsec tunnels to on-prem Cisco core routers.'
  },
  {
    id: 'proj-7',
    title: 'SAP Business One & SAP BASIS Infrastructure Administration',
    category: 'Enterprise ERP',
    period: 'Ongoing',
    role: 'SAP Infrastructure & Network Engineer',
    summary: 'Managed end-to-end network reliability, database server storage interconnects, backup automation, and user access permissions for SAP Business One on SUSE Linux Enterprise Server (SLES) & Windows Server environments.',
    technologies: ['SAP Business One', 'SAP BASIS', 'SAP HANA Database Engine', 'SUSE Linux Enterprise Server (SLES)', 'Windows Server / Active Directory', 'Network QoS for ERP'],
    hardwareUsed: ['HPE ProLiant DL380 Gen10', 'Synology Enterprise NAS', 'Managed 10G SAN Switch'],
    challenges: [
      'SAP client application disconnects during large analytical batch jobs due to packet loss.',
      'Business-critical recovery point objectives (RPO < 15 minutes) required high-speed backup replication.'
    ],
    solution: [
      'Implemented prioritized QoS DSCP queuing for SAP application traffic (ports 30015, 8443, 30000).',
      'Configured dedicated storage VLAN with Jumbo Frames (MTU 9000) for rapid HANA database snapshots.',
      'Established automated health monitoring and client license manager administration.'
    ],
    results: [
      { metric: '99.98%', label: 'ERP System Availability' },
      { metric: '< 5 min', label: 'Database Backup Replication Window' },
      { metric: 'Zero', label: 'Corrupted SAP Transactions Reported' }
    ],
    architectureSummary: 'Tier-1 SAP HANA cluster running on SLES with dedicated 10G storage VLAN and redundant switch uplinks, serving 150+ Windows client workstations.'
  }
];

export const INITIAL_TROUBLESHOOTING: TroubleshootingItem[] = [
  {
    id: 'ts-1',
    category: 'VLAN',
    title: 'Inter-VLAN Communication Failure (Hosts in Different VLANs Cannot Ping)',
    symptom: 'Host in VLAN 10 (192.168.10.15) can ping other hosts in VLAN 10, but cannot reach any host in VLAN 20 (192.168.20.25).',
    rootCauses: [
      'Default Gateway IP address missing or misconfigured on client network adapter.',
      'Trunk link between access switch and router is dropping VLAN tags due to missing "switchport mode trunk".',
      'Encapsulation dot1Q tag number on router sub-interface does not match switch VLAN ID.',
      'Multilayer switch lacks the "ip routing" global command.',
      'ACL or Host Windows Firewall dropping inbound ICMP echo requests.'
    ],
    steps: [
      '1. Verify client host configuration: run "ipconfig" or "ip addr". Ensure Default Gateway points to 192.168.10.1.',
      '2. Ping the local gateway from client: if ping to 192.168.10.1 fails, problem is strictly local to the switch/access port.',
      '3. On switch, run "show interfaces trunk" and verify the uplink port is in "trunking" status with VLANs 10 and 20 listed under allowed VLANs.',
      '4. On router, verify sub-interfaces: run "show ip interface brief" and ensure Gi0/0/0.10 and Gi0/0/0.20 are UP/UP.',
      '5. Verify routing table: run "show ip route" to ensure both subnets exist as directly connected or static routes.',
      '6. Test cross-VLAN ICMP from router CLI to eliminate host firewall variables: "ping 192.168.20.25 source 192.168.10.1".'
    ],
    diagnosticCommands: [
      { cmd: 'show interfaces trunk', outputNote: 'Ensure status is "trunking" and VLAN is in "Vlans allowed and active in management domain"' },
      { cmd: 'show ip route', outputNote: 'Check that connected routes for both VLAN subnets appear in the routing table' },
      { cmd: 'show vlan brief', outputNote: 'Ensure the host port is mapped to the intended VLAN number' }
    ],
    resolutionSummary: 'Corrected 802.1Q encapsulation on router sub-interface and verified the switch uplink port was explicitly set to "switchport mode trunk" with native VLAN alignment.'
  },
  {
    id: 'ts-2',
    category: 'Routing',
    title: 'OSPF Neighbor Stuck in 2-WAY, EXSTART or EXCHANGE State',
    symptom: 'Two routers show OSPF neighbor presence in "show ip ospf neighbor", but the state never progresses to "FULL".',
    rootCauses: [
      'MTU mismatch between adjacent router interfaces (most common reason for hang in EXSTART).',
      'Broadcast multi-access segment where neighbor is a DROTHER (2-WAY is normal between DROTHERs, but not between DROTHER and DR/BDR).',
      'Duplicate OSPF Router IDs configured on both routers.',
      'Mismatched OSPF Hello (10s) or Dead (40s) intervals.',
      'Area ID or Area Type mismatch (e.g. one side configured as Stub, other as normal).'
    ],
    steps: [
      '1. Check exact neighbor state: run "show ip ospf neighbor" and note whether it is EXSTART, 2-WAY, or INIT.',
      '2. Inspect MTU on both connected interfaces: run "show interfaces GigabitEthernet0/0/0 | include MTU". If MTU is 1500 on one side and 1492 on the other, OSPF Database Description (DBD) packets are dropped.',
      '3. Run "show ip ospf interface" on both sides to compare Hello/Dead intervals, Network Type, and Area number.',
      '4. Verify Router ID uniqueness: run "show ip ospf" and verify router IDs are different (e.g., 1.1.1.1 and 2.2.2.2).',
      '5. Enable real-time packet debugging: "debug ip ospf adj" and check log output.'
    ],
    diagnosticCommands: [
      { cmd: 'show ip ospf neighbor', outputNote: 'Inspect State column (e.g., EXSTART/-, 2-WAY/DROTHER, FULL/DR)' },
      { cmd: 'show ip ospf interface Gi0/0/0', outputNote: 'Verify Area ID, Process ID, Hello 10, Dead 40, and MTU match' },
      { cmd: 'debug ip ospf adj', outputNote: 'Pinpoint exact point of negotiation failure (e.g. "MTU mismatch in DBD")' }
    ],
    resolutionSummary: 'Identified MTU 1492 vs 1500 discrepancy on WAN serial/ethernet handoff; standardized MTU to 1500, causing OSPF adjacency to immediately reach FULL state.'
  },
  {
    id: 'ts-3',
    category: 'DHCP',
    title: 'Host Receives 169.254.x.x APIPA Address (DHCP Discovery Fails)',
    symptom: 'Workstations plug into access switch but fail to obtain an IP lease from the corporate DHCP server, falling back to 169.254.x.x.',
    rootCauses: [
      'Missing "ip helper-address <dhcp-server-ip>" command on the local default gateway SVI/router interface.',
      'DHCP server pool exhausted (100% utilization of allocated scope).',
      'Access switch port assigned to incorrect VLAN or shutdown.',
      'DHCP Snooping enabled on switch with the upstream trunk port not configured as "ip dhcp snooping trust".',
      'Firewall blocking UDP port 67 (DHCP Server) or UDP port 68 (DHCP Client).'
    ],
    steps: [
      '1. Verify client switch port: run "show mac address-table interface Fa0/5" to confirm Layer 2 link is alive.',
      '2. Check router gateway: inspect the SVI or sub-interface for the client VLAN and verify "ip helper-address" is present and points to the reachable DHCP server IP.',
      '3. On DHCP server, run "show ip dhcp pool" to check if free addresses remain.',
      '4. If DHCP snooping is active on switch, run "show ip dhcp snooping" and check if the trunk uplink is marked "trusted".',
      '5. Run packet capture or "debug ip dhcp server packet" to observe whether DHCPDISCOVER messages arrive at the server.'
    ],
    diagnosticCommands: [
      { cmd: 'show ip dhcp pool', outputNote: 'Check leased addresses vs usable addresses' },
      { cmd: 'show ip dhcp conflict', outputNote: 'Check if IP address collisions are locking out pool addresses' },
      { cmd: 'show ip dhcp snooping', outputNote: 'Verify untrusted ports are not dropping valid server DHCPOFFER packets' }
    ],
    resolutionSummary: 'Added "ip helper-address 10.0.0.1" under the client Vlan 10 SVI and configured "ip dhcp snooping trust" on the switch uplink interface.'
  },
  {
    id: 'ts-4',
    category: 'Firewall',
    title: 'Palo Alto Firewall Dropping Legitimate Web Traffic (Asymmetric Routing)',
    symptom: 'Client initiates TCP connection to external server; SYN packet goes out, but connection hangs or times out with "TCP SYN retransmission".',
    rootCauses: [
      'Asymmetric routing: Inbound return traffic enters through a different firewall or interface, violating stateful TCP sequence tracking.',
      'Security Policy rule order: An earlier "Deny" rule catches the traffic before reaching the specific allow rule.',
      'Zone mismatch: Traffic arriving on an interface not bound to the expected security zone in the security policy.',
      'SSL decryption failure due to untrusted root CA certificate on the client workstation.',
      'NAT policy missing or translating destination to wrong internal IP.'
    ],
    steps: [
      '1. Review Monitor tab / Traffic logs in Palo Alto: search by source IP and destination IP.',
      '2. Inspect Session End Reason: look for "tcp-rst-from-client", "aged-out", or "policy-deny".',
      '3. Check session state CLI: "show session all filter source <ip> destination <ip>". If flag is "INIT" without "ACTIVE", reverse packets are not returning to this firewall.',
      '4. Run routing FIB lookup: "test routing fib-lookup virtual-router default ip <dst-ip>" to verify outbound interface.',
      '5. Check Security Rule order: Ensure granular permit rules sit above generic broad restrictions.'
    ],
    diagnosticCommands: [
      { cmd: 'show session all filter source 192.168.10.15', outputNote: 'Inspect current state, flags, and applied security rule name' },
      { cmd: 'test security-policy-match source 192.168.10.15 destination 8.8.8.8 protocol 6 port 443', outputNote: 'Simulates rule evaluation to reveal matching policy name' }
    ],
    resolutionSummary: 'Configured policy-based routing (PBR) on the core switch to ensure symmetrical traffic return through the primary Palo Alto cluster, eliminating stateful drops.'
  },
  {
    id: 'ts-5',
    category: 'DNS',
    title: 'Domain Name Resolution Failure with Working Ping to IP',
    symptom: 'Workstations can ping public IP addresses (e.g. 8.8.8.8) but cannot open any website by domain name (e.g. google.com).',
    rootCauses: [
      'Invalid or unreachable DNS server IP address configured in host TCP/IP settings.',
      'Internal DNS forwarder service (bind9 / systemd-resolved) crashed or unresponsive.',
      'Firewall blocking UDP port 53 outbound towards public resolvers.',
      'Split-horizon DNS failure where internal client queries public DNS for an internal private FQDN.',
      'DNS cache corruption on the local operating system.'
    ],
    steps: [
      '1. Test direct DNS resolution: run "nslookup google.com" or "dig @8.8.8.8 google.com".',
      '2. If nslookup times out with "no servers could be reached", test network path to DNS server: "ping <dns-server-ip>".',
      '3. Check firewall logs for dropped UDP port 53 traffic.',
      '4. Flush host DNS resolver cache: Windows "ipconfig /flushdns" or Linux "resolvectl flush-caches".',
      '5. Verify DNS server daemon status on server: "systemctl status systemd-resolved" or "systemctl status named".'
    ],
    diagnosticCommands: [
      { cmd: 'nslookup domain.com 8.8.8.8', outputNote: 'Bypasses local resolver to test external DNS reachability directly' },
      { cmd: 'dig +trace domain.com', outputNote: 'Traces full hierarchical DNS query from root servers down to authoritative NS' }
    ],
    resolutionSummary: 'Updated DHCP Scope Option 6 with primary and secondary corporate DNS resolvers and added outbound UDP/TCP 53 permit rule on the perimeter firewall.'
  },
  {
    id: 'ts-6',
    category: 'Linux',
    title: 'Linux Server Network Interface Down After Reboot (Netplan / NetworkManager)',
    symptom: 'Linux server loses network access following a system restart or kernel update; "ip addr" shows interface in DOWN state without an IPv4 address.',
    rootCauses: [
      'YAML syntax error (tabs used instead of spaces) in /etc/netplan/*.yaml configuration file.',
      'Predictable interface naming changed after hardware reconfiguration (e.g. eth0 became ens33 or enp3s0).',
      'Conflicting network daemons running simultaneously (systemd-networkd vs NetworkManager).',
      'Missing or faulty link cable / physical link negotiation issue on switchport.'
    ],
    steps: [
      '1. Access server via console/iLO: check interface names using "ip link show".',
      '2. Check current IP assignment: run "ip addr show".',
      '3. Validate Netplan YAML syntax: run "netplan try" or "netplan apply". Look for YAML indentation errors.',
      '4. Check system logs: run "journalctl -u systemd-networkd -e" or "journalctl -u NetworkManager -e".',
      '5. Test manual interface bring-up: run "ip link set <iface> up" and "dhclient <iface>".'
    ],
    diagnosticCommands: [
      { cmd: 'ip link show', outputNote: 'Verify administrative and operational status of physical NICs' },
      { cmd: 'netplan status', outputNote: 'Displays Netplan config parsed state and bound addresses' },
      { cmd: 'ss -tulpn', outputNote: 'Verify listening ports and sockets bound to network interfaces' }
    ],
    resolutionSummary: 'Fixed indentation error in /etc/netplan/01-netcfg.yaml and updated interface identifier from eth0 to persistent name ens160.'
  },
  {
    id: 'ts-7',
    category: 'Internet',
    title: 'Slow Internet Speeds & Intermittent Connection Drops (Duplex / MTU Issue)',
    symptom: 'Users experience sluggish downloads, failing VPN handshakes, and web pages hanging halfway through loading.',
    rootCauses: [
      'Speed/Duplex mismatch between switchport and router/server (e.g. Full-Duplex vs Half-Duplex resulting in late collisions).',
      'MTU / MSS black hole: Path MTU is smaller than 1500 (e.g. over PPPoE or IPsec VPN), and ICMP fragmentation needed is blocked.',
      'High CRC error rate on switchport caused by damaged CAT6 cable or loose fiber connector.',
      'Buffer bloat or bandwidth saturation on the WAN ISP circuit.'
    ],
    steps: [
      '1. Check interface counters: run "show interfaces GigabitEthernet0/1" on switch and router. Check for CRC errors, input errors, and collisions.',
      '2. Look for half-duplex negotiation: if one side is Auto and other is set to 100/Full, link negotiates to 100/Half causing severe packet retransmissions.',
      '3. Test MTU size using ping with Don\'t Fragment (DF) bit set: "ping 8.8.8.8 -f -l 1472" (Windows) or "ping 8.8.8.8 -M do -s 1472" (Linux).',
      '4. If large pings fail, configure TCP MSS clamping on the router WAN interface: "ip tcp adjust-mss 1412".',
      '5. Replace physical patch cable if CRC error counters continuously increment.'
    ],
    diagnosticCommands: [
      { cmd: 'show interfaces Gi0/1 | include CRC|collision|duplex', outputNote: 'Instantly identifies duplex mismatches and physical layer errors' },
      { cmd: 'ping 8.8.8.8 -M do -s 1472', outputNote: 'Discovers maximum transmission unit without fragmentation' }
    ],
    resolutionSummary: 'Hardcoded Speed 1000 and Duplex Full on both link ends and enabled "ip tcp adjust-mss 1412" on the WAN PPPoE dialer interface.'
  },
  {
    id: 'ts-8',
    category: 'Windows',
    title: 'Windows Server Cannot Be Reached via RDP or Ping from Different Subnet',
    symptom: 'Windows Server 2022 responds to ping from its own local subnet, but all attempts to ping or connect via RDP (port 3389) from other subnets fail.',
    rootCauses: [
      'Windows Defender Firewall active profile (Public vs Domain/Private) blocks cross-subnet ICMP and RDP.',
      'Missing or incorrect default gateway IP address on the Windows network adapter.',
      'Remote Desktop service is disabled in System Properties.',
      'Static route missing on Windows Server if multi-homed with two NICs.'
    ],
    steps: [
      '1. Run "ipconfig /all" on server: verify IP, Subnet Mask, and Default Gateway.',
      '2. Check Windows Firewall: open PowerShell as Admin and run "Get-NetFirewallRule -DisplayGroup \'Remote Desktop\' | Format-Table Name, Enabled, Action".',
      '3. Notice that default Windows Firewall rule restricts incoming ICMP echo and RDP to "LocalSubnet".',
      '4. Update firewall rule scope: allow RDP from corporate management subnets (e.g. 192.168.0.0/16).',
      '5. Test listening port: run "netstat -ano | findstr 3389" to confirm TermService is actively listening.'
    ],
    diagnosticCommands: [
      { cmd: 'Test-NetConnection -ComputerName 192.168.20.10 -Port 3389', outputNote: 'PowerShell diagnostic testing TCP handshake to RDP port' },
      { cmd: 'route print', outputNote: 'Verifies Windows routing table and active default gateway metric' }
    ],
    resolutionSummary: 'Modified Windows Firewall Remote Desktop rule scope from "Local Subnet" to "Any / Corporate IP Range" and set network profile to DomainAuthenticated.'
  }
];

export const INITIAL_COMMANDS: CommandItem[] = [
  // Cisco Commands
  {
    id: 'cmd-c1',
    platform: 'Cisco',
    category: 'Interface & IP',
    command: 'show ip interface brief',
    description: 'Displays a quick summary of all router or switch interfaces, assigned IPv4 addresses, and Layer 1 (Physical) / Layer 2 (Data Link) operational status.',
    parametersExplanation: 'Useful to immediately identify if interfaces are administratively down or down/down.',
    exampleOutput: `Interface              IP-Address      OK? Method Status                Protocol
GigabitEthernet0/0/0   192.168.1.1     YES manual up                    up      
GigabitEthernet0/0/1   203.0.113.2     YES manual up                    up      
GigabitEthernet0/0/2   unassigned      YES unset  administratively down down`
  },
  {
    id: 'cmd-c2',
    platform: 'Cisco',
    category: 'Switching & VLAN',
    command: 'show vlan brief',
    description: 'Lists all configured VLAN numbers, names, operational status, and member access ports on a Cisco Catalyst switch.',
    parametersExplanation: 'Does not display trunk ports; only access-mode ports assigned to each VLAN.',
    exampleOutput: `VLAN Name                             Status    Ports
---- -------------------------------- --------- -------------------------------
1    default                          active    Fa0/5, Fa0/6, Fa0/7, Fa0/8
10   ENGINEERING                      active    Fa0/1, Fa0/2
20   SALES                            active    Fa0/3, Fa0/4`
  },
  {
    id: 'cmd-c3',
    platform: 'Cisco',
    category: 'Switching & VLAN',
    command: 'show interfaces trunk',
    description: 'Displays all active 802.1Q trunk interfaces, trunking operational mode, encapsulation, native VLAN, and allowed VLAN ranges.',
    parametersExplanation: 'The gold standard command for diagnosing VLAN hopping and inter-switch trunk drops.',
    exampleOutput: `Port        Mode             Encapsulation  Status        Native vlan
Gi0/1       on               802.1q         trunking      1

Port        Vlans allowed on trunk
Gi0/1       1-4094`
  },
  {
    id: 'cmd-c4',
    platform: 'Cisco',
    category: 'Routing & Tables',
    command: 'show ip route',
    description: 'Displays the complete IPv4 routing table, including connected (C), static (S), OSPF (O), RIP (R), and BGP (B) routes.',
    parametersExplanation: 'Can be filtered: "show ip route ospf", "show ip route static", or "show ip route 192.168.1.0".',
    exampleOutput: `Gateway of last resort is 203.0.113.1 to network 0.0.0.0

S*    0.0.0.0/0 [1/0] via 203.0.113.1
C     192.168.10.0/24 is directly connected, GigabitEthernet0/0/0
O     172.16.0.0/16 [110/2] via 10.0.0.2, 01:14:02, GigabitEthernet0/0/1`
  },
  {
    id: 'cmd-c5',
    platform: 'Cisco',
    category: 'Diagnostics & Packet Flow',
    command: 'show running-config',
    description: 'Displays the currently active configuration residing in router/switch volatile RAM.',
    parametersExplanation: 'Pipe filters can be applied: "| include <str>", "| section <section>", or "| begin <str>".',
    exampleOutput: `Current configuration : 2419 bytes
!
version 16.9
service timestamps debug datetime msec
service timestamps log datetime msec
no service password-encryption
!`
  },
  {
    id: 'cmd-c6',
    platform: 'Cisco',
    category: 'Diagnostics & Packet Flow',
    command: 'show cdp neighbors detail',
    description: 'Uses Cisco Discovery Protocol to reveal neighboring Cisco devices, remote device IP address, remote interface, software version, and platform.',
    parametersExplanation: 'Extremely helpful for mapping out un-documented physical cabling topologies.',
    exampleOutput: `Device ID: SW-CORE-01.corp
Entry address(es): 
  IP address: 10.0.0.1
Platform: cisco WS-C3850-24T,  Capabilities: Router Switch IGMP 
Interface: GigabitEthernet0/0/0,  Port ID (outgoing port): GigabitEthernet1/0/1`
  },
  {
    id: 'cmd-c7',
    platform: 'Cisco',
    category: 'Routing & Tables',
    command: 'show ip ospf neighbor',
    description: 'Lists all active OSPF neighbors, neighbor IDs, adjacency states (INIT, 2-WAY, EXSTART, FULL), dead timer, and interface.',
    parametersExplanation: 'Indicates whether the router has successfully formed SPF database synchronization with peers.',
    exampleOutput: `Neighbor ID     Pri   State           Dead Time   Address         Interface
2.2.2.2           1   FULL/DR         00:00:34    10.0.0.2        GigabitEthernet0/0/1`
  },
  {
    id: 'cmd-c8',
    platform: 'Cisco',
    category: 'Security & ACL',
    command: 'show ip nat translations',
    description: 'Displays real-time NAT and PAT translations active in memory, showing inside local/global and outside sockets.',
    parametersExplanation: 'Used to verify port address translation is actively converting private RFC 1918 traffic.',
    exampleOutput: `Pro Inside global      Inside local       Outside local      Outside global
tcp 203.0.113.2:49152  192.168.10.15:49152 142.250.190.46:443 142.250.190.46:443`
  },

  // Linux Commands
  {
    id: 'cmd-l1',
    platform: 'Linux',
    category: 'Interface & IP',
    command: 'ip addr show',
    description: 'Displays IP addresses, MAC addresses, and state for all network interfaces on the Linux system (modern replacement for ifconfig).',
    parametersExplanation: 'Can target specific interface: "ip addr show eth0".',
    exampleOutput: `2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500 qdisc fq_codel state UP
    link/ether 00:0c:29:4f:8e:35 brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.50/24 brd 192.168.10.255 scope global eth0
       valid_lft forever preferred_lft forever`
  },
  {
    id: 'cmd-l2',
    platform: 'Linux',
    category: 'Routing & Tables',
    command: 'ip route show',
    description: 'Displays the Linux kernel IPv4 routing table, including default gateway and interface bindings (modern replacement for route -n).',
    parametersExplanation: 'Run "ip route get 8.8.8.8" to determine exact interface and source IP chosen for a specific destination.',
    exampleOutput: `default via 192.168.10.1 dev eth0 proto static onlink 
192.168.10.0/24 dev eth0 proto kernel scope link src 192.168.10.50`
  },
  {
    id: 'cmd-l3',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'ss -tulpn',
    description: 'Dumps all listening TCP and UDP sockets with associated process names and PID (modern high-speed replacement for netstat).',
    parametersExplanation: 'Flags: -t (TCP), -u (UDP), -l (Listening), -p (Process), -n (Numeric ports).',
    exampleOutput: `Netid State  Recv-Q Send-Q Local Address:Port  Peer Address:PortProcess                                    
tcp   LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=842,fd=3))              
tcp   LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=1120,fd=6))`
  },
  {
    id: 'cmd-l4',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'ping -c 4 8.8.8.8',
    description: 'Sends 4 ICMP ECHO_REQUEST packets to destination IP to measure latency and packet loss.',
    parametersExplanation: 'Use -i <seconds> for interval, -s <bytes> for packet size, -I <interface> to bind.',
    exampleOutput: `4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 12.140/13.412/14.890/0.920 ms`
  },
  {
    id: 'cmd-l5',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'traceroute -n 8.8.8.8',
    description: 'Prints the route packets take to network host by incrementing TTL hop by hop.',
    parametersExplanation: '-n disables reverse DNS lookup for instantaneous output.',
    exampleOutput: `traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.10.1  0.812 ms  0.780 ms  0.760 ms
 2  203.0.113.1  1.420 ms  1.380 ms  1.350 ms
 3  8.8.8.8  11.230 ms  11.190 ms  11.140 ms`
  },
  {
    id: 'cmd-l6',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'nslookup domain.com',
    description: 'Queries Internet domain name servers to resolve domain names to IP addresses or vice versa.',
    parametersExplanation: 'Specify server: "nslookup domain.com 1.1.1.1".',
    exampleOutput: `Server:		192.168.10.1
Address:	192.168.10.1#53

Non-authoritative answer:
Name:	domain.com
Address: 93.184.216.34`
  },
  {
    id: 'cmd-l7',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'dig domain.com +short',
    description: 'Flexible CLI tool for interrogating DNS name servers with concise machine-readable or verbose output.',
    parametersExplanation: 'Try "dig @8.8.8.8 google.com MX" to query mail exchanger records.',
    exampleOutput: `142.250.190.46`
  },
  {
    id: 'cmd-l8',
    platform: 'Linux',
    category: 'Diagnostics & Packet Flow',
    command: 'tcpdump -i eth0 -nn port 80 or port 443',
    description: 'Captures and analyzes live network packets traversing a specified interface in real-time.',
    parametersExplanation: '-i interface, -nn prevents resolving names and ports for raw speed.',
    exampleOutput: `23:40:12.102394 IP 192.168.10.50.49120 > 142.250.190.46.443: Flags [S], seq 18492014, win 64240, options [mss 1460,sackOK], length 0`
  },

  // Palo Alto Commands
  {
    id: 'cmd-p1',
    platform: 'Palo Alto',
    category: 'Interface & IP',
    command: 'show interface all',
    description: 'Displays the configuration and operational status of all physical ethernet, aggregate, loopback, and tunnel interfaces on the firewall.',
    parametersExplanation: 'Shows state (up/down), zone bindings, assigned IP, and duplex settings.',
    exampleOutput: `total interfaces: 8
--------------------------------------------------------------------------------
Name                Id    IP Address/Mask    Internal IP    Virtual Router    Zone    Status
--------------------------------------------------------------------------------
ethernet1/1         16    203.0.113.2/30     unassigned     default           untrust up
ethernet1/2         17    10.0.0.1/24        unassigned     default           trust   up`
  },
  {
    id: 'cmd-p2',
    platform: 'Palo Alto',
    category: 'Security & ACL',
    command: 'show session all',
    description: 'Displays currently active stateful sessions passing through the firewall engine with flow states, application, and source/dest.',
    parametersExplanation: 'Filter sessions using: "show session all filter source <ip>".',
    exampleOutput: `ID          Application  State  Type  Flag  Src[Sport]/Zone/Proto (Dst[Dport]/Zone)
-------------------------------------------------------------------------------
14829       ssl          ACTIVE FLOW  NS    192.168.10.15[51240]/trust/6 (142.250.190.46[443]/untrust)`
  },
  {
    id: 'cmd-p3',
    platform: 'Palo Alto',
    category: 'Routing & Tables',
    command: 'test routing fib-lookup virtual-router default ip 8.8.8.8',
    description: 'Performs a forwarding information base (FIB) route lookup to test which interface and next-hop the firewall will use for a destination.',
    parametersExplanation: 'Crucial for verifying policy-based forwarding (PBF) and routing table accuracy.',
    exampleOutput: `--------------------------------------------------
fib lookup for ip 8.8.8.8
--------------------------------------------------
interface ethernet1/1, nexthop 203.0.113.1`
  },

  // Windows Commands
  {
    id: 'cmd-w1',
    platform: 'Windows',
    category: 'Interface & IP',
    command: 'ipconfig /all',
    description: 'Displays detailed TCP/IP configuration for all network adapters, including MAC address, DHCP lease timestamps, and DNS server addresses.',
    parametersExplanation: 'Run "ipconfig /release" followed by "ipconfig /renew" to refresh DHCP lease.',
    exampleOutput: `Ethernet adapter Ethernet0:
   Connection-specific DNS Suffix  . : corp.local
   Description . . . . . . . . . . . : Intel(R) 82574L Gigabit Network Connection
   Physical Address. . . . . . . . . : 00-0C-29-4F-8E-35
   DHCP Enabled. . . . . . . . . . . : Yes
   IPv4 Address. . . . . . . . . . . : 192.168.10.25(Preferred) 
   Subnet Mask . . . . . . . . . . . : 255.255.255.0
   Default Gateway . . . . . . . . . : 192.168.10.1
   DNS Servers . . . . . . . . . . . : 8.8.8.8, 1.1.1.1`
  },
  {
    id: 'cmd-w2',
    platform: 'Windows',
    category: 'Diagnostics & Packet Flow',
    command: 'Test-NetConnection 192.168.20.10 -Port 3389',
    description: 'PowerShell diagnostic testing TCP layer 4 connectivity to a specific port on remote target (modern replacement for telnet client).',
    parametersExplanation: 'Returns "TcpTestSucceeded : True" if connection handshake succeeds.',
    exampleOutput: `ComputerName     : 192.168.20.10
RemoteAddress    : 192.168.20.10
RemotePort       : 3389
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.10.25
TcpTestSucceeded : True`
  }
];

export const INITIAL_BLOG_POSTS: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'How VLANs and 802.1Q Trunking Work Under the Hood: A Deep Dive',
    slug: 'vlan-8021q-trunking-deep-dive',
    category: 'Switching & Architecture',
    date: 'Sep 18, 2026',
    readTime: '6 min read',
    tags: ['VLAN', '802.1Q', 'Trunking', 'Cisco IOS', 'Switching'],
    summary: 'An engineer\'s technical breakdown of Ethernet frame tagging, the 4-byte 802.1Q header, native VLAN security implications, and common inter-switch pitfalls.',
    content: `Virtual Local Area Networks (VLANs) remain one of the most critical foundational concepts in enterprise networking. In a standard Ethernet LAN, all connected devices share a single broadcast domain. Whenever an ARP request or DHCP discovery is sent, every single workstation must process the interrupt.

### The 802.1Q Tag Structure
When an Ethernet frame leaves an access port and traverses a trunk link, the switch inserts a 4-byte (32-bit) 802.1Q header directly between the Source MAC address and EtherType field:
- **TPID (Tag Protocol Identifier)**: 2 bytes set to 0x8100 identifying the frame as 802.1Q tagged.
- **PCP (Priority Code Point)**: 3 bits for 802.1p Quality of Service (QoS) class marking.
- **DEI (Drop Eligible Indicator)**: 1 bit for packet discard preference during congestion.
- **VID (VLAN Identifier)**: 12 bits supporting 4,094 distinct VLANs (1 to 4094).

### Native VLAN Security & Best Practices
By default, Cisco switches assign Native VLAN 1 to trunks. Frames belonging to the native VLAN are transmitted across the wire un-tagged.
If an attacker sends double-tagged packets (Outer VLAN 1, Inner VLAN 20), a vulnerable switch may strip the outer tag and forward the packet into VLAN 20 without router inspection—a vulnerability known as **VLAN Hopping**.

**Recommended Hardening Practice:**
1. Explicitly change native VLAN to an unused ID (e.g. VLAN 99 or 999).
2. Prune unused VLANs with \`switchport trunk allowed vlan\`.
3. Enable \`vlan dot1q tag native\` in global configuration to tag native traffic as well.`
  },
  {
    id: 'blog-2',
    title: 'Configuring and Troubleshooting Single & Multi-Area OSPF',
    slug: 'ospf-configuration-troubleshooting-guide',
    category: 'Routing Protocols',
    date: 'Sep 10, 2026',
    readTime: '8 min read',
    tags: ['OSPF', 'Routing', 'Cisco', 'Dijkstra', 'Multi-Area'],
    summary: 'Mastering OSPF adjacency states, Link-State Advertisements (LSAs 1 through 5), DR/BDR election mechanics, and real-world debugging steps.',
    content: `Open Shortest Path First (OSPF) is an open-standard Link-State interior gateway protocol utilizing Dijkstra's Shortest Path First (SPF) algorithm. Unlike distance-vector protocols that route by hearsay, every router inside an OSPF area maintains an identical Link-State Database (LSDB) of the topology.

### The OSPF Adjacency State Machine
Understanding the transition states is essential for rapid troubleshooting:
1. **Down**: No Hello packets received yet.
2. **Init**: Received Hello from peer, but your own Router ID is not listed in the neighbor list.
3. **2-Way**: Bidirectional communication verified. On multi-access broadcast links, DR and BDR election occurs here.
4. **ExStart**: Master/Slave relationship established based on highest Router ID to sequence DBD packets.
5. **Exchange**: Routers exchange Database Description (DBD) packets containing LSA headers.
6. **Loading**: Routers send Link-State Requests (LSR) for missing routes and receive Link-State Updates (LSU).
7. **Full**: LSDBs are fully synchronized; shortest path tree calculation runs.

### The 4 Most Common Causes of Neighbor Drops
1. **MTU Mismatch**: Routers get perpetually stuck in EXSTART state. Run \`show interfaces | inc MTU\`.
2. **Subnet Mask Mismatch**: OSPF Hellos will be rejected silently on broadcast networks.
3. **Hello/Dead Timer Discrepancy**: Default 10s Hello / 40s Dead. Must match exactly.
4. **Area ID / Stub Flag Mismatch**: Ensure area numbers and stub options are consistent across interfaces.`
  },
  {
    id: 'blog-3',
    title: 'BGP Fundamentals: eBGP vs iBGP Route Propagation',
    slug: 'bgp-fundamentals-ebgp-ibgp',
    category: 'WAN & Routing',
    date: 'Aug 28, 2026',
    readTime: '7 min read',
    tags: ['BGP', 'eBGP', 'iBGP', 'Internet Edge', 'AS-Path'],
    summary: 'Why BGP is the routing protocol of the global Internet: Autonomous Systems, path vector attributes, the iBGP split-horizon rule, and next-hop-self configuration.',
    content: `Border Gateway Protocol (BGPv4) is the path-vector protocol that glues the global Internet together. While interior protocols (OSPF, EIGRP) optimize for speed within a single network, BGP optimizes for scalable policy control across autonomous organizational boundaries.

### eBGP vs. iBGP: Key Differences
- **eBGP (External BGP)**: Runs between different Autonomous Systems. Decrements TTL by 1 (default TTL = 1; directly connected). Administrative Distance in Cisco is 20.
- **iBGP (Internal BGP)**: Runs within the same Autonomous System. Does not change next-hop attribute by default (requires \`neighbor x.x.x.x next-hop-self\`). Administrative Distance is 200.

### The iBGP Split-Horizon Rule
To prevent routing loops within an AS where BGP does not track AS-Path changes, **iBGP will not advertise a route learned from an iBGP peer to another iBGP peer**.
Consequently, an enterprise requires either:
1. A full mesh of iBGP peerings across all internal BGP speakers.
2. Route Reflectors (RR) to safely distribute routes without full mesh overhead.`
  },
  {
    id: 'blog-4',
    title: 'Essential Linux Networking Commands Every Network Engineer Must Know',
    slug: 'essential-linux-networking-commands',
    category: 'Linux Administration',
    date: 'Aug 14, 2026',
    readTime: '5 min read',
    tags: ['Linux', 'iproute2', 'tcpdump', 'ss', 'Sysadmin'],
    summary: 'A field guide transitioning from legacy ifconfig/netstat to the modern iproute2 suite, ss, iptables, and socket diagnostics.',
    content: `Modern network infrastructure relies heavily on Linux: cloud hypervisors, software-defined routers, container overlay networks, and enterprise appliances all run Linux kernels.

### The Modern Command Replacements
- Replace \`ifconfig\` with \`ip -brief addr show\`.
- Replace \`route -n\` with \`ip route show\`.
- Replace \`netstat -tlpn\` with \`ss -tulpn\`.
- Replace \`arp -a\` with \`ip neigh show\`.

### Capturing Live Packets with tcpdump
When troubleshooting Layer 2/3 drops, nothing beats raw packet inspection:
\`\`\`bash
# Capture 100 packets on interface eth0 on port 53 (DNS) without resolving IPs:
sudo tcpdump -i eth0 -nn -c 100 port 53

# Inspect TCP SYN packets to verify 3-way handshake initiation:
sudo tcpdump -i eth0 'tcp[tcpflags] & tcp-syn != 0'
\`\`\``
  }
];

export const INITIAL_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'Cisco Certified Network Associate (CCNA 200-301)',
    issuer: 'Cisco Systems',
    issueDate: '2023 - 2026',
    credentialId: 'CSCO-CCNA-2023-882194',
    status: 'Verified',
    verifyUrl: 'https://www.credly.com/',
    skills: ['Network Fundamentals', 'Network Access (VLANs & Trunks)', 'IP Connectivity (OSPFv2)', 'IP Services (DHCP, NAT, NTP)', 'Security Fundamentals (ACLs, Port Security)', 'Automation & Programmability'],
    description: 'Validates comprehensive knowledge in foundational networking, enterprise routing and switching, network security, and infrastructure configuration.'
  },
  {
    id: 'cert-2',
    title: 'Palo Alto Networks Certified Network Security Administrator (PCNSA)',
    issuer: 'Palo Alto Networks',
    issueDate: '2024 - 2026',
    credentialId: 'PAN-PCNSA-994102',
    status: 'Verified',
    verifyUrl: 'https://www.credly.com/',
    skills: ['Next-Gen Firewall Architecture', 'Security & NAT Policies', 'App-ID & Content-ID', 'User-ID Integration', 'GlobalProtect VPN', 'Active/Passive High Availability'],
    description: 'Demonstrates expertise in deploying, configuring, maintaining, and troubleshooting Palo Alto Networks Next-Generation Firewalls to secure modern enterprise networks.'
  },
  {
    id: 'cert-3',
    title: 'AWS Certified Solutions Architect – Associate',
    issuer: 'Amazon Web Services',
    issueDate: '2024 - 2027',
    credentialId: 'AWS-SAA-7719284',
    status: 'Verified',
    verifyUrl: 'https://aws.amazon.com/verification',
    skills: ['Virtual Private Cloud (VPC)', 'Transit Gateway & Peering', 'Hybrid Cloud IPsec VPN', 'Route 53 & Direct Connect', 'IAM & Cloud Security', 'High Availability Design'],
    description: 'Validates technical skills in architecting secure, resilient, high-performance, and cost-optimized cloud and hybrid enterprise infrastructure.'
  },
  {
    id: 'cert-4',
    title: 'Linux Professional Institute / RHCSA Aligned',
    issuer: 'Linux Foundation / Red Hat Aligned',
    issueDate: '2023 - Present',
    credentialId: 'LPIC-SYS-44109',
    status: 'Verified',
    verifyUrl: 'https://lpi.org',
    skills: ['Linux Kernel & Networking', 'Systemd Services', 'Netplan & NetworkManager', 'iptables / UFW Security', 'Storage & LVM', 'Shell Scripting Automation'],
    description: 'Certifies practical proficiency in Linux server administration, network interface configuration, system automation, and perimeter host defense.'
  },
  {
    id: 'cert-5',
    title: 'SAP Business One & SAP BASIS Infrastructure Administration',
    issuer: 'SAP Partner Ecosystem',
    issueDate: '2023 - Present',
    credentialId: 'SAP-B1-INFRA-2023',
    status: 'Verified',
    verifyUrl: 'https://www.sap.com',
    skills: ['SAP Business One Architecture', 'SAP BASIS Administration', 'SAP HANA Database Management', 'ERP Network QoS Optimization', 'Disaster Recovery & Backup Automation'],
    description: 'Demonstrates practical ability to deploy, manage, optimize, and maintain critical ERP server environments and database networking infrastructure.'
  }
];

export const INITIAL_TOPOLOGY_DEVICES: TopologyDevice[] = [
  {
    id: 'dev-internet',
    name: 'Internet Edge (Tier-1 ISP)',
    type: 'internet',
    ipAddress: '203.0.113.1',
    subnetMask: '255.255.255.252 (/30)',
    primaryInterface: 'WAN-Uplink',
    routingProtocol: 'BGP (AS 65200)',
    status: 'UP / UP',
    details: {
      model: 'Carrier Optical Transceiver',
      uptime: '382 days 14 hours',
      description: 'Upstream Transit Carrier providing BGP default route and public IPv4 allocation (203.0.113.0/30).',
      openPorts: ['BGP: 179', 'ICMP Echo']
    }
  },
  {
    id: 'dev-firewall',
    name: 'Perimeter Next-Gen Firewall',
    type: 'firewall',
    ipAddress: '203.0.113.2',
    subnetMask: '255.255.255.252 (External) | 10.0.0.1/30 (Internal)',
    defaultGateway: '203.0.113.1',
    primaryInterface: 'Eth1/1 (Untrust) / Eth1/2 (Trust)',
    routingProtocol: 'Static / BGP Route Exchange',
    status: 'UP / UP',
    details: {
      model: 'Palo Alto PA-3220 NGFW',
      uptime: '142 days 6 hours',
      macAddress: '00:1B:17:89:A4:01',
      activeSessions: 384,
      description: 'High-availability perimeter gateway enforcing App-ID zero-trust inspection, NAT Overload, SSL forward proxy decryption, and anti-threat signatures.',
      openPorts: ['HTTPS: 443 (Management)', 'IPsec: 500/4500 (VPN)']
    }
  },
  {
    id: 'dev-router',
    name: 'Cisco Core Router (RTR-CORE-01)',
    type: 'router',
    ipAddress: '10.0.0.2',
    subnetMask: '255.255.255.252 (/30)',
    defaultGateway: '10.0.0.1 (Firewall)',
    primaryInterface: 'Gi0/0/0 (WAN) / Gi0/0/1 (To Core Switch)',
    routingProtocol: 'OSPFv2 Area 0 / BFD',
    status: 'UP / UP',
    details: {
      model: 'Cisco ISR 4431 / K9',
      uptime: '98 days 21 hours',
      macAddress: '00:62:EC:12:34:AA',
      description: 'Central distribution router handling high-speed route forwarding, QoS shaping for ERP traffic, and BFD sub-second link monitoring.',
      openPorts: ['SSH: 22 (VTY Protected)', 'OSPF: Multicast 224.0.0.5']
    }
  },
  {
    id: 'dev-switch',
    name: 'Multilayer Core Switch (SW-CORE-01)',
    type: 'core_switch',
    ipAddress: '10.0.1.1 (Management) | SVI Gateways: .10.1, .20.1, .30.1',
    subnetMask: '255.255.255.0 (/24)',
    defaultGateway: '10.0.0.2',
    primaryInterface: 'TenGig1/1/1 (Trunk)',
    vlan: 'VLAN 10, 20, 30, 99',
    routingProtocol: 'Layer 3 Wire-Speed SVI Switching',
    status: 'UP / UP',
    details: {
      model: 'Cisco Catalyst 3850-24XU (StackWise)',
      uptime: '180 days 12 hours',
      macAddress: 'F8:B7:E2:44:88:00',
      description: 'Multilayer backbone switch providing SVI hardware inter-VLAN routing, Rapid-PVST+ root bridge priority 4096, and 802.3ad LACP link aggregation.',
      openPorts: ['SSH: 22', 'SNMPv3: 161']
    }
  },
  {
    id: 'dev-vlan10',
    name: 'Engineering & Staff Workstations',
    type: 'pc',
    ipAddress: '192.168.10.0/24 (Clients: .10 - .254)',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.10.1 (Core SVI)',
    primaryInterface: 'Fa0/1 - Fa0/24 (Access Mode)',
    vlan: 'VLAN 10 (ENGINEERING)',
    routingProtocol: 'Default Route via SVI',
    status: 'UP / UP',
    details: {
      model: 'Access Segment: 65+ Workstations',
      uptime: 'Operational',
      description: 'Secure engineering sub-network with dynamic DHCP addressing, DHCP Snooping protection, and strict 802.1X port authentication.',
      openPorts: ['RDP: 3389', 'HTTPS: 443']
    }
  },
  {
    id: 'dev-vlan20',
    name: 'Datacenter & SAP Server Farm',
    type: 'server',
    ipAddress: '192.168.20.0/24 (Servers: .10 - .50)',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.20.1 (Core SVI)',
    primaryInterface: 'Gi1/0/1 - Gi1/0/8 (Server Trunks)',
    vlan: 'VLAN 20 (SERVERS_DMZ)',
    routingProtocol: 'Static / High Availability',
    status: 'UP / UP',
    details: {
      model: 'Dell PowerEdge R740 & HPE ProLiant Gen10',
      uptime: '210 days 4 hours',
      description: 'Mission-critical enterprise servers hosting SAP Business One HANA, Active Directory Domain Controllers, DNS resolvers, and Linux database clusters.',
      openPorts: ['SAP: 30015', 'SQL: 1433', 'DNS: 53', 'SSH: 22']
    }
  },
  {
    id: 'dev-vlan30',
    name: 'Enterprise Wi-Fi & Mobile Clients',
    type: 'wifi',
    ipAddress: '192.168.30.0/24 (AP & Clients)',
    subnetMask: '255.255.255.0',
    defaultGateway: '192.168.30.1 (Core SVI)',
    primaryInterface: 'Gi1/0/20 - Gi1/0/24 (PoE+ Trunk to APs)',
    vlan: 'VLAN 30 (WIRELESS_CORPORATE)',
    routingProtocol: 'WPA3 Enterprise / 802.1X',
    status: 'UP / UP',
    details: {
      model: 'Cisco Catalyst 9120AX Series Wi-Fi 6 APs',
      uptime: '90 days 3 hours',
      description: 'High-density wireless access infrastructure with WPA3 Enterprise authentication, client isolation, and automatic RF channel coordination.',
      openPorts: ['CAPWAP: 5246/5247', 'RADIUS: 1812']
    }
  }
];

export const PROFILE_INFO = {
  name: 'Afzal Ahmad',
  title: 'Network Engineer | Network Support Engineer | IT Infrastructure',
  subtitle: 'Designing, configuring, troubleshooting, and maintaining secure and reliable network infrastructure.',
  experience: 'Hands-on experience in enterprise routing, switching, perimeter firewall defense, Linux administration, and hybrid cloud networking.',
  location: 'Available for Remote & On-Site Roles',
  email: 'afzalerd@gmail.com',
  phone: '+918193817061',
  linkedin: 'https://www.linkedin.com/in/afzal-ahmad-2615363a5/',
  github: 'https://github.com/dashboard',
  summary: `Results-driven Network & Infrastructure Support Engineer with extensive hands-on experience in designing, configuring, troubleshooting, and maintaining enterprise networks. Proficient in Cisco IOS/XE (Catalyst, ISR, ASR), Palo Alto Next-Generation Firewalls, Linux server administration, AWS hybrid cloud networking, and SAP Business One / SAP BASIS infrastructure. Proven track record of resolving complex Layer 2/Layer 3 connectivity incidents, implementing zero-trust network segregation, eliminating network broadcast loops, and ensuring 99.99% high availability for business-critical operations.`,
  technicalInterests: [
    'Enterprise Routing & Switching (OSPF, BGP, VLANs, 802.1Q)',
    'Next-Gen Firewalls & Zero Trust Architecture (Palo Alto, ACLs, IPsec VPN)',
    'Network High Availability (HSRP, VRRP, LACP EtherChannel, Active/Passive HA)',
    'Linux System Administration & Network Automation (iproute2, bash, nftables)',
    'Hybrid Cloud Networking (AWS VPC, Transit Gateway, Direct Connect)',
    'Mission-Critical ERP Infrastructure (SAP Business One, SAP HANA, BASIS)'
  ],
  education: [
    {
      degree: 'Bachelor of Technology (B.Tech) in Computer Science / Information Technology',
      institution: 'Technical University',
      period: 'Graduated with First Class Distinction',
      focus: 'Computer Networks, Operating Systems, Cryptography & Network Security, Distributed Systems'
    }
  ],
  skillsMatrix: {
    routingSwitching: [
      { name: 'VLAN & 802.1Q Trunking', level: 95 },
      { name: 'Inter-VLAN Routing (SVI & ROAS)', level: 95 },
      { name: 'OSPFv2 Multi-Area', level: 90 },
      { name: 'BGP (eBGP / iBGP)', level: 85 },
      { name: 'Spanning Tree (STP, Rapid-PVST+)', level: 90 },
      { name: 'LACP EtherChannel (802.3ad)', level: 92 },
      { name: 'Static & Floating Static Routing', level: 98 },
      { name: 'RIPv2 Routing', level: 88 },
      { name: 'DHCP & Relay Agent (ip helper)', level: 96 },
      { name: 'NAT / PAT (Overload)', level: 95 }
    ],
    security: [
      { name: 'Palo Alto Next-Gen Firewall', level: 88 },
      { name: 'Standard & Extended ACLs', level: 95 },
      { name: 'Site-to-Site IPsec VPN', level: 90 },
      { name: 'Security & NAT Policies', level: 90 },
      { name: 'App-ID & User-ID Zero Trust', level: 85 },
      { name: 'Port Security & DHCP Snooping', level: 92 }
    ],
    infrastructure: [
      { name: 'Cisco Catalyst Switches (2960, 3850, 9300)', level: 95 },
      { name: 'Cisco ISR & ASR Routers (4331, 4451, 1001-X)', level: 90 },
      { name: 'Wireless Networking (WLAN, APs, WLC)', level: 85 },
      { name: 'DNS & DHCP Server Management', level: 94 },
      { name: 'TCP/IP Protocol Suite & Wireshark', level: 95 },
      { name: 'Physical Cabling, Fiber & Rack Mounts', level: 92 }
    ],
    operatingSystems: [
      { name: 'Linux Server (Ubuntu, RHEL, SLES)', level: 90 },
      { name: 'Windows Server 2019/2022 & Active Directory', level: 88 },
      { name: 'Bash Shell Scripting', level: 82 },
      { name: 'iproute2, ss, iptables, systemd-networkd', level: 92 }
    ],
    cloud: [
      { name: 'AWS VPC Architecture', level: 85 },
      { name: 'AWS Transit Gateway (TGW)', level: 82 },
      { name: 'AWS Site-to-Site VPN & Direct Connect', level: 80 },
      { name: 'Cloud Route 53 & Security Groups', level: 88 }
    ],
    enterpriseApps: [
      { name: 'SAP Business One Administration', level: 85 },
      { name: 'SAP BASIS Infrastructure', level: 82 },
      { name: 'SAP HANA Linux Interconnects', level: 80 },
      { name: 'ERP Network QoS Optimization', level: 86 }
    ]
  }
};
