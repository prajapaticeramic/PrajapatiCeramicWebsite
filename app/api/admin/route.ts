import { db, json, body, isAdmin, errorResponse } from "../../../lib/server";
import { slotSchema, nepalNow } from "../../../lib/validation";
import { z } from "zod";
export async function GET(req: Request) {
  if (!isAdmin(req)) return json({ error: "Staff sign-in required." }, 403);
  try {
    const [r, s] = await Promise.all([
      db()
        .prepare(
          "SELECT id,kind,name,email,phone,experience,studio,date,time,participants,slot_id AS slotId,message,details,status,staff_note AS staffNote,created_at AS createdAt FROM requests ORDER BY created_at DESC LIMIT 300",
        )
        .all(),
      db()
        .prepare(
          "SELECT s.*,COALESCE((SELECT SUM(participants) FROM requests WHERE slot_id=s.id AND status='confirmed'),0) AS booked FROM slots s WHERE date||'T'||time>? ORDER BY date,time LIMIT 300",
        )
        .bind(nepalNow())
        .all(),
    ]);
    await db()
      .prepare("DELETE FROM rate_limits WHERE expires<?")
      .bind(Date.now() - 86400000)
      .run();
    return json({ requests: r.results, slots: s.results });
  } catch (e) {
    return errorResponse(e);
  }
}
export async function POST(req: Request) {
  if (!isAdmin(req)) return json({ error: "Staff sign-in required." }, 403);
  try {
    const v = slotSchema.parse(await body(req));
    const id = crypto.randomUUID();
    await db()
      .prepare(
        "INSERT INTO slots (id,experience,studio,date,time,end_time,capacity,active) VALUES (?,?,?,?,?,?,?,1)",
      )
      .bind(id, v.experience, v.studio, v.date, v.time, v.endTime, v.capacity)
      .run();
    return json({ id }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
export async function PATCH(req: Request) {
  if (!isAdmin(req)) return json({ error: "Staff sign-in required." }, 403);
  try {
    const v = z
      .object({
        id: z.string().uuid(),
        action: z.enum([
          "confirm",
          "decline",
          "cancel",
          "resolve",
          "close-slot",
          "open-slot",
        ]),
        slotId: z.string().uuid().optional(),
        note: z.string().trim().max(1000).default(""),
      })
      .parse(await body(req));
    if (v.action === "close-slot" || v.action === "open-slot") {
      const result = await db()
        .prepare("UPDATE slots SET active=? WHERE id=?")
        .bind(v.action === "open-slot" ? 1 : 0, v.id)
        .run();
      return result.meta.changes
        ? json({ ok: true })
        : json({ error: "Session not found." }, 404);
    }
    const current = await db()
      .prepare("SELECT * FROM requests WHERE id=?")
      .bind(v.id)
      .first<any>();
    if (!current) return json({ error: "Request not found." }, 404);
    if (v.action === "confirm") {
      if (current.kind !== "booking" || current.status !== "pending")
        return json(
          { error: "Only pending booking requests can be accepted." },
          409,
        );
      const slot = await db()
        .prepare(
          "SELECT * FROM slots WHERE id=? AND active=1 AND date||'T'||time>?",
        )
        .bind(v.slotId ?? current.slot_id, nepalNow())
        .first<any>();
      if (
        !slot ||
        slot.studio !== current.studio ||
        slot.experience !== current.experience
      )
        return json(
          {
            error:
              "Select a future active session matching this experience and studio.",
          },
          400,
        );
      const result = await db()
        .prepare(
          "UPDATE requests SET status='confirmed',slot_id=?,date=?,time=?,staff_note=?,updated_at=? WHERE id=? AND status='pending'",
        )
        .bind(slot.id, slot.date, slot.time, v.note, Date.now(), v.id)
        .run();
      if (!result.meta.changes)
        return json(
          { error: "The request has already changed. Refresh the dashboard." },
          409,
        );
    } else {
      const status = {
        decline: "declined",
        cancel: "cancelled",
        resolve: "resolved",
      }[v.action];
      const allowed =
        v.action === "resolve"
          ? current.kind !== "booking" && current.status === "pending"
          : v.action === "decline"
            ? current.status === "pending"
            : current.status === "confirmed";
      if (!allowed)
        return json({ error: "This status change is not allowed." }, 409);
      await db()
        .prepare(
          "UPDATE requests SET status=?,staff_note=?,updated_at=? WHERE id=? AND status=?",
        )
        .bind(status, v.note, Date.now(), v.id, current.status)
        .run();
    }
    return json({
      ok: true,
      notification:
        "Status updated on the customer’s private tracking page. Contact the customer by email or phone to share the update.",
    });
  } catch (e) {
    return errorResponse(e);
  }
}
