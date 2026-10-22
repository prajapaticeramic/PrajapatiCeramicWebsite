import assert from "node:assert/strict";
const base = "http://127.0.0.1:5173";
const auth = await fetch(base + "/signin-with-chatgpt?return_to=/admin", {
  redirect: "manual",
});
const cookies = auth.headers
  .getSetCookie()
  .map((c) => c.split(";")[0])
  .join("; ");
assert(cookies, "local mock sign-in cookie");
const headers = {
  origin: base,
  "content-type": "application/json",
  cookie: cookies,
};
const call = async (path, method, payload, staff = false) => {
  const r = await fetch(base + path, {
    method,
    headers: staff
      ? headers
      : { origin: base, "content-type": "application/json" },
    body: payload ? JSON.stringify(payload) : undefined,
  });
  return { status: r.status, value: await r.json() };
};
const admin = await fetch(base + "/api/admin", {
  headers: { cookie: cookies },
});
assert.equal(admin.status, 200, "authorized mock staff can read");
const session = {
  studio: "Boudha",
  experience: "one-hour",
  date: "2099-02-01",
  time: "11:00",
  endTime: "12:00",
  capacity: 2,
};
const slot = await call("/api/admin", "POST", session, true);
assert.equal(slot.status, 201, JSON.stringify(slot.value));
const payload = {
  kind: "booking",
  name: "LOCAL TEST ONLY",
  email: "local-test@example.invalid",
  phone: "+977 9800000000",
  experience: session.experience,
  studio: session.studio,
  date: session.date,
  time: session.time,
  participants: 2,
  slotId: slot.value.id,
  message: "Local automated verification only.",
  details: {},
  consent: true,
  website: "",
  startedAt: Date.now() - 5000,
};
const first = await call("/api/requests", "POST", payload);
assert.equal(first.status, 201, JSON.stringify(first.value));
const second = await call("/api/requests", "POST", payload);
assert.equal(second.status, 201);
const id = first.value.reference;
const accept = await call(
  "/api/admin",
  "PATCH",
  {
    id,
    action: "confirm",
    slotId: slot.value.id,
    note: "Local test confirmation.",
  },
  true,
);
assert.equal(accept.status, 200, JSON.stringify(accept.value));
const competing = await call(
  "/api/admin",
  "PATCH",
  { id: second.value.reference, action: "confirm", slotId: slot.value.id },
  true,
);
assert.equal(
  competing.status,
  409,
  "capacity guard blocks competing confirmation",
);
const status = await call(
  `/api/requests?reference=${id}&token=${first.value.token}`,
  "GET",
);
assert.equal(status.value.request.status, "confirmed");
const wrongToken = await call(
  `/api/requests?reference=${id}&token=${"0".repeat(72)}`,
  "GET",
);
assert.equal(wrongToken.status, 404);
const cancel = await call(
  "/api/admin",
  "PATCH",
  { id, action: "cancel" },
  true,
);
assert.equal(cancel.status, 200);
const retry = await call(
  "/api/admin",
  "PATCH",
  { id: second.value.reference, action: "confirm", slotId: slot.value.id },
  true,
);
assert.equal(retry.status, 200, "cancellation releases capacity");
await call(
  "/api/admin",
  "PATCH",
  { id: second.value.reference, action: "cancel" },
  true,
);
await call(
  "/api/admin",
  "PATCH",
  { id: slot.value.id, action: "close-slot" },
  true,
);
const inquiry = await call("/api/requests", "POST", {
  kind: "business",
  name: "LOCAL TEST ONLY",
  email: "local-test@example.invalid",
  phone: "+977 9800000000",
  message: "Local custom quote form verification.",
  details: {
    product: "Mugs",
    quantity: 25,
    logo: "One color",
    deliveryDate: "2099-03-01",
  },
  consent: true,
  website: "",
  startedAt: Date.now() - 5000,
});
assert.equal(inquiry.status, 201);
await call(
  "/api/admin",
  "PATCH",
  { id: inquiry.value.reference, action: "resolve" },
  true,
);
console.log(
  "PASS: staff authentication, slot publishing, persistent requests, confirmation, capacity conflict, private status, wrong token, cancellation, freed capacity, and custom inquiry. Local test records only.",
);
