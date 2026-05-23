type LogMeta = Record<string, unknown>;

function serializeMeta(meta?: LogMeta): string {
  if (!meta || Object.keys(meta).length === 0) return "";
  try {
    return ` ${JSON.stringify(meta)}`;
  } catch {
    return " [meta unserializable]";
  }
}

/** Structured server-side logging for App Router API routes. */
export function apiLog(route: string) {
  const started = Date.now();

  return {
    request(meta?: LogMeta) {
      console.log(`[api] → ${route}${serializeMeta(meta)}`);
    },
    response(status: number, meta?: LogMeta) {
      console.log(
        `[api] ← ${route} ${status} ${Date.now() - started}ms${serializeMeta(meta)}`
      );
    },
    warn(status: number, message: string, meta?: LogMeta) {
      console.warn(
        `[api] ! ${route} ${status} ${message} ${Date.now() - started}ms${serializeMeta(meta)}`
      );
    },
    error(status: number, error: unknown, meta?: LogMeta) {
      console.error(
        `[api] ✗ ${route} ${status} ${Date.now() - started}ms${serializeMeta({
          ...meta,
          error: error instanceof Error ? error.message : String(error),
        })}`
      );
    },
  };
}

/** Redact password fields; keep email for auth debugging. */
export function authMeta(body: { email?: string; role?: string }) {
  return {
    email: body.email ?? null,
    role: body.role ?? null,
  };
}
