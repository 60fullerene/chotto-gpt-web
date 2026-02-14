"use client";

import React, { useRef, useState, useCallback } from "react";
import { Paperclip, Send, X, FileText, Image as ImageIcon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Attachment, AttachmentType } from "@/lib/types";

interface ChatInputProps {
    onSend: (text: string, attachments: Attachment[]) => void;
    isLoading: boolean;
}

let attachmentCounter = 0;

export default function ChatInput({ onSend, isLoading }: ChatInputProps) {
    const [text, setText] = useState("");
    const [attachments, setAttachments] = useState<Attachment[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleFileSelect = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const files = e.target.files;
            if (!files) return;

            const newAttachments: Attachment[] = [];

            Array.from(files).forEach((file) => {
                let type: AttachmentType | null = null;

                if (file.type.startsWith("image/")) {
                    type = "image";
                } else if (file.type === "application/pdf") {
                    type = "pdf";
                }

                if (type) {
                    attachmentCounter++;
                    newAttachments.push({
                        id: `att-${attachmentCounter}-${Date.now()}`,
                        file,
                        type,
                        previewUrl:
                            type === "image" ? URL.createObjectURL(file) : "",
                        name: file.name,
                    });
                }
            });

            setAttachments((prev) => [...prev, ...newAttachments]);

            // Reset input so the same file can be selected again
            if (fileInputRef.current) fileInputRef.current.value = "";
        },
        []
    );

    const removeAttachment = useCallback((id: string) => {
        setAttachments((prev) => {
            const att = prev.find((a) => a.id === id);
            if (att?.previewUrl) URL.revokeObjectURL(att.previewUrl);
            return prev.filter((a) => a.id !== id);
        });
    }, []);

    const handleSubmit = () => {
        const trimmed = text.trim();
        if (!trimmed && attachments.length === 0) return;
        if (isLoading) return;

        onSend(trimmed || "(添付ファイルを送信)", attachments);
        setText("");
        setAttachments([]);

        // Refocus
        setTimeout(() => textareaRef.current?.focus(), 50);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    // Auto-resize textarea
    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setText(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    };

    return (
        <div className="border-t border-slate-200/60 bg-white/80 backdrop-blur-xl">
            <div className="max-w-3xl mx-auto p-3 sm:p-4">
                {/* Attachment Previews */}
                <AnimatePresence>
                    {attachments.length > 0 && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="flex flex-wrap gap-2 mb-3 overflow-hidden"
                        >
                            {attachments.map((att) => (
                                <motion.div
                                    key={att.id}
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    exit={{ scale: 0.8, opacity: 0 }}
                                    className="relative group"
                                >
                                    <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-slate-200 bg-slate-50 shadow-sm">
                                        {att.type === "image" ? (
                                            /* eslint-disable-next-line @next/next/no-img-element */
                                            <img
                                                src={att.previewUrl}
                                                alt={att.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex flex-col items-center justify-center gap-1">
                                                <FileText className="w-5 h-5 text-red-400" />
                                                <span className="text-[9px] text-slate-500 font-medium">
                                                    PDF
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* Remove button */}
                                    <button
                                        onClick={() => removeAttachment(att.id)}
                                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                    {/* Filename tooltip */}
                                    <p className="text-[9px] text-slate-400 mt-0.5 truncate max-w-[64px] text-center">
                                        {att.name}
                                    </p>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Input Row */}
                <div className="flex items-end gap-2">
                    {/* File Attach Button */}
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex-shrink-0 mb-0.5"
                        aria-label="Attach file"
                    >
                        <Paperclip className="w-5 h-5" />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/jpeg,image/png,application/pdf"
                        multiple
                        onChange={handleFileSelect}
                        className="hidden"
                    />

                    {/* Textarea */}
                    <div className="flex-1 relative">
                        <textarea
                            ref={textareaRef}
                            value={text}
                            onChange={handleInput}
                            onKeyDown={handleKeyDown}
                            placeholder="メッセージを入力..."
                            rows={1}
                            className="w-full resize-none px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white transition-all leading-relaxed"
                            style={{ maxHeight: "160px" }}
                        />
                    </div>

                    {/* Send Button */}
                    <motion.button
                        whileTap={{ scale: 0.92 }}
                        onClick={handleSubmit}
                        disabled={isLoading || (!text.trim() && attachments.length === 0)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mb-0.5 transition-all shadow-sm ${isLoading || (!text.trim() && attachments.length === 0)
                                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                                : "bg-gradient-to-br from-indigo-500 to-purple-600 text-white hover:shadow-md"
                            }`}
                    >
                        <Send className="w-4 h-4" />
                    </motion.button>
                </div>

                {/* Hint */}
                <p className="text-[10px] text-slate-400 mt-2 text-center">
                    Shift + Enter で改行 · Enter で送信 · 📎 でファイル添付
                </p>
            </div>
        </div>
    );
}
