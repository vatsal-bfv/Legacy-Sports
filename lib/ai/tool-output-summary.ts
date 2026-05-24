function athleteNamesFromRows(rows: unknown[]): string[] {
  return rows
    .map((row) => {
      if (!row || typeof row !== "object") return null;
      const r = row as Record<string, unknown>;
      if (typeof r.name === "string") return r.name;
      if (typeof r.first_name === "string" && typeof r.last_name === "string") {
        return `${r.first_name} ${r.last_name}`;
      }
      if (typeof r.first_name === "string") return r.first_name;
      return null;
    })
    .filter((n): n is string => Boolean(n));
}

function formatNameList(names: string[], max = 3): string {
  if (names.length === 0) return "";
  const shown = names.slice(0, max);
  const rest = names.length - shown.length;
  const list = shown.join(", ");
  return rest > 0 ? `${list} +${rest} more` : list;
}

function countLabel(n: number, singular: string, plural?: string): string {
  if (n === 0) return `0 ${plural ?? `${singular}s`}`;
  if (n === 1) return `1 ${singular}`;
  return `${n} ${plural ?? `${singular}s`}`;
}

function nameFromProgressionText(text: string): string | null {
  const bold = text.match(/^\*\*([^*]+)\*\*/);
  if (bold) return bold[1].trim();
  const plain = text.match(/^([^:]+):/);
  return plain ? plain[1].trim() : null;
}

/** Human-readable one-line summary of a completed tool result. */
export function formatToolOutputSummary(
  toolName: string,
  input: unknown,
  output: unknown
): string | null {
  if (output == null) return null;

  if (typeof output === "string") {
    if (toolName === "summarize_athlete_progression") {
      const name = nameFromProgressionText(output);
      return name ? `Summary for ${name}` : "Progression summary ready";
    }
    if (output.trim() === "") return "Empty result";
    return output.length > 72 ? `${output.slice(0, 72)}…` : output;
  }

  if (Array.isArray(output)) {
    const names = athleteNamesFromRows(output);

    if (
      toolName === "find_athlete_by_name" ||
      toolName === "query_athletes" ||
      toolName === "get_at_risk_athletes"
    ) {
      if (output.length === 0) return "No matches";
      if (names.length > 0) {
        return `${countLabel(output.length, "match", "matches")}: ${formatNameList(names)}`;
      }
      return countLabel(output.length, "result", "results");
    }

    if (toolName === "search_coach_notes") {
      return output.length === 0
        ? "No notes found"
        : countLabel(output.length, "note", "notes");
    }

    if (toolName === "get_athlete_measurables") {
      return countLabel(output.length, "measurable", "measurables");
    }

    if (toolName === "get_athlete_attendance") {
      return countLabel(output.length, "attendance record", "attendance records");
    }

    if (toolName === "get_sessions") {
      return countLabel(output.length, "session", "sessions");
    }

    if (toolName === "get_leads") {
      return countLabel(output.length, "lead", "leads");
    }

    if (toolName === "get_messages") {
      return countLabel(output.length, "message", "messages");
    }

    if (toolName === "list_locations") {
      return countLabel(output.length, "facility", "facilities");
    }

    if (toolName === "list_programs") {
      return countLabel(output.length, "program", "programs");
    }

    if (toolName === "get_coach_performance") {
      return countLabel(output.length, "coach", "coaches");
    }

    if (toolName === "list_scout_users") {
      return countLabel(output.length, "scout", "scouts");
    }

    if (toolName === "get_failed_payments") {
      return output.length === 0
        ? "No failed payments"
        : countLabel(output.length, "failed payment", "failed payments");
    }

    if (toolName === "compare_locations") {
      const args =
        input && typeof input === "object"
          ? (input as Record<string, unknown>)
          : {};
      const metric =
        typeof args.metric === "string" ? args.metric : "Comparison";
      return `${metric} · ${countLabel(output.length, "data point", "data points")}`;
    }

    return countLabel(output.length, "row", "rows");
  }

  if (typeof output === "object") {
    if (toolName === "get_athlete_profile") {
      const o = output as Record<string, unknown>;
      if (typeof o.name === "string") return `Loaded ${o.name}`;
    }
  }

  return null;
}

export function isEmptyToolResult(
  toolName: string,
  output: unknown
): boolean {
  if (output == null) return false;
  if (Array.isArray(output)) return output.length === 0;
  if (typeof output === "string") return output.trim() === "";
  return false;
}
