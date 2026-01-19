"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Users, Circle, MoreHorizontal, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface Validator {
    rank: number;
    name: string;
    uid: string;
    stake: string;
    trust: number;
    status: 'online' | 'offline';
}

const validatorsData: Validator[] = [
    {
        rank: 1,
        name: "Opentensor Foundation",
        uid: "5F4..xK2",
        stake: "4.2M τ",
        trust: 98,
        status: "online"
    },
    {
        rank: 2,
        name: "Taostats",
        uid: "5D3..mN1",
        stake: "3.8M τ",
        trust: 96,
        status: "online"
    },
    {
        rank: 3,
        name: "Roundtable21",
        uid: "5H7..pQ3",
        stake: "2.1M τ",
        trust: 94,
        status: "online"
    },
    {
        rank: 4,
        name: "Foundry",
        uid: "5E9..rS4",
        stake: "1.9M τ",
        trust: 92,
        status: "online"
    },
    {
        rank: 5,
        name: "Datura",
        uid: "5G2..tU5",
        stake: "1.5M τ",
        trust: 90,
        status: "offline"
    }
];

export function OptimizationValidator() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6 pb-20 max-w-6xl mx-auto"
        >
            {/* Header Section */}
            <div className="flex items-center justify-between py-8 px-2 border-b border-white/5 mb-4">
                <div className="flex items-center gap-5">
                    <div className="h-14 w-14 rounded-xl bg-white/5 flex items-center justify-center border border-white/10 shadow-sm">
                        <Users className="w-7 h-7 text-kast-teal" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white tracking-tight uppercase font-sans mb-1">Security Nodes</h2>
                        <p className="text-sm text-zinc-500 font-medium tracking-wide">Top auditing nodes by stake</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex items-center gap-2 px-4 py-2 bg-black border border-white/10 rounded-lg shadow-sm">
                        <span className="relative flex h-2 w-2">
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                        </span>
                        <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest">5 Active</span>
                    </div>
                </div>
            </div>

            {/* Validator List Table */}
            <div className="bg-zinc-950 rounded-xl border border-white/5 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10">
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-20 text-center font-sans">#</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">Validator</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest font-sans">UID</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Stake</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest w-64 font-sans">Trust Score</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-zinc-400 uppercase tracking-widest text-right font-sans">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {validatorsData.map((validator) => (
                                <tr key={validator.rank} className="group hover:bg-white/5 transition-all duration-200">
                                    <td className="px-8 py-6 text-center">
                                        <span className={cn(
                                            "font-mono font-bold text-sm",
                                            validator.rank === 1 ? "text-amber-500" :
                                                validator.rank === 2 ? "text-amber-500/80" :
                                                    validator.rank === 3 ? "text-amber-500/60" : "text-zinc-300"
                                        )}>
                                            {validator.rank}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="font-bold text-sm text-white font-sans tracking-tight group-hover:text-kast-teal transition-colors">
                                            {validator.name}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="inline-flex items-center px-2.5 py-1 rounded-md bg-white/5 text-zinc-500 text-[11px] font-mono font-medium tracking-tight">
                                            {validator.uid}
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <span className="font-bold text-sm text-zinc-300 font-mono tracking-tight">
                                            {validator.stake}
                                        </span>
                                    </td>
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-kast-teal rounded-full shadow-[0_0_10px_rgba(30,186,152,0.3)]"
                                                    style={{ width: `${validator.trust}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-bold text-zinc-500 font-mono w-10 text-right">
                                                {validator.trust}%
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2.5">
                                            <span className={cn(
                                                "w-2 h-2 rounded-full shadow-sm",
                                                validator.status === 'online' ? "bg-emerald-400" : "bg-zinc-300"
                                            )} />
                                            <span className={cn(
                                                "text-[10px] font-bold uppercase tracking-wider font-sans",
                                                validator.status === 'online' ? "text-emerald-400" : "text-zinc-500"
                                            )}>
                                                {validator.status}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="flex justify-center mt-6">
                <Button variant="ghost" className="text-zinc-600 hover:text-white font-mono text-xs uppercase tracking-widest gap-2">
                    View Network Stats <ExternalLink className="w-3 h-3" />
                </Button>
            </div>
        </motion.div>
    );
}
