use crate::app_config::AppType;
use crate::provider::Provider;
use crate::proxy::error::ProxyError;
use axum::http::HeaderMap;
use serde::{Deserialize, Serialize};
use serde_json::Value;

/// Model capability entry in the dictionary.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct ModelCapabilities {
    /// Normalized model name tail (lowercase)
    pub name: String,
    /// Supported input modalities
    pub modalities: Vec<String>,
    /// Whether the model supports reasoning
    pub reasoning: bool,
    /// Thinking strength levels supported
    pub thinking_strength: Vec<String>,
    /// Context limit in tokens
    pub context_limit: u32,
    /// Output modalities (optional)
    #[serde(skip_serializing_if = "Option::is_none")]
    pub output_modalities: Option<Vec<String>>,
}

/// Comprehensive model capability dictionary keyed by normalized name tail (lowercase).
///
/// Modality conventions: `text`, `image`, `audio`, `video` refer to INPUT
/// modalities unless otherwise noted (output_modalities). Same model name =
/// same model regardless of URL/provider.
static MODEL_CAPABILITIES: std::sync::LazyLock<Vec<ModelCapabilities>> = std::sync::LazyLock::new(|| {
    use ModelCapabilities as M;
    fn cap(name: &str, modalities: &[&str], reasoning: bool, thinking_strength: &[&str], context_limit: u32, output_modalities: Option<&[&str]>) -> M {
        M {
            name: name.to_string(),
            modalities: modalities.iter().map(|s| s.to_string()).collect(),
            reasoning,
            thinking_strength: thinking_strength.iter().map(|s| s.to_string()).collect(),
            context_limit,
            output_modalities: output_modalities.map(|v| v.iter().map(|s| s.to_string()).collect()),
        }
    }
    vec![
        // ---- OpenAI ----
        cap("gpt-4o", &["text", "image"], false, &[], 128000, None),
        cap("gpt-4o-mini", &["text", "image"], false, &[], 128000, None),
        cap("gpt-4-turbo", &["text", "image"], false, &[], 128000, None),
        cap("gpt-4.1", &["text", "image"], false, &[], 1047576, None),
        cap("gpt-4.1-mini", &["text", "image"], false, &[], 1047576, None),
        cap("gpt-4.1-nano", &["text", "image"], false, &[], 1047576, None),
        cap("gpt-5", &["text", "image"], true, &["low", "medium", "high"], 400000, None),
        cap("gpt-5-mini", &["text", "image"], true, &["low", "medium", "high"], 400000, None),
        cap("gpt-5-nano", &["text", "image"], true, &["low", "medium", "high"], 400000, None),
        cap("gpt-5-pro", &["text", "image"], true, &["high"], 400000, None),
        cap("gpt-5.1", &["text", "image"], true, &["low", "medium", "high"], 400000, None),
        cap("gpt-5.2", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 400000, None),
        cap("gpt-5.3", &["text"], true, &["low", "medium", "high"], 400000, None),
        cap("gpt-5.4", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1050000, None),
        cap("gpt-5.5", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1050000, None),
        cap("gpt-5.6", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1050000, None),
        cap("gpt-5.6-sol", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1050000, None),
        cap("o1", &["text", "image"], true, &[], 200000, None),
        cap("o1-mini", &["text"], true, &[], 128000, None),
        cap("o3", &["text", "image"], true, &[], 200000, None),
        cap("o3-mini", &["text"], true, &[], 200000, None),
        cap("o3-pro", &["text", "image"], true, &[], 200000, None),
        cap("o4-mini", &["text", "image"], true, &[], 200000, None),
        // ---- Anthropic Claude ----
        cap("claude-3-opus", &["text", "image"], false, &[], 200000, None),
        cap("claude-3-sonnet", &["text", "image"], false, &[], 200000, None),
        cap("claude-3-haiku", &["text", "image"], false, &[], 200000, None),
        cap("claude-3.5-sonnet", &["text", "image"], true, &[], 200000, None),
        cap("claude-3.5-haiku", &["text", "image"], true, &[], 200000, None),
        cap("claude-opus-4", &["text", "image"], true, &[], 1000000, None),
        cap("claude-opus-4-20250514", &["text", "image"], true, &[], 1000000, None),
        cap("claude-opus-4.5", &["text", "image"], true, &["low", "medium", "high"], 200000, None),
        cap("claude-opus-4.6", &["text", "image"], true, &["low", "medium", "high"], 1000000, None),
        cap("claude-opus-5", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1000000, None),
        cap("claude-sonnet-4", &["text", "image"], true, &[], 1000000, None),
        cap("claude-sonnet-4-20250514", &["text", "image"], true, &[], 1000000, None),
        cap("claude-sonnet-4.5", &["text", "image"], true, &[], 200000, None),
        cap("claude-sonnet-4.6", &["text", "image"], true, &["low", "medium", "high"], 1000000, None),
        cap("claude-sonnet-5", &["text", "image"], true, &["low", "medium", "high", "xhigh"], 1000000, None),
        cap("claude-haiku-4.5", &["text", "image"], true, &[], 200000, None),
        // ---- Google Gemini ----
        cap("gemini-1.5-flash", &["text", "image", "audio", "video"], false, &[], 1000000, None),
        cap("gemini-1.5-pro", &["text", "image", "audio", "video"], false, &[], 2000000, None),
        cap("gemini-2.0-flash", &["text", "image", "audio", "video"], false, &[], 1000000, None),
        cap("gemini-2.5-flash", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-2.5-flash-lite", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-2.5-pro", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-3", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-3-pro", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-3-pro-preview", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-3-flash-preview", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("gemini-3.6-flash", &["text"], true, &[], 1000000, None),
        cap("gemini-3.1-flash-lite", &["text"], true, &[], 1000000, None),
        cap("gemini-3.5-flash", &["text"], true, &[], 1000000, None),
        cap("gemini-pro", &["text"], false, &[], 32768, None),
        // ---- DeepSeek ----
        cap("deepseek-chat", &["text"], false, &[], 128000, None),
        cap("deepseek-reasoner", &["text"], true, &[], 128000, None),
        cap("deepseek-v3", &["text"], false, &[], 128000, None),
        cap("deepseek-v3.1", &["text"], true, &[], 128000, None),
        cap("deepseek-v3.2", &["text"], true, &[], 128000, None),
        cap("deepseek-v4-flash", &["text"], true, &[], 1000000, None),
        cap("deepseek-v4-pro", &["text"], true, &[], 1000000, None),
        cap("deepseek-v4-lite", &["text"], true, &[], 1000000, None),
        cap("deepseek-v4-ultra", &["text"], true, &[], 1000000, None),
        cap("us.deepseek.r1-v1", &["text"], true, &[], 128000, None),
        // ---- Alibaba Qwen ----
        cap("qwen-max", &["text"], false, &[], 128000, None),
        cap("qwen3-max", &["text"], true, &[], 256000, None),
        cap("qwen3-coder", &["text"], true, &[], 256000, None),
        cap("qwen3-coder-480b", &["text"], true, &[], 256000, None),
        cap("qwen3-coder-480b-a35b-instruct", &["text"], false, &[], 256000, None),
        cap("qwen3-coder-plus", &["text"], true, &[], 1000000, None),
        cap("qwen3-coder-flash", &["text"], true, &[], 1000000, None),
        cap("qwen3-coder-next", &["text"], true, &[], 256000, None),
        cap("qwen3-coder-ultra", &["text"], true, &[], 1000000, None),
        cap("qwen3-coder-vl", &["text", "image"], true, &[], 256000, None),
        cap("qwen3-7-max", &["text"], true, &[], 256000, None),
        cap("qwen3-32b", &["text"], true, &[], 256000, None),
        cap("qwen3-235b-a22b", &["text"], true, &[], 256000, None),
        cap("qwen3.5-plus", &["text"], true, &[], 1000000, None),
        cap("qwen3.6-flash", &["text"], true, &[], 1000000, None),
        cap("qwen3.6-plus", &["text"], true, &[], 1000000, None),
        cap("qwen3.7-max", &["text"], true, &[], 1000000, None),
        cap("qwen3.7-plus", &["text", "image", "video"], true, &[], 1000000, None),
        cap("qwen3.8-max", &["text"], true, &[], 1000000, None),
        cap("qwq-32b", &["text"], true, &[], 128000, None),
        cap("qwq-plus", &["text"], true, &[], 128000, None),
        // ---- Zhipu GLM ----
        cap("glm-4.6", &["text"], true, &[], 200000, None),
        cap("glm-4.7", &["text"], true, &[], 200000, None),
        cap("glm-5", &["text"], true, &[], 200000, None),
        cap("glm-5.1", &["text"], true, &[], 200000, None),
        cap("glm-5.2", &["text"], true, &[], 1000000, None),
        cap("glm-5-turbo", &["text"], true, &[], 200000, None),
        cap("glm-5.2v", &["text"], true, &[], 200000, None),
        cap("glm-5v-turbo", &["text", "image"], true, &[], 200000, None),
        cap("glm-4-air", &["text"], true, &[], 128000, None),
        cap("glm-4-flash", &["text"], false, &[], 128000, None),
        // ---- MiniMax ----
        cap("minimax-m2", &["text"], true, &[], 200000, None),
        cap("minimax-m2.1", &["text"], true, &[], 200000, None),
        cap("minimax-m2.5", &["text"], true, &[], 192000, None),
        cap("minimax-m2.7", &["text"], true, &[], 200000, None),
        cap("minimax-m2.7-highspeed", &["text"], true, &[], 200000, None),
        cap("minimax-m2.7-vision", &["text"], true, &[], 200000, None),
        cap("minimax-m3", &["text", "image"], true, &[], 1000000, None),
        // ---- StepFun (阶跃星辰) ----
        cap("step-1o-turbo-vision", &["text", "image", "video"], false, &[], 32000, None),
        cap("step-2x-large", &["text", "image"], false, &[], 0, Some(&["image"])),
        cap("step-3.5-flash", &["text"], true, &[], 256000, None),
        cap("step-3.5-flash-2603", &["text"], true, &[], 256000, None),
        cap("step-3.5-flash-vision", &["text", "image"], true, &[], 256000, None),
        cap("step-3.7-flash", &["text", "image", "video"], true, &["low", "medium", "high"], 256000, None),
        cap("step-gui", &["text"], true, &[], 256000, None),
        cap("step-overture-preview", &["text"], true, &[], 256000, None),
        // ---- xAI Grok ----
        cap("grok-3", &["text", "image"], true, &[], 131072, None),
        cap("grok-3-mini", &["text"], true, &[], 131072, None),
        cap("grok-4", &["text", "image"], true, &[], 1048576, None),
        cap("grok-4-fast", &["text", "image"], true, &[], 1048576, None),
        cap("grok-4.3", &["text"], true, &[], 1000000, None),
        cap("grok-4.5", &["text"], true, &[], 1000000, None),
        cap("grok-4.20-0309-reasoning", &["text"], true, &[], 1000000, None),
        cap("grok-4.20-0309-non-reasoning", &["text"], false, &[], 1000000, None),
        cap("grok-4-1-fast-reasoning", &["text"], true, &[], 1000000, None),
        cap("grok-4-1-fast-non-reasoning", &["text"], false, &[], 1000000, None),
        cap("grok-code-fast-1", &["text"], true, &[], 256000, None),
        // ---- Moonshot/Kimi ----
        cap("kimi-k2", &["text", "image"], true, &[], 128000, None),
        cap("kimi-k2-0905", &["text", "image"], true, &[], 128000, None),
        cap("kimi-k2.5", &["text", "image"], true, &[], 256000, None),
        cap("kimi-k2.6", &["text", "image", "video"], true, &[], 262144, None),
        cap("kimi-k2.7-code", &["text", "image", "video"], true, &[], 262144, None),
        cap("kimi-k2.7-code-highspeed", &["text", "image", "video"], true, &[], 262144, None),
        cap("kimi-k3", &["text", "image"], true, &["low", "high"], 1048576, None),
        cap("kimi-for-coding", &["text"], true, &[], 128000, None),
        cap("kimi-k2-thinking", &["text", "image"], true, &[], 256000, None),
        cap("kimi-k2-turbo", &["text"], true, &[], 128000, None),
        // ---- Mistral ----
        cap("mistral-large-3-2512", &["text", "image"], true, &[], 131072, None),
        cap("mistral-medium-3.1", &["text"], true, &[], 131072, None),
        cap("mistral-medium-3.5", &["text"], true, &[], 131072, None),
        cap("mistral-small-3.2-24b", &["text", "image"], true, &[], 128000, None),
        cap("mistral-small-4", &["text"], true, &[], 131072, None),
        cap("codestral-2508", &["text"], false, &[], 256000, None),
        cap("devstral-medium", &["text"], false, &[], 128000, None),
        cap("devstral-small-2-2512", &["text"], true, &[], 128000, None),
        cap("magistral-medium", &["text"], true, &[], 128000, None),
        cap("magistral-small", &["text"], true, &[], 128000, None),
        // ---- ByteDance Doubao ----
        cap("doubao-seed-2-0-code", &["text", "image"], true, &[], 256000, None),
        cap("doubao-seed-2-0-lite", &["text", "image"], true, &[], 256000, None),
        cap("doubao-seed-2-0-mini", &["text", "image"], true, &[], 256000, None),
        cap("doubao-seed-2-0-pro", &["text", "image"], true, &[], 256000, None),
        cap("doubao-seed-2-1-pro", &["text"], true, &[], 256000, None),
        cap("doubao-seed-2-1-turbo", &["text"], true, &[], 256000, None),
        cap("doubao-seed-1-6", &["text", "image"], true, &[], 256000, None),
        // ---- Tencent Hunyuan ----
        cap("hunyuan-hy3", &["text"], true, &[], 200000, None),
        cap("hy3", &["text"], true, &[], 200000, None),
        cap("hy3-preview", &["text"], true, &[], 200000, None),
        // ---- Coding-agent aggregators / special names ----
        cap("ark-code-latest", &["text"], true, &[], 256000, None),
        cap("qianfan-code-latest", &["text"], true, &[], 200000, None),
        cap("kat-coder", &["text"], true, &[], 256000, None),
        cap("kat-coder-pro", &["text"], true, &[], 256000, None),
        cap("kat-coder-pro-v1", &["text"], true, &[], 256000, None),
        cap("kat-coder-pro-v2", &["text"], true, &[], 256000, None),
        cap("ling-2.5-1t", &["text"], true, &[], 256000, None),
        cap("ling-2.6-1t", &["text"], true, &[], 1000000, None),
        cap("longcat-2.0", &["text"], true, &[], 1000000, None),
        cap("longcat-flash-chat", &["text"], true, &[], 256000, None),
        cap("mimo-v2.5", &["text", "image", "audio", "video"], true, &[], 1000000, None),
        cap("mimo-v2.5-pro", &["text", "image"], true, &[], 1000000, None),
        cap("mimo-v2-flash", &["text", "image"], true, &[], 1000000, None),
        cap("mimo-v2-pro", &["text", "image"], true, &[], 1000000, None),
    ]
});

/// Returns the full model capability dictionary.
pub fn get_model_capabilities() -> &'static [ModelCapabilities] {
    &MODEL_CAPABILITIES
}

