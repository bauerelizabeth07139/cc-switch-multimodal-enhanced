import { useTranslation } from "react-i18next";
import { useState, useEffect, useMemo, useRef } from "react";
import { ChevronDown, ChevronRight, Coins, Brain, Link2, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ModelCapability } from "@/lib/modelCapabilities";
export type PricingModelSourceOption = "inherit" | "request" | "response";

interface ProviderPricingConfig {
  enabled: boolean;
  costMultiplier?: string;
  pricingModelSource: PricingModelSourceOption;
}

export interface ReasoningConfig {
  isReasoningModel: boolean;
  thinkingStrength: string;
  contextLimit: string;
}

export interface CompositeBindingForm {
  name: string;
  eyes_model: string;
  eyes_provider_id: string;
  brain_model: string;
  brain_provider_id: string;
}

interface ProviderAdvancedConfigProps {
  pricingConfig: ProviderPricingConfig;
  onPricingConfigChange: (config: ProviderPricingConfig) => void;
  reasoningConfig: ReasoningConfig;
  onReasoningConfigChange: (config: ReasoningConfig) => void;
  compositeBinding: CompositeBindingForm;
  onCompositeBindingChange: (binding: CompositeBindingForm) => void;
  onAddCompositeBinding: () => void;
  providers: Record<string, { id: string; name: string }>;
  modelName: string;
  modelCapability?: ModelCapability;
}

const THINKING_STRENGTH_OPTIONS = [
  { value: "auto", labelKey: "providerAdvanced.thinkingStrengthAuto", defaultLabel: "自动" },
  { value: "low", labelKey: "providerAdvanced.thinkingStrengthLow", defaultLabel: "低" },
  { value: "medium", labelKey: "providerAdvanced.thinkingStrengthMedium", defaultLabel: "中" },
  { value: "high", labelKey: "providerAdvanced.thinkingStrengthHigh", defaultLabel: "高" },
  { value: "xhigh", labelKey: "providerAdvanced.thinkingStrengthXhigh", defaultLabel: "超高" },
];

