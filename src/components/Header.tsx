"use client";

import React from "react";
import { Settings, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface HeaderProps {
    onOpenSettings: () => void;
}

export default function Header({ onOpenSettings }: HeaderProps) {
    return (
        <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="sticky top-0 z-30 backdrop-blur-xl bg-white/80 border-b border-slate-200/60"
        >
            <div className="max-w-3xl mx-auto px-4 h-16 flex items-center justify-between">
                {/* Logo & Title */}
                <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-md">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold tracking-tight text-slate-900 leading-none">
                            Chotto GPT
                        </h1>
                        <p className="text-[11px] text-slate-400 font-medium tracking-wide uppercase mt-0.5">
                            Web
                        </p>
                    </div>
                </div>

                {/* Settings Button */}
                <button
                    onClick={onOpenSettings}
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-200 active:scale-95"
                    aria-label="Settings"
                >
                    <Settings className="w-5 h-5" />
                </button>
            </div>
        </motion.header>
    );
}
