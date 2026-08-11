import { useEffect, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { settingsApi, providersApi } from "@/lib/api";
import { getAllModelCapabilities } from "@/lib/modelCapabilities";
import type { CompositeModelBinding } from "@/lib/api";

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

const MODALITY_LABELS: Record<string, string> = {
  text: "文本",
  image: "图片",
  audio: "音频",
  video: "视频",
};

const MODALITY_COLORS: Record<string, string> = {
  text: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
  image: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  audio: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  video: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
};

export function RoutingTabContent() {
  const { t } = useTranslation();
  const [subTab, setSubTab] = useState("auto");
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
  const [bindings, setBindings] = useState<CompositeModelBinding[]>([]);
  const [newBinding, setNewBinding] = useState<CompositeModelBinding>(emptyBinding);
  const [showAddForm, setShowAddForm] = useState(false);
  const [bindingsBusy, setBindingsBusy] = useState(false);

  // Model capabilities reference
  const [searchText, setSearchText] = useState("");
  const [filterModality, setFilterModality] = useState<string>("all");
  const allCapabilities = useMemo(() => getAllModelCapabilities(), []);

  const filteredCapabilities = useMemo(() => {
    let result = allCapabilities;
    if (filterModality !== "all") {
      result = result.filter((cap) => cap.modalities.includes(filterModality));
    }
    if (searchText.trim()) {
      const q = searchText.toLowerCase().trim();
      result = result.filter((cap) => cap.name.toLowerCase().includes(q));
    }
    return result;
  }, [allCapabilities, filterModality, searchText]);

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
        setBindings(cfg.composite_bindings ?? []);
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
    const prevConfig = config;
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    setIsSaving(true);
    try {
      await settingsApi.setMultimodalRoutingConfig({
        ...newConfig,
        composite_bindings: bindings,
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
      setConfig(prevConfig);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddBinding = async () => {
    if (!newBinding.name.trim() || !newBinding.eyes_model || !newBinding.brain_model) {
      toast.error(
        t("settings.routing.bindings.fillRequired", {
          defaultValue: "请填写所有必填字段",
        }),
      );
      return;
    }
    setBindingsBusy(true);
    try {
      await settingsApi.addCompositeModel(newBinding);
      const cfg = await settingsApi.getMultimodalRoutingConfig();
      setBindings(cfg.composite_bindings ?? []);
      setNewBinding(emptyBinding());
      setShowAddForm(false);
      toast.success(
        t("settings.routing.bindings.added", {
          defaultValue: "组合模型绑定已添加",
        }),
      );
    } catch (e) {
      console.error("Failed to add binding:", e);
      toast.error(
        t("settings.routing.bindings.addFailed", {
          defaultValue: "添加绑定失败",
        }),
      );
    } finally {
      setBindingsBusy(false);
    }
  };

  const handleRemoveBinding = async (name: string) => {
    setBindingsBusy(true);
    try {
      await settingsApi.removeCompositeModel(name);
      const cfg = await settingsApi.getMultimodalRoutingConfig();
      setBindings(cfg.composite_bindings ?? []);
      toast.success(
        t("settings.routing.bindings.removed", {
          defaultValue: "绑定已删除",
        }),
      );
    } catch (e) {
      console.error("Failed to remove binding:", e);
      toast.error(
        t("settings.routing.bindings.removeFailed", {
          defaultValue: "删除绑定失败",
        }),
      );
    } finally {
      setBindingsBusy(false);
    }
  };

  if (isLoading) return null;

  const providerOptions = Object.values(providers);

  return (
    <div className="space-y-6">
      <Tabs value={subTab} onValueChange={setSubTab}>
        <TabsList className="grid w-full grid-cols-3 glass rounded-lg mb-6">
          <TabsTrigger value="auto">
            {t("settings.routing.autoTab", { defaultValue: "多模态自动路由" })}
          </TabsTrigger>
          <TabsTrigger value="capabilities">
            {t("settings.routing.capabilitiesTab", { defaultValue: "模型能力字典" })}
          </TabsTrigger>
          <TabsTrigger value="bindings">
            {t("settings.routing.bindingsTab", { defaultValue: "组合模型绑定" })}
          </TabsTrigger>
        </TabsList>

        {/* Sub-tab 1: Auto-routing config */}
        <TabsContent value="auto" className="space-y-6 mt-0">
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
        </TabsContent>

        {/* Sub-tab 2: Model capabilities reference */}
        <TabsContent value="capabilities" className="space-y-4 mt-0">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              {t("settings.routing.capabilitiesTitle", { defaultValue: "模型能力字典" })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.routing.capabilitiesDesc", {
                defaultValue:
                  "内置的模型能力参考列表，列出各模型支持的多模态类型、推理能力、思考强度档位及上下文上限。",
              })}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              placeholder={t("settings.routing.searchModel", { defaultValue: "搜索模型名称..." }) ?? undefined}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="sm:max-w-xs"
            />
            <Select value={filterModality} onValueChange={setFilterModality}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("settings.routing.filterModality", { defaultValue: "筛选模态" }) ?? undefined} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  {t("settings.routing.allModalities", { defaultValue: "全部模态" })}
                </SelectItem>
                <SelectItem value="image">
                  {t("settings.routing.imageOnly", { defaultValue: "支持图片" })}
                </SelectItem>
                <SelectItem value="audio">
                  {t("settings.routing.audioOnly", { defaultValue: "支持音频" })}
                </SelectItem>
                <SelectItem value="video">
                  {t("settings.routing.videoOnly", { defaultValue: "支持视频" })}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border-default overflow-hidden">
            <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="sticky top-0 bg-background">
                      {t("settings.routing.modelName", { defaultValue: "模型名称" })}
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background">
                      {t("settings.routing.modalities", { defaultValue: "支持模态" })}
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background text-center w-20">
                      {t("settings.routing.reasoning", { defaultValue: "推理" })}
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background">
                      {t("settings.routing.thinkingStrength", { defaultValue: "思考强度" })}
                    </TableHead>
                    <TableHead className="sticky top-0 bg-background text-right w-28">
                      {t("settings.routing.contextLimit", { defaultValue: "上下文限制" })}
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredCapabilities.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                        {t("settings.routing.noResults", { defaultValue: "无匹配结果" })}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCapabilities.map((cap) => (
                      <TableRow key={cap.name}>
                        <TableCell className="font-mono text-xs">{cap.name}</TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {cap.modalities.map((mod) => (
                              <Badge
                                key={mod}
                                variant="secondary"
                                className={`text-xs ${MODALITY_COLORS[mod] || ""}`}
                              >
                                {MODALITY_LABELS[mod] || mod}
                              </Badge>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {cap.reasoning ? (
                            <Badge variant="default" className="text-xs bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300">
                              {t("common.yes", { defaultValue: "是" })}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {cap.thinkingStrength && cap.thinkingStrength.length > 0
                            ? cap.thinkingStrength.join(", ")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {(cap.contextLimit ?? 0) > 0
                            ? cap.contextLimit!.toLocaleString()
                            : "-"}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">
            {t("settings.routing.capabilitiesHint", {
              defaultValue: `共 ${allCapabilities.length} 个模型。相同名称视为同一模型，不区分 URL/供应商。`,
            })}
          </p>
        </TabsContent>

        {/* Sub-tab 3: Composite model bindings */}
        <TabsContent value="bindings" className="space-y-4 mt-0">
          <div className="space-y-1">
            <h3 className="text-base font-semibold">
              {t("settings.routing.bindingsTitle", { defaultValue: "组合模型绑定" })}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t("settings.routing.bindingsDesc", {
                defaultValue:
                  "将视觉模型（Eyes）与推理模型（Brain）绑定为同一逻辑模型。",
              })}
            </p>
          </div>

          {bindings.length > 0 && (
            <div className="space-y-2 mb-4">
              {bindings.map((binding) => (
                <div
                  key={binding.name}
                  className="flex items-center justify-between rounded-md border border-border-default px-4 py-3"
                >
                  <div className="space-y-0.5 min-w-0 flex-1">
                    <p className="text-sm font-medium">{binding.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      Eyes: {binding.eyes_model || "—"}
                      {binding.eyes_provider_id
                        ? ` @ ${providers[binding.eyes_provider_id]?.name || binding.eyes_provider_id}`
                        : ""}
                      {" | "}
                      Brain: {binding.brain_model || "—"}
                      {binding.brain_provider_id
                        ? ` @ ${providers[binding.brain_provider_id]?.name || binding.brain_provider_id}`
                        : ""}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveBinding(binding.name)}
                    disabled={bindingsBusy}
                    className="hover:bg-muted/50 ml-4 flex-shrink-0"
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
              disabled={bindingsBusy}
            >
              {t("settings.routing.bindings.add", { defaultValue: "添加绑定" })}
            </Button>
          ) : (
            <div className="space-y-4 rounded-md border border-border-default p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>
                    {t("settings.routing.bindings.name", { defaultValue: "名称" })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.name}
                    onChange={(e) =>
                      setNewBinding((prev) => ({ ...prev, name: e.target.value }))
                    }
                    placeholder={t("settings.routing.bindings.namePlaceholder", {
                      defaultValue: "例: vision-reasoning",
                    }) ?? undefined}
                    disabled={bindingsBusy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.routing.bindings.eyesModel", { defaultValue: "Eyes 模型" })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.eyes_model}
                    onChange={(e) =>
                      setNewBinding((prev) => ({ ...prev, eyes_model: e.target.value }))
                    }
                    placeholder={t("settings.routing.bindings.modelPlaceholder", {
                      defaultValue: "例: gpt-4o",
                    }) ?? undefined}
                    disabled={bindingsBusy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.routing.bindings.eyesProvider", { defaultValue: "Eyes 供应商" })}
                  </Label>
                  <Select
                    value={newBinding.eyes_provider_id || undefined}
                    onValueChange={(value) =>
                      setNewBinding((prev) => ({ ...prev, eyes_provider_id: value }))
                    }
                    disabled={bindingsBusy || providerOptions.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={t("settings.routing.bindings.selectProvider", {
                          defaultValue: "选择供应商",
                        }) ?? undefined}
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
                    {t("settings.routing.bindings.brainModel", { defaultValue: "Brain 模型" })}
                    <span className="text-destructive ml-0.5">*</span>
                  </Label>
                  <Input
                    value={newBinding.brain_model}
                    onChange={(e) =>
                      setNewBinding((prev) => ({ ...prev, brain_model: e.target.value }))
                    }
                    placeholder={t("settings.routing.bindings.modelPlaceholder", {
                      defaultValue: "例: o3",
                    }) ?? undefined}
                    disabled={bindingsBusy}
                  />
                </div>
                <div className="space-y-2">
                  <Label>
                    {t("settings.routing.bindings.brainProvider", { defaultValue: "Brain 供应商" })}
                  </Label>
                  <Select
                    value={newBinding.brain_provider_id || undefined}
                    onValueChange={(value) =>
                      setNewBinding((prev) => ({ ...prev, brain_provider_id: value }))
                    }
                    disabled={bindingsBusy || providerOptions.length === 0}
                  >
                    <SelectTrigger className="h-9">
                      <SelectValue
                        placeholder={t("settings.routing.bindings.selectProvider", {
                          defaultValue: "选择供应商",
                        }) ?? undefined}
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
                <Button size="sm" onClick={handleAddBinding} disabled={bindingsBusy}>
                  {bindingsBusy
                    ? t("common.saving", { defaultValue: "保存中..." })
                    : t("settings.routing.bindings.add", { defaultValue: "添加" })}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewBinding(emptyBinding());
                  }}
                  disabled={bindingsBusy}
                >
                  {t("common.cancel", { defaultValue: "取消" })}
                </Button>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
