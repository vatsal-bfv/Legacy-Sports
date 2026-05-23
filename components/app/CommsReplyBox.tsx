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
  onSent,
}: {
  athleteId?: string | null;
  leadId?: string | null;
  onSent?: (message?: Message) => void;
}) {
  const [body, setBody] = useState("");
  const [channel, setChannel] = useState<"sms" | "email" | "in_app">("sms");
  const [loading, setLoading] = useState(false);
  const [suggesting, setSuggesting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSuggest() {
    setSuggesting(true);
    const res = await fetch("/api/messages/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        athlete_id: athleteId,
        lead_id: leadId,
        thread_type: leadId ? "lead" : "athlete",
      }),
    });
    const data = await res.json();
    if (data.suggestion) setBody(data.suggestion);
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
        ai_generated: false,
      }),
    });
    if (res.ok) {
      const data = await res.json();
      setBody("");
      setSent(true);
      setTimeout(() => setSent(false), 2000);
      onSent?.(data.message);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-3 border-t border-[#2A2D34] pt-4">
      <div className="flex flex-wrap gap-2">
        <select
          value={channel}
          onChange={(e) =>
            setChannel(e.target.value as "sms" | "email" | "in_app")
          }
          className="h-9 rounded-md border border-[#2A2D34] bg-[#0A0B0D] px-3 text-sm text-[#F5F6F7]"
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
            }
            e.target.value = "";
          }}
          className="h-9 flex-1 min-w-[160px] rounded-md border border-[#2A2D34] bg-[#0A0B0D] px-3 text-sm text-[#F5F6F7]"
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
        onChange={(e) => setBody(e.target.value)}
        placeholder="Write a reply…"
        rows={3}
        className="border-[#2A2D34] bg-[#0A0B0D] text-[#F5F6F7]"
      />
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#9DA3AE]">
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
