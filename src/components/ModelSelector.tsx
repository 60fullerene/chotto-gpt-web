"use client";

import React, { useState, useRef } from "react";
import { ChevronDown, Cpu, ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ModelId, ModelOption, MODELS } from "@/lib/types";

interface ModelSelectorProps {
    selectedModel: ModelId;
    onSelect: (model: ModelId) => void;
}

export default function ModelSelector({
    selectedModel,
    onSelect,
}: ModelSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const selected = MODELS.find((m) => m.id === selectedModel)!;
    const textModels = MODELS.filter((m) => m.category === "text");
    const imageModels = MODELS.filter((m) => m.category === "image");

    const handleSelect = (model: ModelOption) => {
        onSelect(model.id);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={containerRef}>
            {/* Trigger */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:border-indigo-300 hover:bg-indigo-50/50 transition-all text-sm font-medium text-slate-700 shadow-sm"
            >
                {selected.category === "image" ? (
                    <ImageIcon className="w-3.5 h-3.5 text-purple-500" />
                ) : (
                    <Cpu className="w-3.5 h-3.5 text-indigo-500" />
                )}
                <span>{selected.label}</span>
                <ChevronDown
                    className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {/* Dropdown */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        <div
                            className="fixed inset-0 z-10"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: -8, scale: 0.96 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -8, scale: 0.96 }}
                            transition={{ duration: 0.15 }}
                            className="absolute top-full left-0 mt-2 w-56 bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden z-20"
                        >
                            {/* Text Models */}
                            <div className="p-2">
                                <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Text Models
                                </p>
                                {textModels.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => handleSelect(m)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${m.id === selectedModel
                                                ? "bg-indigo-50 text-indigo-700 font-medium"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <Cpu className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                                        <span>{m.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="h-px bg-slate-100 mx-3" />

                            {/* Image Models */}
                            <div className="p-2">
                                <p className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                                    Image Generation
                                </p>
                                {imageModels.map((m) => (
                                    <button
                                        key={m.id}
                                        onClick={() => handleSelect(m)}
                                        className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${m.id === selectedModel
                                                ? "bg-purple-50 text-purple-700 font-medium"
                                                : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <ImageIcon className="w-4 h-4 text-purple-400 flex-shrink-0" />
                                        <span>{m.label}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
