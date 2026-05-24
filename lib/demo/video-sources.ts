/** Free stock video URLs (Mixkit + Pexels) matched to each drill type. */

export function mixkitVideo(id: number) {
  return {
    video_url: `https://assets.mixkit.co/videos/${id}/${id}-720.mp4`,
    thumbnail_url: `https://assets.mixkit.co/videos/${id}/${id}-thumb-720-0.jpg`,
  };
}

export function pexelsVideo(
  id: number,
  options?: { quality?: string; photoId?: number }
) {
  const quality = options?.quality ?? "hd_1920_1080_30fps";
  const photoId = options?.photoId ?? id;
  return {
    video_url: `https://videos.pexels.com/video-files/${id}/${id}-${quality}.mp4`,
    thumbnail_url: `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=800`,
  };
}

/** Curated clips — https://mixkit.co/free-stock-video/ and https://www.pexels.com/videos/ */
export const VIDEO_ASSETS = {
  qbThrow: mixkitVideo(42552),
  footballJump: mixkitVideo(42547),
  footballAgility: mixkitVideo(2262),
  trackSprint: mixkitVideo(32809),
  wrRoute: mixkitVideo(42549),
  footballRun: mixkitVideo(42560),
  wrCatch: mixkitVideo(42556),
  basketballOneOnOne: mixkitVideo(44468),
  basketballJump: mixkitVideo(2283),
  trackSprintWoman: mixkitVideo(32792),
  soccerFootwork: mixkitVideo(42530),
  footballFeetJump: mixkitVideo(42546),
  volleyballBeach: pexelsVideo(12169477, { photoId: 3621104 }),
  volleyballMatch: pexelsVideo(6179725, {
    quality: "hd_1920_1080_25fps",
    photoId: 3621105,
  }),
} as const;
