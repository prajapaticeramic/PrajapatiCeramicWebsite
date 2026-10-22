import assert from "node:assert/strict";
const base = "http://127.0.0.1:5173";
const routes = [
  "/",
  "/about",
  "/experiences",
  "/custom-ceramics",
  "/glazing-firing",
  "/gallery",
  "/blog",
  "/contact",
  "/booking",
  "/privacy",
  "/booking-terms",
  "/credits",
  "/blog/your-first-pottery-class",
  "/blog/from-clay-to-ceramic",
  "/blog/a-creative-pause-in-kathmandu",
  "/robots.txt",
  "/sitemap.xml",
];
for (const path of routes) {
  const r = await fetch(base + path);
  assert.equal(r.status, 200, path);
  const html = await r.text();
  assert(!/Internal Server Error/.test(html), path);
  if (!path.endsWith(".txt") && !path.endsWith(".xml"))
    assert(html.includes("<title>"), path);
}
assert.equal((await fetch(base + "/missing-page")).status, 404);
assert.equal((await fetch(base + "/api/admin")).status, 403);
const wrongOrigin = await fetch(base + "/api/requests", {
  method: "POST",
  headers: {
    origin: "https://other.example",
    "content-type": "application/json",
  },
  body: "{}",
});
assert([400, 403].includes(wrongOrigin.status));
const invalid = await fetch(base + "/api/requests", {
  method: "POST",
  headers: { origin: base, "content-type": "application/json" },
  body: JSON.stringify({ kind: "booking", name: "X" }),
});
assert.equal(invalid.status, 400);
const avail = await fetch(
  base + "/api/availability?date=2026-10-26&studio=Thamel&experience=two-hour",
);
assert.equal(avail.status, 200);
assert.deepEqual((await avail.json()).slots, []);
console.log(
  `PASS: ${routes.length} pages, 404, staff protection, origin rejection, validation, and empty real availability.`,
);
