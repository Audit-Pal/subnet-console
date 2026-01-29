"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface TabsProps {
    defaultValue: string;
    className?: string;
    children: React.ReactNode;
}

interface TabsListProps {
    children: React.ReactNode;
    className?: string;
}

interface TabsTriggerProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

interface TabsContentProps {
    value: string;
    children: React.ReactNode;
    className?: string;
}

const TabsContext = React.createContext<{
    activeTab: string;
    setActiveTab: (value: string) => void;
} | undefined>(undefined);

export function Tabs({ defaultValue, className, children }: TabsProps) {
    const [activeTab, setActiveTab] = React.useState(defaultValue);

    return (
        <TabsContext.Provider value={{ activeTab, setActiveTab }}>
            <div className={cn("w-full", className)}>
                {children}
            </div>
        </TabsContext.Provider>
    );
}

export function TabsList({ children, className }: TabsListProps) {
    return (
        <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
            {children}
        </div>
    );
}

export function TabsTrigger({ value, children, className }: TabsTriggerProps) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsTrigger must be used within Tabs");

    const isActive = context.activeTab === value;

    return (
        <button
            onClick={() => context.setActiveTab(value)}
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative",
                isActive ? "text-foreground" : "text-zinc-500 hover:text-zinc-300",
                className
            )}
        >
            {isActive && (
                <motion.div
                    layoutId="active-tab"
                    className="absolute inset-x-0 -bottom-[11px] h-[2px] bg-kast-teal"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
            )}
            {children}
        </button>
    );
}

export function TabsContent({ value, children, className }: TabsContentProps) {
    const context = React.useContext(TabsContext);
    if (!context) throw new Error("TabsContent must be used within Tabs");

    if (context.activeTab !== value) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}
        >
            {children}
        </motion.div>
    );
}
