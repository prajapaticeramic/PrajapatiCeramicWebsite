import { z } from "zod";
import { experiences } from "../content/site";
export function nepalNow() {
  const p = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());
  const get = (t: string) => p.find((x) => x.type === t)!.value;
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}
export const dateSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine(
    (x) =>
      !isNaN(Date.parse(x)) && new Date(x).toISOString().slice(0, 10) === x,
    "Enter a valid date.",
  );
export const timeSchema = z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/);
export const experienceSchema = z
  .string()
  .refine((x) => experiences.some((e) => e.id === x), "Select an experience.");
export const requestSchema = z
  .object({
    kind: z.enum(["booking", "contact", "business", "personal", "firing"]),
    name: z.string().trim().min(2).max(100),
    email: z.string().trim().email().max(200),
    phone: z
      .string()
      .trim()
      .min(7)
      .max(35)
      .regex(/^[+\d\s().-]+$/),
    message: z.string().trim().max(3000).default(""),
    experience: experienceSchema.optional(),
    studio: z.enum(["Boudha", "Thamel"]).optional(),
    date: dateSchema.optional(),
    time: timeSchema.optional(),
    participants: z.number().int().min(1).max(50).optional(),
    slotId: z.string().uuid().nullable().optional(),
    details: z
      .object({
        product: z.string().trim().max(120).optional(),
        quantity: z.number().int().min(1).max(100000).optional(),
        logo: z.string().trim().max(500).optional(),
        deliveryDate: dateSchema.optional(),
      })
      .default({}),
    consent: z.literal(true),
    website: z.string().max(0),
    startedAt: z
      .number()
      .refine(
        (x) => Date.now() - x >= 1500 && Date.now() - x < 86400000,
        "Please reload the form and try again.",
      ),
  })
  .superRefine((v, ctx) => {
    if (v.kind === "booking") {
      if (!v.experience || !v.studio || !v.date || !v.time || !v.participants)
        ctx.addIssue({
          code: "custom",
          message: "Complete all session details.",
        });
      if (v.date && v.time && `${v.date}T${v.time}` <= nepalNow())
        ctx.addIssue({
          code: "custom",
          message: "Choose a future date and time in Nepal.",
        });
    } else if (v.message.length < 10)
      ctx.addIssue({
        code: "custom",
        message: "Please tell us a little more (at least 10 characters).",
      });
    if (v.kind === "business" && (!v.details.product || !v.details.quantity))
      ctx.addIssue({
        code: "custom",
        message: "Please specify product and quantity.",
      });
  });
export const slotSchema = z
  .object({
    experience: experienceSchema,
    studio: z.enum(["Boudha", "Thamel"]),
    date: dateSchema,
    time: timeSchema,
    endTime: timeSchema,
    capacity: z.number().int().min(1).max(50),
  })
  .refine((v) => `${v.date}T${v.time}` > nepalNow(), "Choose a future session.")
  .refine((v) => v.endTime > v.time, "End time must be after start time.")
  .refine((v) => {
    const m = (t: string) => +t.slice(0, 2) * 60 + +t.slice(3);
    const duration =
      experiences.find((e) => e.id === v.experience)?.minutes ?? 60;
    return m(v.endTime) - m(v.time) >= duration;
  }, "The session is too short for this experience.");
