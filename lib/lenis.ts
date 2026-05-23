import type Lenis from "lenis";

type ScrollTarget = string | number | HTMLElement;

let lenisInstance: Lenis | null = null;

export function setLenis(instance: Lenis | null) {
  lenisInstance = instance;
}

export function getLenis() {
  return lenisInstance;
}

export function scrollToTarget(
  target: ScrollTarget,
  options?: { offset?: number; immediate?: boolean }
) {
  if (lenisInstance) {
    lenisInstance.scrollTo(target, {
      offset: options?.offset ?? 0,
      immediate: options?.immediate ?? false,
    });
    return;
  }

  if (typeof window === "undefined") {
    return;
  }

  if (typeof target === "number") {
    window.scrollTo({
      top: target,
      behavior: options?.immediate ? "auto" : "smooth",
    });
    return;
  }

  const element =
    typeof target === "string" ? document.querySelector(target) : target;

  if (element instanceof HTMLElement) {
    element.scrollIntoView({
      behavior: options?.immediate ? "auto" : "smooth",
      block: "start",
    });
  }
}
