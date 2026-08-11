import { describe, expect, it } from "vitest";
import {
  getAllModelCapabilities,
  getModelCapability,
  isModelMultimodal,
} from "@/lib/modelCapabilities";

describe("modelCapabilities", () => {
  it("exposes a comprehensive dictionary", () => {
    const caps = getAllModelCapabilities();
    expect(caps.length).toBeGreaterThan(150);
  });

  it("classifies step-3.7-flash as multimodal (image+video) per step plan", () => {
    expect(isModelMultimodal("step-3.7-flash")).toBe(true);
    const cap = getModelCapability("step-3.7-flash");
    expect(cap?.modalities).toContain("image");
    expect(cap?.modalities).toContain("video");
  });

  it("classifies other step models as text-only", () => {
    expect(isModelMultimodal("step-3.5-flash")).toBe(false);
    expect(isModelMultimodal("step-3.5-flash-2603")).toBe(false);
  });

  it("treats the same model name as the same model regardless of URL", () => {
    expect(isModelMultimodal("openai/gpt-4o")).toBe(true);
    expect(isModelMultimodal("GPT-4O")).toBe(true);
    expect(isModelMultimodal("openrouter/google/gemini-2.5-pro")).toBe(true);
  });

  it("marks text-only models as non-multimodal", () => {
    expect(isModelMultimodal("deepseek-chat")).toBe(false);
    expect(isModelMultimodal("deepseek-reasoner")).toBe(false);
    expect(isModelMultimodal("glm-5.2")).toBe(false);
    expect(isModelMultimodal("step-3.5-flash")).toBe(false);
  });

  it("supports reasoning and context metadata", () => {
    const gpt5 = getModelCapability("gpt-5");
    expect(gpt5?.reasoning).toBe(true);
    expect(gpt5?.thinkingStrength).toContain("low");
    expect(gpt5?.contextLimit).toBeGreaterThan(0);
  });
});
