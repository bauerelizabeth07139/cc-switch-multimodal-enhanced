export interface ModelCapability {
  name: string;
  modalities: string[];
  reasoning?: boolean;
  thinkingStrength?: string[];
  contextLimit?: number;
  outputModalities?: string[];
}

const MODEL_CAPABILITIES: ModelCapability[] = [
  {
    name: "step-3.7-flash",
    modalities: ["text", "image", "audio", "video"],
    reasoning: true,
    thinkingStrength: ["low", "medium", "high", "xhigh"],
    contextLimit: 128000,
  },
  {
    name: "gpt-4o",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 128000,
  },
  {
    name: "gpt-4o-mini",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 128000,
  },
  {
    name: "gpt-4-turbo",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 128000,
  },
  {
    name: "claude-opus-4",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 200000,
  },
  {
    name: "claude-sonnet-4",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 200000,
  },
  {
    name: "claude-3.5-sonnet",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 200000,
  },
  {
    name: "claude-3.5-haiku",
    modalities: ["text", "image"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 200000,
  },
  {
    name: "gemini-2.5-pro",
    modalities: ["text", "image", "audio", "video"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 1000000,
  },
  {
    name: "gemini-2.5-flash",
    modalities: ["text", "image", "audio", "video"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 1000000,
  },
  {
    name: "gemini-1.5-pro",
    modalities: ["text", "image", "audio", "video"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 1000000,
  },
  {
    name: "gemini-1.5-flash",
    modalities: ["text", "image", "audio", "video"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 1000000,
  },
  {
    name: "deepseek-chat",
    modalities: ["text"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 64000,
  },
  {
    name: "deepseek-reasoner",
    modalities: ["text"],
    reasoning: true,
    thinkingStrength: ["low", "medium", "high"],
    contextLimit: 64000,
  },
  {
    name: "qwen3-coder-480b",
    modalities: ["text", "image"],
    reasoning: true,
    thinkingStrength: ["low", "medium", "high"],
    contextLimit: 128000,
  },
  {
    name: "qwen3-coder-plus",
    modalities: ["text", "image"],
    reasoning: true,
    thinkingStrength: ["low", "medium", "high"],
    contextLimit: 128000,
  },
  {
    name: "qwen3-coder-flash",
    modalities: ["text", "image"],
    reasoning: true,
    thinkingStrength: ["low", "medium", "high"],
    contextLimit: 128000,
  },
  {
    name: "glm-5.2",
    modalities: ["text"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 128000,
  },
  {
    name: "minimax-m2.7",
    modalities: ["text"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 1000000,
  },
  {
    name: "step-3.5-flash",
    modalities: ["text"],
    reasoning: false,
    thinkingStrength: [],
    contextLimit: 128000,
  },
];

export function getAllModelCapabilities(): ModelCapability[] {
  return MODEL_CAPABILITIES;
}

export function getModelCapability(modelName: string): ModelCapability | undefined {
  const normalized = modelName.toLowerCase().trim();
  const tail = normalized.split("/").pop() || normalized;

  return MODEL_CAPABILITIES.find((cap) => {
    const capName = cap.name.toLowerCase();
    return tail === capName || normalized.includes(capName) || capName.includes(tail);
  });
}
