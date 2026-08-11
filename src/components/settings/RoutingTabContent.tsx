import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { settingsApi, providersApi } from "@/lib/api";

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

export function RoutingTabContent() {
  const { t } = useTranslation();
  const [config, setConfig] = useState<{
    enabled: boolean;
    fallback_model: string;
    fallback_provider_id: string;
  }>({
    enabled: false,
    fallback_model: "",
    fallback_provider_id: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [providers, setProviders] = useState<
    Record<string, { id: string; name: string }>
  >({});

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [cfg, ...providerMaps] = await Promise.all([
          settingsApi.getMultimodalRoutingConfig(),
          ...APP_IDS.map((appId) => providersApi.getAll(appId)),
        ]);
        if (cancelled) return;
        setConfig({
          enabled: cfg.enabled,
          fallback_model: cfg.fallback_model,
          fallback_provider_id: cfg.fallback_provider_id,
        });
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
        console.error("Failed to load routing config:", e);
        if (!cancelled) {
          toast.error(
            t("settings.routing.loadFailed", {
              defaultValue: "加载路由配置失败",
            }),
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [t]);

  const handleSaveConfig = async (updates: Partial<typeof config>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    setIsSaving(true);
    try {
      const existing = await settingsApi.getMultimodalRoutingConfig();
      await settingsApi.setMultimodalRoutingConfig({
        ...existing,
        ...newConfig,
      });
      toast.success(
        t("settings.routing.saveSuccess", {
          defaultValue: "路由配置已保存",
        }),
      );
    } catch (e) {
      console.error("Failed to save routing config:", e);
      toast.error(
        t("settings.routing.saveFailed", {
          defaultValue: "保存路由配置失败",
        }),
      );
      setConfig(config);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return null;

  const providerOptions = Object.values(providers);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h3 className="text-base font-semibold">
          {t("settings.routing.title", {
            defaultValue: "多模态自动路由",
          })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {t("settings.routing.description", {
            defaultValue: "当输入包含图片、视频或音频时，自动路由到支持多模态的模型",
          })}
        </p>
      </div>

      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>
            {t("settings.routing.enabled", {
              defaultValue: "启用多模态自动路由",
            })}
          </Label>
          <p className="text-xs text-muted-foreground">
            {t("settings.routing.enabledDescription", {
              defaultValue: "自动将多模态请求路由到支持视觉和推理的模型",
            })}
          </p>
        </div>
        <Switch
          checked={config.enabled}
          onCheckedChange={(checked) => handleSaveConfig({ enabled: checked })}
          disabled={isSaving}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>
            {t("settings.routing.fallbackModel", {
              defaultValue: "回退模型名称",
            })}
          </Label>
          <Input
            value={config.fallback_model}
            onChange={(e) =>
              setConfig((prev) => ({ ...prev, fallback_model: e.target.value }))
            }
            onBlur={(e) =>
              handleSaveConfig({ fallback_model: e.target.value })
            }
            placeholder={
              t("settings.routing.fallbackModelPlaceholder", {
                defaultValue: "例: gpt-4o",
              }) ?? undefined
            }
            disabled={isSaving}
          />
        </div>
        <div className="space-y-2">
          <Label>
            {t("settings.routing.fallbackProvider", {
              defaultValue: "回退供应商",
            })}
          </Label>
          <Select
            value={config.fallback_provider_id || undefined}
            onValueChange={(value) =>
              handleSaveConfig({ fallback_provider_id: value })
            }
            disabled={isSaving || providerOptions.length === 0}
          >
            <SelectTrigger className="h-9">
              <SelectValue
                placeholder={
                  t("settings.routing.selectProvider", {
                    defaultValue: "选择供应商",
                  }) ?? undefined
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
    </div>
  );
}
