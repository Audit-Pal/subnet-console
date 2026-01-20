"use client";

import { useState } from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Terminal, Menu, X, Construction } from "lucide-react";

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black">
      {/* Global Under Construction Banner - Green Theme */}
      <div className="bg-kast-teal/10 border-b border-kast-teal/20 py-2 flex items-center justify-center gap-3 backdrop-blur-md">
        <Construction className="w-3.5 h-3.5 text-kast-teal animate-pulse" />
        <span className="text-[10px] md:text-[11px] font-black text-kast-teal uppercase tracking-[0.1em] leading-none drop-shadow-[0_0_8px_rgba(30,186,152,0.4)]">
          System Under Construction • Beta Testing In Progress
        </span>
      </div>

      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2 group z-50">
            <div className="relative h-8 w-8 overflow-hidden rounded-md">
              <img
                src="/assets/auditpal.jpg"
                alt="Audit Subnet Logo"
                className="h-full w-full object-contain filter invert opacity-90 hover:opacity-100 transition-opacity"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-white group-hover:text-kast-teal transition-colors duration-300 uppercase">
              AUDITPAL <span className="text-kast-teal ml-1">SUBNET</span>
            </span>
          </Link>
          <div className="hidden lg:flex items-center px-2 py-0.5 rounded-sm border border-kast-teal/20 bg-kast-teal/10">
            <span className="text-[10px] font-black text-kast-teal uppercase tracking-[0.2em]">Beta</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link
            href="/network"
            className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-2 flex items-center gap-1.5"
          >
            Network
          </Link>
          <Link
            href="/benchmark"
            className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-2 flex items-center gap-1.5"
          >
            Benchmark
          </Link>

          <Link
            href="/docs"
            className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-2 flex items-center gap-1.5"
          >
            Docs
          </Link>
        </nav>

        <div className="hidden md:flex items-center">
          <Button asChild className="bg-black text-kast-teal hover:bg-kast-teal hover:text-black rounded-full px-6 font-bold text-sm transition-all shadow-[0_0_20px_rgba(30,186,152,0.1)] border border-kast-teal/50">
            <Link href="https://github.com/Audit-Pal/auditpal-subnet" target="_blank" rel="noopener noreferrer">START MINING</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden z-50 p-2 text-primary hover:bg-primary/10 rounded-md transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 top-16 z-40 bg-black border-t border-white/5 flex flex-col p-6 md:hidden animate-in slide-in-from-top-4 duration-300">
            <nav className="flex flex-col space-y-6">
              <Link
                href="/network"
                className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-4 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Network
              </Link>
              <Link
                href="/benchmark"
                className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-4 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Benchmark
              </Link>

              <Link
                href="/docs"
                className="text-sm font-medium text-zinc-400 hover:text-kast-teal transition-colors py-4 border-b border-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Docs
              </Link>
              <div className="pt-4 flex flex-col">
                <Button asChild size="lg" className="w-full bg-black text-kast-teal hover:bg-kast-teal hover:text-black rounded-none font-bold border border-kast-teal/50 shadow-lg transition-all duration-300">
                  <Link href="https://github.com/Audit-Pal/auditpal-subnet" target="_blank" rel="noopener noreferrer" onClick={() => setIsMobileMenuOpen(false)}>START MINING</Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
