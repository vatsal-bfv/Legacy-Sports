export type MessageTemplate = {
  id: string;
  label: string;
  body: string;
  channel: "sms" | "email" | "in_app";
};

export const MESSAGE_TEMPLATES: MessageTemplate[] = [
  {
    id: "welcome",
    label: "Welcome & assessment",
    channel: "sms",
    body: "Hi! Thanks for reaching out to Legacy Sports Complex. We'd love to schedule a free assessment — what day works best this week?",
  },
  {
    id: "follow-up",
    label: "Follow-up check-in",
    channel: "sms",
    body: "Just checking in — wanted to see if you had any questions about our programs. Happy to help find the right fit!",
  },
  {
    id: "missed-session",
    label: "Missed session",
    channel: "sms",
    body: "Hi — we noticed a missed session this week. Everything okay? We'd love to get back on track together.",
  },
  {
    id: "progress-update",
    label: "Progress update",
    channel: "email",
    body: "I wanted to share a quick progress update on training. Measurable improvements are trending in the right direction — let's connect to review next steps.",
  },
  {
    id: "camp-invite",
    label: "Camp invitation",
    channel: "email",
    body: "We're hosting a combine prep camp next month and think this would be a great fit. Reply if you'd like details and early-bird pricing.",
  },
];

export function getTemplate(id: string) {
  return MESSAGE_TEMPLATES.find((t) => t.id === id);
}
