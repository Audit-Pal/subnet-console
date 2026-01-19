"use client";

import { motion } from "framer-motion";

export function Hypercube() {
    return (
        <div className="relative w-[400px] h-[400px] perspective-1000">
            {/* Outer cube */}
            <motion.div
                className="absolute inset-0 transform-gpu"
                animate={{ rotateX: [0, 360], rotateY: [0, 360], rotateZ: [0, 180] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Cube faces */}
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "translateZ(200px)" }} />
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "translateZ(-200px) rotateY(180deg)" }} />
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "rotateY(90deg) translateZ(200px)" }} />
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "rotateY(-90deg) translateZ(200px)" }} />
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "rotateX(90deg) translateZ(200px)" }} />
                <div className="absolute w-full h-full border-2 border-primary/30 bg-primary/5 backdrop-blur-sm" 
                     style={{ transform: "rotateX(-90deg) translateZ(200px)" }} />
            </motion.div>

            {/* Inner cube (4D effect) */}
            <motion.div
                className="absolute inset-8 transform-gpu"
                animate={{ rotateX: [360, 0], rotateY: [180, 360], rotateZ: [0, -360] }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: "preserve-3d" }}
            >
                {/* Inner cube faces */}
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "translateZ(100px)" }} />
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "translateZ(-100px) rotateY(180deg)" }} />
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "rotateY(90deg) translateZ(100px)" }} />
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "rotateY(-90deg) translateZ(100px)" }} />
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "rotateX(90deg) translateZ(100px)" }} />
                <div className="absolute w-full h-full border border-purple-500/40 bg-purple-500/10 backdrop-blur-md" 
                     style={{ transform: "rotateX(-90deg) translateZ(100px)" }} />
            </motion.div>

            {/* Core energy */}
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32"
                animate={{ 
                    scale: [1, 1.5, 1],
                    rotate: [0, 360],
                    borderRadius: ["50%", "20%", "50%"]
                }}
                transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
            >
                <div className="w-full h-full bg-linear-to-r from-primary via-purple-500 to-indigo-400 opacity-60 blur-xl" />
            </motion.div>

            {/* Energy particles */}
            {[...Array(8)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute w-2 h-2 bg-primary rounded-full"
                    style={{
                        transformOrigin: "200px 200px",
                    }}
                    animate={{
                        rotate: [0, 360],
                        translateX: [150, 150],
                        translateY: [0, 0],
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 1, 0.4]
                    }}
                    transition={{
                        duration: 3 + i * 0.5,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    initial={{
                        rotate: i * 45,
                        translateX: 150,
                    }}
                />
            ))}

            {/* Quantum connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {[...Array(12)].map((_, i) => (
                    <motion.line
                        key={i}
                        x1="200"
                        y1="200"
                        x2={200 + Math.cos(i * Math.PI / 6) * 180}
                        y2={200 + Math.sin(i * Math.PI / 6) * 180}
                        stroke="url(#quantum-gradient)"
                        strokeWidth="2"
                        opacity={0.6}
                        animate={{ 
                            opacity: [0.2, 0.8, 0.2],
                            strokeWidth: [1, 3, 1]
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: i * 0.1,
                        }}
                    />
                ))}
                <defs>
                    <linearGradient id="quantum-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#a855f7" stopOpacity="1" />
                        <stop offset="100%" stopColor="#6366f1" stopOpacity="0.8" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
}
