import React, { useEffect, useRef } from 'react';

export default function RetroCursorTrail() {
  const canvasRef = useRef(null);
  const lastPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    
    // Retro colors palette matching the site design
    const colors = [
      { r: 232, g: 93, b: 74 },  // #E85D4A (Red)
      { r: 200, g: 230, b: 80 }, // #C8E650 (Lime)
      { r: 107, g: 159, b: 212 }, // #6B9FD4 (Blue)
      { r: 255, g: 255, b: 255 }  // White
    ];

    // Resize handler
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e) => {
      const x = e.clientX;
      const y = e.clientY;

      // Calculate distance moved
      const dx = x - lastPos.current.x;
      const dy = y - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Only spawn particle if cursor moved a bit (prevents overloading)
      if (dist > 12) {
        // Choose a random color from palette
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        // Add particle
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 2, // horizontal drift
          vy: -Math.random() * 1.5 - 0.5, // vertical velocity (starts upwards)
          size: Math.random() > 0.5 ? 3 : 2, // pixel size unit
          color,
          alpha: 1,
          decay: 0.02 + Math.random() * 0.015, // fade rate
          gravity: 0.05 // slow fall
        });

        lastPos.current = { x, y };
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.forEach((p) => {
        // Physics
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.alpha -= p.decay;

        if (p.alpha > 0) {
          ctx.fillStyle = `rgba(${p.color.r}, ${p.color.g}, ${p.color.b}, ${p.alpha})`;
          const s = p.size;
          
          // Draw retro pixel cross star
          // Center pixel
          ctx.fillRect(p.x - s / 2, p.y - s / 2, s, s);
          // Top, bottom, left, right pixels to make a retro cross
          ctx.fillRect(p.x - s - s / 2, p.y - s / 2, s, s);
          ctx.fillRect(p.x + s - s / 2, p.y - s / 2, s, s);
          ctx.fillRect(p.x - s / 2, p.y - s - s / 2, s, s);
          ctx.fillRect(p.x - s / 2, p.y + s - s / 2, s, s);
        }
      });

      // Remove dead particles
      particles = particles.filter((p) => p.alpha > 0);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 99999,
      }}
    />
  );
}
