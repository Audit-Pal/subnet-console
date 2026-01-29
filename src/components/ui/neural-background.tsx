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
    color: string;
    reset: () => void;
}

interface MousePosition {
    x: number;
    y: number;
}

// Particle class definition moved outside component
class ParticleClass implements Particle {
    x: number = 0;
    y: number = 0;
    size: number = 0;
    radius: number = 0; // Added to match Particle interface
    speedX: number = 0;
    speedY: number = 0;
    vx: number = 0; // Added to match Particle interface
    vy: number = 0; // Added to match Particle interface
    color: string = '';
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor(canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.reset();
    }

    reset() {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * 2 + 0.5;
        this.radius = this.size;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.vx = this.speedX;
        this.vy = this.speedY;
        this.color = `rgba(30, 186, 152, ${Math.random() * 0.5})`;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.size > 0.2) this.size -= 0.01;

        if (this.x < 0 || this.x > this.canvas.width || this.y < 0 || this.y > this.canvas.height) {
            this.reset();
        }
    }

    draw() {
        this.ctx.fillStyle = this.color;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        this.ctx.fill();
    }
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

        // Initialize particles
        const particleCount = 80;
        const particles: Particle[] = [];

        for (let i = 0; i < particleCount; i++) {
            particles.push(new ParticleClass(canvas, ctx));
        }
        particlesRef.current = particles;

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

                    if (distance < 150) {
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
