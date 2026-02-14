import {
    ChatRequest,
    ChatResponse,
    ModelId,
    MODELS,
} from "./types";

// ─── Provider-specific call stubs ───────────────────────────────────────────

/**
 * Call OpenAI Chat Completions API (gpt-4o).
 */
async function callOpenAI(req: ChatRequest): Promise<ChatResponse> {
    if (!req.apiKey) {
        throw new Error("OpenAI API Key is missing. Please check settings.");
    }

    try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${req.apiKey}`,
            },
            body: JSON.stringify({
                model: "gpt-4o",
                messages: req.messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.error?.message || `OpenAI API Error: ${res.statusText}`
            );
        }

        const json = await res.json();
        return { content: json.choices[0].message.content };
    } catch (error) {
        console.error("OpenAI Call Failed:", error);
        throw error;
    }
}

/**
 * Call Google Gemini API (gemini-1.5-pro).
 */
async function callGemini(req: ChatRequest): Promise<ChatResponse> {
    if (!req.apiKey) {
        throw new Error("Google Gemini API Key is missing.");
    }

    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${req.apiKey}`;

        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                contents: req.messages.map((m) => ({
                    role: m.role === "user" ? "user" : "model",
                    parts: [{ text: m.content }],
                })),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.error?.message || `Gemini API Error: ${res.statusText}`
            );
        }

        const json = await res.json();
        return {
            content:
                json.candidates?.[0]?.content?.parts?.[0]?.text ||
                "No response from Gemini.",
        };
    } catch (error) {
        console.error("Gemini Call Failed:", error);
        throw error;
    }
}

/**
 * Call Anthropic Messages API (claude-3-5-sonnet).
 * Note: Anthropic API requires a proxy or backend relay to avoid CORS issues if called directly from browser,
 * but Next.js Server Actions or API routes handle this securely.
 * Since this is a client-side fetch in this specific demo architecture, 
 * we must use a proxy or accept CORS limitations.
 * However, for this VPS deployment, let's try direct fetch assuming user might use a proxy or Next.js API route.
 * 
 * ACTUALLY: Browser-based direct calls to Anthropic will fail CORS.
 * We should really move this logic to a Next.js Server Action / API Route for security and CORS.
 * But to keep it simple as requested, let's implement the fetch and see.
 * (If CORS fails, we'll need to move to /api/chat route).
 */
async function callAnthropic(req: ChatRequest): Promise<ChatResponse> {
    if (!req.apiKey) {
        throw new Error("Anthropic API Key is missing.");
    }

    try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": req.apiKey,
                "anthropic-version": "2023-06-01",
                "anthropic-dangerous-direct-browser-access": "true", // Required for client-side calls
            },
            body: JSON.stringify({
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 1024,
                messages: req.messages.map((m) => ({
                    role: m.role,
                    content: m.content,
                })),
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.error?.message || `Anthropic API Error: ${res.statusText}`
            );
        }

        const json = await res.json();
        return { content: json.content[0].text };
    } catch (error) {
        console.error("Anthropic Call Failed:", error);
        throw error;
    }
}

/**
 * Call OpenAI DALL·E 3 image generation API.
 */
async function callDallE(req: ChatRequest): Promise<ChatResponse> {
    if (!req.apiKey) {
        throw new Error("OpenAI API Key is missing.");
    }

    try {
        const res = await fetch("https://api.openai.com/v1/images/generations", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${req.apiKey}`,
            },
            body: JSON.stringify({
                model: "dall-e-3",
                prompt: req.messages[req.messages.length - 1].content,
                n: 1,
                size: "1024x1024",
            }),
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(
                errorData.error?.message || `DALL·E API Error: ${res.statusText}`
            );
        }

        const json = await res.json();
        return {
            content: "画像を生成しました。",
            imageUrl: json.data[0].url,
        };
    } catch (error) {
        console.error("DALL·E Call Failed:", error);
        throw error;
    }
}

/**
 * Call Nano Banana image generation API (hypothetical).
 */
async function callNanoBanana(req: ChatRequest): Promise<ChatResponse> {
    await simulateLatency();
    const lastMessage = req.messages[req.messages.length - 1];
    return {
        content: `Nano Banana で「${lastMessage.content}」の画像を生成しました。`,
        imageUrl:
            "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=512&h=512&fit=crop",
    };
}

// ─── Router ─────────────────────────────────────────────────────────────────

/**
 * Route the request to the appropriate provider handler based on the
 * selected model. This is the single entry point used by the UI.
 */
export async function sendChatRequest(
    req: ChatRequest
): Promise<ChatResponse> {
    const model = MODELS.find((m) => m.id === req.model);
    if (!model) {
        throw new Error(`Unknown model: ${req.model}`);
    }

    const handlers: Record<ModelId, (r: ChatRequest) => Promise<ChatResponse>> = {
        "gpt-4o": callOpenAI,
        "gemini-1.5-pro": callGemini,
        "claude-3-5-sonnet": callAnthropic,
        "dall-e-3": callDallE,
        "nano-banana": callNanoBanana,
    };

    return handlers[req.model](req);
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function simulateLatency(): Promise<void> {
    return new Promise((resolve) =>
        setTimeout(resolve, 800 + Math.random() * 700)
    );
}
