"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    update(): void;
    draw(): void;
}

interface MousePosition {
    x: number;
    y: number;
}

export function NeuralBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Particle class
        class ParticleClass implements Particle {
            x: number = 0;
            y: number = 0;
            vx: number = 0;
            vy: number = 0;
            radius: number = 0;

            constructor() {
                if (!canvas) return;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                if (!canvas) return;
                this.x += this.vx;
                this.y += this.vy;

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;
            }

            draw() {
                if (!ctx) return;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = "rgba(99, 102, 241, 0.6)";
                ctx.fill();
            }
        }

        // Initialize particles
        const particleCount = 80;
        for (let i = 0; i < particleCount; i++) {
            const particle = new ParticleClass();
            if (particle.x !== undefined) { // Only add if properly initialized
                particlesRef.current.push(particle);
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            if (!ctx || !canvas) return;
            ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            particlesRef.current.forEach((particle: Particle, i: number) => {
                particle.update();
                particle.draw();

                // Draw connections
                particlesRef.current.slice(i + 1).forEach((otherParticle: Particle) => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 150 && ctx) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(otherParticle.x, otherParticle.y);
                        ctx.strokeStyle = `rgba(99, 102, 241, ${0.2 * (1 - distance / 150)})`;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                });

                // Mouse interaction
                const mouseDistance = Math.sqrt(
                    Math.pow(particle.x - mouseRef.current.x, 2) +
                    Math.pow(particle.y - mouseRef.current.y, 2)
                );

                if (mouseDistance < 100) {
                    const angle = Math.atan2(
                        particle.y - mouseRef.current.y,
                        particle.x - mouseRef.current.x
                    );
                    particle.vx += Math.cos(angle) * 0.2;
                    particle.vy += Math.sin(angle) * 0.2;
                }

                // Damping
                particle.vx *= 0.99;
                particle.vy *= 0.99;
            });

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none bg-linear-to-br from-white via-zinc-50 to-zinc-100"
        />
    );
}
