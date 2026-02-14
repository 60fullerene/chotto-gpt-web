"use client";

import React from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { User, Sparkles } from "lucide-react";
import { ChatMessage as ChatMessageType } from "@/lib/types";

interface ChatMessageProps {
    message: ChatMessageType;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    const isUser = message.role === "user";

    return (
        <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}
        >
            {/* Avatar */}
            <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${isUser
                        ? "bg-gradient-to-br from-indigo-500 to-purple-600"
                        : "bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200"
                    }`}
            >
                {isUser ? (
                    <User className="w-4 h-4 text-white" />
                ) : (
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                )}
            </div>

            {/* Bubble */}
            <div
                className={`max-w-[80%] sm:max-w-[70%] ${isUser ? "items-end" : "items-start"
                    }`}
            >
                <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${isUser
                            ? "bg-gradient-to-br from-indigo-500 to-indigo-600 text-white rounded-tr-md"
                            : "bg-white text-slate-800 border border-slate-100 rounded-tl-md"
                        }`}
                >
                    {isUser ? (
                        <>
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">
                                {message.content}
                            </p>
                            {/* Show attachment thumbnails in user message */}
                            {message.attachments && message.attachments.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {message.attachments.map((att) => (
                                        <div
                                            key={att.id}
                                            className="rounded-lg overflow-hidden border border-white/20"
                                        >
                                            {att.type === "image" ? (
                                                /* eslint-disable-next-line @next/next/no-img-element */
                                                <img
                                                    src={att.previewUrl}
                                                    alt={att.name}
                                                    className="w-20 h-20 object-cover"
                                                />
                                            ) : (
                                                <div className="w-20 h-20 bg-white/10 flex items-center justify-center text-xs">
                                                    📄 PDF
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <div className="markdown-body text-sm">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                    {message.content}
                                </ReactMarkdown>
                            </div>
                            {/* Image response for image-gen models */}
                            {message.imageUrl && (
                                <div className="mt-3 rounded-xl overflow-hidden border border-slate-100">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={message.imageUrl}
                                        alt="AI Generated Image"
                                        className="w-full max-w-sm rounded-xl"
                                        loading="lazy"
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {/* Timestamp */}
                <p
                    className={`text-[10px] text-slate-400 mt-1 px-1 ${isUser ? "text-right" : "text-left"
                        }`}
                >
                    {new Date(message.timestamp).toLocaleTimeString("ja-JP", {
                        hour: "2-digit",
                        minute: "2-digit",
                    })}
                </p>
            </div>
        </motion.div>
    );
}
