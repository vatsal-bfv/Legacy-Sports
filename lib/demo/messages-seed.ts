import { HERO_IDS } from "@/lib/constants";
import type { Message } from "./types";

/** ISO timestamp N days ago at a specific local time. */
function dAt(daysAgo: number, hour: number, minute: number): string {
  const t = new Date();
  const wholeDays = Math.floor(daysAgo);
  const extraMs = (daysAgo - wholeDays) * 86400000;
  t.setTime(t.getTime() - wholeDays * 86400000 - extraMs);
  t.setHours(hour, minute, 0, 0);
  return t.toISOString();
}

/** Days ago with varied time-of-day (slot breaks ties for messages on the same day). */
function d(daysAgo: number, slot = 0): string {
  const hour = 8 + ((Math.floor(daysAgo) * 5 + slot * 3) % 13);
  const minute = (Math.floor(daysAgo) * 11 + slot * 7) % 60;
  return dAt(daysAgo, hour, minute);
}

function backgroundAthleteId(index: number): string {
  return `a0000002-${String((index % 145) + 1).padStart(4, "0")}-4000-8000-000000000000`;
}

export const messages: Message[] = [
  // Emma Patel — deep parent thread (hero demo)
  {
    id: "msg-emma-001",
    created_at: d(14),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Hi Priya! Welcome to Legacy Chandler. Emma's assessment is booked for Thursday at 4pm.",
    read_at: d(14),
    ai_generated: false,
  },
  {
    id: "msg-emma-002",
    created_at: d(12, 0),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Thanks! Emma is so excited. Any gear she should bring?",
    read_at: d(12, 0),
    ai_generated: false,
  },
  {
    id: "msg-emma-003",
    created_at: d(12, 1),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Athletic shoes and water bottle — we provide everything else. See you Thursday!",
    read_at: d(12, 1),
    ai_generated: false,
  },
  {
    id: "msg-emma-004",
    created_at: d(7),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Emma loved her first session! Can we lock in Tue/Thu going forward?",
    read_at: d(7),
    ai_generated: false,
  },
  {
    id: "msg-emma-005",
    created_at: d(2),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Hi Priya! Emma had a great session today — her approach jump is looking much more explosive. See you Thursday!",
    read_at: d(2),
    ai_generated: false,
  },
  {
    id: "msg-emma-006",
    created_at: d(1),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: null,
    body: "Thank you! She's been really motivated. Can we add an extra session next week?",
    read_at: null,
    ai_generated: false,
  },
  {
    id: "msg-emma-007",
    created_at: d(3),
    channel: "email",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.emma,
    lead_id: null,
    subject: "Emma — Monthly progress summary",
    body: "Priya, attached is Emma's progress summary. Vertical up 2 inches this month and attendance at 95%.",
    read_at: d(3),
    ai_generated: false,
  },
  // Marcus Johnson
  {
    id: "msg-marcus-001",
    created_at: d(30),
    channel: "email",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.marcus,
    lead_id: null,
    subject: "Marcus — Combine Results Update",
    body: "Robert, Marcus's latest 40 time of 4.62 is generating significant recruiter interest. Let's schedule a call to discuss camp strategy.",
    read_at: null,
    ai_generated: false,
  },
  {
    id: "msg-marcus-002",
    created_at: d(10),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.marcus,
    lead_id: null,
    subject: null,
    body: "Let's do Thursday at 6pm. Marcus can make it after practice.",
    read_at: d(10),
    ai_generated: false,
  },
  {
    id: "msg-marcus-003",
    created_at: d(9),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.marcus,
    lead_id: null,
    subject: null,
    body: "Perfect — I'll have his updated measurables packet ready for the call.",
    read_at: d(9),
    ai_generated: false,
  },
  // Tyler Chen — at-risk thread
  {
    id: "msg-tyler-001",
    created_at: d(5),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.tyler,
    lead_id: null,
    subject: null,
    body: "Hi Jennifer — Tyler hit a squat PR at 245 lbs last week. Great work!",
    read_at: d(5),
    ai_generated: false,
  },
  {
    id: "msg-tyler-002",
    created_at: d(4),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.tyler,
    lead_id: null,
    subject: null,
    body: "He was thrilled! Busy week with school — might miss Tuesday.",
    read_at: d(4),
    ai_generated: false,
  },
  {
    id: "msg-tyler-003",
    created_at: d(2, 1),
    channel: "in_app",
    direction: "outbound",
    from_party: "system",
    to_party: "coach",
    athlete_id: HERO_IDS.tyler,
    lead_id: null,
    subject: "At-risk alert",
    body: "Tyler Chen missed 2 consecutive sessions. Risk score: 87%. Recommend re-engagement outreach.",
    read_at: null,
    ai_generated: false,
  },
  // Sofia Martinez
  {
    id: "msg-sofia-001",
    created_at: d(8),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.sofia,
    lead_id: null,
    subject: null,
    body: "Maria — Sofia's 100m times are trending down. Clear soccer specialization signal in her data.",
    read_at: d(8),
    ai_generated: false,
  },
  {
    id: "msg-sofia-002",
    created_at: d(7, 1),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.sofia,
    lead_id: null,
    subject: null,
    body: "Good to know! She's leaning soccer for club season. Thanks for the insight.",
    read_at: d(7, 1),
    ai_generated: false,
  },
  // DeShawn Williams
  {
    id: "msg-deshawn-001",
    created_at: d(15),
    channel: "email",
    direction: "outbound",
    from_party: "coach",
    to_party: "parent",
    athlete_id: HERO_IDS.deshawn,
    lead_id: null,
    subject: "DeShawn — Recruiting update",
    body: "Darnell, two D1 programs requested film this week. DeShawn's transformation story is resonating with recruiters.",
    read_at: d(14),
    ai_generated: false,
  },
  {
    id: "msg-deshawn-002",
    created_at: d(6),
    channel: "sms",
    direction: "inbound",
    from_party: "parent",
    to_party: "coach",
    athlete_id: HERO_IDS.deshawn,
    lead_id: null,
    subject: null,
    body: "Incredible news. What camps do you recommend for June?",
    read_at: null,
    ai_generated: false,
  },
  // Lead threads
  {
    id: "msg-lead-001-a",
    created_at: d(0.04),
    channel: "in_app",
    direction: "inbound",
    from_party: "lead",
    to_party: "coach",
    athlete_id: null,
    lead_id: "lead-001",
    subject: null,
    body: "Hi — I'm interested in combine prep for my son Lucas (15). We visited the Suwanee location page.",
    read_at: d(0.03),
    ai_generated: false,
  },
  {
    id: "msg-lead-001-b",
    created_at: d(0.03, 1),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "lead",
    athlete_id: null,
    lead_id: "lead-001",
    subject: null,
    body: "Thanks Michael! I'd love to schedule a free assessment for Lucas. Does Thursday at 5pm work?",
    read_at: d(0.03, 1),
    ai_generated: false,
  },
  {
    id: "msg-lead-002-a",
    created_at: d(1),
    channel: "email",
    direction: "inbound",
    from_party: "lead",
    to_party: "coach",
    athlete_id: null,
    lead_id: "lead-002",
    subject: "Youth Performance — Sophie Foster",
    body: "Hello, referral from the Hamilton volleyball coach. Sophie is 13 and interested in Youth Performance at Gilbert.",
    read_at: d(1),
    ai_generated: false,
  },
  {
    id: "msg-lead-002-b",
    created_at: d(0.9),
    channel: "sms",
    direction: "outbound",
    from_party: "coach",
    to_party: "lead",
    athlete_id: null,
    lead_id: "lead-002",
    subject: null,
    body: "Amanda — assessment scheduled for Monday 4pm at Gilbert. Looking forward to meeting Sophie!",
    read_at: null,
    ai_generated: false,
  },
  ...generateBackgroundMessages(),
];