/// Looks up capabilities for a model by normalized name/tail.
///
/// Same name = same model regardless of URL/provider. Matching prefers an exact
/// tail match (after the last `/`), then falls back to a prefix-of-tail match so
/// namespaced variants (`gpt-5.4-pro`, `claude-sonnet-4-20250514`) resolve to
/// the base entry.
pub fn get_model_capability_for_name(model_name: &str) -> Option<&'static ModelCapabilities> {
    let normalized = model_name.to_lowercase();
    let tail = normalized.rsplit('/').next().unwrap_or(&normalized);

    MODEL_CAPABILITIES.iter().find(|cap| {
        let pattern = cap.name.to_lowercase();
        tail == pattern.as_str() || normalized.contains(pattern.as_str())
    })
}

/// Check if a model name matches a known multimodal model.
///
/// Uses case-insensitive substring matching on the model name tail (after the last `/`).
/// A model is considered multimodal when it supports any non-text input modality
/// (image, audio, or video).
pub fn is_model_multimodal(model_name: &str) -> bool {
    get_model_capability_for_name(model_name)
        .map(|cap| cap.modalities.iter().any(|m| m != "text"))
        .unwrap_or(false)
}

/// Check if a provider has any model in its catalog that supports images.
fn provider_has_any_multimodal_model(provider: &Provider) -> bool {
    let settings = &provider.settings_config;

    // Check modelCatalog.models array
    if let Some(models) = settings
        .get("modelCatalog")
        .and_then(|catalog| catalog.get("models"))
        .and_then(|v| v.as_array())
    {
        if models.iter().any(|model| model_supports_image(model)) {
            return true;
        }
    }

    // Check models array directly
    if let Some(models) = settings.get("models").and_then(|v| v.as_array()) {
        if models.iter().any(|model| model_supports_image(model)) {
            return true;
        }
    }

    // Check modelCatalog as object
    if let Some(catalog) = settings.get("modelCatalog").and_then(|v| v.as_object()) {
        if catalog.values().any(|model| model_supports_image(model)) {
            return true;
        }
    }

    false
}

