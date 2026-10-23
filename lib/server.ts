import { env } from "cloudflare:workers";
export function db() {
  if (!env.DB) throw new Error("Database unavailable");
  return env.DB;
}
export const json = (data: unknown, status = 200) =>
  Response.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store",
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    },
  });
export function sameOrigin(req: Request) {
  const origin = req.headers.get("origin");
  const allowed = [new URL(req.url).origin, (env as any).SITE_URL, "https://prajapaticeramic.vercel.app"].filter(
    Boolean,
  );
  return Boolean(origin && allowed.includes(origin));
}
export async function body(req: Request) {
  if (!sameOrigin(req)) throw new Error("Origin not allowed");
  if (!req.headers.get("content-type")?.includes("application/json"))
    throw new Error("Expected JSON");
  const text = await req.text();
  if (text.length > 16000) throw new Error("Request too large");
  return JSON.parse(text);
}
export async function hash(s: string) {
  return [
    ...new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s)),
    ),
  ]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("");
}
export function isAdmin(req: Request) {
  const allowed = String((env as any).ADMIN_EMAILS ?? "")
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
  return Boolean(
    req.headers.get("oai-authenticated-user-id") &&
      allowed.includes(
        (req.headers.get("oai-authenticated-user-email") ?? "").toLowerCase(),
      ),
  );
}
export async function rateLimit(req: Request, scope: string, limit = 8) {
  const window = Math.floor(Date.now() / 900000);
  const key = await hash(
    `${scope}:${req.headers.get("cf-connecting-ip") ?? "local"}:${window}`,
  );
  const row = await db()
    .prepare(
      "INSERT INTO rate_limits (key,count,expires) VALUES (?,1,?) ON CONFLICT(key) DO UPDATE SET count=count+1 RETURNING count",
    )
    .bind(key, Date.now() + 900000)
    .first<{ count: number }>();
  return !!row && row.count <= limit;
}
export function errorResponse(e: unknown) {
  if ((e as any)?.issues)
    return json(
      { error: (e as any).issues.map((i: any) => i.message).join(" ") },
      400,
    );
  const message = e instanceof Error ? e.message : "";
  if (/Origin|JSON|large/.test(message))
    return json({ error: "Invalid request." }, 400);
  if (/capacity|mismatch|overlap|inactive|confirmed/.test(message))
    return json(
      {
        error:
          "This change conflicts with a reservation or session capacity. Refresh and check the selected session.",
      },
      409,
    );
  console.error(
    "Request processing failed",
    message.replace(/['"].*?['"]/g, "[redacted]").slice(0, 150),
  );
  return json(
    {
      error:
        "We couldn’t save this right now. Please try again or contact us on WhatsApp.",
    },
    503,
  );
}
