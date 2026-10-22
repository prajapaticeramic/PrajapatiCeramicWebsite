import {
  db,
  json,
  body,
  hash,
  rateLimit,
  errorResponse,
} from "../../../lib/server";
import { requestSchema, nepalNow } from "../../../lib/validation";
export async function POST(req: Request) {
  try {
    const input = await body(req);
    if (!(await rateLimit(req, "submit")))
      return json(
        {
          error:
            "Too many requests. Please try again in 15 minutes or contact us on WhatsApp.",
        },
        429,
      );
    const v = requestSchema.parse(input);
    if (v.slotId) {
      const slot = await db()
        .prepare(
          "SELECT s.*,s.capacity-COALESCE((SELECT SUM(participants) FROM requests WHERE slot_id=s.id AND status='confirmed'),0) AS remaining FROM slots s WHERE id=?",
        )
        .bind(v.slotId)
        .first<any>();
      if (
        !slot ||
        !slot.active ||
        slot.date !== v.date ||
        slot.time !== v.time ||
        slot.studio !== v.studio ||
        slot.experience !== v.experience ||
        slot.remaining < (v.participants ?? 1) ||
        `${slot.date}T${slot.time}` <= nepalNow()
      )
        return json(
          {
            error:
              "That session is no longer available. Please select another time.",
          },
          409,
        );
    }
    const id = crypto.randomUUID();
    const token = crypto.randomUUID() + crypto.randomUUID();
    const now = Date.now();
    await db()
      .prepare(
        "INSERT INTO requests (id,token_hash,kind,name,email,phone,experience,studio,date,time,participants,slot_id,message,details,status,staff_note,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)",
      )
      .bind(
        id,
        await hash(token),
        v.kind,
        v.name,
        v.email,
        v.phone,
        v.experience ?? null,
        v.studio ?? null,
        v.date ?? null,
        v.time ?? null,
        v.participants ?? null,
        v.slotId ?? null,
        v.message,
        JSON.stringify(v.details),
        "pending",
        "",
        now,
        now,
      )
      .run();
    return json({ reference: id, token, status: "pending" }, 201);
  } catch (e) {
    return errorResponse(e);
  }
}
export async function GET(req: Request) {
  try {
    if (!(await rateLimit(req, "status", 50)))
      return json({ error: "Please try again later." }, 429);
    const p = new URL(req.url).searchParams;
    const id = p.get("reference") ?? "";
    const token = p.get("token") ?? "";
    if (id.length !== 36 || token.length !== 72)
      return json({ error: "Invalid private tracking link." }, 404);
    const r = await db()
      .prepare(
        "SELECT id,kind,status,experience,studio,date,time,participants,staff_note AS staffNote,updated_at AS updatedAt FROM requests WHERE id=? AND token_hash=?",
      )
      .bind(id, await hash(token))
      .first();
    return r
      ? json({ request: r })
      : json(
          {
            error:
              "Request not found. Please check your private tracking link.",
          },
          404,
        );
  } catch (e) {
    return errorResponse(e);
  }
}
