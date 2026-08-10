<div align="center">

# CC Switch - Multimodal Enhanced

### 基于 CC Switch 的改版，新增多模态自动路由与组合模型绑定功能

[![Version](https://img.shields.io/github/v/release/bauerelizabeth07139/cc-switch-multimodal-enhanced?color=blue&label=version)](https://github.com/bauerelizabeth07139/cc-switch-multimodal-enhanced/releases)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-lightgrey.svg)](https://github.com/farion1231/cc-switch/releases)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-orange.svg)](https://tauri.app/)

</div>

## 关于本仓库

这是 [CC Switch](https://github.com/farion1231/cc-switch) 的开源改版（mod），由社区基于原版代码扩展多模态能力。原版由 **farion1231 (Jason Young)** 开发维护，遵循 MIT 协议开源。本改版在保留原版全部功能的基础上，新增了多模态自动路由与组合模型绑定功能。

- 原版仓库：<https://github.com/farion1231/cc-switch>
- 原版文档：<https://ccswitch.io>

## 相比原版新增的功能

### 1. 多模态自动路由（Settings > Routing）

当请求输入包含图片、视频或音频时，自动路由到支持多模态的模型。

- **无缝切换**：可以使用同一个 URL 下的同一个 Key，也可以使用不同 URL 的不同 Key
- **回退模型配置**：可指定回退模型名称和供应商
- **智能识别**：内置 comprehensive 模型能力字典，自动识别模型支持的模态（text / image / audio / video）
- **支持模型**：Step 3.7 Flash（全模态）、GPT-4o 系列、Claude 4/3.5 系列、Gemini 2.5/1.5 系列、DeepSeek、Qwen3 等

### 2. 组合模型绑定（Add Provider > Advanced）

在添加供应商的高级选项中，可以将多模态视觉模型（Eyes）与推理模型（Brain）绑定为一个新的逻辑模型。

- **用户自定义名称**：绑定后生成的新模型由用户取名字
- **Eyes + Brain 架构**：Eyes 模型处理视觉输入，Brain 模型负责最终推理
- **全局管理**：绑定创建后可在 Settings > Advanced > 组合模型绑定中查看和管理
- **支持跨供应商**：Eyes 和 Brain 可以使用不同供应商、不同 URL 和 Key

### 3. 模型能力字典

新增了 comprehensive 的模型能力字典，覆盖：

- **模态支持**：text / image / audio / video
- **推理支持**：是否支持 reasoning 模式
- **思考强度档位**：auto / low / medium / high / xhigh（根据模型自动推荐）
- **上下文上限**：每个模型的推荐上下文窗口大小

**设计原则**：同一个模型名字即认为是同一个模型，不管 URL 是什么。

### 4. 推理模型配置增强

在配置新供应商时，现在可以：

- **选择是否为推理模型**：标记供应商支持 reasoning
- **获取思考强度档位**：根据选择的模型自动推荐可用的思考强度
- **获取上下文上限**：根据模型自动填充推荐的上下文限制数量

这些能力信息来自内置的模型字典，无需手动查询文档。

## 原版功能保留

本改版完全保留 CC Switch 原版的所有核心功能：

- **8 种 AI 工具统一管理**：Claude Code、Claude Desktop、Codex、Gemini CLI、Grok Build、OpenCode、OpenClaw、Hermes
- **50+ 供应商预设**
- **本地代理与故障转移**
- **MCP / Prompts / Skills 统一管理**
- **系统托盘快速切换**
- **云同步**
- **跨平台支持**（Windows / macOS / Linux）

## 快速开始

### 添加多模态供应商

1. 点击 **Add Provider**
2. 选择应用类型（Claude / Codex / Gemini 等）
3. 填写 API Key 和端点
4. 在 **Advanced** 高级选项中：
   - 可启用 **推理模型** 并配置思考强度和上下文限制
   - 可创建 **组合模型绑定**，将视觉模型与推理模型绑定

### 配置自动路由

1. 打开 **Settings**
2. 切换到 **Routing** 标签页
3. 启用 **多模态自动路由**
4. 配置回退模型和供应商

## 测试说明

使用 Step Plan Key 测试：

```
2L5DXp5JijQW9a4tiL5d4SjqCT6iGrYTA5DoSRRx5VzwHKjmn0YxmM8eul8ehWJ1x
```

- **Step 3.7 Flash**：已标记为全模态模型（text / image / audio / video），支持推理，思考强度档位 low/medium/high/xhigh，上下文限制 128k
- 其余模型均按字典配置处理

## 构建与开发

```bash
# 安装依赖
pnpm install

# 开发模式
pnpm dev

# 构建
pnpm build

# 类型检查
pnpm typecheck

# 运行测试
pnpm test:unit
```

## 分支说明

- `main`：原版 CC Switch 代码，未做任何修改
- `feat/multimodal-routing-provider-bindings`：本改版功能分支

## License

MIT © Jason Young (原版) | 本改版遵循相同 MIT 协议