/// Check if a single model entry declares image support.
fn model_supports_image(model: &Value) -> bool {
    model
        .get("supportsImage")
        .or_else(|| model.get("supports_image"))
        .or_else(|| model.get("vision"))
        .and_then(|v| v.as_bool())
        == Some(true)
        || model
            .get("inputModalities")
            .or_else(|| model.get("input_modalities"))
            .or_else(|| model.get("input"))
            .and_then(|v| v.as_array())
            .is_some_and(|arr| {
                arr.iter().any(|item| {
                    item.as_str()
                        .map(|s| s.trim().eq_ignore_ascii_case("image"))
                        .unwrap_or(false)
                })
            })
}

/// Check if a provider has a multimodal model that matches the requested model's family.
fn provider_has_multimodal_model_matching(provider: &Provider, model: &str) -> bool {
    let settings = &provider.settings_config;
    let model_lower = model.to_lowercase();
    let _model_tail = model_lower.rsplit('/').next().unwrap_or(&model_lower);

    // Check modelCatalog.models array
    if let Some(models) = settings
        .get("modelCatalog")
        .and_then(|catalog| catalog.get("models"))
        .and_then(|v| v.as_array())
    {
        for model_entry in models {
            if let Some(model_name) = model_entry
                .get("model")
                .or_else(|| model_entry.get("id"))
                .or_else(|| model_entry.get("name"))
                .and_then(|v| v.as_str())
            {
                if model_family_matches(model_name, model) && model_supports_image(model_entry) {
                    return true;
                }
            }
        }
    }

    // Check models array directly
    if let Some(models) = settings.get("models").and_then(|v| v.as_array()) {
        for model_entry in models {
            if let Some(model_name) = model_entry
                .get("model")
                .or_else(|| model_entry.get("id"))
                .or_else(|| model_entry.get("name"))
                .and_then(|v| v.as_str())
            {
                if model_family_matches(model_name, model) && model_supports_image(model_entry) {
                    return true;
                }
            }
        }
    }

    // Check modelCatalog as object
    if let Some(catalog) = settings.get("modelCatalog").and_then(|v| v.as_object()) {
        for (key, model_entry) in catalog {
            if model_family_matches(key, model) && model_supports_image(model_entry) {
                return true;
            }
        }
    }

    false
}

