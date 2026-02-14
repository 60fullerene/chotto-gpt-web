// ─── Provider & Model Definitions ───────────────────────────────────────────

export type Provider = "openai" | "google" | "anthropic";

export type TextModelId =
    | "gpt-4o"
    | "gpt-5"
    | "gpt-5-thinking"
    | "gemini-1.5-pro"
    | "gemini-3.0-pro"
    | "claude-3-5-sonnet"
    | "claude-4-6-sonnet";
export type ImageModelId = "dall-e-3" | "nano-banana";
export type ModelId = TextModelId | ImageModelId;

export interface ModelOption {
    id: ModelId;
    label: string;
    provider: Provider;
    category: "text" | "image";
}

export const MODELS: ModelOption[] = [
    // Text Models
    { id: "gpt-4o", label: "GPT-4o", provider: "openai", category: "text" },
    { id: "gpt-5", label: "GPT-5 (Preview)", provider: "openai", category: "text" },
    {
        id: "gpt-5-thinking",
        label: "GPT-5 Thinking",
        provider: "openai",
        category: "text",
    },
    {
        id: "gemini-1.5-pro",
        label: "Gemini 1.5 Pro",
        provider: "google",
        category: "text",
    },
    {
        id: "gemini-3.0-pro",
        label: "Gemini 3.0 Pro",
        provider: "google",
        category: "text",
    },
    {
        id: "claude-3-5-sonnet",
        label: "Claude 3.5 Sonnet",
        provider: "anthropic",
        category: "text",
    },
    {
        id: "claude-4-6-sonnet",
        label: "Claude 4.6 Sonnet",
        provider: "anthropic",
        category: "text",
    },
    // Image Generation Models
    { id: "dall-e-3", label: "DALL·E 3", provider: "openai", category: "image" },
    {
        id: "nano-banana",
        label: "Nano Banana",
        provider: "openai",
        category: "image",
    },
];

// ─── Attachments ────────────────────────────────────────────────────────────

export type AttachmentType = "image" | "pdf";

export interface Attachment {
    id: string;
    file: File;
    type: AttachmentType;
    previewUrl: string; // object URL for thumbnail
    name: string;
}

// ─── Chat Messages ──────────────────────────────────────────────────────────

export type MessageRole = "user" | "assistant";

export interface ChatMessage {
    id: string;
    role: MessageRole;
    content: string;
    imageUrl?: string; // populated when image-gen model returns a URL
    attachments?: Attachment[];
    model: ModelId;
    timestamp: number;
}

// ─── API Request / Response ─────────────────────────────────────────────────

export interface ChatRequest {
    model: ModelId;
    messages: { role: MessageRole; content: string }[];
    attachments?: Attachment[];
    apiKey: string;
}

export interface ChatResponse {
    content: string;
    imageUrl?: string; // for image-gen models
}
