"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

type CursorMode = "default" | "link" | "drag" | "image";

function getCursorMode(target: EventTarget | null): CursorMode {
  if (!(target instanceof Element)) {
    return "default";
  }

  const tagged = target.closest<HTMLElement>("[data-cursor]");

  switch (tagged?.dataset.cursor) {
    case "link":
      return "link";
    case "drag":
      return "drag";
    case "image":
      return "image";
    default:
      break;
  }

  if (target.closest("a,button")) {
    return "link";
  }

  if (target.closest("img")) {
    return "image";
  }

  return "default";
}

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [mode, setMode] = useState<CursorMode>("default");
  const [supportsHover, setSupportsHover] = useState(false);

  const hidden = useMemo(() => !supportsHover, [supportsHover]);

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setSupportsHover(media.matches);

    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (hidden) {
      return;
    }

    const html = document.documentElement;
    html.classList.add("legacy-cursor");
    return () => html.classList.remove("legacy-cursor");
  }, [hidden]);

  useEffect(() => {
    if (hidden || !dotRef.current || !ringRef.current) {
      return;
    }

    const dotX = gsap.quickTo(dotRef.current, "x", {
      duration: 0.1,
      ease: "power3.out",
    });
    const dotY = gsap.quickTo(dotRef.current, "y", {
      duration: 0.1,
      ease: "power3.out",
    });
    const ringX = gsap.quickTo(ringRef.current, "x", {
      duration: 0.55,
      ease: "power3.out",
    });
    const ringY = gsap.quickTo(ringRef.current, "y", {
      duration: 0.55,
      ease: "power3.out",
    });

    const move = (event: PointerEvent) => {
      setVisible(true);
      dotX(event.clientX);
      dotY(event.clientY);
      ringX(event.clientX);
      ringY(event.clientY);
    };

    const onOver = (event: Event) => setMode(getCursorMode(event.target));
    const onOut = (event: Event) => {
      const related = (event as MouseEvent).relatedTarget;
      setMode(getCursorMode(related));
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener("pointermove", move);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", onOut);
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mouseenter", onEnter);

    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mouseenter", onEnter);
    };
  }, [hidden]);

  useEffect(() => {
    if (hidden || !dotRef.current || !ringRef.current) {
      return;
    }

    const ring = ringRef.current;
    const dot = dotRef.current;

    const state =
      mode === "drag"
        ? {
            width: 72,
            height: 72,
            opacity: visible ? 1 : 0,
            borderColor: "rgba(255, 90, 31, 1)",
            backgroundColor: "rgba(255, 90, 31, 0.08)",
            borderStyle: "solid",
          }
        : mode === "link"
          ? {
              width: 48,
              height: 48,
              opacity: visible ? 1 : 0,
              borderColor: "rgba(255, 90, 31, 1)",
              backgroundColor: "rgba(255, 90, 31, 0.08)",
              borderStyle: "solid",
            }
          : {
              width: 32,
              height: 32,
              opacity: visible ? 1 : 0,
              borderColor: "rgba(255, 90, 31, 0.5)",
              backgroundColor: "rgba(255, 90, 31, 0)",
              borderStyle: mode === "image" ? "dashed" : "solid",
            };

    gsap.to(ring, {
      ...state,
      duration: 0.25,
      ease: "legacyEase",
    });

    gsap.to(dot, {
      opacity: visible && mode === "link" ? 0 : visible ? 1 : 0,
      scale: visible && mode === "link" ? 0 : 1,
      duration: 0.25,
      ease: "legacyEase",
    });
  }, [hidden, mode, visible]);

  if (hidden) {
    return null;
  }

  return (
    <>
      <div
        ref={dotRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange"
      />
      <div
        ref={ringRef}
        className="pointer-events-none fixed left-0 top-0 z-[9999] flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[1.5px] border-orange/50"
      >
        <span
          className={`text-[9px] font-bold uppercase tracking-[0.18em] text-orange transition-opacity duration-200 ${
            mode === "drag" ? "opacity-100" : "opacity-0"
          }`}
        >
          Drag
        </span>
      </div>
    </>
  );
}
