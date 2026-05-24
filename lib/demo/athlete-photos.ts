/** Curated Pexels portraits for hero demo athletes (ages 13–17). */

export function pexelsPhoto(
  id: number,
  options?: { w?: number; h?: number; crop?: "faces" | "center" }
) {
  const w = options?.w ?? 800;
  const h = options?.h ?? 800;
  const crop = options?.crop ?? "faces";
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop&crop=${crop}`;
}

/** Hero scout / Command OS athletes — sport-matched teen imagery. */
export const HERO_ATHLETE_PHOTOS = {
  /** Young man in sports jersey — QB recruit profile photo */
  marcus: pexelsPhoto(17583378),
  /** HS basketball player in jersey — indoor court practice */
  tyler: pexelsPhoto(3755449),
  /** Youth soccer player on match day — HS football (soccer) */
  sofia: pexelsPhoto(8941650, { crop: "center" }),
  /** Young Black man in varsity jacket — senior WR prospect */
  deshawn: pexelsPhoto(13438105),
  /** Beach volleyball — matches Emma's drill clips */
  emma: pexelsPhoto(3621104),
} as const;
