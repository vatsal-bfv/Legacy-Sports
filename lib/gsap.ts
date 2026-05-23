"use client";

import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { CustomEase } from "gsap/CustomEase";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(
  useGSAP,
  ScrollTrigger,
  SplitText,
  Draggable,
  InertiaPlugin,
  DrawSVGPlugin,
  CustomEase,
  TextPlugin
);

CustomEase.create("legacyEase", "0.16, 1, 0.3, 1");
CustomEase.create("snapEase", "0.4, 0, 0.2, 1");

gsap.config({ nullTargetWarn: false });

export {
  gsap,
  useGSAP,
  ScrollTrigger,
  SplitText,
  Draggable,
  InertiaPlugin,
  DrawSVGPlugin,
  TextPlugin,
};
