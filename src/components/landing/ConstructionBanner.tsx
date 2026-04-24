import React from 'react';
import { Construction } from 'lucide-react';

export const ConstructionBanner = () => {
    return (
        <div className="w-full bg-kast-black border-b border-kast-teal/20 text-kast-teal py-2 flex justify-center items-center gap-2 select-none z-50">
            <Construction className="w-3.5 h-3.5" />
            <span className="font-mono text-[10px] md:text-xs tracking-[0.2em] font-medium uppercase">
                WEBSITE IS UNDER CONSTRUCTION
            </span>
        </div>
    );
};
