"use client";

import { useEffect, useRef } from "react";

export function PixelBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            if (!ctx || !canvas) return;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const gridSize = 20;
            const dotSize = 1.5;

            ctx.fillStyle = "#0000FF"; // Electric Blue
            ctx.globalAlpha = 0.15;

            for (let x = 0; x < canvas.width; x += gridSize) {
                for (let y = 0; y < canvas.height; y += gridSize) {
                    // Create a pattern where some dots are missing or larger to mimic the Ridges aesthetic
                    if (Math.random() > 0.8) continue;

                    ctx.beginPath();
                    ctx.arc(x, y, dotSize, 0, Math.PI * 2);
                    ctx.fill();
                }
            }
        };

        draw();
        // Optional: Animate slightly? For now static is cleaner like the screenshot

        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 -z-10 pointer-events-none bg-white"
        />
    );
}
