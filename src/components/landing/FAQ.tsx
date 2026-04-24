"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";

const faqs = [
    {
        question: "How does AuditPal work?",
        answer: "Upload your smart contract, and our decentralized network of AI security agents will analyze it for vulnerabilities. Results are verified through multi-agent consensus, ensuring accuracy and trust. It's as simple as that.\n\nRefer to our Documentation for detailed guides on integrating AuditPal into your workflow."
    },
    {
        question: "Why use AuditPal?",
        answer: "Unlike traditional audits that rely on a single auditor, AuditPal uses a decentralized network of AI agents that cross-verify findings. This eliminates single points of failure and provides more comprehensive security coverage at a fraction of the cost."
    },
    {
        question: "What blockchains are supported?",
        answer: "AuditPal currently supports Ethereum, Arbitrum, Optimism, Polygon, Base, BSC, Avalanche, and Linea. We're continuously adding support for more chains and languages."
    },
    {
        question: "How long does an audit take?",
        answer: "Most audits complete within minutes, not weeks. Simple contracts can be analyzed in under 60 seconds, while complex protocols may take up to 30 minutes for full consensus verification."
    },
    {
        question: "Is my code kept private?",
        answer: "Yes. Your code is encrypted end-to-end and never stored on our servers. Only the AI agents process your code in memory, and all data is purged immediately after the audit completes."
    },
    {
        question: "How can I integrate AuditPal into my CI/CD pipeline?",
        answer: "AuditPal provides a dedicated GitHub Action and CLI tool for seamless CI/CD integration. You can automate security checks on every pull request, ensuring that no vulnerable code ever reaches your main branch."
    },
];

export function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-24 px-6 bg-black border-t border-white/5">
            <div className="max-w-7xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
                    {/* Left Side - Title */}
                    <motion.div
                        className="lg:w-[300px] flex-shrink-0"
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-light italic tracking-tight text-white">
                            FAQS
                        </h2>
                    </motion.div>

                    {/* Right Side - Accordion */}
                    <div className="flex-1 space-y-0">
                        {faqs.map((faq, index) => (
                            <FAQItem
                                key={index}
                                question={faq.question}
                                answer={faq.answer}
                                isOpen={openIndex === index}
                                onToggle={() => setOpenIndex(openIndex === index ? null : index)}
                                index={index}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}

function FAQItem({
    question,
    answer,
    isOpen,
    onToggle,
    index
}: {
    question: string;
    answer: string;
    isOpen: boolean;
    onToggle: () => void;
    index: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
            className="border-t border-white/10 last:border-b"
        >
            <button
                onClick={onToggle}
                className="w-full py-6 flex items-center justify-between gap-4 text-left group"
            >
                <span className="text-lg md:text-xl font-medium text-white group-hover:text-kast-teal transition-colors">
                    {question}
                </span>
                <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center transition-colors">
                    {isOpen ? (
                        <Minus className="w-5 h-5 text-white/50 group-hover:text-kast-teal transition-colors" />
                    ) : (
                        <Plus className="w-5 h-5 text-white/50 group-hover:text-kast-teal transition-colors" />
                    )}
                </div>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="pb-8 pr-12">
                            <p className="text-zinc-400 text-lg leading-relaxed whitespace-pre-line max-w-2xl">
                                {answer}
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}
