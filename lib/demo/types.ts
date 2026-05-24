export type Location = {
  id: string;
  name: string;
  slug: string;
  address: string;
  lat: number;
  lng: number;
  square_footage: number;
  amenities: string[];
  photo_urls: string[];
  phone: string;
  hours: Record<string, string>;
};

export type Program = {
  id: string;
  slug: string;
  name: string;
  description: string;
  monthly_price: number;
  target_age_min: number;
  target_age_max: number;
};

export type Coach = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  photo_url: string;
  bio: string;
  specialties: string[];
  primary_location_id: string;
  voice_sample: string;
};

export type Athlete = {
  id: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  sport: string;
  position: string | null;
  gender: string;
  graduation_year: number;
  school: string;
  gpa: number;
  home_location_id: string;
  photo_url: string;
  parent_name: string;
  parent_email: string;
  parent_phone: string;
  program_id: string;
  enrollment_date: string;
  status: "active" | "paused" | "at_risk" | "churned";
  ai_summary: string;
  scout_visible: boolean;
  recruit_status: string;
  /** Internal talent tier (1–5). Five-star athletes are priority / elite prospects. */
  star_rating: number;
  created_at: string;
  updated_at: string;
  risk_score?: number;
};

export type Measurable = {
  id: string;
  athlete_id: string;
  recorded_at: string;
  metric: string;
  value: number;
  unit: string;
  is_pr: boolean;
  recorded_by_coach_id: string;
};

export type Lead = {
  id: string;
  created_at: string;
  source: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  athlete_name: string;
  athlete_age: number;
  interested_program_id: string;
  interested_location_id: string;
  notes: string;
  status: "new" | "contacted" | "scheduled" | "converted" | "lost";
  assigned_coach_id: string | null;
};

export type Message = {
  id: string;
  created_at: string;
  channel: string;
  direction: string;
  from_party: string;
  to_party: string;
  athlete_id: string | null;
  lead_id: string | null;
  subject: string | null;
  body: string;
  read_at: string | null;
  ai_generated: boolean;
};

export type Session = {
  id: string;
  location_id: string;
  coach_id: string;
  program_id: string;
  /** ISO weekday: 1 = Monday … 7 = Sunday */
  day_of_week: number;
  hour: number;
  duration_minutes: number;
  starts_at: string;
  ends_at: string;
  room: string;
  capacity: number;
};

export type ScoutUser = {
  id: string;
  email: string;
  name: string;
  organization: string;
  role: string;
  interested_positions: string[];
  geographic_focus: string;
  auth_user_id: string | null;
};

export type Payment = {
  id: string;
  athlete_id: string;
  amount: number;
  status: string;
  processed_at: string;
  description: string;
};

export type WearableData = {
  id: string;
  athlete_id: string;
  recorded_at: string;
  source: string;
  metric: string;
  value: number;
};

export type VideoClip = {
  id: string;
  athlete_id: string;
  title: string;
  thumbnail_url: string;
  video_url: string;
  ai_tags: string[];
  recorded_at: string;
};

export type CoachNote = {
  id: string;
  athlete_id: string;
  coach_id: string;
  created_at: string;
  content: string;
  tags: string[];
};

export type Attendance = {
  id: string;
  athlete_id: string;
  session_id: string;
  checked_in_at: string;
  status: string;
};
