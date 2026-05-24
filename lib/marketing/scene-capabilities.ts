export function getPreferStaticScene() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getWebglUnavailable() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const canvas = document.createElement("canvas");
    const gl =
      canvas.getContext("webgl") ?? canvas.getContext("experimental-webgl");
    return !gl;
  } catch {
    return true;
  }
}