/// Simple model family matching (lowercase tail comparison).
fn model_family_matches(candidate: &str, model: &str) -> bool {
    let candidate = candidate.to_lowercase();
    let model = model.to_lowercase();
    let candidate_tail = candidate.rsplit('/').next().unwrap_or(&candidate);
    let model_tail = model.rsplit('/').next().unwrap_or(&model);

    candidate_tail == model_tail || candidate == model_tail || candidate_tail == model
}

/// Multimodal router for finding fallback providers and executing eyes inference.
pub struct MultimodalRouter;

impl MultimodalRouter {
    /// Find a provider that can handle multimodal input for the given model.
    ///
    /// First tries to find a provider whose multimodal models match the requested
    /// model's family. Falls back to any provider with multimodal support.
    pub fn find_multimodal_fallback(model: &str, providers: &[Provider]) -> Option<Provider> {
        // First pass: find provider with matching multimodal model family
        for provider in providers {
            if provider_has_multimodal_model_matching(provider, model) {
                return Some(provider.clone());
            }
        }
        // Second pass: any provider with multimodal support
        providers.iter().find(|p| provider_has_any_multimodal_model(p)).cloned()
    }
}

/// Execute eyes inference: send images to the eyes model and get text descriptions.
///
/// Returns the request body with images replaced by text descriptions from the eyes model.
pub async fn execute_eyes_inference(
    body: &Value,
    eyes_provider: &Provider,
    eyes_model: &str,
    app_type: &AppType,
    base_url: &str,
    headers: &HeaderMap,
) -> Result<Value, ProxyError> {
    use crate::proxy::providers::get_adapter;

    let adapter = get_adapter(app_type);

    // Extract base URL from provider if not provided
    let effective_base_url = if base_url.is_empty() {
        adapter.extract_base_url(eyes_provider)?
    } else {
        base_url.to_string()
    };

    // Determine endpoint based on app type
    let endpoint = match app_type {
        AppType::Claude | AppType::ClaudeDesktop => "/v1/messages".to_string(),
        AppType::Codex | AppType::GrokBuild => "/v1/chat/completions".to_string(),
        AppType::Gemini => format!("/v1beta/models/{eyes_model}:generateContent"),
        _ => "/v1/chat/completions".to_string(),
    };

    // Gemini uses a dedicated generateContent endpoint with the model embedded
    // in the path; inject the model id before building the URL.
    let endpoint = if app_type == &AppType::Gemini {
        endpoint.replace("{model}", eyes_model)
    } else {
        endpoint.to_string()
    };

    let url = adapter.build_url(&effective_base_url, &endpoint);

    // Extract auth from provider
    let auth = adapter
        .extract_auth(eyes_provider)
        .ok_or_else(|| ProxyError::AuthError("Eyes provider has no auth configured".to_string()))?;
    let auth_headers = adapter.get_auth_headers(&auth)?;

    // Build request body with eyes model. For Gemini the model lives in the
    // endpoint path; for OpenAI-style bodies we set `model` explicitly.
    let mut eyes_body = body.clone();
    if app_type != &AppType::Gemini {
        eyes_body["model"] = Value::String(eyes_model.to_string());
    }

    // Apply adapter transform if needed
    let transformed_body = if adapter.needs_transform(eyes_provider) {
        adapter.transform_request(eyes_body, eyes_provider)?
    } else {
        eyes_body
    };

    // Build request headers
    let mut request_headers = reqwest::header::HeaderMap::new();
    request_headers.insert(
        reqwest::header::CONTENT_TYPE,
        reqwest::header::HeaderValue::from_static("application/json"),
    );
    for (name, value) in &auth_headers {
        if let Ok(reqwest_name) = reqwest::header::HeaderName::from_bytes(name.as_str().as_bytes()) {
            if let Ok(reqwest_value) =
                reqwest::header::HeaderValue::from_bytes(value.as_bytes())
            {
                request_headers.insert(reqwest_name, reqwest_value);
            }
        }
    }

    // Serialize body
    let body_bytes = serde_json::to_vec(&transformed_body).map_err(|e| {
        ProxyError::Internal(format!("Failed to serialize eyes request body: {e}"))
    })?;

    // Send request
    let client = reqwest::Client::builder()
        .timeout(std::time::Duration::from_secs(120))
        .build()
        .map_err(|e| ProxyError::Internal(format!("Failed to build HTTP client: {e}")))?;

    let response = client
        .post(&url)
        .headers(request_headers)
        .body(body_bytes)
        .send()
        .await
        .map_err(|e| ProxyError::ForwardFailed(format!("Eyes inference request failed: {e}")))?;

    let status = response.status().as_u16();
    let response_body = response
        .text()
        .await
        .map_err(|e| ProxyError::ForwardFailed(format!("Failed to read eyes response: {e}")))?;

    if !(200..300).contains(&status) {
        return Err(ProxyError::UpstreamError {
            status,
            body: Some(response_body),
        });
    }

    let response_json: Value = serde_json::from_str(&response_body).map_err(|e| {
        ProxyError::Internal(format!("Failed to parse eyes response: {e}"))
    })?;

    // Extract text description from response
    let description = extract_text_from_response(&response_json)
        .unwrap_or_else(|| "[Image description unavailable]".to_string());

    // Replace images in the original body with the description
    let mut result = body.clone();
    replace_images_with_text(&mut result, &description);

    Ok(result)
}

