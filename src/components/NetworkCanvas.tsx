import React, { useEffect, useRef } from 'react';

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  type: 'router' | 'switch' | 'firewall' | 'server' | 'cloud' | 'node';
  label?: string;
}

interface Packet {
  sourceIndex: number;
  targetIndex: number;
  progress: number;
  speed: number;
  color: string;
}

export const NetworkCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
      initNodes();
    };

    window.addEventListener('resize', handleResize);

    const nodeCount = Math.min(Math.floor(width / 32), 48);
    let nodes: Node[] = [];
    let packets: Packet[] = [];

    const types: ('router' | 'switch' | 'firewall' | 'server' | 'cloud' | 'node')[] = [
      'router',
      'switch',
      'firewall',
      'server',
      'cloud',
      'node',
      'node',
    ];

    const initNodes = () => {
      nodes = [];
      for (let i = 0; i < nodeCount; i++) {
        nodes.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.45,
          vy: (Math.random() - 0.5) * 0.45,
          radius: Math.random() * 2 + 2.5,
          type: types[Math.floor(Math.random() * types.length)],
        });
      }
    };

    initNodes();

    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);

    // Spawn packets intermittently
    const packetInterval = setInterval(() => {
      if (nodes.length < 2) return;
      if (packets.length > 25) return;
      const src = Math.floor(Math.random() * nodes.length);
      // find close target
      for (let j = 0; j < nodes.length; j++) {
        if (src !== j) {
          const dx = nodes[src].x - nodes[j].x;
          const dy = nodes[src].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 180) {
            packets.push({
              sourceIndex: src,
              targetIndex: j,
              progress: 0,
              speed: 0.008 + Math.random() * 0.015,
              color: Math.random() > 0.4 ? '#06b6d4' : '#10b981',
            });
            break;
          }
        }
      }
    }, 280);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid overlay
      ctx.strokeStyle = 'rgba(30, 41, 59, 0.25)';
      ctx.lineWidth = 1;
      const gridSize = 60;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Update node positions
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 0 || n.x > width) n.vx *= -1;
        if (n.y < 0 || n.y > height) n.vy *= -1;

        // Subtle mouse push
        const mdx = n.x - mouseX;
        const mdy = n.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100 && mdist > 0) {
          n.x += (mdx / mdist) * 0.8;
          n.y += (mdy / mdist) * 0.8;
        }
      }

      // Draw connecting links
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 160) {
            const alpha = (1 - dist / 160) * 0.28;
            ctx.strokeStyle = `rgba(14, 165, 233, ${alpha})`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw and advance packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const p = packets[i];
        p.progress += p.speed;
        if (p.progress >= 1) {
          packets.splice(i, 1);
          continue;
        }

        const src = nodes[p.sourceIndex];
        const tgt = nodes[p.targetIndex];
        if (!src || !tgt) {
          packets.splice(i, 1);
          continue;
        }

        const px = src.x + (tgt.x - src.x) * p.progress;
        const py = src.y + (tgt.y - src.y) * p.progress;

        // Glow
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      }

      // Draw nodes
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);

        if (n.type === 'router') {
          ctx.fillStyle = '#38bdf8'; // sky blue
        } else if (n.type === 'switch') {
          ctx.fillStyle = '#34d399'; // emerald
        } else if (n.type === 'firewall') {
          ctx.fillStyle = '#f87171'; // red/orange
        } else if (n.type === 'server') {
          ctx.fillStyle = '#a78bfa'; // violet
        } else {
          ctx.fillStyle = '#64748b'; // slate
        }

        ctx.fill();

        // Subtle outer pulse ring on larger nodes
        if (n.radius > 3) {
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.25)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(n.x, n.y, n.radius + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(packetInterval);
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto opacity-80 mix-blend-screen"
    />
  );
};
