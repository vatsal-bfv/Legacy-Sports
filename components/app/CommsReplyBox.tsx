"use client";

import { useState } from "react";
import { Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MESSAGE_TEMPLATES } from "@/lib/comms/templates";
import type { Message } from "@/lib/demo/types";

export function CommsReplyBox({
  athleteId,
  leadId,
  threadMessages = [],
  onSent,
}: {
  athleteId?: string | null;
  leadId?: string | null;
  threadMessages?: Message[];
  onSent?: (message?: Message) => void;
}) {
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "in_app">("sms");
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [sent, setSent] = useState(false);
  const [aiDrafted, setAiDrafted] = useState(false);

  async function handleSuggest() {
    setSuggesting(true);
    const res = await fetch("/api/messages/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        athlete_id: athleteId,
        lead_id: leadId,
        thread_type: leadId ? "lead" : "athlete",
        thread_messages: threadMessages.map((m) => ({
          direction: m.direction,
          from_party: m.from_party,
          body: m.body,
          created_at: m.created_at,
        })),
      }),
    });
    const data = await res.json();
    if (data.suggestion) {
      setBody(data.suggestion);
      setAiDrafted(true);
    }
    setSuggesting(false);
  }

  async function handleSend() {
    if (!body.trim()) return;
    setLoading(true);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        body: body.trim(),
        channel,
        athlete_id: athleteId,
        lead_id: leadId,
        ai_generated: aiDrafted,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setBody("");
      setAiDrafted(false);
      setSent(true);
      setTimeout(() => setSent(false), 2000);
      onSent?.(data.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-bone pt-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={channel}
          onChange={(e) =>
            setChannel(e.target.value as "sms" | "email" | "in_app")
          }
          className="h-9 rounded-md border border-bone bg-field px-3 text-sm text-pitch"
        >
          <option value="sms">SMS</option>
          <option value="email">Email</option>
          <option value="in_app">In-app</option>
        </select>
        <select
          defaultValue=""
          onChange={(e) => {
            const tpl = MESSAGE_TEMPLATES.find((t) => t.id === e.target.value);
            if (tpl) {
              setBody(tpl.body);
              setChannel(tpl.channel);
              setAiDrafted(false);
            }
            e.target.value = "";
          }}
          className="h-9 min-w-[160px] flex-1 rounded-md border border-bone bg-field px-3 text-sm text-pitch"
        >
          <option value="">Insert template…</option>
          {MESSAGE_TEMPLATES.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleSuggest}
          disabled={suggesting}
        >
          <Sparkles className="size-4" />
          {suggesting ? "Suggesting…" : "AI suggest"}
        </Button>
      </div>
      <Textarea
        value={body}
        onChange={(e) => {
          setBody(e.target.value);
          setAiDrafted(false);
        }}
        placeholder="Write a reply…"
        rows={3}
        className="border-bone bg-field text-pitch"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate">
          {sent ? "Sent ✓" : "Messages are logged for demo — not sent externally"}
        </p>
        <Button
          type="button"
          size="sm"
          onClick={handleSend}
          disabled={loading || !body.trim()}
        >
          <Send className="size-4" />
          {loading ? "Sending…" : "Send"}
        </Button>
      </div>
    </div>
  );
}
