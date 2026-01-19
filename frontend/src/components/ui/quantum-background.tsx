"use client";

import { useEffect, useRef, useState } from "react";

interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    connections: number[];
    update(): void;
    draw(): void;
}

interface MousePosition {
    x: number;
    y: number;
}

export function QuantumBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particlesRef = useRef<Particle[]>([]);
    const mouseRef = useRef<MousePosition>({ x: 0, y: 0 });
    const [glitchActive, setGlitchActive] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let time = 0;
        
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        // Quantum Particle class
        class QuantumParticle implements Particle {
            x: number = 0;
            y: number = 0;
            vx: number = 0;
            vy: number = 0;
            radius: number = 0;
            connections: number[] = [];
            quantumState: number = 0;
            phase: number = 0;

            constructor() {
                if (!canvas) return;
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = (Math.random() - 0.5) * 0.3;
                this.vy = (Math.random() - 0.5) * 0.3;
                this.radius = Math.random() * 3 + 0.5;
                this.connections = [];
                this.quantumState = Math.random();
                this.phase = Math.random() * Math.PI * 2;
            }

            update() {
                if (!canvas) return;
                // Quantum movement patterns
                this.phase += 0.02;
                this.x += this.vx + Math.sin(this.phase) * 0.5;
                this.y += this.vy + Math.cos(this.phase) * 0.5;

                // Quantum tunneling effect
                if (Math.random() > 0.995) {
                    this.x = Math.random() * canvas.width;
                    this.y = Math.random() * canvas.height;
                }

                // Wrap around edges
                if (this.x < 0) this.x = canvas.width;
                if (this.x > canvas.width) this.x = 0;
                if (this.y < 0) this.y = canvas.height;
                if (this.y > canvas.height) this.y = 0;

                // Update quantum state
                this.quantumState = (Math.sin(this.phase) + 1) / 2;
            }

            draw() {
                if (!ctx || !canvas) return;
                
                // Quantum glow effect
                const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
                gradient.addColorStop(0, `rgba(99, 102, 241, ${this.quantumState})`);
                gradient.addColorStop(0.5, `rgba(168, 85, 247, ${this.quantumState * 0.5})`);
                gradient.addColorStop(1, "rgba(99, 102, 241, 0)");
                
                ctx.fillStyle = gradient;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius * 4, 0, Math.PI * 2);
                ctx.fill();

                // Core particle
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${0.8 + this.quantumState * 0.2})`;
                ctx.fill();
            }
        }

        // Initialize quantum particles
        const particleCount = 120;
        for (let i = 0; i < particleCount; i++) {
            const particle = new QuantumParticle();
            if (particle.x !== undefined) { // Only add if properly initialized
                particlesRef.current.push(particle);
            }
        }

        const handleMouseMove = (e: MouseEvent) => {
            mouseRef.current = { x: e.clientX, y: e.clientY };
        };
        window.addEventListener("mousemove", handleMouseMove);

        // Random reality glitches
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.98) {
                setGlitchActive(true);
                setTimeout(() => setGlitchActive(false), 150);
            }
        }, 3000);

        const animate = () => {
            if (!ctx || !canvas) return;
            time += 0.01;

            // Quantum field background
            ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Create quantum mesh
            particlesRef.current.forEach((particle: Particle, i: number) => {
                particle.update();
                particle.draw();

                // Quantum entanglement connections
                particlesRef.current.slice(i + 1).forEach((otherParticle: Particle, j: number) => {
                    const dx = particle.x - otherParticle.x;
                    const dy = particle.y - otherParticle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 180) {
                        const quantumStrength = Math.sin(time + i * 0.1 + j * 0.1) * 0.5 + 0.5;
                        
                        if (ctx) {
                            ctx.beginPath();
                            ctx.moveTo(particle.x, particle.y);
                            ctx.lineTo(otherParticle.x, otherParticle.y);
                            
                            // Quantum energy flow
                            const gradient = ctx.createLinearGradient(
                                particle.x, particle.y, otherParticle.x, otherParticle.y
                            );
                            gradient.addColorStop(0, `rgba(99, 102, 241, ${quantumStrength * 0.3 * (1 - distance / 180)})`);
                            gradient.addColorStop(0.5, `rgba(168, 85, 247, ${quantumStrength * 0.5 * (1 - distance / 180)})`);
                            gradient.addColorStop(1, `rgba(236, 72, 153, ${quantumStrength * 0.3 * (1 - distance / 180)})`);
                            
                            ctx.strokeStyle = gradient;
                            ctx.lineWidth = quantumStrength * 2;
                            ctx.stroke();
                        }
                    }
                });

                // Mouse quantum interaction
                const mouseDistance = Math.sqrt(
                    Math.pow(particle.x - mouseRef.current.x, 2) +
                    Math.pow(particle.y - mouseRef.current.y, 2)
                );

                if (mouseDistance < 150) {
                    const angle = Math.atan2(
                        particle.y - mouseRef.current.y,
                        particle.x - mouseRef.current.x
                    );
                    particle.vx += Math.cos(angle) * 0.3;
                    particle.vy += Math.sin(angle) * 0.3;
                }

                // Quantum damping
                particle.vx *= 0.98;
                particle.vy *= 0.98;
            });

            // Draw quantum field lines
            ctx.strokeStyle = "rgba(99, 102, 241, 0.1)";
            ctx.lineWidth = 0.5;
            for (let i = 0; i < 5; i++) {
                ctx.beginPath();
                for (let x = 0; x < canvas.width; x += 20) {
                    const y = canvas.height / 2 + Math.sin(x * 0.01 + time + i) * 100 * Math.sin(time * 0.5);
                    if (x === 0) {
                        ctx.moveTo(x, y);
                    } else {
                        ctx.lineTo(x, y);
                    }
                }
                ctx.stroke();
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener("resize", resize);
            window.removeEventListener("mousemove", handleMouseMove);
            clearInterval(glitchInterval);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div className="fixed inset-0 -z-10 pointer-events-none">
            <canvas
                ref={canvasRef}
                className={`absolute inset-0 bg-black ${glitchActive ? 'animate-pulse' : ''}`}
                style={{
                    filter: glitchActive ? 'hue-rotate(90deg) saturate(2)' : 'none',
                    transform: glitchActive ? 'scale(1.02)' : 'scale(1)',
                    transition: 'all 0.1s ease'
                }}
            />
            {glitchActive && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-purple-500/20 to-transparent animate-pulse" />
                    <div className="absolute inset-0 bg-linear-to-b from-transparent via-blue-500/10 to-transparent animate-pulse" 
                         style={{ animationDelay: '0.1s' }} />
                </div>
            )}
        </div>
    );
}
