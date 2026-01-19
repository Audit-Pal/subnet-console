"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface QuantumTextProps {
    text: string;
    className?: string;
    repeatInterval?: number;
}

export function QuantumText({ text, className, repeatInterval }: QuantumTextProps) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

        const animate = () => {
            let iterations = 0;

            const interval = setInterval(() => {
                setDisplayText(text
                    .split("")
                    .map((letter, index) => {
                        if (index < iterations) {
                            return text[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)];
                    })
                    .join("")
                );

                if (iterations >= text.length) {
                    clearInterval(interval);
                }

                iterations += 1 / 3;
            }, 30);

            return interval;
        };

        // Initial animation
        let currentInterval = animate();

        // Set up repeat interval if specified
        let repeatTimer: NodeJS.Timeout;
        if (repeatInterval) {
            repeatTimer = setInterval(() => {
                // Clear any running animation interval just in case
                clearInterval(currentInterval);
                currentInterval = animate();
            }, repeatInterval);
        }

        return () => {
            clearInterval(currentInterval);
            if (repeatTimer) clearInterval(repeatTimer);
        };
    }, [text, repeatInterval]);

    return <span className={cn("inline-block", className)}>{displayText}</span>;
}
