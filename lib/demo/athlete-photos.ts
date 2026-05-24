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
  /** School-age boy in classroom — 15-yr point guard */
  tyler: pexelsPhoto(5211473),
  /** Teen girl in youth soccer kit — multi-sport athlete */
  sofia: pexelsPhoto(16399923),
  /** Teenage boy portrait — senior WR prospect */
  deshawn: pexelsPhoto(5325898),
  /** Beach volleyball — matches Emma's drill clips */
  emma: pexelsPhoto(3621104),
} as const;
