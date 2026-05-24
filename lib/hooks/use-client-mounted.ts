"use client";

import { useSyncExternalStore } from "react";

function subscribe() {
  return () => undefined;
}

export function useClientMounted() {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
