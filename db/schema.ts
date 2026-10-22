import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";
export const slots = sqliteTable(
  "slots",
  {
    id: text("id").primaryKey(),
    experience: text("experience").notNull(),
    studio: text("studio").notNull(),
    date: text("date").notNull(),
    time: text("time").notNull(),
    endTime: text("end_time").notNull(),
    capacity: integer("capacity").notNull(),
    active: integer("active").notNull().default(1),
  },
  (t) => [index("slots_lookup").on(t.studio, t.date)],
);
export const requests = sqliteTable(
  "requests",
  {
    id: text("id").primaryKey(),
    tokenHash: text("token_hash").notNull(),
    kind: text("kind").notNull(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    phone: text("phone").notNull(),
    experience: text("experience"),
    studio: text("studio"),
    date: text("date"),
    time: text("time"),
    participants: integer("participants"),
    slotId: text("slot_id").references(() => slots.id),
    message: text("message").notNull(),
    details: text("details").notNull(),
    status: text("status").notNull().default("pending"),
    staffNote: text("staff_note").notNull().default(""),
    createdAt: integer("created_at").notNull(),
    updatedAt: integer("updated_at").notNull(),
  },
  (t) => [
    index("requests_created").on(t.createdAt),
    index("requests_slot").on(t.slotId, t.status),
  ],
);
export const rateLimits = sqliteTable("rate_limits", {
  key: text("key").primaryKey(),
  count: integer("count").notNull(),
  expires: integer("expires").notNull(),
});
