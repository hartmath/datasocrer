import React, { useEffect, useRef } from 'react';

const MatrixRain = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Enhanced Matrix characters including insurance/data terms
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    const dataTerms = ['LEAD', 'DATA', 'HEALTH', 'LIFE', 'MEDICARE', 'B2B', 'B2C', 'API', 'TCPA', 'VERIFIED'];
    const symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    const allChars = (matrixChars + symbols).split('');
    
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const drops: number[] = [];
    const speeds: number[] = [];
    const brightness: number[] = [];

    // Initialize drops with random properties
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
      speeds[i] = Math.random() * 0.5 + 0.5;
      brightness[i] = Math.random();
    }

    let frame = 0;

    const draw = () => {
      // Black background with slight transparency for trail effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = `${fontSize}px 'Courier New', monospace`;

      for (let i = 0; i < drops.length; i++) {
        // Occasionally use data terms instead of random characters
        let text;
        if (Math.random() > 0.95 && frame % 60 === 0) {
          text = dataTerms[Math.floor(Math.random() * dataTerms.length)];
          ctx.font = `${fontSize - 2}px 'Courier New', monospace`;
        } else {
          text = allChars[Math.floor(Math.random() * allChars.length)];
          ctx.font = `${fontSize}px 'Courier New', monospace`;
        }

        // Dynamic green color with brightness variation
        const alpha = brightness[i] * 0.8 + 0.2;
        const greenIntensity = Math.floor(brightness[i] * 100 + 155);
        ctx.fillStyle = `rgba(0, ${greenIntensity}, 65, ${alpha})`;

        // Add glow effect for some characters
        if (brightness[i] > 0.8) {
          ctx.shadowColor = '#00ff41';
          ctx.shadowBlur = 10;
        } else {
          ctx.shadowBlur = 0;
        }

        const x = i * fontSize;
        const y = drops[i] * fontSize;

        ctx.fillText(text, x, y);

        // Reset drop to top randomly or when it goes off screen
        if (y > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          speeds[i] = Math.random() * 0.5 + 0.5;
          brightness[i] = Math.random();
        }

        drops[i] += speeds[i];
        
        // Slight brightness variation for shimmer effect
        brightness[i] += (Math.random() - 0.5) * 0.1;
        brightness[i] = Math.max(0.1, Math.min(1, brightness[i]));
      }

      frame++;
    };

    const interval = setInterval(draw, 50);

    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'black' }}
    />
  );
};

export default MatrixRain;