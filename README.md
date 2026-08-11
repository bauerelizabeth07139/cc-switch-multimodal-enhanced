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

**路由标签页包含三个子选项卡：**

#### a) 多模态自动路由
- **启用开关**：一键开启/关闭多模态自动路由
- **回退模型配置**：可指定回退模型名称和供应商
- **无缝切换**：可以使用同一个 URL 下的同一个 Key，也可以使用不同 URL 的不同 Key

#### b) 模型能力字典（新增）
- **搜索与筛选**：支持按模型名称搜索，按模态类型（图片/音频/视频）筛选
- **Comprehensive 能力表**：展示内置的所有模型及其能力信息
  - 支持的模态类型（text / image / audio / video）
  - 是否支持推理 (reasoning)
  - 思考强度档位（low / medium / high / xhigh）
  - 上下文窗口大小
- **设计原则**：同一个模型名字即认为是同一个模型，不管 URL 是什么
- **内置模型数量**：170+ 模型，覆盖 OpenAI、Anthropic、Google、DeepSeek、Qwen、GLM、MiniMax、StepFun、Grok、Kimi、Mistral、Doubao、Hunyuan 等

#### c) 组合模型绑定
- **Eyes + Brain 架构**：将多模态视觉模型（Eyes）与推理模型（Brain）绑定为一个新的逻辑模型
- **用户自定义名称**：绑定后生成的新模型由用户取名字
- **跨供应商支持**：Eyes 和 Brain 可以使用不同供应商、不同 URL 和 Key
- **全局管理**：在此标签页中查看、添加、删除绑定

### 2. 组合模型绑定（添加/编辑供应商 > 高级选项）

在添加或编辑供应商时的**高级选项**中，可以直接创建组合模型绑定：

- **视觉模型 (Eyes)**：选择用于处理图片/视频/音频输入的多模态模型
- **推理模型 (Brain)**：选择负责最终推理的 LLM 模型
- **绑定名称**：用户自定义该组合模型的名称
- 绑定创建后会自动添加到路由设置中，也可在 Settings > Routing > 组合模型绑定中管理

### 3. 推理模型配置增强（添加/编辑供应商 > 高级选项）

在配置新供应商时，**高级选项 > 推理模型配置**现在支持：

- **自动识别**：根据模型名称自动从内置字典查找是否为推理模型
- **自动填充思考强度**：模型支持推理时自动填充推荐的思考强度档位
- **自动填充上下文限制**：根据模型自动填充推荐的上下文窗口大小
- **能力提示**：配置区顶部显示当前模型的完整能力信息（模态类型、推理支持、上下文大小）
- **适用所有应用类型**：Claude、Codex、Gemini、OpenCode、OpenClaw、Hermes 全支持

### 4. 模型能力字典（底层升级）

相比原版的 ~20 个模型，现已扩充到 **170+ 个模型**，与 Rust 后端的 `multimodal_router.rs` 完全同步：

- **OpenAI**：gpt-4o, gpt-4.1, gpt-5.x, o1/o3/o4 系列
- **Anthropic Claude**：claude-3.x, claude-opus-4.x, claude-sonnet-4.x, claude-haiku-4.5
- **Google Gemini**：gemini-1.5, 2.0, 2.5, 3.x 系列
- **DeepSeek**：deepseek-chat, deepseek-reasoner, deepseek-v3/v4 系列
- **Alibaba Qwen**：qwen3-max, qwen3-coder, qwen3.7/.8 系列
- **Zhipu GLM**：glm-4.x, glm-5.x 系列
- **MiniMax**：minimax-m2/m3 系列
- **StepFun**：step-3.5/3.7-flash, step-2x-large
- **xAI Grok**：grok-3/4 系列
- **Moonshot Kimi**：kimi-k2/k3 系列
- **Mistral**：mistral-large/medium/small 系列
- **ByteDance Doubao**：doubao-seed 系列
- **Tencent Hunyuan**：hunyuan-hy3
- 以及各种编码代理聚合模型

**设计原则**：同一个模型名字即认为是同一个模型，不管 URL 是什么。

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
3. 在 **多模态自动路由** 子选项卡中启用自动路由
4. 配置回退模型和供应商
5. 在 **模型能力字典** 子选项卡中可查看所有支持的模型
6. 在 **组合模型绑定** 子选项卡中管理 Eyes + Brain 绑定

## 测试说明

使用 Step Plan Key 测试（在新供应商的高级选项中添加时，会自动识别模型能力）：

```
2L5DXp5JijQW9a4tiL5d4SjqCT6iGrYTA5DoSRRx5VzwHKjmn0YxmM8eul8ehWJ1x
```

- **Step 3.7 Flash**：已标记为多模态模型（text / image / video），支持推理，思考强度档位 low/medium/high，上下文限制 256k
- **其余模型**：均按字典配置处理，Step 3.5 Flash 标记为文本模型（推理模型，上下文 256k）

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
