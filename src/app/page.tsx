"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import SettingsModal from "@/components/SettingsModal";
import ModelSelector from "@/components/ModelSelector";
import ChatMessageComponent from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import {
    ChatMessage,
    ModelId,
    Attachment,
    MODELS,
} from "@/lib/types";
import { getApiKey } from "@/lib/storage";
import { sendChatRequest } from "@/lib/api";

export default function HomePage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedModel, setSelectedModel] = useState<ModelId>("gpt-4o");
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSend = useCallback(
        async (text: string, attachments: Attachment[]) => {
            const model = MODELS.find((m) => m.id === selectedModel);
            if (!model) return;

            // Get API key for the provider
            const apiKey = getApiKey(model.provider);

            // Create user message
            const userMessage: ChatMessage = {
                id: `msg-${Date.now()}-user`,
                role: "user",
                content: text,
                attachments: attachments.length > 0 ? attachments : undefined,
                model: selectedModel,
                timestamp: Date.now(),
            };

            setMessages((prev) => [...prev, userMessage]);
            setIsLoading(true);

            try {
                const response = await sendChatRequest({
                    model: selectedModel,
                    messages: [
                        ...messages.map((m) => ({
                            role: m.role,
                            content: m.content,
                        })),
                        { role: "user" as const, content: text },
                    ],
                    attachments: attachments.length > 0 ? attachments : undefined,
                    apiKey,
                });

                const assistantMessage: ChatMessage = {
                    id: `msg-${Date.now()}-assistant`,
                    role: "assistant",
                    content: response.content,
                    imageUrl: response.imageUrl,
                    model: selectedModel,
                    timestamp: Date.now(),
                };

                setMessages((prev) => [...prev, assistantMessage]);
            } catch (error) {
                const errorMessage: ChatMessage = {
                    id: `msg-${Date.now()}-error`,
                    role: "assistant",
                    content: `⚠️ エラーが発生しました: ${error instanceof Error ? error.message : "不明なエラー"
                        }`,
                    model: selectedModel,
                    timestamp: Date.now(),
                };
                setMessages((prev) => [...prev, errorMessage]);
            } finally {
                setIsLoading(false);
            }
        },
        [selectedModel, messages]
    );

    return (
        <div className="flex flex-col h-dvh bg-slate-50">
            {/* Header */}
            <Header onOpenSettings={() => setIsSettingsOpen(true)} />

            {/* Model Selector Bar */}
            <div className="bg-white/60 backdrop-blur-sm border-b border-slate-100 px-4 py-2.5">
                <div className="max-w-3xl mx-auto">
                    <ModelSelector
                        selectedModel={selectedModel}
                        onSelect={setSelectedModel}
                    />
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto">
                <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
                    {/* Empty state */}
                    {messages.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col items-center justify-center pt-20 text-center"
                        >
                            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center mb-6 shadow-inner">
                                <MessageCircle className="w-10 h-10 text-indigo-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-slate-700 mb-2">
                                Chotto GPT へようこそ
                            </h2>
                            <p className="text-sm text-slate-500 max-w-sm leading-relaxed">
                                メッセージを入力して会話を始めましょう。
                                <br />
                                右上の ⚙️ からAPIキーを設定できます。
                            </p>
                            <div className="flex flex-wrap gap-2 mt-6 justify-center">
                                {["テキスト生成", "画像生成", "コード解説", "翻訳"].map(
                                    (tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs font-medium text-slate-500 shadow-sm"
                                        >
                                            {tag}
                                        </span>
                                    )
                                )}
                            </div>
                        </motion.div>
                    )}

                    {/* Messages */}
                    <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                            <ChatMessageComponent key={msg.id} message={msg} />
                        ))}
                    </AnimatePresence>

                    {/* Typing Indicator */}
                    {isLoading && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center shadow-sm">
                                <span className="text-xs">✨</span>
                            </div>
                            <div className="px-4 py-3 rounded-2xl rounded-tl-md bg-white border border-slate-100 shadow-sm">
                                <div className="flex gap-1.5">
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                    <span className="typing-dot" />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input Area */}
            <ChatInput onSend={handleSend} isLoading={isLoading} />

            {/* Settings Modal */}
            <SettingsModal
                isOpen={isSettingsOpen}
                onClose={() => setIsSettingsOpen(false)}
            />
        </div>
    );
}
