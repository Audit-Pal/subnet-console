"use client";

import { DataModule } from "@/components/ui/data-module";
import { Users } from "lucide-react";

const validators = [
    { name: "Opentensor", weight: 0.183, color: "bg-zinc-900" },
    { name: "TaoStats", weight: 0.162, color: "bg-zinc-700" },
    { name: "Foundry", weight: 0.145, color: "bg-zinc-500" },
    { name: "Rizzo", weight: 0.127, color: "bg-zinc-400" },
];

export default function ValidatorSpread() {
    return (
        <DataModule className="h-[300px] bg-black/40 backdrop-blur-sm border-white/10 flex flex-col">
            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                    <Users className="w-4 h-4 text-kast-teal" />
                    VALIDATOR_SPREAD
                </h3>
            </div>
            <div className="p-4 space-y-4 overflow-y-auto custom-scrollbar">
                {validators.map((v, i) => (
                    <div key={i} className="space-y-1">
                        <div className="flex justify-between text-[10px] font-mono">
                            <span className="text-zinc-500 font-bold uppercase">{v.name}</span>
                            <span className="text-zinc-600">{v.weight.toFixed(3)}</span>
                        </div>
                        <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-kast-teal/40 group-hover:bg-kast-teal/60 transition-colors"
                                style={{ width: `${v.weight * 100 * 3}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </DataModule>
    );
}
