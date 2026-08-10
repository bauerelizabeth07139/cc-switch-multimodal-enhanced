import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  settingsApi,
  providersApi,
  type CompositeModelBinding,
  type MultimodalRoutingConfig,
} from "@/lib/api";

const APP_IDS = [
  "claude",
  "claude-desktop",
  "codex",
  "gemini",
  "grokbuild",
  "opencode",
  "openclaw",
  "hermes",
] as const;

const emptyBinding = (): CompositeModelBinding => ({
  name: "",
  eyes_model: "",
  eyes_provider_id: "",
  brain_model: "",
  brain_provider_id: "",
});

const emptyConfig = () => ({
  enabled: false,
  fallback_model: "",
  fallback_provider_id: "",
  composite_bindings: [] as CompositeModelBinding[],
});

export function MultimodalSettingsPanel() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<MultimodalRoutingConfig>(emptyConfig());
  const [isSaving, setIsSaving] = useState(false);
  const [providers, setProviders] = useState<Record<string, { id: string; name: string }>>({});
  const [newBinding, setNewBinding] = useState<CompositeModelBinding>(emptyBinding);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cfg, ...providerMaps] = await Promise.all([
          settingsApi.getMultimodalRoutingConfig(),
          ...APP_IDS.map((appId) => providersApi.getAll(appId)),
        ]);
        if (cancelled) return;
        setConfig(cfg);

        const merged: Record<string, { id: string; name: string }> = {};
        for (const map of providerMaps) {
          for (const p of Object.values(map)) {
            if (!merged[p.id]) {
              merged[p.id] = { id: p.id, name: p.name };
            }
          }
        }
        setProviders(merged);
      } catch (e) {
        console.error("Failed to load multimodal config:", e);
        if (!cancelled) {
          toast.error(
            t("settings.advanced.multimodal.loadFailed", {
              defaultValue: "加载多模态配置失败",
            }),
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleAddBinding = async () => {
    if (!newBinding.name.trim() || !newBinding.eyes_model || !newBinding.brain_model) {
      toast.error(
        t("settings.advanced.multimodal.fillRequired", {
          defaultValue: "请填写所有必填字段",
        }),
      );
      return;
    }
    setIsSaving(true);
    try {
      await settingsApi.addCompositeModel(newBinding);
      setConfig((prev) => ({
        ...prev,
        composite_bindings: [...prev.composite_bindings, { ...newBinding }],
      }));
      setNewBinding(emptyBinding());
      setShowAddForm(false);
      toast.success(
        t("settings.advanced.multimodal.bindingAdded", {
          defaultValue: "组合模型绑定已添加",
        }),
      );
    } catch (e) {
      console.error("Failed to add composite model:", e);
      toast.error(
        t("settings.advanced.multimodal.addBindingFailed", {
          defaultValue: "添加绑定失败",
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveBinding = async (name: string) => {
    setIsSaving(true);
    try {
      await settingsApi.removeCompositeModel(name);
      setConfig((prev) => ({
        ...prev,
        composite_bindings: prev.composite_bindings.filter(
          (b) => b.name !== name,
        ),
      }));
      toast.success(
        t("settings.advanced.multimodal.bindingRemoved", {
          defaultValue: "绑定已删除",
        }),
      );
    } catch (e) {
      console.error("Failed to remove composite model:", e);
      toast.error(
        t("settings.advanced.multimodal.removeBindingFailed", {
          defaultValue: "删除绑定失败",
        }),
      );
    } finally {
      setIsSaving(false);
    }
  };

  const providerOptions = useMemo(
    () => Object.values(providers),
    [providers],
  );

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">
          {t("settings.advanced.multimodal.compositeBindings.title", {
            defaultValue: "组合模型绑定",
          })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.advanced.multimodal.compositeBindings.description", {
            defaultValue: "管理多模态眼睛模型与推理大脑模型的绑定",
          })}
        </p>
      </div>

      <div className="border-t pt-6">
          <div className="space-y-1 mb-4">
            <h4 className="text-sm font-medium">
              {t("settings.advanced.multimodal.compositeBindings.title", {
                defaultValue: "组合模型绑定",
              })}
            </h4>
            <p className="text-xs text-muted-foreground">
              {t("settings.advanced.multimodal.compositeBindings.description", {
                defaultValue:
                  "将视觉模型（eyes）与推理模型（brain）绑定为同一逻辑模型",
              })}
            </p>
          </div>

          {config.composite_bindings.length > 0 && (
            <div className="space-y-2 mb-4">
              {config.composite_bindings.map((binding) => (
                <div
                  key={binding.name}
                  className="flex items-center justify-between rounded-md border border-border-default px-4 py-3"
                >
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">{binding.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {t(
                        "settings.advanced.multimodal.compositeBindings.summary",
                        {
                          defaultValue:
                            "Eyes: {{eyesModel}} @ {{eyesProvider}} | Brain: {{brainModel}} @ {{brainProvider}}",
                          eyesModel: binding.eyes_model || "—",
                          eyesProvider:
                            providers[binding.eyes_provider_id]?.name ||
                            binding.eyes_provider_id ||
                            "—",
                          brainModel: binding.brain_model || "—",
                          brainProvider:
                            providers[binding.brain_provider_id]?.name ||
                            binding.brain_provider_id ||
                            "—",
                        },
                      )}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBinding(binding.name)}
                    disabled={isSaving}
                    className="hover:bg-muted/50"
                  >
                    {t("common.delete", { defaultValue: "删除" })}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {!showAddForm ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAddForm(true)}
              disabled={isSaving}
            >
              {t("settings.advanced.multimodal.compositeBindings.add", {
                defaultValue: "添加绑定",
              })}
            </Button>
          ) : (
            <div className="space-y-4 rounded-md border border-border-default p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("settings.advanced.multimodal.compositeBindings.name", {
                      defaultValue: "名称",
                    })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.name}
                    onChange={(e) =>
                      setNewBinding((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder={
                      t(
                        "settings.advanced.multimodal.compositeBindings.namePlaceholder",
                        { defaultValue: "例: vision-reasoning" },
                      ) ?? undefined
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.advanced.multimodal.compositeBindings.eyesModel", {
                      defaultValue: "Eyes 模型",
                    })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.eyes_model}
                    onChange={(e) =>
                      setNewBinding((prev) => ({
                        ...prev,
                        eyes_model: e.target.value,
                      }))
                    }
                    placeholder={
                      t(
                        "settings.advanced.multimodal.compositeBindings.modelPlaceholder",
                        { defaultValue: "例: gpt-4o" },
                      ) ?? undefined
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.advanced.multimodal.compositeBindings.eyesProvider", {
                      defaultValue: "Eyes 供应商",
                    })}
                  </Label>
                  <Select
                    value={newBinding.eyes_provider_id || undefined}
                    onValueChange={(value) =>
                      setNewBinding((prev) => ({
                        ...prev,
                        eyes_provider_id: value,
                      }))
                    }
                    disabled={isSaving || providerOptions.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={
                          t(
                            "settings.advanced.multimodal.compositeBindings.selectProvider",
                            { defaultValue: "选择供应商" },
                          ) ?? undefined
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.advanced.multimodal.compositeBindings.brainModel", {
                      defaultValue: "Brain 模型",
                    })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.brain_model}
                    onChange={(e) =>
                      setNewBinding((prev) => ({
                        ...prev,
                        brain_model: e.target.value,
                      }))
                    }
                    placeholder={
                      t(
                        "settings.advanced.multimodal.compositeBindings.modelPlaceholder",
                        { defaultValue: "例: o3" },
                      ) ?? undefined
                    }
                    disabled={isSaving}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.advanced.multimodal.compositeBindings.brainProvider", {
                      defaultValue: "Brain 供应商",
                    })}
                  </Label>
                  <Select
                    value={newBinding.brain_provider_id || undefined}
                    onValueChange={(value) =>
                      setNewBinding((prev) => ({
                        ...prev,
                        brain_provider_id: value,
                      }))
                    }
                    disabled={isSaving || providerOptions.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={
                          t(
                            "settings.advanced.multimodal.compositeBindings.selectProvider",
                            { defaultValue: "选择供应商" },
                          ) ?? undefined
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {providerOptions.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={handleAddBinding}
                  disabled={isSaving}
                >
                  {isSaving
                    ? t("common.saving", { defaultValue: "保存中..." })
                    : t("settings.advanced.multimodal.compositeBindings.add", {
                        defaultValue: "添加",
                      })}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBinding(emptyBinding());
                  }}
                  disabled={isSaving}
                >
                  {t("common.cancel", { defaultValue: "取消" })}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
