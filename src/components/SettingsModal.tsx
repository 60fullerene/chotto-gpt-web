"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Key, Eye, EyeOff, Shield } from "lucide-react";
import { Provider } from "@/lib/types";
import { getApiKey, setApiKey } from "@/lib/storage";

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ProviderConfig {
    id: Provider;
    label: string;
    placeholder: string;
    color: string;
    icon: string;
}

const PROVIDERS: ProviderConfig[] = [
    {
        id: "openai",
        label: "OpenAI",
        placeholder: "sk-xxxxxxxxxxxxxxxx",
        color: "from-emerald-500 to-teal-600",
        icon: "🤖",
    },
    {
        id: "google",
        label: "Google Gemini",
        placeholder: "AIzaxxxxxxxxxxxxxxxx",
        color: "from-blue-500 to-cyan-600",
        icon: "💎",
    },
    {
        id: "anthropic",
        label: "Anthropic",
        placeholder: "sk-ant-xxxxxxxxxxxxxxxx",
        color: "from-orange-500 to-amber-600",
        icon: "🧠",
    },
];

export default function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
    const [keys, setKeys] = useState<Record<Provider, string>>({
        openai: "",
        google: "",
        anthropic: "",
    });
    const [showKey, setShowKey] = useState<Record<Provider, boolean>>({
        openai: false,
        google: false,
        anthropic: false,
    });
    const [saved, setSaved] = useState(false);

    // Load keys from localStorage when modal opens
    useEffect(() => {
        if (isOpen) {
            setKeys({
                openai: getApiKey("openai"),
                google: getApiKey("google"),
                anthropic: getApiKey("anthropic"),
            });
            setSaved(false);
        }
    }, [isOpen]);

    const handleSave = () => {
        PROVIDERS.forEach((p) => setApiKey(p.id, keys[p.id]));
        setSaved(true);
        setTimeout(() => onClose(), 600);
    };

    const toggleShow = (provider: Provider) => {
        setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
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
                        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                    >
                        <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden">
                            {/* Header */}
                            <div className="px-6 pt-6 pb-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                        <Key className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            API キー設定
                                        </h2>
                                        <p className="text-sm text-slate-500">
                                            キーはブラウザにのみ保存されます
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Security Notice */}
                            <div className="mx-6 mb-4 px-4 py-3 rounded-xl bg-indigo-50 border border-indigo-100 flex items-start gap-3">
                                <Shield className="w-4 h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                                <p className="text-xs text-indigo-700 leading-relaxed">
                                    APIキーはサーバーには送信されず、お使いのブラウザの
                                    <strong>localStorage</strong>
                                    にのみ保存されます。安全にご利用いただけます。
                                </p>
                            </div>

                            {/* Provider Fields */}
                            <div className="px-6 space-y-4 max-h-[50vh] overflow-y-auto">
                                {PROVIDERS.map((provider) => (
                                    <div key={provider.id} className="group">
                                        <label className="flex items-center gap-2 mb-2">
                                            <span className="text-base">{provider.icon}</span>
                                            <span className="text-sm font-medium text-slate-700">
                                                {provider.label}
                                            </span>
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showKey[provider.id] ? "text" : "password"}
                                                value={keys[provider.id]}
                                                onChange={(e) =>
                                                    setKeys((prev) => ({
                                                        ...prev,
                                                        [provider.id]: e.target.value,
                                                    }))
                                                }
                                                placeholder={provider.placeholder}
                                                className="w-full px-4 py-3 pr-12 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all font-mono"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => toggleShow(provider.id)}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                            >
                                                {showKey[provider.id] ? (
                                                    <EyeOff className="w-4 h-4" />
                                                ) : (
                                                    <Eye className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-5 mt-2 flex items-center justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all"
                                >
                                    キャンセル
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-6 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
                                >
                                    {saved ? "✓ 保存しました" : "保存する"}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
