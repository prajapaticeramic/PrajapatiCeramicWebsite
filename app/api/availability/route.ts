import { db, json, errorResponse } from "../../../lib/server";
import {
  dateSchema,
  experienceSchema,
  nepalNow,
} from "../../../lib/validation";
import { z } from "zod";
export async function GET(req: Request) {
  try {
    const p = new URL(req.url).searchParams;
    const date = dateSchema.parse(p.get("date"));
    const studio = z.enum(["Boudha", "Thamel"]).parse(p.get("studio"));
    const experience = experienceSchema.parse(p.get("experience"));
    const r = await db()
      .prepare(
        "SELECT s.id,s.time,s.end_time AS endTime,s.capacity-COALESCE(SUM(CASE WHEN r.status='confirmed' THEN r.participants ELSE 0 END),0) AS remaining FROM slots s LEFT JOIN requests r ON r.slot_id=s.id WHERE s.active=1 AND s.date=? AND s.studio=? AND s.experience=? AND s.date||'T'||s.time>? GROUP BY s.id HAVING remaining>0 ORDER BY s.time",
      )
      .bind(date, studio, experience, nepalNow())
      .all();
    return json({ slots: r.results });
  } catch (e) {
    return errorResponse(e);
  }
}
