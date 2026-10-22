"use client";
import { useEffect, useState } from "react";
import { experiences, site } from "../content/site";
import { Field } from "./forms";
import { nepalNow } from "../lib/validation";
export function Dashboard() {
  const [data, setData] = useState<any>({ requests: [], slots: [] });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [filter, setFilter] = useState("pending");
  async function load() {
    const r = await fetch("/api/admin");
    const v: any = await r.json();
    if (!r.ok) throw new Error(v.error);
    setData(v);
  }
  useEffect(() => {
    load().catch((e) => setError(e.message));
  }, []);
  async function mutate(method: string, payload: any) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const r = await fetch("/api/admin", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const v: any = await r.json();
      if (!r.ok) throw new Error(v.error);
      setMessage(v.notification ?? "Session availability updated.");
      await load();
      return true;
    } catch (e) {
      setError((e as Error).message);
      return false;
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="admin-layout">
      {error && (
        <div className="notice error" role="alert">
          {error}
        </div>
      )}
      {message && (
        <div className="notice success" role="status">
          {message}
        </div>
      )}
      <div className="notice">
        This dashboard shows the most recent 300 requests and 300 upcoming
        sessions. Pending requests do not hold seats. Accept only after agreeing
        on pricing and session details, then contact the customer to share
        confirmation. Their private tracking page updates immediately.
      </div>
      <div className="admin-grid">
        <div>
          <section className="admin-panel">
            <h2>Publish a session</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const f = new FormData(form);
                if (
                  await mutate("POST", {
                    experience: f.get("experience"),
                    studio: f.get("studio"),
                    date: f.get("date"),
                    time: f.get("time"),
                    endTime: f.get("endTime"),
                    capacity: Number(f.get("capacity")),
                  })
                )
                  form.reset();
              }}
            >
              <div className="form-grid">
                <Field label="Experience" name="experience">
                  <select name="experience">
                    {experiences.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.formal}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Studio" name="studio">
                  <select name="studio">
                    {site.studios.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </Field>
                <Field
                  label="Date"
                  name="date"
                  type="date"
                  min={nepalNow().slice(0, 10)}
                />
                <Field label="Start (Nepal time)" name="time" type="time" />
                <Field label="End (Nepal time)" name="endTime" type="time" />
                <Field
                  label="Capacity"
                  name="capacity"
                  type="number"
                  min={1}
                  max={50}
                />
              </div>
              <button
                className="button"
                disabled={busy}
                style={{ marginTop: 25 }}
              >
                Publish session ↗
              </button>
            </form>
          </section>
          <section className="admin-panel">
            <h2>Upcoming sessions</h2>
            {!data.slots.length && (
              <p className="empty-state">
                No sessions published. Add your actual availability above.
              </p>
            )}
            {data.slots.map((s: any) => (
              <div className="request-card" key={s.id}>
                <span className="status-pill">
                  {s.active ? "Open for requests" : "Closed for requests"}
                </span>
                <h3>
                  {s.studio} · {s.date}
                </h3>
                <p>
                  {s.time}–{s.end_time} ·{" "}
                  {experiences.find((e) => e.id === s.experience)?.formal}
                  <br />
                  {s.booked} confirmed / {s.capacity} capacity
                </p>
                <button
                  className="button outline"
                  disabled={busy}
                  onClick={() =>
                    mutate("PATCH", {
                      id: s.id,
                      action: s.active ? "close-slot" : "open-slot",
                    })
                  }
                >
                  {s.active ? "Close to new requests" : "Reopen session"}
                </button>
              </div>
            ))}
          </section>
        </div>
        <section className="admin-panel">
          <h2>Studio requests</h2>
          <div className="filters">
            {["pending", "confirmed", "all"].map((s) => (
              <button
                key={s}
                className={filter === s ? "active" : ""}
                onClick={() => setFilter(s)}
              >
                {s[0].toUpperCase() + s.slice(1)}
              </button>
            ))}
            <button
              disabled={busy}
              onClick={() => load().catch((e) => setError(e.message))}
            >
              Refresh
            </button>
          </div>
          {data.requests.filter(
            (r: any) => filter === "all" || r.status === filter,
          ).length === 0 && (
            <p className="empty-state">
              No {filter === "all" ? "" : filter} requests yet.
            </p>
          )}
          {data.requests
            .filter((r: any) => filter === "all" || r.status === filter)
            .map((r: any) => (
              <RequestCard
                r={r}
                slots={data.slots}
                mutate={mutate}
                busy={busy}
                key={r.id}
              />
            ))}
        </section>
      </div>
    </div>
  );
}
function RequestCard({
  r,
  slots,
  mutate,
  busy,
}: {
  r: any;
  slots: any[];
  mutate: any;
  busy: boolean;
}) {
  const [note, setNote] = useState(r.staffNote);
  const [slotId, setSlotId] = useState(r.slotId ?? "");
  const matching = slots.filter(
    (s) =>
      s.active &&
      s.studio === r.studio &&
      s.experience === r.experience &&
      s.capacity - s.booked >= r.participants,
  );
  let details: any = {};
  try {
    details = JSON.parse(r.details);
  } catch {}
  return (
    <article className="request-card">
      <span className="status-pill">
        {r.kind} · {r.status}
      </span>
      <h3>{r.name}</h3>
      <a href={`mailto:${r.email}`}>{r.email}</a>
      <br />
      <a href={`tel:${r.phone}`}>{r.phone}</a>
      {r.kind === "booking" && (
        <p>
          {experiences.find((e) => e.id === r.experience)?.formal}
          <br />
          {r.studio} · {r.date} at {r.time}
          <br />
          {r.participants} participant(s)
        </p>
      )}
      {r.message && <p style={{ whiteSpace: "pre-wrap" }}>{r.message}</p>}
      {Object.entries(details).map(([k, v]) => (
        <p key={k}>
          <strong>{k}:</strong> {String(v)}
        </p>
      ))}
      {r.status === "pending" && r.kind === "booking" && (
        <Field label="Confirm into this session" name={`slot-${r.id}`}>
          <select value={slotId} onChange={(e) => setSlotId(e.target.value)}>
            <option value="">Choose an active matching session</option>
            {matching.map((s) => (
              <option key={s.id} value={s.id}>
                {s.date} · {s.time} · {s.capacity - s.booked} spaces
              </option>
            ))}
          </select>
        </Field>
      )}
      {(r.status === "pending" || r.status === "confirmed") && (
        <Field
          label="Message shown to the customer"
          name={`note-${r.id}`}
          required={false}
        >
          <textarea
            value={note}
            maxLength={1000}
            onChange={(e) => setNote(e.target.value)}
          />
        </Field>
      )}
      {r.status === "pending" && (
        <>
          {r.kind === "booking" ? (
            <button
              className="button"
              disabled={busy || !matching.some((s) => s.id === slotId)}
              onClick={() =>
                mutate("PATCH", { id: r.id, action: "confirm", slotId, note })
              }
            >
              Accept reservation
            </button>
          ) : (
            <button
              className="button"
              disabled={busy}
              onClick={() =>
                mutate("PATCH", { id: r.id, action: "resolve", note })
              }
            >
              Mark inquiry resolved
            </button>
          )}
          <button
            className="button outline"
            disabled={busy}
            onClick={() =>
              mutate("PATCH", { id: r.id, action: "decline", note })
            }
          >
            Decline
          </button>
        </>
      )}
      {r.status === "confirmed" && (
        <button
          className="button outline"
          disabled={busy}
          onClick={() => mutate("PATCH", { id: r.id, action: "cancel", note })}
        >
          Cancel reservation
        </button>
      )}
      <p style={{ fontSize: 9 }}>Reference: {r.id}</p>
    </article>
  );
}