/// Extract text content from various API response formats.
fn extract_text_from_response(response: &Value) -> Option<String> {
    // Claude format: {"content": [{"type": "text", "text": "..."}]}
    if let Some(content) = response.get("content").and_then(|c| c.as_array()) {
        for block in content {
            if block.get("type").and_then(|t| t.as_str()) == Some("text") {
                if let Some(text) = block.get("text").and_then(|t| t.as_str()) {
                    return Some(text.to_string());
                }
            }
        }
    }

    // OpenAI format: {"choices": [{"message": {"content": "..."}}]}
    if let Some(choices) = response.get("choices").and_then(|c| c.as_array()) {
        for choice in choices {
            if let Some(message) = choice.get("message") {
                if let Some(content) = message.get("content").and_then(|c| c.as_str()) {
                    return Some(content.to_string());
                }
            }
            // Also check delta for streaming responses
            if let Some(delta) = choice.get("delta") {
                if let Some(content) = delta.get("content").and_then(|c| c.as_str()) {
                    if !content.is_empty() {
                        return Some(content.to_string());
                    }
                }
            }
        }
    }

    // Gemini format: {"candidates": [{"content": {"parts": [{"text": "..."}]}}]}
    if let Some(candidates) = response.get("candidates").and_then(|c| c.as_array()) {
        for candidate in candidates {
            if let Some(content) = candidate.get("content") {
                if let Some(parts) = content.get("parts").and_then(|p| p.as_array()) {
                    for part in parts {
                        if let Some(text) = part.get("text").and_then(|t| t.as_str()) {
                            return Some(text.to_string());
                        }
                    }
                }
            }
        }
    }

    None
}

