import {
    ChatRequest,
    ChatResponse,
    ModelId,
    MODELS,
} from "./types";

// ─── Provider-specific call stubs ───────────────────────────────────────────

/**
 * Call OpenAI Chat Completions API (gpt-4o).
 * In production, replace the mock with a real fetch to
 * https://api.openai.com/v1/chat/completions
 */
async function callOpenAI(req: ChatRequest): Promise<ChatResponse> {
    // --- MOCK IMPLEMENTATION ---
    await simulateLatency();
    const lastMessage = req.messages[req.messages.length - 1];
    const modelName = req.model === "gpt-5" ? "GPT-5 (Preview)" : "GPT-4o";
    return {
        content: `**[${modelName} Mock]**\n\nあなたのメッセージ「${lastMessage.content}」を受け取りました。\n\n実際のAPIキーを設定すれば、OpenAIの${modelName}モデルが応答します。`,
    };
    // --- PRODUCTION EXAMPLE ---
    // const res = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${req.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: "gpt-4o",
    //     messages: req.messages,
    //   }),
    // });
    // const json = await res.json();
    // return { content: json.choices[0].message.content };
}

/**
 * Call Google Gemini API (gemini-1.5-pro).
 */
async function callGemini(req: ChatRequest): Promise<ChatResponse> {
    await simulateLatency();
    const lastMessage = req.messages[req.messages.length - 1];
    const modelName =
        req.model === "gemini-3.0-pro" ? "Gemini 3.0 Pro" : "Gemini 1.5 Pro";
    return {
        content: `**[${modelName} Mock]**\n\n「${lastMessage.content}」について考えてみました。\n\n実際のAPIキーを設定すれば、Google ${modelName}が応答します。\n\n- ポイント1: モックレスポンスです\n- ポイント2: Markdownもサポートしています`,
    };
}

/**
 * Call Anthropic Messages API (claude-3-5-sonnet).
 */
async function callAnthropic(req: ChatRequest): Promise<ChatResponse> {
    await simulateLatency();
    const lastMessage = req.messages[req.messages.length - 1];
    const modelName =
        req.model === "claude-4-6-sonnet"
            ? "Claude 4.6 Sonnet"
            : "Claude 3.5 Sonnet";
    return {
        content: `**[${modelName} Mock]**\n\nご質問「${lastMessage.content}」ありがとうございます。\n\n> これはモックレスポンスです。実際のAPIキーを設定すれば、Anthropic ${modelName} が応答します。\n\n\`\`\`python\nprint("Hello from ${modelName}!")\n\`\`\``,
    };
}

/**
 * Call OpenAI DALL·E 3 image generation API.
 */
async function callDallE(req: ChatRequest): Promise<ChatResponse> {
    await simulateLatency();
    const lastMessage = req.messages[req.messages.length - 1];
    return {
        content: `DALL·E 3 で「${lastMessage.content}」の画像を生成しました。`,
        imageUrl:
            "https://images.unsplash.com/photo-1676299081847-824916de030a?w=512&h=512&fit=crop",
    };
    // --- PRODUCTION EXAMPLE ---
    // const res = await fetch("https://api.openai.com/v1/images/generations", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${req.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: "dall-e-3",
    //     prompt: lastMessage.content,
    //     n: 1,
    //     size: "1024x1024",
    //   }),
    // });
    // const json = await res.json();
    // return { content: "画像を生成しました。", imageUrl: json.data[0].url };
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
        "gpt-5": callOpenAI,
        "gemini-1.5-pro": callGemini,
        "gemini-3.0-pro": callGemini,
        "claude-3-5-sonnet": callAnthropic,
        "claude-4-6-sonnet": callAnthropic,
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