function generateBackgroundMessages(): Message[] {
  type Scenario = Pick<
    Message,
    | "channel"
    | "direction"
    | "from_party"
    | "to_party"
    | "subject"
    | "body"
  >;

  const scenarios: Scenario[] = [
    {
      channel: "sms",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: null,
      body: "Reminder: training session tomorrow at 4pm. Reply if you need to reschedule.",
    },
    {
      channel: "email",
      direction: "outbound",
      from_party: "system",
      to_party: "parent",
      subject: "Payment receipt — Legacy Sports",
      body: "Your monthly membership payment of $349 was received. Thank you!",
    },
    {
      channel: "sms",
      direction: "inbound",
      from_party: "parent",
      to_party: "coach",
      subject: null,
      body: "Can we move this week's session to Friday? We have a school conflict.",
    },
    {
      channel: "sms",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: null,
      body: "Great work in today's session — measurable improvements on agility drills.",
    },
    {
      channel: "email",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: "Welcome to Legacy Sports Complex",
      body: "We're excited to have your athlete in the program. Your first session is confirmed.",
    },
    {
      channel: "sms",
      direction: "inbound",
      from_party: "parent",
      to_party: "coach",
      subject: null,
      body: "Running 10 minutes late — traffic on the 101.",
    },
    {
      channel: "in_app",
      direction: "outbound",
      from_party: "system",
      to_party: "coach",
      subject: "Attendance note",
      body: "Athlete checked in 5 minutes after session start.",
    },
    {
      channel: "email",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: "Monthly progress summary",
      body: "Attached is this month's training summary with attendance and key measurables.",
    },
    {
      channel: "sms",
      direction: "inbound",
      from_party: "parent",
      to_party: "coach",
      subject: null,
      body: "Thanks for the update! Any homework drills before next week?",
    },
    {
      channel: "sms",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: null,
      body: "Heads up — we're off-site next Tuesday for the turf maintenance closure.",
    },
    {
      channel: "email",
      direction: "inbound",
      from_party: "parent",
      to_party: "coach",
      subject: "Billing question",
      body: "Can you confirm the charge date for next month's membership?",
    },
    {
      channel: "in_app",
      direction: "outbound",
      from_party: "coach",
      to_party: "parent",
      subject: null,
      body: "Session notes posted — review today's lift progress in the athlete portal.",
    },
  ];

  const msgs: Message[] = [];
  for (let i = 0; i < 80; i++) {
    const daysAgo = (i * 90) / 80;
    const scenario = scenarios[(i * 7 + 3) % scenarios.length];
    const athleteIndex = (i * 11 + 5) % 145;
    const createdAt = d(daysAgo, i);
    const isUnreadInbound =
      scenario.direction === "inbound" && i % 5 === 0;

    msgs.push({
      id: `msg-bg-${i}`,
      created_at: createdAt,
      channel: scenario.channel,
      direction: scenario.direction,
      from_party: scenario.from_party,
      to_party: scenario.to_party,
      athlete_id: backgroundAthleteId(athleteIndex),
      lead_id: null,
      subject: scenario.subject,
      body: scenario.body,
      read_at: isUnreadInbound ? null : createdAt,
      ai_generated: i % 11 === 0 && scenario.from_party === "coach",
    });
  }
  return msgs;
}