/// Replace all image blocks in the body with the given text.
fn replace_images_with_text(body: &mut Value, text: &str) {
    if !crate::proxy::media_sanitizer::contains_image_blocks(body) {
        return;
    }

    // Replace in messages
    if let Some(messages) = body.get_mut("messages").and_then(|m| m.as_array_mut()) {
        for message in messages.iter_mut() {
            replace_images_in_value(message, text);
        }
    }

    // Replace in input (OpenAI Responses API)
    if let Some(input) = body.get_mut("input") {
        replace_images_in_value(input, text);
    }

    // Replace in Gemini contents
    if let Some(contents) = body.get_mut("contents").and_then(|c| c.as_array_mut()) {
        for content in contents.iter_mut() {
            if let Some(parts) = content.get_mut("parts").and_then(|p| p.as_array_mut()) {
                for part in parts.iter_mut() {
                    if is_image_part(part) {
                        *part = Value::String(text.to_string());
                    }
                }
            }
        }
    }
}

/// Replace image blocks in a value with text.
fn replace_images_in_value(value: &mut Value, text: &str) {
    if let Some(content) = value.get_mut("content") {
        replace_images_in_content(content, text);
    }

    // Handle nested tool results
    if let Some(obj) = value.as_object_mut() {
        for (_, v) in obj.iter_mut() {
            replace_images_in_value(v, text);
        }
    } else if let Some(arr) = value.as_array_mut() {
        for item in arr.iter_mut() {
            replace_images_in_value(item, text);
        }
    }
}

