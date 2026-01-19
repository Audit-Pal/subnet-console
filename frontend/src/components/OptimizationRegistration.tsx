"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Wallet, Shield, CheckCircle2, Loader2, Award, Terminal, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { DataModule } from "@/components/ui/data-module";

interface OptimizationRegistrationProps {
    isOpen: boolean;
    onClose: () => void;
    onRegister: (minerName: string, walletAddress: string) => void;
}

export function OptimizationRegistration({ isOpen, onClose, onRegister }: OptimizationRegistrationProps) {
    const [step, setStep] = useState(1);
    const [minerName, setMinerName] = useState("");
    const [walletAddress, setWalletAddress] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!minerName || !walletAddress) return;

        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        onRegister(minerName, walletAddress);
        setIsSubmitting(false);
        setStep(1); // Reset for next time
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg p-6"
                    >
                        <DataModule className="bg-zinc-950 shadow-2xl border-white/10 overflow-hidden relative">
                            {/* Header */}
                            <div className="flex items-center justify-between mb-8 relative z-10 px-2 pt-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-kast-teal/10 flex items-center justify-center border border-kast-teal/20">
                                        <Terminal className="w-5 h-5 text-kast-teal" />
                                    </div>
                                    <div>
                                        <h2 className="text-xl font-bold text-white tracking-tight uppercase">Miner Registration</h2>
                                        <p className="text-xs text-zinc-500 font-mono mt-0.5">PROTOCOL_V2_ENCRYPTED</p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-white/5 rounded-lg text-zinc-500 hover:text-white transition-colors border border-transparent hover:border-white/10"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Form */}
                            <form onSubmit={handleSubmit} className="relative z-10 space-y-6 px-2 pb-2">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                            <Terminal className="w-3.5 h-3.5 text-kast-teal" />
                                            Miner Identity
                                        </label>
                                        <input
                                            type="text"
                                            value={minerName}
                                            onChange={(e) => setMinerName(e.target.value)}
                                            placeholder="e.g. NeuralOptimizer-V1"
                                            className="w-full h-11 px-4 bg-black border border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-kast-teal/30 focus:border-kast-teal/30 transition-all placeholder:text-zinc-700 font-mono text-white"
                                            required
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                                            <Wallet className="w-3.5 h-3.5 text-kast-teal" />
                                            Wallet Address (TAO)
                                        </label>
                                        <input
                                            type="text"
                                            value={walletAddress}
                                            onChange={(e) => setWalletAddress(e.target.value)}
                                            placeholder="5F..."
                                            className="w-full h-11 px-4 bg-black border border-white/10 rounded-lg text-sm font-medium focus:outline-none focus:ring-1 focus:ring-kast-teal/30 focus:border-kast-teal/30 transition-all placeholder:text-zinc-700 font-mono text-white"
                                            required
                                        />
                                        <p className="text-[10px] text-zinc-600 flex items-center gap-1.5 font-mono uppercase tracking-wider">
                                            <Shield className="w-3 h-3 text-kast-teal" />
                                            Verified reward distribution active
                                        </p>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={onClose}
                                        className="h-11 px-6 font-mono text-xs font-bold uppercase tracking-wider text-zinc-500 hover:text-white hover:bg-white/5 border-white/10"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        disabled={isSubmitting || !minerName || !walletAddress}
                                        className="h-11 px-8 bg-kast-teal hover:bg-black text-black hover:text-white font-mono text-xs font-bold uppercase tracking-wider shadow-lg shadow-kast-teal/20 transition-all hover:-translate-y-0.5 disabled:opacity-50 disabled:translate-y-0 disabled:shadow-none border-none"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                                Registering...
                                            </>
                                        ) : (
                                            <>
                                                Join Network <ArrowRight className="w-4 h-4 ml-2" />
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export function RegistrationSuccessModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md"
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md p-6"
                    >
                        <DataModule className="bg-zinc-950 shadow-2xl border-kast-teal/20 relative overflow-hidden text-center p-8">
                            <div className="w-16 h-16 bg-kast-teal/10 rounded-full flex items-center justify-center mx-auto mb-6 text-kast-teal border border-kast-teal/20 animate-in zoom-in duration-300">
                                <CheckCircle2 className="w-8 h-8" />
                            </div>

                            <h2 className="text-2xl font-bold text-white uppercase tracking-tight mb-2">Registration Complete</h2>
                            <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
                                Your miner profile has been successfully created. You can now start optimizing prompts and submitting solutions to the network.
                            </p>

                            <Button
                                onClick={onClose}
                                className="w-full h-11 bg-kast-teal text-black hover:bg-black hover:text-white font-mono text-xs font-bold uppercase tracking-wider transition-all duration-300 border-none"
                            >
                                Start Optimizing
                            </Button>
                        </DataModule>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
