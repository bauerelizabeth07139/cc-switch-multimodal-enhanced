export interface ModelCapability {
  name: string;
  modalities: string[];
  reasoning?: boolean;
  thinkingStrength?: string[];
  contextLimit?: number;
  outputModalities?: string[];
}

const MODEL_CAPABILITIES: ModelCapability[] = [
  // ---- OpenAI ----
  { name: "gpt-4o", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "gpt-4o-mini", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "gpt-4-turbo", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "gpt-4.1", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 1047576 },
  { name: "gpt-4.1-mini", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 1047576 },
  { name: "gpt-4.1-nano", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 1047576 },
  { name: "gpt-5", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 400000 },
  { name: "gpt-5-mini", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 400000 },
  { name: "gpt-5-nano", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 400000 },
  { name: "gpt-5-pro", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["high"], contextLimit: 400000 },
  { name: "gpt-5.1", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 400000 },
  { name: "gpt-5.2", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 400000 },
  { name: "gpt-5.3", modalities: ["text"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 400000 },
  { name: "gpt-5.4", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1050000 },
  { name: "gpt-5.5", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1050000 },
  { name: "gpt-5.6", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1050000 },
  { name: "gpt-5.6-sol", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1050000 },
  { name: "o1", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "o1-mini", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "o3", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "o3-mini", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "o3-pro", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "o4-mini", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  // ---- Anthropic Claude ----
  { name: "claude-3-opus", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-3-sonnet", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-3-haiku", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-3.5-sonnet", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-3.5-haiku", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-opus-4", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "claude-opus-4-20250514", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "claude-opus-4.5", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 200000 },
  { name: "claude-opus-4.6", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 1000000 },
  { name: "claude-opus-5", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1000000 },
  { name: "claude-sonnet-4", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "claude-sonnet-4-20250514", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "claude-sonnet-4.5", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "claude-sonnet-4.6", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 1000000 },
  { name: "claude-sonnet-5", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "medium", "high", "xhigh"], contextLimit: 1000000 },
  { name: "claude-haiku-4.5", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  // ---- Google Gemini ----
  { name: "gemini-1.5-flash", modalities: ["text", "image", "audio", "video"], reasoning: false, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-1.5-pro", modalities: ["text", "image", "audio", "video"], reasoning: false, thinkingStrength: [], contextLimit: 2000000 },
  { name: "gemini-2.0-flash", modalities: ["text", "image", "audio", "video"], reasoning: false, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-2.5-flash", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-2.5-flash-lite", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-2.5-pro", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3-pro", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3-pro-preview", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3-flash-preview", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3.6-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3.1-flash-lite", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-3.5-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "gemini-pro", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 32768 },
  // ---- DeepSeek ----
  { name: "deepseek-chat", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "deepseek-reasoner", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "deepseek-v3", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "deepseek-v3.1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "deepseek-v3.2", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "deepseek-v4-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "deepseek-v4-pro", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "deepseek-v4-lite", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "deepseek-v4-ultra", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "us.deepseek.r1-v1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  // ---- Alibaba Qwen ----
  { name: "qwen-max", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "qwen3-max", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-coder", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-coder-480b", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-coder-480b-a35b-instruct", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-coder-plus", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3-coder-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3-coder-next", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-coder-ultra", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3-coder-vl", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-7-max", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-32b", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3-235b-a22b", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qwen3.5-plus", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3.6-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3.6-plus", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3.7-max", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3.7-plus", modalities: ["text", "image", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwen3.8-max", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "qwq-32b", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "qwq-plus", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  // ---- Zhipu GLM ----
  { name: "glm-4.6", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-4.7", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-5", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-5.1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-5.2", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "glm-5-turbo", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-5.2v", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-5v-turbo", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "glm-4-air", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "glm-4-flash", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  // ---- MiniMax ----
  { name: "minimax-m2", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "minimax-m2.1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "minimax-m2.5", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 192000 },
  { name: "minimax-m2.7", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "minimax-m2.7-highspeed", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "minimax-m2.7-vision", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "minimax-m3", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  // ---- StepFun (阶跃星辰) ----
  { name: "step-1o-turbo-vision", modalities: ["text", "image", "video"], reasoning: false, thinkingStrength: [], contextLimit: 32000 },
  { name: "step-2x-large", modalities: ["text", "image"], reasoning: false, thinkingStrength: [], contextLimit: 0, outputModalities: ["image"] },
  { name: "step-3.5-flash", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "step-3.5-flash-2603", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "step-3.5-flash-vision", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "step-3.7-flash", modalities: ["text", "image", "video"], reasoning: true, thinkingStrength: ["low", "medium", "high"], contextLimit: 256000 },
  { name: "step-gui", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "step-overture-preview", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  // ---- xAI Grok ----
  { name: "grok-3", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "grok-3-mini", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "grok-4", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1048576 },
  { name: "grok-4-fast", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1048576 },
  { name: "grok-4.3", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-4.5", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-4.20-0309-reasoning", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-4.20-0309-non-reasoning", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-4-1-fast-reasoning", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-4-1-fast-non-reasoning", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 1000000 },
  { name: "grok-code-fast-1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  // ---- Moonshot/Kimi ----
  { name: "kimi-k2", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "kimi-k2-0905", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "kimi-k2.5", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "kimi-k2.6", modalities: ["text", "image", "video"], reasoning: true, thinkingStrength: [], contextLimit: 262144 },
  { name: "kimi-k2.7-code", modalities: ["text", "image", "video"], reasoning: true, thinkingStrength: [], contextLimit: 262144 },
  { name: "kimi-k2.7-code-highspeed", modalities: ["text", "image", "video"], reasoning: true, thinkingStrength: [], contextLimit: 262144 },
  { name: "kimi-k3", modalities: ["text", "image"], reasoning: true, thinkingStrength: ["low", "high"], contextLimit: 1048576 },
  { name: "kimi-for-coding", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "kimi-k2-thinking", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "kimi-k2-turbo", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  // ---- Mistral ----
  { name: "mistral-large-3-2512", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "mistral-medium-3.1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "mistral-medium-3.5", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "mistral-small-3.2-24b", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "mistral-small-4", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 131072 },
  { name: "codestral-2508", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 256000 },
  { name: "devstral-medium", modalities: ["text"], reasoning: false, thinkingStrength: [], contextLimit: 128000 },
  { name: "devstral-small-2-2512", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "magistral-medium", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  { name: "magistral-small", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 128000 },
  // ---- ByteDance Doubao ----
  { name: "doubao-seed-2-0-code", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-2-0-lite", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-2-0-mini", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-2-0-pro", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-2-1-pro", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-2-1-turbo", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "doubao-seed-1-6", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  // ---- Tencent Hunyuan ----
  { name: "hunyuan-hy3", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "hy3", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "hy3-preview", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  // ---- Coding-agent aggregators / special names ----
  { name: "ark-code-latest", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "qianfan-code-latest", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 200000 },
  { name: "kat-coder", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "kat-coder-pro", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "kat-coder-pro-v1", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "kat-coder-pro-v2", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "ling-2.5-1t", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "ling-2.6-1t", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "longcat-2.0", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "longcat-flash-chat", modalities: ["text"], reasoning: true, thinkingStrength: [], contextLimit: 256000 },
  { name: "mimo-v2.5", modalities: ["text", "image", "audio", "video"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "mimo-v2.5-pro", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "mimo-v2-flash", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
  { name: "mimo-v2-pro", modalities: ["text", "image"], reasoning: true, thinkingStrength: [], contextLimit: 1000000 },
];

export function getAllModelCapabilities(): ModelCapability[] {
  return MODEL_CAPABILITIES;
}

export function getModelCapability(modelName: string): ModelCapability | undefined {
  if (!modelName) return undefined;
  const normalized = modelName.toLowerCase().trim();
  const tail = normalized.split("/").pop() || normalized;

  return MODEL_CAPABILITIES.find((cap) => {
    const capName = cap.name.toLowerCase();
    return tail === capName || normalized.includes(capName) || capName.includes(tail);
  });
}

export function isModelMultimodal(modelName: string): boolean {
  const cap = getModelCapability(modelName);
  if (!cap) return false;
  return cap.modalities.some((m) => m === "image" || m === "audio" || m === "video");
}

export function getModelMultimodalTypes(modelName: string): string[] {
  const cap = getModelCapability(modelName);
  if (!cap) return [];
  return cap.modalities.filter((m) => m !== "text");
}