/// Replace image blocks in content array with text.
fn replace_images_in_content(content: &mut Value, text: &str) {
    let Some(blocks) = content.as_array_mut() else {
        return;
    };

    for block in blocks.iter_mut() {
        let block_type = block
            .get("type")
            .and_then(|t| t.as_str())
            .map(str::to_string);
        if is_image_block_type(block_type.as_deref()) {
            *block = Value::Object({
                let mut obj = serde_json::Map::new();
                    obj.insert("type".to_string(), Value::String("text".to_string()));
                obj.insert("text".to_string(), Value::String(text.to_string()));
                obj
            });
            continue;
        }

        // Recurse into nested content
        if let Some(nested) = block.get_mut("content") {
            replace_images_in_content(nested, text);
        }

        // Handle tool_result content
        if block_type.as_deref() == Some("tool_result") || block_type.as_deref() == Some("tool_use") {
            if let Some(nested) = block.get_mut("input") {
                replace_images_in_value(nested, text);
            }
            for key in ["result", "output", "content"] {
                if let Some(nested) = block.get_mut(key) {
                    replace_images_in_value(nested, text);
                }
            }
        }
    }
}

/// Check if a block type is an image type.
fn is_image_block_type(block_type: Option<&str>) -> bool {
    matches!(
        block_type,
        Some("image")
            | Some("image_url")
            | Some("input_image")
            | Some("vision")
            | Some("inline_data")
            | Some("file_data")
    )
}

