/** Curated portrait headshots for hero demo athletes (ages 13–17). */

export function pexelsPhoto(
  id: number,
  options?: { w?: number; h?: number; crop?: "faces" | "center" }
) {
  const w = options?.w ?? 800;
  const h = options?.h ?? 800;
  const crop = options?.crop ?? "faces";
  return `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}&h=${h}&fit=crop&crop=${crop}`;
}

export function unsplashPhoto(
  id: string,
  options?: { w?: number; h?: number; crop?: "faces" | "center" }
) {
  const w = options?.w ?? 800;
  const h = options?.h ?? 800;
  const crop = options?.crop ?? "faces";
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&h=${h}&crop=${crop}`;
}

/** Hero scout / Command OS athletes — face-forward profile headshots. */
export const HERO_ATHLETE_PHOTOS = {
  /** Young man in sports jersey — QB recruit headshot */
  marcus: pexelsPhoto(17583378),
  /** Teen boy on basketball court — face-forward portrait */
  tyler: unsplashPhoto("photo-1645109498343-92eecf4ce600"),
  /** Teen girl in football/soccer kit — face headshot */
  sofia: pexelsPhoto(15033216),
  /** Young Black man in varsity jacket — WR recruit headshot */
  deshawn: pexelsPhoto(13438105),
  /** Beach volleyball — matches Emma's drill clips */
  emma: pexelsPhoto(3621104),
} as const;
