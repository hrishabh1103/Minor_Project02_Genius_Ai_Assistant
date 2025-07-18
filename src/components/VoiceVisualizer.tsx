import React, { useEffect, useRef } from 'react';

interface VoiceVisualizerProps {
  isActive: boolean;
}

const VoiceVisualizer: React.FC<VoiceVisualizerProps> = ({ isActive }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; speed: number; angle: number; }[] = [];

    const resizeCanvas = () => {
      const size = Math.min(window.innerWidth, window.innerHeight) * 0.4; // Reduced from 0.6 to 0.4
      canvas.width = size;
      canvas.height = size;
    };

    const createParticles = () => {
      particles = [];
      const numParticles = 80;
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.2 + Math.random() * 0.8;
        const size = 1 + Math.random() * 2;
        
        particles.push({
          x: centerX,
          y: centerY,
          size,
          speed,
          angle
        });
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw outer circle
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const outerRadius = canvas.width / 2 - 10;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.2)';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw inner pulse circle
      const pulseRadius = outerRadius * 0.85;
      const pulseVariation = isActive ? Math.sin(Date.now() * 0.005) * 20 : 5;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, pulseRadius + pulseVariation, 0, Math.PI * 2);
      const gradient = ctx.createRadialGradient(
        centerX, centerY, pulseRadius - 20,
        centerX, centerY, pulseRadius + pulseVariation + 20
      );
      gradient.addColorStop(0, 'rgba(0, 255, 255, 0)');
      gradient.addColorStop(0.5, isActive ? 'rgba(138, 43, 226, 0.4)' : 'rgba(30, 144, 255, 0.2)');
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0)');
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Update and draw particles
      if (isActive) {
        particles.forEach(particle => {
          // Move particle outward
          particle.x += Math.cos(particle.angle) * particle.speed;
          particle.y += Math.sin(particle.angle) * particle.speed;
          
          // Calculate distance from center
          const dx = particle.x - centerX;
          const dy = particle.y - centerY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Define opacity based on distance
          const maxDistance = outerRadius;
          const opacity = 1 - (distance / maxDistance);
          
          if (opacity > 0) {
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(0, 255, 255, ${opacity})`;
            ctx.fill();
          }
          
          // Reset particle if it goes beyond the outer circle
          if (distance > outerRadius) {
            particle.x = centerX;
            particle.y = centerY;
            particle.angle = Math.random() * Math.PI * 2;
          }
        });
      }
      
      // Draw center core
      ctx.beginPath();
      ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
      const coreGradient = ctx.createRadialGradient(
        centerX, centerY, 5,
        centerX, centerY, 30
      );
      coreGradient.addColorStop(0, isActive ? 'rgba(138, 43, 226, 0.9)' : 'rgba(30, 144, 255, 0.7)');
      coreGradient.addColorStop(1, isActive ? 'rgba(0, 255, 255, 0.5)' : 'rgba(0, 255, 255, 0.3)');
      ctx.fillStyle = coreGradient;
      ctx.fill();
      
      // Draw pulsing rings
      for (let i = 0; i < 3; i++) {
        const time = Date.now() * 0.001;
        const ringPhase = i * (Math.PI * 2 / 3);
        const ringPulse = Math.sin(time * 2 + ringPhase);
        const ringRadius = 40 + i * 25 + (isActive ? ringPulse * 10 : ringPulse * 5);
        
        ctx.beginPath();
        ctx.arc(centerX, centerY, ringRadius, 0, Math.PI * 2);
        ctx.strokeStyle = isActive 
          ? `rgba(138, 43, 226, ${0.2 + ringPulse * 0.2})` 
          : `rgba(30, 144, 255, ${0.1 + ringPulse * 0.1})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    resizeCanvas();
    createParticles();
    animate();
    
    window.addEventListener('resize', () => {
      resizeCanvas();
      createParticles();
    });

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [isActive]);

  return (
    <div className="relative flex items-center justify-center mb-8">
      <canvas 
        ref={canvasRef}
        className="max-w-full transition-all duration-500"
      />
      <div className="absolute pointer-events-none text-center">
        <p className="text-sm lg:text-base text-cyan-400 font-bold tracking-wider uppercase mb-1">
          {isActive ? "LISTENING" : "STANDBY"}
        </p>
        <h2 className="text-2xl lg:text-3xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-300 to-purple-500">
          GENIUS
        </h2>
      </div>
    </div>
  );
};

export default VoiceVisualizer;