/// Check if a Gemini part contains an image.
fn is_image_part(part: &Value) -> bool {
    part.get("inlineData")
        .or_else(|| part.get("inline_data"))
        .and_then(|v| v.get("mimeType").or_else(|| v.get("mime_type")))
        .and_then(|v| v.as_str())
        .is_some_and(|mime| mime.starts_with("image/"))
        || part
            .get("fileData")
            .or_else(|| part.get("file_data"))
            .and_then(|v| v.get("mimeType").or_else(|| v.get("mime_type")))
            .and_then(|v| v.as_str())
            .is_some_and(|mime| mime.starts_with("image/"))
}

#[cfg(test)]
mod tests {
    use super::*;
    use serde_json::json;

    #[test]
    fn test_is_model_multimodal() {
        assert!(is_model_multimodal("gpt-4o"));
        assert!(is_model_multimodal("gpt-4o-mini"));
        assert!(is_model_multimodal("gpt-4-turbo"));
        assert!(is_model_multimodal("claude-opus-4"));
        assert!(is_model_multimodal("claude-sonnet-4"));
        assert!(is_model_multimodal("claude-3.5-sonnet"));
        assert!(is_model_multimodal("claude-3.5-haiku"));
        assert!(is_model_multimodal("gemini-2.5-pro"));
        assert!(is_model_multimodal("gemini-2.5-flash"));
        assert!(is_model_multimodal("gemini-1.5-pro"));
        assert!(is_model_multimodal("gemini-1.5-flash"));
        assert!(is_model_multimodal("step-3.7-flash"));
        assert!(is_model_multimodal("openai/gpt-4o"));
        assert!(is_model_multimodal("GPT-4O"));
        // Claude 3 Opus/Sonnet/Haiku all accept image input (documented by Anthropic)
        assert!(is_model_multimodal("claude-3-opus"));
        assert!(is_model_multimodal("claude-3-sonnet"));
        assert!(is_model_multimodal("claude-3-haiku"));

        assert!(!is_model_multimodal("deepseek-chat"));
        assert!(!is_model_multimodal("gpt-4"));
        assert!(!is_model_multimodal("step-3.5-flash"));
    }

    #[test]
    fn test_is_model_multimodal_respects_audio_video_modalities() {
        // gemini and step-3.7-flash are marked with audio/video modalities
        assert!(is_model_multimodal("gemini-2.5-pro"));
        assert!(is_model_multimodal("gemini-2.5-flash"));
        assert!(is_model_multimodal("step-3.7-flash"));
        assert!(is_model_multimodal("openrouter/google/gemini-2.5-pro"));
    }

    #[test]
    fn test_extract_text_from_response() {
        // Claude format
        let claude_response = json!({
            "content": [
                {"type": "text", "text": "Hello world"}
            ]
        });
        assert_eq!(
            extract_text_from_response(&claude_response),
            Some("Hello world".to_string())
        );

        // OpenAI format
        let openai_response = json!({
            "choices": [
                {"message": {"content": "Hello from GPT"}}
            ]
        });
        assert_eq!(
            extract_text_from_response(&openai_response),
            Some("Hello from GPT".to_string())
        );

        // Gemini format
        let gemini_response = json!({
            "candidates": [
                {"content": {"parts": [{"text": "Hello from Gemini"}]}}
            ]
        });
        assert_eq!(
            extract_text_from_response(&gemini_response),
            Some("Hello from Gemini".to_string())
        );
    }
}