export function ProviderAdvancedConfig({
  pricingConfig,
  onPricingConfigChange,
  reasoningConfig,
  onReasoningConfigChange,
  compositeBinding,
  onCompositeBindingChange,
  onAddCompositeBinding,
  providers,
  modelCapability,
}: ProviderAdvancedConfigProps) {
  const { t } = useTranslation();
  const [isPricingConfigOpen, setIsPricingConfigOpen] = useState(
    pricingConfig.enabled,
  );
  const [isReasoningConfigOpen, setIsReasoningConfigOpen] = useState(
    reasoningConfig.isReasoningModel,
  );
  const [isCompositeBindingOpen, setIsCompositeBindingOpen] =
    useState(false);

  useEffect(() => {
    setIsPricingConfigOpen(pricingConfig.enabled);
  }, [pricingConfig.enabled]);

  const lastAutoAppliedCap = useRef<string | undefined>(undefined);

  useEffect(() => {
    if (!modelCapability) return;
    const capKey = modelCapability.name;
    if (lastAutoAppliedCap.current === capKey) return;
    lastAutoAppliedCap.current = capKey;

    const updates: Partial<ReasoningConfig> = {};
    let hasUpdate = false;

    if (modelCapability.reasoning && !reasoningConfig.isReasoningModel) {
      updates.isReasoningModel = true;
      hasUpdate = true;
    }

    if (
      modelCapability.thinkingStrength &&
      modelCapability.thinkingStrength.length > 0 &&
      (reasoningConfig.thinkingStrength === "auto" ||
        !modelCapability.thinkingStrength.includes(
          reasoningConfig.thinkingStrength,
        ))
    ) {
      updates.thinkingStrength = modelCapability.thinkingStrength[0];
      hasUpdate = true;
    }

    if (
      modelCapability.contextLimit &&
      !reasoningConfig.contextLimit
    ) {
      updates.contextLimit = String(modelCapability.contextLimit);
      hasUpdate = true;
    }

    if (hasUpdate) {
      onReasoningConfigChange({ ...reasoningConfig, ...updates });
    }
  }, [modelCapability]);

  const effectiveThinkingStrengthOptions = useMemo(() => {
    let options: typeof THINKING_STRENGTH_OPTIONS;
    if (
      !modelCapability?.thinkingStrength ||
      modelCapability.thinkingStrength.length === 0
    ) {
      options = THINKING_STRENGTH_OPTIONS;
    } else {
      const allowed = new Set(modelCapability.thinkingStrength);
      options = THINKING_STRENGTH_OPTIONS.filter((opt) => {
        if (opt.value === "auto") return true;
        return allowed.has(opt.value);
      });
    }
    const current = reasoningConfig.thinkingStrength;
    if (current && !options.some((opt) => opt.value === current)) {
      options = [
        ...options,
        { value: current, labelKey: current, defaultLabel: current },
      ];
    }
    return options;
  }, [modelCapability, reasoningConfig.thinkingStrength]);

  const showThinkingStrengthHint =
    reasoningConfig.thinkingStrength !== "auto" &&
    !!modelCapability?.thinkingStrength &&
    modelCapability.thinkingStrength.length > 0 &&
    !modelCapability.thinkingStrength.includes(
      reasoningConfig.thinkingStrength,
    );

  const contextLimitFromCapability = modelCapability?.contextLimit;
  const contextLimitIsDefault =
    contextLimitFromCapability !== undefined &&
    reasoningConfig.contextLimit === String(contextLimitFromCapability);

  return (
    <div className="space-y-4">
      {/* 计费配置 */}
      <div className="rounded-lg border border-border/50 bg-muted/20">
        <button
          type="button"
          className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          onClick={() => setIsPricingConfigOpen(!isPricingConfigOpen)}
        >
          <div className="flex items-center gap-3">
            <Coins className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("providerAdvanced.pricingConfig", {
                defaultValue: "计费配置",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Label
                htmlFor="pricing-config-enabled"
                className="text-sm text-muted-foreground"
              >
                {t("providerAdvanced.useCustomPricing", {
                  defaultValue: "使用单独配置",
                })}
              </Label>
              <Switch
                id="pricing-config-enabled"
                checked={pricingConfig.enabled}
                onCheckedChange={(checked) => {
                  onPricingConfigChange({ ...pricingConfig, enabled: checked });
                  if (checked) setIsPricingConfigOpen(true);
                }}
              />
            </div>
            {isPricingConfigOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isPricingConfigOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <div className="border-t border-border/50 p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("providerAdvanced.pricingConfigDesc", {
                defaultValue:
                  "为此供应商配置单独的计费参数，不启用时使用全局默认配置。",
              })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cost-multiplier">
                  {t("providerAdvanced.costMultiplier", {
                    defaultValue: "成本倍率",
                  })}
                </Label>
                <Input
                  id="cost-multiplier"
                  type="number"
                  step="0.01"
                  min="0"
                  inputMode="decimal"
                  value={pricingConfig.costMultiplier || ""}
                  onChange={(e) =>
                    onPricingConfigChange({
                      ...pricingConfig,
                      costMultiplier: e.target.value || undefined,
                    })
                  }
                  placeholder={t("providerAdvanced.costMultiplierPlaceholder", {
                    defaultValue: "留空使用全局默认（1）",
                  })}
                  disabled={!pricingConfig.enabled}
                />
                <p className="text-xs text-muted-foreground">
                  {t("providerAdvanced.costMultiplierHint", {
                    defaultValue: "实际成本 = 基础成本 × 倍率，支持小数如 1.5",
                  })}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pricing-model-source">
                  {t("providerAdvanced.pricingModelSourceLabel", {
                    defaultValue: "计费模式",
                  })}
                </Label>
                <Select
                  value={pricingConfig.pricingModelSource}
                  onValueChange={(value) =>
                    onPricingConfigChange({
                      ...pricingConfig,
                      pricingModelSource: value as PricingModelSourceOption,
                    })
                  }
                  disabled={!pricingConfig.enabled}
                >
                  <SelectTrigger id="pricing-model-source">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">
                      {t("providerAdvanced.pricingModelSourceInherit", {
                        defaultValue: "继承全局默认",
                      })}
                    </SelectItem>
                    <SelectItem value="request">
                      {t("providerAdvanced.pricingModelSourceRequest", {
                        defaultValue: "请求模型",
                      })}
                    </SelectItem>
                    <SelectItem value="response">
                      {t("providerAdvanced.pricingModelSourceResponse", {
                        defaultValue: "返回模型",
                      })}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  {t("providerAdvanced.pricingModelSourceHint", {
                    defaultValue: "选择按请求模型还是返回模型进行定价匹配",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 推理模型配置 */}
      <div className="rounded-lg border border-border/50 bg-muted/20">
        <button
          type="button"
          className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          onClick={() => setIsReasoningConfigOpen(!isReasoningConfigOpen)}
        >
          <div className="flex items-center gap-3">
            <Brain className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("providerAdvanced.reasoningConfig", {
                defaultValue: "推理模型配置",
              })}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2"
              onClick={(e) => e.stopPropagation()}
            >
              <Label
                htmlFor="reasoning-model-enabled"
                className="text-sm text-muted-foreground"
              >
                {t("providerAdvanced.reasoningModel", {
                  defaultValue: "推理模型",
                })}
              </Label>
              <Switch
                id="reasoning-model-enabled"
                checked={reasoningConfig.isReasoningModel}
                onCheckedChange={(checked) => {
                  onReasoningConfigChange({
                    ...reasoningConfig,
                    isReasoningModel: checked,
                  });
                  if (checked) setIsReasoningConfigOpen(true);
                }}
              />
            </div>
            {isReasoningConfigOpen ? (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isReasoningConfigOpen
              ? "max-h-[500px] opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <div className="border-t border-border/50 p-4 space-y-4">
            {modelCapability && (
              <div className="flex flex-wrap items-center gap-2 rounded-md bg-blue-50 dark:bg-blue-950/30 px-3 py-2">
                <Eye className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                  {modelCapability.name}
                </span>
                {modelCapability.modalities.map((mod) => (
                  <Badge
                    key={mod}
                    variant="secondary"
                    className="text-[10px] px-1.5 py-0"
                  >
                    {mod}
                  </Badge>
                ))}
                {modelCapability.reasoning && (
                  <Badge
                    variant="default"
                    className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300"
                  >
                    {t("providerAdvanced.capReasoning", { defaultValue: "推理" })}
                  </Badge>
                )}
                {(modelCapability.contextLimit ?? 0) > 0 && (
                  <span className="text-[10px] text-muted-foreground">
                    {modelCapability.contextLimit!.toLocaleString()} ctx
                  </span>
                )}
              </div>
            )}
            {modelCapability?.reasoning && !reasoningConfig.isReasoningModel && (
              <p className="text-xs text-muted-foreground">
                {t("providerAdvanced.reasoningModelHint", {
                  defaultValue:
                    "当前模型支持推理能力，建议启用推理模型选项。",
                })}
              </p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="thinking-strength">
                  {t("providerAdvanced.thinkingStrength", {
                    defaultValue: "思考强度",
                  })}
                </Label>
                <Select
                  value={reasoningConfig.thinkingStrength}
                  onValueChange={(value) =>
                    onReasoningConfigChange({
                      ...reasoningConfig,
                      thinkingStrength: value,
                    })
                  }
                >
                  <SelectTrigger id="thinking-strength">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {effectiveThinkingStrengthOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {t(opt.labelKey, { defaultValue: opt.defaultLabel })}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {showThinkingStrengthHint && (
                  <p className="text-xs text-destructive">
                    {t("providerAdvanced.thinkingStrengthNotRecommended", {
                      defaultValue:
                        "当前模型推荐思考强度：{{strengths}}",
                      strengths: modelCapability.thinkingStrength?.join(", "),
                    })}
                  </p>
                )}
                {modelCapability?.thinkingStrength &&
                  modelCapability.thinkingStrength.length > 0 && (
                    <p className="text-xs text-muted-foreground">
                      {t("providerAdvanced.thinkingStrengthAvailable", {
                        defaultValue:
                          "可用强度：{{strengths}}",
                        strengths: modelCapability.thinkingStrength.join(", "),
                      })}
                    </p>
                  )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="context-limit">
                  {t("providerAdvanced.contextLimit", {
                    defaultValue: "上下文限制",
                  })}
                </Label>
                <Input
                  id="context-limit"
                  type="number"
                  min={1}
                  inputMode="numeric"
                  value={reasoningConfig.contextLimit}
                  onChange={(e) =>
                    onReasoningConfigChange({
                      ...reasoningConfig,
                      contextLimit: e.target.value,
                    })
                  }
                  placeholder={
                    contextLimitFromCapability
                      ? String(contextLimitFromCapability)
                      : t("providerAdvanced.contextLimitPlaceholder", {
                          defaultValue: "留空使用模型默认值",
                        })
                  }
                />
                {contextLimitFromCapability && (
                  <p className="text-xs text-muted-foreground">
                    {contextLimitIsDefault
                      ? t("providerAdvanced.contextLimitDefault", {
                          defaultValue: "模型默认：{{limit}}",
                          limit: contextLimitFromCapability,
                        })
                      : t("providerAdvanced.contextLimitModelDefault", {
                          defaultValue: "模型推荐：{{limit}}",
                          limit: contextLimitFromCapability,
                        })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 组合模型绑定 */}
      <div className="rounded-lg border border-border/50 bg-muted/20">
        <button
          type="button"
          className="flex w-full items-center justify-between p-4 hover:bg-muted/30 transition-colors"
          onClick={() => setIsCompositeBindingOpen(!isCompositeBindingOpen)}
        >
          <div className="flex items-center gap-3">
            <Link2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {t("providerAdvanced.compositeBinding", {
                defaultValue: "组合模型绑定",
              })}
            </span>
          </div>
          {isCompositeBindingOpen ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </button>
        <div
          className={cn(
            "overflow-hidden transition-all duration-200",
            isCompositeBindingOpen
              ? "max-h-[600px] opacity-100"
              : "max-h-0 opacity-0",
          )}
        >
          <div className="border-t border-border/50 p-4 space-y-4">
            <p className="text-sm text-muted-foreground">
              {t("providerAdvanced.compositeBindingDesc", {
                defaultValue:
                  "创建组合模型绑定，将视觉模型（eyes）与推理模型（brain）绑定在一起。",
              })}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="binding-name">
                  {t("providerAdvanced.bindingName", {
                    defaultValue: "绑定名称",
                  })}
                  <span className="text-destructive ml-1">*</span>
                </Label>
                <Input
                  id="binding-name"
                  value={compositeBinding.name}
                  onChange={(e) =>
                    onCompositeBindingChange({
                      ...compositeBinding,
                      name: e.target.value,
                    })
                  }
                  placeholder={t("providerAdvanced.bindingNamePlaceholder", {
                    defaultValue: "例如: my-binding",
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyes-model">
                  {t("providerAdvanced.eyesModel", {
                    defaultValue: "视觉模型 (Eyes)",
                  })}
                </Label>
                <Input
                  id="eyes-model"
                  value={compositeBinding.eyes_model}
                  onChange={(e) =>
                    onCompositeBindingChange({
                      ...compositeBinding,
                      eyes_model: e.target.value,
                    })
                  }
                  placeholder={t("providerAdvanced.eyesModelPlaceholder", {
                    defaultValue: "例如: gpt-4o",
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="eyes-provider">
                  {t("providerAdvanced.eyesProvider", {
                    defaultValue: "视觉供应商 (Eyes Provider)",
                  })}
                </Label>
                <Select
                  value={compositeBinding.eyes_provider_id || undefined}
                  onValueChange={(value) =>
                    onCompositeBindingChange({
                      ...compositeBinding,
                      eyes_provider_id: value,
                    })
                  }
                >
                  <SelectTrigger id="eyes-provider">
                    <SelectValue
                      placeholder={t("providerAdvanced.selectProvider", {
                        defaultValue: "选择供应商",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(providers).map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="brain-model">
                  {t("providerAdvanced.brainModel", {
                    defaultValue: "推理模型 (Brain)",
                  })}
                </Label>
                <Input
                  id="brain-model"
                  value={compositeBinding.brain_model}
                  onChange={(e) =>
                    onCompositeBindingChange({
                      ...compositeBinding,
                      brain_model: e.target.value,
                    })
                  }
                  placeholder={t("providerAdvanced.brainModelPlaceholder", {
                    defaultValue: "例如: deepseek-reasoner",
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="brain-provider">
                  {t("providerAdvanced.brainProvider", {
                    defaultValue: "推理供应商 (Brain Provider)",
                  })}
                </Label>
                <Select
                  value={compositeBinding.brain_provider_id || undefined}
                  onValueChange={(value) =>
                    onCompositeBindingChange({
                      ...compositeBinding,
                      brain_provider_id: value,
                    })
                  }
                >
                  <SelectTrigger id="brain-provider">
                    <SelectValue
                      placeholder={t("providerAdvanced.selectProvider", {
                        defaultValue: "选择供应商",
                      })}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(providers).map((provider) => (
                      <SelectItem key={provider.id} value={provider.id}>
                        {provider.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button
              type="button"
              onClick={onAddCompositeBinding}
              className="w-full md:w-auto"
            >
              {t("providerAdvanced.addBinding", {
                defaultValue: "添加绑定",
              })}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
