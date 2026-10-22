"use client";
import { useEffect, useState, useRef } from "react";
import { ArrowUpRight, Check, RefreshCw } from "lucide-react";
import { experiences, site } from "../content/site";
import { Photo, WhatsApp } from "./ui";
import { nepalNow } from "../lib/validation";
export function Field({
  label,
  name,
  type = "text",
  required = true,
  children,
  ...props
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
  [key: string]: any;
}) {
  return (
    <label className="field">
      <span>
        {label}
        {required ? " *" : ""}
      </span>
      {children ?? (
        <input
          name={name}
          type={type}
          required={required}
          maxLength={type === "email" ? 200 : 100}
          {...props}
        />
      )}
    </label>
  );
}
function Consent() {
  return (
    <label className="checkbox">
      <input type="checkbox" name="consent" required />
      <span>
        I agree to the{" "}
        <a href="/privacy" target="_blank" rel="noopener noreferrer">
          privacy policy
        </a>{" "}
        and{" "}
        <a href="/booking-terms" target="_blank" rel="noopener noreferrer">
          booking terms
        </a>
        , and may be contacted about this request.
      </span>
    </label>
  );
}
function Honeypot() {
  return (
    <label className="hp" aria-hidden="true">
      Website
      <input name="website" tabIndex={-1} autoComplete="off" />
    </label>
  );
}
async function post(data: unknown) {
  const r = await fetch("/api/requests", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const v: any = await r.json();
  if (!r.ok) throw new Error(v.error ?? "Unable to save request.");
  return v;
}
function Receipt({ receipt }: { receipt: any }) {
  const [url, setUrl] = useState("");
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    setUrl(
      `${window.location.origin}/booking/status?reference=${receipt.reference}#${receipt.token}`,
    );
  }, [receipt]);
  return (
    <div className="receipt" role="status">
      <span className="status-pill">Request received · Pending</span>
      <h2 style={{ marginTop: 20 }}>A little closer to clay.</h2>
      <p style={{ margin: "20px 0" }}>
        Your request has been saved. It is{" "}
        <strong>not a confirmed reservation</strong>. Keep your private tracking
        link to see the studio’s response. The studio will contact you to agree
        on pricing and details.
      </p>
      <a className="status-link" href={url}>
        View your request status ↗
      </a>
      <button
        type="button"
        className="button outline"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
          } catch {
            setCopied(false);
          }
        }}
      >
        {copied ? "Tracking link copied" : "Copy private tracking link"}
        <Check size={16} />
      </button>
      <p style={{ fontSize: 10, marginTop: 20 }}>
        Reference: {receipt.reference}
        <br />
        Treat this link as private. Anyone with it can see your request status.
      </p>
    </div>
  );
}
export function InquiryForm({
  kind = "contact",
  title = "Let’s make something happen.",
}: {
  kind?: "contact" | "business" | "personal" | "firing";
  title?: string;
}) {
  const [startedAt] = useState(Date.now);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const f = new FormData(e.currentTarget);
    try {
      setReceipt(
        await post({
          kind,
          name: f.get("name"),
          email: f.get("email"),
          phone: f.get("phone"),
          message: f.get("message"),
          details: {
            product: f.get("product") || undefined,
            quantity: f.get("quantity") ? Number(f.get("quantity")) : undefined,
            logo: f.get("logo") || undefined,
            deliveryDate: f.get("deliveryDate") || undefined,
          },
          consent: f.get("consent") === "on",
          website: f.get("website"),
          startedAt,
        }),
      );
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="form-shell">
      {receipt ? (
        <Receipt receipt={receipt} />
      ) : (
        <>
          <h2>{title}</h2>
          <form onSubmit={submit}>
            <Honeypot />
            <div className="form-grid">
              <Field
                label="Your name"
                name="name"
                autoComplete="name"
                minLength={2}
              />
              <Field
                label="Email address"
                name="email"
                type="email"
                autoComplete="email"
              />
              <Field
                label="Phone / WhatsApp (with country code)"
                name="phone"
                type="tel"
                autoComplete="tel"
                pattern="[+0-9 ().\-]{7,35}"
              />
              {kind !== "contact" && (
                <Field
                  label={
                    kind === "firing"
                      ? "Piece / clay type"
                      : "What would you like us to make?"
                  }
                  name="product"
                />
              )}
              {kind === "business" && (
                <>
                  <Field
                    label="Quantity"
                    name="quantity"
                    type="number"
                    min={1}
                    max={100000}
                  />
                  <Field
                    label="Logo / branding requirements"
                    name="logo"
                    required={false}
                  />
                </>
              )}
              {(kind === "business" || kind === "personal") && (
                <Field
                  label="Preferred delivery date"
                  name="deliveryDate"
                  type="date"
                  required={false}
                  min={nepalNow().slice(0, 10)}
                />
              )}
              <div className="full">
                <Field
                  label={
                    kind === "firing"
                      ? "Tell us about your pieces and intended use"
                      : "A little about what you have in mind"
                  }
                  name="message"
                >
                  <textarea
                    name="message"
                    required
                    minLength={10}
                    maxLength={3000}
                    placeholder={
                      kind === "contact"
                        ? "How can we help?"
                        : "Share your ideas, dimensions, occasion, or any special requirements…"
                    }
                  />
                </Field>
              </div>
              <div className="full">
                <Consent />
              </div>
            </div>
            {error && (
              <div
                className="notice error"
                role="alert"
                style={{ marginTop: 20 }}
              >
                {error}
              </div>
            )}
            <div className="form-actions">
              <button className="button" disabled={busy}>
                {busy ? "Saving your request…" : "Send your inquiry"}
                <ArrowUpRight size={17} />
              </button>
              <small>We’ll discuss the details before you commit.</small>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
export function BookingForm() {
  const [experience, setExperience] = useState("one-hour");
  const [studio, setStudio] = useState("Boudha");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [participants, setParticipants] = useState(1);
  const [slots, setSlots] = useState<any[]>([]);
  const [slotId, setSlotId] = useState<string | null>(null);
  const [requestDate, setRequestDate] = useState(true);
  const [loading, setLoading] = useState(false);
  const [slotError, setSlotError] = useState("");
  const [step, setStep] = useState(1);
  const [details, setDetails] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    consent: false,
    website: "",
  });
  const [startedAt] = useState(Date.now);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [receipt, setReceipt] = useState<any>(null);
  const formTop = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const id = new URLSearchParams(window.location.search).get("experience");
    if (experiences.some((e) => e.id === id)) setExperience(id!);
    const location = new URLSearchParams(window.location.search).get("studio");
    if (site.studios.includes(location ?? "")) setStudio(location!);
  }, []);
  useEffect(() => {
    setSlotId(null);
    setTime("");
    setSlots([]);
    setSlotError("");
    if (!date) return;
    const controller = new AbortController();
    setLoading(true);
    fetch(
      `/api/availability?date=${date}&studio=${studio}&experience=${experience}`,
      { signal: controller.signal },
    )
      .then(async (r) => {
        const v: any = await r.json();
        if (!r.ok) throw new Error(v.error);
        setSlots(v.slots);
        setRequestDate(v.slots.length === 0);
      })
      .catch((e) => {
        if (e.name !== "AbortError") {
          setSlotError(
            "We couldn’t load availability. You can still request your preferred time.",
          );
          setRequestDate(true);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [date, studio, experience]);
  const selected = experiences.find((e) => e.id === experience)!;
  function go(n: number) {
    setStep(n);
    setError("");
    formTop.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  async function send() {
    setBusy(true);
    setError("");
    try {
      setReceipt(
        await post({
          kind: "booking",
          experience,
          studio,
          date,
          time,
          participants,
          slotId: requestDate ? null : slotId,
          details: {},
          ...details,
          startedAt,
        }),
      );
      go(3);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="booking-layout">
      <div className="form-shell" ref={formTop}>
        {receipt ? (
          <Receipt receipt={receipt} />
        ) : (
          <>
            <div className="booking-steps">
              {["Your experience", "Your details", "Review & request"].map(
                (s, i) => (
                  <span className={step === i + 1 ? "active" : ""} key={s}>
                    <b>{i + 1}</b>
                    {s}
                  </span>
                ),
              )}
            </div>
            {step === 1 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!requestDate && !slotId) {
                    setError("Please select a published time slot.");
                    return;
                  }
                  go(2);
                }}
              >
                <h2>Make a little time.</h2>
                <div className="form-grid">
                  <Field label="Your experience" name="experience">
                    <select
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                    >
                      {experiences.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.formal}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Your studio" name="studio">
                    <select
                      value={studio}
                      onChange={(e) => setStudio(e.target.value)}
                    >
                      {site.studios.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </Field>
                  <Field
                    label="Preferred date"
                    name="date"
                    type="date"
                    value={date}
                    min={nepalNow().slice(0, 10)}
                    max={`${Number(nepalNow().slice(0, 4)) + 1}-12-31`}
                    onChange={(e: any) => setDate(e.target.value)}
                  />
                  <Field
                    label="Number of participants"
                    name="participants"
                    type="number"
                    value={participants}
                    min={1}
                    max={50}
                    onChange={(e: any) =>
                      setParticipants(Number(e.target.value))
                    }
                  />
                  {date && (
                    <div className="full">
                      <span className="field">
                        Session time · Nepal time (UTC+5:45)
                      </span>
                      {loading ? (
                        <p className="notice" role="status">
                          Checking published sessions…
                        </p>
                      ) : (
                        <>
                          {slotError && (
                            <div className="notice">{slotError}</div>
                          )}
                          {slots.length > 0 && (
                            <div
                              className="time-slots"
                              style={{ marginTop: 12 }}
                            >
                              {slots.map((s) => (
                                <button
                                  type="button"
                                  disabled={participants > s.remaining}
                                  className={
                                    slotId === s.id && !requestDate
                                      ? "active"
                                      : ""
                                  }
                                  key={s.id}
                                  onClick={() => {
                                    setSlotId(s.id);
                                    setTime(s.time);
                                    setRequestDate(false);
                                  }}
                                >
                                  {s.time} · {s.remaining} spaces
                                </button>
                              ))}
                            </div>
                          )}
                          <label
                            className="checkbox"
                            style={{ marginBlock: 20 }}
                          >
                            <input
                              type="checkbox"
                              checked={requestDate}
                              onChange={(e) => {
                                setRequestDate(e.target.checked);
                                setSlotId(null);
                                setTime("");
                              }}
                            />
                            <span>
                              {slots.length
                                ? "Request a different time"
                                : "No published sessions for this selection. Request your preferred time."}
                            </span>
                          </label>
                          {requestDate && (
                            <Field
                              label="Preferred time (subject to acceptance)"
                              name="time"
                              type="time"
                              value={time}
                              onChange={(e: any) => setTime(e.target.value)}
                            />
                          )}
                        </>
                      )}
                    </div>
                  )}
                  <div className="full notice" style={{ margin: 0 }}>
                    Pricing is shared personally on{" "}
                    <a
                      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Please share pricing for ${selected.formal}.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp ↗
                    </a>
                    . Your request is pending until the studio accepts it; no
                    payment is taken here.
                  </div>
                </div>
                <div className="form-actions">
                  <button
                    className="button"
                    disabled={
                      loading || !date || !time || (!requestDate && !slotId)
                    }
                  >
                    Your details <ArrowUpRight size={17} />
                  </button>
                </div>
              </form>
            )}
            {step === 2 && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const f = new FormData(e.currentTarget);
                  setDetails({
                    name: String(f.get("name")),
                    email: String(f.get("email")),
                    phone: String(f.get("phone")),
                    message: String(f.get("message")),
                    consent: f.get("consent") === "on",
                    website: String(f.get("website")),
                  });
                  go(3);
                }}
              >
                <h2>Who’s joining us?</h2>
                <Honeypot />
                <div className="form-grid">
                  <Field
                    label="Your name"
                    name="name"
                    defaultValue={details.name}
                    minLength={2}
                    autoComplete="name"
                  />
                  <Field
                    label="Email address"
                    name="email"
                    type="email"
                    defaultValue={details.email}
                    autoComplete="email"
                  />
                  <Field
                    label="Phone / WhatsApp (with country code)"
                    name="phone"
                    type="tel"
                    defaultValue={details.phone}
                    autoComplete="tel"
                    pattern="[+0-9 ().\-]{7,35}"
                  />
                  <div className="full">
                    <Field
                      label="Anything we should know?"
                      name="message"
                      required={false}
                    >
                      <textarea
                        name="message"
                        defaultValue={details.message}
                        maxLength={3000}
                        placeholder="A celebration, children’s ages, accessibility needs, or your travel plans…"
                      />
                    </Field>
                  </div>
                  <div className="full">
                    <Consent />
                  </div>
                </div>
                <div className="form-actions">
                  <button className="button" type="submit">
                    Review request <ArrowUpRight size={17} />
                  </button>
                  <button
                    className="text-link"
                    type="button"
                    style={{ border: 0, background: "none" }}
                    onClick={() => go(1)}
                  >
                    Back
                  </button>
                </div>
              </form>
            )}
            {step === 3 && (
              <>
                <h2>A moment to check.</h2>
                <dl className="review-list">
                  {[
                    ["Experience", selected.formal],
                    ["Studio", `${studio}, Kathmandu`],
                    ["Preferred session", `${date} at ${time} (Nepal time)`],
                    ["Participants", participants],
                    ["Name", details.name],
                    ["Email", details.email],
                    ["Phone", details.phone],
                    ["Price", "Contact us on WhatsApp"],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <dt>{k}</dt>
                      <dd>{v}</dd>
                    </div>
                  ))}
                </dl>
                <div className="notice">
                  This is a booking request. Your place is confirmed only after
                  acceptance by the studio. Save the private tracking link shown
                  after submission.
                </div>
                <div className="form-actions">
                  <button className="button" disabled={busy} onClick={send}>
                    {busy ? "Saving request…" : "Submit booking request"}
                    <ArrowUpRight size={17} />
                  </button>
                  <button
                    className="text-link"
                    style={{ border: 0, background: "none" }}
                    onClick={() => go(2)}
                  >
                    Edit details
                  </button>
                </div>
              </>
            )}
            {error && (
              <div
                className="notice error"
                role="alert"
                style={{ marginTop: 20 }}
              >
                {error}
              </div>
            )}
          </>
        )}
      </div>
      <aside className="booking-sidebar">
        <Photo name={selected.image} alt={selected.formal} />
        <span className="eyebrow">YOUR MOMENT AT THE WHEEL</span>
        <h3>{selected.name}</h3>
        <p>{selected.description}</p>
        <p>
          <strong>{selected.duration}</strong>
          <br />
          Boudha & Thamel · Kathmandu
        </p>
        <WhatsApp
          message={`Hello! I would like to ask about ${selected.formal}.`}
        >
          Ask about pricing
        </WhatsApp>
      </aside>
    </div>
  );
}
export function BookingStatus() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function refresh() {
    setBusy(true);
    setError("");
    try {
      const p = new URLSearchParams(window.location.search);
      p.set("token", window.location.hash.slice(1));
      const r = await fetch(`/api/requests?${p}`);
      const v: any = await r.json();
      if (!r.ok) throw new Error(v.error);
      setData(v.request);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }
  useEffect(() => {
    refresh();
  }, []);
  return (
    <div className="status-card">
      {error ? (
        <div className="notice error" role="alert">
          {error}
        </div>
      ) : data ? (
        <>
          <span className="status-pill">{data.status}</span>
          <h2>
            {data.status === "confirmed"
              ? "See you at the wheel."
              : data.status === "pending"
                ? "Your request is with us."
                : "An update from the studio."}
          </h2>
          <p>
            {data.status === "pending"
              ? "The studio has not yet accepted this request. Please wait for confirmation before traveling."
              : data.status === "confirmed"
                ? "The studio has accepted your reservation. Please contact us to finalize pricing and any finishing arrangements."
                : "Please contact the studio if you have questions about this update."}
          </p>
          <dl className="review-list">
            {[
              ["Request", data.kind],
              [
                "Experience",
                experiences.find((e) => e.id === data.experience)?.formal,
              ],
              ["Studio", data.studio],
              ["Date", data.date],
              ["Time", data.time ? `${data.time} · Nepal time` : null],
              ["Participants", data.participants],
            ]
              .filter(([, v]) => v)
              .map(([k, v]) => (
                <div key={k}>
                  <dt>{k}</dt>
                  <dd>{v}</dd>
                </div>
              ))}
          </dl>
          {data.staffNote && (
            <div className="notice">
              <strong>From the studio</strong>
              <p>{data.staffNote}</p>
            </div>
          )}
          <p style={{ fontSize: 10, overflowWrap: "anywhere" }}>
            Reference: {data.id}
          </p>
        </>
      ) : (
        <p role="status">Loading your request…</p>
      )}
      <div className="form-actions">
        <button className="button outline" onClick={refresh} disabled={busy}>
          {busy ? "Checking…" : "Refresh status"}
          <RefreshCw size={15} />
        </button>
        <WhatsApp>Contact the studio</WhatsApp>
      </div>
    </div>
  );
}
