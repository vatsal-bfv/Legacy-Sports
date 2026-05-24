import type { StepResult, ToolSet } from "ai";

const MAX_JSON_CHARS = 2_000;
const MAX_ARRAY_PREVIEW = 3;

function truncateValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    if (value.length <= MAX_ARRAY_PREVIEW) return value;
    return {
      _truncated: true,
      length: value.length,
      preview: value.slice(0, MAX_ARRAY_PREVIEW),
    };
  }

  if (value != null && typeof value === "object") {
    try {
      const json = JSON.stringify(value);
      if (json.length > MAX_JSON_CHARS) {
        return {
          _truncated: true,
          length: json.length,
          preview: `${json.slice(0, MAX_JSON_CHARS)}…`,
        };
      }
    } catch {
      return "[unserializable object]";
    }
  }

  return value;
}

/** Log Gemini tool calls and the results fed back into the model. */
export function logGeminiStep<TOOLS extends ToolSet>(step: StepResult<TOOLS>) {
  for (const call of step.toolCalls) {
    console.log("[ai/gemini] tool call", {
      step: step.stepNumber,
      tool: call.toolName,
      input: call.input,
    });
  }

  for (const result of step.toolResults) {
    console.log("[ai/gemini] tool result → model", {
      step: step.stepNumber,
      tool: result.toolName,
      output: truncateValue(result.output),
    });
  }
}
